
/*  DAGitty - a browser-based software for causal modelling and analysis
 *  Copyright (C) 2010-2015 Johannes Textor, Benito van der Zander
 * 
 *   This program is free software; you can redistribute it and/or
 *   modify it under the terms of the GNU General Public License
 *   as published by the Free Software Foundation; either version 2
 *   of the License, or (at your option) any later version.
 * 
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 * 
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, write to the Free Software
 *   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA. */

/* Simple Hash implementation. */

/* globals _ */

function Hash(){
	this.kv = {}
}

_.extend( Hash.prototype, {
	contains : function( key ){
		return this.kv.hasOwnProperty( key )
	},
	get : function( key ){
		return this.kv[key]
	},
	set : function( key, value ){
		this.kv[key] = value
	},
	unset : function( key ){
		delete this.kv[key]
	},
	values : function(){
		return Object.keys( this.kv ).map( function(k){
			return this.kv[k]
		}, this )
	},
	keys : function(){
		return Object.keys( this.kv )
	},
	size : function(){
		return Object.keys( this.kv ).length
	}
} )

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
;(function(){ // eslint-disable-line
	var initializing = false, 
		fnTest = /xyz/.test(function(){xyz}) ? /\b_super\b/ : /.*/ //eslint-disable-line

	// The base Class implementation (does nothing)
	this.Class = function(){}

	// Create a new Class that inherits from this class
	this.Class.extend = function(prop) {
		var _super = this.prototype

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true
		var prototype = new this()
		initializing = false

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" &&
			typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name, fn){
				return function() {
					var tmp = this._super

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name]

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments)      
					this._super = tmp

					return ret
				}
			})(name, prop[name]) :
			prop[name]
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.initialize )
				this.initialize.apply(this, arguments)
		}

		// Populate our constructed prototype object
		Class.prototype = prototype

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class

		// And make this class extendable
		Class.extend = arguments.callee

		return Class
	}
})()/* This class provides a basic Graph datastructure. Graphs can contain 
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
		this.type = "digraph"
		this.name = null
		this.bb = null
		this.managed_vertex_properties = {}
		_.each(this.managed_vertex_property_names,function(p){
			this.managed_vertex_properties[p] = new Hash()
		},this)
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

	areAdjacent : function( v1, v2 ){
		v1 = this.getVertex(v1)
		v2 = this.getVertex(v2)
		if( _.any( _.map( v1.outgoingEdges, function(e){ return e.v2 == v2 } ) ) ){
			return true
		}
		return _.any( _.map( v1.incomingEdges, function(e){ return e.v1 == v2 } ) ) 
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
	
	getEdges : function(){
		return this.edges
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
		c.prototype["removeAll"+pcamel+"s"] = function(){ return this.removePropertyFromAllVertices( p ) }
	} )
})(Graph)


Graph.Vertex = Class.extend({
	initialize : function( spec ){
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
	initialize : function( spec ){
		this.v1 = spec.v1
		this.v2 = spec.v2
		this.directed = spec.directed
		this.style = spec.style
		this.layout_pos_x = spec.layout_pos_x
		this.layout_pos_y = spec.layout_pos_y
	},
	toString : function( ){
		var edge_join = "->"
		switch( this.directed ){
		case Graph.Edgetype.Undirected: edge_join = "--"; break
		case Graph.Edgetype.Bidirected: edge_join = "<->"; break
		case Graph.Edgetype.PartDirected: edge_join = "@->"; break
		case Graph.Edgetype.PartUndirected: edge_join = "@--"; break
		case Graph.Edgetype.Unspecified: edge_join = "@-@"; break

		}
		var v1id = GraphSerializer.dotQuoteVid(this.v1.id)
		var v2id = GraphSerializer.dotQuoteVid(this.v2.id)
		
		if( Graph.Edgetype.Symmetric[this.directed] && (v1id.localeCompare( v2id ) > 0) ){
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
	initialize : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Bidirected
	}
} )

Graph.Edge.Directed = Graph.Edge.extend( {
	initialize : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Directed
	}
} )

Graph.Edge.Undirected = Graph.Edge.extend( {
	initialize : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Undirected
	}
} )
/* This is a namespace containing various methods that analyze a given
 * graph. These methods do not change the graph. */

/* globals _,Graph,GraphTransformer,Hash */
/* exported GraphAnalyzer */

