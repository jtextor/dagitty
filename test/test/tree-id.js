
const { Graph, GraphParser, GraphAnalyzer } = require("../../jslib/dagitty-node.js")

const $p = (s) => GraphParser.parseGuess(s)

QUnit.module( "dagitty" )

QUnit.test( "treeID", function( assert ) {
	//instrument
	var r = GraphAnalyzer.treeID($p( "dag { Z -> X \n X -> Y \n X <-> Y }" )).results
	assert.equal(r["X"][0].instrument, "Z")
	assert.equal(r["X"][0].fastp.length, 1)
	assert.equal(r["Y"][0].instrument, "Z")
	assert.equal(r["Y"][0].fastp.length, 1)
	
	//instrument + propagate
	var r = GraphAnalyzer.treeID($p( "dag { A -> E \n A <-> D \n E -> D \n E -> v1 }" )).results
	assert.equal(r["E"][0].instrument, "A")
	assert.equal(r["E"][0].fastp.length, 1)
	assert.equal(r["v1"][0].instrument, "A")
	assert.equal(r["v1"][0].fastp.length, 1)
	assert.equal(r["D"][0].propagate, "E")
	assert.equal(r["D"][0].fastp.length, 1)

	//missing cycles (example from weihs/drton tsID)
	var r = GraphAnalyzer.treeID($p( "dag { 0 -> 1 \n 0 -> 2 \n 0 -> 3 \n 0 <-> 1 \n 0 <-> 2 \n 0 <-> 3 \n 0 <-> 4 \n 3 -> 4 }" )).results
	assert.equal(r["1"][0].propagate, "2")
	assert.equal(r["1"][0].fastp.length, 1)
	assert.equal(r["2"][0].propagate, "4")
	assert.equal(r["2"][0].fastp.length, 1)
	assert.equal(r["4"][0].propagate, "3")
	assert.equal(r["4"][0].fastp.length, 1)
	assert.equal("missingCycles" in r["3"][0], true)
	assert.equal(r["3"][0].fastp.length, 1)

	//missing cycles (example (4680, 403) from weihs/drton tsID)
	var r = GraphAnalyzer.treeID($p( "dag { 3->4  \n 1->2  \n 0->1  \n 2->3  \n 3<->1 \n 3<->0 \n 1<->0 \n 0<->2 \n 0<->4 }" )).results
	assert.equal(r["3"][0].propagate, "4")
	assert.equal(r["3"][0].fastp.length, 1)
	assert.equal(r["4"][0].propagate, "1")
	assert.equal(r["4"][0].fastp.length, 1)
	assert.equal(r["1"][0].propagate, "2")
	assert.equal(r["1"][0].fastp.length, 1)
	assert.equal("missingCycles" in r["2"][0], true)
	assert.equal(r["2"][0].fastp.length, 1)

	//not identifiable
	var r = GraphAnalyzer.treeID($p( "dag { A -> E   \n A <-> D  \n A <-> E  \n A <-> v1 \n D <-> v1 \n E -> D   \n E -> v1 }" )).results
	assert.equal( ("A" in r) || ("E" in r) || ("D" in r) || ("v1" in r), false )
	
	//2-id, missing cycle [[1, 2], [2, 3], [3, 4], [1, 4]]
	var r = GraphAnalyzer.treeID($p( "dag { 0 -> 1  \n 0 <-> 1 \n 0 <-> 2 \n 0 <-> 3 \n 0 <-> 4 \n 1 -> 2  \n 1 <-> 3 \n 2 -> 3  \n 2 <-> 4 \n 3 -> 4  }" )).results
	assert.equal(r["4"][0].propagate, "3")
	assert.equal(r["4"][0].fastp.length, 2)
	assert.equal(r["3"][0].propagate, "2")
	assert.equal(r["3"][0].fastp.length, 2)
	assert.equal(r["2"][0].propagate, "1")
	assert.equal(r["2"][0].fastp.length, 2)
	assert.equal("missingCycles" in r["1"][0], true)
	assert.equal(r["1"][0].fastp.length, 2)

	
})

