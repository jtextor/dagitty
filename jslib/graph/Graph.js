/* This class provides a basic Graph datastructure. Graphs can contain 
 * both directed, undirected, and bidirected edges. 
 *	 
 * TODO: there are still some algorithmic methods in this class, these should
 * be moved to either GraphAnalyzer, GraphTransform or GraphSerializer in the future.
 */

/* globals _, Class, GraphParser, Hash, GraphSerializer */

var Graph = Class.extend({ 
	// additional getter and setter methods for these properties are mixed in below,
	// see code after definition of this class 
	managed_vertex_property_names : ["source","target","adjustedNode",
		"latentNode","selectedNode"],

	/** @param s : allows Graph to be constructed directly from Dot statements */
	init : function( s ){
		this.vertices = new Hash()
		this.edges = []
		this.type = "digraph"
		this.name = null
		this.bb = null
		this.managed_vertex_properties = {}
		_.each(this.managed_vertex_property_names,function(p){
			this.managed_vertex_properties[p] = new Hash()
		},this)
		if( typeof s === "string" ){
			GraphParser.parseDot( s, this )
		}
	},

	getBoundingBox : function(){
		return this.bb
	},
	setBoundingBox : function( bb ){
		this.bb = bb
	},

	getName : function(){
		return this.name
	},
	setName : function( name ){
		this.name = name
	},
	
	getType : function(){
		return this.type
	},
	setType : function( type ){
		this.type = type
	},

	getEdges : function(){
		return this.edges
	},


	getVertexIDs : function(){
		return this.vertices.keys()
	},
	
	getNumberOfVertices : function(){
		return this.vertices.size()
	},

	getNumberOfEdges : function(){
		return this.edges.length
	},

	getVertices : function(){
		return this.vertices.values()
	},

	getVerticesWithProperty : function( p ){
		return this.managed_vertex_properties[p].values()
	},
	addVertexProperty : function( v, p ){
		var vv = this.getVertex( v )
		if( vv ){
			this.managed_vertex_properties[p].set( vv.id, vv )
		}
		return this
	},
	removeVertexProperty : function( v, p ){
		var vv = this.getVertex( v )
		if( vv ){
			this.managed_vertex_properties[p].unset( vv.id )
		}
		return this
	},
	removePropertyFromAllVertices : function( p ){
		this.managed_vertex_properties[p] = new Hash()
		return this
	},
	vertexHasProperty : function( v, p ){
		var vv = this.getVertex( v )
		return vv && this.managed_vertex_properties[p].contains( vv.id )
	},
	
	/** Copies all properties of every vertex and edge of this graph to the same 
	    vertex in g2 and sets the type of g2 to the type of this graph. */
	copyAllPropertiesTo : function( g2 ){
		var g = this
		_.each( g.managed_vertex_property_names, ( function( p ){
			_.each( g.getVerticesWithProperty( p ), function( v ){
				g2.addVertexProperty( v, p ) 
			} )
		} ) )
		_.each( g.getEdges(), function(e){
			var e2 = g2.getEdge( e.v1, e.v2, e.directed )
			if( e2 ){
				e2.layout_pos_x = e.layout_pos_x
				e2.layout_pos_y = e.layout_pos_y
				e2.style = e.style
				if( e.attributes ){
					e2.attributes = {}
					var vk = Object.keys( e.attributes )
					for( var i = 0 ; i < vk.length ; i ++ ){
						e2.attributes[vk[i]] = e.attributes[vk[i]]
					}
				}
			}
		} )
		g2.setType( this.getType() )
	},
	
	getVertex : function( v ){
		if( typeof v === "string" ){
			return this.vertices.get(v)
		} else if( v instanceof Graph.Vertex ){
			return this.vertices.get(v.id)
		} else if( v instanceof Array ){
			return v.map(this.getVertex,this)
		} else {
			throw( "Illegal value passed to getVertex : " + v )
		}
	},
	
	addVertex : function( v ){
		if( ! (v instanceof Graph.Vertex) ){
			return this.addVertex(new Graph.Vertex({id:v}))
		} else {
			this.vertices.set( v.id, v )
		}
		return v
	},
	
	renameVertex : function( id_old, id_new ){
		var v = this.getVertex( id_old )
		var properties = []
		_.each( 
		this.managed_vertex_property_names, function(p){
			var pcamel = p.substring(0,1).toUpperCase()+
				p.substring(1,p.length)
			if( this["is"+pcamel]( v ) ){
				properties.push(pcamel)
				this["remove"+pcamel]( v )
			}
		},this)
		this.vertices.unset( id_old )
		v.id = id_new
		this.vertices.set( v.id, v )
		_.each( properties, function(p){ this["add"+p](v) },this )
		return this
	},
	
	deleteVertex : function( v ){
		// first remove all edges adjacent to v 
		v = this.getVertex( v )
	
		_.each( v.outgoingEdges, function( e ) {
			e.v2.incomingEdges = _.without(e.v2.incomingEdges, e )
		} )
		_.each( v.incomingEdges, function( e ) {
			e.v1.outgoingEdges = _.without(e.v1.outgoingEdges, e )
		} )
		this.edges = _.filter(this.edges, 
		function( e ){ return ! ( 
			_.contains( v.incomingEdges, e ) || 
			_.contains( v.outgoingEdges, e ) ) } )
		
		// remove the vertex from all property lists
		_.each( this.managed_vertex_property_names, function(p){
			var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length)
			this["remove"+pcamel]( v )
		},this)
		
		// then remove the vertex itself
		this.vertices.unset( v.id )
		return this
	},
	
	clone : function( include_edges ){
		if( arguments.length == 0 ){
			include_edges = true
		}
		var g2 = new Graph()
		_.each( this.getVertices(), function( v ){
			g2.addVertex( v.cloneWithoutEdges() )
		} )
		if( include_edges ){
			_.each( this.edges, function( e ){
				g2.addEdge( e.v1.id, e.v2.id, e.directed )
			} )
		}
		this.copyAllPropertiesTo(g2)
		g2.setType( this.getType() )
		return g2
	},
	
	/** 
	 *         TODO for now, only works with specified edges 
	 */
	contractVertex : function( v0 ){
		var children = v0.getChildren()
		var parents = v0.getParents()
		var spouses = v0.getSpouses()
		var neighbours = v0.getNeighbours()
		
		var self = this
		
		_.each(children, function(v){
			_.each(children, function(w){   if (v.id != w.id) self.addEdge(w, v, Graph.Edgetype.Bidirected ) }) // v <- v0 -> w
			_.each(parents, function(w){ if (v.id != w.id) self.addEdge(w, v, Graph.Edgetype.Directed ) }) // v <- v0 <- w
			_.each(spouses, function(w){    if (v.id != w.id) self.addEdge(w, v, Graph.Edgetype.Bidirected ) }) // v <- v0 <-> w
			_.each(neighbours, function(w){ if (v.id != w.id) self.addEdge(w, v, Graph.Edgetype.Directed ) }) // v <- v0 - w
		})
		_.each(parents, function(v){
			_.each(neighbours, function(w){ if (v.id != w.id) self.addEdge(v, w, Graph.Edgetype.Directed ) }) // v -> v0 - w
		})
		_.each(spouses, function(v){
			_.each(neighbours, function(w){ if (v.id != w.id) self.addEdge(v, w, Graph.Edgetype.Bidirected ) }) // v <-> v0 - w
		})
		_.each(neighbours, function(v){
			_.each(neighbours, function(w){ if (v.id != w.id) self.addEdge(v, w, Graph.Edgetype.Undirected ) }) // v - v0 - w
		})
		this.deleteVertex( v0 )
	},
	
	clearVisited : function(){
		_.each( this.getVertices(), function( v ){
			v.traversal_info.visited = false
		} )
		return this
	},
	
	clearTraversalInfo : function(){
		_.each( this.getVertices(), function( v ){
			v.traversal_info = {}
		} )
		return this
	},
	
	transitiveClosureOf : function( vertex_array, kinship_function, clear_visited_function ){
		"use strict"
		if( clear_visited_function ){
			clear_visited_function()
		} else {
			this.clearVisited()
		}
		var q = _.reject( vertex_array.slice(), Graph.Vertex.isVisited )
		_.each( q, Graph.Vertex.markAsVisited )
		var r = []
		var visitAndPush = function(vn){
			Graph.Vertex.markAsVisited(vn)
			q.push(vn)
		}
		while( q.length > 0 ){
			var v = q.pop()
			var vv = _.reject( v[kinship_function](), Graph.Vertex.isVisited )
			_.each(vv, visitAndPush)
			r.push(v)
		}
		this.clearVisited()
		return r
	},
	
	districtOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getSpouses",
			clear_visited_function )
	},

	ancestorsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getParents",
			clear_visited_function )
	},

	anteriorsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getPossibleParentsAndPossibleNeighbours",
			clear_visited_function )
	},
	
	descendantsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getChildren",
			clear_visited_function )
	},
	
	posteriorsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getChildrenAndNeighbours",
			clear_visited_function )
	},
	
	childrenOf : function( vertex_array ){
		var r = []
		for( var i = 0 ; i < vertex_array.length ; i ++ ){
			r = r.concat( vertex_array[i].getChildren() )
		}
		return _.uniq(r)
	},
	
	parentsOf : function( vertex_array ){
		var r = []
		for( var i = 0 ; i < vertex_array.length ; i ++ ){
			r = _.uniq( r.concat( vertex_array[i].getParents() ) )
		}
		return _.uniq(r)
	},
	
	/* 
	 *	Generalizes "neighbours" to vertex sets. 
	 *	Returns all vertices in G adjacent to any of the given vertices,
	 *	except for those that are already in the input set.
	 */ 
	neighboursOf : function( vertex_array ){
		var vh = new Hash()
		_.each( vertex_array, function(v){
			vh.set( v.id, v )
		})
		var rh = new Hash()
		_.each( vertex_array, function(v){
			_.each( v.getNeighbours(), function(w){
				if( !vh.get( w.id ) ){
					rh.set(w.id,w)
				}
			})
		})
		return rh.values()
	},
	
	spousesOf : function( vertex_array ){
		var vh = new Hash()
		_.each( vertex_array, function(v){
			vh.set( v.id, v )
		})
		var rh = new Hash()
		_.each( vertex_array, function(v){
			_.each( v.getSpouses(), function(w){
				if( !vh.get( w.id ) ){
					rh.set(w.id,w)
				}
			})
		})
		return rh.values()
	},
	
	adjacentNodesOf : function( vertex_array ){
		var vh = new Hash()
		_.each( vertex_array, function(v){
			vh.set( v.id, v )
		})
		var rh = new Hash()
		_.each( vertex_array, function(v){
			_.each( v.getAdjacentNodes(), function(w){
				if( !vh.get( w.id ) ){
					rh.set(w.id,w)
				}
			})
		})
		return rh.values()
	},

	areAdjacent : function( v1, v2 ){
		v1 = this.getVertex(v1)
		v2 = this.getVertex(v2)
		if( _.any( _.map( v1.outgoingEdges, function(e){ return e.v2 == v2 } ) ) ){
			return true
		}
		return _.any( _.map( v1.incomingEdges, function(e){ return e.v1 == v2 } ) ) 
	},
	
	/**
	 *      Graph is assumed to be a tree (not a forest), only
	 *      undirected edges are considered. */
	visitAllPathsBetweenVisitedNodesInTree : function(){
		// this gets a random vertex 
		var root = this.getVertex( Object.keys( this.vertices.kv )[0] )
		var v
		if( !root ) return 
						// calculate the depth of all nodes in the tree 
		var q = [root]
		_.each( this.vertices.values(), function(v){
			v.traversal_info.depth = 0
		})
		root.traversal_info.parent = null        
		var max_depth = 0
		while( q.length > 0 ){
			v = q.pop()
			var children = _.reject( v.getNeighbours(), 
			function(v2){ return (v2 === root) || (v2.traversal_info.depth > 0) })
			_.each( children, function(v2){
				v2.traversal_info.depth = v.traversal_info.depth + 1
				if(  Graph.Vertex.isVisited(v2) && 
					v2.traversal_info.depth > max_depth ){
					max_depth = v2.traversal_info.depth
				}
				v2.traversal_info.parent = v
				q.push(v2)
			})
		}
		// layer the tree
		var tokens = new Array( max_depth + 1 )
		for( var i = 0 ; i <= max_depth ; i ++ ){
			tokens[i] = []
		}
		var nr_tokens = 0
		_.chain(this.vertices.values()).filter(Graph.Vertex.isVisited).each(function(v){
			tokens[v.traversal_info.depth].push(v)
			nr_tokens ++
		})
		while( nr_tokens > 1 ){
			v = tokens[max_depth].pop()
			if( v.traversal_info.parent && !Graph.Vertex.isVisited( v.traversal_info.parent ) ){
				Graph.Vertex.markAsVisited( v.traversal_info.parent )
				tokens[max_depth-1].push( v.traversal_info.parent )
			} else {
				nr_tokens --
			}
			while( (nr_tokens > 0) && (tokens[max_depth].length == 0) ){
				max_depth --
			}
		}
	},
	
	getEdge : function( v1, v2, edgetype ){
		v1 = this.getVertex( v1 )
		v2 = this.getVertex( v2 )
		if( typeof edgetype == "undefined" ){
			edgetype = Graph.Edgetype.Directed
		}
		if( !(v1 && v2) ){ return undefined }
		var e = _.find( v1.outgoingEdges, function( e ){ 
			return e.v2.id==v2.id && e.directed == edgetype } )
		if( e ){ return e }
		if( Graph.Edgetype.Symmetric[edgetype] ){
			return _.find( v1.incomingEdges, function( e ){ 
				return e.v1.id==v2.id && e.directed == edgetype } )
		}
		return undefined
	},
	
	addEdge: function( v1, v2, edgetype ){
		v1 = this.getVertex( v1 )
		v2 = this.getVertex( v2 )
		if( typeof edgetype == "undefined" ){
			edgetype = Graph.Edgetype.Directed
		}
		var e = this.getEdge( v1, v2, edgetype )
		if( typeof e == "undefined" && Graph.Edgetype.Symmetric[edgetype] ){
			e = this.getEdge( v2, v1, edgetype )
		}
		if( typeof e == "undefined" ){
			e = this.quickAddEdge(v1, v2, edgetype)
		} 
		return e
	},

	quickAddEdge: function (v1, v2, edgetype){
		var e = new Graph.Edge({v1:v1,v2:v2,directed:edgetype})
		e.v1.outgoingEdges.push( e )
		e.v2.incomingEdges.push( e )
		this.edges.push( e )
		return e
	},

	quickAddDirectedEdge: function (v1, v2) {
		this.quickAddEdge(v1, v2, Graph.Edgetype.Directed)
	},

	deleteEdge : function( v1, v2, edgetype ) {
		if( typeof edgetype == "undefined" ){
			throw("too few parameters for deleteEdge!")
		}
		var e = this.getEdge( v1, v2, edgetype )
		if( typeof e == "undefined" ){
			return false
		}
		e.v1.outgoingEdges = _.without( e.v1.outgoingEdges, e )
		e.v2.incomingEdges = _.without( e.v2.incomingEdges, e )
		this.edges = _.without( this.edges, e )
		return true
	},

	changeEdge : function( e, edgetype_new, v1_new ){
		if( typeof v1_new == "undefined" ){
			v1_new = e.v1
		} else {
			v1_new = this.getVertex( v1_new )
		}
		var v2_new = v1_new == e.v1 ? e.v2 : e.v1
		if( typeof this.getEdge( v1_new, v2_new, edgetype_new ) != "undefined" ){
			return false
		}
		if( Graph.Edgetype.Symmetric[edgetype_new] ){
			e.directed = edgetype_new
		} else {
			if( v1_new != e.v1 ){
				this.reverseEdge( e )
			}
			e.directed = edgetype_new
		}
		return true
	},
	
	reverseEdge : function( e ){
		e.v1.outgoingEdges = _.without( e.v1.outgoingEdges, e )
		e.v2.incomingEdges = _.without( e.v2.incomingEdges, e )
		var vn = e.v2
		e.v2 = e.v1
		e.v1 = vn
		e.v1.outgoingEdges.push( e )
		e.v2.incomingEdges.push( e )
	},

	toAdjacencyList: function(){
		var ra = []
		var g = this
		_.each( g.vertices.values(), function( v ){
			var children = v.getChildren(), neighbours = v.getNeighbours(), spouses= v.getSpouses()
			var r = "",rc = []
			if( children.length + neighbours.length
				+ spouses.length > 0 ){
				_.each( neighbours, function( v2 ){
					var e = g.getEdge( v, v2, Graph.Edgetype.Undirected )
					if( e.v1.id === v.id ){
						r = encodeURIComponent(e.v2.id)
						if( e.layout_pos_x ){
							r += " @"+e.layout_pos_x.toFixed(3)+","
							+e.layout_pos_y.toFixed(3)
						}
					} else {
						r = encodeURIComponent(e.v1.id)
					}
					rc.push(r)
				} )
				_.each( 
				children, function( v2 ){
					var e = g.getEdge( v, v2, Graph.Edgetype.Directed )
					r = encodeURIComponent(v2.id)
					if( e.layout_pos_x ){
						r += " @"+e.layout_pos_x.toFixed(3)+","
						+e.layout_pos_y.toFixed(3)
					}
					rc.push(r)
				} )
				_.each( spouses, function( v2 ){
					var e = g.getEdge( v, v2, Graph.Edgetype.Bidirected )
					if( e.v1.id === v.id ){
						r = encodeURIComponent(e.v2.id)
						if( e.layout_pos_x ){
							r += " @"+e.layout_pos_x.toFixed(3)+","
							+e.layout_pos_y.toFixed(3)
						}
					} else {
						r = encodeURIComponent(e.v1.id)
					}
					rc.push(r)
				} )
			}
			if( rc.length > 0 ){
				rc.sort()
				ra.push(encodeURIComponent(v.id)+" "+rc.join(" "))
			}
		} )
		ra.sort()
		return ra.join("\n")
	},
	
	toVertexLabels: function(){
		var expandLabel = function( v, g ){
			var property_string = (g.isSource(v) ? "E" : "")
			+ (g.isTarget(v) ? "O" : "")
			+ (g.isAdjustedNode(v) ? "A" : "")
			+ (g.isLatentNode(v) ? "U" : "")
			//+ (v.weight !== undefined ? v.weight : "");
			if( !property_string ){ property_string = 1 }
			return encodeURIComponent(v.id) + " " + property_string + (v.layout_pos_x !== undefined ? 
			" @"+v.layout_pos_x.toFixed( 3 ) +","
			+v.layout_pos_y.toFixed( 3 ) : "")
		}
		var r = ""
		var g = this
		var ra = []
		_.each( 
		this.vertices.values(), function( v ){
			ra.push(expandLabel( v, g )+"\n")
		} )
		ra.sort()
		return r + ra.join("")
	},
	
	toString : function(){
		return GraphSerializer.toDot( this )
	},
	
	oldToString : function(){
		return this.toVertexLabels() + "\n" + this.toAdjacencyList()
	},
	
	hasCompleteLayout : function(){
		return _.all(this.vertices.values(),function(v){
			return v.layout_pos_x !== undefined && v.layout_pos_y !== undefined})
	},
	
	/*
	 *	Counts the different causal paths from any source to any target.
	 *	TODO currently does so by iterating over all pairs of sources and targets,
	 *	which is quite dumb.
	 */
	countPaths: function(){
		if( this.getSources().length == 0 || this.getTargets().length == 0 ){
			return 0
			//throw( "Source and/or target not set!" ); 
		}
		
		var visit = function( v, t ){
			if( !Graph.Vertex.isVisited( v ) ){
				Graph.Vertex.markAsVisited( v )
				if( v === t ){
					v.traversal_info.paths_to_sink = 1
				} else { 
					v.traversal_info.paths_to_sink = 0
					_.each(v.getChildren(), function( vc ){
						v.traversal_info.paths_to_sink += visit( vc, t )
					} )
				}
			}
			return v.traversal_info.paths_to_sink
		}
		var r = 0
		_.each(this.getSources(), function( s ){
			_.each( this.getTargets(), function( t ){
				this.clearTraversalInfo()
				r = r + visit( s, t )
			}, this )
		}, this )
		return r
	},
	
	sourceConnectedToTarget: function(){
		if( !this.getSource() || !this.getTarget() ){
			return false
		}
		if( arguments.length == 0 ){
			return this.sourceConnectedToTarget( this.getSource(), this.getTarget() )
		} else if( arguments.length == 1 ){
			var avoid_nodes = arguments[0]
			this.clearTraversalInfo()
			_.each( avoid_nodes, function(v){ 
				this.getVertex(v) && (this.getVertex(v).traversal_info.visited = true)
			}, this )
			return this.sourceConnectedToTarget( this.getSource(), this.getTarget() )
		} else {
			var s = arguments[0], t = arguments[1]
			if( !s.traversal_info ){ this.clearTraversalInfo() } 
			if( s == t ){
				return true
			}
			s.traversal_info.visited = true
			if( s.getChildren().any( function( n ){
				return !n.traversal_info.visited && !n.traversal_info.adjusted_for 
				&& this.sourceConnectedToTarget( n, t ) }, this ) ){
				return true
			}
			s.traversal_info.visited = false
			return false
		}
	}
} ); // Class.create

