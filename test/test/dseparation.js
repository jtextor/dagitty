
const {Graph,GraphAnalyzer} = require("../../jslib/dagitty-node.js")
const TestGraphs = require("../test-graphs.js")


const $p = (s) => new Graph(s)

QUnit.module("dagitty")
QUnit.test( "dseparation", function( assert ) {
	assert.equal((function(){
		var g = $p( "digraph G { x <-> m -> y }" )
		return GraphAnalyzer.dConnected( g, ["x"], ["y"], 
			[] )
	})(), true )

	assert.equal((function(){
		var g = $p( "digraph G { x <-> m -> y }" )
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			[g.getVertex("m")] )
	})(), false )

	assert.equal((function(){
		var g = $p( "digraph G { x <-> m <-> b <-> y }" )
		return GraphAnalyzer.dConnected( g, ["x"], [g.getVertex("y")], 
			[g.getVertex("m")] )
	})(), false )

	assert.equal((function(){
		var g = $p( "digraph G { x <-> m <-> b <-> y }" )
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			[g.getVertex("m"),g.getVertex("b")] )
	})(), true )

	assert.equal((function(){
		var g = $p( "digraph G { x -> m -> y }" )
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], ["y"], 
			[] )
	})(), true )

	assert.equal((function(){
		var g = $p( "digraph G { x -> m -> y }" )
		return !GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			[g.getVertex("m")] )
	})(), true )

	assert.equal((function(){
		var g = $p( "digraph G { x -> m -> y }" )
		return !GraphAnalyzer.dConnected( g, ["x"], ["y"], [] )
	})(), false )

	assert.equal((function(){
		var g = $p("dag{R->S->T<-U}")
		g = GraphAnalyzer.listPaths( g, false, 1, [g.getVertex("R")], [g.getVertex("U")] )[0]
		return GraphAnalyzer.dConnected( g, [g.getVertex("R")], [g.getVertex("U")], 
			g.getVertex(["T"]) )
	})(), true )

	assert.equal((function(){	
		var g = $p("dag{ a->x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, [g.getVertex("a")], [g.getVertex("y")], 
			g.getVertex(["m"]) )
	})(), true )

	assert.equal((function(){	
		var g = $p("dag{ a->x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, g.getVertex(["x"]), [g.getVertex("y")], 
			g.getVertex(["m"]), g.getVertices(["x"]) )
	})(), true )

	assert.equal((function(){	
		var g = $p("dag{ x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			[g.getVertex("m")] )
	})(), true )

	assert.equal((function(){	
		var g = $p("dag{ x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			g.getVertex(["p"]), g.getVertex(["m","p"])  )
	})(), true )

	assert.equal((function(){	
		var g = $p("dag{ x[e] y[o] x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			g.getVertex([]), [] )
	})(), false )

	assert.equal((function(){	
		var g = $p("dag{ x[e] y[o] x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			g.getVertex([]), g.getVertex(["m","p"]) )
	})(), true )

	assert.equal((function(){	
		var g = $p("dag{ x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			[g.getVertex("m")] )
	})(), true )

	assert.equal((function(){	
		var g = $p("dag{ x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			[g.getVertex("p")] )
	})(), true )

	assert.equal((function(){	
		var g = $p("dag{ x->m<-y m->p }")
		return GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
			[] )
	})(), false )

	assert.equal((function(){	
		var g = TestGraphs.findExample("onfound")
		return GraphAnalyzer.dConnected( g, ["E"], ["B"], 
			["Z"] )
	})(), true )
});

