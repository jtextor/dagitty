x <- dagitty("pdag{
	X1 [exposure]
	X2 [exposure]
	X3 [exposure]
	
	Y [outcome]
	
	X1 -> Z1 <- Y
	X2 <- Z2 -> Y
	X3 -- Z3 -> Y
	
	X1 -> Z2
}")

x2 <- dagitty("pdag{
	x [exposure]
	y [outcome]
	z -- x -> y
	x <- c -> y
	z -- c
}")

x3 <- dagitty("pdag{
	x [exposure]
	y [outcome]
	z -- x -> y
	x <- c -> y
}")

test_that("adjustment set construction", {
	expect_equal(length(adjustmentSets(x)), 0)	
	expect_equal(adjustmentSets(x,"X1")[[1]], list())	
	expect_equal(adjustmentSets(x,"X2")[[1]], c("Z2"))	
	expect_equal(length(adjustmentSets(x,"X3")), 0)
	expect_equal(length(adjustmentSets(x2)), 0)
	expect_equal(unlist(adjustmentSets(x3),use.names=FALSE), ("c"))
})

