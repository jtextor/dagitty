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
	 *		Moreover, all edges between
	 *		two sources are deleted. --- THIS DOES NOT SEEM TO BE NECESSARY
	 **/
	backDoorGraph : function( g, X, Y ){
		var gback = g.clone(), i, in_X = [], in_Y = []
		if( arguments.length == 1 ){
			X = g.getSources()
			Y = g.getTargets()
		}
		if( X.length == 0 || Y.length == 0 ){
			return gback
		}
		for( i = 0 ; i < X.length ; i ++ ){
			in_X[ X[i].id ] = 1
		}
		for( i = 0 ; i < Y.length ; i ++ ){
			in_Y[ Y[i].id ] = 1
		}
		g.clearTraversalInfo()
		
		var visit = function( v ){
			if( !v.traversal_info.visited ){
				v.traversal_info.visited = true
				if( in_Y[ v.id ] ){
					v.traversal_info.reaches_target = true
				} else {
					var children = _.reject(v.getChildren(),function(v){return in_X[v.id]})
					_.each( children, visit )
					v.traversal_info.reaches_target = _.chain(children)
						.pluck("traversal_info")
						.pluck("reaches_target")
						.some().value()
				}
			}
		}
		
		_.each( X, function(s){
			visit( s )
			_.each( s.getChildren(), function( c ){
				if( c.traversal_info.reaches_target ){
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
	}  
}
