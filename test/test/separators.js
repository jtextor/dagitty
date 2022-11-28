
const {Graph,GraphAnalyzer,GraphParser,GraphTransformer} = require("../../jslib/dagitty-node.js")
const _ = require("underscore")
const TestGraphs = require("../test-graphs.js")

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

QUnit.module('dagitty')

QUnit.test( "separators", function( assert ) {
	let g, gm
	function verts(a) {
		return _.isArray(a) ? a.map(function(vid){return g.getVertex(vid)}) : [g.getVertex(a)]
	}

	g = $p("length -> push -> pop map -> { length push }")
	assert.equal( GraphAnalyzer.listMinimalImplications( g ).length, 2, "reserverd words" )
	
	g = GraphTransformer.backDoorGraph(TestGraphs.small1())
	assert.equal( sep_2_str( GraphAnalyzer.listMinimalSeparators(g) ), "{}" )
	assert.strictEqual( sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g) ] ) , "{}" )

	g = GraphTransformer.backDoorGraph(TestGraphs.confounding_triangle())
	gm = GraphTransformer.moralGraph(GraphTransformer.ancestorGraph(g))
	assert.equal( sep_2_str( GraphAnalyzer.listMinimalSeparators(gm) ), "{C}" )
	assert.equal( sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g) ] ), "{C}" )
		
	
	g = GraphTransformer.backDoorGraph(TestGraphs.m_bias_graph())
	gm = GraphTransformer.moralGraph(GraphTransformer.ancestorGraph(g))
	assert.equal( sep_2_str ( GraphAnalyzer.listMinimalSeparators(gm) ), "{}" ) 
	assert.equal( sep_2_str( [ GraphAnalyzer.findMinimalSeparator(gm)  ] ) , "{}" )
		 
	g = GraphTransformer.backDoorGraph(TestGraphs.extended_confounding_triangle())
	gm = GraphTransformer.moralGraph(GraphTransformer.ancestorGraph(g))
	assert.equal(sep_2_str( GraphAnalyzer.listMinimalSeparators(gm) ), "{C, D}\n{C, E}") 
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g) ] ) , "{C, D}") 

	assert.equal(sep_2_str(GraphAnalyzer.listMinimalSeparators( gm, verts(["D"]), [] ) ), "{C, D}" ) 
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, verts(["D"]), []) ] ) , "{C, D}") 

	assert.equal(sep_2_str( GraphAnalyzer.listMinimalSeparators(gm, [], [], 1) ), "{C, E}") 
	assert.equal(sep_2_str( GraphAnalyzer.listMinimalSeparators(gm, [], verts(["D"])) ), "{C, E}") 
 	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, [], verts(["D"]) ) ] ) , "{C, E}") 
	
	g = $p("digraph {"+
		"D [outcome] "+
		"E [exposure] "+
		"v1 v2 v3 v4 v5 v6 v7 "+
		"D <-> v5 "+
		"E -> v1 "+
		"E -> v6 "+
		"v1 -> D "+
		"v2 -> D "+
		"v2 -> E "+
		"v3 -> E "+
		"v3 <-> v4 "+
		"v4 -> v6 "+
		"v5 -> v4 "+
		"v6 -> v7 "+
		"v7 -> D"+
		"}")

	gm = GraphTransformer.moralGraph(GraphTransformer.ancestorGraph(g))
	assert.equal(sep_2_str( GraphAnalyzer.listMinimalSeparators(gm) ), "{v1, v2, v3, v4, v6}\n{v1, v2, v3, v4, v7}\n{v1, v2, v5, v6}\n{v1, v2, v5, v7}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g) ] ), "{v1, v2, v3, v4, v6}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, verts("D"), verts("E")) ] ), "{v1, v2, v5, v7}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, verts("v7")) ] ), "{v1, v2, v3, v4, v7}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, verts("v5")) ] ), "{v1, v2, v5, v6}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, verts(["v5","v7"])) ] ), "{v1, v2, v5, v7}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, [], verts(["v7"])) ] ), "{v1, v2, v3, v4, v6}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, [], verts(["v6"])) ] ), "{v1, v2, v3, v4, v7}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, [], verts(["v4"])) ] ), "{v1, v2, v5, v6}")
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, null, null, [], verts(["v4","v6"])) ] ), "{v1, v2, v5, v7}")
	assert.strictEqual(GraphAnalyzer.findMinimalSeparator(g, null, null, [], verts(["v2"])) , false)
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, verts("v4"), verts("v2")) ]) , "{}" )
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, verts("v4"), verts("v2"), verts("D"), []) ]) , "{D, E, v3, v5, v6}" )
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, verts("v4"), verts("v2"), verts(["D","v7"]), []) ]) , "{D, E, v3, v5, v7}" )
	assert.equal(sep_2_str( [ GraphAnalyzer.findMinimalSeparator(g, verts("v4"), verts("v2"), verts("D"), verts("v6")) ]) , "{D, E, v3, v5, v7}" )
	
	gm.setSources(verts("v4"))
	gm.setTargets(verts("v2"))
	assert.equal(sep_2_str( GraphAnalyzer.listMinimalSeparators(gm, verts("D"), []) ) , "{D, E, v3, v5, v6}\n{D, E, v3, v5, v7}" )
} );


