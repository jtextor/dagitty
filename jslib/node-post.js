
// GraphDotParsers is assigned already here by IFE

global.Class = module.exports.Class
global.GraphDotParser = module.exports.GraphDotParser

module.exports = Object.assign( module.exports, {
	Graph: Graph,
	GraphAnalyzer: GraphAnalyzer,
	GraphParser: GraphParser,
	GraphTransformer: GraphTransformer,
	GraphSerializer : GraphSerializer,
	MPoly : MPoly
} )


