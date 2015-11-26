
function sep_2_str( ss ){
   var r = [];
   if( ss.length == 0 )
      return "";
   _.each( ss, function(s){
      var rs = _.pluck( s, 'id').sort().join(", ");
      r.push(rs);
   });
   r.sort();
   return "{"+r.join("}\n{")+"}";
}

function imp_2_str( imp ){
  var r = [],j,rr;
  _.each( imp, function( i ){
      for( j = 0 ; j < i[2].length ; j ++ ){
         rr = i[0]+" _||_ "+i[1];
         if( i[2][j].length > 0 ){
            rr += " | "+_.pluck( i[2][j], 'id').sort().join(", ");
         }
         r.push(rr)
      }
  } );
  return r.join("\n");
}

function iv_2_str( ivs ){
	var r = []
	_(ivs).each( function( i ){
		if( i[1].length > 0 ){
			r.push( i[0].id+" | "+_(i[1]).pluck('id').sort().join(", ") )
		} else {
			r.push( i[0].id )
		}
	} )
	return r.sort().join("\n")
}
