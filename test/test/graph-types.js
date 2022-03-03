
const {Graph, GraphTransformer} = require("../../jslib/dagitty-node.js")
const _ = require("underscore")

QUnit.module( "dagitty" )
QUnit.test( "graph types", function( assert ) {
	var graphs = {
		graph : new Graph( "graph { x -- y -- z }" ),
		dag : new Graph( "dag { x -> y -> z }" ),
		pdag : new Graph( "pdag { x -- y -> z }" ),
		mag : new Graph( "mag { x <-> y -> z }" )
	};
	
	_.each( Object.keys(graphs), function(t){
		assert.equal( GraphTransformer.inducedSubgraph(graphs[t],
			graphs[t].getVertex(["x","y"])).getType(), t )
	});

	_.each( Object.keys(graphs), function(t){
		assert.equal( GraphTransformer.edgeInducedSubgraph(graphs[t],
			graphs[t].edges).getType(), t )
	});
	
	_.each( Object.keys(graphs), function(t){
		assert.equal( GraphTransformer.ancestorGraph(graphs[t],
			graphs[t].getVertex(["x","y"])).getType(), t )
	});

	_.each( ["backDoorGraph","indirectGraph","activeBiasGraph"], function(f){
		_.each( Object.keys(graphs), function(t){
			assert.equal( GraphTransformer[f](graphs[t],
				graphs[t].getVertex(["x"]),graphs[t].getVertex(["z"])).getType(), t )
		})
	});
	
	_.each( Object.keys(graphs), function(t){
		assert.equal( GraphTransformer.canonicalDag(graphs[t]).g.getType(), "dag" )
	});

	_.each( ["moralGraph","skeleton"], function(f){
		_.each( Object.keys(graphs), function(t){
			assert.equal( GraphTransformer[f](graphs[t]).getType(), "graph" )
		});
	});

});

