/* This class provides a basic Graph datastructure. Graphs can contain 
 * both directed, undirected, and bidirected edges. 
 *	 
 * TODO: there are still some algorithmic methods in this class, these should
 * be moved to either GraphAnalyzer, GraphTransform or GraphSerializer in the future.
 */

/* globals _, Class, Hash, GraphSerializer */

var Graph = Class.extend({ 
	// additional getter and setter methods for these properties are mixed in below,
	// see code after definition of this class 
	managed_vertex_property_names : ["source","target","adjustedNode",
		"latentNode","selectionNode"],
	initialize : function(){
		this.vertices = new Hash()
		this.edges = []
		this.managed_vertex_properties = {}
		_.each(this.managed_vertex_property_names,function(p){
			this.managed_vertex_properties[p] = new Hash()
		},this)
	},
	getNumberOfVertices : function(){
		return this.vertices.size()
	},
	getNumberOfEdges : function(){
		return this.edges.size()
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
	copyAllVertexPropertiesTo : function( g2 ){
		var g = this
		_.each( g.managed_vertex_property_names, ( function( p ){
			_.each( g.getVerticesWithProperty( p ), function( v ){
					g2.addVertexProperty( v, p ) 
			} )
		} ) )
	},
	
	getVertex : function( v ){
		if( typeof v === "string" ){
			return this.vertices.get(v)
		} else if( v instanceof Graph.Vertex ){
			return this.vertices.get(v.id)
		} else if( v instanceof Array ){
			return v.map(function(vi){return this.vertices.get(vi)},this)
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
		_.each( ["adjacentUndirectedEdges", "adjacentBidirectedEdges"],
			function( edgelist ){
				_.each( v[edgelist], function( e ) {
					if( e.v1 === v ){
						e.v2[edgelist] = _.without(e.v2[edgelist], e )
					} else {
						e.v1[edgelist] = _.without(e.v1[edgelist], e )
					}
				} )
			} )
		
		_.each( v.outgoingEdges, function( e ) {
			e.v2.incomingEdges = _.without(e.v2.incomingEdges, e )
		} );
		_.each( v.incomingEdges, function( e ) {
			e.v1.outgoingEdges = _.without(e.v1.outgoingEdges, e )
		} );
		this.edges = _.filter(this.edges, 
		function( e ){ return ! ( 
		_.contains( v.adjacentBidirectedEdges, e ) ||
		_.contains( v.adjacentUndirectedEdges, e ) ||
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
		this.copyAllVertexPropertiesTo(g2)
		return g2
	},
	
	/** 
	 *         TODO for now, only works with directed edges 
	 */
	contractVertex : function( v ){
		var i,j;
		for( i = 0 ; i < v.incomingEdges.length ; i++ ){
			for( j = 0 ; j < v.outgoingEdges.length ; j++ ){
				this.addEdge( new Graph.Edge.Directed( 
					{ 
						v1 : v.incomingEdges[i].v1, 
						v2 : v.outgoingEdges[j].v2 
					} ) )
			}
		}
		this.deleteVertex( v )
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
		return r
	},
	
	ancestorsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getParents",
			clear_visited_function )
	},

	anteriorsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getParentsAndNeighbours",
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
	
	nodesOnCausalPaths : function(){
		return _.intersection( this.descendantsOf( this.getSources() ),
			this.ancestorsOf( this.getTargets() ) )
	},
	
	/**
	 *      Graph is assumed to be a tree (not a forest), only
	 *      undirected edges are considered. */
	visitAllPathsBetweenVisitedNodesInTree : function(){
		// this gets a random vertex 
		var root = this.getVertex( Object.keys( this.vertices.kv )[0] )
		var v
		if( !root ) return; 
						// calculate the depth of all nodes in the tree 
		var q = [root]
		_.each( this.vertices.values(), function(v){
			v.traversal_info.depth = 0;
		});
		root.traversal_info.parent = null;        
		var max_depth = 0
		while( q.length > 0 ){
			v = q.pop();
			var children = _.reject( v.getNeighbours(), 
			function(v2){ return (v2 === root) || (v2.traversal_info.depth > 0) })
			_.each( children, function(v2){
				v2.traversal_info.depth = v.traversal_info.depth + 1;
				if(  Graph.Vertex.isVisited(v2) && 
					v2.traversal_info.depth > max_depth ){
					max_depth = v2.traversal_info.depth
				}
				v2.traversal_info.parent = v
				q.push(v2)
			});
		}
		// layer the tree
		var tokens = new Array( max_depth + 1 )
		for( var i = 0 ; i <= max_depth ; i ++ ){
			tokens[i] = []
		}
		var nr_tokens = 0;
		_.chain(this.vertices.values()).filter(Graph.Vertex.isVisited).each(function(v){
			tokens[v.traversal_info.depth].push(v)
			nr_tokens ++
		});
		while( nr_tokens > 1 ){
			v = tokens[max_depth].pop();
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
	
	getEdges : function(){
		return this.edges
	},
	
	getEdge : function( v1, v2, edgetype ){
		v1 = this.getVertex( v1 )
		v2 = this.getVertex( v2 )
		if( typeof edgetype == "undefined" ){
			edgetype = Graph.Edgetype.Directed
		}
		if( !(v1 && v2) ){ return undefined; }
		switch( edgetype ){
		case Graph.Edgetype.Undirected :
			return _.find( v1.adjacentUndirectedEdges, function( e ){
				return e.v2.id === v2.id || e.v1.id == v2.id } )
		case Graph.Edgetype.Directed :
			return _.find( v1.outgoingEdges, function( e ){
				return e.v2.id === v2.id } )
		case Graph.Edgetype.Bidirected :
			return _.find( v1.adjacentBidirectedEdges, function( e ){
				return ( e.v2.id === v2.id || e.v1.id === v2.id ) } )
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
		if( e === undefined ){
			switch( edgetype ){
			case Graph.Edgetype.Undirected :
				e = new Graph.Edge.Undirected({v1:v1,v2:v2})
				e.v1.adjacentUndirectedEdges.push( e )
				e.v2.adjacentUndirectedEdges.push( e )
				break
			case Graph.Edgetype.Directed :
				e = new Graph.Edge.Directed({v1:v1,v2:v2})
				e.v1.outgoingEdges.push( e )
				e.v2.incomingEdges.push( e )
				break
			case Graph.Edgetype.Bidirected :
				e = new Graph.Edge.Bidirected({v1:v1,v2:v2})
				e.v1.adjacentBidirectedEdges.push( e )
				e.v2.adjacentBidirectedEdges.push( e )
				break
			}
			this.edges.push( e )
		} 
		return e
	},
	deleteEdge : function( v1, v2, edgetype ) {
		if( typeof edgetype == "undefined" ){
			throw("too few parameters for deleteEdge!")
		}
		var e = this.getEdge( v1, v2, edgetype )
		if( typeof e == "undefined" ){
			return false
		}
		switch( edgetype ){
		case Graph.Edgetype.Undirected:
			e.v1.adjacentUndirectedEdges = _.without( e.v1.adjacentUndirectedEdges, e )
			e.v2.adjacentUndirectedEdges = _.without( e.v2.adjacentUndirectedEdges, e )
			break
		case Graph.Edgetype.Directed:
			e.v1.outgoingEdges = _.without( e.v1.outgoingEdges, e )
			e.v2.incomingEdges = _.without( e.v2.incomingEdges, e )
			break
		case Graph.Edgetype.Bidirected:
			e.v1.adjacentBidirectedEdges = _.without( e.v1.adjacentBidirectedEdges, e )
			e.v2.adjacentBidirectedEdges = _.without( e.v2.adjacentBidirectedEdges, e )
			break
		}
		this.edges = _.without( this.edges, e )
		return true
	},
	
	containsCycle: function(){
		var vv = this.vertices.values();
		for( var i = 0 ; i < vv.length ; i ++ ){
			var v = vv[i];
			this.clearVisited();
			var c = this.searchCycleFrom( v );
			if( c !== undefined ){
				var v_count = []
				for( var j = 0 ; j < c.length ; j ++ ){
					v_count[c[j]]?v_count[c[j]]++:v_count[c[j]]=1
				}
				for( j = 0 ; j < c.length ; j ++ ){
					if( v_count[c[j]] > 1 ){
						return c.slice( c.indexOf( c[j] ),  c.lastIndexOf( c[j] )+1 ).join("&rarr;")
					}
				}
			}
		}
	},
	
	searchCycleFrom: function( v, p ){
		if( p === undefined ){ p = []; }
		if( Graph.Vertex.isVisited( v ) ){ return p.concat(v.id) } 
		Graph.Vertex.markAsVisited( v )
		var children = v.getChildren() 
		// consider only simple directed edges, because
		// bidirected edges can never lie on a cycle
		for( var i = 0 ; i < children.length ; i ++ ){
			var pp = this.searchCycleFrom( children[i], p.concat(v.id) )
			if( pp !== undefined ){
				return pp
			}
		}
		Graph.Vertex.markAsNotVisited( v )
		return undefined
	},
	
	toAdjacencyList: function(){
		var ra = []
		var g = this
		_.each( g.vertices.values(), function( v ){
			var children = v.getChildren()
			var r = "",rc = []
			if( children.length + v.adjacentBidirectedEdges.length
				+ v.adjacentUndirectedEdges.length > 0 ){
				_.each( 
				v.adjacentUndirectedEdges, function( e ){
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
				v.getChildren(), function( v2 ){
					var e = g.getEdge( v, v2 )
					r = encodeURIComponent(v2.id)
					if( e.layout_pos_x ){
						r += " @"+e.layout_pos_x.toFixed(3)+","
						+e.layout_pos_y.toFixed(3)
					}
					rc.push(r)
				} )
				_.each( v.adjacentBidirectedEdges, function( e ){
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
		} );
		ra.sort()
		return ra.join("\n")
	},
	
	toVertexLabels: function(){
		var expandLabel = function( v, g ){
			var property_string = (g.isSource(v) ? "E" : "")
			+ (g.isTarget(v) ? "O" : "")
			+ (g.isAdjustedNode(v) ? "A" : "")
			+ (g.isLatentNode(v) ? "U" : "");
			//+ (v.weight !== undefined ? v.weight : "");
			if( !property_string ){ property_string = 1; }
			return encodeURIComponent(v.id) + " " + property_string + (v.layout_pos_x !== undefined ? 
			" @"+v.layout_pos_x.toFixed( 3 ) +","
			+v.layout_pos_y.toFixed( 3 ) : "");
		};
		var r = "";
		var g = this;
		var ra = [];
		_.each( 
		this.vertices.values(), function( v ){
			ra.push(expandLabel( v, g )+"\n");
		} );
		ra.sort();
		return r + ra.join("");
	},
	
	toString : function(){
		return GraphSerializer.toDot( this )
	},
	
	oldToString : function(){
		return this.toVertexLabels() + "\n" + this.toAdjacencyList()
	},
	
	hasCompleteLayout : function(){
		return _.all(this.vertices.values(),function(v){
			return v.layout_pos_x !== undefined && v.layout_pos_y !== undefined});
	},
	
	/*
	 *	Counts the different causal paths from any source to any target.
	 *	TODO currently does so by iterating over all pairs of sources and targets,
	 *	which is quite dumb.
	 */
	countPaths: function(){
		if( this.getSources().length == 0 || this.getTargets().length == 0 ){
			return 0;
			//throw( "Source and/or target not set!" ); 
		}
		
		var visit = function( v, t ){
			if( !Graph.Vertex.isVisited( v ) ){
				Graph.Vertex.markAsVisited( v );
				if( v === t ){
					v.traversal_info.paths_to_sink = 1;
				} else { 
					v.traversal_info.paths_to_sink = 0;
					_.each(v.getChildren(), function( vc ){
						v.traversal_info.paths_to_sink += visit( vc, t );
					} );
				}
			}
			return v.traversal_info.paths_to_sink;
		};
		var r = 0;
		_.each(this.getSources(), function( s ){
			_.each( this.getTargets(), function( t ){
				this.clearTraversalInfo();
				r = r + visit( s, t );
			}, this );
		}, this );
		return r;
	},
	
	sourceConnectedToTarget: function(){
		if( !this.getSource() || !this.getTarget() ){
			return false;
		}
		if( arguments.length == 0 ){
			return this.sourceConnectedToTarget( this.getSource(), this.getTarget() )
		} else if( arguments.length == 1 ){
			var avoid_nodes = arguments[0]
			this.clearTraversalInfo()
			_.each( avoid_nodes, function(v){ 
				this.getVertex(v) && (this.getVertex(v).traversal_info.visited = true)
			}, this );
			return this.sourceConnectedToTarget( this.getSource(), this.getTarget() )
		} else {
			var s = arguments[0], t = arguments[1]
			if( !s.traversal_info ){ this.clearTraversalInfo() } 
			if( s == t ){
				return true
			}
			s.traversal_info.visited = true;
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
		var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length);
		c.prototype["is"+pcamel] = function( v ){ return this.vertexHasProperty( v, p ); };
		c.prototype["add"+pcamel] = function( v ){ return this.addVertexProperty( v, p ); };
		c.prototype["remove"+pcamel] = function( v ){ return this.removeVertexProperty( v, p ); };
		c.prototype["get"+pcamel+"s"] = function(){ return this.getVerticesWithProperty( p ); };
		c.prototype["removeAll"+pcamel+"s"] = function(){ return this.removePropertyFromAllVertices( p ); };
	} );
})(Graph);


Graph.Vertex = Class.extend({
	initialize : function( spec ){
		this.id = spec.id
		this.weight = spec.weight !== undefined ? spec.weight : 1
		if( spec.layout_pos_x !== undefined ){
			this.layout_pos_x = spec.layout_pos_x
			this.layout_pos_y = spec.layout_pos_y
		} 
		this.adjacentUndirectedEdges = []
		this.adjacentBidirectedEdges = []
		this.incomingEdges = []
		this.outgoingEdges = []
		this.traversal_info = {}
	}, 
	/**
		*      see below for meaning of this generic function 
		*/
	getKinship : function( inverse_direction, consider_undirected_edges, 
			consider_bidirected_edges ){
		var r = [], n = this
		if( consider_undirected_edges ){
			_.each( 
			n.adjacentUndirectedEdges, function( e ){
				r.push( e.v1 === n ? e.v2 : e.v1 )
			} )
		}
		else if( consider_bidirected_edges ){
			_.each( 
			n.adjacentBidirectedEdges, function( e ){
				r.push( e.v1 === n ? e.v2 : e.v1 )
			} )
		} else if( !inverse_direction ){
			_.each( 
			n.outgoingEdges, function( e ){
				r.push( e.v2 )
			} );
		} else {
			_.each( 
			n.incomingEdges, function( e ){
				r.push( e.v1 )
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
	getNeighbours : function(){
		return this.getKinship( false, true, false )
	},	
	getSpouses : function(){
		return this.getKinship( false, false, true )
	},
	getChildren : function(){
		return this.getKinship( false, false, false )
	},
	getParents : function(){
		return this.getKinship( true, false, false )
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
		var r = new Graph.Vertex( this );
		return r
	}
} );

Graph.Vertex.isVisited = function( v ){
	return v.traversal_info.visited;
};
Graph.Vertex.markAsVisited = function( v ){
	v.traversal_info.visited = true;
};
Graph.Vertex.markAsNotVisited = function( v ){
	v.traversal_info.visited = false;
};

Graph.Edge = Class.extend( {
	initialize : function( spec ){
		this.v1 = spec.v1
		this.v2 = spec.v2
		this.directed = spec.directed
		this.style = spec.style
		this.layout_pos_x = spec.layout_pos_x
		this.layout_pos_y = spec.layout_pos_y
	},
	toString : function(){
		var edge_join = "->"
		switch( this.directed ){
		case 0: edge_join = "--"; break
		case 2: edge_join = "<->"; break
		}
		var v1id = this.v1.id
		var v2id = this.v2.id
		
		if( this.directed != 1 && (v1id.localeCompare( v2id ) > 0) ){
			var tmp = v1id
			v1id = v2id
			v2id = tmp
		}
		
		return encodeURIComponent(v1id).replace(edge_join,"["+edge_join+"]")+
			" "+edge_join+" "+encodeURIComponent(v2id).replace(edge_join,"["+edge_join+"]")
	}
} );

Graph.Edgetype = {
	Directed : 1,
	Undirected : 0,
	Bidirected : 2
}

Graph.Edge.Bidirected = Graph.Edge.extend( {
	initialize : function( spec ){
		this._super( spec );
		this.directed = Graph.Edgetype.Bidirected
	}
} );

Graph.Edge.Directed = Graph.Edge.extend( {
	initialize : function( spec ){
		this._super( spec );
		this.directed = Graph.Edgetype.Directed
	}
} );

Graph.Edge.Undirected = Graph.Edge.extend( {
	initialize : function( spec ){
		this._super( spec );
		this.directed = Graph.Edgetype.Undirected
	}
} );
