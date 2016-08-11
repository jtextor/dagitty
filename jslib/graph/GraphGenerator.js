/* This is a namespace containing various methods that generate graphs,
 * e.g. at random.*/
 
/* globals Graph	*/
/* exported GraphGenerator */

var GraphGenerator = {
	/**
	 * Generates a random DAG on the given variables. The topological
	 * ordering will reflect the given order of the variables.
	 * p is the probability that an edge will be created. If p=1, then
	 * the number of edges created will be maximal. It is advisable to
	 * scale p with 1/|V|. 
	 */
	randomDAG : function( variables, p){
		var pEdge = p, pSource = 0, pTarget = 0, pLatent = 0;
		if (typeof variables == "number" ) {
			var n = variables;
			variables = [];
			for (var i = 1; i <= n; i++) variables.push("v" + i);
		}
		if (typeof p == "object") {
			pEdge = p.pEdge;
			if (p.pSource) pSource = p.pSource;
			if (p.pTarget) pTarget = p.pTarget;
			if (p.pLatent) pLatent = p.pLatent;
		}
		var hasSource = false, hasTarget = false;
		var g = new Graph(), i, j
		var vertices = []; 
		for( i = 0 ; i < variables.length ; i ++ ){
			var v = g.addVertex( variables[i] )
			vertices.push(v);
			var q = Math.random();
			if (q < pSource) { g.addSource(v); hasSource = true; }
			else if (q < pSource + pTarget) { g.addTarget(v); hasTarget = true; }
			else if (q < pSource + pTarget + pLatent) g.addLatentNode(v);
		}
		function setProp(prop) {
			var i = Math.floor(Math.random() * vertices.length);
			for (var j = 0; j < vertices.length; j++ ) {
				if (!g.isSource(vertices[i]) && !g.isTarget(vertices[i]) && !g.isLatentNode(vertices[i])) {
					g[prop](vertices[i]);
					break;
				}
				i++;
				if (i >= vertices.length) i = 0;
			}
		}
		if (pSource && !hasSource) setProp("addSource");
		if (pTarget && !hasTarget) setProp("addTarget");
		
		for( i = 0 ; i < variables.length ; i ++ ){
			for( j = i+1 ; j < variables.length ; j ++ ){
				if( Math.random() < pEdge ){
					g.quickAddDirectedEdge( vertices[i], vertices[j] )
				}
			}
		}
		g.setType("dag")
		return g
	}
}
