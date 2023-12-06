

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

