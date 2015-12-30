GraphParser.VALIDATE_GRAPH_STRUCTURE = true;

QUnit.test( "parsing and serializing", function( assert ) {
	assert.equal( TestGraphs.small1().oldToString(), "A 1\nS E\nT O\n\nA S\nS T" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( 
		"digraph G { x <-> y }"
		).addSource("x").addTarget("y")
		GraphTransformer.activeBiasGraph( g )
		return g.edges[0].directed
	})(), Graph.Edgetype.Bidirected )

	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"digraph G { xi1 [latent]\n"+
			"xi1 -> x1\n"+
			"xi1 -> x3\n"+
			"xi1 -> x4\n"+
			"xi1 -> x5\n"+
			"x5 -> x6\n"+
			"x1 -> x6\n"+
			"x6 -> x3 }\n"
		)
		return g.oldToString()
	})(), "x1 1\nx3 1\nx4 1\nx5 1\nx6 1\nxi1 U\n\nx1 x6\nx5 x6\nx6 x3\nxi1 x1 x3 x4 x5" )

	assert.equal((function(){
		var g = GraphParser.parseDot( 
			"digraph { xi1 [latent]\n"+
			"xi2 [latent]\n"+
			"xi1 <-> xi2\n"+
			"xi1 -> x1\n"+
			"xi1 -> x2\n"+
			"xi1 -> x3\n"+
			"xi2 -> x4\n"+
			"xi2 -> x5\n"+
			"xi2 -> x6 } "
		)
		return g.oldToString()
	})(), "x1 1\nx2 1\nx3 1\nx4 1\nx5 1\nx6 1\nxi1 U\nxi2 U\n\nxi1 x1 x2 x3 xi2\nxi2 x4 x5 x6 xi1" )

	assert.equal((function(){
		var g = GraphParser.parseDot( "digraph { x -> y\ny -> z\nx <-> y } " )
		//console.log( g.toString() )
		return GraphSerializer.toDotEdgeStatements(g)
	})(), "x -> y\nx <-> y\ny -> z" )


	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"digraph G {\ny -- x -> y <-> x }" )
		return GraphSerializer.toDotEdgeStatements(g) 
	})(), "x -- y\nx -> y\nx <-> y" )


	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"graph G {\nx [ exposure , pos =\" 12. , .13 \"]\ny [outcome]\n}" )
		return GraphSerializer.toDot(g) 
	})(), "graph G{\nx [exposure,pos=\"12.000,0.130\"]\ny [outcome]\n\n}\n" )


	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"graph G { x [exposure] \n y [outcome] }" )
		g.getVertex("x").layout_pos_x = 1.0
		g.getVertex("x").layout_pos_y = 1.0
		return GraphSerializer.toDot(g)
	})(), "graph G{\nx [exposure,pos=\"1.000,1.000\"]\ny [outcome]\n\n}\n" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"graph G { x \n y }" )
		return GraphSerializer.toDot(g)
	})(), "graph G{\nx\ny\n\n}\n" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"graph G { x [] \n y [] }" )
		return GraphSerializer.toDot(g)
	})(), "graph G{\nx\ny\n\n}\n" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"digraph G { x [] \n y [] }" )
		g.addEdge("x","y",Graph.Edgetype.Directed)
		g.addEdge("x","y",Graph.Edgetype.Undirected)
		g.addEdge("x","y",Graph.Edgetype.Bidirected)
		return GraphSerializer.toDotEdgeStatements(g)
	})(), "x -- y\nx -> y\nx <-> y" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( "digraph G { x <-> m } " )
		return typeof g.getEdge("m","x",2)
	})(), "object" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( "digraph G { x <-> m } " )
		return typeof g.getEdge("x","m",2)
	})(), "object" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( "digraph G { x -> m } " )
		return GraphSerializer.toDotEdgeStatements(g)
	})(), "x -> m" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( "dag G { M [pos=\"-0.521,-0.265\"] \n "+
			"X [exposure,pos=\"-1.749,-0.238\"] \n "+
			"Y [outcome,pos=\"1.029,-0.228\"] \n "+
			"M <-> Y [pos=\"0.645,-0.279\"] \n "+
			"X -> Y \n "+
			"X -> M -> Y } " )
		return GraphSerializer.toDot(g)
	})(), "dag G{\nM [pos=\"-0.521,-0.265\"]\n"+
		"X [exposure,pos=\"-1.749,-0.238\"]\n"+
		"Y [outcome,pos=\"1.029,-0.228\"]\n"+
		"M -> Y\n"+
		"M <-> Y [pos=\"0.645,-0.279\"]\n"+
		"X -> M\n"+
		"X -> Y\n}\n" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( "dag G { M [pos=\"-0.521,-0.265\"] "+
			"X [exposure,pos=\"-1.749,-0.238\"] "+
			"Y [outcome,pos=\"1.029,-0.228\"] "+
			"M <-> Y [pos=\"0.645,-0.279\"] "+
			"X -> Y "+
			"X -> M -> Y } " )
		return GraphSerializer.toDot(g)
	})(), "dag G{\nM [pos=\"-0.521,-0.265\"]\n"+
		"X [exposure,pos=\"-1.749,-0.238\"]\n"+
		"Y [outcome,pos=\"1.029,-0.228\"]\n"+
		"M -> Y\n"+
		"M <-> Y [pos=\"0.645,-0.279\"]\n"+
		"X -> M\n"+
		"X -> Y\n}\n" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"digraph G { x -- y \n x -> y \n x <-> y [pos=\"1.000,1.000\"] }" )
		return GraphSerializer.toDotEdgeStatements(g) 
	})(), "x -- y\nx -> y\nx <-> y [pos=\"1.000,1.000\"]" )

	assert.equal((function(){
		var g = GraphParser.parseGuess( 
			"digraph G {\n  y --   x -> y   <-> x [pos=\"1.0,0.1\"] }" )
		return GraphSerializer.toDotEdgeStatements(g) 
	})(), "x -- y [pos=\"1.000,0.100\"]\nx -> y [pos=\"1.000,0.100\"]\nx <-> y [pos=\"1.000,0.100\"]" )

	assert.equal(GraphSerializer.toLavaan(GraphParser.parseGuess("dag{x1}")).split("\n")[1]
		,"x1 ~~ x1")
});

