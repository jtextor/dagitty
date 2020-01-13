(function(){ 
	
var Base = {
	node : { 'd' : 'M 0 0 m [rx], 0 a [rx],[ry] 0 1,1 -[dx],0 a [rx],[ry] 0 1,1 [dx],0', stroke : "black",
		stroke : "black", fill : "white", "stroke-width" : 1.5 },
	exposurenode : { "stroke-width" : 2.5 },
	outcomenode : { "stroke-width" : 2.5 },
	adjustednode : { fill : "#ddd" },
	latentnode : { stroke : "#eee", fill: "#f3f3f3" },
	confoundernode : { },
	anexposurenode : { },
	anoutcomenode : { },
	nodelabel : { y: 0, dy : ".3em", "text-anchor": "middle"  },
	nodelabelbg : { "fill" : "none", "stroke" : "none"  }, 
	path : { stroke : "gray", "fill" : "none" },
	causalpath : { },
	biasingpath : { }
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
