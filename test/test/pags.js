
const {GraphParser,
	GraphAnalyzer,
	GraphTransformer} = require("../../jslib/dagitty-node.js")
const TestGraphs = require("../test-graphs.js")

const $p = (s) => GraphParser.parseGuess(s)


QUnit.module('dagitty') 

QUnit.test('miscellaneous PAG tests', assert => {
	let g = GraphParser.parseGuess( "a -> b <- c" )
	assert.false( GraphAnalyzer.dConnected( g, ["a"], ["c"] ) )
	assert.true( GraphAnalyzer.dConnected( g, ["a"], ["c"], ["b"] ) )

	g = GraphParser.parseGuess( "pag { a @-> b <-@ c }" )
	assert.false( GraphAnalyzer.dConnected( g, ["a"], ["c"] ) )
	assert.true( GraphAnalyzer.dConnected( g, ["a"], ["c"], ["b"] ) )

	assert.false( GraphAnalyzer.dConnected( g, [], ["a"] ) )


	assert.equal( GraphAnalyzer.listMsasTotalEffect( 
		TestGraphs.spirtes, [], [], 200 ).length, 200 )

	assert.equal( GraphAnalyzer.violatesAdjustmentCriterion( 
		TestGraphs.spirtes ), false )

	let gam = GraphTransformer.moralGraph( 
		GraphTransformer.ancestorGraph( 
		GraphTransformer.backDoorGraph( TestGraphs.spirtes ) ) )

	assert.equal( gam.edges.length, 302 )

	assert.equal( GraphTransformer.ancestorGraph(
		GraphTransformer.backDoorGraph(
			TestGraphs.spirtes ) ).edges.length, 133 )


	assert.equal( GraphTransformer.backDoorGraph(
		TestGraphs.spirtes ).edges.length, 795 )

	assert.equal(
		GraphTransformer.backDoorGraph(
			$p("pag{ {V2 V1} @-> X -> {V4 @-> Y} <- V3 @-> X X[e] Y[o]}")).
			getVertex("X").getChildren().length, 0, "No children of X" )

	assert.equal(
		GraphTransformer.backDoorGraph(
			$p("pag{ {V2 V1} -> X -> {V4 -> Y} <- V3 -> X X[e] Y[o]}")).
			getVertex("X").getChildren().length, 0 )

	assert.equal(
		GraphTransformer.backDoorGraph(
			$p("pdag{ {V2 V1} -> X -> {V4 -> Y} <- V3 -> X X[e] Y[o]}")).
			getVertex("X").getChildren().length, 0 )

	assert.equal(
		GraphAnalyzer.dpcp($p("pag{ {V2 V1} -> X -> V4 -> Y <- V3 <-> {X V4} X[e] Y[o]}")).length, 2 )

} )
