
mbg <- getExample("M-bias")
mbg.a <- setVariableStatus( mbg, "adjustedNode", "A" )
mbg.z <- setVariableStatus( mbg, "adjustedNode", "Z" )

a2s <- function(adj) sort(unlist(lapply( adj, function(x) paste0(x,collapse=",") ),
	use.names=FALSE))

test_that("M bias graph", {
	expect_equal(a2s(adjustmentSets( mbg.a )),"A")
	expect_equal(a2s(adjustmentSets( mbg.z )),c("A,Z","B,Z"))
})

test_that("CGs", {
	expect_equal(length(children(backDoorGraph(
		"pdag{ {i j} -> x -> {a -- b -- c -- a } a -> z b -> y x[e] y[o] }"),"x")),0)
})

