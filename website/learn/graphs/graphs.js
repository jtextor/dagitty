
var tests = {
	confounders : function( g ){
		var gb = GraphTransformer.backDoorGraph( g )
		return gb.ancestorsOf( gb.getSources() ).intersect(
			gb.ancestorsOf( gb.getTargets() ) ).
			without( gb.getSources() ).
			without( gb.getTargets() ).pluck("id")
	},
	proxyConfounders : function( g ){
		var gb = GraphTransformer.backDoorGraph( g )
		var sandt = gb.getSources().concat( gb.getTargets() )
		var conf = gb.ancestorsOf( gb.getSources() ).intersect(
			gb.ancestorsOf( gb.getTargets() ) )
		return gb.ancestorsOf( sandt ).intersect( gb.descendantsOf( conf ) ).
			without( sandt ).without( conf ).pluck("id")
	},
	mediators : function( g ){
		var cp = g.descendantsOf( g.getSources() ).intersect( g.ancestorsOf(
			g.getTargets() ) )
		cp = cp.without.apply( cp, g.getSources() )
		cp = cp.without.apply( cp, g.getTargets() )
		return cp.pluck("id")		
	},
	competingExposures : function( g ){
		var gan = g.ancestorsOf( g.getTargets() )
		var gdsc = g.descendantsOf( g.ancestorsOf( g.getSources() ) )
		return gan.without.apply( gan, gdsc ).pluck("id")
	},
	parents : function( g ){
		return g.parentsOf( g.getSources() ).map( i => i.id )
	},
	children : function( g ){
		return g.childrenOf( g.getSources() ).map( i => i.id )
	},
	ancestors : function( g ){
		let src = g.getSources(),
			an = g.ancestorsOf( src )
		return an.filter( i=>!src.includes(i) ).map( i=>i.id )
	},
	descendants : function( g ){
		let src = g.getSources(),
			dsc = g.descendantsOf( src )
		return dsc.filter( i=>!src.includes(i) ).map( i=>i.id )
	}
}

function isconnected( g ){
	return  GraphAnalyzer.connectedComponents(
		GraphTransformer.skeleton( g ) ).length == 1
}

function shuf( a ){
	var i, j, x
	for( i = 0 ; i < a.length ; i ++ ){
		j = i+Math.floor(Math.random()*(a.length-i))
		x = a[j]; a[j]=a[i]; a[i]=x
	}
}

function rcheck(fname,v,g){
	if(!v) return
	let $ = v => document.getElementById(v)
	if( tests[fname](g).includes(v.id) ){
			correct_answers ++
			if( correct_answers < max_correct ){
				$("msg").innerHTML = "Correct! "+
					(max_correct-correct_answers)+
					" to go ..."
			} else {
				$("msg").innerHTML = "Correct! <b>Great!</b>"
			}
	} else {
			$("msg").innerHTML = "Sorry, not correct!"
			correct_answers = 0
	}
	$("scoregood").style.width=""+(100*(correct_answers/max_correct))+"%"
		if( correct_answers < max_correct ) setTimeout( askrand, 1000 )
}

function check(fname,view){
	return function(){
		this.keydownhandler( {keyCode:65} )
		var v = this.getCurrentVertex()
		var g = this.getGraph()
		if( tests[fname](g).include(v.id) ){
			correct_answers ++
			if( correct_answers < max_correct ){
				$("msg").innerHTML = "Correct! "+
					(max_correct-correct_answers)+
					" to go ..."
			} else {
				$("msg").innerHTML = "Correct! <b>Great!</b>"
			}
		} else {
			$("msg").innerHTML = "Sorry, not correct!"
			correct_answers = 0
		}
		$("scoregood").style.width=""+(100*(correct_answers/max_correct))+"%"
		if( correct_answers < max_correct ) setTimeout( askrand, 1000 )
	}
}
