/** 
    This namespace contains functions that parse a graph structure from text.
    Three different formats are supported, but two of them for legacy reasons
    only. The most modern format is a dot-like format, in which a graph looks
    something like this:

    graph {
	X [exposure]
	X [outcome]
	X <- A -> M <- B -> Y
	X -> Y
	X <- M -> Y
	A <-> B
    }
*/

/* jshint undef: true, unused: true, asi: true */
/* globals Graph */
/* exported GraphParser */

var GraphParser = {
	/**
		This is work in progress ... not safe to use yet.
		For the time being, edge statements are assumed to come line 
		by line.
	*/
	parseDot : function( code ){
		'use strict'
		var isdot = code.match(  /^\s*(di)?graph(\s+\w+)?\s*\{([\s\S]+)\}/m )
		var edgestatements = isdot[isdot.length-1]
		var txt = edgestatements.trim()
		var lines = txt.split(/[\n;]/)
		
		var vertexnamere = new RegExp( '^[+%0-9A-Za-z*-._~]+' )
		var optionnamere = new RegExp( '^([a-z]+)\\s*(=)?\\s*("[^"]+")?' )
		var edgetypere = new RegExp( '^<?--?>?' )
		var positionre = new RegExp( '"\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*"' )
		var labelre = new RegExp( '"\\s*([^"]+)\\s*"' )
		
		var parse_position = function( s ){
			tok = s.match(positionre)
			if( typeof tok[1] !== "string" || 
				typeof tok[2] !== "string" ){
				throw('Syntax error in "pos" option')
			}
			return {x:parseFloat(tok[1]),y:parseFloat(tok[2])}
		}
		
		var g = new Graph()
		var i,j,n,n2,e
		
		for( i = 0 ; i < lines.length ; i ++ ){
			var l = lines[i].trim()
			var parser_mode = 0
			var vertex_names = [], 
				edgetypes = [], option_names=[], option_values=[], 
				tok = "", match, pos
			while( l.length > 0 && parser_mode >= 0 ){
				switch( parser_mode ){
				case 0: // expecting vertex ID
					tok = l.match(vertexnamere)
					if( tok === null || tok[0].length === 0 ){
						throw('Syntax error: expecting vertex ID at line '+i)
					}
					tok = tok[0]
					vertex_names.push( tok )
					parser_mode = 1
					l = l.substring( tok.length )
					break
				case 1: // expecting either option or edgetype
					if( l.substring(0,1) == "[" ){
						parser_mode = 2
						l = l.substring( 1 )
					} else {
						tok = l.match( edgetypere )
						if( tok === null ){
							throw('Syntax error: expecting edge type at line '+i)
						}
						edgetypes.push( tok[0] )
						parser_mode = 0
						l = l.substring( tok[0].length )
					}
					break
				case 2: // inside option
					if( l.substring(0,1) == "]" ){
						parser_mode = -1 // finished
						l = l.substring( 1 )
					} else if( l.substring(0,1) == "," ){
						l = l.substring( 1 )
					} else {
						match = l.match( optionnamere )
						if( match === null ){
							throw('Syntax error! Expection option at line '+i)
						}
						if( match[1] ){
							option_names.push(match[1])
							option_values.push(match[3])
						}
						l = l.substring( match[0].length )
					}
					break
				}
				l = l.trim()
			}
			if( vertex_names.length == 1 ){
				// vertex statement
				tok = decodeURIComponent( vertex_names[0] )
				n = g.getVertex( tok ) || g.addVertex( tok )
				for( j = 0 ; j < option_names.length ; j ++ ){
					switch( option_names[j] ){ // string-only options
					case "latent":
						g.addLatentNode( n )
						break
					case "source":
					case "exposure":
						g.addSource( n )
						break
					case "target":
					case "outcome":
						g.addTarget( n )
						break
					case "adjusted":
						g.addAdjustedNode( n )
						break
					case "pos":
						if( typeof option_values[j] !== "string" ){
							throw('Syntax error pos statement')
						}
						pos = parse_position( option_values[j] )
						n.layout_pos_x = parseFloat( pos.x )
						n.layout_pos_y = parseFloat( pos.y )
						break
					}
				}
			} else {
				while( vertex_names.length >= 2 && edgetypes.length >= 1 ){
					n = decodeURIComponent( vertex_names[0] )
					n2 = decodeURIComponent( vertex_names[1] )
					if( !g.getVertex( n ) ) g.addVertex( n )
					if( !g.getVertex( n2 ) ) g.addVertex( n2 )
					switch( edgetypes[0] ){
					case '--' :
						e = g.addEdge( n, n2, Graph.Edgetype.Undirected )
						break
					case '<->' :
						e = g.addEdge( n, n2, Graph.Edgetype.Bidirected )
						break
					case '->' :
						e = g.addEdge( n, n2, Graph.Edgetype.Directed )
						break
					case '<-' :
						e = g.addEdge( n2, n, Graph.Edgetype.Directed )
						break
					}
					vertex_names.shift()
					edgetypes.shift()
				}
				for( j = 0 ; j < option_names.length ; j ++ ){
					switch( option_names[j] ){ // string-only options
					case "pos":
						if( typeof option_values[j] !== "string" ){
							throw('Syntax error pos statement')
						}
						pos = parse_position( option_values[j] )
						e.layout_pos_x = parseFloat( pos.x )
						e.layout_pos_y = parseFloat( pos.y )
						break
					case "label":
						if( typeof option_values[j] !== "string" ){
							throw('Syntax error label statement')
						}
						e.id = decodeURIComponent( option_values[j].match(labelre)[1] )
						break
					}
				}
			}
		}
		return g
	},

	parseVertexLabelsAndWeights : function( vertexLabelsAndWeights ){
		'use strict'
		var g = new Graph()
		var txt = vertexLabelsAndWeights.trim()
		var lines = txt.split(/\n/)
		var i,weight,posn
		for( i = 0 ; i < lines.length ; i ++ ){
			var l = lines[i]
			var a = l.trim().split(/\s+/)
			lines[i]=[]
			if( a.length >= 2 && l.indexOf("@") >= 0 ){
				lines[i][2]=a.pop()
				lines[i][1]=a.pop()
				lines[i][0]=a.join(" ")
			} 
			else if( a.length >= 2 ){
				lines[i][1]=a.pop()
				lines[i][0]=a.join(" ")
			}
			else if( a.length == 1 ){
				lines[i][1]="1"
				lines[i][0]=a.pop()
			}
		}
		for( i = 0 ; i<lines.length ; i ++ ){
			var vid = decodeURIComponent(lines[i][0])
			var props = lines[i][1]
			// TODO weights do not currently mean anything!
			weight = parseInt(props,10)||1
			g.addVertex( new Graph.Vertex( 
				{ id : vid, weight : weight } ) )
			if( props.indexOf("E")>=0 ){
				g.addSource( vid )
			}
			if( props.indexOf("O")>=0 ){
				g.addTarget( vid )
			}
			if( props.indexOf("A")>=0 ){
				g.addAdjustedNode( vid )
			}
			if( props.indexOf("U")>=0 ){
				g.addLatentNode( vid )
			}
			if( lines[i].length == 3 ){
				posn = lines[i][2].substring(1).split(",")
				g.getVertex( vid ).layout_pos_x = parseFloat(posn[0])
				g.getVertex( vid ).layout_pos_y = parseFloat(posn[1])
			}
		}
		return g
	},
  
	parseAdjacencyList : function( adjacencyList, vertexLabelsAndWeights ){
		'use strict'
		var g = this.parseVertexLabelsAndWeights( vertexLabelsAndWeights )
		var adj_list = adjacencyList.split("\n")
		var i,adj,v1, v1id, v2,v2id
		for( i = 0 ; i < adj_list.length ; i ++ ){
			adj = adj_list[i].trim().split(/\s+/)
			v1 = false; v1id = ""
			while( adj.length > 0 && !v1 ){
				v1id += adj.shift()
				v1 = g.getVertex( decodeURIComponent(v1id) )
				v1id += " "
			}
			while( adj.length > 0 ){
				v2 = false; v2id = ""
				while( adj.length > 0 && !v2 ){
					v2id += adj.shift()
					v2 = g.getVertex( decodeURIComponent(v2id) )
					v2id += " "
				}
				if( v2 ){
					var eold = g.getEdge( v2, v1, Graph.Edgetype.Directed )
					if( eold ){
						g.deleteEdge( v2, v1, Graph.Edgetype.Directed )
						var enew = g.addEdge( v1, v2, Graph.Edgetype.Bidirected )
						if( eold.layout_pos_x && !enew.layout_pos_x ){
							enew.layout_pos_x = eold.layout_pos_x
							enew.layout_pos_y = eold.layout_pos_y
						}
					} else {
						g.addEdge( v1, v2 )
					}
					if( adj.length > 0 && adj[0].charAt(0) == "@" ){
						var e = g.getEdge( v1, v2 )
						var coord_a = adj.shift().substring(1).split(",")
						if( coord_a.length >= 2 ){
							e.layout_pos_x = parseFloat( coord_a[0] )
							e.layout_pos_y = parseFloat( coord_a[1] )
						}
					}
				}
			}
		}
		return g
	},

	parseAdjacencyMatrix : function( adjacencyMatrix, vertexLabelsAndWeights ){
		'use strict'
		var g = this.parseVertexLabelsAndWeights( vertexLabelsAndWeights )

		var m = adjacencyMatrix.trim()
		var m_arr = m.split(/\s+/)
		var n = Math.sqrt( m.split(/\s+/).length )
		var l, l_arr, i, j

		if( parseInt( n, 10 ) !== n || n !== g.getNumberOfVertices()){
			throw( "Error loading data: Adjacency matrix is not square or does not match number of vertices: "+n+" , " +g.getNumberOfVertices() )
		}

		l = vertexLabelsAndWeights.trim()
		l_arr = l.split("\n")
		for( i = 0 ; i < l_arr.length ; i++ ){
			l_arr[i] = l_arr[i].trim().split(/\s+/)
		}

		for( i = 0 ; i <n ; i ++ ){
			for( j = 0 ; j <n ; j ++ ){
				if( parseInt( m_arr[i*n+j], 10 ) > 0 ){
					g.addEdge( l_arr[i][0], l_arr[j][0] )
				}
			}
		}
		return g
	},

	parseGuess : function( adjacencyListOrMatrix, vertexLabelsAndWeights ){
		'use strict'
		var first_blank, firstarg = adjacencyListOrMatrix
		if( !vertexLabelsAndWeights ){
			first_blank = adjacencyListOrMatrix.search( /\r?\n[ \t]*\r?\n/ )
			vertexLabelsAndWeights = adjacencyListOrMatrix.substr( 0, first_blank ).trim()
			adjacencyListOrMatrix = adjacencyListOrMatrix.substr( first_blank ).trim()
		}
		if( adjacencyListOrMatrix.match( /^[\s01]+$/ ) !== null ){
			return this.parseAdjacencyMatrix( adjacencyListOrMatrix, vertexLabelsAndWeights )
		} else {
			// [\s\S] is like . but also matches newline!
			var isdot = firstarg.match(  /^\s*(di)?graph(\s+\w+)?\s*\{([\s\S]+)\}/m )
			if( isdot && isdot.length > 1 ){
				return this.parseDot( firstarg )
			} else {
				return this.parseAdjacencyList( adjacencyListOrMatrix, vertexLabelsAndWeights )
			}
		}
	}
}