// mixin getters & setters for managed vertex properties
(function(c){
	_.each( c.prototype.managed_vertex_property_names, function(p){
		var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length)
		c.prototype["is"+pcamel] = function( v ){ return this.vertexHasProperty( v, p ) }
		c.prototype["add"+pcamel] = function( v ){ return this.addVertexProperty( v, p ) }
		c.prototype["remove"+pcamel] = function( v ){ return this.removeVertexProperty( v, p ) }
		c.prototype["get"+pcamel+"s"] = function(){ return this.getVerticesWithProperty( p ) }
		c.prototype["set"+pcamel+"s"] = function( vs ){ 
			this.removePropertyFromAllVertices( p )
			_.each(vs, function(v){ this.addVertexProperty( v, p ) }, this)
		}
		c.prototype["removeAll"+pcamel+"s"] = function(){ return this.removePropertyFromAllVertices( p ) }
	} )
})(Graph)


Graph.Vertex = Class.extend({
	init : function( spec ){
		this.id = spec.id
		this.weight = spec.weight !== undefined ? spec.weight : 1
		if( spec.layout_pos_x !== undefined ){
			this.layout_pos_x = spec.layout_pos_x
			this.layout_pos_y = spec.layout_pos_y
		} 
		//this.adjacentEdges = {}
		//this.adjacentBidirectedEdges = []
		this.incomingEdges = []
		this.outgoingEdges = []
		this.traversal_info = {}
	}, 
	/**
		*      see below for meaning of this generic function 
		*/
	getKinship : function( edgetype, outward ){
		var r = [], n = this
		if( arguments.length == 1 ){ outward = true }
		if( outward || Graph.Edgetype.Symmetric[edgetype] ){
			_.each( n.outgoingEdges, function( e ){
				if( e.directed == edgetype ) r.push( e.v1 === n ? e.v2 : e.v1 )
			} )
		}
		if( !outward || Graph.Edgetype.Symmetric[edgetype] ){
			_.each( n.incomingEdges, function( e ){
				if( e.directed == edgetype ) r.push( e.v1 === n ? e.v2 : e.v1 )
			} )
		}
		return r
	},
	getChildrenAndNeighbours : function(){
		return this.getNeighbours().concat(this.getChildren())
	},
	getParentsAndNeighbours : function(){
		return this.getNeighbours().concat(this.getParents())
	},
	getPossibleParentsAndPossibleNeighbours : function(){
		return this.getPossibleNeighbours().concat(this.getPossibleParents())
	},
	getPossibleNeighbours : function(){
		return this.getKinship( Graph.Edgetype.Undirected ).
			concat( this.getKinship( Graph.Edgetype.Unspecified ) )
	},
	getNeighbours : function(){
		return this.getKinship( Graph.Edgetype.Undirected )
	},
	getSpouses : function(){
		return this.getKinship( Graph.Edgetype.Bidirected )
	},
	getChildren : function(){
		return this.getKinship( Graph.Edgetype.Directed )
	},
	getParents : function(){
		return this.getKinship( Graph.Edgetype.Directed, false )
	},
	getPossibleParents : function(){
		return this.getKinship( Graph.Edgetype.Directed, false ).
			concat( this.getKinship( Graph.Edgetype.PartDirected, false ) )
	},
	getAdjacentNodes : function(){
		return (this.getChildrenAndNeighbours().
			concat(this.getParents()).
			concat(this.getSpouses()))
	},
	degree : function(){
		if( arguments.length >= 1 ){
			switch( arguments[0] ){
			case Graph.Edgetype.Bidirected :
				return this.getSpouses().length
			case Graph.Edgetype.Undirected :
				return this.getNeighbours().length
			case Graph.Edgetype.Directed :
				return this.getChildren().length+this.getParents().length
			}
		} else {
			return this.getAdjacentNodes().length
		}
	},
	cloneWithoutEdges : function(){
		var r = new Graph.Vertex( this )
		return r
	}
} )

