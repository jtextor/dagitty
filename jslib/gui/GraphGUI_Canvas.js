


var GraphGUI_Canvas = Class.create({
	createEdgeShape : function( edge_type, shape ){
		this.anchorEdgeShape( shape );
	},
	anchorEdgeShape : function( shape ){
		shape.x1 = shape.v1.x;
		shape.y1 = shape.v1.y;
		shape.x2 = shape.v2.x;
		shape.y2 = shape.v2.y;
	},
	createVertexShape : function( vertex_type, shape ){
		// create an example circle and append it to SVG root element
		shape.dom = document.createElement( 'div' );
		shape.dom.style.cursor='move';
		shape.dom.style.position='absolute';
		shape.dom.style.width='42px';
		// shape.dom.style.backgroundColor=this.style[vertex_type]['fill'];
		var im = document.createElement( 'img' );
		im.src="images/defaultnode.gif";
		im.style.display="block";
		im.ondragstart = function(){return false;};
		shape.dom.appendChild(im);
		shape.dom.appendChild( document.createTextNode(shape.id) );
		var myself = this;
		shape.dom.onmousedown = function() { myself.element_being_dragged=shape; };
		shape.dom.onmouseover = function() { myself.element_in_focus=shape; };
		shape.dom.onmouseout = function() { myself.element_in_focus=undefined; };
		var x = (shape.x?shape.x:0)-21; var y = (shape.y?shape.y:0)-16;
		shape.dom.style.left=x+'px';
		shape.dom.style.top=y+'px';
	},
	markVertexShape : function( shape ){
		shape.dom.style.borderWidth = '4px';
	},
	unmarkVertexShape : function( shape ){
		shape.dom.style.borderWidth = '1px';
	},
	moveVertexShape : function( shape ){
		var x = (shape.x?shape.x:0)-21; var y = (shape.y?shape.y:0)-16;
		shape.dom.style.left=x+'px';
		shape.dom.style.top=y+'px';
	},
	appendShapes : function( shape_array ){
		var frag = document.createDocumentFragment();
		for( var i = 0 ; i < shape_array.length ; i ++ ){
			if( shape_array[i].dom ){
				this.svg.appendChild( shape_array[i].dom );
			} else {
			}
		}
		this.svg.appendChild( frag );
	},
	appendTextBackgrounds : function( shape_array ){
		//
	},
	removeShapes : function( shapes ){
		for( var i = 0 ; i < shapes.length ; i ++ ){
			this.removeShape( shapes[i] );
		}
	},
	removeShape : function( shape ){
		//el.dom.style.display="none";
		this.svg.removeChild( shape.dom );
	},
	suspendRedraw : function( time ){
		var ctx = this.canvas.getContext('2d');
 		ctx.fillStyle = 'white';
 		ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
	},
	unsuspendRedraw : function(){
		var ctx = this.canvas.getContext('2d');
		ctx.lineWidth=1;
		ctx.beginPath();
		ctx.moveTo( shape.x1, shape.y1 );
		ctx.lineTo( shape.x2, shape.y2 );
		ctx.closePath();
		ctx.stroke(); 
	},
	initialize : function( canvas_element, width, height ){
		// create SVG root element
		var svg = document.createElement( 'div' ); 
		svg.style.width=width+"px";
		svg.style.height=height+"px";
		svg.style.position="relative";
		svg.style.overflow="hidden";
		svg.style.fontFamily='Arial, sans-serif';
		var canvas = document.createElement( 'canvas' );
		canvas.width=width;
		canvas.height=height;
		canvas.style.border="1px solid red";
		canvas.style.position="absolute";
		canvas.style.top="0px";
		canvas.style.left="0px";
		canvas_element.appendChild( canvas );
		canvas_element.appendChild( svg );
		this.svg = svg;
		this.canvas = canvas;
		this.style = DagittyGraphGUI_DefaultStyle;
	},
	resize : function( w, h ){
		var svg = this.svg;
		svg.style.width = w+"px";
		svg.style.height = h+"px";
	}
});
