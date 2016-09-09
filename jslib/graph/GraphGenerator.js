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
	 * p can also be an object with entries { p.Edge, ... } where ... are
	 * parameters for the setRandomNodes function (see below)
	 */
	randomDAG : function( variables, p){
		var i, j
		if (typeof variables == "number" ) {
			var n = variables
			variables = []
			for (i = 1; i <= n; i++) variables.push("v" + i)
		}
		var g = new Graph()
		var vertices = [] 
		for( i = 0 ; i < variables.length ; i ++ ){
			var v = g.addVertex( variables[i] )
			vertices.push(v)
		}
		
		var pEdge = p
		if (typeof p == "object") {
			pEdge = p.pEdge
			this.setRandomNodes(g, p)
		}
		for( i = 0 ; i < variables.length ; i ++ ){
			for( j = i+1 ; j < variables.length ; j ++ ){
				if( Math.random() < pEdge ){
					g.quickAddDirectedEdge( vertices[i], vertices[j] )
				}
			}
		}
		g.setType("dag")
		return g
	},
	
	
	/**
	 * Marks nodes as source, target or latentnode.
	 * Parameter pSource is the probability of a node becoming a source node, 
	 * minSource and maxSource the minimum and maximum count of these nodes.
	 * pTarget, minTarget, maxTarget, pLatentNode, minLatentNode, maxLatentNode control the creation of other node types.
	*/
	setRandomNodes: function (g, p) {
		var i, j, k
		var vertices = g.vertices.values()
		var prop = ["Source", "Target", "LatentNode"]
		for (i=0;i<prop.length;i++) g["removeAll"+prop[i]+"s"]()
		for (i=0,j=1,k=2;i<prop.length;i++,j++,k++) {
			if (j >= prop.length) j = 0
			if (k >= prop.length) k = 0
			var minOthers = (p["min"+prop[j]] ? p["min"+prop[j]] : 0) + (p["min"+prop[k]] ? p["min"+prop[k]] : 0)
			if (!(("max" + prop[i])  in p) || (p["max"+prop[i]] > vertices.length - minOthers ))
				p["max"+prop[i]] = vertices.length - minOthers
		}
		var pSource = p.pSource ? p.pSource : 0, 
			pTarget = p.pTarget ? p.pTarget : 0, 
			pLatentNode = p.pLatentNode ? p.pLatentNode : 0
		var maxSource = p.maxSource ? p.maxSource : vertices.length,
			maxTarget = p.maxTarget ? p.maxTarget : vertices.length,
			maxLatentNode = p.maxLatentNode ? p.maxLatentNode : vertices.length
		
		var counts = {"Source": 0, "Target": 0, "LatentNode": 0}
		var availableVertices = []
		for (i=0;i<vertices.length;i++) {
			var v = vertices[i]
			var q = Math.random()
			var kind = null
			if (q < pSource) { if (counts.Source < maxSource) kind = "Source" }
			else if (q < pSource + pTarget) { if (counts.Target < maxTarget) kind = "Target" }
			else if (q < pSource + pTarget + pLatentNode) { if (counts.LatentNode < maxLatentNode) kind = "LatentNode" }
			if (kind)	{
				g["add" + kind](v) 
				counts[kind]++ 
			} else availableVertices.push(v)
		}
		for (i=0;i<prop.length;i++) {
			if (!p["min"+prop[i]]) continue
			for (var existing = counts[prop[i]]; existing < p["min"+prop[i]]; existing++) {
				if (availableVertices.length == 0) throw "no available vertices"
				j = Math.floor(Math.random() * availableVertices.length)
				g["add"+prop[i]](availableVertices[j])
				availableVertices.splice(j, 1)
			}
		} 
	}
}
