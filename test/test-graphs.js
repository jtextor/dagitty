var TestGraphs = {

findExample : function( s ){
  for( var i = 0 ; i < examples.length ; i++ ){
    if( examples[i].l.toLowerCase().indexOf(s.toLowerCase()) >= 0 ){
      return GraphParser.parseGuess(examples[i].e,examples[i].v);
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
    _.each(["s","t","a","b","c","g"],function(vid){
       g.addVertex( new Graph.Vertex({id:vid}) );
    });
    _.each([
      ["a","b"],
      ["a","s"],
      ["b","t"],
      ["b","s"],
      ["c","t"],
      ["c","b"],
      ["g","c"],
      ["g","s"] ],function( e ){
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
   g.setType("dag")
   _.each(["X","Y","Z","I"],function(v){
      g.addVertex( new Graph.Vertex( {id:v} ) );
   });

   g.addSource( g.getVertex("X") );
   g.addTarget( g.getVertex("Y") );

   _.each([ 
      ["X","Y"],
      ["X","I"],
      ["I","Y"],
      ["Z","X"],
      ["Z","I"]
   ],function(e) {
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
		"}")


};