QUnit.test( "separators", function( assert ) {
	assert.equal(
			sep_2_str( GraphAnalyzer.listMinimalSeparators(
				GraphTransformer.backDoorGraph(TestGraphs.small1())) )
		, "{}" )

	assert.equal(
		(function(){
			var g = GraphTransformer.moralGraph( 
				GraphTransformer.ancestorGraph(
				GraphTransformer.backDoorGraph(TestGraphs.confounding_triangle())))
		   GraphAnalyzer.listMinimalSeparators(g); // should clean up after itself
		   return sep_2_str( GraphAnalyzer.listMinimalSeparators(g) )
		})(), "{C}" )
		
	assert.equal(
		(function(){
		   var g = GraphTransformer.moralGraph(
			GraphTransformer.ancestorGraph(
			GraphTransformer.backDoorGraph(TestGraphs.m_bias_graph())
			) )
		   GraphAnalyzer.listMinimalSeparators(g);
		   return sep_2_str( GraphAnalyzer.listMinimalSeparators(g) );
		})(), "{}" ) 
		 
	assert.equal(
		(function(){
		   var gbd = GraphTransformer.backDoorGraph(TestGraphs.extended_confounding_triangle());
		   var gan = GraphTransformer.ancestorGraph(gbd);
		   var gm = GraphTransformer.moralGraph(gan);
		   return sep_2_str( GraphAnalyzer.listMinimalSeparators(gm) );
		})(), "{C, D}\n{C, E}") 

	assert.equal(
		(function(){
		   var g = GraphTransformer.moralGraph(
			GraphTransformer.ancestorGraph(
				GraphTransformer.backDoorGraph(TestGraphs.extended_confounding_triangle())) )
		   return sep_2_str(GraphAnalyzer.listMinimalSeparators( g, [g.getVertex("D")], [] ) )
		})(), "{C, D}" ) 

	assert.equal(
		(function(){
		   var g = GraphTransformer.moralGraph(
				GraphTransformer.ancestorGraph(
					GraphTransformer.backDoorGraph(TestGraphs.extended_confounding_triangle())) )
		   return sep_2_str( GraphAnalyzer.listMinimalSeparators(g, [], [g.getVertex("D")] ) )
		})(), "{C, E}") 
} )

QUnit.test( "graph analysis", function( assert ) {
	assert.equal( 
		GraphAnalyzer.containsCycle( TestGraphs.cyclic_graph() ), "A&rarr;B&rarr;C&rarr;A" ) 
	assert.equal(
		GraphParser.parseGuess("x E\ny O\nz\na\n\nx y a z\na y\nz y").countPaths(),3)
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
	  assert.equal(GraphAnalyzer.isChordal(GraphParser.parseGuess(g)), true);
	});
	assert.equal(GraphAnalyzer.isChordal(TestGraphs.K5), true);
	
	var notChordalGraphs = [
		"graph {a -- b \n a -- x \n b -- y \n x -- y}",
		"graph {A -- E \n A -- Z \n B -- Z \n B -- D \n D -- E}",
		"graph {A -- E \n B -- D \n B -- Z \n B -- A \n D -- Z \n E -- Z }"
	];
	_.each(notChordalGraphs, function(g) {
	  assert.equal(GraphAnalyzer.isChordal(GraphParser.parseGuess(g)), false);
	});
});

