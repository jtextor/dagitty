
const {
	Graph,
	GraphParser, 
	GraphTransformer,
	GraphSerializer
} = require("../../jslib/dagitty-node.js")

const $p = (s) => GraphParser.parseGuess(s)
const $es = (g) => GraphSerializer.toDotEdgeStatements(g)

QUnit.test( "graph manipulation", function( assert ) {

	var g = $p( "dag G { x <-> x }" )
	assert.equal( g.areAdjacent("x","x"), true, "self loop" )

	g = $p( "map <-> pop" )
	g.changeEdge( g.getEdge("map","pop",Graph.Edgetype.Bidirected), Graph.Edgetype.Directed )
	assert.equal( $es( g  ), "map -> pop", "reserved words"  )

	g = $p( "dag G { x <-> y }" )
	assert.equal( g.areAdjacent("x","y"), true )
	assert.equal( g.areAdjacent("y","x"), true )
	g.changeEdge( g.getEdge("x","y",Graph.Edgetype.Bidirected), Graph.Edgetype.Directed )
	assert.equal( $es( g ), "x -> y" )
	assert.equal( g.areAdjacent("x","y"), true )
	assert.equal( g.areAdjacent("y","x"), true )

	g = $p( "digraph G { x -> y }" )
	assert.equal( g.areAdjacent("x","y"), true )
	g.changeEdge( g.getEdge("x","y"), Graph.Edgetype.Undirected )
	assert.equal( $es( g ), "x -- y" )
	assert.equal( g.areAdjacent("x","y"), true )

	g = $p( "digraph G { x -> y }" )
	assert.equal( g.areAdjacent("x","y"), true )
	g.reverseEdge( g.getEdge("x","y"), Graph.Edgetype.Undirected )
	assert.equal( $es( g ), "y -> x" )
	assert.equal( g.areAdjacent("x","y"), true )

	g = $p( "digraph G { x -- y }" )
	assert.equal( g.areAdjacent("x","y"), true )
	g.changeEdge( g.getEdge("y","x",Graph.Edgetype.Undirected), Graph.Edgetype.Directed )
	assert.equal( $es( g ), "x -> y" )
	assert.equal( g.areAdjacent("x","y"), true )

	g = $p( "digraph G { x -- y }" )
	g.changeEdge( g.getEdge("y","x",Graph.Edgetype.Undirected), Graph.Edgetype.Directed, "y" )
	assert.equal( $es( g ), "y -> x", "edge change" )

	g = $p( "digraph G { y <- x <-> m -- y }")
	g.deleteVertex("m")
	assert.equal( $es( g ), "x -> y", "vertex deletion"  )
} )

