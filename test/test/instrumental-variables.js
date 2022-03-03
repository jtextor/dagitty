const {GraphAnalyzer,GraphParser} = require("../../jslib/dagitty-node.js")
const _ = require("underscore")
const $p = (s) => GraphParser.parseGuess(s)
const iv_2_str = ( ivs ) => {
	var r = []
	_(ivs).each( function( i ){
		if( i[1].length > 0 ){
			r.push( i[0].id+" | "+_(i[1]).pluck('id').sort().join(", ") )
		} else {
			r.push( i[0].id )
		}
	} )
	return r.sort().join("\n")
}
QUnit.module("dagitty")

QUnit.test( "instrumental variables", function( assert ) {
	assert.equal((function(){
		var g = $p( "digraph G { u1 [latent] \n u2 [latent] \n"+
			"u2 -> d -> a -> z \n a -> c -> b -> z \n "+
			"u2 -> y \n b -> u1 -> y \n "+
			"\n }" )
		return _.pluck(GraphAnalyzer.closeSeparator(
			g, g.getVertex("y"), g.getVertex("z")
		),"id").join(",")
	})(), "b,d"  )

	assert.equal((function(){	
		var g = $p( "digraph G { u [latent] \n x [exposure] \n y [outcome] \n"+
			" w -> z -> x -> y \n w -> u -> x \n u -> y \n }" )
		return iv_2_str( GraphAnalyzer.conditionalInstruments( g ) )
	})(), "z | w" )

	assert.equal((function(){	
		var g = $p( "digraph G { u [latent] \n x [exposure] \n y [outcome] \n"+
			" z -> x -> y \n u -> x \n u -> y \n }" )
		return iv_2_str( GraphAnalyzer.conditionalInstruments( g ) )
	})(), "z" )

	assert.equal((function(){	
		var g = $p( "digraph G { u \n w -> z -> x -> y \n w -> u -> x \n u -> y }" )
		return _(GraphAnalyzer.ancestralInstrument( g, g.getVertex("x"), g.getVertex("y"), 
			g.getVertex("z") )).pluck("id").join(",")
	})(), "u" )

	assert.equal((function(){	
		var g = $p( "dag{ u \n z -> x -> y \n u -> x \n u -> y \n }" )
		return ""+_(GraphAnalyzer.conditionalInstruments( g, 
			g.getVertex("x"), g.getVertex("y"))[0][1]).pluck("id").join(",")
	})(), "" )

	assert.equal((function(){	
		var g = $p( "digraph G { u [latent] \n w -> z -> x -> y \n w -> u -> x \n u -> y }" )
		return _(GraphAnalyzer.ancestralInstrument( g, g.getVertex("x"), g.getVertex("y"), 
			g.getVertex("z") )).pluck("id").join(",")
	})(), "w" )

	assert.equal((function(){	
		var g = $p( "digraph G { u [latent] \n z -> x -> y \n u -> x \n u -> y \n }" )
		return ""+_(GraphAnalyzer.ancestralInstrument( g, g.getVertex("x"), g.getVertex("y"), 
			g.getVertex("z") )).pluck("id").join(",")
	})(), ""  )
});

