
QUnit.test( "parsing and serializing", function( assert ) {
	assert.equal( 
		GraphDotParser.parse(" dag{ x -> { a b } }"),"dag")
	assert.equal( 
		GraphDotParser.parse(" strict Dag { x y ; z \n q }").type,"dag")
	assert.equal( 
		GraphDotParser.parse(" STRICT dag{ x -> m -> a b }").type,"dag")
	assert.equal(
		GraphDotParser.parse("graph {\n"+
		"a [pos=\"0.179,0.301\"]\n"+
		"b [pos=\"0.618,0.988\"]\n"+
		"c [pos=\"0.305,0.981\"]\n"+
		"x [exposure,pos=\"0.484,0.032\"]\n"+
		"y [ outcome , pos = \" 0.774 , 0.285 \" ]\n"+
		"a -- b\n"+
		"a -- c\n"+
		"a -- x\n"+
		"a -- y\n"+
		"b -- c\n"+
		"b -- x\n"+
		"b -- y\n"+
		"c -- x\n"+
		"c -- y\n"+
		"x -- y\n"+
		"}").type,"graph")
	assert.equal(
		GraphDotParser.parse("digraph G { xi1 [latent]\n"+
			"xi1 -> x1\n"+
			"xi1 -> x3\n"+
			"xi1 -> x4\n"+
			"xi1 -> x5\n"+
			"x5 -> x6\n"+
			"x1 -> x6\n"+
			"x6 -> x3 }\n").type,"digraph")
} )