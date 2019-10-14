/* globals _,Graph,GraphAnalyzer,GraphTransformer,Hash */
/* exported GraphSerializer */

var GraphSerializer = {

	toDot : function( g ){
		var n = g.getName(), bb = g.getBoundingBox()
		return (g.getType()+" "+(n == null?"":n)+"{\n" + 
			(bb == null ? "" : "bb=\""+bb.join(",")+"\"\n") +
			this.toDotVertexStatements(g)+
			this.toDotEdgeStatements(g)+"\n}\n")
	},
	
	toDotVertexStatements : function( g ){
		var expandLabel = function( v, g ){
			var properties = [], property_string = ""
			g.isSource(v) && properties.push("exposure")
			g.isTarget(v) && properties.push("outcome")
			g.isAdjustedNode(v) && properties.push("adjusted")
			g.isLatentNode(v) && properties.push("latent")
			g.isSelectionNode(v) && properties.push("selected")
			if( typeof v.layout_pos_x!== "undefined"  ){
				properties.push( "pos=\"" + 
					v.layout_pos_x.toFixed(3) + "," + 
					v.layout_pos_y.toFixed(3) + "\"" )
			}
			if( v.label ){
				properties.push( "label=\""+v.label.replace(/"/g, "\\\"")+"\"" )
			}
			if( v.attributes ){
				var vk = Object.keys( v.attributes )
				for( var i = 0 ; i < vk.length ; i ++ ){
					if( v.attributes[vk[i]] ){
						properties.push(vk[i]+"=\""+(""+v.attributes[vk[i]]).replace(/"/g, "\\\"")+"\"")
					} else {
						properties.push(vk[i])
					}
				}
			}
			if( properties.length > 0 ){
				return GraphSerializer.dotQuoteVid( v.id ) +
					" ["+properties.join(",")+"]"
			} else {
				if( v.getAdjacentNodes().length == 0 ){
					return GraphSerializer.dotQuoteVid( v.id )
				} else {
					return ""
				}
			}
		}
		var r = ""
		var ra = []
		_.each( 
		g.vertices.values(), function( v ){
			var vl = expandLabel( v, g )
			if( vl ){
				ra.push(vl+"\n")
			}
		} )
		ra.sort()
		return r + ra.join("")
	},
	
	dotBarewordRe : new RegExp( "^[0-9a-zA-Z_.]+$" ),
	
	quoteVid : function ( vid ){
		return "\"" + vid.replace(/"/g, "\\\"") + "\""
	},
	
	dotQuoteVid : function( vid ){
		if( !vid.match( this.dotBarewordRe ) ) return this.quoteVid( vid )
		return vid
	},
	
	toDotEdgeStatements : function( g ){
		var edgestat = [], es, eop, 
			barewordre = 
		_.each(g.edges,function(e){
			es = e.toString( barewordre )
			eop = []
			if( e.layout_pos_x ){
				eop.push("pos=\"" + 
					e.layout_pos_x.toFixed(3) + "," + 
					e.layout_pos_y.toFixed(3) + "\"")
			}
			if( e.id ){
				eop.push("label=\"" + encodeURIComponent( e.id ) + "\"")
			}
			if( e.attributes ){
				var vk = Object.keys( e.attributes )
				for( var i = 0 ; i < vk.length ; i ++ ){
					if( e.attributes[vk[i]] ){
						eop.push(vk[i]+"=\""+(""+e.attributes[vk[i]]).replace(/"/g, "\\\"")+"\"")
					} else {
						eop.push(vk[i])
					}
				}
			}
			if( eop.length > 0 ){
				es += " ["+eop.join(",")+"]"
			}
			edgestat.push( es )
		})
		edgestat.sort()
		return edgestat.join("\n")
	},

	/** Assumes that g contains only a single path that starts at a source 
	    and converts it to DOT syntax.
	 **/
	pathToDot : function( g ){
		var vids = g.vertices.keys(), v, i, j,
			visited, vn, r = "", arrows
		if( vids.length == 0 ){
			return ""
		}
		if( g.getSources().length != 1 ){
			return ""
		}
		visited = {}
		v = g.getSources()[0]
		visited[v.id] = 1
		r = this.dotQuoteVid(v.id)
		arrows = ["->","<-","--","<->"]
		while( v ){
			vn = {
				"->" : v.getChildren(),
				"<-" : v.getParents(),
				"--" : v.getNeighbours(),
				"<->" : v.getSpouses()
			}
			out:
			for( j = 0 ; j < 4 ; j ++ ){
				for( i = 0 ; i < vn[arrows[j]].length ; i ++ ){
					if( !visited[vn[arrows[j]][i].id] ){
						break out
					}
				}
			}
			if( j==4 ){
				v = null
			} else { 
				v = vn[arrows[j]][i]
				r += " "+arrows[j]+" "+this.dotQuoteVid(v.id)
				visited[v.id]=1
			}
		}
		return r
	},

	toLavaan : function( g ){
		var ee = g.getEdges(), edgetype, 
			r = "# Please set lavaan's fixed.x appopriately!\n"
		var v_nonzero_degree = {}
		_.each( ee, function(e){
			edgetype = ""
			var reverse = true
			if( e.directed == Graph.Edgetype.Directed ){
				if( g.isLatentNode( e.v1 ) ){
					if( g.isLatentNode( e.v2 ) ){
						edgetype = "~"
					} else {
						edgetype = "=~"
						reverse = false
					}
				} else {
					edgetype = "~"
				}
			} else if( e.directed == Graph.Edgetype.Bidirected ){
				edgetype = " ~~ "
			} else {
				throw( "Unsupported edge for lavaan conversion : " + e.toString() )
			}
			if( reverse ){
				r += e.v2.id + edgetype + e.v1.id+ "\n"
			} else {
				r += e.v1.id + edgetype + e.v2.id+ "\n"
			}
			v_nonzero_degree[e.v1.id] = 1
			v_nonzero_degree[e.v2.id] = 1
		} )
		// include vertices without adjacent edges as well
		_.each( _.difference( _.pluck(g.getVertices(),"id"), _.keys( v_nonzero_degree ) ),
			function(vid){
				r += vid+" ~~ "+vid+"\n"
			}
		)
		return r
	},

	toTikz : function( g, precision ){
		if( precision == null ){ precision = 5 }
		var vv = g.getVertices(), i, r = "", ee = g.getEdges(), v_index = [], edgetype,
			p1x, p1y, p2x, p2y
		for( i = 0 ; i < vv.length ; i ++ ){
			r += "\\node (v"+i+") at ("+vv[i].layout_pos_x.toPrecision(precision)+
				","+(-vv[i].layout_pos_y).toPrecision(precision)+") {"+vv[i].id+"};\n"
			v_index[vv[i].id] = i
		}
		for( i = 0 ; i < ee.length ; i ++ ){
			edgetype = ""
			if( ee[i].directed == Graph.Edgetype.Directed ){
				edgetype = "[->] "
			}
			if( ee[i].directed == Graph.Edgetype.Bidirected ){
				edgetype = "[->,<-] "
			}
			if( ee[i].layout_pos_x ){
				p1x = (1/3*ee[i].v1.layout_pos_x + 2/3*ee[i].layout_pos_x).
					toPrecision(precision)
				p1y = -(1/3*ee[i].v1.layout_pos_y + 2/3*ee[i].layout_pos_y).
					toPrecision(precision)
				p2x = (1/3*ee[i].v2.layout_pos_x + 2/3*ee[i].layout_pos_x).
					toPrecision(precision)
				p2y = -(1/3*ee[i].v2.layout_pos_y + 2/3*ee[i].layout_pos_y).
					toPrecision(precision)
				r += "\\draw "+edgetype+"(v"+v_index[ee[i].v1.id]+
						") .. controls ("+p1x+","+p1y+
						") and ("+p2x+","+p2y+") .. (v"+v_index[ee[i].v2.id]+");\n"
			} else {
				r += "\\draw "+edgetype+"(v"+v_index[ee[i].v1.id]+") edge (v"+v_index[ee[i].v2.id]+");\n"
			}
		}
		return r
	},

	toBnlearn : function( g ){
		var vv = g.getVertices(), r = ""
		_.each( vv, function(v){
			r += "["+v.id
			var rpar = _.pluck(v.getParents(),"id").join(":")
			if( rpar ){
				r += "|"+rpar
			}
			r += "]"
		} )
		return r
	},
	
	mathematicaSyntax : function( g, use_ids_as_labels ){
		var pv = this.polynomialVariety( g, use_ids_as_labels )
		return "GroebnerBasis[{"+pv[0]+"},\n{"+pv[2].join(",")+"},\n{"+pv[1].join(",")+"}]"
	},

	singularSyntax : function( g, use_ids_as_labels, standardized ){
		standardized = standardized ? 1 : 0
		var pv = this.polynomialVariety( g, use_ids_as_labels, standardized )

		// constraints
		return "ring r = 0,("+pv[1].join(",")+","+pv[2].join(",")+"),(dp("+pv[1].length+"),lp);\n" +
			"ideal i = "+pv[0]+";\noption(redSB);\nideal j = groebner(i); print( j );"

		// solution of just-identified system
		//return "ring r = (0,"+pv[2].join(",")+"),("+pv[1].join(",")+"),(dp);\n" +
		//	"ideal i = "+pv[0]+";\noption(redSB);\nideal j = groebner(i); print( j );"

		//return "GroebnerBasis[{"+pv[0]+"},{"+pv[2].join(",")+"},{"+pv[1].join(",")+"}]"
	},

	polynomialVariety : function( g, use_ids_as_labels, standardized ){
		if( typeof use_ids_as_labels === "undefined" ){
			use_ids_as_labels = false
		}
		standardized = standardized ? 1 : 0
		var vv = g.getVertices(), i, j, v_elements = [], 
			values = [], vnr = []
		for( i = 0 ; i < vv.length ; i ++ ){
			if( use_ids_as_labels ){
				vnr[vv[i].id] = vv[i].id
			} else {
				vnr[vv[i].id] = i
			}
		}
		
		var covs = function( i, j ){
			return "a"+vnr[vv[i].id]+"a"+vnr[vv[j].id]
		}
		
		for( i = 0 ; i < vv.length ; i ++ ){
			//if( !standardized ){
			if( i == 0 ){
				var parameters = GraphAnalyzer.trekRule( g, vv[i], vv[i],
					use_ids_as_labels, standardized )[1]
			}
			//}
			if( g.isLatentNode( vv[i] ) ) continue
			for( j = i + standardized; j < vv.length ; j ++ ){
				if( g.isLatentNode( vv[j] ) ) continue
				values.push(covs(i,j))
				var monomials = GraphAnalyzer.trekRule( g, 
					vv[i], vv[j], use_ids_as_labels, standardized )
				if( monomials[0].length > 0 ){
					v_elements.push( 
						covs(i,j)+" - (" + 
							monomials[0].map( function( t ){ return t.join("*") } ).join(" + ") + ")"
					)
					/*v_elements.push( 
						 monomials[0].map( function( t ){ return t.join("*") } ).
						join(" + ")
					)*/
				} else {
					v_elements.push( covs(i,j) ) 
				}
			}
		}
		return [v_elements.join(",\n"),parameters,values]
	},
	
	toImplicationTestRCode : function( g, max_nr ){
		var imp, i, j, r_str
		if( max_nr == null ){ max_nr = 1000 }
		imp = GraphAnalyzer.listMinimalImplications( g, max_nr )
		r_str = []
		for( i = 0 ; i < imp.length ; i ++ ){
			for( j = 0 ; j < imp[i][2].length ; j ++ ){
				r_str.push( "c(\""+
				imp[i][0]+"\",\""+imp[i][1]+"\""+
				( imp[i][2][j].length > 0 ?
					",\""+_.pluck(imp[i][2][j],"id").join("\",\"")+"\""
					: "" ) +
				")" )
			}
		}
		return "testImplications <- function( covariance.matrix, sample.size ){\n"+
				"\tlibrary(ggm)\n\t"+
				"tst <- function(i){ pcor.test( pcor(i,covariance.matrix), length(i)-2, sample.size )$pvalue }\n"+
				"tos <- function(i){ paste(i,collapse=\" \") }\n"+
				"implications <- list("+ 
				r_str.join(",\n\t\t")+")\n\t"+
				"data.frame( implication=unlist(lapply(implications,tos)),\n\t\t"+
				"pvalue=unlist( lapply( implications, tst ) ) )\n"+
			"\n}"
	},
	
	toJavascriptMultilineString : function( g ){
		var gt = g.toString().split("\n"), i, r_str = []
		for( i = 0 ; i < gt.length ; i ++ ){
			r_str.push(gt[i])
		}
		return "\t\""+r_str.join("\\n\"+\n\t\"")+"\""
	},

	//Exports the graph as igraph edge list with the attributes needed for the causaleffect package.
	//Latent nodes are replaced by bidirectional edges, only directed and bidirectional edges are allowed
	toCausalEffectIgraphRCode : function (g){
		var gbidi = GraphTransformer.contractLatentNodes(g)
		var edgesresult = []
		var bidirectional = []
		var withEdges = new Hash()
		_.each(gbidi.getEdges(), function(e){
			withEdges.set(e.v1.id, true)
			withEdges.set(e.v2.id, true)
			edgesresult.push( GraphSerializer.quoteVid(e.v1.id) + "," + GraphSerializer.quoteVid(e.v2.id) )
			if (e.directed == Graph.Edgetype.Bidirected) {
				bidirectional.push(edgesresult.length)
				edgesresult.push( GraphSerializer.quoteVid(e.v2.id) + "," + GraphSerializer.quoteVid(e.v1.id) )
				bidirectional.push(edgesresult.length)
			}
		} )
		
		var result = edgesresult.length > 0 ? "set.edge.attribute(graph = graph_from_edgelist(matrix(c( "+edgesresult.join(", ")+" ),nc = 2,byrow = TRUE)), name = \"description\", index = c("+bidirectional.join(", ")+"), value = \"U\")" : "make_empty_graph()"
		
		var withoutEdges = _.filter(g.getVertices(), function(v){return !withEdges.get(v.id)})
		if (withoutEdges.length > 0) result = result + " + vertices(" + withoutEdges.map(function(v){ return GraphSerializer.quoteVid(v.id) }).join(", ")+  ")"
		
		return result
	},
	
	//Exports R-code to find the causal effect from the current exposures to current outcomes using the causaleffect package
	toCausalEffectRCode : function(g){
		var nodeList = function(a) { return "c(" + a.map(function(v){return GraphSerializer.quoteVid(v.id)}).join(", ") + ")" }
		return "causal.effect(y = "+nodeList(g.getTargets())+", x = "+nodeList(g.getSources())+", G = "+this.toCausalEffectIgraphRCode(g)+")"
	}
}; // eslint-disable-line 

