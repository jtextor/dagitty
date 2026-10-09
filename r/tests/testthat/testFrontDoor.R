fd.dag1 <- dagitty("dag {
  X -> M; M -> Y
  X [pos=\"0,0\"]; M [pos=\"1,0\"]; Y [pos=\"2,0\"]
}")

fd.dag2 <- dagitty("dag {
  A -> B; B -> C
  A [pos=\"0,0\"]; B [pos=\"1,0\"]; C [pos=\"2,0\"]
}")

fd.dag3 <- dagitty("dag {
  A -> M; M -> Y; A -> Y; A <-> Y
  A [pos=\"0,0\"]; M [pos=\"1,1\"]; Y [pos=\"2,0\"]
}")

fd.dag4 <- dagitty("dag {
  A -> Y; Y -> M; U -> A; U -> M; A <-> M
  U [pos=\"0,1\"]; A [pos=\"0,0\"]; Y [pos=\"1.5,0.5\"]; M [pos=\"2,0\"]
}")

fd.dag5 <- dagitty("dag {
  Y -> A; Y -> B; A -> C; B -> C; Y <-> C
  A [pos=\"0,0\"]; B [pos=\"1,0\"]; C [pos=\"2,0\"]
}")

fd.dag6 <- dagitty("dag {
  X -> Y; Y -> Z; X <-> Y; Y <-> Z
  X [pos=\"0,0\"]; Y [pos=\"1,0.5\"]; Z [pos=\"2,0\"]
}")

fd.dag7 <- dagitty("dag {
  X -> A1; X -> A2; X -> A3; A1 -> Z; A2 -> Z; A3 -> Z
  X [pos=\"0,0\"]; A1 [pos=\"1,1\"]; A2 [pos=\"1,0\"]; A3 [pos=\"1,-1\"]; Z [pos=\"2,0\"]
}")

fd.dag8 <- dagitty("dag {
  A -> M1; A <-> M1; A -> M2; M1 -> W; M2 -> W; A <-> W
  A [pos=\"0,0\"]; M1 [pos=\"1,1\"]; M2 [pos=\"1,-1\"]; W [pos=\"2,0\"]
}")

fd.dag9 <- dagitty("dag {
  B -> C; C -> D; B <-> D; C <-> D
  B [pos=\"0,0\"]; C [pos=\"1,0.5\"]; D [pos=\"2,0\"]
}")

fd.dag10 <- dagitty("dag {
  A -> B; B -> Z; A -> Z
  A [pos=\"0,0\"]; B [pos=\"1,0.5\"]; Z [pos=\"2,0\"]
}")

fd.dag11 <- dagitty("dag {
  D -> E; D -> F; E -> G; F -> G; D <-> E; F <-> G
  D [pos=\"0,0\"]; E [pos=\"1,1\"]; F [pos=\"1,-1\"]; G [pos=\"2,0\"]
}")

fd.dag12 <- dagitty("dag {
  A -> B; B -> C; U1 -> A; U1 -> B; U2 -> B; U2 -> C
  U1 [pos=\"0,1\"]; A [pos=\"0,0\"]; B [pos=\"1,0.5\"]; C [pos=\"2,0\"]; U2 [pos=\"2,1\"]
}")

fd.dag13 <- dagitty("dag {
  C -> D; D -> E; C <-> E; C -> U; U -> E; C -> U2; E -> U2
  U [pos=\"-0.2,1\"]; U2 [pos=\"0.2,1\"]; C [pos=\"0,0\"]; D [pos=\"1,0.5\"]; E [pos=\"2,0\"]
}")

fd.sets <- function( dag, x, y ){
  result <- frontDoorSets(dag, x, y)
  if( length(result) == 0 ) return(NULL)
  sets <- lapply(result, sort)
  sets[order(sapply(sets, paste, collapse="|"))]
}

fd.contains <- function( dag, x, y, set ){
  sets <- fd.sets(dag, x, y)
  any(sapply(sets, function(s) identical(s, sort(set))))
}

test_that(
  "simple chain X->M->Y has single valid set {M}",{
    expect_equal(fd.sets(fd.dag1, "X", "Y"), list("M"))
  }
)

test_that(
  "simple chain A->B->C has single valid set {B}",{
    expect_equal(fd.sets(fd.dag2, "A", "C"), list("B"))
  }
)

test_that(
  "exposure/outcome from graph annotations",{
    g <- dagitty("dag{ X [exposure] ; Y [outcome] ; X -> M -> Y ; X <-> Y }")
    result <- frontDoorSets(g)
    expect_equal(length(result), 1)
    expect_equal(result[[1]], "M")
  }
)

test_that(
  "no directed paths returns empty",{
    g <- dagitty("dag{ X ; Y }")
    expect_equal(length(frontDoorSets(g, "X", "Y")), 0)
  }
)

test_that(
  "error on invalid node names",{
    g <- dagitty("dag{ X -> M -> Y }")
    expect_error(frontDoorSets(g, "X", "Z"), "is not a variable")
  }
)

test_that(
  "direct edge A->Y causes immediate fail",{
    expect_null(fd.sets(fd.dag3, "A", "Y"))
  }
)

test_that(
  "direct edge A->Z causes immediate fail",{
    expect_null(fd.sets(fd.dag10, "A", "Z"))
  }
)

test_that(
  "bidirected X<->Y and Y<->Z, no valid front-door",{
    expect_null(fd.sets(fd.dag6, "X", "Z"))
  }
)

test_that(
  "A<->M1 blocks M1 path entirely, no valid front-door",{
    expect_null(fd.sets(fd.dag8, "A", "W"))
  }
)

test_that(
  "C<->D makes Criterion 3 fail, no valid front-door",{
    expect_null(fd.sets(fd.dag9, "B", "D"))
  }
)

test_that(
  "D<->E and F<->G block all sets, no valid front-door",{
    expect_null(fd.sets(fd.dag11, "D", "G"))
  }
)

test_that(
  "U1 and U2 confounders open unblockable backdoors, no valid front-door",{
    expect_null(fd.sets(fd.dag12, "A", "C"))
  }
)

test_that(
  "no valid front-door when backdoor M->Y is open via U",{
    g <- dagitty("dag{ X -> M -> Y ; U -> X ; U -> Y ; U -> M }")
    expect_null(fd.sets(g, "X", "Y"))
  }
)

test_that(
  "A->Y->M with A<->M, only valid set is {Y}",{
    expect_equal(fd.sets(fd.dag4, "A", "M"), list("Y"))
  }
)

test_that(
  "fork Y->{A,B}->C with Y<->C, valid set is {A,B}",{
    result <- fd.sets(fd.dag5, "Y", "C")
    expect_length(result, 1)
    expect_true(fd.contains(fd.dag5, "Y", "C", c("A", "B")))
  }
)

test_that(
  "parallel mediators X->{A1,A2,A3}->Z, valid set is {A1,A2,A3}",{
    result <- fd.sets(fd.dag7, "X", "Z")
    expect_length(result, 1)
    expect_true(fd.contains(fd.dag7, "X", "Z", c("A1", "A2", "A3")))
  }
)

test_that(
  "C->E structure, valid set is {D,U}",{
    result <- fd.sets(fd.dag13, "C", "E")
    expect_length(result, 1)
    expect_true(fd.contains(fd.dag13, "C", "E", c("D", "U")))
  }
)

test_that(
  "two mediators in chain, {M1,M2} is valid",{
    g <- dagitty("dag{ X -> M1 -> M2 -> Y ; X <-> Y }")
    sets <- lapply(frontDoorSets(g, "X", "Y"), sort)
    expect_true(list(c("M1","M2")) %in% sets)
  }
)
