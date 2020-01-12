(function(){ 
	
var Base = {
	node : { 'd' : 'M 0 0 m [rx], 0 a [rx],[ry] 0 1,1 -[dx],0 a [rx],[ry] 0 1,1 [dx],0', stroke : "black",
		stroke : "black", fill : "white", "stroke-width" : 1.5 },
	exposurenode : { "stroke-width" : 4 },
	outcomenode : { "stroke-width" : 4 },
	adjustednode : { },
	latentnode : { },
	confoundernode : { },
	anexposurenode : { },
	anoutcomenode : { },
	nodelabel : { y: 0, dy : ".3em", "text-anchor": "middle"  },
	nodelabelbg : { "fill" : "none", "stroke" : "none"  }, 
	path : { stroke : "gray", "fill" : "none" },
	causalpath : { stroke : "green" },
	biasingpath : { stroke : "red" }
}

var Decoration = {
	directedpath : [
		{ 'class' : "arrowfront", 'd': "M-1.5,0L5,5M-1.5,0L5,-5" }
	],
	bidirectedpath : [
		{ 'class' : "arrowfront", 'd': "M-1.5,0L5,5M-1.5,0L5,-5" },
		{ 'class' : "arrowback", 'd': "M-1.5,0L5,5M-1.5,0L5,-5" }
	]
}
DAGitty.stylesheets.semlikePlain = { style : Base, decoration : Decoration };
DAGitty.stylesheets.default = DAGitty.stylesheets.semlikePlain
})();
