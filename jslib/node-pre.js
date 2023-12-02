
 const __ = require("underscore")

const _ = {
	"pluck" : (arr, key) => arr.map(obj => obj[key]),
	"extend" : function(destination, ...sources){
		for (const source of sources) {
		    for (const key in source) {
		      if (source.hasOwnProperty(key)) {
		        destination[key] = source[key];
      		      }
    		    }
  		}
  		return destination;
	},
	"isArray" : v => Array.isArray(v),
	"isNumber" : v => typeof v === 'number',
	"isString" : v => typeof v === 'string',
	"isUndefined" : v => typeof v === 'undefined',
	"contains" : function(obj, item, fromIndex, guard){
		return __.contains(obj, item, fromIndex, guard)
	},
	"find" : function(obj,predicate,context){
		return __.find(obj,predicate,context)
	},
	"filter" : function(obj,predicate,context){
		return __.filter(obj,predicate,context)
	},
	"compact" : function(array){
		return __.compact(array)
	},
	"every" : function(){
		return __.every.apply( this, arguments )
	},
	"all" : function(){
		return __.all.apply( this, arguments )
	},
	"max" : function(){
		return __.max.apply( this, arguments )
	},
	"chain" : function(){
		return __.chain.apply( this, arguments )
	},
	"difference" : function(){
		return __.difference.apply( this, arguments )
	},
	"intersection" : function(){
		return __.intersection.apply( this, arguments )
	},
	"keys" : function(){
		return __.keys.apply( this, arguments )
	},
	"isNull" : function(){
		return __.isNull.apply( this, arguments )
	},
	"any" : function(){
		return __.any.apply( this, arguments )
	},
	"defaults" : function(){
		return __.defaults.apply( this, arguments )
	},
	"reduce" : function(){
		return __.reduce.apply( this, arguments )
	},
	"without" : function(){
		return __.without.apply( this, arguments )
	},
	"some" : function(obj,predicate,context){
		return __.some(obj,predicate,context)
	},
	"reject" : function(obj,predicate,context){
		return __.reject(obj,predicate,context)
	},
	"union" : function(){
		return __.union.apply( this, arguments )
	},
	"uniq" : function( array, isSorted, iteratee, context ){
		return __.uniq(array, isSorted, iteratee, context) 
	},
	"map" : function(obj, iteratee, context){
		return __.map(obj,iteratee,context) 
	},
	"each" : function(obj, iteratee, context) {
		__.each( obj, iteratee, context )
	} 
	/* function(collection, iteratee, ctx){
		if( Array.isArray( collection ) ){
			let i, length
			for( i = 0 , length = collection.length ; i < length ; i ++ ){
				iteratee(collection[i], i, collection)
			}
		} else {
			for( const key in collection ){
				if( collection.hasOwnProperty( key ) ){
					iteratee(collection[key], key, collection)
				}
			}
		}
	} */
};