QUnit.test( "biasing paths in DAGs (allowing <->)", function( assert ) {
	assert.equal((function(){
	  var g = TestGraphs.confounding_triangle_with_irrelevant_nodes();
	  var vv = [];
	  _.each(GraphTransformer.activeBiasGraph(g).vertices.values(),function( v ){
		vv.push( v.id );
	  })
	  vv.sort();
	  return vv.join(",");
	})(),"A,B,M" )
assert.equal((function(){
	var g = GraphParser.parseGuess( "digraph G { x <-> y } " )
	return GraphSerializer.toDotEdgeStatements(
		GraphTransformer.activeBiasGraph(g,g.getVertex(["x"]),g.getVertex(["y"])))
})(), "x <-> y" )

assert.equal((function(){
	var g = GraphParser.parseGuess( "digraph G { x <- m <-> y } " )
	g.addSource("x")
	g.addTarget("y")
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "m -> x\nm <-> y" )

assert.equal((function(){
	var g = GraphParser.parseGuess( "digraph G { x -> m <-> y } " )
	g.addSource("x")
	g.addTarget("y")
	g.addAdjustedNode("m")
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "m <-> y\nx -> m" )

assert.equal((function(){
	var g = GraphParser.parseGuess( "digraph G { m <-> y \n x -> m -> y } " )
	g.addSource("x")
	g.addTarget("y")
	g.addAdjustedNode("m")
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "m <-> y\nx -> m" )

assert.equal((function(){
	var g = GraphParser.parseGuess( "digraph G { m <-> y \n x -> m -> y } " )
	g.addSource("x")
	g.addTarget("y")
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "" )

assert.equal((function(){
	var g = GraphParser.parseGuess( "digraph G { M \n "+
		"X [exposure] \n "+
		"Y [outcome] \n "+
		"M <-> Y [pos=\"0.645,-0.279\"] \n "+
		"X -> Y \n "+
		"X -> M -> Y } " )
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "" )

});

QUnit.test( "graph transformations", function( assert ) {
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
	
	var transformations = [
		GraphTransformer.cgToRcg,
		"pdag { k -- n; l -- m; n -- t; t -- y; x -> y; }",
		 "pdag { k;l;m;n;t;x;y; l -- m; n -> k; t -> n; x -> y; y -> t }",
		"pdag { k -- n; l -- m; l -> n; l -> t; l -> y; n -- t; t -- y; x -> y; }",
		 "pdag { k;l;m;n;t;x;y; l -- m; l -> n; l -> t; l -> y; n -> k; t -> n; x -> y; y -> t }",
		"pdag { a;b;c;d; a -> b; b -- c; d -> c }",
		 null,
		"digraph { a -> b; b -- c; c <- d; b -- d }",
		"digraph { a;b;c;d; a -> b; b -> c; b -> d; d -> c }",
		 
		function (g){ return GraphTransformer.contractComponents(g, GraphAnalyzer.connectedComponents(g), [Graph.Edgetype.Directed])},
		"pdag { k -- n; l -- m; n -- t; t -- y; x -> y; }",
		 "pdag { k,n,t,y;l,m;x; x -> k%2Cn%2Ct%2Cy }",
		"digraph { a -- b; b -> c; c -- a }",
		 "digraph { a,b,c; a%2Cb%2Cc -> a%2Cb%2Cc }",
	];
	var i = 0; var transfunc;
	while (i < transformations.length) {
		if (typeof transformations[i] === "function") {
			transfunc = transformations[i];
			i ++;			
		}
		var gin = transformations[i]; i++;
		if (typeof gin === "string") gin = GraphParser.parseGuess(gin);
		var gout = transfunc(gin);
		if (gout != null) 
			gout = gout.getType()+" { " + 
			        gout.vertices.keys().sort().join(";") + "; " + 
			        gout.getEdges().map(function(e){return e.toString()}).sort().join("; ") + " }";			        
		var gref = transformations[i]; i++;	
		assert.equal(gout, gref);
	}
});

QUnit.test( "adjustment in DAGs", function( assert ) {
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
		GraphParser.parseGuess("dag { X1 [exposure]\n "+
		"X2 [exposure]\n Y1 [outcome] \n Y2 [outcome]\n "+
		"C -> Y1 \n"+
		"C -> m \n X1 -> X2 \n X1 -> Y2 -> Y1 \n X2 -> Y1 \n X1 -> m2 -> m -> X2 }"))),
		"{C}\n{m, m2}")
});

QUnit.test( "adjustment in chain graphs", function( assert ) {
	assert.equal( sep_2_str(GraphAnalyzer.listMsasTotalEffect(
		GraphParser.parseGuess("pdag { X [exposure]\n"+
		"Y [outcome]\n"+
		"X -> W -> Y ; F -> W -- Z ; X <- F -> Z }") 
			 ) ), 
		"{F}" )
});

QUnit.test( "testable implications", function( assert ) {
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

QUnit.test( "tetrad analysis", function( assert ) {
	assert.equal((function(){
		var g = GraphParser.parseGuess("dag { xi1 [latent] \n xi2[latent] \n xi3 [latent] \n xi1 <-> xi2 <-> xi3 <-> xi1 \n X1 <- xi1 -> X2 \n xi1 -> X3 \n X4 <- xi2 -> X5 \n xi2 -> X6 \n X7 <- xi3 -> X8 \n xi3 -> X9 }")
		return GraphAnalyzer.vanishingTetrads( g ).length
	})(), 162 )

	assert.equal((function(){
		var g = GraphParser.parseGuess("xi1 U\neta1 U\neta2 U\nY1 1\n Y2 1\nY3 1\n Y4 1\nX1 1\n X2 1\n\nxi1 eta1 eta2 X1 X2\neta1 eta2 Y1 Y2\neta2 Y3 Y4")
		return ""+GraphAnalyzer.vanishingTetrads( g ).join("\n")
	})(), "Y1,Y3,Y4,Y2\nY1,Y3,X1,Y2\nY1,Y3,X2,Y2\nY1,Y4,X1,Y2\nY1,Y4,X2,Y2\nY1,X1,X2,Y2\nY1,Y3,Y4,X1\nY1,Y3,Y4,X2\nY1,X1,X2,Y3\nY1,X1,X2,Y4\nY2,Y3,Y4,X1\nY2,Y3,Y4,X2\nY2,X1,X2,Y3\nY2,X1,X2,Y4\nY3,X1,X2,Y4" )

	assert.equal((function(){
		var g = GraphParser.parseGuess("xi1 U\nxi2 U\nxi3 U\nU1 U\nU2 U\nU3 U\nX1 1\nX2 1\nX3 1\nX4 1\nX5 1\nX6 1\nX7 1\nX8 1\nX9 1\n\nxi1 X1 X2 X3\nxi2 X4 X5 X6\nxi3 X7 X8 X9\nU1 xi1 xi2\nU2 xi2 xi3\nU3 xi1 xi3")
		return GraphAnalyzer.vanishingTetrads( g ).length
	})(), 162 )

	assert.equal((function(){
		var g = GraphParser.parseGuess("xi1 U\neta1 U\neta2 U\nY1 1\n Y2 1\nY3 1\n Y4 1\nX1 1\n X2 1\n\nxi1 eta1 eta2 X1 X2\neta1 eta2 Y1 Y2\neta2 Y3 Y4")
		return GraphAnalyzer.vanishingTetrads( g ).length
	})(), 15 )

	assert.equal((function(){
		var g = GraphParser.parseGuess("U U\nX1 1\nX10 1 \nX2 1 \nX3 1 \nX4 1 \nX5 1 \nX6 1 \nX7 1 \nX8 1 \nX9 1 \nxi_1 U \nxi_2 U \n\n"+
	"U xi_1 xi_2\nxi_1 X1 X2 X3 X4 X5\nxi_2 X6 X7 X8 X9 X10\nUa X1 X2\nUb X1 X6")
		return ""+GraphAnalyzer.vanishingTetrads( g ).length
	})(), 430 )

	assert.equal((function(){
		var g = GraphParser.parseGuess("u U\nx U\ny U\nx1 1\nx2 1\nx3 1\nx4 1\ny1 1\ny2 1\ny3 1\ny4 1\n\n"
			+"u x y\nx x1 x2 x3 x4\ny y1 y2 y3 y4")
		return GraphAnalyzer.vanishingTetrads( g ).length
	})(), 138 )

	assert.equal((function(){
		return GraphAnalyzer.vanishingTetrads( TestGraphs.findExample( "Thoemmes" ) ).length
	})(), 33 )

	assert.equal((function(){
		return GraphTransformer.trekGraph( TestGraphs.findExample( "m-bias" ) ).toAdjacencyList()
	})(), "dw_A dw_E dw_Z\ndw_B dw_D dw_Z\ndw_E dw_D\nup_A dw_A\nup_B dw_B\nup_D dw_D up_B up_E\nup_E dw_E up_A\nup_Z dw_Z up_A up_B" )

});

QUnit.test( "instrumental variables", function( assert ) {
	assert.equal((function(){
		var g = GraphParser.parseGuess( "digraph G { u1 [latent] \n u2 [latent] \n"+
			"u2 -> d -> a -> z \n a -> c -> b -> z \n "+
			"u2 -> y \n b -> u1 -> y \n "+
			"\n }" )
		return _.pluck(GraphAnalyzer.closeSeparator(
			g, g.getVertex("y"), g.getVertex("z")
		),"id").join(",")
	})(), "b,d"  )

	assert.equal((function(){	
		var g = GraphParser.parseGuess( "digraph G { u [latent] \n x [exposure] \n y [outcome] \n"+
			" w -> z -> x -> y \n w -> u -> x \n u -> y \n }" )
		return iv_2_str( GraphAnalyzer.conditionalInstruments( g ) )
	})(), "z | w" )

	assert.equal((function(){	
		var g = GraphParser.parseGuess( "digraph G { u [latent] \n x [exposure] \n y [outcome] \n"+
			" z -> x -> y \n u -> x \n u -> y \n }" )
		return iv_2_str( GraphAnalyzer.conditionalInstruments( g ) )
	})(), "z" )

	assert.equal((function(){	
		var g = GraphParser.parseGuess( "digraph G { u \n w -> z -> x -> y \n w -> u -> x \n u -> y }" )
		return _(GraphAnalyzer.ancestralInstrument( g, g.getVertex("x"), g.getVertex("y"), 
			g.getVertex("z") )).pluck("id").join(",")
	})(), "u" )

	assert.equal((function(){	
		var g = GraphParser.parseGuess( "digraph G { u \n z -> x -> y \n u -> x \n u -> y \n }" )
		return ""+_(GraphAnalyzer.ancestralInstrument( g, g.getVertex("x"), g.getVertex("y"), 
			g.getVertex("z") )).pluck("id").join(",")
	})(), "" )

	assert.equal((function(){	
		var g = GraphParser.parseGuess( "digraph G { u [latent] \n w -> z -> x -> y \n w -> u -> x \n u -> y }" )
		return _(GraphAnalyzer.ancestralInstrument( g, g.getVertex("x"), g.getVertex("y"), 
			g.getVertex("z") )).pluck("id").join(",")
	})(), "w" )

	assert.equal((function(){	
		var g = GraphParser.parseGuess( "digraph G { u [latent] \n z -> x -> y \n u -> x \n u -> y \n }" )
		return ""+_(GraphAnalyzer.ancestralInstrument( g, g.getVertex("x"), g.getVertex("y"), 
			g.getVertex("z") )).pluck("id").join(",")
	})(), ""  )
});

QUnit.test( "graph validation", function( assert ) {
	GraphParser.VALIDATE_GRAPH_STRUCTURE = false;
	assert.equal( GraphAnalyzer.validate( GraphParser.parseGuess(
		"dag { x -> y -> z }"
	)), true )
	assert.equal( GraphAnalyzer.validate( GraphParser.parseGuess(
		"dag { x -> y -> z -> x }"
	)), false )

	assert.equal( GraphAnalyzer.validate( GraphParser.parseGuess(
		"pdag { x -> y -> z }"
	)), true )
	
	assert.equal( GraphAnalyzer.validate( GraphParser.parseGuess(
		"dag { x -- y -> z -> x }"
	)), false )
	assert.equal( GraphAnalyzer.validate( GraphParser.parseGuess(
		"pdag { x -- y -> z }"
	)), true )
	GraphParser.VALIDATE_GRAPH_STRUCTURE = true;
});

QUnit.test( "graph types", function( assert ) {
	var graphs = {
		graph : GraphParser.parseGuess( "graph { x -- y -- z }" ),
		dag : GraphParser.parseGuess( "dag { x -> y -> z }" ),
		pdag : GraphParser.parseGuess( "pdag { x -- y -> z }" ),
		mag : GraphParser.parseGuess( "mag { x <-> y -> z }" )
	};
	
	_.each( Object.keys(graphs), function(t){
		assert.equal( GraphTransformer.inducedSubgraph(graphs[t],
			graphs[t].getVertex(["x","y"])).getType(), t )
	});

	_.each( Object.keys(graphs), function(t){
		assert.equal( GraphTransformer.edgeInducedSubgraph(graphs[t],
			graphs[t].edges).getType(), t )
	});
	
	_.each( Object.keys(graphs), function(t){
		assert.equal( GraphTransformer.ancestorGraph(graphs[t],
			graphs[t].getVertex(["x","y"])).getType(), t )
	});

	_.each( ["backDoorGraph","indirectGraph","activeBiasGraph"], function(f){
		_.each( Object.keys(graphs), function(t){
			assert.equal( GraphTransformer[f](graphs[t],
				graphs[t].getVertex(["x"]),graphs[t].getVertex(["z"])).getType(), t )
		})
	});
	
	_.each( Object.keys(graphs), function(t){
		assert.equal( GraphTransformer.canonicalDag(graphs[t]).g.getType(), "dag" )
	});

	_.each( ["moralGraph","skeleton"], function(f){
		_.each( Object.keys(graphs), function(t){
			assert.equal( GraphTransformer[f](graphs[t]).getType(), "graph" )
		});
	});

});

QUnit.test( "uncategorized tests", function( assert ) {

assert.equal((function(){
	var g = TestGraphs.small3();
	g.addSource("S");
	g.addTarget("T");
	g.addAdjustedNode("p");
	var abg = GraphTransformer.activeBiasGraph(g);
	var gbd = GraphTransformer.backDoorGraph(abg);
	var gbdan = GraphTransformer.ancestorGraph(gbd);
	var gam = GraphTransformer.moralGraph( gbdan )
	// the undirected edges from the active bias graph graph should
	// not yield an edge x -- y in the moral graph, hence {p} again
	// becomes a valid separator 
	return sep_2_str( GraphAnalyzer.listMsasTotalEffect( abg ) );
})(), "{p, x}\n{p, z}" )

assert.equal((function(){
   var g = TestGraphs.big1();
   g.addAdjustedNode("y");
   var g_bias = GraphTransformer.activeBiasGraph( g )
   g = GraphTransformer.edgeInducedSubgraph( g, g_bias.edges )
   g = GraphTransformer.moralGraph( g )
   g.deleteVertex(g.getVertex("x"))
   return sep_2_str( GraphAnalyzer.listMinimalSeparators( g ) ) 
})(), "{a, h}\n{e, h}\n{f, h}\n{h, n}" )

assert.equal((function(){
   var g = TestGraphs.small2();
   g = GraphTransformer.activeBiasGraph(g);
   return g.toAdjacencyList();
})(), "a b s\nc b t\ng c s" )

assert.equal((function(){
   var g = TestGraphs.findExample("Schipf");
   g.addAdjustedNode("WC");
   g.addAdjustedNode("U");
   g = GraphTransformer.activeBiasGraph(g);
   return GraphSerializer.toDotEdgeStatements(g);
})(), "A -> PA\nA -> S\nA -> TT\nA -> WC\nPA -> T2DM\nPA -> WC\nS -> T2DM\nS -> TT" )

assert.equal((function(){
	var g = TestGraphs.extended_confounding_triangle()
	var gbias = GraphTransformer.activeBiasGraph(g)
	var gmor = GraphTransformer.moralGraph( gbias )
	var gsep = GraphAnalyzer.listMinimalSeparators( 
		gmor, [g.getVertex("D")], [] )
	return sep_2_str( gsep  )
})(), "{C, D}" )

assert.equal((function(){
   var g = TestGraphs.findExample("Acid");
   return sep_2_str( 
	GraphAnalyzer.listMinimalSeparators(
		GraphTransformer.moralGraph( GraphTransformer.activeBiasGraph(g) ), [], g.descendantsOf(g.getSources()) ) );
})(), "{x1}\n{x4}" )

assert.equal((function(){
   var g = TestGraphs.intermediate_adjustment_graph();
   return sep_2_str( 
		GraphAnalyzer.listMinimalSeparators(
		GraphTransformer.moralGraph(GraphTransformer.activeBiasGraph(g)), [], [g.getVertex('I')] ) );
})(), "{Z}" )

assert.equal((function(){
   var g = TestGraphs.intermediate_adjustment_graph();
   g.getVertex('I').latent = true;
   return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "{Z}" )

assert.equal((function(){
   var g = TestGraphs.small_mixed();
   var cc = GraphAnalyzer.connectedComponents(g);
   var r = "";
   _.each(cc, function(c) {
      r += ("["+_.pluck(c,'id').sort().join(",")+"] ");
   } );
   return r;
})(), "[a,b,c] [d,e,f] " )

assert.equal((function(){
	// This test verifies that the below methods have
	// no side effects (which they had in an earlier, buggy
	// version of the code)
	var g = TestGraphs.extended_confounding_triangle();
	GraphTransformer.ancestorGraph(g);
	GraphTransformer.ancestorGraph(g);
	GraphTransformer.activeBiasGraph(g);
	GraphTransformer.activeBiasGraph(g);
	return g.oldToString();
})(), "A E\nB O\nC 1\nD 1\nE 1\n\nA B\nC A B\nD A C\nE B C" )

assert.equal((function(){
  var g = GraphTransformer.moralGraph( GraphParser.parseGuess( "x 1\ny 1\nm 1\na 1\nb 1\n\nm x\nm y\na m x\nb m y" ) )
  return _.pluck(GraphAnalyzer.connectedComponentAvoiding( g, 
  	[g.getVertex("x")], [g.getVertex("m"), g.getVertex("b")] ),'id')
    .sort().join(",");
})(), "a,x" )

assert.equal((function(){
	GraphParser.VALIDATE_GRAPH_STRUCTURE = false;
   var g = GraphParser.parseGuess( "xobs 1 @0.350,0.000\n"+
"y 1 @0.562,0.000\n"+
"t 1 @0.351,-0.017\n"+
"\n"+
"xobs y\n"+
"y t\n"+
"t xobs" );
	GraphParser.VALIDATE_GRAPH_STRUCTURE = true;
   GraphAnalyzer.containsCycle( g );
   return GraphAnalyzer.containsCycle( g );
})(), "xobs&rarr;y&rarr;t&rarr;xobs" )

assert.equal((function(){
   var g = GraphParser.parseGuess( "xobs E @0.350,0.000\n"+
"y O @0.562,0.000\n"+
"t 1 @0.351,-0.017\n"+
"u1 1 @0.476,-0.013\n"+
"u2 1 @0.175,-0.017\n"+
"\n"+
"t xobs\n"+
"u1 t y\n"+
"u2 t xobs\n"+
"xobs y" );
   return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "{t, u2}\n{u1}" )

assert.equal((function(){
   var g = TestGraphs.small5()
   g.addAdjustedNode("A")
   return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "T A\nU A I" )

assert.equal((function(){
   var g = TestGraphs.small5();
   return GraphTransformer.causalFlowGraph(g).toAdjacencyList();
})(), "A I\nT A" )

assert.equal((function(){
   var g = TestGraphs.small5();
   g.addAdjustedNode("A");
   return GraphTransformer.causalFlowGraph(g).toAdjacencyList();
})(), "" )

assert.equal((function(){
   var g = TestGraphs.small4();
   g.addAdjustedNode("A");
   var abg = GraphTransformer.activeBiasGraph(g);
   return abg.oldToString()
})(), "I O\nT E\n\n" )

assert.equal((function(){;
   var g = TestGraphs.small3();
   g.addAdjustedNode("p");
   g.addSource("S");
   g.addTarget("T");
   var abg = GraphTransformer.activeBiasGraph(g);
   g.deleteVertex( "p" )
   return GraphTransformer.edgeInducedSubgraph(g,abg.edges).toAdjacencyList()
})(), "x S\nz T" )

assert.equal((function(){;
   var g = TestGraphs.small3();
   g.addSource("S");
   g.addTarget("T");
   g.addAdjustedNode("p");
   // this should yield the same result as listing the MSAS of g
   // the vertex p should not be listed as contained in the separators
   // because it is not listed as compulsory in the call to "listSeparators()"
   // (see the api of the function there) 
   var g_bias = GraphTransformer.activeBiasGraph( g )
   var g_can = GraphTransformer.canonicalDag( g_bias )
   g = GraphTransformer.moralGraph( g_can.g )
   return sep_2_str( GraphAnalyzer.listMinimalSeparators( g, [], 
	g.getAdjustedNodes() ) ) 
})(), "{x}\n{z}" )

assert.equal((function(){
  var g = TestGraphs.commentator1();
  return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "" )

assert.equal((function(){
  var g = GraphParser.parseGuess("S E @0.395,0.046\n"+
"T O @0.715,0.039\n"+
"h 1 @0.544,0.017\n"+
"i 1 @0.544,0.017\n"+
"x 1 @0.424,0.072\n"+
"z 1 @0.610,0.071\n"+
"\n"+
"S T\n"+
"h S\n"+
"i h T\n"+
"x S z\n"+
"z T\n");
  return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "{h, x}\n{h, z}\n{i, x}\n{i, z}" )

assert.equal((function(){
  var g = TestGraphs.big1();
  g.addAdjustedNode("y");
  return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "{a, h, x, y}\n{a, h, y, z}\n{e, h, x, y}\n{e, h, y, z}\n{f, h, x, y}\n{f, h, y, z}\n{h, n, x, y}\n{h, n, y, z}" )

assert.equal((function(){
  var g = TestGraphs.findExample("Shrier");
  var must = [g.getVertex("FitnessLevel")];
  var must_not = [g.getVertex("Genetics"),
    g.getVertex("ConnectiveTissueDisorder"),
    g.getVertex("IntraGameProprioception")];
  
  return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g, must, must_not ) );
})(), "{Coach, FitnessLevel}\n{FitnessLevel, NeuromuscularFatigue, TissueWeakness}\n{FitnessLevel, TeamMotivation}" )

assert.equal((function(){
  return sep_2_str( GraphAnalyzer.listMsasTotalEffect( TestGraphs.very_large_dag() ) );
})(), "{Allergenexposition, Antibiotika, Begleiterkrankungen, BetreuungKind, Darmflora, Erregerexposition, Geschwister, Hausstaub, Haustiere, Infektionen, RauchenAnderer, RauchenMutter, Stillen}\n{Allergenexposition, Antibiotika, Begleiterkrankungen, Darmflora, Erregerexposition, Geburtsmodus, Hausstaub, Haustiere, Infektionen, RauchenAnderer, RauchenMutter, Stillen}\n{Allergenexposition, Begleiterkrankungen, Darmflora, Erregerexposition, Impfungen, Infektionen, RauchenAnderer, RauchenMutter}" )

assert.equal((function(){
  var g = GraphTransformer.moralGraph( GraphParser.parseGuess( "x E\ny O\nm\na\nb\n\nm x\nm y\na m x\nb m y" ) )
  return sep_2_str( GraphAnalyzer.listMinimalSeparators(g) );
})(), "{a, m}\n{b, m}" )

assert.equal((function(){
  // the function "neighboursOf" should, also when called on a vertex set, 
  // not return any vertices from those sets as neighbours of the set itself
  var g = GraphTransformer.moralGraph( GraphParser.parseGuess( "x\ny\nm\na\nb\n\nm x\nm y\na m x\nb m y" ) )
  return _.pluck(g.neighboursOf( [g.getVertex("m"), g.getVertex("b")] ),'id')
    .sort().join(",");
})(), "a,x,y" )

assert.equal((function(){
   var g = GraphParser.parseGuess("E E @-1.897,0.342\n"+
	"D O @-0.067,0.302\n"+
	"g A @-0.889,1.191\n"+
	"\n"+
	"D g\n"+
	"E D");
	return GraphAnalyzer.violatesAdjustmentCriterion( g )
})(), true )

assert.equal((function(){
   var g = GraphParser.parseGuess("x E @0.083,-0.044\n"+
      "y O @0.571,-0.043\n"+
      "i1 1 @0.331,-0.037\n"+
      "i2 1 @0.328,-0.030\n"+
      "y2 A @0.333,-0.054\n"+
      "y3 1 @0.334,-0.047\n"+
      "\n"+
      "i1 y\n"+
      "i2 y\n"+
      "x y2 i2 i1 y\n"+
      "y3 y x");
   return _.pluck(GraphAnalyzer.intermediates(g),'id').join(",");
})(), "i1,i2" )

assert.equal((function(){
   var g = GraphParser.parseGuess("x 1 @0.264,-0.027\n"+
      "y 1 @0.537,-0.015\n"+
      "y2 A @0.216,-0.015\n"+
      "\n"+
      "x y2 y");
   return _.pluck(GraphAnalyzer.intermediates(g),'id').join(",");
})(), "" )

assert.equal((function(){
   var g = GraphParser.parseGuess("x E @0.264,-0.027\n"+
"y O @0.537,-0.015\n"+
"y2 A @0.216,-0.015\n"+
"\n"+
"x y2 y");
	return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "{y2}" )

assert.equal((function(){
	var g = TestGraphs.findExample( "Many variables" );
	return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "{7}\n{8}" )

assert.equal((function(){
	var g = TestGraphs.findExample( "Extended confounding" );
        g.addLatentNode( "A" );
	return imp_2_str( GraphAnalyzer.listMinimalImplications( g ) );
})(), "" )

assert.equal((function(){
	var g = TestGraphs.findExample( "Sebastiani" );
	return imp_2_str( GraphAnalyzer.listMinimalImplications( g, 7 ) );
})(), "EDN1.3 _||_ SELP.22 | SELP.17, Stroke\n"+
	"EDN1.3 _||_ SELP.22 | ECE1.13, Stroke\n"+
	"EDN1.3 _||_ SELP.22 | ECE1.12, Stroke\n"+
	"EDN1.3 _||_ SELP.22 | ANXA2.8\n"+
	"EDN1.3 _||_ SELP.17 | ECE1.13\n"+
	"EDN1.3 _||_ SELP.17 | ECE1.12, Stroke\n"+
	"EDN1.3 _||_ SELP.17 | ANXA2.8" )

assert.equal((function(){
    // X -> I -> Y, I <- M -> Y, I -> A  = bias
	var g = GraphParser.parseGuess("X E\nY O\nI 1\nJ A\nM 1\n\nX I\nI J Y\nM I Y")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "I J Y\nM I Y\nX I" )

assert.equal((function(){
    // X -> I -> Y, I <- M -> Y   = bias
	var g = GraphParser.parseGuess("X E\nY O\nI A\nM 1\n\nX I\nI Y\nM I Y")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "M I Y\nX I" )

assert.equal((function(){
    // X -> I -> Y, I -> A   = bias
	var g = GraphParser.parseGuess("X E\nY O\nI 1\nJ A\n\nX I\nI Y J")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "I J Y\nX I" )

assert.equal((function(){
    // A <- X -> Y   = no bias
	var g = GraphParser.parseGuess("X E\nY O\nI A\n\nX Y\nX I")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
    // X -> Y -> A   = bias
	var g = GraphParser.parseGuess("X E\nY O\nI A\n\nX Y\nY I")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "X Y\nY I" )

assert.equal((function(){
    // X -> A -> Y   = no bias
	var g = GraphParser.parseGuess("X E\nY O\nI A\n\nX I\nI Y")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
	return GraphTransformer.activeBiasGraph(TestGraphs.felixadjust).toAdjacencyList()
})(), "s1 s2 z\ns2 s3\ns3 y\nx s1" )

assert.equal((function(){
	var g = GraphParser.parseGuess("A E @1,1\nB O @3,1\nC 1 @2,1\n\nA B\nB C")
	return g.hasCompleteLayout()
})(), true )

assert.equal((function(){
	var g = GraphParser.parseGuess("A E @1,1\nB O\nC 1 @1,1\n\nA B\nB C")
	return g.hasCompleteLayout()
})(), false )

assert.equal((function(){
	var g = GraphParser.parseGuess("A E\nB O\nC 1\n\nA B\nB C");
	return g.hasCompleteLayout()
})(), false )

assert.equal((function(){
	var g = GraphParser.parseGuess("A E\nB O\nC 1\n\nA B\nB C");
	g.deleteVertex(g.getVertex("A"));
	return g.getSources().length;
})(), 0 )

assert.equal((function(){
	var g = GraphParser.parseGuess("D O\nD2 O\nE E\nE2 E\n\nD E\nD2 E2")
	//console.log(g.toString())
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "D E\nD2 E2" )

assert.equal((function(){
	var g = GraphParser.parseGuess("ein A 1\n"+
"ein B 1\n"+
"\n"+
"ein A ein B");
	return g.oldToString();
})(), "ein%20A 1\nein%20B 1\n\nein%20A ein%20B" )

assert.equal((function(){
	var g = GraphParser.parseGuess("A E\nB O\nE E\nZ\nU\n\nA U\nB Z\nZ E\nU Z");
	return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "{U, Z}" )

assert.equal((function(){
	var g = GraphParser.parseGuess("E E\nD O\nA 1\nB U\nZ 1\n\nA E Z\nB D Z\nZ E D\nE D");
	return GraphAnalyzer.directEffectEqualsTotalEffect( g )
})(), true )

assert.equal((function(){
	var g = GraphParser.parseGuess("E E\nD O\nA 1\nB U\nZ 1\n\nA E Z\nB D Z\nZ D\nE D Z");
	return GraphAnalyzer.directEffectEqualsTotalEffect( g )
})(), false )

assert.equal((function(){
	var g = GraphParser.parseGuess("E E\nD O\nA 1\nB U\nZ 1\n\nA E Z\nB D Z\nZ E D");
	return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) );
})(), "{A, Z}" )

assert.equal((function(){
	var g = GraphParser.parseGuess("E E\nD O\nA 1\nB U\nZ 1\n\nA E Z\nB D Z\nZ E D");
	return sep_2_str( GraphAnalyzer.listMinimalSeparators(GraphTransformer.moralGraph(g)) );
})(), "{A, Z}\n{B, Z}" )

assert.equal((function(){;
   var g = TestGraphs.small3();
   g.addAdjustedNode("p");
   var abg = GraphTransformer.activeBiasGraph(g);
   return GraphTransformer.edgeInducedSubgraph(g,abg.edges).toAdjacencyList()
})(), "" )

assert.equal((function(){
   var g = GraphParser.parseGuess("E E @-1.897,0.342\n"+
"D O @-0.067,0.302\n"+
"g A @-0.889,1.191\n"+
"\n"+
"D g\n"+
"E D");
	return _.pluck(GraphAnalyzer.nodesThatViolateAdjustmentCriterion( g ),'id').join(",");
})(), "g" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY1 O\nY2 O\nU1 1\nU2 1\n\nU1 X1 X2\nU2 Y1 Y2")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
	var g = GraphParser.parseGuess("A E\nB O\nC O\nD A\n\nA B\nB C\nC D")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "A B\nB C\nC D" )

assert.equal((function(){
	var g = GraphParser.parseGuess("A E\nB O\nC O\n\nA B\nB C")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nY1 O\nY2 O\nD A\n\nX1 Y1\nY1 Y2\nY2 D")
	return GraphAnalyzer.directEffectEqualsTotalEffect( g )
})(), true )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nY1 O\nY2 O\nD A\n\nX1 Y1\nY2 D")
	return GraphAnalyzer.directEffectEqualsTotalEffect( g )
})(), true )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nY1 O\nY2 O\nD A\n\nX1 Y1\nY1 Y2\nY2 D")
	return sep_2_str( GraphAnalyzer.listMsasDirectEffect( g ) )
})(), "" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nY1 O\nY2 O\nD A\n\nX1 Y1\nY2 D")
	return sep_2_str( GraphAnalyzer.listMsasDirectEffect( g ) )
})(), "{D}" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nY1 O\nY2 O\nD A\n\nX1 Y1\nY1 Y2\nY2 D")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "X1 Y1\nY1 Y2\nY2 D" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nY1 O\nY2 O\nD A\n\nX1 Y1\nY2 D")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY1 O\nY2 O\n\nX1 Y1 X2\nY2 X2")
	//console.log(g.toString())
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "Y2 X2" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nX2 E\n\nX1 X2")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY1 O\nY2 O\n\nX1 Y1 X2\nX2 Y2")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY1 O\nY2 O\n\nX1 Y1 X2\nX2 Y2")
	return _.pluck(
			_.difference(GraphAnalyzer.properPossibleCausalPaths(g),g.getSources()),
			"id").sort().join(",")
})(), "Y1,Y2" )

assert.equal((function(){
	// our non-X-ancestor MSAS example from the UAI paper w/ causal edge
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY O\nM1 1\nM2 1\n\nX1 Y M1\nY M2\nM1 M2\nM2 X2")
	return sep_2_str( GraphAnalyzer.listMsasDirectEffect( g ) )
})(), "" )

assert.equal((function(){
	// our non-X-ancestor MSAS example from the UAI paper w/o causal edge
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY O\nM1 1\nM2 1\n\nX1 M1\nY M2\nM1 M2\nM2 X2")
	return sep_2_str( GraphAnalyzer.listMsasDirectEffect( g ) )
})(), "{M1, M2}" )

assert.equal((function(){
	// our non-X-ancestor MSAS example from the UAI paper w/ causal edge
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY O\nM1 1\nM2 1\n\nX1 Y M1\nY M2\nM1 M2\nM2 X2")
	return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) )
})(), "" )

assert.equal((function(){
	// our non-X-ancestor MSAS example from the UAI paper w/o causal edge
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY O\nM1 1\nM2 1\n\nX1 M1\nY M2\nM1 M2\nM2 X2")
	return sep_2_str( GraphAnalyzer.listMsasTotalEffect( g ) )
})(), "{M1, M2}" )

assert.equal((function(){
    // X -> I -> Y,  I -> A, adjust I  = no bias
	var g = GraphParser.parseGuess("X E\nY O\nI A\nJ A\n\nX I\nI J Y")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
    // X -> I -> Y, I <- M -> Y, I -> A, adjust M, I  = no bias
	var g = GraphParser.parseGuess("X E\nY O\nI A\nJ A\nM A\n\nX I\nI J Y\nM I Y")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

assert.equal((function(){
    // X -> I -> Y, I <- M -> Y, I -> A, adjust M = bias
	var g = GraphParser.parseGuess("X E\nY O\nI 1\nJ A\nM A\n\nX I\nI J Y\nM I Y")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "I J Y\nX I" )


assert.equal((function(){
	var g = TestGraphs.findExample( "Shrier" )
	var r = ""
	var v1,v2,vv=g.getVertices()
	for( var i = 0 ; i < vv.length ; i ++ ){
		for( var j = 0 ; j < vv.length ; j ++ ){
			var c = GraphAnalyzer.minVertexCut( g, [vv[i]], [vv[j]] )
			if( c > 0 ) r += vv[i].id + " " + vv[j].id + " " + c + "\n"
		}
	}
	return r
})(), "WarmUpExercises Injury 1\nCoach WarmUpExercises 2\nCoach Injury 2\nCoach PreGameProprioception 1\nCoach PreviousInjury 1\nCoach IntraGameProprioception 2\nCoach NeuromuscularFatigue 1\nGenetics WarmUpExercises 1\nGenetics Injury 3\nGenetics PreGameProprioception 1\nGenetics TissueWeakness 1\nGenetics IntraGameProprioception 2\nTeamMotivation Injury 1\nTeamMotivation IntraGameProprioception 1\nPreGameProprioception Injury 1\nPreGameProprioception IntraGameProprioception 1\nConnectiveTissueDisorder Injury 2\nConnectiveTissueDisorder IntraGameProprioception 1\nContactSport Injury 1\nFitnessLevel WarmUpExercises 1\nFitnessLevel Injury 2\nFitnessLevel IntraGameProprioception 2\n" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X E\nY O\nM 1\nN A\n\nX M\nM N Y")
	return GraphTransformer.flowNetwork(g).graph.toAdjacencyList()
})(), "M N X Y\nN M\nX M __SRC\nY M __SNK\n__SNK Y\n__SRC X" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X E\nY O\nM 1\nN A\n\nX M\nM N Y")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "M N Y\nX M" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X E\nY O\nM 1\nN A\n\nX M\nM N\nY M")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "X M\nY M" )

assert.equal((function(){
	// our non-X-ancestor MSAS example from the UAI paper w/o causal edge
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY O\nM1 1\nM2 A\n\nX1 M1\nY M2\nM1 M2\nM2 X2")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "M1 M2\nX1 M1\nY M2" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X E\nY O\nM 1\n\nY M\nM X")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "M X\nY M" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X E\nY O\n\nY X")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "Y X" )

assert.equal((function(){
	// our non-X-ancestor MSAS example from the UAI paper w/o causal edge
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY O\nM1 1\nM2 1\n\nX1 M1\nY M2\nM1 M2\nM2 X2")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "M2 X2\nY M2" )

assert.equal((function(){
	var g = GraphParser.parseGuess("X1 E\nY1 O\nY2 O\nM 1\n\nY1 M\nM Y2")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )

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
	var g = GraphParser.parseGuess("X1 E\nX2 E\nY1 O\nY2 O\nU1 1\nU2 1\n\nX1 U1\nU1 X2\nY1 U2\nU2 Y2")
	return GraphTransformer.activeBiasGraph(g).toAdjacencyList()
})(), "" )


assert.equal((function(){
	var g = TestGraphs.findExample( "Thoemmes" )
	return GraphAnalyzer.minVertexCut( g, 
		[g.getVertex("e0"),g.getVertex("s2")],
		[g.getVertex("y")] ) 
})(), 2 )

assert.equal((function(){
	var g = GraphParser.parseGuess("a 1\nb 1\nc 1\nd 1\ne 1\nm 1\nn 1\np 1\nu 1\nx E\ny O\n\n"
		+"a b\nb u\nc u n\nd e\ne c\nm a\nn p\np y\nu y\nx c d m")
	return GraphAnalyzer.minVertexCut( g, [g.getVertex("x")], [g.getVertex("y")] ) 
})(), 2 )

assert.equal((function(){
	var g = TestGraphs.findExample( "Confounding" )
	var r = ""
	var v1,v2,vv=g.getVertices()
	for( var i = 0 ; i < vv.length ; i ++ ){
		for( var j = 0 ; j < vv.length ; j ++ ){
			var c = GraphAnalyzer.minVertexCut( g, [vv[i]], [vv[j]] )
			if( c > 0 ) r += vv[i].id + " " + vv[j].id + " " + c + "\n"
		}
	}
	return r
})(), "A D 2\nB E 1\n" )

assert.equal((function(){
	var g = GraphParser.parseGuess( 
		"digraph G { y -> m \n m -> x }"
	).addSource("x").addTarget("y")
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "m -> x\ny -> m" )

assert.equal((function(){
	var g = GraphParser.parseGuess( 
		"digraph G { x [exposure]\ny [outcome]\na [adjusted]\n"+
		"x -> a\nu -> x\nu -> y }" )
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "u -> x\nu -> y" )

assert.equal((function(){
	var g = GraphParser.parseGuess( 
		"digraph G { x [exposure]\ny [outcome]\na [adjusted]\n b [adjusted]\n"+
		"x -> a\nx -> b\nb -> a\ny -> b }" )
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "x -> b\ny -> b" )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G { x [exposure]\ny [outcome]\nm [adjusted]\nx -> m\ny -> m }" )
	g = GraphTransformer.canonicalDag( g ).g
	g = GraphTransformer.ancestorGraph( g )
 	return ""+GraphSerializer.toDotEdgeStatements(g)
})(), "x -> m\ny -> m" )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G { x [exposure]\ny [outcome]\nm [adjusted]\nx -> m\ny -> m }" )
 	return GraphSerializer.toDotEdgeStatements(GraphTransformer.ancestorGraph(g))
})(), "x -> m\ny -> m" )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G { b [exposure]\nc [outcome]\na [adjusted]\na -- b\na -- c }" )
 	return GraphAnalyzer.connectedComponents(g).length
})(), 1 )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G {a -- b }" )
 	return GraphAnalyzer.connectedComponents(g).length
})(), 1 )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G {a -- b }" )
 	return g.getVertex("a").getNeighbours().length
})(), 1 )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G {a [exposure]\nb [outcome]\nc [adjusted]\na -> c\nb -> c }" )
 	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "a -> c\nb -> c" )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G {a [exposure]\nb [outcome]\nc [adjusted]\na -> b\nb -> c }" )
 	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "a -> b\nb -> c" )

assert.equal((function(){
   var g = TestGraphs.findExample("Acid")
 	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "x1 -> x3\nx1 -> x4\nx10 -> x15\nx4 -> x5\nx5 -> x7\nx7 -> x9\nx9 -> x10" )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G { a [exposure] \n b [outcome] \n a <-> c \n c -> b }" )
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.canonicalDag(g).g)
})(), "L1 -> a\nL1 -> c\nc -> b" )

assert.equal((function(){
    var g = GraphParser.parseGuess( 
		"digraph G { a [exposure] \n b [outcome] \n a <-> c \n c -> b }" )
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))	
})(), "a <-> c\nc -> b" )

assert.equal((function(){
    var g = GraphParser.parseGuess( "digraph G { a -- b }" )
    var ids = _.pluck(GraphAnalyzer.connectedComponentAvoiding( g, [g.getVertex("a")] )
    	,"id")
    ids=ids.sort(); return ids.join(" ")
})(), "a b" )

assert.equal((function(){
	var g = GraphParser.parseGuess( 
		"digraph G { x [source] \n y [outcome] \n a [adjusted] \n "
		+"a -> x \n b -> a \n b -> y }"
	)
	return GraphSerializer.toDotEdgeStatements(GraphTransformer.activeBiasGraph(g))
})(), "" )

assert.equal((function(){	
	var g = TestGraphs.findExample("onfound")
	return !GraphAnalyzer.dConnected( g, [g.getVertex("E")], [g.getVertex("B")], 
		[g.getVertex("Z")] )
})(), false )

assert.equal((function(){
	var g = TestGraphs.findExample("Shrier")
	var ii = GraphAnalyzer.listMinimalImplications( g )
	var all_good=true
	for( var i = 0 ; i < ii.length ; i ++ ){
		for( var j = 0 ; j < ii[i][2].length ; j ++ ){
			if( ii[i][2][j].length > 0 ){
				all_good = all_good && GraphAnalyzer.dConnected( g, 
					[g.getVertex(ii[i][0])], [g.getVertex(ii[i][1])], ii[i][2][j].slice(1) )
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
	var g = GraphParser.parseGuess( "digraph G { x -> m -> y }" )
	return !GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], 
		[g.getVertex("m")] )
})(), true )

assert.equal((function(){
	var g = GraphParser.parseGuess( "digraph G { x -> m -> y }" )
	return !GraphAnalyzer.dConnected( g, [g.getVertex("x")], [g.getVertex("y")], [] )
})(), false )

assert.equal( _.pluck(GraphAnalyzer.dpcp(
	GraphParser.parseGuess( "digraph{ x [exposure]\n y [outcome]\n x -> y -- z }" ) ),"id").
		sort().join(","),
	"y,z" )

assert.equal( _.pluck(GraphAnalyzer.dpcp(
	GraphParser.parseGuess( "digraph{ x [exposure]\n y [outcome]\n x -- y -- z }" ) ),"id").
		sort().join(","),
	"x,y,z" )


}); // end uncategorized tests

