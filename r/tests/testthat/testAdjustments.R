
mbg <- dagitty("dag {X [exposure] Y [outcome] { A B } -> Z  A -> X B -> Y }")
getExample("M-bias")
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

test_that("pags", {
	expect_equal(length(adjustmentSets("dag{ X1->V1->X2->Y ; V1 -> X3 }",
		c("X1","X2","X3"),"Y",type="all")),2)
	expect_false(isAdjustmentSet('pag { 1 @-@ 2 @-@ 3 @-@ 4 2 @-@ 4 2[e] 4[o]}',list()))
	expect_false(isAdjustmentSet('pag { u @-@ {{x[e]} @-@ {y[o]}} }',list()))
	expect_false(isAdjustmentSet('pag { u @-@ {x[e]} @-@ {y[o]} }',list()))
	expect_true(dconnected('pag { x @-@ y }',"x","y"))

})

test_that("mediation", {
	g <- dagitty( "dag{ {x[e]}->m->{y[o]}->S }" )
	expect_true(isAdjustmentSet(g,list()))
	expect_false(isAdjustmentSet(g,list("m")))
} )
