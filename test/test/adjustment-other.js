
const {GraphParser,GraphAnalyzer} = require("../../jslib/dagitty-node.js")
const _ = require("../../jslib/underscore-mock-es6.js") 


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

QUnit.test( "adjustment in other graphs", function( assert ) {
	assert.equal( sep_2_str(GraphAnalyzer.listMsasTotalEffect(
		$p("pdag { X [exposure]\n"+
		"Y [outcome]\n"+
		"X -> W -> Y ; F -> W -- Z ; X <- F -> Z }") 
			 ) ), 
		"{F}" )

	assert.equal( sep_2_str(GraphAnalyzer.listMsasTotalEffect(
		$p("mag { X [e] Y[o] X->Y }") 
			 ) ), "" )

	assert.equal( sep_2_str(GraphAnalyzer.listMsasTotalEffect(
		$p("mag { X [e] Y[o] I->X->Y }") 
			 ) ), "{}" )

	assert.equal( GraphAnalyzer.listMsasTotalEffect($p($p("pag{i<-@x->y x[e] y[o]}").toString()) ).length,
		0 )

});
