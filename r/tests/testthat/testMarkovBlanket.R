
fig_2.9 <- dagitty(
    'dag{
      W -> Y
      X -> W
      Z_1 -> {X Z_3}
      Z_2 -> {Y Z_3}
      Z_3 -> {X Y}
    }'
  )

test_that("Markov Blanket", {
	expect_equal( sort( markovBlanket( fig_2.9, c() ) ), character(0) )
	expect_equal( sort( markovBlanket( fig_2.9, list() ) ), character(0) )
	expect_equal( sort( markovBlanket( fig_2.9, "Z_1" ) ), c("X", "Z_2", "Z_3") )
	expect_equal( sort( markovBlanket( fig_2.9, "Y" ) ), c("W", "Z_2", "Z_3") )
	expect_equal( sort( markovBlanket( fig_2.9, c("W","Y") ) ), c("X", "Z_2", "Z_3") )
} )



