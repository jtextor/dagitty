(function(){ 
DAGitty.stylesheets.original = {
			style : {
				node : {
					'd' : 'M 0 0 m 20, 0 a 20,15 0 1,1 -40,0 a 20,15 0 1,1 40,0',
					fill: "#aaaaaa",
					stroke : "#666666",
				},
				exposurenode : { fill : "#bed403", stroke : "#000000" },
				outcomenode : { fill : "#00a2e0", stroke : "#000000" },
				adjustednode : { fill : "#ffffff", stroke : "#000000" },
				selectednode : { 'd' : 'M  20, 0 L 20,15 L -20,15 L -20,-15 L 20,-15 Z' },
				latentnode : {  fill : "#dddddd", stroke: "#aaaaaa" /*"stroke-dasharray" : "5,5" */},
				confoundernode : { fill : "#ff7777", stroke : "#ff7777" },
				anexposurenode : { fill : "#bed403", stroke : "#bed403" },
				anoutcomenode : { fill : "#00a2e0", stroke : "#00a2e0" },
				nodelabel : { y: 35, "text-anchor" : "middle" },
				nodelabelbg : { fill: "#ffffff" },
				path : { stroke : "black", "stroke-width": 1.5, fill : "none" },
				causalpath : { stroke : "#4dac26" },
				biasingpath : { stroke : "#d01c8b" },
				puredirectpath_inactive : { "stroke-width": 3 }
			},
			decoration : {
				exposurenode : [ {d:"M-4,-6L7,0L-4,6Z", fill:"#000000"} ],
				outcomenode : [ {d:"M-2,-6L2,-6L2,6L-2,6Z", fill:"#000000"} ],
				directedpath : [ { 'class' : "arrowfront", 'd': "M-1,0L15,5L15,-5Z", fill : "white" } ],
				bidirectedpath : [
					{ 'class' : "arrowfront", 'd': "M-1,0L15,5L15,-5Z", fill : "white" },
					{ 'class' : "arrowback", 'd': "M-1,0L15,5L15,-5Z", fill : "white" }
				]
			}
	};
	DAGitty.stylesheets.default = DAGitty.stylesheets.original
})();
