


var GraphGUI_CSS = Class.create({
	createEdgeShape : function( edge_type, shape ){
		shape.dom = document.createElement( 'div' );
		shape.dom.style.position="absolute";
		shape.dom.style.width="200px";
		shape.dom.style.height="1px";
		if ( edge_type="causal" ){
			shape.dom.style.backgroundColor="green";
			shape.dom.style.border="1px solid green";
		}
		else if ( edge_type="causal" ){
			shape.dom.style.backgroundColor="red";
			shape.dom.style.borderColor="1px solid red";
		} else {
			shape.dom.style.backgroundColor="black";		
			shape.dom.style.borderColor="1px solid black";
		}

		/*var costheta = Math.cos( 0.5 );
		var sintheta = Math.cos( 0.5 );*/
		shape.dom.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=1,M12=0,M21=0,M22=1,SizingMethod='auto expand')";
		this.anchorEdgeShape( shape );
	},
	anchorEdgeShape : function( shape ){
		shape.x1 = shape.v1.x;
		shape.y1 = shape.v1.y;
		shape.x2 = shape.v2.x;
		shape.y2 = shape.v2.y;
		
		var theta = -DagittyGraphGUI_Math.anglerad(shape.x1,shape.y1,shape.x2,shape.y2);
		var costheta = Math.cos( theta );
		var sintheta = Math.sin( theta );
		if( 0 <= -theta && -theta < Math.PI/2 ){
			shape.dom.style.left=shape.x1+"px";
			shape.dom.style.top=shape.y1+"px";
		} else if ( Math.PI/2 <= -theta && -theta < Math.PI ){
			shape.dom.style.left=shape.x2+"px";
			shape.dom.style.top=shape.y1+"px";
		} else if ( Math.PI <= -theta && -theta < 3*Math.PI/2 ){
			shape.dom.style.left=shape.x2+"px";
			shape.dom.style.top=shape.y2+"px";
		} else{
			shape.dom.style.left=shape.x1+"px";
			shape.dom.style.top=shape.y2+"px";
		}
		shape.dom.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="
			+costheta+",M12="
			+sintheta+",M21="
			+-(sintheta)+",M22="
			+costheta+",SizingMethod='auto expand')";
		/*shape.dom.style["msTransformOrigin"] = "0% 0%"; 
		shape.dom.style["msTransform"] = 'rotate('+
			DagittyGraphGUI_Math.angle(shape.x1,shape.y1,shape.x2,shape.y2)+'deg)';*/
		shape.dom.style.width=DagittyGraphGUI_Math.distance(shape.x1,shape.y1,shape.x2,shape.y2)+"px";
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
		this.moveVertexShape( shape );
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
				this.svg.appendChild( shape_array[i].dom );
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
		//
	},
	unsuspendRedraw : function(){
		// 
	},
	initialize : function( canvas_element, width, height ){
		// create SVG root element
		var svg = document.createElement( 'div' ); 
		svg.style.width=width+"px";
		svg.style.height=height+"px";
		svg.style.position="relative";
		svg.style.overflow="hidden";
		svg.style.fontFamily='Arial, sans-serif';
		canvas_element.appendChild( svg );
		this.svg = svg;
		this.style = DagittyGraphGUI_DefaultStyle;
	},
	resize : function( w, h ){
		var svg = this.svg;
		svg.style.width = w+"px";
		svg.style.height = h+"px";
	}
});
