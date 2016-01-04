/*
 * Grammar to parse the dagitty graph description language, which is based on the
 * graphviz dot/xdot language.
 *
 * The grammar is based on the abstract grammar defined here :
 * http://www.graphviz.org/content/dot-language
 *
 */

start
  = graph

graph
  = _ 'strict'i?  _ type:graphtype _ id:ID? _ '{' statements:stmt_list '}' _  {
  	return { type : type.toLowerCase(), name:id, statements:statements }
  }
  
graphtype
  = 'graph'i / 'digraph'i / 'dag'i / 'mag'i / 'pdag'i

subgraph 
  =  id:ID? _ '{' statements:stmt_list '}' {
	  return { type : 'subgraph', name:id, statements:statements }
  }

stmt_list
  = _ l:(hd:stmt _ ';'? _ tl:stmt_list? {return [hd].concat(tl||[]) })?  { return l }

stmt
  = edge_stmt / node_stmt / subgraph

edge_stmt
 = v:(node_id / subgraph) _ tl:edgeRHS _ a:attr_list? { 
   	if( a === null ){
  		a = {}
  	}
	return {type:'edge', content:[v].concat(tl), attributes:a} 
 }

edgeRHS
 = l:(a:edgeop _ v:(node_id / subgraph) more:( _ tl:edgeRHS {return tl} )? {return [a,v].concat(more||[]) } ) { return l }

node_stmt
  = id:node_id _ a:attr_list? { 
  	if( a === null ){
  		a = {}
  	}
  	return {type:'node', id:id, attributes:a} 
  }
  
attr_list
  = '[' _ a:a_list? _ ']' { return a }

a_list
  = k:ID _ v:('=' _ ID)? _ (';'/',')? _ tl:a_list? { 
	if( v === null ){ v = 1 }
	else{ v = v[2] }
	var r = [[k,v]]
	if( tl ) r = r.concat( tl )
	return r
  }

node_id
  = ID

edgeop
  = '->' / '--' / '<->' / '<-'

ID
 = BAREWORD / STRING

BAREWORD
  = id:[0-9a-zA-Z_.]+ { return id.join('') }

STRING
  = '"' '"' {return "";}
  / v:('"' chars ("\\" [\r\n]+ chars)? '"') rest:(_ '+' _ v:STRING {return v})? { return rest === null ? v[1] : (v[1] + rest); }

chars
  = chars:char+ { return chars.join(""); }

char
  = [^"\\\0-\x1F\x7F]
  / '\\"' { return '"'; }
  / '\\' [\n\r]+ { return ""; }
  / '\\' { return '\\'; }

_ 
  = [\n\r\t ] *
