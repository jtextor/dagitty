
var tests = {
	confounders : function( g ){
		var gb = GraphTransformer.backDoorGraph( g )
		var s = gb.getSources(), t = gb.getTargets()
		var gbans = gb.ancestorsOf( s )
		var gbant = gb.ancestorsOf( t )
		return gbans.filter(i=>gbant.includes(i)).filter( i=>
			!(s.includes(i) || t.includes(i) )).map(i=>i.id)
	},
	proxyConfounders : function( g ){
		var gb = GraphTransformer.backDoorGraph( g )
		var s = gb.getSources(), t = gb.getTargets()
		var gbans = gb.ancestorsOf( s )
		var gbant = gb.ancestorsOf( t )
		var conf = gbans.filter(i=>gbant.includes(i)).filter( i=>
			!(s.includes(i) || t.includes(i) ))
		var dconf = gb.descendantsOf( conf ).filter(i=>gbans.includes(i)||gbant.includes(i))
		return dconf.filter(i=>!(s.includes(i)||t.includes(i)||conf.includes(i)))
			.map(i=>i.id)
	},
	mediators : function( g ){
		var s = g.getSources(), t = g.getTargets(), tan = g.ancestorsOf(t)
		var cp = g.descendantsOf( s ).filter(i=>tan.includes(i))
			.filter(i=>!(s.includes(i)||t.includes(i)))
		return cp.map(i=>i.id)		
	},
	competingExposures : function( g ){
		var gan = g.ancestorsOf( g.getTargets() )
		var gdsc = g.descendantsOf( g.ancestorsOf( g.getSources() ) )
		return gan.filter(i=>!gdsc.includes(i)).map(i=>i.id)
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
