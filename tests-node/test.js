import test from 'ava'

let d = require('../jslib/dagitty-node.js')

let $p = x => d.GraphParser.parseGuess( x )
let $e = x => d.GraphSerializer.toDotEdgeStatements( x )

test('IV identification in graph', t => {

	let g = $p("dag { X -> X2 -> X4 -> U2 <- X6 <- X1 X6 -> X1 [beta=1] }")

	let g2 = d.GraphTransformer.latentToObserved( g ) 

	console.log( d.GraphAnalyzer.ancestralInstrument( g, "X4", "U2" ) )
		

});

test('No children of X', t => {
	t.is( d.GraphTransformer.backDoorGraph(
			$p("pag{ {V2 V1} @-> X -> {V4 @-> Y} <- V3 @-> X X[e] Y[o]}")).
			getVertex("X").getChildren().length, 0 )
});

test('PAG back door and moral graph', t => {
	let g = $p("pag{ X @-> Y X[e] Y[o]}")
	t.is( $e( d.GraphTransformer.backDoorGraph(g) ),
		"X @-> Y")
	g = $p("pag{ X @-> Y  Y[o]}")
	t.is(  $e( d.GraphTransformer.ancestorGraph(g) ),
		"X @-> Y" )
	g = $p("pag{ X @-> Y X[e] Y[o]}")
	t.is(  $e( d.GraphTransformer.moralGraph(g) ),
		"X -- Y" )

});

test('can we count edges of a graph', t => {
	t.is( $p("dag{x->y}").getNumberOfEdges(), 1 )
})


