
const {Graph,GraphAnalyzer,GraphParser,GraphSerializer,GraphTransformer} = require("../../jslib/dagitty-node.js")
const TestGraphs = require("../test-graphs.js")
const _ = require("underscore")

const $p = (s) => GraphParser.parseGuess(s)
const $es = (g) => GraphSerializer.toDotEdgeStatements(g)


QUnit.test( "graph transformations", function( assert ) {
	assert.equal(
		$es(GraphTransformer.lineDigraph(
			$p( "dag{a<-b->c}" ))),
			"")
	assert.equal(
		$es(GraphTransformer.lineDigraph(
			$p( "dag{a->b->c}" ))),
			"ab -> bc")

	assert.equal(
		$es(GraphTransformer.lineDigraph(
			$p( "dag{a->b [label=x] b->c [label=y]}" ))),
			"x -> y")

	assert.equal(
		GraphTransformer.ancestorGraph( TestGraphs.small1() ).oldToString(),
		"A 1\nS E\nT O\n\nA S\nS T" ) 
	assert.equal(
		GraphTransformer.moralGraph(
			GraphTransformer.ancestorGraph(TestGraphs.small1()) ).oldToString()
		, "A 1\nS E\nT O\n\nA S\nS A T\nT S" ) 
	assert.equal((function(){
	  var g = TestGraphs.confounding_triangle_with_irrelevant_nodes();
	  var vv = [];
		_.each(GraphTransformer.ancestorGraph(g).vertices.values(),function( v ){
		vv.push( v.id );
	  } );
	  vv.sort();
	  return vv.join(",");
	})(), "A,B,M,U1,U2" )
	assert.equal((function(){
	   var g = TestGraphs.m_bias_graph();
	   g.addAdjustedNode( "M" );
	   return GraphTransformer.moralGraph( 
		GraphTransformer.ancestorGraph(GraphTransformer.backDoorGraph(g)) ).oldToString()
	})(), "A E\nB O\nM A\nU1 1\nU2 1\n\n"+
		"A U1\nB U2\nM U1 U2\nU1 A M U2\nU2 B M U1" )

	assert.equal((function(){
	   return GraphTransformer.moralGraph( 
			GraphTransformer.ancestorGraph(
				GraphTransformer.backDoorGraph(TestGraphs.m_bias_graph())) ).oldToString()
	})(), "A E\nB O\nU1 1\nU2 1\n\nA U1\nB U2\nU1 A\nU2 B" )
	
	assert.equal((function(){
		var g = $p("dag{x<-z3<-z1->x}")
		return GraphTransformer.markovEquivalentDags(g).length
	})(),6,"markov equiv")

	var transformations = [
		GraphTransformer.pagToPdag,
		"pag{x@-@y@->z}","pdag{x--y->z}",

		GraphTransformer.dagToCpdag,
		"dag{x->y}", "pdag { x -- y }",
		"dag{x->y<-z}", "pdag { x -> y <- z }",
		"dag{x->y<-z->x}", "pdag { x -- y -- z -- x }",
		"dag{z1->{x z3} z2->{z3 y} z3->{x y} x->w->y}",
			"pdag {x <- z1 z1->z3 z2->z3 y<-z2 x<-z3 z3->y x->w->y}",

		GraphTransformer.cgToRcg,
		"pdag { k -- n; l -- m; n -- t; t -- y; x -> y; }",
		 "pdag { k;l;m;n;t;x;y; l -- m; n -> k; t -> n; x -> y; y -> t }",
		"pdag { k -- n; l -- m; l -> n; l -> t; l -> y; n -- t; t -- y; x -> y; }",
		 "pdag { k;l;m;n;t;x;y; l -- m; l -> n; l -> t; l -> y; n -> k; t -> n; x -> y; y -> t }",
		"pdag {a -> b -- c <- d }",
		 null,
		"digraph { a -> b; b -- c; c <- d; b -- d }",
		"digraph { a -> b; b -> c; b -> d; d -> c }",

		function (g){ return GraphTransformer.contractComponents(g, 
			GraphAnalyzer.connectedComponents(g), [Graph.Edgetype.Directed])},
		"pdag { k -- n l -- m n -- t t -- y x -> y }",
		 'pdag { "l,m" ; x -> "k,n,t,y" }',
		"digraph { a -- b; b -> c; c -- a }",
		 'digraph { "a,b,c" -> "a,b,c" }',
		 
		 GraphTransformer.transitiveClosure,
		 "dag G { x -> y -> z }",
		 "dag G { x -> y -> z <- x }",
		  
		 GraphTransformer.transitiveReduction,
		 "dag G { x -> y -> z <- x }",
		 "dag G { x -> y -> z }",
		 
		 GraphTransformer.dag2DependencyGraph,
		 "dag G { x -> y -> z <- x }",
		 "graph G { x -- y -- z -- x }",
		 "dag G { x -> y -> z }",
		 "graph G { x -- y -- z -- x }",
		 "dag G { x -> y <- z }",
		 "graph G { x -- y -- z }",

		 GraphTransformer.dagToMag,
		 "dag { v1 [latent]     z <- v1 -> v2 -> y    x -> v1}",
		 "mag { x -> z <-> v2 -> y  x -> v2 }",
		 "dag { l1 [latent] l2 [latent]  a -> x   l1 -> x  l1 -> z   l2 -> y  l2 -> z  x -> y   z -> x  z -> y}",
		 "mag { a -> x   a -> y   x -> y   z -> x   z -> y } ",

	];
	var i = 0; var transfunc;
	while (i < transformations.length) {
		if (typeof transformations[i] === "function") {
			transfunc = transformations[i];
			i ++;			
		}
		var gin = transformations[i]; i++;
		if (typeof gin === "string") gin = $p(gin);
		var gout = transfunc(gin);
		var gref = transformations[i]; i++;	
		if( gref != null ){ gref = $p(gref) }
		assert.equal(GraphAnalyzer.equals(gout, gref),true);
	}
});