var GraphAnalyzer = {
	/*
		test if two graphs are equal, with equal id s
	*/
	equals : function( g, h ){
		if( g == null ){ return h == null }
		if( h == null ){ return false }
		return (g.vertices.keys().sort().join("\r") == h.vertices.keys().sort().join("\r") &&
			g.getEdges().map(function(e){return e.toString()}).sort().join("\r") == 
			h.getEdges().map(function(e){return e.toString()}).sort().join("\r"))
	},
	
	trekRule : function( g, v1, v2, use_ids_as_labels ){
		var vnr = [], i, j, vi, vj
		var vv = g.getVertices(), ee = g.getEdges(), parameters = []
		if( typeof use_ids_as_labels === "undefined" ){
			use_ids_as_labels = false
		}
		
		for( i = 0 ; i < vv.length ; i ++ ){
			if( use_ids_as_labels ){
				vnr[vv[i].id] = vv[i].id
			} else {
				vnr[vv[i].id] = i
			}
			parameters.push( "v"+vnr[vv[i].id] ) 
		}
		
		var pars = function( e, c ){
			if( e.id ){ return e.id }
			vi = g.getVertex(e.v1)
			vj = g.getVertex(e.v2)
			if( c == "c" ){
				if( vi.id < vj.id ){
					return c+vnr[vi.id]+c+vnr[vj.id]
				} else {
					return c+vnr[vj.id]+c+vnr[vi.id]
				}
			} else {
				return c+vnr[vi.id]+c+vnr[vj.id]
			}
		}
		
		for( i = 0 ; i < ee.length ; i ++ ){
			var e = ee[i]
			if( e.directed == Graph.Edgetype.Bidirected )
				parameters.push( pars(e,"c") )
			if( e.directed == Graph.Edgetype.Directed )
				parameters.push( pars(e,"b") )
		}
		
		var gtrek = GraphTransformer.trekGraph( g, "up_", "dw_" )
		
		var treks = []
		
		var visit = function( v, t, trek ){
			if( v == t )
			{
				treks.push( trek.clone() )
				return
			}
			_.each( v.getChildren(), function( vc ){
				if( !Graph.Vertex.isVisited( vc ) ){
					Graph.Vertex.markAsVisited( vc )
					trek.push( vc.id )
					visit( vc, t, trek )
					Graph.Vertex.markAsNotVisited( vc )
					trek.pop()
				}
			} )
		}
		
		visit( gtrek.getVertex("up_"+v1.id), 
			gtrek.getVertex("dw_"+v2.id), 
			["up_"+v1.id] )
		
		var trek_monomials = []
		
		for( i = 0 ; i < treks.length ; i ++ ){
			trek_monomials[i] = []
			for( j = 0 ; j < treks[i].length-1 ; j ++ ){
				var v1_pre = treks[i][j].substring( 0, 3 )
				var v1_id = treks[i][j].substring( 3 )
				var v2_pre = treks[i][j+1].substring( 0, 3 )
				var v2_id = treks[i][j+1].substring( 3 )
				if( v1_pre == v2_pre ){
					if( v1_pre == "up_" )
						trek_monomials[i].push( 
								pars(g.getEdge(v2_id,v1_id,Graph.Edgetype.Directed),"b"))
						else
							trek_monomials[i].push( 
								pars(g.getEdge(v1_id,v2_id,Graph.Edgetype.Directed),"b"))
				} else {
					if( v1_id == v2_id )
						trek_monomials[i].push( 
							/*<->*/"v"+vnr[v1_id] )
					else{
						trek_monomials[i].push( /*<-->*/
							pars(g.getEdge(v1_id,v2_id,Graph.Edgetype.Bidirected),"b"))
					}
				}
			}
		}
		return [trek_monomials,parameters]
	},
	
	vanishingTetrads : function( g, nr_limit, type ){
		var r = []
		g = GraphTransformer.canonicalDag(g).g
		var gtrek = GraphTransformer.trekGraph( g, "up_", "dw_" )
		gtrek.addVertex("s")
		gtrek.addVertex("t")	
		var latents = g.getLatentNodes()
		var is_latent = []; for( var i = 0 ; i < latents.length ; i ++ ){ is_latent[latents[i].id]=1 }
		
		var vv = _.pluck(_.reject(g.getVertices(),function(v){return is_latent[v.id]}),"id"), 
			i1, i2, i3, i4, iside, jside, s = gtrek.getVertex("s"), t = gtrek.getVertex("t")
		
		function examineQuadruple( i1, i2, j1, j2 ){
			var pi, pj
			iside = [ gtrek.getVertex( "up_"+i1 ),
				gtrek.getVertex( "up_"+i2 ) ]
			jside = [ gtrek.getVertex( "dw_"+j1 ),
				gtrek.getVertex( "dw_"+j2 ) ]
			if( type == "between" || type == "epistemic" ){
				pi = _.pluck(g.parentsOf( g.getVertex([i1,i2]) ),"id")
				pj = _.pluck(g.parentsOf( g.getVertex([j1,j2]) ),"id")
				if( type == "between" && ( pi.length != 1 || pj.length != 1 || pi[0] == pj[0] ) ){
					return
				}
				if( type == "epistemic" && 
					!( ( pi.length == 1 && pj.length == 2 ) || 
						( pi.length == 2 && pj.length == 1 ) ) ){
					return
				}
			}
			gtrek.addEdge( s, iside[0], Graph.Edgetype.Directed )
			gtrek.addEdge( s, iside[1], Graph.Edgetype.Directed )

			gtrek.addEdge( jside[0], t, Graph.Edgetype.Directed )
			gtrek.addEdge( jside[1], t, Graph.Edgetype.Directed )

			if( GraphAnalyzer.minVertexCut( gtrek, [s], [t] ) <= 1 ){
				r.push( [i1, j1, j2, i2] ) // lisrel convention
			}

			gtrek.deleteEdge( s, iside[0], Graph.Edgetype.Directed )
			gtrek.deleteEdge( s, iside[1], Graph.Edgetype.Directed )

			gtrek.deleteEdge( jside[0], t, Graph.Edgetype.Directed )
			gtrek.deleteEdge( jside[1], t, Graph.Edgetype.Directed )

		}

		var p1, p2, p3, p4	
		for( i1 = 0 ; i1 < vv.length ; i1 ++ ){
			p1 = _.pluck(g.getVertex(vv[i1]).getParents(),"id")
			if( type && ( p1.length != 1 ) ) continue
			for( i2 = i1+1 ; i2 < vv.length ; i2 ++ ){
				p2 = _.pluck(g.getVertex(vv[i2]).getParents(),"id")
				if( type && ( p2.length != 1 ) ) continue
				for( i3 = i2+1 ; i3 < vv.length ; i3 ++ ){
					p3 = _.pluck(g.getVertex(vv[i3]).getParents(),"id")
					if( type && ( p3.length != 1 ) ) continue
					for( i4 = i3+1 ; i4 < vv.length ; i4 ++ ){
						p4 = _.pluck(g.getVertex(vv[i4]).getParents(),"id")
						if( type && ( p4.length != 1 ) ) continue
						if( type == "within" && 
							_.intersection(p1,p2,p3,p4).length == 0 ) continue
						examineQuadruple( vv[i1], vv[i2], vv[i3], vv[i4] )
						examineQuadruple( vv[i1], vv[i3], vv[i2], vv[i4] )
						examineQuadruple( vv[i1], vv[i4], vv[i2], vv[i3] )
						if( nr_limit -- < 0 ) return r
					}
				}
			}
		}
		
		return r
	},
	
	minVertexCut : function( g, sources, targets ){
		var i, j, vv, ee, e, is_target = [], s, t
		
		if( !sources ) sources = g.getSources()
		if( !targets ) targets = g.getTargets()
				
		for( i = 0 ; i < sources.length ; i ++ ){
			s = sources[i]
			for( j = 0 ; j < targets.length ; j ++ ){
				t = targets[j]
				if( ( s.id == t.id ) || ( g.getEdge( s.id, t.id ) ) )
					return undefined
				is_target[t.id] = true
			}
		}
				
		var flowE = [], flowV = [], parents = []
				
		vv = g.getVertices()
		for( i = 0 ; i < vv.length ; i ++ ){
			flowV[ vv[i].id ] = 0
			if( flowE[ vv[i].id ] === undefined ) flowE[ vv[i].id ] = []
		}
				
		ee = g.getEdges()
		for( i = 0 ; i < ee.length ; i ++ ){
			e = ee[i]
			flowE[ e.v1.id ][ e.v2.id ] = 0
		}
				
		var findAugmentingPath = function( vqueue ){
			var i, vnext, qfront = 0, forwards
			var dirqueue = []
			for( i = 0 ; i < vqueue.length ; i ++ ){
				dirqueue[i] = 1
			}
					
			var pars = [ {}, {} ]
			for( i = 0 ; i < vqueue.length ; i ++ ) pars[1][vqueue[i]] = -1
						
			function checkPath( vn, fw ){
				if( pars[fw?1:0][vn.id] === undefined ){
					vqueue.push( vn.id )
					dirqueue.push( fw?1:0 )
					pars[fw?1:0][vn.id] = qfront
				}
			}
						
			while( qfront < vqueue.length ){
				vid = vqueue[qfront]
				forwards = dirqueue[qfront]
				// vqueue = [vstart.id], dirqueue = [1],
				if( is_target[vid] && forwards ){
					var v2id = t.id, dir = dirqueue[qfront]
					parents = [v2id]
					while( pars[dir][vqueue[qfront]] >= 0 ){
						parents.unshift( dir )
						qfront = pars[dir][vqueue[qfront]]
						dir = dirqueue[qfront]
						parents.unshift( vqueue[qfront] )
					}
					return true
				}
								
				if( flowV[ vid ] ){
					// If there has been flow, we can only move out
					// in the opposite direction that we came in.
					if( forwards ){
						vnext = g.getVertex(vid).getParents()
						for( i = 0 ; i < vnext.length ; i ++ ){
							/// going backwards only if previously went forwards
							if( flowE[vnext[i].id][vid] ){
								checkPath( vnext[i], false )
							}
						}
					} else {
						vnext = g.getVertex(vid).getChildren()
						for( i = 0 ; i < vnext.length ; i ++ ){
							checkPath( vnext[i], true )
						}
					}
									
				} else {
					// If there is no flow in this vertex, none
					// of the parent edges have flow. We can only move out
					// forwards. Also, we must have come in forwards.
					vnext = g.getVertex(vid).getChildren()
					for( i = 0 ; i < vnext.length ; i ++ ){
						checkPath( vnext[i], true )
					}
				}
				qfront ++
			}
						
			return false
		}
				
		var vid, trials = g.getVertices().length
		i = 0
		while( findAugmentingPath( _.pluck(sources,"id") ) && --trials > 0 ){
			i++
			for( j = 2 ; j < parents.length-1 ; j += 2 ){
				if( parents[j-1] && parents[j+1] ){ 
					flowV[parents[j]] = 1
				}
				if( !parents[j-1] && !parents[j+1] ){ 
					flowV[parents[j]] = 0
				}
			}
			for( j = 1 ; j < parents.length ; j += 2 ){
				if( parents[j] ){
					flowE[parents[j-1]][parents[j+1]] ++
				} else {
					flowE[parents[j+1]][parents[j-1]] --
				}
			}
			parents = []
		}
		return i
	},

	isAdjustmentSet : function( g, Z ){
		var gtype = g.getType()
		Z = _.map( Z, g.getVertex, g )
		if( gtype != "dag" && gtype != "pdag" && gtype != "mag" && gtype != "pag" ){
			throw( "Cannot compute adjustment sets for graph of type "+gtype )
		}
		if( g.getSources().length == 0 || g.getTargets().length == 0 ){
			return false
		}

		if( _.intersection( this.dpcp(g), Z ).length > 0 ){
			return false
		}
		var gbd = GraphTransformer.backDoorGraph(g)
		Z = _.map( Z, gbd.getVertex, gbd )
		return !this.dConnected( gbd, gbd.getSources(), gbd.getTargets(), Z )
	},
	
	listMsasTotalEffect : function( g, must, must_not ){
		var gtype = g.getType()
		if( gtype != "dag" && gtype != "pdag" && gtype != "mag" && gtype != "pag" ){
			throw( "Cannot compute total affect adjustment sets for graph of type "+gtype )
		}
		if( gtype == "pdag" ){
			g = GraphTransformer.cgToRcg( g )
		}	
		if( !g ){ return [] }
	
		if(GraphAnalyzer.violatesAdjustmentCriterion(g)){ return [] }
		var adjusted_nodes = g.getAdjustedNodes()
		var latent_nodes = g.getLatentNodes().concat( this.dpcp(g) )
		
		var gam = GraphTransformer.moralGraph( 
			GraphTransformer.ancestorGraph( 
			GraphTransformer.backDoorGraph(g) ) )
				
		if( must )
			adjusted_nodes = adjusted_nodes.concat( must )
		if( must_not )
			latent_nodes = latent_nodes.concat( must_not )
		
		return this.listMinimalSeparators( gam, adjusted_nodes, latent_nodes )
	},

	canonicalAdjustmentSet : function( g, Z ){
		var Z = _.difference( g.anteriorsOf( _.union(g.getSources(), g.getTargets() ) ),
			_.union( g.getLatentNodes(),
				g.getSources(), g.getTargets(),
				GraphAnalyzer.dpcp( g ) ) )
		if( GraphAnalyzer.isAdjustmentSet( g, Z ) ){
			return [Z]
		} else {
			return []
		}
	},
	
	listMsasDirectEffect : function( g, must, must_not ){
		var gtype = g.getType()
		if( gtype != "dag" ){
			throw( "Cannot comute direct-effect adjustment sets for graphs of type "+gtype )
		}
		if( gtype == "pdag" ){
			g = GraphTransformer.cgToRcg( g )
		}
		if( !g ){ return [] }

		var adjusted_nodes = g.getAdjustedNodes()
		var de_y = g.descendantsOf( _.intersection( g.descendantsOf( g.getSources() ),
			g.getTargets() ) )
		if( _.intersection( de_y, adjusted_nodes ).length > 0 ){
			return []
		}
		var latent_nodes = g.getLatentNodes().concat( de_y )
		var gam =  GraphTransformer.moralGraph(
			GraphTransformer.ancestorGraph(
				GraphTransformer.indirectGraph(g) ) )
	
		if( must )
			adjusted_nodes = adjusted_nodes.concat( must )
		if( must_not )
			latent_nodes = latent_nodes.concat( must_not )
			
		return this.listMinimalSeparators( gam, adjusted_nodes, latent_nodes )
	},
	
	listDseparators : function( g, must, must_not, max_nr ){
		var adjusted_nodes = g.getAdjustedNodes()
		var latent_nodes = g.getLatentNodes()
		
		var gam = GraphTransformer.moralGraph( GraphTransformer.ancestorGraph(g) )
		
		if( must )
			adjusted_nodes = adjusted_nodes.concat( must )
		if( must_not )
			latent_nodes = latent_nodes.concat( must_not )

		return this.listMinimalSeparators( gam, adjusted_nodes, latent_nodes, max_nr )
	},

	listBasisImplications : function( g ){
		var r = []
		var vv = g.vertices.values()
		var i
		_.each( vv, function(v){
			var nondescendants = _.difference( vv, g.descendantsOf( [v] ) )
			var parents = g.parentsOf( [v] )
			var sepnodes = _.difference( nondescendants, parents )
			if( sepnodes.length > 0 ){
				r.push( [v.id, _.pluck(sepnodes,"id"),
					[parents]] )
			}
		} )
		return r
	},
	
	listMinimalImplications : function( g, max_nr ){
		var r = []
		var g2 = g.clone()
		var vv = g2.vertices.values()
		// this ignores adjusted vertices for now 
		for( var i = 0 ; i < vv.length ; i ++ ){
			g2.removeAllAdjustedNodes()
		}
		var n = 0
		for( i = 0 ; i < vv.length ; i ++ ){
			for( var j = i+1 ; j < vv.length ; j ++ ){
				if( !g2.isLatentNode( vv[i] ) && !g2.isLatentNode( vv[j] ) 
					&& !g2.getEdge( vv[i].id, vv[j].id ) && !g2.getEdge( vv[j].id, vv[i].id ) ){
					g2.removeAllSources().addSource( g2.getVertex( vv[i].id ) )
					g2.removeAllTargets().addTarget( g2.getVertex( vv[j].id ) )
					var seps = GraphAnalyzer.listDseparators( g2, [], [], max_nr-n )
					if( seps.length > 0 ){
						seps = _.map( seps, function(s){
							return g.getVertex( _.pluck(s,"id") )
						})
						r.push( [vv[i].id, vv[j].id, seps] )
						n += seps.length
						if( n >= max_nr ){
							return r
						}
					}
				}
			}
		}
		return r
	},
	
	/** Given an undirected graph, this function checks whether the graph could
	  * enocde the correlations entailed by a DAG on the same variables.
	  * If so, it returns a CPDAG describing the class of edge-maximal DAGs
	  * that are consistent with the input graph. */
	isDG : function( g ){
		var cpdag = GraphTransformer.dependencyGraph2CPDAG( g ), p1, p2
		if( g.edges.all( function( e ){
			if( typeof cpdag.getEdge( e.v1.id, e.v2.id, 
					Graph.Edgetype.Undirected ) == "undefined" ){ 
				p1 = cpdag.getVertex(e.v1.id).getParents().pluck("id")
				p2 = cpdag.getVertex(e.v2.id).getParents().pluck("id")
				if( !p1.include(e.v2.id) && !p2.include(e.v1.id) 
						&& p1.intersect(p2).length == 0 ){
					return false
				}
			}
			return true
		} ) ){
			return cpdag
		}
		return false
	},
	
	/**
	 * Extracts the path pairs from the transformation by Eppstein, implemented
	 * as "pathPairGraph" in GraphTransformer.js
	 * 
	 * */
	listPathPairs : function( g ){
		var paths = g.listPaths().split("\n")
		var r = ""
		_.each( paths, function( p ){
			if( p == "..." ){
				r += "\n..."
			} else {
				var p_arr = p.split("->").slice(1).map( function(s){ return s.split(":") } )
				var left_side = _.uniq(_.pluck(p_arr,"0")).slice(1).join("->")
				var right_side = _.uniq(_.pluck(p_arr,"1")).reverse().join("<-")
				r += ( r == "" ? "" : "\n" ) + right_side + "->" + left_side
			}
		} )
		return r
	},
	
	directEffectEqualsTotalEffect : function( g ){
		return ( _.chain(g.childrenOf(g.getSources()))
			.difference( g.getSources() )
			.difference( g.getTargets() ).value().length == 0 )
	},
	
	violatesAdjustmentCriterion : function( g ){
		return _.some( this.dpcp(g), g.isAdjustedNode, g )
	},

	/** 
		Returns all nodes lying on proper causal paths including the nodes in X and Y.
		
		X and Y are optional, the exposures and outcomes defined in g are 
		taken by default.
	 */	
	properPossibleCausalPaths : function( g, X, Y ){
		var i, in_X = [], in_Y = [], visited = {}, reaches_target = {}, r = [],
			possible = true // this should become a parameter
		if( arguments.length == 1 ){
			X = g.getSources()
			Y = g.getTargets()
		}
		for( i = 0 ; i < X.length ; i ++ ){
			in_X[ X[i].id ] = 1
		}
		var visit = function( v ){
			if( !visited[v.id] ){
				visited[v.id] = true
				r.push(v)
				if( !in_X[v.id] ){
					var parents = v.getParents()
					if( possible ){
						parents = _.union( parents, v.getNeighbours() )
					}
					_.each( parents, visit )	
				}
			}
		}
		_.each( Y, visit )
		return _.intersection(r,g.posteriorsOf(X))
	},
	
	/*
		Possible descendants of nodes on proper causal paths, except X.
	 */
	dpcp : function( g, X, Y ){
		if( arguments.length < 2 ){
			X = g.getSources()
		}
		if( arguments.length < 3 ){
			Y = g.getTargets()
		}
		var gn
		if( g.getType() == "pag" ){
			gn = GraphTransformer.pagToPdag( g )
			gn.setType("pag")
		} else {
			gn = g
		}
		X = gn.getVertex(_.pluck(X,"id"))
		Y = gn.getVertex(_.pluck(Y,"id"))

		return g.getVertex( _.pluck(gn.posteriorsOf( _.difference( this.properPossibleCausalPaths( gn, X, Y ), 
			X ) ), "id" ) )
	},
	
	nodesThatViolateAdjustmentCriterion : function( g ){
		return _.intersection( this.dpcp(g), g.getAdjustedNodes() )
	},
	
	nodesThatViolateAdjustmentCriterionWithoutIntermediates : function( g ){
		var is_on_causal_path = []
		var set_causal =  function(v){ is_on_causal_path[v.id]=true }
		_.each( this.properPossibleCausalPaths(g), set_causal )
		var is_violator = function(v){ return g.isAdjustedNode( v ) && !is_on_causal_path[v.id] }
		return _.filter( this.dpcp(g), is_violator )
	},
	
	intermediates : function( g ){
		return _.chain( g.descendantsOf( g.getSources() ))
		.intersection( g.ancestorsOf( g.getTargets() ) )
		.difference( g.getSources() )
		.difference( g.getTargets() ).value()
	},
	
	/** 
	    Find all simple paths between X (default exposure) and Y (default outcome) in the
        given graph. Returns results as an array of graphs, each on the same node set as
        the original graph.
	 */ 
	listPaths: function( g, directed, limit, X, Y ){
		var r=[], gr, visited
		if( arguments.length < 2 ){
			directed = true
		}
		if( arguments.length < 3 ){
			limit=100
		}
		if( arguments.length < 5 ){
			X = g.getSources(); Y = g.getTargets()
		}
		if( X.length == 0 || Y.length == 0 ){
			return ""
		}
		
		gr = g.clone(false)
		visited = []
		
		var followEdges = function( u, v, kin, edgetype, reverse ){
			var st = []
			_.each( u[kin](), function( v2 ){
				if( !visited[v2.id] ){
					if( reverse ){
						st=[v2.id,u.id]
					} else {
						st=[u.id,v2.id]
					}
					visited[v2.id]=1
					gr.addEdge( st[0], st[1], Graph.Edgetype[edgetype] )
					listPathsRec( v2, v )
					gr.deleteEdge( st[0], st[1], Graph.Edgetype[edgetype] )
					visited[v2.id]=0
				}
			} )
		}

		var listPathsRec = function( u, v ){
			if( r.length >= limit ){
				return
			}
			if( u==v ){
				r.push(gr.clone())
			} else {
				followEdges( u, v, "getChildren", "Directed", false )
				if( !directed ){
					followEdges( u, v, "getParents", "Directed", true )
					followEdges( u, v, "getNeighbours", "Undirected", false )
					followEdges( u, v, "getSpouses", "Bidirected", false )
				}
			}
		}

		_.each( X, function(u){
			_.each( Y, function(v){
				try{
					visited[u.id]=1
					listPathsRec( u, v )
					visited[u.id]=0
				} catch( e ) {
					return r
				}
			})
		})

		return r
	},
	
	closeSeparator : function( g, y, z ){
		var g_m = GraphTransformer.moralGraph(
			GraphTransformer.ancestorGraph( g, [ y, z ]  ) )

		var r = [], blocked = [], v, w, vN, i, found=true
		
		y = g_m.getVertex( y.id ); z = g_m.getVertex( z.id )
		
		while( found ){
			var visited = []
			var discovered_from = {}; discovered_from[y] = false
			var q = [y]
			found = false
			while( q.length > 0 ){
				v = q.shift()
				if( v.id == z.id ){
					found = true; break
				}
				if( !visited[v.id] && !blocked[v.id] ){
					visited[v.id] = true
					vN = g_m.neighboursOf( [v] )
					for( i = 0 ; i < vN.length ; i ++ ){
						w = vN[i]
						if( w != v && !visited[w.id] ){
							discovered_from[ w.id ] = v.id
							q.push( w ) 
						}
					}
				}
			}
		
			if( found ) {
				v = z.id; w = false
				while( v != y.id ){
					if( !g_m.isLatentNode( g_m.getVertex( v ) ) ){
						w = v
					}
					v = discovered_from[v]
				}
				if( w === false || w === z.id ){
					return false
				}
				r.push( g.getVertex( w ) )
				blocked[w] = true
			}
		}
		
		return r
	},
	
	/** d-Separation test via Shachter's "Bayes-Ball" BFS.
	 * (actually, implements m-separation which is however not guaranteed to be meaningful
	 * in all mixed graphs).
	 * If Y is nonempty, returns true iff X and Z are d-separated given Z.
	 * If Y is empty ([]), return the set of vertices that are d-connected 
	 * to X given Z.
	 */
	dConnected : function( g, X, Y, Z, AnZ ){
		var forward_queue = []
		var backward_queue = []
		var forward_visited ={}
		var backward_visited = {}
		var i, Y_ids = {}, Z_ids = {}, AnZ_ids = {}, v, vv
		if( typeof AnZ == "undefined" ){	
			AnZ = g.ancestorsOf( Z )
		}
		for( i = 0 ; i < X.length ; i ++ ){
			backward_queue.push( X[i] )
		}
		for( i = 0 ; i < Y.length ; i ++ ){
			Y_ids[Y[i].id] = 1
		}
		for( i = 0 ; i < AnZ.length ; i ++ ){
			AnZ_ids[AnZ[i].id] = 1
		}
		for( i = 0 ; i < Z.length ; i ++ ){
			Z_ids[Z[i].id] = 1
		}

		while( forward_queue.length + backward_queue.length > 0 ){
			if( forward_queue.length > 0 ){
				v = forward_queue.pop()
				forward_visited[v.id]=1
				if( Y_ids[v.id] ) return true
				if( AnZ_ids[v.id] ){
					vv = v.getParents()
					for( i = 0 ; i < vv.length ; i ++ ){
						if( !backward_visited[vv[i].id] ){
							backward_queue.push( vv[i] )
						}
					}
					vv = v.getSpouses()
					for( i = 0 ; i < vv.length ; i ++ ){
						if( !forward_visited[vv[i].id] ){
							forward_queue.push( vv[i] )
						}
					}
				} 
				if( !Z_ids[v.id] ){
					vv = _.union( v.getChildren(), v.getNeighbours() )
					for( i = 0 ; i < vv.length ; i ++ ){
						if( !forward_visited[vv[i].id] ){
							forward_queue.push( vv[i] )
						}
					}
				}
			}
			if( backward_queue.length > 0 ){
				v = backward_queue.pop()
				backward_visited[v.id]=1
				if( Y_ids[v.id] ) return true
				if( Z_ids[v.id] ) continue
				vv = _.union( v.getChildren(), v.getSpouses() )
				for( i = 0 ; i < vv.length ; i ++ ){
					if( !forward_visited[vv[i].id] ){
						forward_queue.push( vv[i] )
					}
				}
				vv = _.union( v.getParents(), v.getNeighbours() )
				for( i = 0 ; i < vv.length ; i ++ ){
					if( !backward_visited[vv[i].id] ){
						backward_queue.push( vv[i] )
					}
				}
			}
		}
		if( Y.length > 0 ){
			return false
		} else {
			return g.getVertex(
				_.union( Object.keys( forward_visited ), Object.keys( backward_visited ) ) 
			)
		}
	},
	
	ancestralInstrument : function( g, x, y, z, 
			g_bd, de_y ){
		if( arguments.length < 5 ){
			g_bd = GraphTransformer.backDoorGraph( g, [x], [y] )
		}
		y = g_bd.getVertex(y.id); z = g_bd.getVertex(z.id)
		if( arguments.length < 6 ){
			de_y = g_bd.descendantsOf( [y] )
		}
		var W = GraphAnalyzer.closeSeparator( g_bd, y, z )
		if( W === false ){ return false }
		if( _.intersection( W, de_y ).length > 0 ){ return false }
		if( _.intersection( W, [x] ).length === 1 ){ return false }
		if( !GraphAnalyzer.dConnected( g_bd, [x], [z], W ) ){
			return false			
		} else {
			return W.map( function(v){return g.getVertex(v.id)} )
		} 
	},
	
	conditionalInstruments : function( g, x, y ){
		if( arguments.length < 2 ){
			x = g.getSources()
			if( x.length > 1 ) return false
			x = x[0]
		}
		if( arguments.length < 3 ){
			y = g.getTargets()
			if( y.length > 1 ) return false
			y = y[0]
		}
		g = GraphTransformer.canonicalDag( g ).g
		x = g.getVertex(x)
		y = g.getVertex(y)
		var vv = _.difference( g.getVertices(), [x,y] )
		var i, r = [], W
		var g_bd = GraphTransformer.backDoorGraph( 
			g, [x], [y] )
		/* make sure that mediators are not conditioned on */
		var mediators = GraphAnalyzer.intermediates( g )
		for( i = 0 ; i < mediators.length ; i ++ ){
			g_bd.addLatentNode( g_bd.getVertex( mediators[i].id ) )
		}
		var de_y = g_bd.descendantsOf( [g_bd.getVertex(y)] )
		for( i = 0 ; i < vv.length ; i ++ ){
			if( !g.isLatentNode( vv[i] ) && !g.isSelectionNode( vv[i] ) ){
				W = GraphAnalyzer.ancestralInstrument( g, x, y, vv[i], g_bd, de_y )
				if( W !== false ){
					r.push( [vv[i],W] )
				}				
			}
		}
		return r
	},
	
	/** 
	 * This function lists all minimal vertex separators between 
	 * the source and the target in this graph. Remember that a 
	 * vertex separator with respect to source s and target t 
	 * (which can be swapped) is a set of *vertices* whose removal
	 * would result in a graph where s and t are no longer connected.
	 * 
	 * The two optional parameters are two lists of vertices which 
	 * must or must not be included in each separator. Note that 
	 * 
	 * (a) if _must contains any vertices, the resulting separators
	 * 	will be minimal only in the sense that no vertex can be
	 * 	removed unless one of those vertices is also removed; and
	 * 	
	 * (b) if _must_not contains any vertices, the output may be 
	 *     empty even if s-t-separators exist in the graph.
	 * 
	 * No vertices other than those provided will automatically be
	 * inserted into _must and/or _must_not.
	 * 
	 * This is a straightforward extension of Takata's algorithm. 
	 * See Takata K, Disc Appl Math 158:1660-1667, 2010.
	 */                         
	listMinimalSeparators: function( g, _must, _must_not, max_nr ){
		if( g.getSources().length == 0 || g.getTargets().length == 0 ){
			return []
		}
		var Uh = new Hash()
		_.each( g.getTargets(), function( v ){ Uh.set(v.id,v) } )
		_.each( g.neighboursOf( g.getTargets() ), function( v ){ Uh.set(v.id,v) } )
		var U = Uh.values()
		
		var R = []
		var must = []
		if( _must ){
			_.each( _must, function(v){must.push(g.getVertex(v.id))})
		}
		var must_not = []
		if( _must_not ){
			_.each( _must_not, function(v){must_not.push(g.getVertex(v.id))})
		}
		var realN = function( V ){
			g.clearVisited()
			_.each( V.concat(must), function(v){
				Graph.Vertex.markAsVisited(v)
			} )
			var r = []
			var q = V.slice()
			var mark_visited_and_push = function(w){
				if( !Graph.Vertex.isVisited( w ) ){
					Graph.Vertex.markAsVisited(w)
					if( _.contains(must_not,w) ){
						q.push( w )
					} else {
						r.push( w )                      
					}
				}
			} 
			while( q.length > 0 ){
				_.each( q.pop().getNeighbours(), mark_visited_and_push )
			}
			return r
		}
		
		var nearSeparator =  function( A, b ){
			var NA = realN( A )
			var C = GraphAnalyzer.connectedComponentAvoiding( g, b, NA.concat(must) )
			return realN( C )
		}
		
		var listMinSep = function( A, U ){
			if( R.length >= max_nr ) return
			var SA = nearSeparator( A, g.getTargets() )
			var Astar = GraphAnalyzer.connectedComponentAvoiding( g, g.getSources(),
				SA.concat(must) )
			if( _.intersection( Astar, U ).length == 0 ){
				var NA = realN(Astar)
				NA = _.difference( NA, U )
				if( NA.length > 0 ){
					var v = NA[0]
					Astar.push(v)
					listMinSep( Astar, U )
					Astar.pop()
					U.push(v)
					listMinSep( Astar, U )
					U.pop()
				} else {
					R.push( SA.concat(must) )
				}
			}
		}
		listMinSep( g.getSources(), U )
		return R
	},

	/** 
	 *  Computes a topological ordering of this graph, which 
	 *  is only meaningful if this graph is a DAG (in mixed
	 *  graphs, undirected edges are not used in the traversal). 
	 * 
	 *  Every vertex will be assigned a "topological_index"
	 *  which is a number i that is lower than the i of any of
	 *  its children. 
	 * 
	 *  Returns an array mapping vertex IDs to topological indices.
	 */
	topologicalOrdering: function( g ) {
		var ind = { i : g.vertices.size() }
		var topological_index = {}
		var visited = {}
		var visit = function( v ){
			if( !visited[v.id] ){
				visited[v.id] = true
				var children = v.getChildren()
				if( g.isSource(v) || g.isTarget(v) || children.length > 0 ||
					v.getParents().length > 0 ){ 
					for( var i = 0 ; i < children.length ; i ++ ){
						visit( children[i] )
					} 
					topological_index[v.id] = ind.i
					ind.i--
				}
			}
		}
		var vv = g.vertices.values() 
		for( var j = 0 ; j < vv.length ; j ++ ){
			visit( vv[j] )
		}
		return topological_index
	},

	bottleneckNumbers : function( g, topological_index ) {
		var s0 = g.getSources()[0]
		var t0 = g.getTargets()[0]
		var bottleneck_number = {}, reaches_source = {}, reaches_target = {},
			visited = {}
		_.each( g.ancestorsOf( g.getSources(),
			function(){
				var adj = g.getAdjustedNodes()
				g.clearTraversalInfo()
				_.each( adj, function(v){ Graph.Vertex.markAsVisited(v) })
			} ), function(v){
				reaches_source[v.id] = true
			})
		_.each( g.ancestorsOf( g.getTargets(),
			function(){
				var adj = g.getAdjustedNodes()
				g.clearTraversalInfo()
				_.each( adj, function(v){ Graph.Vertex.markAsVisited(v) })
			} ), function(v){
				reaches_target[v.id] = true
			})
		var vv = g.vertices.values()
		var bn_s = topological_index[s0.id]
		var bn_t = topological_index[t0.id]
		_.each( vv, function(v){
			if( reaches_source[v.id] && 
				!reaches_target[v.id] ){
				bottleneck_number[v.id] = bn_s
			} else if(!reaches_source[v.id] && 
				reaches_target[v.id] ){
				bottleneck_number[v.id] = bn_t
			} else {
				bottleneck_number[v.id] = undefined
			}
		})
		_.each( g.getSources(), function(s){
			topological_index[s.id] = bn_s
			bottleneck_number[s.id] = bn_s
			visited[s.id] = true
		})
		_.each( g.getTargets(), function(t){
			bottleneck_number[t.id] = bn_t
			topological_index[t.id] = bn_t
			visited[t.id] = true
		})
		var visit = function( v ){
			if( !visited[v.id] && 
				(reaches_source[v.id] || reaches_target[v.id]) ){
				visited[v.id]=true
				var children = _.filter( v.getChildren(), function(v){
					return reaches_source[v.id] ||
						reaches_target[v.id]
				})
				_.each( children, visit)
				if( children.length > 1 && _.some( children,
					function(v2){ return bottleneck_number[v2.id] != 
						bottleneck_number[children[0].id] } ) ){
					bottleneck_number[v.id] = topological_index[v.id]
				} else {
					bottleneck_number[v.id] = bottleneck_number[children[0].id]
				}
			}
		}
		_.each( vv, visit )
		return bottleneck_number
	},
	
	/** 
		returns an array of vertex arrays 
		only undirected edges are considered
	*/
	connectedComponents : function( g, kinship_function ){
		if( kinship_function == null ){
			kinship_function = "getNeighbours"
		}
		var visited = {}
		var vv = g.vertices.values()
		var component = function(v){
			var q = [v], r =[v]
			while( q.length > 0 ){
				var v2 = q.pop()
				visited[v2.id] = true
				_.each( v2[kinship_function](), function(vn2){
					if( !visited[vn2.id] ){
						q.push(vn2)
						r.push(vn2)
						visited[vn2.id] = true
					}
				} )
			}
			return r
		}
		var r = []
		_.each( vv, function(v){
			if( !visited[v.id] ){
				r.push( component(v) )
			}
		})
		return r
	},
	
	/***
	 *  Returns the vertices of connected component(s) of all 
	 *  vertices in "V" in the subgraph "G-U" where U is
	 *  a subset of vertices 
	 */
	connectedComponentAvoiding : function( g, V, U ){
		var visited = [], q = [], r = []
		if( U instanceof Array ){
			_.each( U, function(u){ visited[u.id]=1 })
		}
		_.each( V, function(v){ visited[v.id]=1; r.push(v); q.push(v) } )
		var mark_visited_and_push = function(w){
			if( !visited[w.id] ){
				visited[w.id]=1
				q.push(w)
				r.push(w)
			}
		}
		while( q.length > 0 ){
			_.each( q.pop().getNeighbours(), mark_visited_and_push )
		}
		return r
	},
	
	/***
	 * Returns the block tree given a pre-computed list of 
	 * biconnected components of graph g. The pre-computation of 
	 * biconnected components is assumed to have left the Boolean
	 * property "is_articulation_point" on every vertex object
	 * and the integer "component_index" on every edge.
	 * 
	 * If the second argument is not given, then the biconnected
	 * components are re-computed from scratch.
	 */
	blockTree : function( g, bicomps ) {
		if( bicomps == null ){
			bicomps = this.biconnectedComponents( g )
		}
		var bt = new Graph()
		_.each( bicomps, function( edge_list ){
			bt.addVertex( new Graph.Vertex( { id : "C"+edge_list[0].component_index } ) )
		} )
		_.each( g.vertices.values(), function( v ){
			if( v.is_articulation_point ){
				bt.addVertex( new Graph.Vertex( { id : "A"+v.id } ) )
				var vn = bt.getVertex("A"+v.id)
				vn.is_articulation_point = true
				_.each( v.getNeighbours(), function( n ){
					var e = g.getEdge( v, n, Graph.Edgetype.Undirected )
					bt.addEdge( vn, bt.getVertex("C"+e.component_index),
						Graph.Edgetype.Undirected ) 
				} )
			}
		} )
		return bt
	},
	
	/**
	 *  Returns the biconnected components of an undirected graph.
	 */
	biconnectedComponents : function( g ){
		var q = []
		var r = []
		var time = 0
		var vv = g.vertices.values()
		_.each( vv, function(v){
			v.traversal_info.parent = 0
			v.traversal_info.dtime = 0
			v.traversal_info.lowlink = vv.length + 1
		})
		var component_index = 0
		var visit = function(v){
			v.traversal_info.dtime = ++time
			v.traversal_info.lowlink = time
			var children_of_root = 0
			_.each( v.getNeighbours(), function(n){
				var e = g.getEdge( v, n, Graph.Edgetype.Undirected )
				var w = (e.v1 == v ? e.v2 : e.v1)
				if( w.traversal_info.dtime == 0 ){
					q.push(e)
					w.traversal_info.parent = v
					if( v.traversal_info.dtime == 1 ){
						children_of_root ++
					}
					visit( w )
					if( w.traversal_info.lowlink >= v.traversal_info.dtime ){
						if( v.traversal_info.dtime > 1 ){
							v.is_articulation_point = true
						}
						// new component discovered 
						component_index ++
						var component = []
						do {
							var ce = q.pop()
							ce.component_index = component_index
							component.push( ce )
						} while( ce != e )
						r.push( component )
					} else {
						if( w.traversal_info.lowlink < v.traversal_info.lowlink ){
							v.traversal_info.lowlink = w.traversal_info.lowlink
						}                    
					}
				} else {
					if(  (w.traversal_info.dtime < v.traversal_info.dtime)
						&& (w != v.traversal_info.parent) ){ // (v,w) is a back edge
						q.push( e )
						if( w.traversal_info.dtime < v.traversal_info.lowlink ){
							v.traversal_info.lowlink = w.traversal_info.dtime
						}
					}
				}
			})
			// special case for root
			if( children_of_root > 1 ){
				v.is_articulation_point = true
			}
		}
		_.each( vv, function(v){
			if( v.traversal_info.dtime == 0 ){
				visit(v)
			}
		})
		return r
	},

	//see https://en.wikipedia.org/wiki/Lexicographic_breadth-first_search
	lexicographicBreadthFirstSearch : function( g, componentV ){
		if (!componentV) componentV = g.getVertices()
		else componentV = componentV.concat()
		
		/*
			This uses a (doubly) linked list of sets for the ordering
			and a cache for each to get a random element from the set without having to call keys()
		*/
		
		
		var componentSet = new Hash()
		_.each(componentV, function(v){ componentSet.set(v.id, v) })
		
		var firstSet = {
			next: null,
			prev: null,
			prevIteration: 0,
			set: componentSet,
			setKeys: componentV.map(function(v){return v.id}), //cache of this.set.keys(), not updated for removed elements
			setKeyIndex: 0, //processed keys. 
			id: 0
		}
		
		var containedSet = new Hash()
		_.each(componentV, function(v){ containedSet.set(v.id, firstSet) })
			
		var iteration = 0
		var result = []
			
		while (firstSet) {		
			while (firstSet.setKeyIndex < firstSet.setKeys.length && 
				!firstSet.set.contains(firstSet.setKeys[firstSet.setKeyIndex]))
				firstSet.setKeyIndex++
			if (firstSet.setKeyIndex >= firstSet.setKeys.length) {
				firstSet = firstSet.next
				if (firstSet) firstSet.prev = null
				continue
			}
			
			var v = firstSet.set.get(firstSet.setKeys[firstSet.setKeyIndex])
			result.push(v)
			firstSet.setKeyIndex++
			iteration++
			
			firstSet.set.unset(v.id)
			containedSet.unset(v.id)
				
			
			_.each(v.getNeighbours(), function(w){
				var set = containedSet.get(w.id), newSet
				if (!set) return
				
				if (set.prevIteration != iteration) {
					//set has not yet been splitted in this iteration
					
					//create new empty set 
					newSet = {
						next: set,
						prev: set.prev,
						prevIteration: iteration,
						set: new Hash(),
						setKeys: [],
						setKeyIndex: 0
					}
					set.prevIteration = iteration
					//insert newSet in linked list
					if (set.prev) set.prev.next = newSet
					else firstSet = newSet
					set.prev = newSet
				}
				//move w from set to newSet
				newSet = set.prev
				newSet.setKeys.push(w.id)
				newSet.set.set(w.id, w)
				set.set.unset(w.id)
				containedSet.set(w.id, newSet)
			})
		}

		return result
	},

	/**
	 *  Test for chordality
	 */
	isChordal : function( g, componentV ){
		var ordering = GraphAnalyzer.lexicographicBreadthFirstSearch(g, componentV)
		var positions = new Hash()
		_.each(ordering, function(v,i) { positions.set(v.id, i) } )
		return _.every(ordering, function(v,i) { 
			var j = _.max(_.map(v.getNeighbours(), function(w) {
				var p = positions.get(w.id)
				if (p < i) return p
				else return -1
			}))
			if (j < 0) return true
			var w = ordering[j]
			//alert(w + " " + j  +" < " + i)
			var earlierNeigboursOfW = new Hash()
			_.each(w.getNeighbours(), function(x) {
				var p = positions.get(x.id)
				if (p < j) earlierNeigboursOfW.set(x.id, true)
			})
			return _.every(v.getNeighbours(), function(x){
				var p = positions.get(x.id)
				return (p >= j) || earlierNeigboursOfW.get(x.id)
			})
		})
	},

	/** Check whether the graph is syntactically valid for its type */
	validate : function( g ){
		switch( g.getType() ){
		case "dag":
			if( !_.every(g.getEdges(),function(e){ return e.directed ==
				Graph.Edgetype.Directed || e.directed == Graph.Edgetype.Bidirected }) ){
				return false
			}
			if( GraphAnalyzer.containsCycle( g ) ){
				return false
			}
			return true

		case "mag":
			// TODO implement proper MAG validation
			if( !_.every(g.getEdges(),function(e){ return e.directed ==
				Graph.Edgetype.Directed || e.directed == Graph.Edgetype.Bidirected || 
					e.directed == Graph.Edgetype.Undirected }) ){
				return false
			}
			if( GraphAnalyzer.containsSemiCycle( g ) ){
				return false
			}
			return true

		case "pag":
			// TODO implement proper PAG validation
			if( GraphAnalyzer.containsSemiCycle( g ) ){
				return false
			}
			return true

		case "graph":
			return _.every(g.getEdges(),function(e){ return e.directed ==
				Graph.Edgetype.Undirected })
		case "digraph":
			return true
		case "pdag":
			if( !_.every(g.getEdges(),function(e){ return e.directed ==
				Graph.Edgetype.Directed || e.directed == Graph.Edgetype.Undirected
				|| e.directed == Graph.Edgetype.Bidirected  }) ){
				return false
			}
			if( GraphAnalyzer.containsSemiCycle( g ) ){
				return false
			}
			return true
		default:
			throw("Do not know how to validate graph of type "+g.getType())
		}
	},

	containsCycle: function(g){
		var vv = g.vertices.values()
		for( var i = 0 ; i < vv.length ; i ++ ){
			var v = vv[i]
			g.clearVisited()
			var c = this.searchCycleFrom( v )
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
		if( p === undefined ){ p = [] }
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
	

	containsSemiCycle: function (g){
		return GraphAnalyzer.containsCycle( GraphTransformer.contractComponents(g, 
			GraphAnalyzer.connectedComponents(g), [Graph.Edgetype.Directed])
			)
	},

	/* Check whether the directed edge e is stronlgy protected */
	isEdgeStronglyProtected: function( g, e ) {
		var a = e.v1
		var b = e.v2

		// test m -> a -> b (turning generates new v structure)
		var adp = a.getParents()
		for (var i=0;i<adp.length;i++){
			if (adp[i].id != b.id && ! g.areAdjacent(adp[i],b)){
				return true
			}
		}

		// test a -> b <- m  or a -> b <- m <- a
		var bdp = b.getParents()
		for ( i=0;i<bdp.length;i++){
			if (bdp[i].id != a.id) {
				if ( !g.areAdjacent(bdp[i],a) || g.getEdge(a,bdp[i],Graph.Edgetype.Directed) ){
					return true
				}
			}
		}



		for ( i=0;i<bdp.length;i++){ 
			for (var j=0;j<bdp.length;j++){
				if( i != j && bdp[i].id != a.id && bdp[j].id != a.id
					&& !g.areAdjacent(bdp[i],bdp[j])
					&& g.getEdge(bdp[i],a,Graph.Edgetype.Undirected)
					&& g.getEdge(bdp[j],a,Graph.Edgetype.Undirected) ){
					return true
				}
			}
		}
		return false
	},

	isEdgeVisible : function( g, e ) {
		var t = g.getType()
		if( t == "dag" || t == "pdag" || t == "digraph" ){
			return true
		}
		if( e.directed != Graph.Edgetype.Directed ){
			return undefined
		}
		if( t != "pag" && t != "mag" ){
			throw("Cannot test edge visibility for graph of type : "+t)
		}

		// check case i o-> x -> y
		if( _.difference( _.union(e.v1.getParents(),e.v1.getSpouses()), 
			e.v2.getAdjacentNodes() ).length > 0 ){
			return true
		}

		// check case i o-> a ; { a <-> b } -> x -> y
		var vpar = GraphTransformer.inducedSubgraph( g, 
			_.union([e.v2],e.v2.getParents()) )
		vpar = g.getVertex(_.pluck(vpar.districtOf( [vpar.getVertex(e.v1.id)] ),"id"))	
	
		if( _.difference( _.union(g.parentsOf(vpar),g.spousesOf(vpar)), 
			e.v2.getAdjacentNodes() ).length > 0 ){
			return true
		}

		return false
	}
}

/*
 * 
 *  Some parts of the code in this file have been written by other authors,
 *  and were originally licensed under the MIT license. They originate from 
 *  the following projects: 
 * 
 *  - Dracula Graph Layout and Drawing Framework 0.0.3alpha
 *  (c) 2010 Philipp Strathausen <strathausen@gmail.com>,
 *      http://dracula.ameisenbar.de/index.html
 * 
 *  - which in turn are based on the Graph JavaScript framework, version 0.0.1
 *  (c) 2006 Aslak Hellesoy <aslak.hellesoy@gmail.com>
 *  (c) 2006 Dave Hoover <dave.hoover@gmail.com>
 *
 *  - Ported from Graph::Layouter::Spring in
 *    http://search.cpan.org/~pasky/Graph-Layderer-0.02/
 *  The algorithm is based on a spring-style layouter of a Java-based social
 *  network tracker PieSpy written by Paul Mutton E<lt>paul@jibble.orgE<gt>.
 *
/*--------------------------------------------------------------------------*/

/* globals _  */
/* exported GraphLayouter */

var GraphLayouter = {}
GraphLayouter.prototype = {
	layoutCalcBounds: function() {
		var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity
		_.each(this.graph.vertices.values(), function( v ){
			var x = v.layout_pos_x
			var y = v.layout_pos_y

			if(x > maxx) maxx = x
			if(x < minx) minx = x
			if(y > maxy) maxy = y
			if(y < miny) miny = y            
		} )
		if( maxx-minx>0 ){
			this.graph.layoutMinX = minx
			this.graph.layoutMaxX = maxx
		} else {
			this.graph.layoutMinX = -.1
			this.graph.layoutMaxX = .1
		}
		if( maxy-miny>0 ){
			this.graph.layoutMinY = miny
			this.graph.layoutMaxY = maxy
		} else {
			this.graph.layoutMinY = -.1
			this.graph.layoutMaxY = .1
		}
	}
}

GraphLayouter.Spring = function(graph) {
	this.graph = graph
	this.iterations = 500
	this.maxRepulsiveForceDistance = 6
	this.k = 2
	this.c = 0.01
	this.maxVertexMovement = 0.5
}

GraphLayouter.Spring.prototype = {
	layoutCalcBounds : GraphLayouter.prototype.layoutCalcBounds,

	layout: function() {
		this.layoutPrepare()
		for (var i = 0; i < this.iterations; i++) {
			this.layoutIteration()
		}
		this.layoutCalcBounds()
	},

	layoutPrepare: function() {
		_.each(this.graph.vertices.values(), function( v ){
			v.layout_pos_x = 0
			v.layout_pos_y = 0
			v.layoutForceX = 0
			v.layoutForceY = 0            
		} )
		_.each(this.graph.edges, function( e ){
			delete e.attraction
		} )
	},


	layoutIteration: function() {
		// Forces on nodes due to node-node repulsions
		var nodelist = this.graph.vertices.values()
		for (var i = 0; i < nodelist.length; i++) {
			var node1 = nodelist[i]
			for (var j = i + 1; j < nodelist.length; j++) {
				var node2 = nodelist[j]
				this.layoutRepulsive(node1, node2)
			}
		}
		// Forces on nodes due to edge attractions
		for ( i = 0; i < this.graph.edges.length; i++) {
			var edge = this.graph.edges[i]
			this.layoutAttractive(edge)             
		}
  
		// Move by the given force
		for ( i = 0 ; i < nodelist.length; i ++) {
			var node = nodelist[i]
			var xmove = this.c * node.layoutForceX
			var ymove = this.c * node.layoutForceY

			var max = this.maxVertexMovement
			if(xmove > max) xmove = max
			if(xmove < -max) xmove = -max
			if(ymove > max) ymove = max
			if(ymove < -max) ymove = -max

			node.layout_pos_x += xmove
			node.layout_pos_y += ymove
			node.layoutForceX = 0
			node.layoutForceY = 0
		}
	},

	layoutRepulsive: function(node1, node2) {
		var dx = node2.layout_pos_x - node1.layout_pos_x
		var dy = node2.layout_pos_y - node1.layout_pos_y
		var d2 = dx * dx + dy * dy
		if(d2 < 0.01) {
			dx = 0.1 * Math.random() + 0.1
			dy = 0.1 * Math.random() + 0.1
			d2 = dx * dx + dy * dy
		}
		var d = Math.sqrt(d2)
		if(d < this.maxRepulsiveForceDistance) {
			var repulsiveForce = this.k * this.k / d
			node2.layoutForceX += repulsiveForce * dx / d
			node2.layoutForceY += repulsiveForce * dy / d
			node1.layoutForceX -= repulsiveForce * dx / d
			node1.layoutForceY -= repulsiveForce * dy / d
		}
	},

	layoutAttractive: function(edge) {
		var node1 = edge.v1
		var node2 = edge.v2

		var dx = node2.layout_pos_x - node1.layout_pos_x
		var dy = node2.layout_pos_y - node1.layout_pos_y
		var d2 = dx * dx + dy * dy
		if(d2 < 0.01) {
			dx = 0.1 * Math.random() + 0.1
			dy = 0.1 * Math.random() + 0.1
			d2 = dx * dx + dy * dy
		}
		var d = Math.sqrt(d2)
		if(d > this.maxRepulsiveForceDistance) {
			d = this.maxRepulsiveForceDistance
			d2 = d * d
		}
		var attractiveForce = (d2 - this.k * this.k) / this.k
		if(edge.attraction == undefined || edge.attraction < 1) edge.attraction = 1
		attractiveForce *= Math.log(edge.attraction) * 0.5 + 1

		node2.layoutForceX -= attractiveForce * dx / d
		node2.layoutForceY -= attractiveForce * dy / d
		node1.layoutForceX += attractiveForce * dx / d
		node1.layoutForceY += attractiveForce * dy / d
	}
}
/** 
    This namespace contains functions that parse a graph structure from text.
    Three different formats are supported, but two of them for legacy reasons
    only. The most modern format is a dot-like format, in which a graph looks
    something like this:

    graph {
	X [exposure]
	X [outcome]
	X <- A -> M <- B -> Y
	X -> Y
	X <- M -> Y
	A <-> B
    }
*/

/* jshint undef: true, unused: true, asi: true */
/* globals Graph,GraphAnalyzer,GraphDotParser,_ */
/* exported GraphParser */

var GraphParser = {
	VALIDATE_GRAPH_STRUCTURE : false,
	/**
		This is work in progress ... not safe to use yet.
		For the time being, edge statements are assumed to come line 
		by line.
	*/
	
	parseDot : function( code ){
		"use strict"
		var ast = GraphDotParser.parse( code )
		var g = new Graph()
		this.parseDotStatementArray( ast.statements, g )
		g.setType( ast.type )
		if( ast.name ){ g.setName( ast.name ) }	
		if( this.VALIDATE_GRAPH_STRUCTURE ){
			if( !GraphAnalyzer.validate( g ) ){
				throw("invalid graph : ",g.toString() )
			}
		}
		return g	
	},

	parseDotStatementArray : function( statements, g ){
		var vsub = new Graph() // holds the vertices of this subgraph

		var v = function(id){ 
			if( id == "graph" || id == "node" ){
				throw("Syntax error: variables cannot be named 'graph' or 'node'. "+
					"Use the 'label' attribute instead.")
			}
			vsub.getVertex( id ) || vsub.addVertex( id )
			return( g.getVertex( id ) || g.addVertex( id ) ) 
		}
		var i,j,n,n2,e,pos,bb
		var positionre = new RegExp( "\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*" )
		var parse_position = function( s ){
			var tok = s.match(positionre)
			if( typeof tok[1] !== "string" || 
				typeof tok[2] !== "string" ){
				throw("Syntax error in \"pos\" option!")
			}
			return {x:parseFloat(tok[1]),y:parseFloat(tok[2])}
		}
		var bbre = new RegExp( "\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*" )
		var parse_bb = function( s ){
			var tok = s.match(bbre)
			tok.shift()
			if( _.any( tok, function(t){ return typeof t !== "string" } ) ){
				throw("Syntax error in \"bb\" option!")
			}
			return _.map( tok, parseFloat )
		}
		var recurse = function( sa ){
			var vsubnew = GraphParser.parseDotStatementArray( sa, g )
			_.each( vsubnew, function(v){
				vsub.getVertex(v.id) || vsub.addVertex( v.id )
			})
			return vsubnew
		}
		_.each( statements, function(s) {
			if( s.type == "node" && s.id == "graph" ){
				for( i = 0 ; i < s.attributes.length ; i ++ ){
					switch( s.attributes[i][0] ){
					case "bb":
						bb = parse_bb( s.attributes[i][1] )
						g.setBoundingBox( bb )
					}
				}
			} else if( s.type == "subgraph" ){
				recurse(s.statements)
			} else if( s.type == "node" ){
				n = v(s.id)
				for( i = 0 ; i < s.attributes.length ; i ++ ){
					switch( s.attributes[i][0] ){
					case "latent":
					case "l":
					case "unobserved":
					case "u":
						g.addLatentNode( n )
						break
					case "source":
					case "exposure":
					case "e":
						g.addSource( n )
						break
					case "target":
					case "outcome":
					case "o":
						g.addTarget( n )
						break
					case "adjusted":
					case "a":
						g.addAdjustedNode( n )
						break
					case "pos":
						pos = parse_position( s.attributes[i][1] )
						n.layout_pos_x = parseFloat( pos.x )
						n.layout_pos_y = parseFloat( pos.y )
						break
					case "label":
						n.label = s.attributes[i][1]
						break
					default:
						if( !n.attributes ){
							n.attributes={}
						}
						n.attributes[s.attributes[i][0]]=s.attributes[i][1]
						break
					}
				}
			} else if( s.type == "edge" ){
				for( i = 3; i <= s.content.length ; i += 2 ){
					if( typeof(s.content[i-3]) === "string" ){
						n = [v(s.content[i-3])]
					} else {
						n = recurse(s.content[i-3].statements)
					}
					if( typeof(s.content[i-1]) === "string" ){
						n2 = [v(s.content[i-1])]
					} else {
						n2 = recurse(s.content[i-1].statements)
					}

					_.each( n, function(n){
						_.each( n2, function(n2){
							switch( s.content[i-2] ){

							case "@-@" :
								e = g.addEdge( n, n2, Graph.Edgetype.Unspecified )
								break

							case "--" :
								e = g.addEdge( n, n2, Graph.Edgetype.Undirected )
								break

							case "<->" :
								e = g.addEdge( n, n2, Graph.Edgetype.Bidirected )
								break

							case "->" :
								e = g.addEdge( n, n2, Graph.Edgetype.Directed )
								break
							case "<-" :
								e = g.addEdge( n2, n, Graph.Edgetype.Directed )
								break

							case "@->" : 
								e = g.addEdge( n, n2, Graph.Edgetype.PartDirected )
								break
							case "<-@" : 
								e = g.addEdge( n2, n, Graph.Edgetype.PartDirected )
								break

							case "@--" : 
								e = g.addEdge( n, n2, Graph.Edgetype.PartUndirected )
								break
							case "--@" : 
								e = g.addEdge( n2, n, Graph.Edgetype.PartUndirected )
								break


							}
						})
					})

					for( j = 0 ; j < s.attributes.length ; j ++ ){
						switch( s.attributes[j][0] ){
						case "pos":
							pos = parse_position( s.attributes[j][1] )
							e.layout_pos_x = parseFloat( pos.x )
							e.layout_pos_y = parseFloat( pos.y )
							break
						case "label":
							e.id = s.attributes[j][1]
							break
						default:
							if( !e.attributes ){
								e.attributes = {}
							}
							e.attributes[s.attributes[j][0]]=s.attributes[j][1]
						}
					}
				}
			}
		} )
		return _.map( vsub.getVertices(), function(v){ return g.getVertex( v ) } )
	},
	
	parseVertexLabelsAndWeights : function( vertexLabelsAndWeights ){
		"use strict"
		var g = new Graph()
		var txt = vertexLabelsAndWeights.trim()
		var lines = txt.split(/\n/)
		var i,weight,posn
		for( i = 0 ; i < lines.length ; i ++ ){
			var l = lines[i]
			var a = l.trim().split(/\s+/)
			lines[i]=[]
			if( a.length >= 2 && l.indexOf("@") >= 0 ){
				lines[i][2]=a.pop()
				lines[i][1]=a.pop()
				lines[i][0]=a.join(" ")
			} 
			else if( a.length >= 2 ){
				lines[i][1]=a.pop()
				lines[i][0]=a.join(" ")
			}
			else if( a.length == 1 ){
				lines[i][1]="1"
				lines[i][0]=a.pop()
			}
		}
		for( i = 0 ; i<lines.length ; i ++ ){
			var vid = decodeURIComponent(lines[i][0])
			var props = lines[i][1]
			// TODO weights do not currently mean anything!
			weight = parseInt(props,10)||1
			g.addVertex( new Graph.Vertex( 
				{ id : vid, weight : weight } ) )
			if( props.indexOf("E")>=0 ){
				g.addSource( vid )
			}
			if( props.indexOf("O")>=0 ){
				g.addTarget( vid )
			}
			if( props.indexOf("A")>=0 ){
				g.addAdjustedNode( vid )
			}
			if( props.indexOf("U")>=0 ){
				g.addLatentNode( vid )
			}
			if( lines[i].length == 3 ){
				posn = lines[i][2].substring(1).split(",")
				g.getVertex( vid ).layout_pos_x = parseFloat(posn[0])
				g.getVertex( vid ).layout_pos_y = parseFloat(posn[1])
			}
		}
		g.setType("dag")
		return g
	},
  
	parseAdjacencyList : function( adjacencyList, vertexLabelsAndWeights ){
		"use strict"
		var g = this.parseVertexLabelsAndWeights( vertexLabelsAndWeights )
		var adj_list = adjacencyList.split("\n")
		var i,adj,v1, v1id, v2,v2id
		for( i = 0 ; i < adj_list.length ; i ++ ){
			adj = adj_list[i].trim().split(/\s+/)
			v1 = false; v1id = ""
			while( adj.length > 0 && !v1 ){
				v1id += adj.shift()
				v1 = g.getVertex( decodeURIComponent(v1id) )
				v1id += " "
			}
			while( adj.length > 0 ){
				v2 = false; v2id = ""
				while( adj.length > 0 && !v2 ){
					v2id += adj.shift()
					v2 = g.getVertex( decodeURIComponent(v2id) )
					v2id += " "
				}
				if( v2 ){
					var eold = g.getEdge( v2, v1, Graph.Edgetype.Directed )
					if( eold ){
						g.deleteEdge( v2, v1, Graph.Edgetype.Directed )
						var enew = g.addEdge( v1, v2, Graph.Edgetype.Bidirected )
						if( eold.layout_pos_x && !enew.layout_pos_x ){
							enew.layout_pos_x = eold.layout_pos_x
							enew.layout_pos_y = eold.layout_pos_y
						}
					} else {
						g.addEdge( v1, v2 )
					}
					if( adj.length > 0 && adj[0].charAt(0) == "@" ){
						var e = g.getEdge( v1, v2 )
						var coord_a = adj.shift().substring(1).split(",")
						if( coord_a.length >= 2 ){
							e.layout_pos_x = parseFloat( coord_a[0] )
							e.layout_pos_y = parseFloat( coord_a[1] )
						}
					}
				}
			}
		}
		if( this.VALIDATE_GRAPH_STRUCTURE ){
			if( !GraphAnalyzer.validate( g ) ){
				throw("invalid graph : ",g.toString() )
			}
		}
		return g
	},

	parseAdjacencyMatrix : function( adjacencyMatrix, vertexLabelsAndWeights ){
		"use strict"
		var g = this.parseVertexLabelsAndWeights( vertexLabelsAndWeights )

		var m = adjacencyMatrix.trim()
		var m_arr = m.split(/\s+/)
		var n = Math.sqrt( m.split(/\s+/).length )
		var l, l_arr, i, j

		if( parseInt( n, 10 ) !== n || n !== g.getNumberOfVertices()){
			throw( "Error loading data: Adjacency matrix is not square or does not match number of vertices: "+n+" , " +g.getNumberOfVertices() )
		}

		l = vertexLabelsAndWeights.trim()
		l_arr = l.split("\n")
		for( i = 0 ; i < l_arr.length ; i++ ){
			l_arr[i] = l_arr[i].trim().split(/\s+/)
		}

		for( i = 0 ; i <n ; i ++ ){
			for( j = 0 ; j <n ; j ++ ){
				if( parseInt( m_arr[i*n+j], 10 ) > 0 ){
					g.addEdge( l_arr[i][0], l_arr[j][0] )
				}
			}
		}
		if( this.VALIDATE_GRAPH_STRUCTURE ){
			if( !GraphAnalyzer.validate( g ) ){
				throw("invalid graph : ",g.toString() )
			}
		}
		g.setType( "dag" )
		return g
	},

	parseGuess : function( adjacencyListOrMatrix, vertexLabelsAndWeights ){
		"use strict"
		var first_blank, firstarg = adjacencyListOrMatrix.trim()
		if( !vertexLabelsAndWeights ){
			first_blank = adjacencyListOrMatrix.search( /\r?\n[ \t]*\r?\n/ )
			vertexLabelsAndWeights = adjacencyListOrMatrix.substr( 0, first_blank ).trim()
			adjacencyListOrMatrix = adjacencyListOrMatrix.substr( first_blank ).trim()
		}
		if( adjacencyListOrMatrix.match( /^[\s01]+$/ ) !== null ){
			return this.parseAdjacencyMatrix( adjacencyListOrMatrix, vertexLabelsAndWeights )
		} else {
			// [\s\S] is like . but also matches newline!
			var isdot = firstarg.trim().match(  /^(digraph|graph|dag|pdag|mag|pag)(\s+\w+)?\s*\{([\s\S]*)\}$/mi )
			if( isdot && isdot.length > 1 ){
				return this.parseDot( firstarg )
			} else {
				return this.parseAdjacencyList( adjacencyListOrMatrix, vertexLabelsAndWeights )
			}
		}
	}
}
/* 
 * This is a namespace containing various methods that analyze a given
 * graph. These methods to not change the graph. 
 * 
 */

/* globals _,Graph,GraphAnalyzer,Hash */
/* exported GraphTransformer */

var GraphTransformer = {
	
	/**
	 *  Forms the subgraph of this graph consisting of the vertices in "vertex_array" 
	 *  and the edges between them, directed or undirected.
	 *  
	 *  If "vertex_array" contains source and/or target, source and/or target of the
	 *  returned graph are set accordingly. */
	inducedSubgraph : function( g, vertex_array ){
		var gn = new Graph(), i
		
		for( i = 0 ; i < vertex_array.length ; i++ ){
			gn.addVertex( new Graph.Vertex( vertex_array[i] ) )
		}
		
		var other_vertex_ids = _.pluck(vertex_array,"id")
		
		for( i = 0 ; i < g.edges.length ; i++ ){
			var e = g.edges[i]
			if( _.contains( other_vertex_ids, e.v1.id ) && 
				_.contains( other_vertex_ids, e.v2.id ) ){
				gn.addEdge( e.v1.id, e.v2.id, e.directed )
			}
		}
		
		g.copyAllPropertiesTo( gn )
		return gn
	},
	
	skeleton : function( g ){
		var gn = new Graph(), edge_array = g.edges, i, vv = g.vertices.values()
		for( i = 0 ; i < vv.length ; i++ ){
			gn.addVertex( vv[i].cloneWithoutEdges() )
		}
		for( i = 0 ; i < edge_array.length ; i++ ){
			var edge_other = edge_array[i]
			gn.addEdge( edge_other.v1.id, edge_other.v2.id,
				Graph.Edgetype.Undirected )
		}
		g.copyAllPropertiesTo( gn )
		gn.setType( "graph" )
		return gn
	},

	/**
	 * The sugraph of this graph induced by the edges in edge_array.
	 */
	edgeInducedSubgraph : function( g, edge_array ){
		var gn = new Graph()
		for( var i = 0 ; i < edge_array.length ; i++ ){
			var edge_other = edge_array[i]
			var edge_my = g.getEdge( edge_other.v1.id, edge_other.v2.id,
				edge_other.directed )
			if( edge_my ){
				if( !gn.getVertex( edge_my.v1.id ) )
					gn.addVertex( edge_my.v1.id )
				if( !gn.getVertex( edge_my.v2.id ) )
					gn.addVertex( edge_my.v2.id )
				gn.addEdge( edge_my.v1.id, edge_my.v2.id, edge_my.directed )
			}
		}
		g.copyAllPropertiesTo( gn ) 
		return gn
	},
	
	/**
	 *		Constructs and returns the subgraph of g consisting of 
	 *			(a) the source s and its ancestors
	 *			(b) the target t and its ancestors
	 *			(c) all adjusted/selection nodes Z and their ancestors
	 *
	 *		Otherwise, if V is provided, the ancestors of those nodes are 
	 *		returned.
	 */
	ancestorGraph : function( g, V ){ 
		if( arguments.length < 2 ){
			V = g.getSources().
			concat(g.getTargets()).
			concat(g.getAdjustedNodes()).
			concat(g.getSelectionNodes())
		}
		var g_an = this.inducedSubgraph( g, g.anteriorsOf( V ) )
		return g_an
	},
	
	/***
	 *		This is a slightly different version of Judea Pearl's BackDoor
	 *		construction. Only such edges are deleted that are the first edge of a 
	 *      proper causal path.
	 *
	 *		Parameters X and Y are source and target vertex sets, respectively,
	 *		and are optional.
	 *		
	 *
	 **/
	backDoorGraph : function( g, X, Y ){
		var gback, dpcp
		if( g.getType() == "pag" ){
			gback = GraphTransformer.pagToPdag( g )
			gback.setType("pag")
		} else {
			gback = g.clone()
		}
		if( typeof X == "undefined" ){
			X = g.getSources()
		}
		if( typeof Y == "undefined" ){
			Y = g.getTargets()
		}
		if( X.length == 0 || Y.length == 0 ){
			return gback
		}
		X = gback.getVertex(_.pluck(X,"id"))
		Y = gback.getVertex(_.pluck(Y,"id"))
		dpcp = GraphAnalyzer.properPossibleCausalPaths( gback, X, Y )
		_.each( X, function(s){
			_.each( _.intersection( dpcp, s.getChildren() ), function( c ){
				if( GraphAnalyzer.isEdgeVisible( gback, gback.getEdge(s.id,c.id)) ){
					gback.deleteEdge( s, c, Graph.Edgetype.Directed )
				}
			})
		})
		return gback
	},
	
	/** This is the counterpart of the back-door graph for direct effects.
	 * We remove only edges pointing from X to Y.
	 */
	indirectGraph : function( g, X, Y ){
		var gback = g.clone()
		var ee = []
		if( arguments.length == 3 ){
			_.each( X, function(v){ gback.addSource(v.id) } )
			_.each( Y, function(v){ gback.addTarget(v.id) } )
		}
		_.each(gback.getSources(),function( s ){
			_.each( gback.getTargets(),function( t ){
				var e = gback.getEdge( s, t )
				if( e ) ee.push( e )
			})
		})
		_.each(ee,function(e){gback.deleteEdge(e.v1,e.v2,e.directed)})
		return gback
	},
	
	/** TODO
	 *		this is such a minor change from the usual descendants/ancestors
	 *		that there should be a nice generalization of both to avoid duplicating
	 *		the code here. */
	causalFlowGraph : function( g, X, Y ){
		if( arguments.length == 1 ){
			X = g.getSources()
			Y = g.getTargets()
		}
		var clearVisitedWhereNotAdjusted = function(){
			_.each( g.vertices.values(), function(v){
				if( g.isAdjustedNode( v ) ) 
					Graph.Vertex.markAsVisited( v )
				else 
					Graph.Vertex.markAsNotVisited( v )
			})
		}
		return this.inducedSubgraph( g, 
				_.intersection(g.ancestorsOf( Y, clearVisitedWhereNotAdjusted ),
						g.descendantsOf( X, clearVisitedWhereNotAdjusted ) ) )
	},
	
	/**
	 *		This function returns the subgraph of this graph that is induced
	 *		by all open simple non-causal routes from s to t. 
	 */
	activeBiasGraph : function( g, X, Y ){
		var g_chain, g_canon, L, S, in_type = g.getType(),
			reaches_source = {}, reaches_adjusted_node = {}, retain = {}
		var preserve_previous_visited_information = function(){}
		
		if( arguments.length > 1 ){
			g = g.clone()
			_.each(X,function(v){g.addSource(v.id)})
			_.each(Y,function(v){g.addTarget(v.id)})
		}
		
		if( g.getSources().length == 0 || g.getTargets().length == 0 ){
			return new Graph()
		}
		
		g_canon = GraphTransformer.canonicalDag(g)
		g = g_canon.g
		g_chain = GraphTransformer.ancestorGraph(g)
		
		_.each( g.ancestorsOf( g.getSources(),
			function(){
				var adj = g.getAdjustedNodes()
				g.clearTraversalInfo()
				_.each( adj, function(v){ Graph.Vertex.markAsVisited(v) } )
			} ), function(v){
				reaches_source[v.id] = true
			})
			
		_.each( g.ancestorsOf( g.getAdjustedNodes() ), function(v){
			reaches_adjusted_node[v.id] = true
		})
		
		// ..for this line, such that "pure causal paths" are traced backwards 
		var target_ancestors_except_ancestors_of_violators = 
		g.ancestorsOf( g.getTargets(), 
			function(){
				var an_violators = g.ancestorsOf(
					GraphAnalyzer.nodesThatViolateAdjustmentCriterion(g))
				g.clearTraversalInfo()
				_.each( an_violators, function(v){ Graph.Vertex.markAsVisited(v) } )
			}
		)
		var intermediates_after_source = _.intersection( g.childrenOf( g.getSources() ),
			target_ancestors_except_ancestors_of_violators)
		g.clearTraversalInfo()
		
		// Delete directed edges emitting from source that are only on causal routes
		_.each( g.getSources(), function(s){
			_.each( s.outgoingEdges, function(e){
				if( g.isSource(e.v2 ) || _.contains(intermediates_after_source, e.v2 ) ){
					g_chain.deleteEdge( e.v1, e.v2, Graph.Edgetype.Directed )
				}
			})
		})

		// Delete edges emitting from adjusted nodes
		_.each( g_chain.getAdjustedNodes(), function( v ){
			_.each( v.getChildren(), function( v2 ){ 
				g_chain.deleteEdge( v, v2, Graph.Edgetype.Directed )
			} )
		} )
		
		// clone because we shoulnd't modify an array while traversing it
		_.each( g_chain.edges.slice(), function(e){
			if( reaches_adjusted_node[e.v1.id] && reaches_adjusted_node[e.v2.id] ){
				g_chain.deleteEdge( e.v1, e.v2, e.directed )
				g_chain.addEdge( e.v1, e.v2, Graph.Edgetype.Undirected )
			}
		} )
		
		var topological_index = GraphAnalyzer.topologicalOrdering( g_chain )
		
		var bottleneck_number = GraphAnalyzer.bottleneckNumbers( g,
			topological_index )

		var comps = GraphAnalyzer.connectedComponents( g_chain )
		
		var check_bridge_node = function(v){ 
			return reaches_adjusted_node[v.id] && 
					topological_index[v.id] !== undefined &&
					bottleneck_number[v.id] !== undefined }

		var vv = g_chain.getVertices()
		
		for( var comp_i = 0 ; comp_i < comps.length ; comp_i ++ ){
			var comp = comps[comp_i]
			if( comp.length > 1 ){
				var bridge_nodes = _.filter( comp, check_bridge_node )

				var current_component = GraphTransformer.inducedSubgraph( 
					g_chain, comp )
				var bridge_node_edges = []
				var bridge_nodes_bottlenecks = []
				_.each( bridge_nodes, function(bn){
					bridge_nodes_bottlenecks.push(bottleneck_number[bn.id])
				})
				_.each( _.uniq(bridge_nodes_bottlenecks), function( i ){
					current_component.addVertex( "__START"+i )
					current_component.addVertex( "__END"+i )
					bridge_node_edges.push( 
						current_component.addEdge( "__START"+i, "__END"+i, 
							Graph.Edgetype.Undirected ) )
				})
				
				_.each( bridge_nodes, function( bridge ) {
					current_component.addEdge( 
						"__END"+bottleneck_number[bridge.id],
						bridge.id, Graph.Edgetype.Undirected )
				})
								
				var bicomps = GraphAnalyzer.biconnectedComponents( current_component )
								
				var current_block_tree = GraphAnalyzer.blockTree( current_component, bicomps )

				_.each( bridge_node_edges, function( e ){
					Graph.Vertex.markAsVisited(
						current_block_tree.getVertex( "C"+e.component_index ) )
				} )
				current_block_tree.visitAllPathsBetweenVisitedNodesInTree()
				
				var visited_components = _.filter( current_block_tree.vertices.values(),
					function(v){
						return v.id.charAt(0) == "C" && v.traversal_info.visited 
					})
								
				/** TODO is in O(|E|) - can this be accelerated? */
				_.each( visited_components, function( vc ){
					var component_index = parseInt(vc.id.substring(1))
					var component = bicomps[component_index-1]
					if( component.length > 1 || 
						component[0].v1.id.indexOf("__") !== 0 || 
						component[0].v2.id.indexOf("__") !== 0
					){
						_.each( bicomps[component_index-1], function( e ){
							var cv1 = g_chain.getVertex( e.v1.id )
							if( cv1 ){
								retain[cv1.id] = true
							}
							var cv2 = g_chain.getVertex( e.v2.id )
							if( cv2 ){
								retain[cv2.id] = true
							}
						} )
					}
				} )
			}
		}
		// after the above loop, all vertices that have two disjoint paths to 
		// a source and a target have been labeled for retention


		// now, retain all vertices that are "between" the labeled vertices and
		// sources/targets. to this end, descend from the labeled vertices but
		// avoid descending further than a source/target
		_.each( vv, function(v){
			if( g_chain.isSource(v) ){
				Graph.Vertex.markAsVisited(v)
				retain[v.id] = true
			} else if( g_chain.isTarget(v) ){
				if( reaches_source[v.id] ){
					Graph.Vertex.markAsNotVisited(v)
				} else {
					Graph.Vertex.markAsVisited(v)
				}
				retain[v.id] = true
			}
			else{
				Graph.Vertex.markAsNotVisited(v)
			}
		} )
		
		
		var start_nodes = _.filter( vv, function(v){ 
			return retain[v.id]
				|| ( topological_index[v.id] !== undefined &&
				topological_index[v.id] === bottleneck_number[v.id] ) } )
		
				
		var nodes_to_be_retained = g_chain.descendantsOf( start_nodes, 
			preserve_previous_visited_information )
		_.each( nodes_to_be_retained, function( v ){ retain[v.id] = true } )

		
		// All vertices on "back-door" biasing paths (starting with a x <- ) 
		// and all "front-door" biasing paths
		// have been labeled for retention now. 
		
		// To finish, add the vertices on biasing non-backdoor routes whose
		// simple versions are causal paths.
		var w_nodes = _.reject( GraphAnalyzer.dpcp(g), // See Shpitser et al, UAI 2010
			function(w){return !retain[w.id]} )
		var paths_to_violators = g.ancestorsOf(GraphAnalyzer.
			nodesThatViolateAdjustmentCriterionWithoutIntermediates(g))
		g.clearTraversalInfo(); _.each(w_nodes,Graph.Vertex.markAsVisited)
		_.each(w_nodes,function(w){
			Graph.Vertex.markAsNotVisited(w)
			_.chain(paths_to_violators).
				intersection(g.descendantsOf([w],preserve_previous_visited_information)).
				each(function(v){retain[v.id]=true})
			Graph.Vertex.markAsVisited(w)
		},g)
		
		// Delete edges between targets as long as they are not on a biasing route
		_.each(g.getTargets(),function(v){
			_.each(v.outgoingEdges,function(e){
				if( g.isTarget(e.v2) && ! _.contains(paths_to_violators,e.v2) ){
					g_chain.deleteEdge(e.v1,e.v2,e.directed)
				}
			})
		})
		
		// Delete all vertices that have not been marked for retention
		_.each(vv, function(v){
			if( typeof retain[v.id] === "undefined" ){
				g_chain.deleteVertex(v)
			}
		} )
		
		// Restore original edge types
		var edges_to_replace = []
		_.each( g_chain.edges, function(e){
			if( e.directed == Graph.Edgetype.Undirected ){
				edges_to_replace.push( e )
			}
		})
		_.each( edges_to_replace, function( e ){
			g_chain.deleteEdge( e.v1, e.v2, Graph.Edgetype.Undirected )
			if( g_canon.g.getEdge( e.v1.id, e.v2.id, Graph.Edgetype.Directed ) ){
				g_chain.addEdge( e.v1.id, e.v2.id, Graph.Edgetype.Directed )
			} else {
				g_chain.addEdge( e.v2.id, e.v1.id, Graph.Edgetype.Directed )
			}
		} )
		
		// Replace dummy nodes from canonical graph with original nodess
		var Lids = _.pluck(g_canon.L,"id"), Sids = _.pluck(g_canon.S,"id")
		L=[], S=[]
		_.each(Lids, function(vid){
			var v = g_chain.getVertex(vid)
			if( v ) L.push( v )
		})
		_.each(Sids, function(vid){
			var v = g_chain.getVertex(vid)
			if( v ) S.push( v )
		})
		g = GraphTransformer.decanonicalize( g_chain, L, S )
		g.setType( in_type )
		return g
	}, // end of activeBiasGraph
	
	trekGraph : function( g, up_prefix, down_prefix ) {
		var n = new Graph()
		var vv = g.getVertices()
		var ee = g.getEdges()
		var vup, vdown, ch, i
		if( ! up_prefix ) up_prefix = "up_"
		if( ! down_prefix ) down_prefix = "dw_"
		for( i = 0 ; i < vv.length ; i ++ ){
			vup = up_prefix+vv[i].id; vdown = down_prefix+vv[i].id
			n.addVertex( new Graph.Vertex( {id:vup} ) )
			n.addVertex( new Graph.Vertex( {id:vdown} ) )
			if( g.isSource( vv[i] ) ) n.addSource( n.getVertex(vup) )
			if( g.isTarget( vv[i] ) ) n.addSource( n.getVertex(vdown) )
			n.addEdge( vup, vdown )
		}
		for( i = 0 ; i < ee.length ; i ++ ){
			if( ee[i].directed == 2 ){ // bidirected edge
				vup = up_prefix+ee[i].v1.id; vdown = down_prefix+ee[i].v2.id
				n.addEdge( vup, vdown )
			}
		} 
		for( i = 0 ; i < vv.length ; i ++ ){
			vup = up_prefix+vv[i].id; vdown = down_prefix+vv[i].id
			ch = vv[i].getChildren( false ) // true -> consider also bidirected edges
			for( var j = 0 ; j < ch.length ; j ++ ){
				n.addEdge( vdown, down_prefix+ch[j].id )
				n.addEdge( up_prefix+ch[j].id, vup )
			}
		}
		return n
	},
	
	/**
		For a graph with bi- and undirected edges, forms the "canonical version"
		by replacing each <->  with <- L -> and each -- with -> S <-. Returns 
		an object {g,L,S] containing the graph and the newly created nodes L and
		S. 
		
		The output graph is always a DAG.
		
		*/
	canonicalDag : function( g ){
		var rg = new Graph(), i = 1, L = [], S = [], v
		_.each( g.getVertices(), function( v ){
			rg.addVertex( v.cloneWithoutEdges() )
		} )
		g.copyAllPropertiesTo( rg )
		_.each( g.getEdges(), function( e ){
			switch( e.directed ){
			case Graph.Edgetype.Undirected:
				while( rg.getVertex( "S"+i ) ){ i ++ }
				v = new Graph.Vertex({id:"S"+i})
				rg.addVertex( v ); rg.addSelectionNode( v )
				rg.addEdge(e.v2,v)
				rg.addEdge(e.v1,v)
				S.push(v)
				break

			case Graph.Edgetype.Directed:
				rg.addEdge(e.v1,e.v2)
				break

			case Graph.Edgetype.Bidirected:
				while( rg.getVertex( "L"+i ) ){ i ++ }
				v = new Graph.Vertex({id:"L"+i})
				rg.addVertex( v ); rg.addLatentNode( v )
				rg.addEdge(v,e.v2)
				rg.addEdge(v,e.v1)
				L.push(v)
				break
			}
		} )
		rg.setType( "dag" )
		return {g:rg,L:L,S:S}
	},

	decanonicalize : function( g, L, S ){
		var rg = g.clone(), vv, i, j
		_.each( L, function(v){
			vv = v.getChildren()
			for( i = 0 ; i < vv.length ; i ++ ){
				for( j = i+1 ; j < vv.length ; j ++ ){
					rg.addEdge(vv[i],vv[j],Graph.Edgetype.Bidirected)
				}
			}
			rg.deleteVertex(v)
		})
		_.each( S, function(v){
			vv = v.getParents()
			for( i = 0 ; i < vv.length ; i ++ ){
				for( j = i+1 ; j < vv.length ; j ++ ){
					rg.addEdge(vv[i],vv[j],Graph.Edgetype.Undirected)
				}
			}
			rg.deleteVertex(v)
		})
		if( S.length == 0 ){
			rg.setType("dag")
		} else {
			rg.setType("mag")
		}
		return rg
	},
	
	/**	
	 *	Returns a "moralized" version of this graph, i.e.: 
	 *	
	 *	(1) for each pair of edges (u,v), (w,v) a new
	 *		undirected edge {u,w} is inserted
	 *		
	 *	(2) all directed edges are converted to undirected edges
	 *
	 *  (3) all undirected edges are copied		
	 */
	moralGraph : function( g ){
		var mg = new Graph()
		
		_.each( g.getVertices(), function( v ){
			mg.addVertex( v.cloneWithoutEdges() )
		} )

		var comp = GraphAnalyzer.connectedComponents( g, "getSpouses" )
		_.each( comp, function(c){
			var comp_p = g.parentsOf( c ).concat(c)
			for( var i = 0 ; i < comp_p.length ; i ++ ){
				for( var j = i+1 ; j < comp_p.length ; j ++ ){
					mg.addEdge( comp_p[i].id,
						comp_p[j].id, Graph.Edgetype.Undirected )
				}
			}
		})
		
		_.each( g.edges, function( e ){
			if( e.directed == Graph.Edgetype.Undirected ){
				mg.addEdge( e.v1.id, e.v2.id, e.directed )
			}
		} )
		g.copyAllPropertiesTo( mg )
		mg.setType("graph")
		return mg
	},
	
	/**
	 *		Constructs a flow network corresponding to the given directed graph.
	 *		A flow network is a tuple of a graph and a capacity function.
	 * 
	 *		Capacities for certain edge may be given as an argument. If not provided,
	 *		all edges will be initialized to have capacity 1.
	 * 
	 *		Two new 'supernodes' will be created for source(s) and target(s) to allow
	 *		for multi source / sink flow problems. The default names for these new
	 *		vertices are  "__SRC" and  "__SNK" ; underscores will be prepended as necessary
	 *		if this conflics with existing vertex names. 
	 */
	flowNetwork : function(g, capacities) {
		var i, v, vin, vout
		if( capacities === undefined ) capacities = new Hash()
		var n = g.clone()
		for( i = 0 ; i < g.edges.length ; i++ ){
			var e = g.edges[i]
			var eback = g.getEdge( e.v2.id, e.v1.id )
			if( !eback ){
				eback = n.addEdge( e.v2.id, e.v1.id, Graph.Edgetype.Directed )
			}
			
			if( capacities.get(e) === undefined ){
				capacities.set(e,1)
			}
			if( capacities.get(eback) === undefined ){
				capacities.set(eback,0)
			}
		}
		var ssource = "__SRC"
		while( g.getVertex( ssource ) ){
			ssource = "_" + ssource
		}
		var ssink = "__SNK"
		while( g.getVertex( ssink ) ){
			ssink = "_" + ssink
		}
		n.addVertex( new Graph.Vertex( {id:ssource} ) )
		n.removeAllSources(); n.addSource( ssource )
		n.addVertex( new Graph.Vertex( {id:ssink} ) )
		n.removeAllTargets(); n.addTarget( ssink )
			
		vout = n.getVertex(ssource)
		vin = n.getVertex(ssink)
			
		var srcs = g.getSources()
		for( i = 0 ; i < srcs.length ; i ++ ){
			v = n.getVertex(srcs[i].id)
			capacities.set( n.addEdge( vout, v ), Number.MAX_VALUE )
			capacities.set( n.addEdge( v, vout ), 0 )
		}
			
		var tgts = g.getTargets()
		for( i = 0 ; i < tgts.length ; i ++ ){
			v = n.getVertex(tgts[i].id)
			capacities.set( n.addEdge( v, vin ), Number.MAX_VALUE )
			capacities.set( n.addEdge( vin, v ), 0 )
		}
		return { graph: n, capacities: capacities }
	},
	
	/****
	 *		Applies a well-known tranformation to turn a vertex capacity flow problem into 
	 *		an edge capacity flow problem: Each vertex v in the given graph is substituted by
	 *		a vertex pair v_in -> v_out where the edge capacity is the given vertex capacity.
	 *		All edges going into v are connected to v_in and all edges going out of v are connected
	 *		to v_out.
	 **/
	vertexCapacityGraph : function( g ) {
		var gn = new Graph()
		_.each(g.vertices.values(),function( v ){
			if( g.getSource() !== v ){
				gn.addVertex( new Graph.Vertex( { id : "I" + v.id } ) )
			}
			if( g.getTarget() !== v ){
				gn.addVertex( new Graph.Vertex( { id : "O" + v.id } ) )
			}
			if( g.getSource() !== v && g.getTarget() !== v ){
				gn.addEdge( new Graph.Edge.Directed( { 
					v1:gn.getVertex("I"+v.id), v2:gn.getVertex("O"+v.id), capacity: 1, is_backedge : false } ) )
				gn.addEdge( new Graph.Edge.Directed( { 
					v2:gn.getVertex("I"+v.id), v1:gn.getVertex("O"+v.id), capacity: 0, is_backedge : true } ) )
			}
		} )
		_.each(g.edges,function( e ){
			if( e.v1 !== g.getTarget() && e.v2 !== g.getSource() ){
				gn.addEdge( new Graph.Edge.Directed( { v1 : gn.getVertex("O"+e.v1.id),
							v2 : gn.getVertex("I"+e.v2.id) , capacity: 1, is_backedge : false } ) )
				gn.addEdge( new Graph.Edge.Directed( { 
					v2 : gn.getVertex("O"+e.v1.id),
					v1 : gn.getVertex("I"+e.v2.id), 
					capacity: 0, is_backedge : true 
				} ) )
			}
		} )
		return gn.
		setSource(gn.getVertex("O"+g.getSource().id)).
		setTarget(gn.getVertex("I"+g.getTarget().id))
	},
	
	/***
	 * The transitive reduction removes all edges from a graph
	 * that follow transitively from other edges. (The result of this 
	 * transformation is uniquely defined.)
	 * 
	 * This is used to compute the "atomic directed edges", which
	 * are the directed edges that are essential for the ancestral structure
	 * of a graph. 
	 * */
	transitiveReduction : function( g ) {
		var gn = g.clone(), en
		_.each( g.edges, function( e ){
			en = gn.getEdge( e.v1, e.v2 )
			if( en ){
				// delete edge (u,v) if there is at least one mediator between u and v 
				if( _.intersection( g.descendantsOf( [e.v1] ), 
						g.ancestorsOf( [e.v2] ) ).length > 2 ){
					gn.deleteEdge( e.v1, e.v2, Graph.Edgetype.Directed )
				}
			}
		} )
		return gn
	},
	
	transitiveClosure : function( g ){
		var gn = g.clone()
		_.each(gn.vertices.values(), function(v){
			_.each(gn.descendantsOf( [v] ), function(w){
				if( v != w ) gn.addEdge( v, w )
			} )
		} )
		return gn
	},

	dagToCpdag : function( g ){
		var r = g.clone()

		var changed = true
		var es = r.getEdges()
		while( changed ){
			changed = false
			for( var i=0; i<es.length; i++ ){
				if( es[i].directed == Graph.Edgetype.Directed &&
					!GraphAnalyzer.isEdgeStronglyProtected(r, es[i])) {
					r.changeEdge(es[i], Graph.Edgetype.Undirected)
					changed = true
				}
			}
		}
		r.setType("pdag")
		return r
	},
		
	/** TODO make this work with undirected edges, add unit test */
	dependencyGraph : function( g ){
		var gc = GraphTransformer.canonicalDag( g ).g
		var gd = GraphTransformer.dag2DependencyGraph( gc )
		var vn = []
		_.each(g.vertices.values(),function(v){ vn.push(gd.getVertex(v.id)) } )
		return GraphTransformer.inducedSubgraph( gd, vn )
	},


	dag2DependencyGraph : function( g ){
		var gn = GraphTransformer.transitiveClosure( g )
		var gm = GraphTransformer.skeleton( gn )
		_.each(gn.vertices.values(),function(v){
			var ch = gn.childrenOf( [v] ), i=0, j=1
			for( ; i < ch.length ; i ++ ){
				for( j = i+1 ; j < ch.length ; j ++ ){
					gm.addEdge( ch[i].id, ch[j].id, Graph.Edgetype.Undirected )
				}
			}
		} )
		gm.setType("graph")
		return gm
	},
	
	/** TODO add unit test */
	dependencyGraph2CPDAG : function( g ){
		var gn = new Graph()
		gn.setType( "pdag" )
		var vv = g.vertices.values()
		_.each(vv,function(v){ gn.addVertex( v.cloneWithoutEdges() ) } )
		_.each(g.edges,function(e){
			var n1 = g.neighboursOf( [e.v1] )
			var n2 = g.neighboursOf( [e.v2] )
			n1.push(e.v1)
			n2.push(e.v2)
			var both = n1.intersect( n2 )
			if( n1.length == n2.length && both.length == n1.length ){
				gn.addEdge( e.v1.id, e.v2.id, Graph.Edgetype.Undirected )
			} else if( both.length == n1.length ){
				gn.addEdge( e.v1.id, e.v2.id )
			} else if( both.length == n2.length ){
				gn.addEdge( e.v2.id, e.v1.id )
			}
		})
		return gn
	},
	
	/**
	 * This function implements a tranformation by Eppstein that maps pairs of 
	 * paths to common ancestors in a DAG bijectively to paths in another DAG.
	 * 
	 * See D. Eppstein, "Finding Common Ancestors and Disjoint Paths in DAGs",
	 *  Tech Report 95-52, UC Irvine, 1995
	 */
	pathPairGraph : function( g ){
		// store topological_index at all vertices 
		var topological_index = g.topologicalOrdering()
		
		// create a new vertex (x,y) for each vertex pair where index(x) <= index(y) 
		// (in particular, for every (x,x)   
		var gp = new Graph()
		var i, ei
		gp.addVertex( new Graph.Vertex( { id : "s" } ) )
		gp.setSource( gp.getVertex( "s" ) )
		
		var topo_sort = g.vertices.values().pluck("id")
		topo_sort.sort( function(a,b){ return topological_index[a] < topological_index[b] ? -1 : 1 } )
		
		for( i = 0 ; i < topo_sort.length ; i ++ ){
			var id_p = topo_sort[i]+":"
			for( var j = 0 ; j < topo_sort.length ; j ++ ){
				gp.addVertex( new Graph.Vertex( { id : id_p+topo_sort[j] } ) )
			}
			gp.addEdge( new Graph.Edge.Directed( {
				v1 : gp.getVertex( "s" ), 
				v2 : gp.getVertex( id_p+topo_sort[i] ) 
			} ) )
		}
		
		for( ei = 0 ; ei < g.edges.length ; ei ++ ){
			var e = g.edges[ei]
			for( i = 0 ; i < e.v2.topological_index-1; i ++ ){
				gp.quickAddDirectedEdge( 
				gp.getVertex( topo_sort[i]+":"+e.v1.id ),
					gp.getVertex( topo_sort[i] +":"+e.v2.id ) )
				gp.quickAddDirectedEdge( 
				gp.getVertex( e.v1.id+":"+topo_sort[i] ),
					gp.getVertex( e.v2.id+":"+topo_sort[i] ) )
			}
		}
		
		if( g.getSource().topological_index < g.getTarget().topological_index ){
			gp.setTarget( g.getSource().id + ":" + g.getTarget().id )
		} else {
			gp.setTarget( g.getTarget().id + ":" + g.getSource().id )
		}
		
		return gp
	},
	
	/*
	  Replace every occurence of the induced subgraph A -> B -- C with A -> B -> C
	*/
	cgToRcg: function(g) {
		var gn = new Graph()
		gn.setType( g.getType() )

		_.each(g.vertices.values(), function(v){gn.addVertex( v.cloneWithoutEdges() )})
		var fail = false
		//checks if v is connected to a node with id w.id in the graph containing v
		function areConnected(v,w) { 
			return _.some(v.getAdjacentNodes(), function(x){ return x.id == w.id })
		}
		function processDirectedEdge(a,b){
			if (fail) return
			_.each(b.getNeighbours(), function(c){
				if (a.id != c.id && !areConnected(a, c)) {
					_.each(gn.getVertex(c.id).getParents(),  //parents in gn is a superset of the parents in g
									function(d){ 
										if (a.id != d.id && b.id != d.id && !areConnected(b,d)) 
											fail = true 
									})
					if (fail) return
					if (!gn.getEdge(b.id, c.id, Graph.Edgetype.Directed)) {
						gn.addEdge(b.id, c.id, Graph.Edgetype.Directed)
						processDirectedEdge(b,c)
					}
				}
			})
		}
		_.each(g.getEdges(), function(e){
			if (e.directed == Graph.Edgetype.Directed) 
				gn.addEdge(e.v1.id, e.v2.id, Graph.Edgetype.Directed)
		})
		_.each(g.getEdges(), function(e){
			if (e.directed == Graph.Edgetype.Directed) 
				processDirectedEdge(e.v1,e.v2)
		})
		if (fail) return null
		_.each(g.getEdges(), function(e){
			if (e.directed != Graph.Edgetype.Directed && !areConnected(gn.getVertex(e.v1.id), e.v2)) 
				gn.addEdge(e.v1.id, e.v2.id, e.directed)
		})
		g.copyAllPropertiesTo( gn )
		return gn
	},
	
	/*
		Contracts every array C of vertices in components to a single vertex V_c that is connected to a vertex W
		if one of the vertices in C was connected to W
	*/
	contractComponents: function(g, components, includeSelfEdges) {
		var selfEdges = [false, false, false]
		if (typeof includeSelfEdges === "boolean" ) selfEdges = selfEdges.map(function() { return includeSelfEdges })
		else if (_.isArray( includeSelfEdges ) ) _.each(includeSelfEdges, function(t) { selfEdges[t] = true })
		var targetVertices = new Hash()

		var gn = new Graph()
		gn.setType( g.getType() )

		_.each(components, function(component) { 
			var ids = component.map(function(v){
				if (typeof v === "string" ) return v
				else return v.id 
			})
			var mergedVertex = gn.addVertex(ids.sort().join(","))
			_.each(ids,function(vid){
				targetVertices.set(vid, mergedVertex)
			})
		})
		_.each( g.getVertices(), function( v ){
			if (targetVertices.contains(v.id)) return
			var w = gn.addVertex( v.cloneWithoutEdges() )
			targetVertices.set(v.id, w)
		} )
		_.each(g.getEdges(), function(e){
			var c1 = targetVertices.get(e.v1.id)
			var c2 = targetVertices.get(e.v2.id)
			if (c1 == c2 && !selfEdges[e.directed]) return
			gn.addEdge( c1, c2, e.directed )
		})
		_.each( g.managed_vertex_property_names, ( function( p ){
			_.each( g.getVerticesWithProperty( p ), function( v ){
				gn.addVertexProperty( targetVertices.get(v.id), p ) 
			} )
		} ) )
		return gn
	},

	contractLatentNodes: function(g){
		var gn = g.clone()
		_.each( gn.getLatentNodes(), function (v) {
			gn.contractVertex(v)
		} )
		return gn
	},
	
	markovEquivalentDags : function(g,n){
		var c = this.dagToCpdag(g)
		g = c.clone()
		var result = []

		function enumerate() {
			if(GraphAnalyzer.containsCycle(g)){ return }
			if(result.length >=n ){ return } 
			var es = g.getEdges()
			for (var i=0;i<es.length;i++){
				if (es[i].directed == Graph.Edgetype.Undirected) {
					g.changeEdge(es[i],Graph.Edgetype.Directed)
					enumerate()

					g.reverseEdge(es[i])
					enumerate()

					g.reverseEdge(es[i])
					g.changeEdge(es[i], Graph.Edgetype.Undirected)         
					return
				}
			}
			var d = GraphTransformer.dagToCpdag(g)
			if (GraphAnalyzer.equals(c,d)){
				var gr = g.clone()
				gr.setType("dag")
				result.push(gr)
			}
		}

		enumerate()
		return result
	},

	pagToPdag : function(g) {
		if( g.getType() != "pag" ){
			return undefined
		}
		g = g.clone()
		var es = g.getEdges()
		for( var i = 0 ; i < es.length ; i ++ ){
			if( es[i].directed == Graph.Edgetype.Unspecified ){
				g.changeEdge(es[i], Graph.Edgetype.Undirected)
			}
			if( es[i].directed == Graph.Edgetype.PartDirected ){
				g.changeEdge(es[i], Graph.Edgetype.Directed)
			}
			if( es[i].directed == Graph.Edgetype.PartUndirected ){
				g.changeEdge(es[i], Graph.Edgetype.Undirected)
			}

		}
		g.setType("pdag")
		return g
	}
}
/* This is a namespace containing various methods that generate graphs,
 * e.g. at random.*/
 
/* globals Graph	*/
/* exported GraphGenerator */

var GraphGenerator = {
	/**
	 * Generates a random DAG on the given variables. The topological
	 * ordering will reflect the given order of the variables.
	 * p is the probability that an edge will be created. If p=1, then
	 * the number of edges created will be maximal. It is advisable to
	 * scale p with 1/|V|. 
	 * p can also be an object with entries { p.Edge, ... } where ... are
	 * parameters for the setRandomNodes function (see below)
	 */
	randomDAG : function( variables, p){
		var i, j
		if (typeof variables == "number" ) {
			var n = variables
			variables = []
			for (i = 1; i <= n; i++) variables.push("v" + i)
		}
		var g = new Graph()
		var vertices = [] 
		for( i = 0 ; i < variables.length ; i ++ ){
			var v = g.addVertex( variables[i] )
			vertices.push(v)
		}
		
		var pEdge = p
		if (typeof p == "object") {
			pEdge = p.pEdge
			this.setRandomNodes(g, p)
		}
		for( i = 0 ; i < variables.length ; i ++ ){
			for( j = i+1 ; j < variables.length ; j ++ ){
				if( Math.random() < pEdge ){
					g.quickAddDirectedEdge( vertices[i], vertices[j] )
				}
			}
		}
		g.setType("dag")
		return g
	},
	
	
	/**
	 * Marks nodes as source, target or latentnode.
	 * Parameter pSource is the probability of a node becoming a source node, 
	 * minSource and maxSource the minimum and maximum count of these nodes.
	 * pTarget, minTarget, maxTarget, pLatentNode, minLatentNode, maxLatentNode control the creation of other node types.
	*/
	setRandomNodes: function (g, p) {
		var i, j, k
		var vertices = g.vertices.values()
		var prop = ["Source", "Target", "LatentNode"]
		for (i=0;i<prop.length;i++) g["removeAll"+prop[i]+"s"]()
		for (i=0,j=1,k=2;i<prop.length;i++,j++,k++) {
			if (j >= prop.length) j = 0
			if (k >= prop.length) k = 0
			var minOthers = (p["min"+prop[j]] ? p["min"+prop[j]] : 0) + (p["min"+prop[k]] ? p["min"+prop[k]] : 0)
			if (!(("max" + prop[i])  in p) || (p["max"+prop[i]] > vertices.length - minOthers ))
				p["max"+prop[i]] = vertices.length - minOthers
		}
		var pSource = p.pSource ? p.pSource : 0, 
			pTarget = p.pTarget ? p.pTarget : 0, 
			pLatentNode = p.pLatentNode ? p.pLatentNode : 0
		var maxSource = "maxSource" in p ? p.maxSource : vertices.length,
			maxTarget = "maxTarget" in p ? p.maxTarget : vertices.length,
			maxLatentNode = "maxLatentNode" in p ? p.maxLatentNode : vertices.length
		
		var counts = {"Source": 0, "Target": 0, "LatentNode": 0}
		var availableVertices = []
		for (i=0;i<vertices.length;i++) {
			var v = vertices[i]
			var q = Math.random()
			var kind = null
			if (q < pSource) { if (counts.Source < maxSource) kind = "Source" }
			else if (q < pSource + pTarget) { if (counts.Target < maxTarget) kind = "Target" }
			else if (q < pSource + pTarget + pLatentNode) { if (counts.LatentNode < maxLatentNode) kind = "LatentNode" }
			if (kind)	{
				g["add" + kind](v) 
				counts[kind]++ 
			} else availableVertices.push(v)
		}
		for (i=0;i<prop.length;i++) {
			if (!p["min"+prop[i]]) continue
			for (var existing = counts[prop[i]]; existing < p["min"+prop[i]]; existing++) {
				if (availableVertices.length == 0) throw "no available vertices"
				j = Math.floor(Math.random() * availableVertices.length)
				g["add"+prop[i]](availableVertices[j])
				availableVertices.splice(j, 1)
			}
		} 
	}
}
/* DAGitty - a browser-based software for causal modelling and analysis
   Copyright (C) 2010-2012 Johannes Textor

   This program is free software; you can redistribute it and/or
   modify it under the terms of the GNU General Public License
   as published by the Free Software Foundation; either version 2
   of the License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA. */

/* This is just a wrapper around the basic Graph class which allows us to 
	register event listeners, e.g. if the graph is being modified. This wrapper
	can be used by applications based on the MVC pattern. For efficiency reasons,
	GraphAnalyzer and GraphTransform should not be used with this class but rather
	with the underlying Graph itself (exposed to the outside world via the getGraph()
	method). */
	
/* globals Class,_  */
/* exported ObservedGraph */

var ObservedGraph = Class.extend({
	event_mapping : {
		"addVertex" : "change",
		"renameVertex" : "change",
		"addEdge" : "change",
		"deleteVertex" : "change",
		"deleteEdge" : "change",
		"addSource" : "change",
		"removeSource" : "change",
		"addTarget" : "change",
		"removeTarget" : "change",
		"addLatentNode" : "change",
		"removeLatentNode" : "change",
		"addAdjustedNode" : "change",
		"removeAdjustedNode" : "change"
	},
	initialize : function( graph ){
		this.graph = graph
		this.event_listeners = {}
		_.each(Object.keys( this.event_mapping ),function(k){
			this.event_listeners[this.event_mapping[k]]=[]
		},this)
		for( var k in graph ){
			if( _.isFunction(graph[k]) ){
				var f = graph[k]
				if( this.event_mapping[k] ){
					this[k] = (function(f,k){
						return function(){
							var r = f.apply( graph, arguments )
							_.each(this.event_listeners[this.event_mapping[k]],
							function(l){
								l()
							})
							return r
						}
					})(f,k)
				} else {
					this[k] = (function(f){
						return function(){return f.apply( graph, arguments )}
					})(f)
				}
			}
		}
	},
	observe : function( event, listener ){
		this.event_listeners[event].push(listener)
	}
} )

/* globals _,Graph,GraphAnalyzer,GraphTransformer */
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
				property_string = " ["+properties.join(",")+"]"
			}
			return GraphSerializer.dotQuoteVid( v.id ) + property_string
		}
		var r = ""
		var ra = []
		_.each( 
		g.vertices.values(), function( v ){
			ra.push(expandLabel( v, g )+"\n")
		} )
		ra.sort()
		return r + ra.join("")
	},
	
	dotBarewordRe : new RegExp( "^[0-9a-zA-Z_.]+$" ),
	
	dotQuoteVid : function( vid ){
		if( !vid.match( this.dotBarewordRe ) ){
			return "\"" + vid.replace(/"/g, "\\\"") + "\""
		}
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
	
	mathematicaSyntax : function( g, use_ids_as_labels ){
		var pv = this.polynomialVariety( g, use_ids_as_labels )
		return "GroebnerBasis[{"+pv[0]+"},\n{"+pv[2].join(",")+"},\n{"+pv[1].join(",")+"}]"
	},

	singularSyntax : function( g, use_ids_as_labels ){
		var pv = this.polynomialVariety( g, use_ids_as_labels )

		// constraints
		return "ring r = 0,("+pv[1].join(",")+","+pv[2].join(",")+"),(dp("+pv[1].length+"),lp);\n" +
			"ideal i = "+pv[0]+";\noption(redSB);\nideal j = groebner(i); print( j );"

		// solution of just-identified system
		//return "ring r = (0,"+pv[2].join(",")+"),("+pv[1].join(",")+"),(dp);\n" +
		//	"ideal i = "+pv[0]+";\noption(redSB);\nideal j = groebner(i); print( j );"

		//return "GroebnerBasis[{"+pv[0]+"},{"+pv[2].join(",")+"},{"+pv[1].join(",")+"}]"
	},

	polynomialVariety : function( g, use_ids_as_labels ){
		if( typeof use_ids_as_labels === "undefined" ){
			use_ids_as_labels = false
		}
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
			if( i == 0 ){
				var parameters = GraphAnalyzer.trekRule( g, vv[i], vv[i],
					use_ids_as_labels )[1]
			}
			if( g.isLatentNode( vv[i] ) ) continue
			for( j = i ; j < vv.length ; j ++ ){
				if( g.isLatentNode( vv[j] ) ) continue
				values.push(covs(i,j))
				var monomials = GraphAnalyzer.trekRule( g, 
					vv[i], vv[j], use_ids_as_labels )
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
	//Latent nodes are replaced by bidirectional edges, only directed and bidirectinal edges are allowed, and nodes without edges are dropped.
	toCausalEffectIgraohRCode : function (g){
		var gbidi = GraphTransformer.contractLatentNodes(g)
		var edgesresult = []
		var bidirectinoal = []
		var quote = "\""
		_.each(gbidi.getEdges(), function(e){
			edgesresult.push( quote + e.v1.id + "\",\"" + e.v2.id + quote )
			if (e.directed == Graph.Edgetype.Bidirected) {
				bidirectinoal.push(edgesresult.length)
				edgesresult.push( quote + e.v2.id + "\",\"" + e.v1.id + quote )
				bidirectinoal.push(edgesresult.length)
			}
		} )
		
		return "set.edge.attribute(graph = graph_from_edgelist(matrix(c( "+edgesresult.join(", ")+" ),nc = 2,byrow = TRUE)), name = \"description\", index = c("+bidirectinoal.join(", ")+"), value = \"U\")"
	},
	
	//Exports R-code to find the causal effect from the current exposures to current outcomes using the causaleffect package
	toCausalEffectRCode : function(g){
		var nodeList = function(a) { return "c(" + a.map(function(v){return "\""+v.id+"\""}).join(", ") + ")" }
		return "causal.effect(y = "+nodeList(g.getTargets())+", x = "+nodeList(g.getSources())+", G = "+this.toCausalEffectIgraohRCode(g)+")"
	}
}; // eslint-disable-line 

GraphDotParser = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = "strict",
        peg$c1 = { type: "literal", value: "strict", description: "\"strict\"" },
        peg$c2 = "{",
        peg$c3 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c4 = "}",
        peg$c5 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c6 = function(type, name, statements) {
          	return { type : type.toLowerCase(), name:name, statements:statements }
          },
        peg$c7 = function(name, statements) {
        	  return { type : 'subgraph', name:name, statements:statements }
          },
        peg$c8 = function(head, tail) { return buildList(head,tail,1) },
        peg$c9 = "=",
        peg$c10 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c11 = function(a, b) { 
          	return { type:'node', id:'graph', attributes:[[a,b]] }
          },
        peg$c12 = function(v, tl, a) { 
           	if( a === null ){
          		a = []
          	}
        	return {type:'edge', content:[v].concat(tl), attributes:a} 
         },
        peg$c13 = function(a, v, tl) {return tl},
        peg$c14 = function(a, v, more) {
         	return [a,v].concat(more||[]) },
        peg$c15 = function(l) { return l },
        peg$c16 = function(name, a) { 
          	if( a === null ){
          		a = {}
          	}
          	return {type:'node', id:name, attributes:a} 
          },
        peg$c17 = "[",
        peg$c18 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c19 = "]",
        peg$c20 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c21 = function(a) { return a },
        peg$c22 = ";",
        peg$c23 = { type: "literal", value: ";", description: "\";\"" },
        peg$c24 = ",",
        peg$c25 = { type: "literal", value: ",", description: "\",\"" },
        peg$c26 = function(k, v, tl) { 
        	if( v === null ){ v = 1 }
        	else{ v = v[2] }
        	var r = [[k,v]]
        	if( tl ) r = r.concat( tl )
        	return r
          },
        peg$c27 = "@->",
        peg$c28 = { type: "literal", value: "@->", description: "\"@->\"" },
        peg$c29 = "<-@",
        peg$c30 = { type: "literal", value: "<-@", description: "\"<-@\"" },
        peg$c31 = "->",
        peg$c32 = { type: "literal", value: "->", description: "\"->\"" },
        peg$c33 = "--@",
        peg$c34 = { type: "literal", value: "--@", description: "\"--@\"" },
        peg$c35 = "--",
        peg$c36 = { type: "literal", value: "--", description: "\"--\"" },
        peg$c37 = "<->",
        peg$c38 = { type: "literal", value: "<->", description: "\"<->\"" },
        peg$c39 = "<-",
        peg$c40 = { type: "literal", value: "<-", description: "\"<-\"" },
        peg$c41 = "@-@",
        peg$c42 = { type: "literal", value: "@-@", description: "\"@-@\"" },
        peg$c43 = "@--",
        peg$c44 = { type: "literal", value: "@--", description: "\"@--\"" },
        peg$c45 = function(e) { return e },
        peg$c46 = "graph",
        peg$c47 = { type: "literal", value: "graph", description: "\"graph\"" },
        peg$c48 = "digraph",
        peg$c49 = { type: "literal", value: "digraph", description: "\"digraph\"" },
        peg$c50 = "dag",
        peg$c51 = { type: "literal", value: "dag", description: "\"dag\"" },
        peg$c52 = "mag",
        peg$c53 = { type: "literal", value: "mag", description: "\"mag\"" },
        peg$c54 = "pdag",
        peg$c55 = { type: "literal", value: "pdag", description: "\"pdag\"" },
        peg$c56 = "pag",
        peg$c57 = { type: "literal", value: "pag", description: "\"pag\"" },
        peg$c58 = function(t) { return t },
        peg$c59 = "-",
        peg$c60 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c61 = /^[0-9a-zA-Z_.]/,
        peg$c62 = { type: "class", value: "[0-9a-zA-Z_.]", description: "[0-9a-zA-Z_.]" },
        peg$c63 = function(m, id) { return (m===null?'':'-') + id.join('') },
        peg$c64 = "\"",
        peg$c65 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c66 = function() {return "";},
        peg$c67 = "\\",
        peg$c68 = { type: "literal", value: "\\", description: "\"\\\\\"" },
        peg$c69 = /^[\r\n]/,
        peg$c70 = { type: "class", value: "[\\r\\n]", description: "[\\r\\n]" },
        peg$c71 = "+",
        peg$c72 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c73 = function(v) {return v},
        peg$c74 = function(v, rest) { return rest === null ? v[1] : (v[1] + rest); },
        peg$c75 = function(chars) { return chars.join(""); },
        peg$c76 = /^[^"\\\0-\x1F]/,
        peg$c77 = { type: "class", value: "[^\"\\\\\\0-\\x1F\\x7F]", description: "[^\"\\\\\\0-\\x1F\\x7F]" },
        peg$c78 = "\\\"",
        peg$c79 = { type: "literal", value: "\\\"", description: "\"\\\\\\\"\"" },
        peg$c80 = function() { return '"'; },
        peg$c81 = /^[\n\r]/,
        peg$c82 = { type: "class", value: "[\\n\\r]", description: "[\\n\\r]" },
        peg$c83 = function() { return ""; },
        peg$c84 = function() { return '\\'; },
        peg$c85 = /^[\n\r\t ;]/,
        peg$c86 = { type: "class", value: "[\\n\\r\\t ;]", description: "[\\n\\r\\t ;]" },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsegraph();

      return s0;
    }

    function peg$parsegraph() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c0) {
          s2 = input.substr(peg$currPos, 6);
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c1); }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseGRAPHTYPE();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseid();
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 123) {
                  s6 = peg$c2;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c3); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsestmt_list();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 125) {
                        s9 = peg$c4;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c5); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c6(s4, s5, s8);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsesubgraph() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 123) {
          s2 = peg$c2;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c3); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsestmt_list();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 125) {
                s5 = peg$c4;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c5); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c7(s1, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsestmt_list() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsestmt();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 === peg$FAILED) {
          s4 = null;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parsestmt();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsestmt();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c8(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsestmt() {
      var s0;

      s0 = peg$parseglobaloption();
      if (s0 === peg$FAILED) {
        s0 = peg$parseedge_stmt();
        if (s0 === peg$FAILED) {
          s0 = peg$parsenode_stmt();
          if (s0 === peg$FAILED) {
            s0 = peg$parsesubgraph();
          }
        }
      }

      return s0;
    }

    function peg$parseglobaloption() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c9;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseid();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c11(s1, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseedge_stmt() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 === peg$FAILED) {
        s1 = peg$parsesubgraph();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseedgeRHS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseattr_list();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c12(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseedgeRHS() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseEDGE();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseid();
        if (s3 === peg$FAILED) {
          s3 = peg$parsesubgraph();
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          s5 = peg$parseedgeRHS();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s4;
            s5 = peg$c13(s2, s3, s5);
          }
          s4 = s5;
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s1;
            s2 = peg$c14(s2, s3, s4);
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c15(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenode_stmt() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseattr_list();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c16(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseattr_list() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c17;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsea_list();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c19;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c20); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c21(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsea_list() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c9;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseid();
            if (s5 !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 59) {
            s3 = peg$c22;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
          if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s3 = peg$c24;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c25); }
            }
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsea_list();
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c26(s1, s2, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEDGE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c27) {
        s1 = peg$c27;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c29) {
          s1 = peg$c29;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c31) {
            s1 = peg$c31;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c33) {
              s1 = peg$c33;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c34); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c35) {
                s1 = peg$c35;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c36); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c37) {
                  s1 = peg$c37;
                  peg$currPos += 3;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c38); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c39) {
                    s1 = peg$c39;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c40); }
                  }
                  if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 3) === peg$c41) {
                      s1 = peg$c41;
                      peg$currPos += 3;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c42); }
                    }
                    if (s1 === peg$FAILED) {
                      if (input.substr(peg$currPos, 3) === peg$c43) {
                        s1 = peg$c43;
                        peg$currPos += 3;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c44); }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c45(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseGRAPHTYPE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5).toLowerCase() === peg$c46) {
        s1 = input.substr(peg$currPos, 5);
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 7).toLowerCase() === peg$c48) {
          s1 = input.substr(peg$currPos, 7);
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c49); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 3).toLowerCase() === peg$c50) {
            s1 = input.substr(peg$currPos, 3);
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c51); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c52) {
              s1 = input.substr(peg$currPos, 3);
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c53); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 4).toLowerCase() === peg$c54) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c55); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 3).toLowerCase() === peg$c56) {
                  s1 = input.substr(peg$currPos, 3);
                  peg$currPos += 3;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c57); }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c58(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseid() {
      var s0;

      s0 = peg$parseBAREWORD();
      if (s0 === peg$FAILED) {
        s0 = peg$parseSTRING();
      }

      return s0;
    }

    function peg$parseBAREWORD() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s1 = peg$c59;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c61.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c62); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c61.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c62); }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c63(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTRING() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c64;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c64;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c65); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c66();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c64;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c65); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsechars();
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s5 = peg$c67;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c68); }
            }
            if (s5 !== peg$FAILED) {
              s6 = [];
              if (peg$c69.test(input.charAt(peg$currPos))) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c70); }
              }
              if (s7 !== peg$FAILED) {
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  if (peg$c69.test(input.charAt(peg$currPos))) {
                    s7 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c70); }
                  }
                }
              } else {
                s6 = peg$FAILED;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsechars();
                if (s7 !== peg$FAILED) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 34) {
                s5 = peg$c64;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c65); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s2 = [s2, s3, s4, s5, s6];
                  s1 = s2;
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 43) {
            s3 = peg$c71;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c72); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseSTRING();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c73(s5);
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c74(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c75(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3;

      if (peg$c76.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c77); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c78) {
          s1 = peg$c78;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c79); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c80();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 92) {
            s1 = peg$c67;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c81.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c82); }
            }
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c81.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c82); }
                }
              }
            } else {
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c83();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s1 = peg$c67;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c68); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c84();
            }
            s0 = s1;
          }
        }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      if (peg$c85.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c86); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c85.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c86); }
        }
      }

      return s0;
    }


      function extractList(list, index) {
        var result = [], i;

        for (i = 0; i < list.length; i++) {
          if (list[i][index] !== null) {
            result.push(list[i][index]);
          }
        }

        return result;
      }

      function buildList(head, tail, index) {
        return (head !== null ? [head] : []).concat(extractList(tail, index));
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();
