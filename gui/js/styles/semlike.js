(function(){ 
	
var Base = {
	node : { 'd' : 'M [rx], 0 L [rx],[ry] L -[rx],[ry] L -[rx],-[ry] L [rx],-[ry] Z',
		stroke : "black", fill : "white", "stroke-width" : 1.5 },
	exposurenode : { 
		'd' : 'M [rx], 0 L [rx],[dy] L -[rx],[dy] L -[rx],-[ry] L [rx],-[ry] Z',
		fill : "#bed403", 
		stroke : "#000000" },
	outcomenode : { fill : "#00a2e0",
 		'd' : 'M [rx], 0 L [rx],[dy] L -[rx],[dy] L -[rx],-[ry] L [rx],-[ry] Z',
		stroke : "#000000" },
	adjustednode : { fill : "#cccccc",
		stroke : "#000000" },
	latentnode : { 
		'd' : 'M 0 0 m [rx], 0 a [rx],[ry] 0 1,1 -[dx],0 a [rx],[ry] 0 1,1 [dx],0', stroke : "black" },
	confoundernode : { fill : "#ff7777",
		stroke : "#ff7777" },
	anexposurenode : { fill : "#bed403",
		stroke : "#bed403" },
	anoutcomenode : { fill : "#00a2e0",
		stroke : "#00a2e0" },
	nodelabel : { y: 0, dy : ".3em", "text-anchor": "middle"  },
	nodelabelbg : { "fill" : "none", "stroke" : "none"  }, 
	path : { stroke : "black", "fill" : "none" },
	causalpath : { stroke : "green" },
	biasingpath : { stroke : "red" },
	puredirectpath_inactive : { "stroke-width": 3 },
}

var Decoration = {
	exposurenode : [ {d:"M-4,-6L7,0L-4,6Z", fill:"#000000", transform: "translate(0,18)" } ],
	outcomenode : [ {d:"M-2,-6L2,-6L2,6L-2,6Z", fill:"#000000", transform: "translate(0,18)" } ],
	directedpath : [
		{ 'class' : "arrowfront", 'd': "M-1.5,0L5,5M-1.5,0L5,-5" }
	],
	bidirectedpath : [
		{ 'class' : "arrowfront", 'd': "M-1.5,0L5,5M-1.5,0L5,-5" },
		{ 'class' : "arrowback", 'd': "M-1.5,0L5,5M-1.5,0L5,-5" }
	]
}

DAGitty.stylesheets.semlike = { style : Base, decoration : Decoration };
DAGitty.stylesheets.default = DAGitty.stylesheets.semlike

})();