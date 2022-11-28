
const {GraphParser, GraphAnalyzer, Graph} = require("../../jslib/dagitty-node.js")
const sep_2_str = (ss) => {
   var r = [];
   if( ss.length == 0 )
      return "";
   ss.forEach( (s) => r.push( s.map( x => x.id ).sort().join(", ") ) )
   r.sort();
   return "{"+r.join("}\n{")+"}";
}


QUnit.module('dagitty')


QUnit.test('adjustment in DAG with selection nodes', assert => {
	let g = new Graph( "S1 -> {X[exposure]} -> {Y[outcome]} <- S2" )

	assert.true( GraphAnalyzer.isAdjustmentSet( g, [] ) )
	assert.true( GraphAnalyzer.isAdjustmentSet( g, [], [] ) )
	assert.true( GraphAnalyzer.isAdjustmentSet( g, [], ["S1"] ) )

	assert.false( GraphAnalyzer.isAdjustmentSet( g, [], ["S2"] ) )
	assert.true( GraphAnalyzer.isAdjustmentSet( g, ["S2"], ["S1"] ) )
	assert.false( GraphAnalyzer.isAdjustmentSet( g, ["S1"], ["S2"] ) )

	g = new Graph( "{S1 [selected]} -> {X[exposure]} -> {Y[outcome]} <- {S2 [adjusted]}" )

	assert.true( GraphAnalyzer.isAdjustmentSet( g ) )

	g = new Graph( "{S1 [s]} -> {X[e]} -> {Y[o]} <- {S2 [a]}" )

	assert.true( GraphAnalyzer.isAdjustmentSet( g ) )

	g = new Graph( "{S1 [a]} -> {X[e]} -> {Y[o]} <- {S2 [s]}" )

	assert.false( GraphAnalyzer.isAdjustmentSet( g ) )

	g = new Graph( "{S1 [s]} -> {X[e]} <- {Z[a]} -> {Y[o]} <- {S2 [a]}" )

	assert.false( GraphAnalyzer.isAdjustmentSet( g, [] ) )
	assert.true( GraphAnalyzer.isAdjustmentSet( g ) )

	g = new Graph( "{S1 [s]} <- {X[e]} <- {Z[a]} -> {Y[o]} <- {S2 [a]}" )

	assert.false( GraphAnalyzer.isAdjustmentSet( g, [] ) )
	assert.false( GraphAnalyzer.isAdjustmentSet( g ) )

	g = new Graph( "{S1 [s]} -> {X[e]} <- Z -> {Y[o]} <- S2" )
	assert.equal( sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) ), "{Z}" )

	g = new Graph( "{S1 [s]} <- {X[e]} <- Z -> {Y[o]} <- S2" )
	assert.equal( sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) ), "" )
});


