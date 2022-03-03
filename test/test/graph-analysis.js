
const {
	GraphAnalyzer,
	GraphParser
} = require("../../jslib/dagitty-node.js")
const _ = require("underscore")
const TestGraphs = require("../test-graphs.js")


const $p = (s) => GraphParser.parseGuess(s)

QUnit.test( "graph analysis", function( assert ) {
	var g = $p("dag{x->y}")
	assert.equal(GraphAnalyzer.isEdgeVisible(g,g.getEdge("x","y")),true)
	g = $p("mag{x->y}")
	assert.equal(GraphAnalyzer.isEdgeVisible(g,g.getEdge("x","y")),false)
	g = $p("mag{z<->x->y}")
	assert.equal(GraphAnalyzer.isEdgeVisible(g,g.getEdge("x","y")),true)
	g = $p("mag{z->x->y}")
	assert.equal(GraphAnalyzer.isEdgeVisible(g,g.getEdge("x","y")),true)
	g = $p("mag{z--x->y}")
	assert.equal(GraphAnalyzer.isEdgeVisible(g,g.getEdge("x","y")),false)
	g = $p("mag{c<->a {a<->b<->x}->y}")
	assert.equal(GraphAnalyzer.isEdgeVisible(g,g.getEdge("x","y")),true)
	g = $p("mag{c->a {a<->b<->x}->y}")
	assert.equal(GraphAnalyzer.isEdgeVisible(g,g.getEdge("x","y")),true)
	g = $p("mag{c->{a b x}->y}")
	assert.equal(GraphAnalyzer.isEdgeVisible(g,g.getEdge("x","y")),true)


	g = $p("dag{x->y}")
	assert.equal(GraphAnalyzer.isEdgeStronglyProtected(g,g.getEdge("x","y")),false)
	g = $p("dag{x->y<-z}")
	assert.equal(GraphAnalyzer.isEdgeStronglyProtected(g,g.getEdge("x","y")),true)
	g = $p("dag{x->y<-z->x}")
	assert.equal(GraphAnalyzer.isEdgeStronglyProtected(g,g.getEdge("x","y")),false)
	g = $p("dag{{a b}->x->y}")
	assert.equal(GraphAnalyzer.isEdgeStronglyProtected(g,g.getEdge("x","y")),true)

	g = $p("dag{x<-z3<-z1->x}")
	assert.equal(GraphAnalyzer.isEdgeStronglyProtected(g,g.getEdge("z1","x")),true)
	assert.equal(GraphAnalyzer.isEdgeStronglyProtected(g,g.getEdge("z3","x")),false)
	assert.equal(GraphAnalyzer.isEdgeStronglyProtected(g,g.getEdge("z1","z3")),false)

	assert.equal( 
		GraphAnalyzer.containsCycle( TestGraphs.cyclic_graph() ), "A&rarr;B&rarr;C&rarr;A" ) 
	assert.equal(
		$p("x E\ny O\nz\na\n\nx y a z\na y\nz y").countPaths(),3)
	assert.equal((function(){
		// note, this test is overly restrictive as only one solution is
		// considered legal
	   var g = TestGraphs.extended_confounding_triangle();
	   var to = GraphAnalyzer.topologicalOrdering(g)
	   var vids = _.pluck(g.vertices.values(),"id")
	   vids.sort( function(a,b){ return to[a] < to[b] ? -1 : 1 } )
	   return vids.toString();
	})(),"E,D,C,A,B")
	
	var chordalGraphs = [
		"graph { t -- x \n x -- y \n y -- t }",
		"graph { A -- E \n A -- Z \n B -- D \n B -- Z \n D -- Z \n E -- Z \n }",
		"graph { A -- B \n A -- E \n A -- Z \n B -- D \n B -- Z \n D -- Z \n E -- Z \n }",
		"graph { A -- B \n A -- E \n A -- Z \n B -- D \n B -- E \n B -- Z \n D -- Z \n E -- Z }"
	];
	_.each(chordalGraphs, function(g) {
	  assert.equal(GraphAnalyzer.isChordal($p(g)), true);
	});
	assert.equal(GraphAnalyzer.isChordal(TestGraphs.K5), true);
	
	var notChordalGraphs = [
		"graph {a -- b \n a -- x \n b -- y \n x -- y}",
		"graph {A -- E \n A -- Z \n B -- Z \n B -- D \n D -- E}",
		"graph {A -- E \n B -- D \n B -- Z \n B -- A \n D -- Z \n E -- Z }"
	];
	_.each(notChordalGraphs, function(g) {
	  assert.equal(GraphAnalyzer.isChordal($p(g)), false);
	});
});


