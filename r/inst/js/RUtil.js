/** This file contains some utility function that convert the results of important 
	DAGitty functions into a format that is more easily mapped to an R list-of-lists. */

/* globals _, examples, GraphParser  */
/* exported DagittyR */

var DagittyR = {
	adj2r : function( ss ){
		'use strict'
		var r = {}, i=1
		if( ss.length === 0 )
			return r
		_.each( ss, function(s){
			var rs = _.pluck( s, 'id').sort()
			r[i++]=rs
		})
		return r
	},

	imp2r : function( imp ){
		'use strict'
		var r = {}, k=1, rk
		_.each( imp, function( i ){
			_.each( i[2], function( z ){
				rk = { X: i[0], Y: i[1] }
				rk.Z = _.pluck( z, 'id').sort()
				r[k++]=rk
			})
		})
		return r
	},

	iv2r : function( ivs ){
		'use strict'
		var r = {}, j=1, rk
		_.each(ivs, function( i ){
			rk = { "I": i[0].id }
			if( i[1].length > 0 ){
				rk.Z = _.pluck(i[1],'id').sort()
			} 
			r[j++]=rk
		} )
		return r
	},

	canonicalAdjustment : function( g ){
		return this.adj2r( GraphAnalyzer.canonicalAdjustmentSet( g ) )
	},
	
	edgeAttributes2r : function( g, a ){
		'use strict'
		var r = { v : [], w : [], e : [], a : [] }
		_.each(g.edges, function( e ){
			r.v.push( e.v1.id )
			r.w.push( e.v2.id )
			r.a.push( e.attributes ? e.attributes[a] : null )
			r.e.push( Graph.Edgetype.Symbol[e.directed] )
		} )
		return r
	},

	edge2r : function( g ){
		'use strict'
		var r = { v : [], w : [], e : [], x : [], y : [] }
		_.each(g.edges, function( e ){
			r.v.push( e.v1.id )
			r.w.push( e.v2.id )
			r.x.push( e.layout_pos_x )
			r.y.push( e.layout_pos_y )
			r.e.push( Graph.Edgetype.Symbol[e.directed] )
		} )
		return r
	},
	
	paths2r : function( ga, Z, g ){
		var AnZ = g.ancestorsOf( g.getVertex( Z ) )
		var i = 0, r = { paths : [], open : [] }
		for( ; i < ga.length ; i ++ ){
			r.paths.push( GraphSerializer.pathToDot( ga[i] ) )
			r.open.push( GraphAnalyzer.dConnected( ga[i], 
				ga[i].getSources(), ga[i].getTargets(), 
				ga[i].getVertex( Z ), AnZ )
			)
		}
		return r
	},

	getVertices : function( g, a ){
		var r = [], v, ak = Object.keys( a )
		for( var i = 0 ; i < a.length ; i ++ ){
			v = g.getVertex( a[ak[i]] )
			if( v ){
				r.push(v)
			}
		}
		return r
	},
	
	dconnected : function( g, X, Y, Z ){
		var r = GraphAnalyzer.dConnected( g, 
			g.getVertex(X), 
			g.getVertex(Y), 
			g.getVertex(Z) )
		if( Y.length > 0 ){
			return r
		} else {
			return _.difference( _.pluck(r,'id'),
				_.pluck(g.S,'id'), _.pluck(g.L,'id') )
		}
	},
	
	findExample : function( s ){
		'use strict'
		for( var i = 0 ; i < examples.length ; i++ ){
			if( examples[i].l.toLowerCase().indexOf(s.toLowerCase()) >= 0 ){
				return GraphParser.parseGuess(examples[i].e,examples[i].v).toString()
			}
		}
	}
}
