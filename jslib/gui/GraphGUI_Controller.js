
/* globals ObservedGraph,Class,_,Graph,DAGittyGraphView,GraphParser,GraphLayouter */
/* exported DAGittyController */

var DAGittyController = Class.extend({
	init : function( obj ){
		this.event_listeners = {
			"graphchange" : [],
			"graphlayoutchange" : [],
			"vertex_marked" : []
		}

		// the controller initializes the model ... 
		if( !obj.canvas ) return
		if( obj.graph ){
			this.setGraph( obj.graph )
		} else {
			this.setGraph( GraphParser.parseGuess( 
				obj.canvas.textContent||obj.canvas.innerText
			) )
		}
		
		// ... creates a simple graph layout if necessary ...
		if( !this.getGraph().hasCompleteLayout() ){
			new GraphLayouter.Spring( this.getGraph() ).layout()
		}

		// ... and creates the view ...
		this.view = new DAGittyGraphView( obj.canvas,
			this.getGraph(),
			this, { 
				interactive : obj.interactive,
				mutable : obj.mutable,
				autofocus : (obj.autofocus !== undefined) ? obj.autofocus : false,
			}
		)
	
		this.view.setEventListener( "vertex_marked", 
			_.bind( function(v){ _.each(this.event_listeners["vertex_marked"],
					function(l){ l(v) }) }, this ) )

		window.addEventListener( "resize", 
			_.debounce( _.bind( this.getView().resize, this.getView() ), 300 ) )
	
		// graph change event listeners are wired in the
		// function "setGraph" (because they might need to be 
		// changed when a completely new graph is loaded)
	},

	on : function( event_name, listener ){
		this.event_listeners[event_name].push( listener )
	},

	getGraph : function(){
		return this.graph
	},
	setGraph : function( graph ){
		this.graph = graph
		this.observed_graph = new ObservedGraph( graph )
		var myself = this
		this.observed_graph.observe( "change", 
			function(){ myself.graphChanged() } )
		if( this.view ){
			this.view.setGraph( graph )
		}
		this.graphChanged()
	},
	getObservedGraph : function(){
		return this.observed_graph
	},
	getView : function(){
		return this.view
	},
	setView : function( view ){
		this.view = view
	},
	setViewMode : function( viewmode ){
		if( this.view ){
			this.view.setViewMode( viewmode )
			this.view.drawGraph()
		}
	},
	setStyle : function( sheetname ){
		if( this.view ){
			this.view.setStyle( sheetname )
			this.view.drawGraph()
		}
	},
	getStyle : function(){
		if( this.view ){
			return this.view.getStyle()
		} else {
			return undefined
		}
	},
	redraw : function(){
		if( this.view ){
			this.view.drawGraph()
		}
	},
	graphChanged : function(){
		this.redraw()
		var g = this.getGraph()
		_.each(this.event_listeners["graphchange"],
			function(l){ l( g ) })
	},
	graphLayoutChanged : function(){
		var g = this.getGraph()
		_.each(this.event_listeners["graphlayoutchange"],
			function(l){ l( g ) })	
	},
	observe : function( _event, listener ){
		this.event_listeners[_event].push(listener)
	},
	setActionOnClick : function( a ){
		if( this.view ){
			this.view.setActionOnClick( a )
		}
	},

	toggleEdgeFromTo : function( v1, v2 ){
		var myself = this
		var done = function( e ){
			if(e){
				myself.getObservedGraph().deleteEdge( e.v1, e.v2, e.directed )
			}
			return 0
		}
		var e = this.getGraph().getEdge( v1, v2, Graph.Edgetype.Directed )
		if( e ){
			return done( e )
		}
		e = this.getGraph().getEdge( v1, v2, Graph.Edgetype.Bidirected )
		if( e ){
			return done( e )
		}
		e = this.getGraph().getEdge( v2, v1, Graph.Edgetype.Directed )
		if( e ){
			this.getObservedGraph().addEdge( v1, v2, Graph.Edgetype.Bidirected )
			return done( e )
		} else {
			this.getObservedGraph().addEdge( v1, v2, Graph.Edgetype.Directed )
			return done()
		}
	},
	/* 
		Handler that is called when an edge is clicked on. Cycles through the available types of edges.
		For now, I do not support undirected edges.
	*/
	toggleEdgeBetween : function( v1, v2 ){ 
		var edgeType = [ Graph.Edgetype.Directed, Graph.Edgetype.Bidirected,  Graph.Edgetype.Directed ]
		var edgeReversed = [false, false, true]
		var e, newe
		var i=0
		var v3

		// Search for already existing edge and delete it
		for (;i<edgeType.length;i++) {
			if( edgeReversed[i] ){
				e = this.getGraph().getEdge( v2, v1, edgeType[i] )
			} else {
				e = this.getGraph().getEdge( v1, v2, edgeType[i] )
			}
			if( e ){
				this.getObservedGraph().deleteEdge( e.v1, e.v2, e.directed )
				break
			}
		}
		
		// No previous edge; just add directed edge
		if (i >= edgeType.length) {
			newe = this.getObservedGraph().addEdge( v1, v2, Graph.Edgetype.Directed )
		} else {
			// previous edge exists, add new edge
			if( edgeReversed[(i+1) % edgeType.length] ){
				v3 = v1; v1 = v2; v2 = v3
			}
			newe = this.getObservedGraph().addEdge( v1, v2, edgeType[(i+1) % edgeType.length] )
		}
		
		if (newe && e) {
			newe.layout_pos_x = e.layout_pos_x
			newe.layout_pos_y = e.layout_pos_y
			this.graphChanged()
		}
		return newe
	},
	deleteAnyEdge : function( v1, v2 ){
		var edgeType = [ Graph.Edgetype.Directed,  Graph.Edgetype.Bidirected ]
		var i, et, any = false
		for( i = 0 ; i < edgeType.length ; i++ ){
			et = edgeType[i]
			any = any || this.getObservedGraph().deleteEdge( v1, v2, et )
			any = any || this.getObservedGraph().deleteEdge( v2, v1, et )
		}
		if( any ){ this.graphChanged() }
	},
	deleteVertex : function( v ){
		if( this.getGraph().getVertex(v) ){
			this.getObservedGraph().deleteVertex( v )
		}
	},
	renameVertex : function( vold, vnew ){
		if(  this.getGraph().getVertex(vold) &&
			!this.getGraph().getVertex(vnew) ){
			this.getObservedGraph().renameVertex( vold, vnew )
		}
	},
	newVertex : function( id, x, y ){
		this.getObservedGraph().addVertex( 
			new Graph.Vertex( { id : id, 
				layout_pos_x : x, 
				layout_pos_y : y } ) )
	},
	hasVertexProperty : function( _v, p ){
		var v = this.graph.getVertex(_v)
		if( v ){
			var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length) 
			return this.getGraph()["is"+pcamel](v)
		}
	},
	toggleVertexProperty : function( _v, p ){
		var v = this.graph.getVertex(_v)
		if( v ){
			if( this.hasVertexProperty( _v, p ) ){
				this.unsetVertexProperty( _v, p )
			} else {
				this.setVertexProperty( _v, p )
			}
		}
	},
	unsetVertexProperty : function( _v, p ){
		var v = this.graph.getVertex(_v)
		if( v ){
			var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length)
			this.getObservedGraph()["remove"+pcamel](v)
		}
	},
	setVertexProperty : function( _v, p ){
		var v = this.graph.getVertex(_v)
		if( v ){
			var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length) 
			// at the moment, just one property at a time
			_.each(["Source","Target","AdjustedNode","LatentNode"],function(pc){
				this.getGraph()["remove"+pc](v)
			},this)
			this.getObservedGraph()["add"+pcamel](v)
		}
	},
	unmarkVertex : function(){
		this.view.unmarkVertex()
	}
})

