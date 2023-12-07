test_that("simulation methods", {
	expect_equal( nrow( simulateLogistic( "dag{X}", N=1000 ) ), 1000 )
})

test_that("random graph generation", {
	expect_equal( length( names( randomDAG( 10, .5 ) ) ), 10 )
	expect_equal( nrow( edges( randomDAG( 5, 0 ) ) ) , 0 )
	expect_equal( nrow( edges( randomDAG( 3, 1 ) ) ), 3 )

} )