Graph.Vertex.isVisited = function( v ){
	return v.traversal_info.visited
}
Graph.Vertex.markAsVisited = function( v ){
	v.traversal_info.visited = true
}
Graph.Vertex.markAsNotVisited = function( v ){
	v.traversal_info.visited = false
}

Graph.Edge = Class.extend( {
	init : function( spec ){
		this.v1 = spec.v1
		this.v2 = spec.v2
		this.directed = spec.directed
		this.style = spec.style
		this.layout_pos_x = spec.layout_pos_x
		this.layout_pos_y = spec.layout_pos_y
	},
	toString : function( ){
		var edge_join = Graph.Edgetype.Symbol[this.directed] 

		var v1id = GraphSerializer.dotQuoteVid(this.v1.id)
		var v2id = GraphSerializer.dotQuoteVid(this.v2.id)
	
		if( Graph.Edgetype.Symmetric[this.directed] && 
			(v1id > v2id) ){
			var tmp = v1id
			v1id = v2id
			v2id = tmp
		}
	
		return v1id + " " + edge_join + " " + v2id
	}
} )

Graph.Edgetype = {
	Undirected : 0,
	Directed : 1,
	Bidirected : 2,
	Unspecified : 3,
	PartDirected : 4,
	PartUndirected : 5,
	Symmetric : {
		0 : true,
		1 : false,
		2 : true,
		3 : true,
		4 : false,
		5 : false
	},
	Symbol : {
		0 : "--",
		1 : "->",
		2 : "<->",
		3 : "@-@",
		4 : "@->",
		5 : "@--"
	}
}

Graph.Edge.Bidirected = Graph.Edge.extend( {
	init : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Bidirected
	}
} )

Graph.Edge.Directed = Graph.Edge.extend( {
	init : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Directed
	}
} )

Graph.Edge.Undirected = Graph.Edge.extend( {
	init : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Undirected
	}
} )
