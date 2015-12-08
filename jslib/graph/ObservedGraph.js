/* DAGitty - a browser-based software for causal modelling and analysis
   Copyright (C) 2010-2012 Johannes Textor

   This program is free software; you can redistribute it and/or
   modify it under the terms of the GNU General Public License
   as published by the Free Software Foundation; either version 2
   of the License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA. */

/* This is just a wrapper around the basic Graph class which allows us to 
	register event listeners, e.g. if the graph is being modified. This wrapper
	can be used by applications based on the MVC pattern. For efficiency reasons,
	GraphAnalyzer and GraphTransform should not be used with this class but rather
	with the underlying Graph itself (exposed to the outside world via the getGraph()
	method). */
	
/* globals Class  */
/* exported ObservedGraph */

var ObservedGraph = Class.extend({
	event_mapping : {
		"addVertex" : "change",
		"renameVertex" : "change",
		"addEdge" : "change",
		"deleteVertex" : "change",
		"deleteEdge" : "change",
		"addSource" : "change",
		"removeSource" : "change",
		"addTarget" : "change",
		"removeTarget" : "change",
		"addLatentNode" : "change",
		"removeLatentNode" : "change",
		"addAdjustedNode" : "change",
		"removeAdjustedNode" : "change"
	},
	initialize : function( graph ){
		this.graph = graph
		this.event_listeners = {}
		Object.keys( this.event_mapping ).each(function(k){
			this.event_listeners[this.event_mapping[k]]=[]
		},this)
		for( var k in graph ){
			if( Object.isFunction(graph[k]) ){
				var f = graph[k]
				if( this.event_mapping[k] ){
					this[k] = (function(f,k){
						return function(){
							var r = f.apply( graph, arguments )
							this.event_listeners[this.event_mapping[k]].each(
							function(l){
								l()
							})
							return r
						}
					})(f,k)
				} else {
					this[k] = (function(f){
						return function(){return f.apply( graph, arguments )}
					})(f)
				}
			}
		}
	},
	observe : function( event, listener ){
		this.event_listeners[event].push(listener)
	}
} )

