const {
	Graph,
	GraphSerializer, 
	GraphParser, 
	GraphTransformer
} = require("../../jslib/dagitty-node.js")
const TestGraphs = require("../test-graphs.js")

const _ = require("../../jslib/underscore-mock-es6.js")

GraphParser.VALIDATE_GRAPH_STRUCTURE = true
const $p = function(s){ return GraphParser.parseGuess(s) }
const $es = function(g){ return GraphSerializer.toDotEdgeStatements(g) }

QUnit.module('dagitty')

QUnit.test( "parsing and serializing", function( assert ) {
	// GraphParser.VALIDATE_GRAPH_STRUCTURE = false;
	//
	//
	
	assert.equal( (new Graph("dag{a->b}")).vertices.values().length, 2, "DAG construction from dot string" )	
	assert.equal( (new Graph(" dag { a -> b } ")).vertices.values().length, 2, "DAG construction from dot string" )	
	assert.equal( (new Graph("a->b")).vertices.values().length, 2, "DAG construction from arrow string" )


	assert.equal( $es( $p( "map -> pop" ) ), "map -> pop", "reserved words"  )

	assert.equal( $es( $p( "x -> y" ) ), "x -> y", "shorthand notation"  )

	assert.equal( $p( "dag{{x->{a b}}}" ).edges.length, 2, "grouping" )

	assert.equal( $p( "dag{{x->{a ; b}}}" ).edges.length, 2,
		"semicolons" )
	assert.equal( $p( "dag{a;b}" ).getVertices().length, 2,
		"semicolons 2" )
	assert.equal( $p( "dag{;b}" ).getVertices().length, 1,
		"semicolons 2" )
	assert.equal( $p( "dag{a;}" ).getVertices().length, 1, 
		"semicolons 2" )

	assert.equal( $p( "dag{}" ).getVertices().length, 0,
		"semicolons 2" )
	assert.equal( $p( "dag{;}" ).getVertices().length, 0,
		"semicolons 2" )
	assert.equal( $p( "dag{;;;}" ).getVertices().length, 0,
		"semicolons 2" )

	assert.equal( $p( "dag{a}" ).getVertices().length,
		1, "spaces" )
	assert.equal( $p( "dag{a }" ).getVertices().length,
		1, "spaces" )
	assert.equal( $p( "dag{ a }" ).getVertices().length,
		1, "spaces" )


	assert.equal( $p( "pag{a @-> {b --@ {c @-@ d} }}" ).edges.length, 6 )
	assert.equal( _.pluck($p( "pag{a @->b<-@c}" ).getVertices(),"id").sort().join(","), "a,b,c" )
	assert.equal( _.pluck($p( "pag{a @->b<-@c @-@d}" ).getVertices(),"id").sort().join(","), "a,b,c,d" )

	assert.equal( $p( "dag{x->{a b}}" ).edges.length, 2 )

	assert.equal( $p( "dag{x->{a->b}}" ).edges.length, 3 )

	assert.equal( $p( "dag{a->{b->{c->{d->e}}}}" ).edges.length, 10 )

	assert.equal( GraphSerializer.toDotVertexStatements( $p( 
		"digraph G { \"ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗ\" }" ) ).trim(), 
			"\"ᚠᛇᚻ᛫ᛒᛦᚦ᛫ᚠᚱᚩᚠᚢᚱ᛫ᚠᛁᚱᚪ᛫ᚷᛖᚻᚹᛦᛚᚳᚢᛗ\"" )

	assert.equal( GraphSerializer.toDotVertexStatements( $p( 
		"digraph G { x [label=\"από το Άξιον Εστί\"] }" ) ).trim(), 
			"x [label=\"από το Άξιον Εστί\"]" )

	assert.equal( GraphSerializer.toDot( $p( 
		"digraph G { graph [bb=\"0,0,100,100\"] }" ) ).trim(), 
			"digraph G{\nbb=\"0,0,100,100\"\n\n}" )

	assert.equal( TestGraphs.small1().oldToString(), "A 1\nS E\nT O\n\nA S\nS T" )

	assert.equal((function(){
		var g = $p( 
		"digraph G { x <-> y }"
		).addSource("x").addTarget("y")
		GraphTransformer.activeBiasGraph( g )
		return g.edges[0].directed
	})(), Graph.Edgetype.Bidirected )

	assert.equal((function(){
		var g = $p( 
			"digraph G { xi1 [latent]\n"+
			"xi1 -> x1\n"+
			"xi1 -> x3\n"+
			"xi1 -> x4\n"+
			"xi1 -> x5\n"+
			"x5 -> x6\n"+
			"x1 -> x6\n"+
			"x6 -> x3 }\n"
		)
		return g.oldToString()
	})(), "x1 1\nx3 1\nx4 1\nx5 1\nx6 1\nxi1 U\n\nx1 x6\nx5 x6\nx6 x3\nxi1 x1 x3 x4 x5" )

	assert.equal((function(){
		var g = GraphParser.parseDot( 
			"digraph  { xi1 [latent]\n"+
			"xi2 [latent]\n"+
			"xi1 <-> xi2\n"+
			"xi1 -> x1\n"+
			"xi1 -> x2\n"+
			"xi1 -> x3\n"+
			"xi2 -> x4\n"+
			"xi2 -> x5\n"+
			"xi2 -> x6 } "
		)
		return g.oldToString()
	})(), "x1 1\nx2 1\nx3 1\nx4 1\nx5 1\nx6 1\nxi1 U\nxi2 U\n\nxi1 x1 x2 x3 xi2\nxi2 x4 x5 x6 xi1", "old syntax still works" )

	assert.equal((function(){
		var g = GraphParser.parseDot( "digraph { x -> y\ny -> z\nx <-> y } " )
		return $es(g)
	})(), "x -> y\nx <-> y\ny -> z" )


	assert.equal((function(){
		var g = $p( 
			"digraph G {\ny -- x -> y <-> x }" )
		return $es(g) 
	})(), "x -- y\nx -> y\nx <-> y" )


	assert.equal((function(){
		var g = $p( 
			"graph G {\nx [ exposure , pos =\" 12. , .13 \"]\ny [outcome]\n}" )
		return GraphSerializer.toDot(g) 
	})(), "graph G{\nx [exposure,pos=\"12.000,0.130\"]\ny [outcome]\n\n}\n" )


	assert.equal((function(){
		var g = $p( 
			"graph G { x [exposure] \n y [outcome] }" )
		g.getVertex("x").layout_pos_x = 1.0
		g.getVertex("x").layout_pos_y = 1.0
		return GraphSerializer.toDot(g)
	})(), "graph G{\nx [exposure,pos=\"1.000,1.000\"]\ny [outcome]\n\n}\n" )

	assert.equal((function(){
		var g = $p( 
			"graph G { x \n y }" )
		return GraphSerializer.toDot(g)
	})(), "graph G{\nx\ny\n\n}\n" )

	assert.equal((function(){
		var g = $p( 
			"graph G { x [] \n y [] }" )
		return GraphSerializer.toDot(g)
	})(), "graph G{\nx\ny\n\n}\n" )

	assert.equal((function(){
		var g = $p( 
			"digraph G { x [] \n y [] }" )
		g.addEdge("x","y",Graph.Edgetype.Directed)
		g.addEdge("x","y",Graph.Edgetype.Undirected)
		g.addEdge("x","y",Graph.Edgetype.Bidirected)
		return $es(g)
	})(), "x -- y\nx -> y\nx <-> y" )

	assert.equal((function(){
		var g = $p( "digraph G { x <-> m } " )
		return typeof g.getEdge("m","x",2)
	})(), "object" )

	assert.equal((function(){
		var g = $p( "digraph G { x <-> m } " )
		return typeof g.getEdge("x","m",2)
	})(), "object" )

	assert.equal((function(){
		var g = $p( "digraph G { x -> m } " )
		return $es(g)
	})(), "x -> m" )

	assert.equal((function(){
		var g = $p( "dag G { M [pos=\"-0.521,-0.265\"] \n "+
			"X [exposure,pos=\"-1.749,-0.238\"] \n "+
			"Y [outcome,pos=\"1.029,-0.228\"] \n "+
			"M <-> Y [pos=\"0.645,-0.279\"] \n "+
			"X -> Y \n "+
			"X -> M -> Y } " )
		return GraphSerializer.toDot(g)
	})(), "dag G{\nM [pos=\"-0.521,-0.265\"]\n"+
		"X [exposure,pos=\"-1.749,-0.238\"]\n"+
		"Y [outcome,pos=\"1.029,-0.228\"]\n"+
		"M -> Y\n"+
		"M <-> Y [pos=\"0.645,-0.279\"]\n"+
		"X -> M\n"+
		"X -> Y\n}\n" )

	assert.equal((function(){
		var g = $p( "dag G { M [pos=\"-0.521,-0.265\"] "+
			"X [exposure,pos=\"-1.749,-0.238\"] "+
			"Y [outcome,pos=\"1.029,-0.228\"] "+
			"M <-> Y [pos=\"0.645,-0.279\"] "+
			"X -> Y "+
			"X -> M -> Y } " )
		return GraphSerializer.toDot(g)
	})(), "dag G{\nM [pos=\"-0.521,-0.265\"]\n"+
		"X [exposure,pos=\"-1.749,-0.238\"]\n"+
		"Y [outcome,pos=\"1.029,-0.228\"]\n"+
		"M -> Y\n"+
		"M <-> Y [pos=\"0.645,-0.279\"]\n"+
		"X -> M\n"+
		"X -> Y\n}\n" )

	assert.equal((function(){
		var g = $p( 
			"digraph G { x -- y \n x -> y \n x <-> y [pos=\"1.000,1.000\"] }" )
		return $es(g) 
	})(), "x -- y\nx -> y\nx <-> y [pos=\"1.000,1.000\"]" )

	assert.equal((function(){
		var g = $p( 
			"digraph G {\n  y --   x -> y   <-> x [pos=\"1.0,0.1\"] }" )
		return $es(g) 
	})(), "x -- y [pos=\"1.000,0.100\"]\nx -> y [pos=\"1.000,0.100\"]\nx <-> y [pos=\"1.000,0.100\"]" )

	assert.equal(GraphSerializer.toLavaan($p("dag{x1}")).split("\n")[1]
		,"x1 ~~ x1")
		
	assert.equal( $es($p( 
			"dag{ U -> {a b c d} }" )), "U -> a\nU -> b\nU -> c\nU -> d" )

} )

