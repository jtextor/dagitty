/* This is a namespace containing various methods that analyze a given
 * graph. These methods to not change the graph. */

/* globals _,Graph,GraphTransformer,Hash */
/* exported GraphAnalyzer */

var GraphAnalyzer = {
	
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
	
	vanishingTetrads : function( g, nr_limit ){
		var r = []
		g = GraphTransformer.canonicalGraph(g).g
		var gtrek = GraphTransformer.trekGraph( g, "up_", "dw_" )		
		var latents = g.getLatentNodes()
		var is_latent = []; for( var i = 0 ; i < latents.length ; i ++ ){ is_latent[latents[i].id]=1 }
		
		var vv = _.pluck(_.reject(g.getVertices(),function(v){return is_latent[v.id]}),'id'), 
			i1, i2, i3, i4, iside, jside
		
		function examineQuadruple( i1, i2, j1, j2 ){
			iside = [ gtrek.getVertex( "up_"+i1 ),
				gtrek.getVertex( "up_"+i2 ) ]
			jside = [ gtrek.getVertex( "dw_"+j1 ),
				gtrek.getVertex( "dw_"+j2 ) ]
			if( GraphAnalyzer.minVertexCut( gtrek, iside, jside ) <= 1 ){
				r.push( [i1, j1, j2, i2] ) // lisrel convention
			}
		}

		
		for( i1 = 0 ; i1 < vv.length ; i1 ++ ){
			for( i2 = i1+1 ; i2 < vv.length ; i2 ++ ){
				for( i3 = i2+1 ; i3 < vv.length ; i3 ++ ){
					for( i4 = i3+1 ; i4 < vv.length ; i4 ++ ){
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
				while( findAugmentingPath( _.pluck(sources,'id') ) && --trials > 0 ){
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
	
	listMsasTotalEffect : function( g, must, must_not ){
		if(GraphAnalyzer.violatesAdjustmentCriterion(g)){ return [] }
		var adjusted_nodes = g.getAdjustedNodes();
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
	
	listMsasDirectEffect : function( g, must, must_not ){
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
	
	listMinimalImplications : function( g, max_nr ){
		var r = [];
		var g2 = g.clone();
		var vv = g2.vertices.values();
		// this ignores adjusted vertices for now 
		for( var i = 0 ; i < vv.length ; i ++ ){
			g2.removeAllAdjustedNodes();
		}
		var n = 0;
		for( i = 0 ; i < vv.length ; i ++ ){
			for( var j = i+1 ; j < vv.length ; j ++ ){
				if( !g2.isLatentNode( vv[i] ) && !g2.isLatentNode( vv[j] ) 
					&& !g2.getEdge( vv[i].id, vv[j].id ) && !g2.getEdge( vv[j].id, vv[i].id ) ){
					g2.removeAllSources().addSource( g2.getVertex( vv[i].id ) );
				g2.removeAllTargets().addTarget( g2.getVertex( vv[j].id ) );
				var seps = GraphAnalyzer.listDseparators( g2, [], [], max_nr-n );
				if( seps.length > 0 ){
					r.push( [vv[i].id, vv[j].id, seps] );
					n += seps.length;
					if( n >= max_nr ){
						return r;
					}
				}
					}
			}
		}
		return r;
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
		var paths = g.listPaths().split('\n');
		var r = "";
		_.each( paths, function( p ){
			if( p == "..." ){
				r += "\n...";
			} else {
				var p_arr = p.split("->").slice(1).map( function(s){ return s.split(':'); } );
				var left_side = _.uniq(_.pluck(p_arr,'0')).slice(1).join('->');
				var right_side = _.uniq(_.pluck(p_arr,'1')).reverse().join('<-');
				r += ( r == "" ? "" : "\n" ) + right_side + "->" + left_side;
			}
		} );
		return r;
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
		for( i = 0 ; i < Y.length ; i ++ ){
			in_Y[ Y[i].id ] = 1
		}		
		var visit = function( v ){
			if( !visited[v.id] ){
				visited[v.id] = true
				if( in_Y[v.id] ){
					r.push(v)
					reaches_target[v.id] = true
				} else {
					var children = _.reject(v.getChildren(),function(v){return in_X[v.id]})
					if( possible ){
						children = children.concat( 
							_.reject(v.getNeighbours(),function(v){return in_X[v.id]}) )
					}
					if( _.any( children.map( visit ) ) ){
						r.push(v)
						reaches_target[v.id] = true
					} else {
						reaches_target[v.id] = false
					}
				}
			}
			return reaches_target[v.id]
		}
		_.each( X, visit )
		return r
	},
	
	/*
		descendants of nodes on proper causal paths, except X.
	 */
	dpcp : function( g, X, Y ){
		if( arguments.length == 1 ){
			X = g.getSources()
			Y = g.getTargets()
		}
		return g.descendantsOf( _.difference( this.properPossibleCausalPaths( g, X, Y ), 
			g.getSources() ) )
	},
	
	nodesThatViolateAdjustmentCriterion : function( g ){
		return _.intersection( this.dpcp(g), g.getAdjustedNodes() )
	},
	
	nodesThatViolateAdjustmentCriterionWithoutIntermediates : function( g ){
		var is_on_causal_path = [];
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
		if( arguments.length < 6 ){
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
					console.log( e )
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
	dConnected : function( g, X, Y, Z ){
		var forward_queue = []
		var backward_queue = []
		var forward_visited ={}
		var backward_visited = {}
		var i, Y_ids = {}, Z_ids = {}, v, vv
		for( i = 0 ; i < X.length ; i ++ ){
			backward_queue.push( X[i] )
		}
		for( i = 0 ; i < Y.length ; i ++ ){
			Y_ids[Y[i].id] = 1
		}
		for( i = 0 ; i < Z.length ; i ++ ){
			Z_ids[Z[i].id] = 1
		}
		while( forward_queue.length + backward_queue.length > 0 ){
			if( forward_queue.length > 0 ){
				v = forward_queue.pop()
				forward_visited[v.id]=1
				if( Y_ids[v.id] ) return true
				if( Z_ids[v.id] ){
					vv = _.union( v.getParents(), v.getSpouses() )
					for( i = 0 ; i < vv.length ; i ++ ){
						if( !backward_visited[vv[i].id] ){
							backward_queue.push( vv[i] )
						}
					}
				} else {
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
		g = GraphTransformer.canonicalGraph( g ).g
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
			return [];
		}
		var Uh = new Hash();
		_.each( g.getTargets(), function( v ){ Uh.set(v.id,v) } );
		_.each( g.neighboursOf( g.getTargets() ), function( v ){ Uh.set(v.id,v) } );
		var U = Uh.values();
		
		var R = [];
		var must = [];
		if( _must ){
			_.each( _must, function(v){must.push(g.getVertex(v.id));});
		}
		var must_not = [];
		if( _must_not ){
			_.each( _must_not, function(v){must_not.push(g.getVertex(v.id));});
		}
		var realN = function( V ){
			g.clearVisited();
			_.each( V.concat(must), function(v){
				Graph.Vertex.markAsVisited(v);
			} );
			var r = [];
			var q = V.slice();
			var mark_visited_and_push = function(w){
				if( !Graph.Vertex.isVisited( w ) ){
					Graph.Vertex.markAsVisited(w);
					if( _.contains(must_not,w) ){
						q.push( w );
					} else {
						r.push( w );                      
					}
				}
			}; 
			while( q.length > 0 ){
				_.each( q.pop().getNeighbours(), mark_visited_and_push );
			}
			return r;
		};
		
		var nearSeparator =  function( A, b ){
			var NA = realN( A )
			var C = GraphAnalyzer.connectedComponentAvoiding( g, b, NA.concat(must) )
			return realN( C )
		};
		
		var listMinSep = function( A, U ){
			if( R.length >= max_nr ) return
			var SA = nearSeparator( A, g.getTargets() )
			var Astar = GraphAnalyzer.connectedComponentAvoiding( g, g.getSources(),
				SA.concat(must) )
			if( _.intersection( Astar, U ).length == 0 ){
				var NA = realN(Astar);
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
		return R;
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
		var ind = { i : g.vertices.size() };
		var topological_index = {}
		var visited = {}
		var visit = function( v ){
			if( !visited[v.id] ){
				visited[v.id] = true;
				var children = v.getChildren();
				if( g.isSource(v) || g.isTarget(v) || children.length > 0 ||
					v.getParents().length > 0 ){ 
					for( var i = 0 ; i < children.length ; i ++ ){
						visit( children[i] )
					} 
					topological_index[v.id] = ind.i;
					ind.i--;
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
		var s0 = g.getSources()[0];
		var t0 = g.getTargets()[0];
		var bottleneck_number = {}, reaches_source = {}, reaches_target = {},
			visited = {}
		_.each( g.ancestorsOf( g.getSources(),
			function(){
				var adj = g.getAdjustedNodes()
				g.clearTraversalInfo()
				_.each( adj, function(v){ Graph.Vertex.markAsVisited(v) })
			} ), function(v){
			reaches_source[v.id] = true;
		});
		_.each( g.ancestorsOf( g.getTargets(),
			function(){
				var adj = g.getAdjustedNodes()
				g.clearTraversalInfo()
				_.each( adj, function(v){ Graph.Vertex.markAsVisited(v) })
			} ), function(v){
			reaches_target[v.id] = true;
		});
		var vv = g.vertices.values();
		var bn_s = topological_index[s0.id];
		var bn_t = topological_index[t0.id];
		_.each( vv, function(v){
			if( reaches_source[v.id] && 
				!reaches_target[v.id] ){
				bottleneck_number[v.id] = bn_s;
			} else if(!reaches_source[v.id] && 
				reaches_target[v.id] ){
				bottleneck_number[v.id] = bn_t;
			} else {
				bottleneck_number[v.id] = undefined;
			}
		});
		_.each( g.getSources(), function(s){
			topological_index[s.id] = bn_s
			bottleneck_number[s.id] = bn_s
			visited[s.id] = true
		});
		_.each( g.getTargets(), function(t){
			bottleneck_number[t.id] = bn_t
			topological_index[t.id] = bn_t
			visited[t.id] = true
		});
		var visit = function( v ){
			if( !visited[v.id] && 
				(reaches_source[v.id] || reaches_target[v.id]) ){
				visited[v.id]=true
				var children = _.filter( v.getChildren(), function(v){
					return reaches_source[v.id] ||
						reaches_target[v.id];
				});
				_.each( children, visit);
				if( children.length > 1 && _.some( children,
					function(v2){ return bottleneck_number[v2.id] != 
						bottleneck_number[children[0].id] } ) ){
					bottleneck_number[v.id] = topological_index[v.id];
				} else {
					bottleneck_number[v.id] = bottleneck_number[children[0].id];
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
		var vv = g.vertices.values();
		var component = function(v){
			var q = [v], r =[v]
			while( q.length > 0 ){
				var v2 = q.pop();
				visited[v2.id] = true
				_.each( v2[kinship_function](), function(vn2){
					if( !visited[vn2.id] ){
						q.push(vn2)
						r.push(vn2)
						visited[vn2.id] = true
					}
				} )
			}
			return r;
		};
		var r = [];
		_.each( vv, function(v){
			if( !visited[v.id] ){
				r.push( component(v) );
			}
		});
		return r;
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
	 * property "is_articulation_point" on every vertex object.
	 * 
	 * If the second argument is not given, then the biconnected
	 * components are re-computed from scratch.
	 */
	blockTree : function( g, bicomps ) {
		if( bicomps == null ){
			bicomps = this.biconnectedComponents( g );
		}
		var bt = new Graph();
		_.each( bicomps, function( edge_list ){
			bt.addVertex( new Graph.Vertex( { id : "C"+edge_list[0].component_index } ) );
		} );
		_.each( g.vertices.values(), function( v ){
			if( v.is_articulation_point ){
				bt.addVertex( new Graph.Vertex( { id : "A"+v.id } ) );
				var vn = bt.getVertex("A"+v.id);
				vn.is_articulation_point = true;
				_.each( v.adjacentUndirectedEdges, function( e ){
					bt.addEdge( vn, bt.getVertex("C"+e.component_index),
						Graph.Edgetype.Undirected ) 
				} );
			}
		} );
		return bt;
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
		});
		var component_index = 0
		var visit = function(v){
			v.traversal_info.dtime = ++time
			v.traversal_info.lowlink = time
			var children_of_root = 0
			_.each( v.adjacentUndirectedEdges, function(e){
				var w = (e.v1 == v ? e.v2 : e.v1)
				if( w.traversal_info.dtime == 0 ){
					q.push(e)
					w.traversal_info.parent = v
					if( v.traversal_info.dtime == 1 ){
						children_of_root ++
					}
					visit( w );
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
			});
			// special case for root
			if( children_of_root > 1 ){
				v.is_articulation_point = true
			}
		};
		_.each( vv, function(v){
			if( v.traversal_info.dtime == 0 ){
				visit(v)
			}
		})
		return r
	},

	//see https://en.wikipedia.org/wiki/Lexicographic_breadth-first_search
	lexicographicBreadthFirstSearch : function( g, componentV ){
		if (!componentV) componentV = g.getVertices();
		else componentV = componentV.concat();
		
		/*
			This uses a (doubly) linked list of sets for the ordering
			and a cache for each to get a random element from the set without having to call keys()
		*/
		
		
		var componentSet = new Hash();
		_.each(componentV, function(v){ componentSet.set(v.id, v); });
		
		var firstSet = {
			next: null,
			prev: null,
			prevIteration: 0,
			set: componentSet,
			setKeys: componentV.map(function(v){return v.id}), //cache of this.set.keys(), not updated for removed elements
			setKeyIndex: 0, //processed keys. 
			id: 0
		};
		
		var containedSet = new Hash();
		_.each(componentV, function(v){ containedSet.set(v.id, firstSet); });
			
		var iteration = 0;
		var result = [];
			
		while (firstSet) {
			while (firstSet.setKeyIndex < firstSet.setKeys.length 
			       && !firstSet.set.contains(firstSet.setKeys[firstSet.setKeyIndex]))
				firstSet.setKeyIndex++;
			if (firstSet.setKeyIndex >= firstSet.setKeys.length) {
				firstSet = firstSet.next;
				continue;
			}
			
			var v = firstSet.set.get(firstSet.setKeys[firstSet.setKeyIndex]);
			result.push(v);
			firstSet.setKeyIndex++;
			iteration++;
			
			firstSet.set.unset(v.id);
			containedSet.unset(v.id);
				
			
			_.each(v.getNeighbours(), function(w){
				var set = containedSet.get(w.id);
				if (!set) return;
				
				if (set.prevIteration != iteration) {
					//set has not yet been splitted in this iteration
					
					//create new empty set 
					var newSet = {
							next: set,
							prev: set.prev,
							prevIteration: iteration,
							set: new Hash(),
							setKeys: [],
							setKeyIndex: 0,
						};
					set.prevIteration = iteration;
					//insert newSet in linked list
					if (set.prev) set.prev.next = newSet;
					else firstSet = newSet;
					set.prev = newSet;
				}
				//move w from set to newSet
				var newSet = set.prev;
				newSet.setKeys.push(w.id);
				newSet.set.set(w.id, w);
				set.set.unset(w.id);
				containedSet.set(w.id, newSet);
			});
		}
		return result;
	},

	/**
	 *  Test for chordality
	 */
	isChordal : function( g, componentV ){
		var ordering = GraphAnalyzer.lexicographicBreadthFirstSearch(g, componentV).reverse();
		var positions = new Hash();
		_.each(ordering, function(v,i) { positions.set(v.id, i); } );
		console.log(_.map(ordering, function(v){return v.id}));
		return _.every(ordering, function(v,i) { 
			var j = _.max(_.map(v.getNeighbours(), function(w) {
				var p = positions.get(w.id);
				if (p < i) return p;
				else return -1;
			}));
			if (j < 0) return true;
			var w = ordering[j];
			//alert(w + " " + j  +" < " + i)
			var earlierNeigboursOfW = new Hash();
			_.each(w.getNeighbours(), function(x) {
				var p = positions.get(x.id);
				if (p < j) earlierNeigboursOfW.set(x.id, p);
			});
			return _.every(v.getNeighbours(), function(x){
				var p = positions.get(x.id);
				return (p >= j) || earlierNeigboursOfW.get(x.id);
			});
		});
  }
};

