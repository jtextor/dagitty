test_that("simulation methods", {
	expect_equal( nrow( simulateLogistic( "dag{X}", N=1000 ) ), 1000 )
})
