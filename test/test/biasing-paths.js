const {
	Graph,GraphParser,GraphTransformer,GraphSerializer
} = require("../../jslib/dagitty-node.js")
const TestGraphs = require("../test-graphs.js")
const _ = require("underscore")

const $p = (s) => GraphParser.parseGuess(s)
const $es = (g) => GraphSerializer.toDotEdgeStatements(g)


QUnit.module('dagitty') 

QUnit.test( "biasing paths in DAGs (allowing <->)", function( assert ) {
	assert.equal((function(){
	  var g = TestGraphs.confounding_triangle_with_irrelevant_nodes();
	  var vv = [];
	  _.each(GraphTransformer.activeBiasGraph(g).vertices.values(),function( v ){
		vv.push( v.id );
	  })
	  vv.sort();
	  return vv.join(",");
	})(),"A,B,M" )
assert.equal((function(){
	var g = $p( "digraph G { x <-> y } " )
	return $es(
		GraphTransformer.activeBiasGraph(g,{X:g.getVertex(["x"]),Y:g.getVertex(["y"])}))
})(), "x <-> y" )

assert.equal((function(){
	var g = $p( "digraph G { x <- m <-> y } " )
	g.addSource("x")
	g.addTarget("y")
	return $es(GraphTransformer.activeBiasGraph(g))
})(), "m -> x\nm <-> y" )

assert.equal((function(){
	var g = $p( "digraph G { x -> m <-> y } " )
	g.addSource("x")
	g.addTarget("y")
	g.addAdjustedNode("m")
	return $es(GraphTransformer.activeBiasGraph(g))
})(), "m <-> y\nx -> m" )

assert.equal((function(){
	var g = $p( "digraph G { m <-> y \n x -> m -> y } " )
	g.addSource("x")
	g.addTarget("y")
	g.addAdjustedNode("m")
	return $es(GraphTransformer.activeBiasGraph(g))
})(), "m <-> y\nx -> m" )

assert.equal((function(){
	var g = $p( "digraph G { m <-> y \n x -> m -> y } " )
	g.addSource("x")
	g.addTarget("y")
	return $es(GraphTransformer.activeBiasGraph(g))
})(), "" )

assert.equal((function(){
	var g = $p( "digraph G { M \n "+
		"X [exposure] \n "+
		"Y [outcome] \n "+
		"M <-> Y [pos=\"0.645,-0.279\"] \n "+
		"X -> Y \n "+
		"X -> M -> Y } " )
	return $es(GraphTransformer.activeBiasGraph(g))
})(), "" )


assert.equal( GraphTransformer.activeBiasGraph( new Graph("x->m->y z->{x y}"), { X:["x"] , Y:["y"] } ).edges.length, 2 )

assert.equal( GraphTransformer.activeBiasGraph( new Graph("x->m->y"), {direct : true, X:["x"], Y:["y"] } ).edges.length, 2 )


});

