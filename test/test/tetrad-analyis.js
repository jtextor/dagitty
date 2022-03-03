
const {
	GraphParser,GraphAnalyzer,GraphTransformer
} = require("../../jslib/dagitty-node.js")
const TestGraphs = require("../test-graphs.js")
const _ = require("underscore")

const $p = (s) => GraphParser.parseGuess(s)

QUnit.module( "dagitty" )

QUnit.test( "tetrad analysis", function( assert ) {
	assert.equal( function(){
		var g = $p("dag { {a b} ->  x -> y }")
		return GraphAnalyzer.vanishingTetrads( g ).length
	}() , 1, "choke point in I/J side" )

	assert.equal((function(){
		var g = $p("dag { xi1 [u] xi2 [u] xi3 [u] xi1 <-> xi2 <-> xi3 <-> xi1 "+
			" xi1 -> {X1 X2 X3} xi2 -> {X4 X5 X6} xi3 -> {X7 X8 X9} }")
		return GraphAnalyzer.vanishingTetrads( g ).length
	})(), 162 )

	assert.equal((function(){
		var g = $p("xi1 U\neta1 U\neta2 U\nY1 1\n Y2 1\nY3 1\n Y4 1\nX1 1\n X2 1\n\nxi1 eta1 eta2 X1 X2\neta1 eta2 Y1 Y2\neta2 Y3 Y4")
		return ""+GraphAnalyzer.vanishingTetrads( g ).join("\n")
	})(), "Y1,Y3,Y4,Y2\nY1,Y3,X1,Y2\nY1,Y3,X2,Y2\nY1,Y4,X1,Y2\nY1,Y4,X2,Y2\nY1,X1,X2,Y2\nY1,Y3,Y4,X1\nY1,Y3,Y4,X2\nY1,X1,X2,Y3\nY1,X1,X2,Y4\nY2,Y3,Y4,X1\nY2,Y3,Y4,X2\nY2,X1,X2,Y3\nY2,X1,X2,Y4\nY3,X1,X2,Y4" )

	assert.equal((function(){
		var g = $p("xi1 U\nxi2 U\nxi3 U\nU1 U\nU2 U\nU3 U\nX1 1\nX2 1\nX3 1\nX4 1\nX5 1\nX6 1\nX7 1\nX8 1\nX9 1\n\nxi1 X1 X2 X3\nxi2 X4 X5 X6\nxi3 X7 X8 X9\nU1 xi1 xi2\nU2 xi2 xi3\nU3 xi1 xi3")
		return GraphAnalyzer.vanishingTetrads( g ).length
	})(), 162 )

	assert.equal((function(){
		var g = $p("xi1 U\neta1 U\neta2 U\nY1 1\n Y2 1\nY3 1\n Y4 1\nX1 1\n X2 1\n\nxi1 eta1 eta2 X1 X2\neta1 eta2 Y1 Y2\neta2 Y3 Y4")
		return GraphAnalyzer.vanishingTetrads( g ).length
	})(), 15 )

	assert.equal((function(){
		var g = $p("U U\nX1 1\nX10 1 \nX2 1 \nX3 1 \nX4 1 \nX5 1 \nX6 1 \nX7 1 \nX8 1 \nX9 1 \nxi_1 U \nxi_2 U \n\n"+
	"U xi_1 xi_2\nxi_1 X1 X2 X3 X4 X5\nxi_2 X6 X7 X8 X9 X10\nUa X1 X2\nUb X1 X6")
		return ""+GraphAnalyzer.vanishingTetrads( g ).length
	})(), 430 )

	assert.equal((function(){
		var g = $p("u U\nx U\ny U\nx1 1\nx2 1\nx3 1\nx4 1\ny1 1\ny2 1\ny3 1\ny4 1\n\n"
			+"u x y\nx x1 x2 x3 x4\ny y1 y2 y3 y4")
		return GraphAnalyzer.vanishingTetrads( g ).length
	})(), 138 )

	assert.equal((function(){
		return GraphAnalyzer.vanishingTetrads( TestGraphs.findExample( "Thoemmes" ) ).length
	})(), 98 )

	assert.equal((function(){
		return GraphTransformer.trekGraph( $p("dag {E<-A->Z<-B->D<-E}") ).toAdjacencyList()
	})(), "dw_A dw_E dw_Z\ndw_B dw_D dw_Z\ndw_E dw_D\nup_A dw_A\nup_B dw_B\nup_D dw_D up_B up_E\nup_E dw_E up_A\nup_Z dw_Z up_A up_B" )

});
