
test_that(
	"two-factor model",{
		g <- dagitty("dag{{x1 x2 x3 x4} <- x <-> y -> {y1 y2 y3 y4}}")
		latents(g) <- c("x","y")
		expect_equal( nrow(vanishingTetrads(g)), 138 )
	}
)

test_that("local tetrad tests accept covariance matrices", {
	g <- dagitty("dag { f [latent]; f -> {a b c d} }")
	data <- simulateSEM(g, N=100)
	sample.cov <- cov(data)
	expected <- localTests(g, data=data, type="tetrads")
	expect_true( nrow(expected) > 0 )
	expect_equal( localTests(g, type="tetrads", sample.cov=sample.cov,
		sample.nobs=nrow(data)), expected )
	expect_equal( localTests(g, data=data, type="tetrads",
		sample.cov=diag(4)), expected )
	expect_equal( localTests(g, data=data, type="tetrads",
		sample.nobs=1), expected )
	expect_error( localTests(g, type="tetrads", sample.cov=sample.cov),
		"Please provide sample size", fixed=TRUE )
})

