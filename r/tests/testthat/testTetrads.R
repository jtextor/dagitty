
test_that(
	"two-factor model",{
		g <- dagitty("dag{{x1 x2 x3 x4} <- x <-> y -> {y1 y2 y3 y4}}")
		latents(g) <- c("x","y")
		expect_equal( nrow(vanishingTetrads(g)), 138 )
	}
)

