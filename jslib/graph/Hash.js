
/*  DAGitty - a browser-based software for causal modelling and analysis
 *  Copyright (C) 2010-2023 Johannes Textor, Benito van der Zander
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

/* Simple Hash implementation. */

/* globals _ */

function Hash(){
	this.kv = {}
}

_.extend( Hash.prototype, {
	contains : function( key ){
		return this.kv.hasOwnProperty( key ) // eslint-disable-line no-prototype-builtins
	},
	get : function( key ){
		return this.kv[key]
	},
	set : function( key, value ){
		this.kv[key] = value
	},
	unset : function( key ){
		delete this.kv[key]
	},
	values : function(){
		return Object.keys( this.kv ).map( function(k){
			return this.kv[k]
		}, this )
	},
	keys : function(){
		return Object.keys( this.kv )
	},
	size : function(){
		return Object.keys( this.kv ).length
	}
} )

