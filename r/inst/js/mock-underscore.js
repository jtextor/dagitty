// This file contains simple ES6 definitions for a few functions from
// underscore.js that dagitty still uses. This is a transitional solution
// because the package "V8" soon no longer ships underscore, and the 
// dependency will be entirely removed in the future.

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
	"isString" : v => typeof v === 'String',
	"isUndefined" : v => typeof v === 'undefined',
	"each" : function(collection, iteratee, ctx){
		let i, length
		if( Array.isArray( collection ) ){
			for( i = 0 , length = collection.length ; i < length ; i ++ ){
				iteratee(collection[i], i, ctx)
			}
		} else {
			for( const key in collection ){
				if( collection.hasOwnProperty( key ) ){
					iteratee(collection[i],i, ctx)
				}
			}
		}
	}
};

