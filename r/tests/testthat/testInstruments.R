
test_that(
	"basic IV graph",{
		expect_equal(length(instrumentalVariables("i->{x[e]}->{y[o]}<->x")),1)
		expect_equal(instrumentalVariables("i->{x[e]}->{y[o]}<->x")[[1]]$I,"i") 
	}
)

test_that(
	"conditional instrument",{
		g <- dagitty("{y[o]}<-w->i->{x[e]}->y<->x")
		expect_equal( length(instrumentalVariables(g)), 1 )
		expect_equal( length(instrumentalVariables(g)[[1]]$Z), 1 )
		expect_equal( instrumentalVariables(g)[[1]]$Z, "w" )
	}
)
