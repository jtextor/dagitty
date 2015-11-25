

var GraphGUI_Raphael = Class.create({
	createEdgeShape : function( edge_type, el ){
		el.dom = this.svg.set();
		el.dom.push(this.svg.path().attr({'stroke-width':2,'fill':'none'}));
		// create edge line
		var edge_types_a = edge_type.split(" ");
		var edge_types = {};
		for( var i = 0 ; i < edge_types_a.length ; i ++ ){
			for( var j in DAGitty.style[edge_types_a[i]+"path"] ){
				if( DAGitty.style[edge_types_a[i]+"path"].hasOwnProperty( j ) ){
					el.dom.attr({j:DAGitty.style[edge_types_a[i]+"path"][j]});
					edge_types[edge_types_a[i]]=1
				}
			}
		}

		if( !edge_types['undirected'] ){
			el.dom.push(this.svg.path("M-3,0L15,5L15,-5Z")
				.attr({'stroke-width':1,'fill':'#ffffff'}))
			if( edge_types['bidirected'] ){
				el.dom.push(this.svg.path("M-3,0L15,5L15,-5Z")
					.attr({'stroke-width':1,'fill':'#ffffff'}))
			}
		}
		this.anchorEdgeShape( el );
		el.dom.attr({'cursor':"move"});
		el.dom.toFront();
		var myself = this;
		el.dom.mousedown(function(){ myself.startDragging(el)} );
	},
	anchorEdgeShape : function( el ){
		var anchor = DAGitty.Math.ellipseAnchorPoint( 
			el.v1.x, el.v1.y, 1.25*20, 1.25*15, el.cx || el.v2.x, el.cy || el.v2.y );
		el.x1 = anchor[0]; el.y1 = anchor[1];
		
		anchor = DAGitty.Math.ellipseAnchorPoint( 
			el.v2.x, el.v2.y, 1.5*20, 1.5*15, el.cx || el.v1.x, el.cy || el.v1.y );
		el.x2 = anchor[0]; el.y2 = anchor[1];
		
		var doit = function(){
			if( el.cx ){
				el.dom[0].attr({'path':'M'+el.x1.toFixed(2)+','+el.y1.toFixed(2)
					+'Q'+el.cx.toFixed(2)+','+el.cy.toFixed(2)
					+' '+el.x2.toFixed(2)+","+el.y2.toFixed(2)});
			} else {
				el.dom[0].attr({'path':'M'+el.x1.toFixed(2)+','+el.y1.toFixed(2)
					+'L'+el.x2.toFixed(2)+','+el.y2.toFixed(2)});
			}
			var sx, sy, a
			if( el.dom[1] ){
				sx = el.cx||el.x1; sy = el.cy||el.y1;
				a = 360*Math.atan( (el.y2-sy)/(el.x2-sx) )/2/Math.PI;
				if( sx<el.x2 ) a = 180+a;
				if( sx == el.x2 ) a = el.y2 > sy ? -90 : 90;
				el.dom[1].rotate(a,0,0);
				el.dom[1].translate(el.x2,el.y2);
			}
			if( el.dom[2] ){
				sx = el.cx||el.x2; sy = el.cy||el.y2;
				a = 360*Math.atan( (el.y1-sy)/(el.x1-sx) )/2/Math.PI
				if( sx<el.x1 ) a += 180
				if( sx == el.x1 ) a = el.y1 > sy ? -90 : 90
				el.dom[2].rotate(a,0,0)
				el.dom[2].translate(el.x1,el.y1)
			}
		};
		window.clearTimeout( el.redraw_timeout );
		el.redraw_timeout = doit.delay(.5);
	},
	createVertexShape : function( vertex_type, el ){
		/*el.dom = this.svg.set();
		el.dom.push(
			this.svg.ellipse(0,0,20,15).attr({'fill-opacity':0.7, 'stroke-width': 2})
		);
		for( f in this.style[vertex_type] ){
			var a = {}; a[f]=this.style[vertex_type][f];
			el.dom[0].attr( a );
		}
		el.dom.push(
			this.svg.text(0,25,el.id).attr({'text-anchor':'middle','font-size':'14px'})
		);
		if( vertex_type == "exposure" ){
			el.dom.push(this.svg.path("M-4,-6L7,0L-4,6Z").attr({'fill':"#000000"}));
		}
		if( vertex_type == "outcome" ){
			el.dom.push(this.svg.path("M-2,-6L2,-6L2,6L-2,6Z").attr({'fill':"#000000"}));
		}
		el.dom.attr({'cursor':"move"});*/
		el.dom = document.createElement('div');
		el.dom.style.position='absolute';
		el.dom.style.paddingTop='20px';
		
		
		var grp = document.createElement( 'v:group' );
		grp.setAttribute('coordsize',"100 100");
		grp.style.width="100px";
		grp.style.height="100px";
		grp.style.position="absolute";
		grp.style.top='0px';
		grp.style.left='0px';
		
		var oval = document.createElement( 'v:oval' );
		oval.style.width="40px";
		oval.style.height="30px";
		oval.style.top="-15px";
		oval.style.left="-20px";
		oval.setAttribute("strokecolor", DAGitty.style[vertex_type+"node"].stroke);
		oval.setAttribute("fillcolor", DAGitty.style[vertex_type+"node"].fill);
		oval.setAttribute('strokeweight','1.5');
		oval.style.cursor='move';
		grp.appendChild(oval);
		
		var e = document.createElement( 'v:rect' );
		e.style.border='none';
		e.setAttribute('stroked','false');
		e.setAttribute('filled','false');
		e.style.width="100px";
		e.style.height="100px";
		e.style.top="17px";
		e.style.left="-50px";
		var txt = document.createElement('v:textbox');
		txt.appendChild(document.createTextNode(el.id));
		e.appendChild(txt);
		grp.appendChild(e);
		
		el.dom.appendChild(grp);
		el.oval = oval;
		
		this.canvas_element.appendChild(el.dom)
		e.style.height = (txt.offsetHeight+10)+"px"
		
		var myself = this;
		Element.observe(oval,'mouseover',function(e) { myself.element_in_focus=el; });
		Element.observe(oval,'mouseout',function(e) { myself.element_in_focus=undefined; });
		Element.observe(oval,'mousedown',function(e) { myself.startDragging(el); });
		/*el.dom.mouseover(function(e) { myself.element_in_focus=el; });
		el.dom.mouseout(function(e) { myself.element_in_focus=undefined; });
		el.dom.mousedown(function(){ myself.startDragging(el)} );*/
		this.moveVertexShape( el );
	},
	setEdgeRedrawTimeout : function( t ){
		this.clearEdgeRedrawTimeout();
		this.edge_redraw_timeout = t;
	},
	clearEdgeRedrawTimeout : function(){
		window.clearTimeout( this.edge_redraw_timeout );
	},
	startDragging : function( el ){
		this.element_being_dragged = el;
	},
	stopDragging : function(){
		this.element_being_dragged = undefined;
	},
	isDragging : function(){
		return this.element_being_dragged;
	},
	markVertexShape : function( el ){
		el.oval.strokeweight=3;
	},
	unmarkVertexShape : function( el ){
		el.oval.strokeweight=1.5;
	},
	moveVertexShape : function( el ){
		//el.dom[0].attr({'cx':el.x,'cy':el.y});
		/*el.dom.toFront();
		el.dom.transform('');
		el.dom.transform('T'+el.x+','+el.y);*/
		el.dom.style.top=el.y+"px";
		el.dom.style.left=el.x+"px";
		//el.dom.setAttribute( 'transform', 'translate('+el.x+','+el.y+')' );
	},
	appendShapes : function( shape_array ){
		// with raphael.js shapes are always appended immediately
	},
	appendTextBackgrounds : function( shape_array ){
		/*for( var i = 0 ; i < shape_array.length ; i ++ ){
			var texts = shape_array[i].dom.getElementsByTagNameNS( svgns, "text" );
			for( var j = 0 ; j < texts.length ; j ++ ){
				var prevsib = texts.item(j).previousSibling;
				if( !prevsib || prevsib.getAttribute("class") != "textbg" ){
					var bb = texts.item(j).getBBox();
					var rect = document.createElementNS( svgns, "rect" );
					rect.setAttribute("width", bb.width );
					rect.setAttribute("height", bb.height );
					rect.setAttribute("class", "textbg" );
					rect.setAttribute("fill", "#FFFFFF" );
					rect.setAttribute("x", bb.x);
					rect.setAttribute("y", bb.y);
					shape_array[i].dom.insertBefore( rect, texts.item(j) );
				}
			}
		}*/
	},
	removeShapes : function( els ){
		for( var i = 0 ; i < els.length ; i ++ ){
			this.removeShape( els[i] );
		}
	},
	removeShape : function( el ){
		if( el.dom.remove ){
			el.dom.remove();
		} else {
			this.canvas_element.removeChild( el.dom );
		}
	},
	suspendRedraw : function( time ){
		//this.unsuspend_id = this.svg.suspendRedraw( time );
	},
	unsuspendRedraw : function(){
		//this.svg.unsuspendRedraw( this.unsuspend_id );
	},
	initialize : function( canvas_element, width, height ){
		// create SVG root element
		/*var svg = document.createElementNS( svgns, 'svg' ); // don't need to pass in 'true'
		svg.setAttribute( 'width', width );
		svg.setAttribute( 'height', height );
		svg.setAttribute( 'style', 'font-family: Arial, sans-serif;' );
		canvas_element.appendChild( svg );*/
		// initialize VML engine
		if( document.namespaces && !document.namespaces['v'] ){
			document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
			var sty = document.createStyleSheet();
			sty.addRule("v\\:group", "behavior: url(#default#VML)")
			sty.addRule("v\\:rect", "behavior: url(#default#VML)")
			sty.addRule("v\\:shape", "behavior: url(#default#VML)");
			sty.addRule("v\\:oval", "behavior: url(#default#VML)");
			sty.addRule("v\\:textbox", "behavior: url(#default#VML)");
			sty.addRule("v\\:skew", "behavior: url(#default#VML)");
		}
		var svg = Raphael( canvas_element, width, height );
		this.svg = svg;
		this.canvas_element = canvas_element;
	},
	resize : function( w, h ){
		this.svg.setSize( w, h );
	}
});

