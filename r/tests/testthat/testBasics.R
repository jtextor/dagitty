small1 <- dagitty('dag {A -> S -> T}')
exposures(small1) <- 'S'
outcomes(small1) <- 'T'

mixed <- dagitty("mag { a -- x -> b \n c <-> x <- d \n f }")

coll <- dagitty('dag {A -> B <- C}')

longpath <- dagitty("dag{ X -> R -> S -> T <- U <- V -> Y T -> P }")

# covers old unittests 1 t/m 3

test_that("parsing / serializing", {
	expect_equal(toString(small1,"dagitty.old"), "A 1\nS E\nT O\n\nA S\nS T")
	expect_equal(graphType("pag{}"),"pag")	
})

test_that("relationships", {
	expect_equal(spouses(mixed,"x"),("c"))
	expect_equal(neighbours(mixed,"x"),("a"))
	expect_equal(parents(mixed,"x"),("d"))
	expect_equal(children(mixed,"x"),("b"))
	expect_equal(sort(adjacentNodes(mixed,"x")),c("a","b","c","d"))
	expect_equal(adjacentNodes(mixed,"f"),character())
})

test_that("ancestor moral graph", {
	expect_equal(toString(ancestorGraph(small1),"dagitty.old"), 
		"A 1\nS E\nT O\n\nA S\nS T")
	expect_equal(toString(moralize(ancestorGraph(small1)),"dagitty.old"), 
		"A 1\nS E\nT O\n\nA S\nS A T\nT S")
	expect_equal(nrow(edges(moralize(dagitty("dag{ a -> x <-> z <- b}")))),6)
})

test_that("path tracing", {
	expect_equal( paths( mixed, "a", "b" )$paths, "a -- x -> b" )
	expect_equal( paths( mixed, "c", "d" )$paths, "c <-> x <- d" )

	expect_equal( paths( mixed, "a", c("b","c","d") )$open, rep(TRUE,3) )
	expect_equal( paths( mixed, "b", c("c","d") )$open, rep(TRUE,2) )
	expect_equal( paths( mixed, "c", "d" )$open, FALSE )

	expect_equal( paths( mixed, "a", c("b","c","d"), "x" )$open, rep(FALSE,3) )
	expect_equal( paths( mixed, "b", c("c","d"), "x" )$open, rep(FALSE,2) )
	expect_equal( paths( mixed, "c", "d", "x" )$open, TRUE )

	expect_equal( paths( coll,"A","C","B")$open, TRUE )

	expect_equal( paths( coll,"A","C")$open, FALSE )


	expect_equal( paths( longpath,"S","U","T")$open, TRUE )

	expect_equal( paths( longpath,"R","U","T")$open, TRUE )

	expect_equal( paths( longpath,"X","Y","P")$open, TRUE )

	expect_equal( paths( longpath,"X","Y","T")$open, TRUE )

	
	expect_equal( sort(dconnected( mixed, "d" )), c("a","b","d","x") )
	expect_equal( sort(dseparated( mixed, "d" )), c("c","f") )

})


test_that( "cycles", {
	expect_equal( findCycle( coll ), list() )
	expect_equal( findCycle( "dag{ a -> b -> a }" ), c("a","b","a") )
} )

test_that("ci tests", {
	expect_equal( nrow(localTests( coll, simulateSEM(coll), type="cis" )), 1 )
	expect_equal( nrow(localTests( coll, sample.cov=cov(simulateSEM(coll,N=500)), 
		sample.nobs=500, type="cis" )), 1 )
})

test_that("equiv class", {
	expect_equal( length(equivalentDAGs("dag{a->{b c d} b->{c d}}")), 10 )
	expect_equal( length(equivalentDAGs("dag{a->{b c d} b->{c d}}",3)), 3 )	
} )


test_that("children and parents of nothing", {
	expect_equal( length(children("a->b",c())), 0 )
	expect_equal( length(parents("a->b",c())), 0 )
} )