var DAGitty = {
	makeController : function( el, op ){
		for( var k of Object.keys( el.dataset ) ){
			if( !op.hasOwnProperty( k ) ){
				op[k] = JSON.parse(el.dataset[k])
			}
		}
		if( !("interactive" in op) ){
			op.interactive = true
		}
		if( !("mutable" in op) ){
			op.mutable = false
		}
		var c = new DAGittyController( op )
		this.controllers.push( c )
		if( el.id ){
			this.controllers_by_id[el.id] = c
		}
		return c
	},
	setup : function( op ){
		if( !op ){ op = {} }
		if( this.setupCalled && !op.force ){ return }
		this.controllers = []
		this.controllers_by_id = []
		var el, c
		if( op.el ){
			el = document.getElementById( op.el )
			if( el ){
				return makeController( el, op )
			}
		} else {
			var tags = op.tags || ["div", "pre"]
			for( var j = 0 ; j < tags.length ; j ++ ){
				var divs = document.getElementsByTagName( tags[j] )
				var re = new RegExp("\\bdagitty\\b")
				for( var i = 0 ; i < divs.length ; i ++ ){
					el = divs.item(i)
					if( re.test(el.className) ){
						// some styles are added automatically to the container
						// inside the constructor of the view (GraphGUI_View.js)
						op.canvas = el
						this.makeController( el, Object.assign({},op) )
					}
				}
			}
			this.setupCalled = true
		}
	},
	get : function( id ){
		return this.controllers_by_id[id]
	},
	resize : function(){
		for( var i = 0 ; i < DAGitty.controllers.length ; i ++ ){
			DAGitty.controllers[i].getView().resize()
		}
	},
	Math : {
		distance : function( x1, y1, x2, y2 ){
			return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
		},
		anglerad : function( x1, y1, x2, y2 ){
			if( x1 < x2 ){
				return Math.asin((y2-y1)/this.distance(x1, y1, x2, y2))
			} else {
				return Math.PI - Math.asin((y2-y1)/this.distance(x1, y1, x2, y2))
			}
		},
		angle : function( x1, y1, x2, y2 ){
			return this.anglerad( x1, y1, x2, y2 )*360./(Math.PI * 2.)
		},
		ellipseAnchorPoint : function( cx, cy, rx, ry, tx, ty ){
			var tanth = (cy-ty)/(cx==tx ? 0.00001 : cx-tx)
			var x = rx * ry / Math.sqrt( ry * ry + rx * rx * tanth * tanth )
			if( tx > cx ){
				x = -x
			}
			var y = tanth * x
			return [cx-x, cy-y]
		},
		svgEdgeAnchor : function( el, reverse, edgetype ){
			var v = ["v1","v2"]
			if( reverse == 1 ){ 
				v = ["v2","v1"]
			}
			var svgpath = el[v[0]].dom.firstChild, svgpoint
			try{
				var svglength = svgpath.getTotalLength()
				var dx = (el.cx||el[v[1]].x)-el[v[0]].x,
					dy = (el.cy||el[v[1]].y)-el[v[0]].y
				var l = Math.sqrt( dx*dx+dy*dy )
				if( l < 0.01 ){ l = 0.01 }
				if( dy > 0 ){
					svgpoint = svgpath.getPointAtLength( 
						Math.acos( dx / l ) / 2. / Math.PI * svglength )
				} else {
					svgpoint = svgpath.getPointAtLength( 
						(1.-Math.acos( dx / l ) / 2. / Math.PI) * svglength )
				}
				var lp = Math.sqrt(svgpoint.x*svgpoint.x+svgpoint.y*svgpoint.y)
				var elongate = (lp+5) / lp
				if( edgetype == Graph.Edgetype.Undirected || 
					( edgetype == Graph.Edgetype.Directed && reverse == 0 ) ){
					elongate = 1
				}
				return [svgpoint.x*elongate+el[v[0]].x,
					svgpoint.y*elongate+el[v[0]].y]
			} catch( e ){
				return [0,0]
			}
		}
	},
	stylesheets : {
		"default" : {
			style : {
				node : {
					"d" : "M 0 0 m 20, 0 a 20,15 0 1,1 -40,0 a 20,15 0 1,1 40,0",
					fill: "#aaaaaa",
					stroke : "#666666"
				},
				exposurenode : { fill : "#bed403", stroke : "#000000" },
				outcomenode : { fill : "#00a2e0", stroke : "#000000" },
				adjustednode : { fill : "#ffffff", stroke : "#000000" },
				latentnode : { fill : "#eeeeee", stroke : "#cccccc" },
				confoundernode : { fill : "#ff7777", stroke : "#ff7777" },
				anexposurenode : { fill : "#bed403", stroke : "#bed403" },
				anoutcomenode : { fill : "#00a2e0", stroke : "#00a2e0" },
				nodelabel : { y: 35, "text-anchor" : "middle" },
				nodelabelbg : { fill: "#ffffff" },
				path : { stroke : "black", "stroke-width": 1.5, fill : "none" },
				causalpath : { stroke : "green" },
				biasingpath : { stroke : "red" }
			},
			decoration : {
				exposurenode : [ {d:"M-4,-6L7,0L-4,6Z", fill:"#000000"} ],
				outcomenode : [ {d:"M-2,-6L2,-6L2,6L-2,6Z", fill:"#000000"} ],
				directedpath : [ { "class" : "arrowfront", "d": "M-1,0L15,5L15,-5Z", fill : "white" } ],
				bidirectedpath : [
					{ "class" : "arrowfront", "d": "M-1,0L15,5L15,-5Z", fill : "white" },
					{ "class" : "arrowback", "d": "M-1,0L15,5L15,-5Z", fill : "white" }
				]
			}
		}
	}
}

