
const {Graph,GraphAnalyzer,GraphParser} = require("../../jslib/dagitty-node.js")


QUnit.module( "dagitty" )
QUnit.test( "graph validation", function( assert ) {

	GraphParser.VALIDATE_GRAPH_STRUCTURE = false

	assert.true( GraphAnalyzer.validate( new Graph(
		"dag { x -> y -> z }"
	)))

	assert.false( GraphAnalyzer.validate( new Graph( "dag{ x -> y -> z -> x } " ) ) )

	assert.true( GraphAnalyzer.validate( new Graph(
		"pdag { x -> y -> z }"
	)))
	
	assert.false( GraphAnalyzer.validate( new Graph(
		"dag { x -- y -> z -> x }"
	)))

	assert.true( GraphAnalyzer.validate( new Graph(
		"pdag { x -- y -> z }"
	)))

	GraphParser.VALIDATE_GRAPH_STRUCTURE = true;
});
