
/** START UMD boilerplate */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        const {GraphParser,Graph} = require('../jslib/dagitty-node.js')
		const examples = require('../gui/js/example-dags.js')
        module.exports = factory({GraphParser:GraphParser, Graph:Graph, examples:examples})
    } else {
        // Browser globals (root is window)
        root.TestGraphs = factory({GraphParser:root.GraphParser, Graph:root.Graph, examples:root.examples});
    }
}(typeof self !== 'undefined' ? self : this, function (dagitty) {
    // Use b in some fashion.
	let GraphParser = dagitty.GraphParser
	let Graph = dagitty.Graph
	let examples = dagitty.examples

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {
/** END UMD boilerplate */

findExample : function( s ){
  for( var i = 0 ; i < examples.length ; i++ ){
    if( examples[i].l.toLowerCase().indexOf(s.toLowerCase()) >= 0 ){
		if( "e" in examples[i] ){
	    	return GraphParser.parseGuess(examples[i].e,examples[i].v)
		} else {
	    	return GraphParser.parseGuess(examples[i].d)
		}
    }
  }
},

felixadjust : GraphParser.parseGuess("s1 1 @0.266,0.802\n"+
"s2 1 @0.457,0.811\n"+
"s3 1 @0.645,0.822\n"+
"x E @0.170,0.716\n"+
"y O @0.891,0.765\n"+
"z A @0.379,0.898\n"+
"z2 1 @0.585,0.898\n"+
"\n"+
"s1 s2 z\n"+
"s2 s3 z2\n"+
"s3 y\n"+
"x y s1\n"),

amsterdam : function(){
return GraphParser.parseGuess("A 1 @-2.122,0.138\n"+
"D 1 @2.122,0.096\n"+
"E 1 @0.066,1.056\n"+
"Z 1 @-0.004,0.336\n"+
"\n"+
"A E Z\n"+
"E D\n"+
"Z E D\n");
},

commentator1 : function(){
return GraphParser.parseGuess("X 1 @0.225,0.067\n"+
"Y 1 @0.785,0.068\n"+
"A U @0.474,-0.094\n"+
"B U @0.020,0.002\n"+
"C U @1.012,0.002\n"+
"V 1 @0.482,-0.034\n"+
"W1 1 @0.205,-0.065\n"+
"W2 1 @0.802,-0.060\n"+
"Z1 1 @0.213,0.006\n"+
"Z2 1 @0.809,0.001\n"+
"\n"+
"A W2 W1\n"+
"B W1 X\n"+
"C Y W2\n"+
"V Z1 Z2\n"+
"W1 Z1\n"+
"W2 Z2\n"+
"X Y\n"+
"Z1 X\n"+
"Z2 Y");
},

commentator2: function() {
return GraphParser.parseGuess( "X 1 @0.207,0.048\n"+
"Y 1 @0.828,0.051\n"+
"U U @0.504,-0.050\n"+
"V 1 @0.481,-0.090\n"+
"W1 1 @0.283,-0.025\n"+
"W2 1 @0.711,-0.024\n"+
"Z1 1 @0.015,-0.047\n"+
"Z2 1 @0.988,-0.050\n"+
"\n"+
"U W1 W2\n"+
"V Z2 Z1\n"+
"W1 Z1 X Y\n"+
"W2 Y Z2 X\n"+
"X Y\n"+
"Z1 X\n"+
"Z2 Y");
},

big1: function(){

return GraphParser.parseGuess("S E @0.395,0.046\n"+
"T O @0.715,0.039\n"+
"a 1 @0.418,-0.028\n"+
"b 1 @0.106,-0.036\n"+
"c 1 @0.339,-0.004\n"+
"d 1 @0.975,-0.010\n"+
"e 1 @0.278,-0.041\n"+
"f 1 @0.159,-0.016\n"+
"g 1 @0.858,-0.042\n"+
"h 1 @0.544,0.017\n"+
"i 1 @0.757,0.010\n"+
"i4 1 @0.900,0.050\n"+
"j 1 @0.837,-0.011\n"+
"m 1 @0.692,-0.024\n"+
"n 1 @0.128,0.029\n"+
"o 1 @0.470,0.076\n"+
"p 1 @0.540,0.096\n"+
"q 1 @0.605,0.076\n"+
"x 1 @0.198,0.075\n"+
"y 1 @0.521,0.054\n"+
"z 1 @0.830,0.075\n"+
"\n"+
"S T\n"+
"a h c T\n"+
"b e f\n"+
"d j i\n"+
"e a f\n"+
"f n\n"+
"g d m j\n"+
"h T S\n"+
"i h T\n"+
"i4 p\n"+
"m j i\n"+
"n c S\n"+
"o y q\n"+
"p q o\n"+
"q y\n"+
"x S o p\n"+
"z T q p\n");
},

small_mixed : function(){
   var g = new Graph();
   g.addVertex( new Graph.Vertex( {id:"a"} ) );
   g.addVertex( new Graph.Vertex( {id:"b"} ) );
   g.addVertex( new Graph.Vertex( {id:"c"} ) );
   g.addVertex( new Graph.Vertex( {id:"d"} ) );
   g.addVertex( new Graph.Vertex( {id:"e"} ) );
   g.addVertex( new Graph.Vertex( {id:"f"} ) );

   g.addEdge( "c", "d" )
   g.addEdge( "a", "b", Graph.Edgetype.Undirected )
   g.addEdge( "b", "c", Graph.Edgetype.Undirected )
   g.addEdge( "a", "c", Graph.Edgetype.Undirected )
   g.addEdge( "d", "e", Graph.Edgetype.Undirected )
   g.addEdge( "d", "f", Graph.Edgetype.Undirected )
   g.addEdge( "e", "f", Graph.Edgetype.Undirected )
   return g;
},

small5 : function(){
  return GraphParser.parseGuess("T E\n"+
    "I O\n"+
    "A 1\n"+
    "U 1\n"+
    "\n"+
    "A I\n"+
    "T A\n"+
    "U A I\n");
},

small4 : function(){
  return GraphParser.parseGuess("T E\n"+
    "I O\n"+
    "A 1\n"+
    "G 1\n"+
    "K 1\n"+
    "\n"+
    "A G T\n"+
    "G K\n"+
    "K I\n"+
    "T K");
},

small3 : function(){
  return GraphParser.parseGuess("S 1 @0.420,0.025\n"+
"T 1 @0.689,0.029\n"+
"p 1 @0.567,0.085\n"+
"x 1 @0.287,0.069\n"+
"z 1 @0.801,0.073\n"+
"\n"+
"S T\n"+
"x S p\n"+
"z T p\n");
},

small2 : function(){
    var g = new Graph();
    ["s","t","a","b","c","g"].forEach(function(vid){
       g.addVertex( new Graph.Vertex({id:vid}) );
    });
    [
      ["a","b"],
      ["a","s"],
      ["b","t"],
      ["b","s"],
      ["c","t"],
      ["c","b"],
      ["g","c"],
      ["g","s"] ].forEach(function( e ){
        g.addEdge( e[0], e[1] );
      });
    g.addAdjustedNode("b");
    g.addSource(g.getVertex("s"));
    g.addTarget(g.getVertex("t"));
    return g;
},

small1 : function(){
   var g = new Graph();
   g.addVertex( new Graph.Vertex( {id:"S"} ) );
   g.addVertex( new Graph.Vertex( {id:"T"} ) );
   g.addVertex( new Graph.Vertex( {id:"A"} ) );
   
   g.addSource( g.getVertex("S") );
   g.addTarget( g.getVertex("T") );
   
   g.addEdge( "S", "T" );
   g.addEdge( "A", "S" );
   return g;
},

intermediate_adjustment_graph : function(){
   var g = new Graph();
   g.setType("dag");
   ["X","Y","Z","I"].forEach(function(v){
      g.addVertex( new Graph.Vertex( {id:v} ) );
   });

   g.addSource( g.getVertex("X") );
   g.addTarget( g.getVertex("Y") );

   [ 
      ["X","Y"],
      ["X","I"],
      ["I","Y"],
      ["Z","X"],
      ["Z","I"]
   ].forEach( function(e) {
      g.addEdge( e[0], e[1] ); 
   } );

   return g;
},

confounding_triangle : function(){
   var g = new Graph();
   g.addVertex( new Graph.Vertex( {id:"A"} ) );
   g.addVertex( new Graph.Vertex( {id:"B"} ) );
   g.addVertex( new Graph.Vertex( {id:"C"} ) );
   
   g.addSource( g.getVertex("A") );
   g.addTarget( g.getVertex("B") );
   
   g.addEdge( "A", "B" )
   g.addEdge( "C", "B" )
   g.addEdge( "C", "A" )   
   
   return g;
},

extended_confounding_triangle : function(){
   var g = new Graph();
   g.addVertex( new Graph.Vertex( {id:"A"} ) );
   g.addVertex( new Graph.Vertex( {id:"B"} ) );
   g.addVertex( new Graph.Vertex( {id:"C"} ) );
   g.addVertex( new Graph.Vertex( {id:"D"} ) );
   g.addVertex( new Graph.Vertex( {id:"E"} ) );

   g.addSource( g.getVertex("A") );
   g.addTarget( g.getVertex("B") );
   
   g.addEdge( "A","B" )
   g.addEdge( "C","B" )
   g.addEdge( "C","A" )
   g.addEdge( "D","C" )
   g.addEdge( "E","C" )
   g.addEdge( "D","A" )
   g.addEdge( "E","B" )
   
   return g;
},

cyclic_graph : function(){
   var g = new Graph();
   g.addVertex( new Graph.Vertex( {id:"A"} ) );
   g.addVertex( new Graph.Vertex( {id:"B"} ) );
   g.addVertex( new Graph.Vertex( {id:"C"} ) );
   
   g.addSource( g.getVertex("A") );
   g.addTarget( g.getVertex("B") );
   
   g.addEdge( "A","B" )
   g.addEdge( "B","C" )
   g.addEdge( "C","A" )   
   return g;
},

m_bias_graph : function(){
   var g = new Graph();
   g.setType("dag");
   g.addVertex( new Graph.Vertex( {id:"A"} ) );
   g.addVertex( new Graph.Vertex( {id:"B"} ) );
   g.addVertex( new Graph.Vertex( {id:"M"} ) );
   g.addVertex( new Graph.Vertex( {id:"U1"} ) );
   g.addVertex( new Graph.Vertex( {id:"U2"} ) );
   g.addEdge( "A","B" )
   g.addEdge( "U1","A" )
   g.addEdge( "U1","M" )
   g.addEdge( "U2","M" )
   g.addEdge( "U2","B" )
   g.addSource( g.getVertex("A") );
   g.addTarget( g.getVertex("B") );
   return g;
},

confounding_triangle_with_irrelevant_nodes : function(){
   var g = new Graph();
   g.setType("dag");
   g.addVertex( new Graph.Vertex( {id:"A"} ) );
   g.addVertex( new Graph.Vertex( {id:"B"} ) );
   g.addVertex( new Graph.Vertex( {id:"M"} ) );
   g.addVertex( new Graph.Vertex( {id:"U1"} ) );
   g.addVertex( new Graph.Vertex( {id:"U2"} ) );
   g.addEdge( "M","A" )
   g.addEdge( "M","B" )
   g.addEdge( "U1","M" )
   g.addEdge( "U2","M" )
   g.addSource( g.getVertex("A") );
   g.addTarget( g.getVertex("B") );
   return g;
},

very_large_dag : function(){
  return GraphParser.parseGuess("E E @-2.207,1.660\n"+
"D O @1.392,1.693\n"+
"Genetische 1 @1.407,0.537\n"+
"Etnische 1 @0.998,-0.542\n"+
"Begleiterkrankungen 1 @0.741,1.374\n"+
"RauchenMutter 1 @1.157,-1.311\n"+
"RauchenAnderer 1 @0.437,-1.094\n"+
"Stillen 1 @-0.882,-1.234\n"+
"Schwangerschaft 1 @-1.976,-1.488\n"+
"DiätMutter 1 @-1.398,-1.345\n"+
"Darmflora 1 @-1.258,-0.291\n"+
"Hausstaub 1 @-0.298,-0.735\n"+
"Haustiere 1 @-1.971,-0.883\n"+
"AllergischeSensibilisierung 1 @0.465,-0.194\n"+
"Allergenexposition 1 @-1.286,0.327\n"+
"Impfungen 1 @-1.840,0.060\n"+
"VitD 1 @-2.241,-0.014\n"+
"Infektionen 1 @-0.857,1.120\n"+
"Erregerexposition 1 @-0.442,0.736\n"+
"Geburtsmodus 1 @-0.019,0.438\n"+
"Geburtsort 1 @-0.718,1.393\n"+
"Geschwister 1 @-0.186,1.143\n"+
"BetreuungKind 1 @0.700,0.880\n"+
"Antibiotika 1 @-2.082,0.906\n"+
"\n"+
"E D AllergischeSensibilisierung\n"+
"Genetische D AllergischeSensibilisierung\n"+
"Etnische Genetische D Stillen\n"+
"Begleiterkrankungen D E\n"+
"RauchenMutter D Stillen Schwangerschaft E\n"+
"RauchenAnderer D Stillen E\n"+
"Stillen Darmflora AllergischeSensibilisierung\n"+
"DiätMutter Stillen D\n"+
"Darmflora D AllergischeSensibilisierung E\n"+
"Hausstaub Darmflora AllergischeSensibilisierung\n"+
"Haustiere Hausstaub Darmflora AllergischeSensibilisierung Erregerexposition\n"+
"AllergischeSensibilisierung D\n"+
"Allergenexposition Darmflora E AllergischeSensibilisierung\n"+
"Impfungen Darmflora E\n"+
"VitD E\n"+
"Infektionen E Darmflora Erregerexposition D\n"+
"Erregerexposition E D\n"+
"Geburtsmodus Erregerexposition Darmflora\n"+
"Geburtsort Erregerexposition\n"+
"Geschwister AllergischeSensibilisierung Erregerexposition\n"+
"BetreuungKind Infektionen Erregerexposition AllergischeSensibilisierung\n"+
"Antibiotika Infektionen Darmflora D Erregerexposition");
},

K5:  GraphParser.parseGuess("graph {\n"+
		"a [pos=\"0.179,0.301\"]\n"+
		"b [pos=\"0.618,0.988\"]\n"+
		"c [pos=\"0.305,0.981\"]\n"+
		"x [exposure,pos=\"0.484,0.032\"]\n"+
		"y [outcome,pos=\"0.774,0.285\"]\n"+
		"a -- b\n"+
		"a -- c\n"+
		"a -- x\n"+
		"a -- y\n"+
		"b -- c\n"+
		"b -- x\n"+
		"b -- y\n"+
		"c -- x\n"+
		"c -- y\n"+
		"x -- y\n"+
		"}"),

spirtes : GraphParser.parseGuess("pag G {"+
"X196 "+
"X433 "+
"X319 "+
"X80 "+
"X488 "+
"X207 "+
"X254 "+
"X148 "+
"X399 "+
"X350 "+
"X226 "+
"X409 "+
"X110 "+
"X371 "+
"X340 "+
"X176 "+
"X439 "+
"X147 "+
"X336 "+
"X342 "+
"X78 "+
"X445 "+
"X496 "+
"X51 "+
"X296 "+
"X56 "+
"X499 "+
"X364 "+
"X487 "+
"X321 "+
"X493 "+
"X228 "+
"X450 "+
"X255 "+
"X452 "+
"X440 "+
"X178 "+
"X280 "+
"X430 "+
"X85 "+
"X309 "+
"X216 "+
"X188 "+
"X413 "+
"X58 "+
"X468 "+
"X81 "+
"X467 "+
"X123 "+
"X374 "+
"X186 "+
"X475 "+
"X124 "+
"X158 "+
"X159 "+
"X414 "+
"X223 "+
"X129 "+
"X25 "+
"X194 "+
"X441 "+
"X237 "+
"X292 "+
"X388 "+
"X236 "+
"X222 "+
"X377 "+
"X165 "+
"X404 "+
"X101 "+
"X225 "+
"X249 "+
"X274 "+
"X469 "+
"X370 "+
"X117 "+
"X122 "+
"X42 "+
"X21 "+
"X392 "+
"X359 "+
"X64 "+
"X197 "+
"X362 "+
"X421 "+
"X271 "+
"X62 "+
"X298 "+
"X492 "+
"X166 "+
"X299 "+
"X360 "+
"X489 "+
"X136 "+
"X397 "+
"X168 "+
"X218 "+
"X18 "+
"X367 "+
"X238 "+
"X427 "+
"X314 "+
"X471 "+
"X270 "+
"X90 "+
"X134 "+
"X327 "+
"X491 "+
"X115 "+
"X356 "+
"X369 "+
"X339 "+
"X416 "+
"X318 "+
"X233 "+
"X240 "+
"X390 "+
"X349 "+
"X403 "+
"X286 "+
"X310 "+
"X55 "+
"X351 "+
"X368 "+
"X415 "+
"X68 "+
"X297 "+
"X459 "+
"X97 "+
"X273 "+
"X395 "+
"X212 "+
"X498 "+
"X266 "+
"X436 "+
"X219 "+
"X442 "+
"X200 "+
"X135 "+
"X211 "+
"X139 "+
"X454 "+
"X169 "+
"X343 "+
"X382 "+
"X486 "+
"X128 "+
"X444 "+
"X77 "+
"X201 "+
"X325 "+
"X220 "+
"X494 "+
"X113 "+
"X401 "+
"X406 "+
"X108 "+
"X352 "+
"X13 "+
"X290 "+
"X463 "+
"X429 "+
"X481 "+
"X482 "+
"X393 "+
"X307 "+
"X293 "+
"X500 "+
"X141 "+
"X279 "+
"X6 "+
"X152 "+
"X472 "+
"X470 "+
"X353 "+
"X181 "+
"X316 "+
"X447 "+
"X142 "+
"X479 "+
"X91 "+
"X190 "+
"X461 [outcome] "+
"X396 "+
"X462 "+
"X384 "+
"X313 "+
"X302 "+
"X446 "+
"X167 "+
"X125 "+
"X161 "+
"X424 "+
"X31 "+
"X348 "+
"X455 "+
"X381 "+
"X215 "+
"X50 "+
"X300 "+
"X457 "+
"X328 "+
"X277 "+
"X195 "+
"X389 "+
"X204 "+
"X272 "+
"X308 "+
"X23 "+
"X217 "+
"X210 "+
"X170 "+
"X387 "+
"X456 "+
"X464 "+
"X265 "+
"X287 "+
"X451 "+
"X417 "+
"X35 "+
"X89 "+
"X402 "+
"X3 "+
"X366 "+
"X83 "+
"X275 "+
"X118 "+
"X497 "+
"X41 "+
"X322 "+
"X174 "+
"X151 "+
"X478 "+
"X294 "+
"X391 "+
"X177 "+
"X172 "+
"X379 "+
"X324 "+
"X261 "+
"X407 "+
"X99 "+
"X460 "+
"X323 "+
"X144 "+
"X82 "+
"X185 "+
"X28 "+
"X283 "+
"X162 "+
"X434 "+
"X32 "+
"X256 "+
"X102 "+
"X100 "+
"X119 "+
"X250 "+
"X209 "+
"X44 "+
"X116 "+
"X66 "+
"X354 "+
"X320 "+
"X84 "+
"X16 "+
"X203 "+
"X306 "+
"X227 "+
"X111 "+
"X480 "+
"X483 "+
"X344 "+
"X5 "+
"X40 "+
"X331 "+
"X458 "+
"X405 "+
"X239 "+
"X76 "+
"X485 "+
"X2 "+
"X127 "+
"X376 "+
"X199 "+
"X47 "+
"X288 "+
"X149 "+
"X15 "+
"X276 "+
"X251 "+
"X398 "+
"X36 "+
"X408 "+
"X94 "+
"X282 "+
"X477 "+
"X38 "+
"X268 "+
"X394 "+
"X22 "+
"X24 "+
"X400 "+
"X171 "+
"X193 "+
"X375 "+
"X157 "+
"X426 "+
"X175 "+
"X474 "+
"X224 "+
"X334 "+
"X221 "+
"X423 "+
"X198 "+
"X495 "+
"X453 "+
"X4 "+
"X346 "+
"X438 "+
"X422 "+
"X183 "+
"X120 "+
"X333 "+
"X312 "+
"X30 "+
"X466 "+
"X449 "+
"X48 "+
"X235 "+
"X358 "+
"X428 "+
"X335 "+
"X189 "+
"X43 "+
"X267 "+
"X10 "+
"X419 "+
"X411 "+
"X106 "+
"X355 "+
"X87 "+
"X484 "+
"X443 "+
"X232 "+
"X372 "+
"X54 "+
"X49 "+
"X259 "+
"X301 "+
"X138 "+
"X476 "+
"X264 "+
"X230 "+
"X317 "+
"X448 "+
"X490 "+
"X357 "+
"X241 "+
"X263 "+
"X29 "+
"X431 "+
"X132 "+
"X75 "+
"X385 "+
"X432 "+
"X473 "+
"X179 "+
"X386 "+
"X9 "+
"X425 "+
"X363 "+
"X289 "+
"X242 "+
"X231 "+
"X410 "+
"X93 "+
"X98 "+
"X247 "+
"X146 "+
"X383 "+
"X435 "+
"X378 "+
"X465 "+
"X88 "+
"X79 "+
"X418 "+
"X295 "+
"X45 "+
"X345 [exposure] "+
"X17 "+
"X332 "+
"X206 "+
"X154 "+
"X153 "+
"X33 "+
"X260 "+
"X243 "+
"X245 "+
"X234 "+
"X253 "+
" "+
"X10 @-@ X314 "+
"X10 @-> X414 "+
"X10 @-> X426 "+
"X10 @-> X447 "+
"X100 <-> X183 "+
"X100 <-> X332 "+
"X100 -> X403  "+
"X101 -> X233  "+
"X101 -> X353  "+
"X101 -> X418  "+
"X101 -> X461  "+
"X102 -> X135  "+
"X102 <-> X227 "+
"X102 -> X494  "+
"X106 @-> X316 "+
"X108 @-> X174 "+
"X108 @-> X223 "+
"X108 @-> X238 "+
"X108 @-@ X42 "+
"X108 @-> X460 "+
"X110 @-> X211 "+
"X110 @-> X243 "+
"X110 @-> X273 "+
"X110 @-> X327 "+
"X111 @-> X237 "+
"X111 @-> X239 "+
"X111 @-> X411 "+
"X113 @-@ X277 "+
"X113 @-> X310 "+
"X113 @-> X369 "+
"X113 @-> X390 "+
"X115 @-> X210 "+
"X115 @-> X270 "+
"X115 @-> X276 "+
"X115 @-> X467 "+
"X115 @-> X489 "+
"X117 @-> X300 "+
"X118 -> X124  "+
"X118 -> X322  "+
"X118 -> X384  "+
"X118 -> X393  "+
"X118 <-> X432 "+
"X119 -> X399  "+
"X119 -> X427  "+
"X120 -> X176  "+
"X120 -> X239  "+
"X120 -> X253  "+
"X120 -> X368  "+
"X120 -> X385  "+
"X120 -> X444  "+
"X122 <-> X127 "+
"X122 -> X209  "+
"X122 -> X292  "+
"X122 <-> X369 "+
"X122 -> X384  "+
"X122 -> X415  "+
"X122 -> X440  "+
"X123 @-> X428 "+
"X124 -> X100  "+
"X124 -> X212  "+
"X124 -> X342  "+
"X124 -> X458  "+
"X124 -> X497  "+
"X125 -> X165  "+
"X127 -> X282  "+
"X128 @-> X138 "+
"X128 @-> X322 "+
"X128 @-> X480 "+
"X129 @-> X138 "+
"X129 @-> X460 "+
"X13 @-> X176 "+
"X13 @-> X306 "+
"X13 @-@ X44 "+
"X13 @-> X483 "+
"X13 @-> X492 "+
"X132 -> X335  "+
"X132 -> X450  "+
"X132 -> X452  "+
"X134 @-> X251 "+
"X135 -> X440  "+
"X136 -> X322  "+
"X138 -> X381  "+
"X138 -> X419  "+
"X139 <-> X36 "+
"X139 -> X376  "+
"X141 @-@ X3 "+
"X142 <-> X200 "+
"X142 -> X245  "+
"X142 -> X439  "+
"X142 -> X462  "+
"X144 @-> X335 "+
"X144 @-> X415 "+
"X146 @-@ X17 "+
"X147 @-@ X128 "+
"X147 @-> X209 "+
"X147 @-> X233 "+
"X147 @-> X264 "+
"X147 @-> X411 "+
"X149 @-> X465 "+
"X15 @-@ X113 "+
"X15 @-> X455 "+
"X15 @-> X469 "+
"X151 -> X300  "+
"X151 -> X334  "+
"X151 -> X47  "+
"X152 @-@ X190 "+
"X153 @-> X490 "+
"X154 -> X219  "+
"X158 @-@ X286 "+
"X158 @-> X428 "+
"X159 -> X135  "+
"X159 -> X339  "+
"X159 -> X342  "+
"X159 <-> X404 "+
"X159 <-> X411 "+
"X159 <-> X84 "+
"X161 -> X300  "+
"X161 -> X366  "+
"X161 -> X386  "+
"X161 -> X422  "+
"X161 -> X487  "+
"X161 -> X490  "+
"X162 @-> X175 "+
"X162 @-> X319 "+
"X162 @-> X323 "+
"X162 @-> X370 "+
"X166 -> X217  "+
"X166 -> X332  "+
"X166 -> X426  "+
"X167 @-> X159 "+
"X167 @-> X335 "+
"X167 @-> X472 "+
"X168 @-> X276 "+
"X168 @-> X441 "+
"X169 -> X223  "+
"X169 -> X297  "+
"X169 @-> X310 "+
"X169 -> X316  "+
"X17 @-> X241 "+
"X170 @-@ X111 "+
"X171 @-@ X181 "+
"X171 @-> X288 "+
"X172 @-> X327 "+
"X174 -> X297  "+
"X175 <-> X120 "+
"X175 -> X186  "+
"X175 -> X236  "+
"X175 -> X267  "+
"X175 -> X275  "+
"X175 -> X392  "+
"X176 -> X435  "+
"X177 @-> X211 "+
"X177 @-> X237 "+
"X177 @-> X313 "+
"X179 @-> X207 "+
"X18 @-> X458 "+
"X181 @-> X264 "+
"X183 -> X238  "+
"X183 -> X270  "+
"X183 -> X298  "+
"X183 -> X367  "+
"X183 -> X454  "+
"X185 @-> X350 "+
"X185 @-@ X56 "+
"X186 <-> X120 "+
"X186 -> X282  "+
"X188 -> X436  "+
"X189 @-> X320 "+
"X189 @-@ X9 "+
"X190 @-> X374 "+
"X190 @-> X472 "+
"X190 @-> X495 "+
"X193 @-> X201 "+
"X193 @-> X364 "+
"X193 @-> X372 "+
"X193 @-> X432 "+
"X194 @-@ X30 "+
"X195 -> X400  "+
"X195 -> X417  "+
"X196 @-> X408 "+
"X196 @-@ X44 "+
"X197 -> X151  "+
"X197 -> X276  "+
"X198 @-@ X43 "+
"X198 @-> X496 "+
"X2 @-> X280 "+
"X2 @-> X433 "+
"X2 @-> X493 "+
"X2 @-> X80 "+
"X200 -> X242  "+
"X200 -> X290  "+
"X200 -> X317  "+
"X200 -> X357  "+
"X200 -> X403  "+
"X200 -> X51  "+
"X201 -> X334  "+
"X201 -> X466  "+
"X203 @-> X418 "+
"X204 @-> X274 "+
"X204 @-> X295 "+
"X204 @-> X344 "+
"X204 @-> X429 "+
"X204 @-> X444 "+
"X206 @-@ X179 "+
"X206 @-> X216 "+
"X207 <-> X136 "+
"X207 -> X280  "+
"X207 -> X468  "+
"X209 -> X236  "+
"X209 -> X245  "+
"X209 -> X275  "+
"X209 -> X309  "+
"X209 -> X410  "+
"X21 @-> X276 "+
"X21 @-> X287 "+
"X21 @-> X292 "+
"X21 @-> X487 "+
"X21 @-@ X82 "+
"X210 -> X339  "+
"X211 -> X268  "+
"X212 -> X386  "+
"X212 -> X389  "+
"X212 -> X462  "+
"X215 @-> X358 "+
"X215 @-> X475 "+
"X217 -> X295  "+
"X217 -> X393  "+
"X217 -> X442  "+
"X218 @-> X102 "+
"X218 @-> X233 "+
"X218 @-> X334 "+
"X218 @-> X362 "+
"X218 @-> X445 "+
"X218 @-> X448 "+
"X219 -> X289  "+
"X219 -> X392  "+
"X219 <-> X99 "+
"X22 @-> X242 "+
"X220 -> X336  "+
"X220 -> X460  "+
"X221 @-> X344 "+
"X221 @-> X389 "+
"X221 @-> X434 "+
"X221 @-@ X6 "+
"X222 @-> X227 "+
"X222 @-> X322 "+
"X222 @-> X344 "+
"X222 @-> X346 "+
"X222 @-> X381 "+
"X222 @-> X424 "+
"X222 @-> X462 "+
"X223 -> X344  "+
"X223 <-> X460 "+
"X224 @-@ X232 "+
"X225 @-> X234 "+
"X225 @-> X280 "+
"X225 @-@ X294 "+
"X225 @-> X374 "+
"X225 @-> X414 "+
"X226 @-> X282 "+
"X226 @-> X374 "+
"X226 @-> X403 "+
"X226 @-> X419 "+
"X227 -> X410  "+
"X227 -> X434  "+
"X227 -> X486  "+
"X23 @-> X118 "+
"X23 -> X122  "+
"X23 -> X166  "+
"X23 -> X264  "+
"X23 -> X301  "+
"X23 <-> X432 "+
"X23 -> X451  "+
"X230 @-> X270 "+
"X230 @-> X84 "+
"X231 @-> X474 "+
"X231 @-> X497 "+
"X232 @-> X409 "+
"X233 -> X282  "+
"X233 -> X301  "+
"X233 -> X416  "+
"X233 -> X472  "+
"X234 -> X289  "+
"X234 -> X353  "+
"X234 -> X354  "+
"X234 -> X363  "+
"X234 -> X400  "+
"X234 -> X466  "+
"X234 -> X468  "+
"X234 -> X491  "+
"X235 @-> X139 "+
"X235 @-> X350 "+
"X235 @-> X368 "+
"X235 @-> X484 "+
"X236 -> X403  "+
"X236 -> X493  "+
"X238 -> X265  "+
"X238 -> X371  "+
"X239 -> X242  "+
"X239 -> X290  "+
"X239 -> X367  "+
"X24 @-> X295 "+
"X24 @-> X456 "+
"X240 @-> X266 "+
"X240 @-@ X349 "+
"X240 @-> X358 "+
"X240 @-> X430 "+
"X241 -> X253  "+
"X241 -> X333  "+
"X241 -> X367  "+
"X242 -> X430  "+
"X243 -> X267  "+
"X243 -> X426  "+
"X243 -> X447  "+
"X243 -> X490  "+
"X245 <-> X200 "+
"X245 -> X336  "+
"X245 -> X476  "+
"X247 -> X435  "+
"X249 @-@ X28 "+
"X25 -> X161  "+
"X25 -> X280  "+
"X25 -> X375  "+
"X25 -> X384  "+
"X250 @-> X287 "+
"X253 -> X467  "+
"X254 -> X383  "+
"X255 @-> X415 "+
"X259 @-> X247 "+
"X259 @-> X266 "+
"X259 @-> X273 "+
"X259 @-> X324 "+
"X259 @-> X438 "+
"X261 @-@ X260 "+
"X261 @-> X469 "+
"X263 @-> X119 "+
"X263 -> X397  "+
"X264 -> X272  "+
"X264 -> X331  "+
"X264 -> X447  "+
"X266 -> X366  "+
"X267 -> X292  "+
"X267 -> X409  "+
"X267 -> X459  "+
"X268 -> X388  "+
"X268 -> X451  "+
"X268 -> X493  "+
"X270 -> X332  "+
"X271 @-> X302 "+
"X271 -> X342  "+
"X271 -> X383  "+
"X271 -> X396  "+
"X272 -> X309  "+
"X273 <-> X396 "+
"X273 -> X444  "+
"X274 <-> X118 "+
"X274 <-> X23 "+
"X274 <-> X87 "+
"X275 -> X370  "+
"X275 -> X382  "+
"X276 -> X309  "+
"X28 @-> X264 "+
"X28 @-> X385 "+
"X28 @-> X409 "+
"X28 @-> X411 "+
"X28 @-> X459 "+
"X28 @-> X484 "+
"X280 <-> X136 "+
"X280 -> X461  "+
"X280 -> X490  "+
"X282 -> X485  "+
"X283 <-> X253 "+
"X283 -> X468  "+
"X283 -> X476  "+
"X286 @-> X335 "+
"X287 -> X299  "+
"X287 -> X403  "+
"X287 -> X497  "+
"X288 -> X475  "+
"X288 -> X483  "+
"X288 <-> X495 "+
"X29 @-> X321 "+
"X29 @-> X360 "+
"X29 @-> X463 "+
"X29 @-> X489 "+
"X290 -> X306  "+
"X290 -> X431  "+
"X292 -> X348  "+
"X292 -> X481  "+
"X293 -> X384  "+
"X294 @-> X451 "+
"X294 @-> X474 "+
"X295 -> X427  "+
"X297 -> X354  "+
"X298 -> X376  "+
"X298 -> X417  "+
"X298 -> X50  "+
"X3 @-> X201 "+
"X3 @-> X237 "+
"X3 @-> X441 "+
"X301 -> X336  "+
"X301 -> X359  "+
"X301 -> X377  "+
"X301 -> X468  "+
"X302 -> X245  "+
"X302 -> X500  "+
"X306 -> X423  "+
"X308 -> X443  "+
"X309 -> X335  "+
"X309 -> X358  "+
"X309 -> X389  "+
"X309 -> X394  "+
"X310 -> X478  "+
"X310 -> X483  "+
"X312 -> X339  "+
"X312 -> X436  "+
"X312 <-> X88 "+
"X313 -> X342  "+
"X313 -> X416  "+
"X313 -> X432  "+
"X313 -> X469  "+
"X313 -> X479  "+
"X314 @-> X321 "+
"X314 @-@ X328 "+
"X316 -> X427  "+
"X316 -> X435  "+
"X317 -> X321  "+
"X317 -> X438  "+
"X319 -> X357  "+
"X32 @-> X266 "+
"X32 @-> X273 "+
"X32 @-> X390 "+
"X320 <-> X267 "+
"X320 -> X370  "+
"X320 -> X404  "+
"X320 <-> X88 "+
"X321 -> X176  "+
"X321 <-> X431 "+
"X322 -> X461  "+
"X322 -> X474  "+
"X323 <-> X119 "+
"X323 <-> X263 "+
"X323 -> X331  "+
"X323 <-> X398 "+
"X324 -> X442  "+
"X325 @-> X450 "+
"X325 @-> X461 "+
"X327 <-> X195 "+
"X327 <-> X273 "+
"X327 -> X469  "+
"X327 <-> X477 "+
"X327 <-> X491 "+
"X33 -> X78  "+
"X331 -> X407  "+
"X331 -> X456  "+
"X331 -> X472  "+
"X332 -> X463  "+
"X332 -> X497  "+
"X333 -> X470  "+
"X334 <-> X363 "+
"X334 <-> X448 "+
"X335 -> X499  "+
"X340 @-@ X235 "+
"X340 @-> X400 "+
"X340 @-> X414 "+
"X340 @-> X421 "+
"X340 @-> X460 "+
"X342 -> X344  "+
"X343 @-@ X13 "+
"X346 -> X369  "+
"X346 -> X370  "+
"X346 -> X397  "+
"X346 -> X438  "+
"X346 -> X487  "+
"X348 <-> X322 "+
"X348 -> X449  "+
"X349 @-> X386 "+
"X349 @-> X409 "+
"X349 @-> X476 "+
"X35 @-> X142 "+
"X35 @-> X309 "+
"X35 @-> X428 "+
"X35 @-> X64 "+
"X350 -> X386  "+
"X350 -> X409  "+
"X350 -> X444  "+
"X350 -> X469  "+
"X351 @-@ X79 "+
"X354 -> X424  "+
"X354 -> X435  "+
"X354 -> X456  "+
"X355 @-> X449 "+
"X355 @-@ X56 "+
"X356 @-> X452 "+
"X357 -> X419  "+
"X358 -> X417  "+
"X358 -> X428  "+
"X359 -> X408  "+
"X359 -> X436  "+
"X359 -> X476  "+
"X359 -> X482  "+
"X36 -> X247  "+
"X36 -> X251  "+
"X36 -> X254  "+
"X36 -> X33  "+
"X36 -> X346  "+
"X360 <-> X183 "+
"X360 -> X312  "+
"X360 -> X320  "+
"X360 -> X441  "+
"X360 <-> X88 "+
"X362 -> X429  "+
"X364 <-> X276 "+
"X364 <-> X369 "+
"X364 -> X393  "+
"X364 -> X445  "+
"X366 -> X435  "+
"X367 -> X312  "+
"X367 -> X392  "+
"X367 -> X451  "+
"X368 <-> X253 "+
"X368 -> X283  "+
"X368 -> X475  "+
"X369 -> X399  "+
"X370 -> X234  "+
"X370 -> X404  "+
"X370 -> X422  "+
"X372 <-> X36 "+
"X374 -> X302  "+
"X374 -> X324  "+
"X374 -> X428  "+
"X374 -> X465  "+
"X376 -> X492  "+
"X377 -> X482  "+
"X379 @-@ X41 "+
"X379 @-> X480 "+
"X38 @-> X280 "+
"X38 @-> X455 "+
"X38 @-> X499 "+
"X382 -> X397  "+
"X382 -> X481  "+
"X383 -> X207  "+
"X383 -> X409  "+
"X383 <-> X418 "+
"X383 -> X426  "+
"X384 -> X452  "+
"X387 <-> X345 "+
"X387 <-> X405 "+
"X388 -> X480  "+
"X390 <-> X478 "+
"X391 @-> X455 "+
"X392 -> X448  "+
"X394 -> X475  "+
"X396 -> X439  "+
"X397 <-> X241 "+
"X398 -> X119  "+
"X398 -> X263  "+
"X398 -> X458  "+
"X399 -> X449  "+
"X4 @-@ X318 "+
"X4 @-@ X38 "+
"X40 @-> X101 "+
"X40 @-> X399 "+
"X40 @-> X415 "+
"X40 @-> X445 "+
"X40 @-> X455 "+
"X40 @-@ X66 "+
"X400 -> X452  "+
"X400 -> X486  "+
"X401 @-> X479 "+
"X402 @-@ X171 "+
"X404 -> X457  "+
"X404 <-> X458 "+
"X404 -> X475  "+
"X405 <-> X345 "+
"X406 @-> X197 "+
"X406 @-> X308 "+
"X407 -> X422  "+
"X409 <-> X353 "+
"X409 <-> X410 "+
"X41 @-> X125 "+
"X41 @-> X403 "+
"X410 -> X461  "+
"X411 <-> X264 "+
"X413 @-@ X113 "+
"X413 @-> X458 "+
"X414 -> X445  "+
"X414 -> X472  "+
"X416 <-> X384 "+
"X416 -> X443  "+
"X416 <-> X474 "+
"X417 -> X454  "+
"X417 -> X486  "+
"X419 -> X454  "+
"X42 @-@ X255 "+
"X42 @-> X300 "+
"X42 @-> X307 "+
"X42 @-> X377 "+
"X42 @-> X450 "+
"X42 @-> X478 "+
"X421 <-> X484 "+
"X422 -> X466  "+
"X424 <-> X241 "+
"X424 -> X445  "+
"X424 -> X461  "+
"X424 -> X478  "+
"X425 @-> X487 "+
"X427 -> X440  "+
"X429 -> X474  "+
"X43 @-> X307 "+
"X43 @-> X383 "+
"X431 -> X473  "+
"X433 <-> X136 "+
"X433 -> X207  "+
"X434 <-> X410 "+
"X434 -> X461  "+
"X435 -> X427  "+
"X439 <-> X200 "+
"X44 @-> X283 "+
"X44 @-> X415 "+
"X440 -> X466  "+
"X440 -> X482  "+
"X441 -> X481  "+
"X442 <-> X334 "+
"X442 -> X492  "+
"X443 -> X491  "+
"X446 @-@ X177 "+
"X446 @-> X211 "+
"X446 @-> X362 "+
"X447 <-> X484 "+
"X449 -> X481  "+
"X449 -> X498  "+
"X45 -> X154  "+
"X45 -> X174  "+
"X45 -> X272  "+
"X45 -> X345  "+
"X45 -> X352  "+
"X450 <-> X300 "+
"X453 @-@ X24 "+
"X455 -> X463  "+
"X455 -> X500  "+
"X459 <-> X210 "+
"X459 -> X386  "+
"X460 -> X486  "+
"X462 -> X473  "+
"X462 -> X489  "+
"X464 <-> X228 "+
"X465 -> X234  "+
"X467 <-> X390 "+
"X469 <-> X331 "+
"X469 <-> X384 "+
"X47 -> X101  "+
"X47 -> X243  "+
"X47 -> X309  "+
"X47 -> X400  "+
"X47 -> X451  "+
"X470 -> X477  "+
"X471 @-@ X115 "+
"X471 @-> X270 "+
"X473 -> X51  "+
"X478 -> X493  "+
"X479 <-> X398 "+
"X479 -> X494  "+
"X48 @-> X119 "+
"X48 @-> X127 "+
"X484 -> X308  "+
"X487 -> X496  "+
"X488 @-@ X148 "+
"X488 @-> X493 "+
"X49 @-> X102 "+
"X49 @-> X387 "+
"X49 @-> X399 "+
"X491 -> X396  "+
"X492 <-> X428 "+
"X496 <-> X197 "+
"X497 <-> X100 "+
"X5 -> X313  "+
"X5 -> X403  "+
"X5 -> X414  "+
"X5 -> X45  "+
"X50 -> X169  "+
"X50 -> X227  "+
"X50 -> X293  "+
"X50 -> X310  "+
"X50 -> X433  "+
"X50 -> X487  "+
"X500 <-> X438 "+
"X51 -> X5  "+
"X54 @-> X404 "+
"X54 @-> X491 "+
"X56 @-> X295 "+
"X56 @-> X385 "+
"X56 @-> X439 "+
"X56 @-> X460 "+
"X58 @-@ X24 "+
"X58 @-> X499 "+
"X6 @-> X344 "+
"X6 @-> X357 "+
"X6 @-> X421 "+
"X6 @-> X99 "+
"X64 -> X135  "+
"X64 -> X331  "+
"X64 -> X389  "+
"X64 -> X499  "+
"X64 -> X99  "+
"X66 @-@ X179 "+
"X66 @-> X411 "+
"X66 @-> X441 "+
"X66 @-> X443 "+
"X66 @-> X460 "+
"X68 @-> X433 "+
"X68 @-> X84 "+
"X75 @-> X216 "+
"X75 @-> X319 "+
"X76 @-> X132 "+
"X76 @-> X233 "+
"X76 @-> X253 "+
"X76 @-> X368 "+
"X77 @-> X125 "+
"X77 @-> X327 "+
"X77 @-> X364 "+
"X77 @-> X390 "+
"X77 @-> X472 "+
"X78 -> X174  "+
"X78 -> X234  "+
"X78 -> X268  "+
"X78 -> X433  "+
"X78 -> X464  "+
"X78 -> X467  "+
"X79 @-> X183 "+
"X79 @-> X195 "+
"X79 @-> X360 "+
"X79 @-> X386 "+
"X79 @-> X409 "+
"X79 @-> X448 "+
"X80 -> X271  "+
"X80 -> X302  "+
"X80 -> X388  "+
"X80 -> X405  "+
"X80 -> X440  "+
"X80 -> X450  "+
"X80 -> X476  "+
"X81 @-@ X24 "+
"X81 @-> X415 "+
"X82 @-> X335 "+
"X82 @-> X399 "+
"X83 @-> X132 "+
"X83 @-> X312 "+
"X83 @-> X64 "+
"X84 -> X161  "+
"X84 -> X264  "+
"X84 -> X403  "+
"X84 -> X499  "+
"X85 @-> X207 "+
"X85 @-> X223 "+
"X85 @-> X254 "+
"X85 @-> X357 "+
"X85 @-> X91 "+
"X87 @-> X118 "+
"X87 -> X322  "+
"X87 -> X350  "+
"X87 <-> X432 "+
"X87 -> X91  "+
"X88 -> X138  "+
"X88 -> X25  "+
"X88 -> X493  "+
"X88 -> X80  "+
"X89 @-> X251 "+
"X9 @-> X188 "+
"X9 @-> X388 "+
"X9 @-> X390 "+
"X9 @-> X431 "+
"X9 @-> X478 "+
"X90 <-> X139 "+
"X90 -> X36  "+
"X90 <-> X372 "+
"X90 <-> X443 "+
"X91 -> X132  "+
"X93 @-> X100 "+
"X93 @-> X166 "+
"X93 @-> X220 "+
"X93 @-> X301 "+
"X93 @-> X438 "+
"X94 @-> X306 "+
"X94 @-> X324 "+
"X94 -> X442  "+
"X97 @-> X188 "+
"X97 @-> X276 "+
"X97 @-> X431 "+
"X98 @-> X295 "+
"X98 @-@ X85 "+
"X99 -> X220  "+
"X99 <-> X228 "+
"X99 -> X316  "+
"X99 -> X464  "+
"}")
};


/** START UMD boilerplate */
}));
/** END UMD boilerplate */
