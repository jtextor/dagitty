const {GraphAnalyzer} = require("../../jslib/dagitty-node.js")
const TestGraphs = require("../test-graphs.js")
const _ = require("underscore")

const imp_2_str = ( imp ) => {
  var r = [],j,rr;
  _.each( imp, function( i ){
      for( j = 0 ; j < i[2].length ; j ++ ){
         rr = i[0]+" _||_ "+i[1];
         if( i[2][j].length > 0 ){
            rr += " | "+_.pluck( i[2][j], 'id').sort().join(", ");
         }
         r.push(rr)
      }
  } );
  return r.join("\n");
}

QUnit.module("dagitty")

QUnit.test( "testable implications", function( assert ) {
	assert.equal((function(){
		var g = TestGraphs.findExample("Shrier")
		var ii = GraphAnalyzer.listMinimalImplications( g )
		var all_good=true
		for( var i = 0 ; i < ii.length ; i ++ ){
			for( var j = 0 ; j < ii[i][2].length ; j ++ ){
				if( ii[i][2][j].length > 0 ){
					all_good = all_good && GraphAnalyzer.dConnected( g, 
						[g.getVertex(ii[i][0])], [g.getVertex(ii[i][1])], 
						ii[i][2][j].slice(1) )
				}
			}
		}
		return all_good
	})(), true )

	assert.equal((function(){
		var g = TestGraphs.findExample("Shrier")
		var ii = GraphAnalyzer.listMinimalImplications( g )
		var all_good=true
		for( var i = 0 ; i < ii.length ; i ++ ){		
			for( var j = 0 ; j < ii[i][2].length ; j ++ ){
				all_good = all_good && !GraphAnalyzer.dConnected( g, 
					[g.getVertex(ii[i][0])], [g.getVertex(ii[i][1])], ii[i][2][j] )
			}
		}
		return all_good
	})(), true )

	assert.equal((function(){
		var g = TestGraphs.findExample( "mediat" );
		return imp_2_str( GraphAnalyzer.listBasisImplications( g ) );
	})(), "Y _||_ Z | I, X" )	

	assert.equal((function(){
		var g = TestGraphs.findExample( "mediat" );
		return imp_2_str( GraphAnalyzer.listMinimalImplications( g ) );
	})(), "Y _||_ Z | I, X" )

	assert.equal((function(){
		var g = TestGraphs.findExample( "mediat" );
		g.getVertex("Z").adjusted_for = true;
		return imp_2_str( GraphAnalyzer.listMinimalImplications( g ) );
	})(), "Y _||_ Z | I, X" )

	assert.equal((function(){
		return imp_2_str( 
			GraphAnalyzer.listMinimalImplications( TestGraphs.commentator1() ) );
	})(), "X _||_ V | W1, Z1\nX _||_ Z2 | V, W2\nX _||_ Z2 | W1, W2, Z1\nY _||_ V | W1, W2, Z1, Z2\nV _||_ W1\nV _||_ W2\nW1 _||_ Z2 | W2\nW2 _||_ Z1 | W1\nZ1 _||_ Z2 | V, W2\nZ1 _||_ Z2 | V, W1" )
});

