/*
 * Grammar to parse the dagitty graph description language, which is based on the
 * graphviz dot/xdot language.
 *
 * The grammar is based on the abstract grammar defined here :
 * http://www.graphviz.org/content/dot-language
 *
 * TODO add proper support for multiline strings.
 *
 */

start
  = graph

graph
  = _ 'strict'i? _ type:GRAPHTYPE name:id? '{' _ statements:stmt_list '}' _  {
  	return { type : type.toLowerCase(), name:name, statements:statements }
  }

subgraph 
  =  name:id? '{' _ statements:stmt_list '}' _ {
	  return { type : 'subgraph', name:name, statements:statements }
  }

stmt_list
  = l:(hd:stmt (';' _)? tl:stmt_list? {return [hd].concat(tl||[]) })?  { return l }

stmt
  =  globaloption / edge_stmt / node_stmt / subgraph

globaloption
  = a:id '=' _ b:id { 
  	return { type:'node', id:'graph', attributes:[[a,b]] }
  } 

edge_stmt
 = v:(id / subgraph) tl:edgeRHS  a:attr_list? { 
   	if( a === null ){
  		a = []
  	}
	return {type:'edge', content:[v].concat(tl), attributes:a} 
 }

edgeRHS
 = l:(a:EDGE v:(id / subgraph) more:( tl:edgeRHS {return tl} )? {
 	return [a,v].concat(more||[]) } ) { return l }

node_stmt
  = name:id a:attr_list? { 
  	if( a === null ){
  		a = {}
  	}
  	return {type:'node', id:name, attributes:a} 
  }
  
attr_list
  = '[' _ a:a_list? ']'_  { return a }

a_list
  = k:id v:('=' _ id) ? (';' / ',')? _ tl:a_list? { 
	if( v === null ){ v = 1 }
	else{ v = v[2] }
	var r = [[k,v]]
	if( tl ) r = r.concat( tl )
	return r
  }

EDGE
  = e:( '@->' / '<-@' / '->' / '--@' / '--' / '<->' / '<-' / '@-@' / '@--' ) _ { return e }
  
GRAPHTYPE
  = t:( 'graph'i / 'digraph'i  / 'dag'i  / 'mag'i / 'pdag'i / 'pag'i ) _ { return t }

id
 = BAREWORD / STRING

BAREWORD
  = id:[0-9a-zA-Z_.]+ _ { return id.join('') }

STRING
  = '"' '"' _ {return "";}
  / v:('"' chars ("\\" [\r\n]+ chars)? '"' _ ) rest:('+' _ v:STRING {return v})? 
  	{ return rest === null ? v[1] : (v[1] + rest); }

chars
  = chars:char+ { return chars.join(""); }

char
  = [^"\\\0-\x1F\x7F]
  / '\\"' { return '"'; }
  / '\\' [\n\r]+ { return ""; }
  / '\\' { return '\\'; }

_ 
  = [\n\r\t ] *
