/* DAGitty - a browser-based software for causal modelling and analysis
 *   Copyright (C) 2010-2022 Johannes Textor, Benito van der Zander
 * 
 *   This program is free software; you can redistribute it and/or
 *   modify it under the terms of the GNU General Public License
 *   as published by the Free Software Foundation; either version 2
 *   of the License, or (at your option) any later version.
 * 
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 * 
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, write to the Free Software
 *   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA. */

/* globals Hash,GraphGUI_SVG,Graph,GraphTransformer,Class,_ */
/* exported DAGittyGraphView */

var DAGittyGraphView = Class.extend({
	init : function( el, graph, controller, obj ){
		// el -> parent element to hook into
		// graph -> graph object to use (model)
		// controller -> controller to send commands to 
		// obj -> further options
		//    autofocus -> if true, will set an event handler giving
		//                 focus to the container on mouse entry
		
		this.setContainer(el)
		this.setGraph(graph)
		this.setController(controller)
		
		var c = this.getContainer()
		
		c.style.userSelect = "none"
		c.style.whiteSpace="normal"
		c.style.textAlign="center"
		this.width = c.offsetWidth-4
		this.height = c.offsetHeight-4
		c.setAttribute("tabindex",0)

		c.style.WebkitUserSelect = "none"
		c.style.MozUserSelect = "none"
		c.style.MsUserSelect = "none"
		c.style.UserSelect = "none"
		
		if( getComputedStyle( c ).getPropertyValue("position") != "absolute" ){
			c.style.position = "relative"
		}
		
		el.innerHTML = ""
		this.impl = new GraphGUI_SVG( c, this.width, this.height, {
			interactive : obj.interactive
		} )

		if( ! (obj.interactive === false || obj.mutable===false) ){
			this.initEventListeners(obj)
		}

		// We always pass on the "vertex_marked" event if available
		this.impl.setEventListener( "vertex_marked", 
			_.bind( function(v){ this.callEventListener( "vertex_marked", [v] ) }, this ) )

		this.view_mode = "normal"
		this.bias_mode = "normal"
		this.drawGraph()
	},

	initEventListeners : function(obj){
		this.impl.setEventListener( "vertex_drag", _.bind( function( vs ){
			var g_coords = this.toGraphCoordinate( vs.x, vs.y )
			vs.v.layout_pos_x = g_coords[0] // changes model
			vs.v.layout_pos_y = g_coords[1] // changes model
			if( this.getViewMode() != "normal" ){
				var v = this.getGraph().getVertex(vs.v.id)
				v.layout_pos_x = g_coords[0]
				v.layout_pos_y = g_coords[1]
			}
		}, this ) )

		this.impl.setEventListener( "edge_drag", _.bind( function( es ){
			var g_coords = this.toGraphCoordinate( es.cx, es.cy )
			es.e.layout_pos_x = g_coords[0] // changes model
			es.e.layout_pos_y = g_coords[1] // changes model
		}, this ) )

		this.impl.setEventListener( "drag_end", _.bind( function(){
			this.getController().graphLayoutChanged()}, this ) )

		this.impl.setEventListener( "vertex_connect", 
			_.bind( this.connectVertices, this ) )	

		this.registerEventListeners( obj?obj.autofocus:false )
	},

	setStyle : function( sheetname ){
		this.impl && this.impl.setStyle( sheetname )
	},
	getStyle : function(){
		if( this.impl ){
			return this.impl.getStyle()
		} else {
			return null
		}
	},
	getGraph : function(){
		return this.graph
	},
	setGraph : function( graph ){
		this.setCoordinateSystemValid( false )
		this.graph=graph
	},
	getContainer : function(){
		return this.container
	},
	setContainer : function( container ){
		this.container=container
	},
	getController : function(){
		return this.controller
	},
	setController : function( controller ){
		this.controller=controller
	},
	getCurrentVertex : function(){
		var el = this.getImplementation().getLastHoveredElement()
		if( el && el.vertex ){
			return el.vertex
		} 
		el = this.getImplementation().getMarkedVertex()
		if( el ){
			return el
		}
		return void(0)
	},
	getCurrentEdge : function(){
		var el = this.impl.getLastHoveredElement()
		if( el && el.edge ){
			return el.edge
		} else {
			return void(0)
		}
	},
	registerEventListeners : function( autofocus ){
		/* register event handlers on canvas */
		var myself = this, mycontainer = myself.getContainer()
		
		var boundClickHandler = _.bind( this.clickHandler, this )
		this.getContainer().addEventListener( "click", boundClickHandler )
		
		if( autofocus ){
			var f = function(){ if(!mycontainer.contains( document.activeElement )){ 
				mycontainer.focus() } }
			this.getContainer().addEventListener( "mouseenter", f )
			this.getContainer().addEventListener( "touchenter", f )
		}
		
		this.getContainer().addEventListener( "keydown", function(e){ myself.keydownHandler(e) } )
	},

	clickHandler : function(e){
		// click handler can be set to emulate keypress action
		// using this function
		this.last_click_x = e.offsetX
		this.last_click_y = e.offsetY
		this.last_click_g_coords = this.toGraphCoordinate( this.last_click_x, this.last_click_y )
		this.newVertexDialog() 
	},

	unmarkVertex : function(){
		this.impl.unmarkVertexShape()
	},

	toggleVertexProperty : function( v, prop ){
		// this will trigger a redraw
		this.getController().toggleVertexProperty( v, prop ) 
		this.impl.unmarkVertexShape()
	},

	keydownHandler : function(e){
		if( this.dialogOpen() ) return
		var v = this.getCurrentVertex()
		var es = this.getCurrentEdge()
		switch( e.keyCode ){
		case 8: // backspace
		case 46: //del
		case 65: //a
			if(v) this.toggleVertexProperty(v,"adjustedNode")
			break
		case 66: //b
			if(v) this.impl.touchVertexShape( this.getVertexShape(v.id), e, true )
			break
		case 67: //c
			if(v) this.impl.touchVertexShape( this.getVertexShape(v.id), e )
			break
		case 68: //d
			if(v) this.getController().deleteVertex(v)
			if(es) this.getController().deleteAnyEdge(es.v1.id, es.v2.id)
			break
		case 69: //e
			if(v) this.toggleVertexProperty(v,"source")
			break
		case 78: //n
			this.newVertexDialog()
			e.stopPropagation()
			e.preventDefault()
			break
		case 79: //o
			if(v) this.toggleVertexProperty(v,"target")
			break
		case 82: //r
			if(v){
				this.renameVertexDialog()
				e.stopPropagation()
				e.preventDefault()
			}
			break
		case 83: //s
			if(v) this.toggleVertexProperty(v,"selectedNode")
			break
		case 85: //u
			if(v) this.toggleVertexProperty(v,"latentNode")
			break
		}
	},

	getImplementation : function(){
		return this.impl
	},

	callEventListener : function( event_name, args ){
		var en = event_name+"_listener"
		if( typeof this[en] == "function" ){
			this[en].apply( this, args )
		}
	},

	setEventListener : function( event_name, f ){
		this[event_name+"_listener"] = f
	},


	resize : function(){
		var newwidth = this.getContainer().offsetWidth-4,
			newheight = this.getContainer().offsetHeight-4
		if( this.width != newwidth || this.height != newheight ){
			this.setCoordinateSystemValid( false )
			this.width = newwidth
			this.height = newheight
			this.impl.resize( this.width, this.height )
			this.drawGraph()
		}
	},
	getBiasMode : function(){
		return this.bias_mode
	},
	setBiasMode : function( m ){
		if( this.bias_mode === m ){
			return
		}
		this.bias_mode = m
		this.drawGraph()
	},

	getViewMode : function(){
		return this.view_mode
	},
	setViewMode : function( m ){
		if( this.view_mode === m ){
			return
		}
		this.view_mode = m
		this.drawGraph()
	},

	connectVertices : function( v1, v2, bidi ){
		if( this.dialogOpen() ){ return }
		if( v1 == v2 ) return

		if (bidi) this.getController().toggleEdgeBidi( v1, v2 )
		else this.lastEdge = this.getController().toggleEdgeFromTo( v1, v2, bidi )
	},
	newVertex : function( n ){
		if( !n ){
			this.dialogErrorMessage( "Please enter the variable name!")
			return
		}
		// sanitize -> no longer needed
		n = n.replace(/^\s+|\s+$/g,"") //.replace( /\s+/g, "_" )
		var v = this.graph.getVertex( n )
		if( v ){
			this.dialogErrorMessage( "The variable "+n+" already exists!")
			return
		}
		this.getController().newVertex( n, this.last_click_g_coords[0], this.last_click_g_coords[1] )
		this.closeDialog()
	},
	renameVertex : function( n, v ){
		if( !n ){
			this.dialogErrorMessage( "Please enter the variable name!")
			return
		}
		// var v = this.getCurrentVertex()
		// sanitize -> no longer needed
		//n.replace( /\s+/, "_" )
		if( !v || (n === v.id) ){ return }
		if( this.getGraph().getVertex( n ) ){
			this.dialogErrorMessage( "The variable "+n+" already exists!")
			return
		}
		this.getController().renameVertex( v.id, n )
		this.closeDialog()
	},
	closeDialog : function(){
		if( this.current_dialog ){
			this.getContainer().removeChild( this.current_dialog.dom )
			this.getContainer().focus()
		}
		delete this.current_dialog
	},
	// This is meant to display an error message in an already open
	// dialog.
	dialogErrorMessage : function( m ){
		if( this.current_dialog ){
			this.current_dialog.error_message_field.innerHTML = m
		}
	},
	openHTMLDialog : function(h, button_text){
		this.closeDialog()
		var el = function(n){return document.createElement(n)}
		var txt = function(el,t){el.appendChild( document.createTextNode(t) ) }
		var myself = this
		var qdiv = el( "div" )
		qdiv.className="dialogwin"
		qdiv.appendChild( el("p") )
		var qform = el( "form" )
		qform.setAttribute( "name", "newvertexform" )
		qform.onsubmit = function(){return false}
		var qf = el("p")
		qf.innerHTML = h
		qform.appendChild(qf)
		if( button_text ){
			qform.appendChild(el("br"))
			qf = el("button")
			qf.setAttribute( "type", "button" )
			txt(qf,"OK")
			qf.onclick = function(){myself.closeDialog()}
			qform.appendChild(document.createTextNode(" "))
			qform.appendChild(qf)
		}
		qdiv.appendChild(qform)
		this.getContainer().appendChild( qdiv )
		this.current_dialog = { 
			dom : qdiv
		}
		qdiv.onclick=function(e){e.stopPropagation()}
	},
	openAlertDialog : function(t){
		this.closeDialog()
		var el = function(n){return document.createElement(n)}
		var txt = function(el,t){el.appendChild( document.createTextNode(t) ) }
		var myself = this
		var qdiv = el( "div" )
		qdiv.className="dialogwin"
		qdiv.appendChild( el("p") )
		var qform = el( "form" )
		qform.setAttribute( "name", "newvertexform" )
		qform.onsubmit = function(){return false}
		var qf = el("p")
		txt(qf,t)
		qform.appendChild(qf)
		qform.appendChild(el("br"))
		qf = el("button")
		qf.setAttribute("type","button")
		txt(qf,"OK")
		qf.onclick = function(){myself.closeDialog()}
		qform.appendChild(document.createTextNode(" "))
		qform.appendChild(qf)
		qdiv.appendChild(qform)
		this.getContainer().appendChild( qdiv )
		this.current_dialog = { 
			dom : qdiv
		}
		qf.focus()
		qdiv.onclick=function(e){e.stopPropagation()}
	},
	// t : text ; v : default value ; f : callback when clicked "OK"
	openPromptDialog : function(t,v,f){
		this.closeDialog()
		var el = function(n){return document.createElement(n)}
		var txt = function(el,t){el.appendChild( document.createTextNode(t) ) }
		var myself = this
		var qdiv = el( "div" )
		qdiv.className="dialogwin"
		qdiv.style.width="100%"
		qdiv.style.height="100%"
		qdiv.style.position="absolute"
		qdiv.style.backgroundColor="#999"
		qdiv.style.textAlign="center"
		qdiv.style.top="0px"
		qdiv.style.left="0px"
		qdiv.style.opacity=".9"
		
		qdiv.appendChild( el("p") )
		var qform = el( "form" )
		qform.setAttribute( "name", "newvertexform" )
		var qf = el("label")
		qf.style.fontFamily = "sans-serif"
		qf.setAttribute("for","vertexname")
		txt(qf,t)
		qform.appendChild(qf)
		qform.appendChild(el("br"))
		var qfin = el("input")
		qfin.setAttribute( "type", "text" )
		qfin.setAttribute( "size", 30 )
		qfin.setAttribute( "maxlength", 255 )
		qfin.setAttribute( "value", v )	
		if( v.length > 0 ){
			qfin.setSelectionRange( 0, v.length )
		}
		qform.appendChild(qfin)
		qform.appendChild(el("br"))
		var qferr = el("span")
		qferr.className="err"
		qform.appendChild( qferr )
		qform.appendChild(el("br"))
		qf = el("button")
		qf.setAttribute("type","submit")
		txt(qf,"OK")
		qf.onclick = function(){ 
			f.call(myself,qfin.value)
		}
		qform.onsubmit = function(){qf.onclick(); return false}
		qform.appendChild(qf)
		var qfc = el("button")
		qfc.setAttribute("type","button")
		txt(qfc,"Cancel")
		qfc.onclick = function(){myself.closeDialog()}
		qform.appendChild(document.createTextNode(" "))
		qform.appendChild(qfc)
		qdiv.appendChild(qform)
		this.getContainer().appendChild( qdiv )
		this.current_dialog = { 
			dom : qdiv,
			error_message_field : qferr
		}
		qfin.focus()
		qdiv.onclick=function(e){e.stopPropagation()}
	},
	dialogOpen : function(){
		return this.current_dialog !== undefined
	},
	newVertexDialog : function(){
		var i=1
		if( !this.dialogOpen() ){
			while( this.getGraph().getVertex("v"+i) ){ i++ }
			this.openPromptDialog( "name of the new variable:", "v"+i, this.newVertex )
		}
	},
	renameVertexDialog : function( vid ){
		var myself = this, v
		if( vid ){
			v = this.getGraph().getVertex(vid)
		} else {
			v = this.getCurrentVertex()
		}
		if( !this.dialogOpen() && v ){
			this.openPromptDialog( "rename variable:", v.id, function(n){ myself.renameVertex( n, v ) } )
		}
	},
	isCoordinateSystemValid : function(){
		return this.coordinate_system_valid
	},
	setCoordinateSystemValid : function(b){
		this.coordinate_system_valid = b
	},
	initializeCoordinateSystem : function( g ){
		var bb = g.getBoundingBox()
		if( bb ){
			this.bounds = [bb[0],bb[2],bb[1],bb[3]]
		} else {
			if( this.isCoordinateSystemValid() ){ return }
			var min_x = Infinity, max_x = -Infinity, min_y = Infinity, max_y = -Infinity
			var vv = g.getVertices()
			for( var i = 0 ; i < vv.length ; i ++ ){
				min_x = vv[i].layout_pos_x < min_x ? vv[i].layout_pos_x : min_x
				min_y = vv[i].layout_pos_y < min_y ? vv[i].layout_pos_y : min_y
				max_x = vv[i].layout_pos_x > max_x ? vv[i].layout_pos_x : max_x
				max_y = vv[i].layout_pos_y > max_y ? vv[i].layout_pos_y : max_y
			}
			if( max_x == min_x ){ max_x = min_x + 1 }
			if( max_y == min_y ){ max_y = min_y + 1 }
			var xpad=50/this.width*(max_x-min_x)
			var ypad=80/this.height*(max_y-min_y)
			this.bounds = [min_x-xpad,max_x+xpad,min_y-ypad,max_y+ypad]
		}
		this.setCoordinateSystemValid( true )
	},
	toScreenCoordinate : function( x, y ){
		return [(x-this.bounds[0])/(this.bounds[1]-this.bounds[0])*this.width,
			(y-this.bounds[2])/(this.bounds[3]-this.bounds[2])*this.height]
	},
	toGraphCoordinate : function( x, y ){
		return [x/this.width*(this.bounds[1]-this.bounds[0])+this.bounds[0],
			y/this.height*(this.bounds[3]-this.bounds[2])+this.bounds[2]]
	},
	getVertexShape : function( vid ){
		return this.vertex_shapes.get( vid )
	},
	drawGraph : function(){
		var g,i,c,bias_opts = {direct:false}
		var g_causal = new Graph()
		var g_bias = new Graph()
		var g_selection_bias = new Graph()
		var g_trr = new Graph()

		var g_an = GraphTransformer.ancestorGraph(
				GraphTransformer.backDoorGraph(
					this.getGraph() ) )

		switch( this.getViewMode() ){
		case "moral" : 
			if( this.graph.getSources().length > 0 && this.graph.getTargets().length > 0 ){
				g = GraphTransformer.moralGraph( g_an )
			} else {
				g = new Graph()
			}
			break
		case "dependency" : 
			g = GraphTransformer.dependencyGraph( this.getGraph() )
			break
		case "equivalence" :
			g = GraphTransformer.dagToCpdag( this.getGraph() )
			break
		case "causalodds":
			g = this.getGraph()
			g_causal = GraphTransformer.causalFlowGraph(g)
			break
		default:
			g = this.getGraph()
			g_trr = GraphTransformer.transitiveReduction( g )
			if( g.getSources().length > 0 && g.getTargets().length > 0 ){
				g_causal = GraphTransformer.causalFlowGraph(g)
				g_bias = GraphTransformer.activeBiasGraph(g,bias_opts)
				switch( this.getBiasMode() ){
					case "causalodds":
						if( g.getSources().length == 1 && g.getTargets().length == 1 && g.getSelectedNodes().length == 1 ){
							g_bias = GraphTransformer.activeSelectionBiasGraph( g, g.getSources()[0], g.getTargets()[0], g.getSelectedNodes() )
						}
						break
					case "direct":
						g_bias = GraphTransformer.activeBiasGraph(g,{direct:true})
						break
					default:
						g_bias = GraphTransformer.activeBiasGraph(g)
				}
			}
		}

		this.initializeCoordinateSystem( g )
		
		var vv = g.getVertices()
		this.impl.suspendRedraw( 50000 )
		this.impl.clear()

		this.edge_shapes = new Hash()		
		this.vertex_shapes = new Hash()
		
		var ean_ids = {}
		_.each(g_an.ancestorsOf( g_an.getSources() ),function(v){ean_ids[v.id]=1})
		var oan_ids = {}
		_.each(g_an.ancestorsOf( g_an.getTargets() ),function(v){oan_ids[v.id]=1})

		for( i = 0 ; i < vv.length ; i ++ ){
			c = this.toScreenCoordinate( vv[i].layout_pos_x, vv[i].layout_pos_y )
			var vs = { id: vv[i].id, 
				x : c[0],
				y : c[1],
				adjacent_edges : [],
				v : vv[i] }

			var vertex_type = ""			
			if( g.isSource(vv[i]) ){
				vertex_type = "exposure"
			} else if( g.isTarget(vv[i]) ){
				vertex_type = "outcome"
			} else if( g.isAdjustedNode(vv[i]) ){
				vertex_type = "adjusted"
			} else if( g.isSelectedNode(vv[i]) ){ 
				vertex_type = "selected"
			} else if( g.isLatentNode(vv[i]) ){
				vertex_type = "latent"
			} else if( ean_ids[vv[i].id]
				&& oan_ids[vv[i].id] ){
				vertex_type = "confounder"
			} else if( ean_ids[vv[i].id] ){
				vertex_type = "anexposure"
			} else if( oan_ids[vv[i].id] ){
				vertex_type = "anoutcome"
			}			
			this.impl.createVertexShape( vertex_type, vs )
			this.vertex_shapes.set( vv[i].id, vs )
		}
		this.impl.appendShapes( this.vertex_shapes.values() )
		this.impl.appendTextBackgrounds( this.vertex_shapes.values() )
		
		var ee = g.getEdges()
		for( i = 0 ; i < ee.length ; i ++ ){
			c = this.toScreenCoordinate( ee[i].v1.layout_pos_x, ee[i].v1.layout_pos_y ) 
			
			var es = { 
				v1 : this.getVertexShape( ee[i].v1.id ), 
				v2 : this.getVertexShape( ee[i].v2.id ),
				directed : ee[i].directed,
				e: ee[i]
			}

			if( ee[i].layout_pos_x ){
				var s_coord = this.toScreenCoordinate( ee[i].layout_pos_x,
					ee[i].layout_pos_y )
				es.cx = s_coord[0]
				es.cy = s_coord[1]
			}

			var edgetypes = []
			switch( ee[i].directed ){
			case 0 : edgetypes.push("undirected")
				break
			case 1 : edgetypes.push("directed")
				break
			case 2 : edgetypes.push("bidirected")
				break
			}

			if( g_causal.getEdge( ee[i].v1, ee[i].v2, ee[i].directed ) ){
				edgetypes.push( "causal" )
			}
			
			if( g_bias.getEdge( ee[i].v1, ee[i].v2, ee[i].directed ) ){
				edgetypes.push( "biasing" )
			}

			if( g_trr.getEdge( ee[i].v1, ee[i].v2 ) ){
				edgetypes.push( "puredirect" )
			}
			
			this.impl.createEdgeShape( edgetypes.join(" "), es )
			this.edge_shapes.set( ee[i].v1.id+"\0"+ee[i].v2.id+"\0"+ee[i].directed, es )
			es.v1.adjacent_edges.push( es )
			es.v2.adjacent_edges.push( es )
		}
		this.impl.prependShapes( this.edge_shapes.values() )
		this.impl.unsuspendRedraw()
	}
})
