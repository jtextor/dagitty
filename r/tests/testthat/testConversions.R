

test_that("parsing / serializing", {
	small1 <- dagitty('dag {A -> {S[e]} -> {T[o]}}')
	expect_equal(toString(small1,"dagitty.old"), "A 1\nS E\nT O\n\nA S\nS T")
	expect_equal(graphType("pag{}"),"pag")	
})

test_that("different serializers", {
	g <- dagitty("{a[pos=\"0,0\"]}->{b[pos=\"1,0\"]}")
	expect_equal(toString(dagitty("a->b"),"bnlearn"),"[a][b|a]")
	expect_equal(toString(dagitty("a->b"),"edgelist"),"[('a','b')]")
	expect_true( startsWith( toString(g,"singular"), 
		"ring r = 0,(babb,aaab),(dp(1),lp);\nideal i = aaab - (babb);\noption(redSB);" ) )
	expect_true( endsWith( toString(g,"lavaan"), "b~a\n" ) )
} )

test_that("edge serializers accept graphs with isolated nodes", {
	g <- dagitty("dag { a; b }")
	expect_identical( edges(g), data.frame( v=character(), w=character(),
		e=character(), x=numeric(), y=numeric() ) )
	expect_equal( convert(g, "bnlearn"), "[a][b]" )
	expect_equal( toString(g, "edgelist"), "[]" )
} )

test_that("igraph conversion preserves isolated nodes", {
	skip_if_not_installed("igraph")
	g <- convert( dagitty("dag { a; b }"), "igraph" )
	expect_setequal( igraph::vertex_attr(g, "name"), c("a", "b") )
	expect_equal( igraph::ecount(g), 0 )
} )

