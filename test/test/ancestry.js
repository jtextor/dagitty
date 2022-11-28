
const {
	Graph,
	GraphParser, 
	GraphTransformer,
	GraphSerializer
} = require("../../jslib/dagitty-node.js")

const _ = require("underscore")

const TestGraphs = require("../test-graphs.js")

QUnit.module('dagitty')

QUnit.test( "ancestry", function( assert ) {
	var shrier = TestGraphs.findExample("Shrier")
	assert.equal(
		(_.pluck(shrier.ancestorsOf(
			shrier.getVertex(["PreGameProprioception"])),"id")).sort().join(",")
		, "Coach,FitnessLevel,Genetics,PreGameProprioception" )

	assert.equal((function(){
	    var g = GraphParser.parseGuess( 
			"digraph G {a -- b }" )
		return g.getVertex("a").getNeighbours().length
	})(), 1 )
})


