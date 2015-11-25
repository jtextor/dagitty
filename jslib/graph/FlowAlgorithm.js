Graph.addMethods( { 

   clearFlow : function(){
      this.edges.each( function( e ) {
         e.flow = 0;
      } );
      this.vertices.values().each( function( v ) {
         v.flow = 0;
      } );
   },

   findAugmentingPath : function( v, t ){
      // log( " visiting " + v.id );

      if( v === t ){
         return true; 
      }
      v.visited = true;

      for( var i = 0 ; i < v.outgoingEdges.length ; i ++ ){
        var e = v.outgoingEdges[i];
        if( !e.v2.visited && e.flow < e.capacity ){
          e.flow = 1;
          if( this.findAugmentingPath( e.v2, t ) )
            return true;
          e.flow = 0;
        }
      }

      v.visited = false;
      return false;
   },

   fordFulkerson : function(){
      this.clearFlow();
      var max_flow = 0;
      do{
         // log( "\n\nIteration "+max_flow );
         this.clearVisited();
         // Residualnetzwerk bilden
         for( var i = 0 ; i < this.edges.length ; i++ ){
            var e = this.edges[i];
            var e_back = this.getEdge( e.v2, e.v1 );
            if( e.flow == 1 ){
               // log( e.v1.id + " -> " + e.v2.id );
               e.capacity --; e_back.capacity ++; e.flow = 0;
            }
         }
         // log( this.toAdjacencyList() );
      } while( this.findAugmentingPath( this.getSource(), this.getTarget() ) && ++max_flow );
      return( max_flow );
      //log( max_flow );
   },

   findPath : function( s, t, pp ){
      if( s === t ){ 
        log( "pathfinder : " + pp + " " + t.id );
        return true;
      }
      if( s.visited ) {
          return false;
      }
      s.visited = true;
      for( var i = 0 ; i < s.outgoingEdges.length ; i ++ ){
        if( this.findPath(  s.outgoingEdges[i].v2, t, pp + " " + s.id ) )
          return true;
      }
      s.visited = false;
      return false;
   },

   vertexCapacityGraph : function() {
      var gn = new Graph();
      var g = this;
      g.vertices.values().each( function( v ){
          if( g.getSource() !== v ){
              gn.addVertex( new Graph.Vertex( { id : "I" + v.id } ) );
          }
          if( g.getTarget() !== v ){
              gn.addVertex( new Graph.Vertex( { id : "O" + v.id } ) );
          }
          if( g.getSource() !== v && g.getTarget() !== v ){
              gn.addEdge( new Graph.Edge.Directed( { 
                  v1:gn.getVertex("I"+v.id), v2:gn.getVertex("O"+v.id), capacity: 1, is_backedge : false } ) );
              gn.addEdge( new Graph.Edge.Directed( { 
                  v2:gn.getVertex("I"+v.id), v1:gn.getVertex("O"+v.id), capacity: 0, is_backedge : true } ) );
          }
      } );
      g.edges.each( function( e ){
          if( e.v1 !== g.getTarget() && e.v2 !== g.getSource() ){
            gn.addEdge( new Graph.Edge.Directed( { v1 : gn.getVertex("O"+e.v1.id),
                                                 v2 : gn.getVertex("I"+e.v2.id) , capacity: 1, is_backedge : false } ) );
            gn.addEdge( new Graph.Edge.Directed( { v2 : gn.getVertex("O"+e.v1.id),
                                                 v1 : gn.getVertex("I"+e.v2.id) , capacity: 0, is_backedge : true } ) );
          }
      } );
      return gn.
        setSource(gn.getVertex("O"+g.getSource().id)).
        setTarget(gn.getVertex("I"+g.getTarget().id));
   },

   flowGraph : function(){
      var gn = new Graph();
      var g = this;
      g.vertices.values().each( function( v ){
          if( v === g.getTarget() || v.id.charAt( 0 ) == "O" ){
            gn.addVertex( new Graph.Vertex( { id : v.id.substring( 1 ) } ) );
            var vn = gn.getVertex( v.id.substring( 1 ) );
            if( v === g.getTarget() ){ gn.setTarget( vn ); }
            if( v === g.getSource() ){ gn.setSource( vn ); }
            if( v === g.getTarget() || v === g.getSource() || 
               ( g.getVertex( v.id ).component != g.getVertex( "I"+v.id.substring(1) ).component ) )
               vn.component = v === g.getSource() ? v.component : g.getVertex( "I"+v.id.substring(1) ).component;
          }
      } );
      g.edges.each( function( e ){
          if( ( e.v1.id.substring(1) !== e.v2.id.substring(1) )
            && e.is_backedge === false && e.capacity === 0 ){
              gn.addEdge( new Graph.Edge.Directed( { v1 : gn.getVertex(e.v1.id.substring(1)),
                                                   v2 : gn.getVertex(e.v2.id.substring(1)) } ) );
          }
      } );
      gn.vertices.values().each( function( v ){
         if( v !== gn.getSource() && v !== gn.getTarget() && v.component === undefined ){
            gn.contractVertex( v );
         }
      } );
      return gn;
   },

   copyComponentLabels : function( other_graph ){
      this.vertices.values().each( function( v ){
          v.component = other_graph.getVertex( v.id ).component;
      } );
      return this;
   },

   copyST : function( other_graph ){
      return this.
        setSource( other_graph.getSource().id ).
        setTarget( other_graph.getTarget().id );
   },

   residualNetwork : function(){
      var gn = new Graph();
      this.vertices.values().each( function( v ){
          gn.addVertex( new Graph.Vertex( { id : v.id } ) );
      } );
      this.edges.each( function( e ){
          if( e.flow < e.capacity ){
              gn.addEdge( new Graph.Edge.Directed( { v1 : gn.getVertex(e.v1.id),
                                                   v2 : gn.getVertex(e.v2.id) } ) );
          }
      } );
      return gn.copyST( this );
   },

   tarjanSCC : function( v, ind ) {
      v.tarjan_index = ind.tarjan_index;
      v.tarjan_lowlink = ind.tarjan_index;
      //log( "  visiting " + v.id + " giving index " + v.tarjan_index + " and lowlink " + v.tarjan_lowlink );      
      ind.tarjan_index++;
      ind.S.push( v );
      for( var i = 0 ; i < v.outgoingEdges.length ; i ++ ){
         var e = v.outgoingEdges[i];
          if( e.v2.tarjan_index === undefined ){
            this.tarjanSCC( e.v2, ind );
            v.tarjan_lowlink = Math.min( v.tarjan_lowlink, e.v2.tarjan_lowlink );
          } else if( ind.S.include( e.v2 ) ){
            v.tarjan_lowlink = Math.min( 
                v.tarjan_lowlink, e.v2.tarjan_index );
          }
      }
      if( v.tarjan_lowlink === v.tarjan_index ){
         ind.component ++;
         do{
            var v2 = ind.S.pop();
            //print( v2.id );
            v2.component = ind.component;
         } while( v2 !== v )
      }
   },

   stronglyConnectedComponents : function(){
      var ind = { tarjan_index : 0, S : [], component : 0 };
      var g = this;
      g.vertices.values().each( function( v ){
         if( v.tarjan_index === undefined ){
            // log( "tarjan on " + v.id );
            g.tarjanSCC( v, ind );
         }
      } );
//       for( var i = g.edges.length-1 ; i >= 0 ; i -- ){
//          var e = g.edges[i];
//          if( e.v1.component === e.v2.component ){
//             g.deleteEdge( e );
//          }
//       }
   }

} ); // Graph.addMethods