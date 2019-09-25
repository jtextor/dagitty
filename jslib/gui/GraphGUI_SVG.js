
/* globals DAGitty,Class,_ */
/* exported GraphGUI_SVG */

var svgns = "http://www.w3.org/2000/svg"

var GraphGUI_SVG = Class.extend({
	init : function( canvas_element, width, height, style ){
		if( !style ){
			style = "default"
		}
		// create SVG root element
		var svg = document.createElementNS( svgns, "svg" ) // don't need to pass in 'true'
		svg.setAttribute( "width", width )
		svg.setAttribute( "height", height )
		svg.setAttribute( "style", "font-family: Arial, sans-serif" )
		canvas_element.appendChild( svg )
		this.container = canvas_element
		this.setStyle(style)
		this.svg = svg

		_.map( ["touchmove","mouseup","mousemove","mouseleave","click"],
			function(x){ svg.addEventListener( x, _.bind( this[x+"Handler"], this ) ) },
			this )
	},

	getStyle : function(){
		return this.style
	},
	setStyle : function( stylename ){
		if( DAGitty.stylesheets[stylename] ){
			this.style = DAGitty.stylesheets[stylename]
		} else {
			this.style = DAGitty.stylesheets["default"]
		}
	},
	clear : function(){
		while( this.svg.firstChild ) this.svg.removeChild( this.svg.firstChild )
		_.defer( _.bind( this.unmarkVertexShape, this ) )
	},
	/* SVG elements for edges and vertices need to be first "created", and then "anchored".
	 * This is because SVG supports no real Z index, so we need to first create the edge shapes
	 * and then the vertex shapes. However to know the edge anchor points, we need to know the 
	 * vertex positions first. To solve this, we first create the DOM elements for edges,
	 * then for vertices, and finally we set the attributes for edges that define their actual
	 * positions. 
	 *
	 * @parameter edge_type : a space-separated string containing edgetype information, e.g.
	 *                        "directed causal" or "bidirected biasing" or "undirected".
	 * @parameter el : parent DOM element to append newly created SVG elements to
	 * 
	 */
	createEdgeShape : function( edge_type, el ){
		var e = document.createElementNS( svgns, "path" ), i, j, f, pathclass
		
		el.dom = document.createElementNS( svgns, "g" )
		el.dom.setAttribute("class", "path")

		var sty = this.getStyle()
		var finalstyle = {}
		
		// create edge line
		var edge_types_a = [""].concat(edge_type.split(" "))
		for( i = 0 ; i < edge_types_a.length ; i ++ ){
			pathclass = edge_types_a[i]+"path"
			for( j in sty.style[pathclass] ){
				if( sty.style[pathclass].hasOwnProperty( j ) ){
					finalstyle[j] = sty.style[pathclass][j]
				}
			}
		}
		for( j in finalstyle ){
			e.setAttribute( j, finalstyle[j] )
		}
		el.dom.appendChild( e )

		// create arrowheads and perhaps other decorations
		for( i = 0 ; i < edge_types_a.length ; i ++ ){
			pathclass = edge_types_a[i]+"path"
			if( sty.decoration[pathclass] ){
				j=0
				while( sty.decoration[pathclass][j] ){
					e = document.createElementNS( svgns, "path" )
					for( f in finalstyle ){
						e.setAttribute( f, finalstyle[f] )
					}
					for( f in sty.decoration[pathclass][j] ){
						e.setAttribute( f, sty.decoration[pathclass][j][f] )
					}
					el.dom.appendChild( e )
					j++
				}
			}
		}

		this.anchorEdgeShape( el )
		el.dom.style.cursor = "move"

		el.dom.addEventListener( "touchstart",
			_.bind( function(e){ 
				this.touchEdgeShape( el, e.changedTouches[0] )
				e.preventDefault()
			}, this ) )

		el.dom.addEventListener( "touchend",
			_.bind( function(e){ 
				var v = this.getLastTouchedElement()
				if( v ){
					for( var i = 0 ; i < e.changedTouches.length ; i ++ ){
						if( e.changedTouches[i].identifier == v.last_touch ){
							this.stopMousemove()
						}
					}
				}
			}, this ) )

		el.dom.addEventListener( "mousedown",
			_.bind( function(e){ 
				this.touchEdgeShape( el, e ) 
			}, this ) )
		
		el.dom.addEventListener( "mouseover", _.bind(
			function(){ this.last_hovered_element={edge:el.e} }, this
		) )

		el.dom.addEventListener( "mouseout", _.bind(
			this.unsetLastHoveredElement, this ) )

	},
	anchorEdgeShape : function( el ){
		var anchorback = DAGitty.Math.svgEdgeAnchor( el, 0, el.directed )
		el.x1 = anchorback[0]; el.y1 = anchorback[1]
		
		var anchorfront = DAGitty.Math.svgEdgeAnchor( el, 1., el.directed )
		el.x2 = anchorfront[0]; el.y2 = anchorfront[1]
		
		if( el.cx ){
			// (el.cx, el.cy) are the anchor points of the quadratic spline for bent edges
			el.dom.firstChild.setAttribute( "d", "M"+el.x1.toFixed(2)+","+el.y1.toFixed(2)
				+"Q"+el.cx.toFixed(2)+","+el.cy.toFixed(2)
				+" "+el.x2.toFixed(2)+","+el.y2.toFixed(2) )
		} else {
			// otherwise we just draw a straight line
			el.dom.firstChild.setAttribute( "d", "M"+el.x1.toFixed(2)+","+el.y1.toFixed(2)
				+"L"+el.x2.toFixed(2)+","+el.y2.toFixed(2) )
		}
		
		// display front and/or back arrows
		var sx, sy, afront, aback
		
		for( var i = 0 ; i < el.dom.childNodes.length ; i ++ ){
			if( el.dom.childNodes.item(i).getAttribute("class") == "arrowfront" ){
				sx = el.cx||el.x1; sy = el.cy||el.y1
				afront = 360*Math.atan( (el.y2-sy)/(el.x2-sx) )/2/Math.PI
				if( sx<el.x2 ) afront += 180
				if( sx == el.x2 ) afront = el.y2 > sy ? -90 : 90
				el.dom.childNodes.item(i).setAttribute( "transform", "translate("+el.x2+","+el.y2+") rotate("+afront+")" )
			}
			if( el.dom.childNodes.item(i).getAttribute("class") == "arrowback" ){
				sx = el.cx||el.x2; sy = el.cy||el.y2
				aback = 360*Math.atan( (el.y1-sy)/(el.x1-sx) )/2/Math.PI
				if( sx<el.x1 ) aback += 180
				if( sx == el.x1 ) aback = el.y1 > sy ? -90 : 90
				el.dom.childNodes.item(i).setAttribute( "transform", "translate("+el.x1+","+el.y1+") rotate("+aback+")" )
			}
		}
	},
	createVertexShape : function( vertex_type, el ){
		var e = document.createElementNS( svgns, "path" ), f, i
		
		el.dom = document.createElementNS( svgns, "g" )
		e.setAttribute( "fill-opacity", 0.7 )
		e.setAttribute( "stroke-width", 2 )
		e.setAttribute( "z-index", 1 )

		var sty = this.getStyle()
		
		// First set default node style, then apply more specific settings
		var iobj = { "" : 0 }; iobj[vertex_type] = 0
		for( var vtype in iobj ){
			for( f in sty.style[vtype+"node"] ){
				if( f == "d" && sty.style[vtype+"node"][f].indexOf("[") !== -1 ){
					el.pathtemplate = sty.style[vtype+"node"][f]
				} else {
					e.setAttribute( f, sty.style[vtype+"node"][f] )
				}
			}
		}
		el.dom.appendChild( e )
		
		var rect = document.createElementNS( svgns, "rect" )
		rect.setAttribute("class", "textbg" )
		// First set default node style
		for( f in sty.style["nodelabelbg"] ){
			rect.setAttribute( f, sty.style["nodelabelbg"][f] )
		}
		// Then apply more specific settings
		for( f in sty.style[vertex_type+"nodelabelbg"] ){
			rect.setAttribute( f, sty.style[vertex_type+"nodelabelbg"][f])
		}
		el.dom.appendChild( rect )
		
		var elabel = document.createElementNS( svgns, "text" )
		// First set default node style
		elabel.setAttribute("class","nodelabel")
		for( f in sty.style["nodelabel"] ){
			elabel.setAttribute( f, sty.style["nodelabel"][f] )
		}
		// Then apply more specific settings
		for( f in sty.style[vertex_type+"nodelabel"] ){
			elabel.setAttribute( f, sty.style[vertex_type+"nodelabel"][f])
		}
		elabel.appendChild( document.createTextNode(el.id, true) )
		el.dom.appendChild( elabel )
		
		if( sty.decoration[vertex_type+"node"] ){
			i=0
			while(  sty.decoration[vertex_type+"node"][i] ){
				e = document.createElementNS( svgns, "path" )
				for( f in sty.decoration[vertex_type+"node"][i] ){
					e.setAttribute( f, sty.decoration[vertex_type+"node"][i][f] )
				}
				el.dom.appendChild( e )
				i++
			}
		}
		
		el.dom.style.cursor = "move"
		el.dom.style.touchAction = "none"

		el.dom.addEventListener( "touchstart",
			_.bind( function(e){ 
				this.touchVertexShape( el, e.changedTouches[0] )
				e.preventDefault()
			}, this ) )

		el.dom.addEventListener( "touchend",
			_.bind( function(e){ 
				var v = this.getLastTouchedElement()
				if( v ){
					for( var i = 0 ; i < e.changedTouches.length ; i ++ ){
						if( e.changedTouches[i].identifier == v.last_touch ){
							this.stopMousemove()
						}
					}
				}
			}, this ) )

		el.dom.addEventListener( "mousedown",
			_.bind( function(e){ 
				this.touchVertexShape( el, e )
			}, this ) )

		el.dom.addEventListener( "mouseover", _.bind(
			function(){ this.last_hovered_element={vertex:el.v} }, this
		) )

		el.dom.addEventListener( "mouseout", _.bind(
			this.unsetLastHoveredElement, this
		) )

		this.moveVertexShape( el )
	},
	touchVertexShape : function( el, e ){
		this.last_touched_element = {"vertex" : el, "last_touch" : e.identifier}
		this.start_x = this.pointerX(e)-this.getContainer().offsetLeft
		this.start_y = this.pointerY(e)-this.getContainer().offsetTop
		this.cancel_next_click = true
		if( this.getMarkedVertexShape() == el ){
			this.unmarkVertexShape()
		} else{ 
			this.markVertexShape( el )
		}
	},
	touchEdgeShape : function( el, e ){
		this.last_touched_element = {"edge" : el, "last_touch" : e.identifier}
		this.start_x = this.pointerX(e)-this.getContainer().offsetLeft
		this.start_y = this.pointerY(e)-this.getContainer().offsetTop
		this.cancel_next_click = true
		this.unmarkVertexShape()
	},
	markVertexShape : function( el ){
		var pel = this.getMarkedVertexShape()
		if( pel ){
			if( pel != el ){
				this.callEventListener( "vertex_connect", [pel.v, el.v] )
			}
			this.unmarkVertexShape()
		} else {
			el.dom.firstChild.setAttribute( "stroke-width", 5 )
			el.dom.firstChild.setAttribute( "stroke", "black" )
			el.previous_stroke  = el.dom.firstChild.getAttribute( "stroke", "black" )
			this.marked_vertex_shape = el
			this.callEventListener( "vertex_marked", [el.v] )
		}
	},
	unmarkVertexShape : function( el ){
		if( !el ) el = this.marked_vertex_shape
		if( el && el.dom ){
			el.dom.firstChild.setAttribute( "stroke", el.previous_stroke )
			el.dom.firstChild.setAttribute( "stroke-width", 2 )
		}
		delete this.marked_vertex_shape	
		this.callEventListener( "vertex_marked", [void(0)] )	
	},
	unsetLastHoveredElement : function(){
		delete this.last_hovered_element
	},
	getLastTouchedElement : function(){
		return this.last_touched_element
	},
	getMarkedVertex : function(){
		if( "marked_vertex_shape" in this ){
			return this.marked_vertex_shape.v
		} else {
			return void(0)
		}
	},
	getMarkedVertexShape : function(){
		if( "marked_vertex_shape" in this ){
			return this.marked_vertex_shape
		} else {
			return void(0)
		}
	},
	getLastHoveredElement : function(){
		return this.last_hovered_element
	},
	moveVertexShape : function( el ){
		el.dom.setAttribute( "transform", "translate("+el.x+","+el.y+")" )
	},
	prependShapes : function( shape_array ){
		var frag = document.createDocumentFragment( true )
		for( var i = 0 ; i < shape_array.length ; i ++ ){
			frag.appendChild( shape_array[i].dom )
		}
		if( this.svg.hasChildNodes() ){
			this.svg.insertBefore( frag, this.svg.firstChild )
		} else {
			this.svg.appendChild( frag )
		}
	},
	appendShapes : function( shape_array ){
		var frag = document.createDocumentFragment( true )
		for( var i = 0 ; i < shape_array.length ; i ++ ){
			frag.appendChild( shape_array[i].dom )
		}
		this.svg.appendChild( frag )
	},
	appendTextBackgrounds : function( shape_array ){
		var bb, min_w, w, h
		for( var i = 0 ; i < shape_array.length ; i ++ ){
			var texts = shape_array[i].dom.getElementsByTagNameNS( svgns, "text" )
			// tune node size to bounding box of inner text
			if( shape_array[i].pathtemplate ){
				bb = texts.item(0).getBBox()
				w = bb.width + 15
				h = bb.height + 15
				min_w = 40.
				shape_array[i].pathtemplate = shape_array[i].pathtemplate.
						replace( /\[dx\]/g, Math.max( min_w, w ) ).
						replace( /\[rx\]/g, Math.max( min_w, w )/2 ).
						replace( /\[dy\]/g, h ).
						replace( /\[ry\]/g, h/2 )
				shape_array[i].dom.firstChild.setAttribute("d", shape_array[i].pathtemplate )
				delete shape_array[i]["pathtemplate"]
			}
			for( var j = 0 ; j < texts.length ; j ++ ){
				var prevsib = texts.item(j).previousSibling
				if( prevsib && prevsib.getAttribute("class") == "textbg" ){
					bb = texts.item(j).getBBox()
					prevsib.setAttribute("width", bb.width )
					prevsib.setAttribute("height", bb.height )
					prevsib.setAttribute("x", bb.x)
					prevsib.setAttribute("y", bb.y)
				}
			}
		}
	},
	removeShapes : function( els ){
		for( var i = 0 ; i < els.length ; i ++ ){
			this.removeShape( els[i] )
		}
	},
	removeShape : function( el ){
		//el.dom.style.display="none";
		this.svg.removeChild( el.dom )
	},
	suspendRedraw : function(){
		// this is deprecated in SVG2, so we do nothing
		// this.unsuspend_id = this.svg.suspendRedraw( time );
	},
	unsuspendRedraw : function(){
		// this is deprecated in SVG2
		// this.svg.unsuspendRedraw( this.unsuspend_id );
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



	clickHandler : function( e ){
		if( "cancel_next_click" in this ){
			delete this.cancel_next_click
			e.preventDefault()
			e.stopPropagation()
			return
		}
		if( this.getMarkedVertex() ){
			this.unmarkVertexShape()
			e.preventDefault()
			e.stopPropagation()
			return
		}
	},

	touchmoveHandler : function( e ){
		var i
		var v = this.getLastTouchedElement()
		if( v ){
			for( i=0 ; i < e.changedTouches.length ; i ++ ){
				if( e.changedTouches[i].identifier == 
					v.last_touch ){
					this.mousemoveHandler( e.changedTouches[i] ); 
					e.preventDefault()
					return
				}
			}
		}
	},


	mousemoveHandler : function( e ){
		var v	
		if( !( "start_x" in this ) ){ 
			return
		}
		v =  this.getLastTouchedElement()
		if( !v ){ 
			return
		}

		var ptr_x = this.pointerX(e)-this.getContainer().offsetLeft
		var ptr_y = this.pointerY(e)-this.getContainer().offsetTop
		
		if(Math.abs(this.start_x - ptr_x) + 
			Math.abs(this.start_y - ptr_y) > 30 ){
			this.dragging = true
		}

		if( this.dragging ){
			if( v.vertex ){
				v = v.vertex
				v.x = ptr_x
				v.y = ptr_y
				this.moveVertexShape(v)
				_.each(v.adjacent_edges,function(es){
					this.anchorEdgeShape( es )
				},this)
				if( typeof this.vertex_drag_listener == "function" ){
					this.vertex_drag_listener( v )
				}
			} else if ( v.edge ){
				v = v.edge
				v.cx = ptr_x
				v.cy = ptr_y
				if( typeof this.edge_drag_listener == "function" ){
					this.edge_drag_listener( v )
				}
				this.anchorEdgeShape( v )
			}
		}
	},

	stopMousemove : function(){
		if( this.dragging ){
			if( typeof this.drag_end_listener == "function" ){
				this.drag_end_listener()
				this.unmarkVertexShape()
			}
		}
		delete this.dragging
		delete this.last_touched_element
		delete this.start_x
		delete this.start_y
	},

	mouseupHandler : function(){
		this.stopMousemove()
	},

	mouseleaveHandler : function(){
		this.stopMousemove()
	},

	getController : function(){
		return this.controller
	},

	getContainer : function(){
		return this.container
	},

	resize : function( w, h ){
		var svg = this.svg
		svg.style.width = w+"px"
		svg.style.height = h+"px"
		svg.setAttribute("width", w)
		svg.setAttribute("height", w)
	},


	pointerX : function(e) {
		var docElement = document.documentElement,
			body = document.body || { scrollLeft: 0 }

		return e.pageX || (e.clientX +
			(docElement.scrollLeft || body.scrollLeft) -
			(docElement.clientLeft || 0))
	},

	pointerY : function(e) {
		var docElement = document.documentElement,
			body = document.body || { scrollTop: 0 }

		return  e.pageY || (e.clientY +
			(docElement.scrollTop || body.scrollTop) -
			(docElement.clientTop || 0))
	}
})
