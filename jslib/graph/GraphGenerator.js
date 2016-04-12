/* This is a namespace containing various methods that generate graphs,
 * e.g. at random.*/
 
/* globals Graph  */
/* exported GraphGenerator */

var GraphGenerator = {
	/**
	 * Generates a random DAG on the given variables. The topological
	 * ordering will reflect the given order of the variables.
	 * p is the probability that an edge will be created. If p=1, then
	 * the number of edges created will be maximal. It is advisable to
	 * scale p with 1/|V|. 
	 */
	randomDAG : function( variables, p ){
		var g = new Graph(), i, j
		for( i = 0 ; i < variables.length ; i ++ ){
			g.addVertex( variables[i] )
		}
		for( i = 0 ; i < variables.length ; i ++ ){
			for( j = i+1 ; j < variables.length ; j ++ ){
				if( Math.random() < p ){
					g.addEdge( variables[i], variables[j] )
				}
			}
		}
		g.setType("dag")
		return g
	}
}
