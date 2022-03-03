
const dagitty = require("../../jslib/dagitty-node.js")

QUnit.module('dagitty')

QUnit.test('adjustment in DAG with selection nodes', assert => {
	let g = dagitty.GraphParser.parseGuess( "S1 -> {X[exposure]} -> {Y[outcome]} <- S2" )

	assert.equal( dagitty.GraphAnalyzer.isAdjustmentSet( g, [] ), true )
	assert.equal( dagitty.GraphAnalyzer.isAdjustmentSet( g, [], [] ), true )
	assert.equal( dagitty.GraphAnalyzer.isAdjustmentSet( g, [], ["S1"] ), true )


	assert.equal( dagitty.GraphAnalyzer.isAdjustmentSet( g, [], ["S2"] ), false )
	assert.equal( dagitty.GraphAnalyzer.isAdjustmentSet( g, ["S2"], ["S1"] ), true )
	assert.equal( dagitty.GraphAnalyzer.isAdjustmentSet( g, ["S1"], ["S2"] ), false )

});
