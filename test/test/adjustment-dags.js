
const {GraphParser,GraphAnalyzer,GraphTransformer} = require("../../jslib/dagitty-node.js")
const TestGraphs = require("../test-graphs.js")
const _ = require("underscore")

const $p = (s) => GraphParser.parseGuess(s)
const sep_2_str = (ss) => {
   var r = [];
   if( ss.length == 0 )
      return "";
   _.each( ss, function(s){
      var rs = _.pluck( s, 'id').sort().join(", ");
      r.push(rs);
   });
   r.sort();
   return "{"+r.join("}\n{")+"}";
}

QUnit.module("dagitty")

QUnit.test( "adjustment in DAGs", function( assert ) {

	assert.equal((function(){
		var g = $p("pdag{ x -> {a -- b -- c -- a } b -> y x[e] y[o] }")
		return _.pluck(GraphAnalyzer.properPossibleCausalPaths(g),"id").sort().join(" ")
	})(), "a b c x y" )

	assert.equal((function(){
		var g = $p("pdag{ x -> a -- b -> y x[e] y[o] }")
		return _.pluck(GraphAnalyzer.properPossibleCausalPaths(g),"id").sort().join(" ")
	})(), "a b x y" )

	assert.equal((function(){
		var g = $p("pdag{ x -> a -- b -- c -> y x[e] y[o] }")
		return _.pluck(GraphAnalyzer.properPossibleCausalPaths(g),"id").sort().join(" ")
	})(), "a b c x y" )


	assert.equal((function(){
		// our non-X-ancestor MSAS example from the UAI paper w/ causal edge
		var g = $p("X1 E\nX2 E\nY O\nM1 1\nM2 1\n\nX1 Y M1\nY M2\nM1 M2\nM2 X2")
		return sep_2_str( GraphAnalyzer.listMsasDirectEffect( g ) )
	})(), "" )

	assert.equal((function(){
		// our non-X-ancestor MSAS example from the UAI paper w/o causal edge
		var g = $p("X1 E\nX2 E\nY O\nM1 1\nM2 1\n\nX1 M1\nY M2\nM1 M2\nM2 X2")
		return sep_2_str( GraphAnalyzer.listMsasDirectEffect( g ) )
	})(), "{M1, M2}" )

	assert.equal((function(){
		var g = TestGraphs.findExample( "Thoemmes" )
		return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) )
	})(), "" )

	assert.equal((function(){
		var g = TestGraphs.findExample( "Thoemmes" )
		g.removeAdjustedNode("s2")
		return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) )
	})(), "{}" )

	assert.equal((function(){
		var g = TestGraphs.findExample( "Thoemmes" )
		return sep_2_str( GraphAnalyzer.listMsasDirectEffect( g ) )
	})(), "{e2, s2}\n{s1, s2}" )

	assert.equal((function(){
		var g = TestGraphs.findExample( "mediat" )
		return sep_2_str( GraphAnalyzer.listMsasDirectEffect( g ) )
	})(), "{I}" )

	assert.equal((function(){
		var g = $p("dag{x[e] y[o] x<-z->y}")
		return GraphAnalyzer.isAdjustmentSet(g,["z"])
	})(), true)

	assert.equal((function(){
		var g = $p("dag{x[e] y[o] x<->m<->y x->y}")
		return GraphAnalyzer.isAdjustmentSet(g,["m"])
	})(), false)

	assert.equal(
		sep_2_str( GraphAnalyzer.listMsasTotalEffect( TestGraphs.findExample("Polzer") ) ),
		"{Age, Alcohol, Diabetes, Obesity, Psychosocial, Sex, Smoking, Sport}\n"+
		"{Age, Alcohol, Periodontitis, Psychosocial, Sex, Smoking}" )
	assert.equal((function(){
	   var g = TestGraphs.m_bias_graph();
	   g.addAdjustedNode("A");
	   return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
	})(), "{A}" )
	assert.equal((function(){
	   var g = TestGraphs.m_bias_graph();
	   g.addAdjustedNode("M");
	   return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
	})(), "{M, U1}\n{M, U2}" )
	assert.equal((function(){
		var g = TestGraphs.findExample( "Acid" );
		g.addAdjustedNode("x9");
		return GraphAnalyzer.violatesAdjustmentCriterion( g )
	})(), true )

	assert.equal((function(){
		var g = TestGraphs.findExample( "Acid" );
		g.addAdjustedNode("x16");
		return GraphAnalyzer.violatesAdjustmentCriterion( g )
	})(), true )

	assert.equal((function(){
		var g = TestGraphs.findExample( "Acid" );
		return GraphAnalyzer.violatesAdjustmentCriterion( g )
	})(), false )
	
	assert.equal( sep_2_str(GraphAnalyzer.listMsasTotalEffect(
		$p("dag { X1 [exposure]\n "+
		"X2 [exposure]\n Y1 [outcome] \n Y2 [outcome]\n "+
		"C -> Y1 \n"+
		"C -> m \n X1 -> X2 \n X1 -> Y2 -> Y1 \n X2 -> Y1 \n X1 -> m2 -> m -> X2 }"))),
		"{C}\n{m, m2}")

	g = $p( "dag G { a <-> b } " )
	assert.equal( GraphTransformer.trekGraph( g ).edges.length, 4, "trek graph with <->" )


});

