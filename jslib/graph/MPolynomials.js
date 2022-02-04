/*
	Multivariate polynomial representation
	MPoly = sum of subterms                    (an array)
	subterms = factor * product of monomials   (an array)
	
	All monomials are in one array, e.g. 4*x*y^2 = [4, "x", 1, "y", 2]
	
	normalization: mpoly is zero iff length is 0
								no subterm has factor 0
								no subterm has length 0
								all subterms in mpoly are sorted according to compareVariableOrder
								all monomials in subterm are sorted lexicographically
*/

function MPoly(value) {
	var self
	if (_.isArray(value)) {
		self = value
	} else if (_.isNumber(value)) {
		self = [value]
	} else if (_.isString(value)) {
		self = MPolyHelper.parse(value)
	} else if (_.isUndefined(value)) {
		self = []
	} else throw "Invalid MPoly constructor value: " + value
	self.__proto__ = MPoly.prototype
	return self
}
MPoly.prototype = Object.create(Array.prototype)
MPoly.prototype.constructor = MPoly
MPoly.prototype.add = function(q) {
	MPolyHelper.assertIsMPoly(q)
	var res = MPolyHelper.createEmptyMPoly(this.length + q.length)
	var i = 0
	var j = 0
	var k = 0
	for (; i < this.length && j < q.length; k++) {
		var cmp = MPolyHelper.compareVariableOrder(this[i], q[j])
		if (cmp == 0) {
			res[k] = this[i].slice()
			res[k][0] += q[j][0]
			if (res[k][0] == 0) k--
			i++
			j++
		} else if (cmp < 0) {
			res[k] = this[i]
			i++
		}else {
			res[k] = q[j]
			j++
		}
	}
	for (; i < this.length; i++, k++) res[k] = this[i]
	for (; j < q.length; j++, k++) res[k] = q[j]
	if (k < res.length) res = res.slice(0, k)
	return res
}
MPoly.prototype.negate = function() {
	var res = MPolyHelper.createEmptyMPoly(this.length)
	for (var i=0;i<this.length;i++) {
		res[i] = this[i].slice()
		res[i][0] = -res[i][0]
	}
	return res
}
MPoly.prototype.sub = function(q) {
	return this.add(q.negate())
}
MPoly.prototype.mul = function(q) {
	MPolyHelper.assertIsMPoly(q)
	var res = new MPoly()
	for (var i=0;i<this.length;i++) for (var j=0;j<q.length;j++)
		res.push(MPolyHelper.mulSubTerms(this[i], q[j]))
	return MPolyHelper.sortAndNormalizeMPoly(res)
}
MPoly.prototype.sqr = function() {
	return this.mul(this)
}
MPoly.prototype.isZero = function() {
	/*for (var i=0;i<this.length;i++)
		if (this[i].length > 0 && this[i][0] != 0) 
			return false*/
	return this.length == 0
}
MPoly.prototype.toString = function(formatting){
	formatting = formatting ? formatting : {}
	var PLUS = "PLUS" in formatting ? formatting.PLUS : " + "
	var SUB = "SUB" in formatting ? formatting.SUB : " - "
	var TIMES = "TIMES" in formatting ? formatting.TIMES : " "
	var POWER = "POWER" in formatting ? formatting.POWER : "^"
	if (this.length == 0) return "0"
	return this.map(function(term, i){
		if (term.length == 0) term = [0]
		var factor = term[0]
		var add = i > 0 ? PLUS : ""
		var temp = []
		if (factor < 0) {
			factor = - factor
			add = i > 0 ? [SUB] : [SUB.trim()]
		}
		if (factor != 1 || term.length == 1)
			temp.push(factor.toString())
		for (i=1; i < term.length; i+=2) {
			var exp = term[i+1] == 1 ? "" : POWER + term[i+1]
			temp.push(MPolyHelper.variableToString(term[i]) + exp)
		}
		return add + temp.join(TIMES)
	}).join("")
}
MPoly.prototype.slice = function (from, to){
	var res = Array.prototype.slice.call(this, from, to)
	res.__proto__ = MPoly.prototype
	return res
}
MPoly.prototype.eval = function(insert){
	var replacements
	if (_.isArray(insert)) replacements = insert
	else {
		replacements = new Array(MPolyHelper.variableCount + 1)
		for (var p in insert) 
			replacements[MPolyHelper.variableFromString(p, true)] = insert[p]
	}

	var newsum = null
	for (var i=0;i<this.length;i++) {
		var old = this[i]
		var kept = new Array(old.length) 
		kept[0] = old[0]
		var keptlength = 1
		var newproduct = null 
		for (var j=1;j<old.length;j+=2) {
			if (old[j] in replacements) {
				var replacement = replacements[old[j]]
				for (var k=0;k<old[j+1];k++) {
					if (newproduct !== null) newproduct = newproduct.mul(replacement)
					else newproduct = replacement
				}
			} else {
				kept[keptlength] = old[j]
				kept[keptlength+1] = old[j+1]
				keptlength+=2
			}
		}
		if (keptlength != kept.length) kept = kept.slice(0, keptlength)
		var keptpoly = MPoly([kept])
		if (newproduct !== null) newproduct = newproduct.mul(keptpoly)
		else newproduct = keptpoly
		if (newsum !== null) newsum = newsum.add(newproduct)
		else newsum = newproduct
	}
	if (newsum === null) newsum = MPoly.zero
	return newsum
}
MPoly.prototype.evalToBigInt = function(insert, options){
	var newoptions = {}
	if (!options) options = {}
	newoptions.number = "number" in options ? options.number : function(x){return BigInt(x)}
	if ("add" in options) newoptions.add = options.add
	if ("mul" in options) newoptions.mul = options.mul
	return this.evalToNumber(insert, newoptions)
}
MPoly.prototype.evalToNumber = function(insert, options){
	var replacements
	if (_.isArray(insert)) replacements = insert
	else {
		replacements = new Array(MPolyHelper.variableCount + 1)
		for (var p in insert) 
			replacements[MPolyHelper.variableFromString(p, true)] = insert[p]
	}
	if (!options) options = {}
	var NUMBER = "number" in options ? options.number : function(x){return x}
	var MUL = "mul" in options ? options.mul : function(x,y){return x*y}
	var ADD = "add" in options ? options.add : function(x,y){return x+y}

	var newsum = NUMBER(0)
	for (var i=0;i<this.length;i++) {
		var old = this[i]
		var newproduct = NUMBER(old[0])
		for (var j=1;j<old.length;j+=2) {
			if (old[j] in replacements) {
				var replacement = replacements[old[j]]
				for (var k=0;k<old[j+1];k++) 
					newproduct = MUL(newproduct, replacement)
			} else throw "No value given for " + MPolyHelper.variableToString(old[j])
		}
		newsum = ADD(newsum, newproduct)
	}
	return newsum
}
/*MPoly.prototype.evalCustom = function(insert, options){
	var zero = "zero" in options ? options.zero : MPoly.zero
	var one = "one" in options ? options.one : MPoly.one
	var mul = "mul" in options ? options.mul : MPoly.mul
	var add = "add" in options ? options.add : MPoly.add
	var newsum = zero
	for (var i=0;i<this.length;i++) {
		var old = this[i]
		var kept = [old[0]]
		var newproduct = 1
		for (var j=1;j<old.length;j+=2) {
			if (old[j] in replacements) {
				var replacement = replacements[old[j]]
				for (var k=0;k<old[j+1];k++) 
					newproduct.push(replacement)
			} else {
				kept.push(old[j])
				kept.push(old[j+1])
			}
		}
		newproduct.push(MPoly([kept]))
		newsum.push(mul.apply(null, newproduct))
	}
	return add.apply(null, newsum)
}*/
MPoly.mul = function(){
	switch (arguments.length) {
	case 0: return MPoly.one
	case 1: return arguments[0]
	default: return _.reduce(arguments, function(a,b){ return a.mul(b) })   
	}
}
MPoly.add = function(){
	switch (arguments.length) {
	case 0: return MPoly.zero
	case 1: return arguments[0]
	default: return _.reduce(arguments, function(a,b){ return a.add(b) })   
	}
}
		
//internal functions
var MPolyHelper = {
	createEmptyMPoly: function(size) {
		var res = new Array(size)
		res.__proto__ = MPoly.prototype
		return res
	},
	parseSubTerm: function(st, negated, s){ //s: original input, only used for error messages
		st = st.trim()
		if (st.length == 0) throw "Empty sum term in " + s
		//exponential factor notation requires space or * afterwards
		var takeFactor = /^([0-9.-]+([eE][0-9]+($|\s*[*]|\s+)|\s*[*]?))(.*)$/.exec(st.trim())
		var factor = 1
		if (takeFactor) {
			factor = takeFactor[1].replace(/[*]/, "").trim()
			if (factor == "-") factor = -1
			factor = factor * 1
			st = takeFactor[4].trim()
		}
		if (negated) factor = -factor
		if (takeFactor && st.length == 0) return [factor]
		var monos = st.replace( /\s*\^\s*/g, "^").split( /\s*[*]\s*|\s+/g)
		monos = monos.map(function(m){
			m = m.trim()
			if (m.length == 0) throw "Empty monomial in " + s
			var power = m.indexOf("^")
			if (power >= 0) return [m.slice(0, power), m.slice(power+1)*1]
			else return [m, 1]
		}).sort(function(a,b){
			if (a[0] < b[0]) return -1
			if (a[0] > b[0]) return 1
			return 0
		})
		var i
		for (i = 1; i < monos.length; i++) 
			if (monos[i - 1][0] == monos[i][0]) {
				monos[i - 1][1] += monos[i][1]
				monos.splice(i,1)
				i--
			}
		var resa = new Array(monos.length*2 + 1)
		resa[0] = factor
		for (i=0;i < monos.length; i++) {
			if ( /[+*^-]/.test(monos[i][0]) ) throw "Monomials cannot contain math symbols. Separate monomials by space or *"
			resa[2*i + 1] = MPolyHelper.variableFromString(monos[i][0])
			resa[2*i + 2] = monos[i][1]
		}
		return resa
	},
	parse: function(s){
		if (s.indexOf("(") >= 0 || s.indexOf(")") >= 0) throw "Parentheses are not supported"
		var sum = s.trim().split(/\s*[+]\s*|\s*([-])\s*/g)
		if (!sum[0] && sum[1]) sum[0] = "0"
		var subterms = MPolyHelper.createEmptyMPoly(Math.ceil(sum.length/2))
		for (var i=0;i<subterms.length;i++) 
			subterms[i] = this.parseSubTerm(sum[2*i], sum[2*i-1], s)
		return MPolyHelper.sortAndNormalizeMPoly(subterms)
	},
	assertIsMPoly: function(v){
		if (!(v instanceof MPoly)) throw "Expected multivariate polynomial, got: " + v
	},
	compareVariableOrder: function(p, q) {
	// MPolyHelper.assertIsMPolySubterm(q)
		var i
		var l = Math.min(p.length, q.length)
		for (i=1;i<l;i++) if (p[i] != q[i]) {
			if (p[i] < q[i]) return -1
			else return 1
		}
		if (p.length < q.length) return -1
		else if (p.length > q.length) return 1
		else return 0
	},
	mulSubTerms: function(p, q){
	// console.log(p)
	// console.log(q)
		//console.log(p.length + q.length - 1)
		var res = new Array(p.length + q.length - 1)
		res[0] = p[0] * q[0]
		var i = 1
		var j = 1
		var k = 1
		for (; i < p.length && j < q.length; k+=2) {
			if (p[i] == q[j]) {
				res[k] = p[i]
				res[k + 1] = p[i+1] + q[j+1]
				i+=2
				j+=2
			} else if (p[i] < q[j]) {
				res[k] = p[i]
				res[k+1] = p[i+1]
				i+=2
			}else {
				res[k] = q[j]
				res[k+1] = q[j+1]
				j+=2
			}
		}
		for (; i < p.length; i++, k++) res[k] = p[i]
		for (; j < q.length; j++, k++) res[k] = q[j]
		if (k < res.length) res = res.slice(0, k)
		return res
	},
	sortAndNormalizeMPoly: function(p){
		var res = p.sort(MPolyHelper.compareVariableOrder)
		if (res.length == 0) return res
		//search the first subterm that is not normalized
		var i = 0
		if (!(res[0].length == 0 || res[0][0] == 0))
			for (i=1;i<res.length;i++)
				if (res[i].length == 0 || res[i][0] == 0 || MPolyHelper.compareVariableOrder(res[i-1], res[i]) == 0) break
		if (i == res.length) 
			return res //all subterms are normalized
		//normalize subterms after i
		p = res
		res = MPolyHelper.createEmptyMPoly(p.length)
		var j = 0
		for (; j < i; j++) res[j] = p[j]
		for (; i < p.length && (p[i].length == 0 || p[i][0] == 0); i++) {/**/}
		//if (i < p.length) { res[j] = p[i]; j++; i++ }
		for (; i < p.length; i++) 
			if (j >= 1 && MPolyHelper.compareVariableOrder(res[j - 1], p[i]) == 0) { 
				res[j - 1][0] += p[i][0]
				if (res[j - 1][0] == 0) j--
			} else if (p[i].length > 0 && p[i][0] != 0) {
				res[j] = p[i]
				j++
			}
		return res.slice(0, j)
	},
	variableCount: 0,
	variableToStringMap: ["empty"],
	stringToVariableMap: {},
	variableToString: function(vidx){
		if (vidx in MPolyHelper.variableToStringMap) return MPolyHelper.variableToStringMap[vidx]
		throw "Unknown variable ID: " + vidx
	},
	variableFromString: function(v, mustExists){
		if (v in MPolyHelper.stringToVariableMap) return MPolyHelper.stringToVariableMap[v]
		if (mustExists) throw "Unknown variable: " + v
		MPolyHelper.variableCount++
		MPolyHelper.stringToVariableMap[v] = MPolyHelper.variableCount
		MPolyHelper.variableToStringMap[MPolyHelper.variableCount] = v
		return MPolyHelper.variableCount
	}
}

MPoly.zero = MPoly("0")
MPoly.one = MPoly("1")
MPoly.minusOne = MPoly("-1")


;
