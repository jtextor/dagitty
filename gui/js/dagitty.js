!function(n,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define("underscore",r):(n="undefined"!=typeof globalThis?globalThis:n||self,function(){var t=n._,e=n._=r();e.noConflict=function(){return n._=t,e}}())}(this,(function(){
//     Underscore.js 1.13.1
//     https://underscorejs.org
//     (c) 2009-2021 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
var n="1.13.1",r="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||Function("return this")()||{},t=Array.prototype,e=Object.prototype,u="undefined"!=typeof Symbol?Symbol.prototype:null,o=t.push,i=t.slice,a=e.toString,f=e.hasOwnProperty,c="undefined"!=typeof ArrayBuffer,l="undefined"!=typeof DataView,s=Array.isArray,p=Object.keys,v=Object.create,h=c&&ArrayBuffer.isView,y=isNaN,d=isFinite,g=!{toString:null}.propertyIsEnumerable("toString"),b=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],m=Math.pow(2,53)-1;function j(n,r){return r=null==r?n.length-1:+r,function(){for(var t=Math.max(arguments.length-r,0),e=Array(t),u=0;u<t;u++)e[u]=arguments[u+r];switch(r){case 0:return n.call(this,e);case 1:return n.call(this,arguments[0],e);case 2:return n.call(this,arguments[0],arguments[1],e)}var o=Array(r+1);for(u=0;u<r;u++)o[u]=arguments[u];return o[r]=e,n.apply(this,o)}}function _(n){var r=typeof n;return"function"===r||"object"===r&&!!n}function w(n){return void 0===n}function A(n){return!0===n||!1===n||"[object Boolean]"===a.call(n)}function x(n){var r="[object "+n+"]";return function(n){return a.call(n)===r}}var S=x("String"),O=x("Number"),M=x("Date"),E=x("RegExp"),B=x("Error"),N=x("Symbol"),I=x("ArrayBuffer"),T=x("Function"),k=r.document&&r.document.childNodes;"function"!=typeof/./&&"object"!=typeof Int8Array&&"function"!=typeof k&&(T=function(n){return"function"==typeof n||!1});var D=T,R=x("Object"),F=l&&R(new DataView(new ArrayBuffer(8))),V="undefined"!=typeof Map&&R(new Map),P=x("DataView");var q=F?function(n){return null!=n&&D(n.getInt8)&&I(n.buffer)}:P,U=s||x("Array");function W(n,r){return null!=n&&f.call(n,r)}var z=x("Arguments");!function(){z(arguments)||(z=function(n){return W(n,"callee")})}();var L=z;function $(n){return O(n)&&y(n)}function C(n){return function(){return n}}function K(n){return function(r){var t=n(r);return"number"==typeof t&&t>=0&&t<=m}}function J(n){return function(r){return null==r?void 0:r[n]}}var G=J("byteLength"),H=K(G),Q=/\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;var X=c?function(n){return h?h(n)&&!q(n):H(n)&&Q.test(a.call(n))}:C(!1),Y=J("length");function Z(n,r){r=function(n){for(var r={},t=n.length,e=0;e<t;++e)r[n[e]]=!0;return{contains:function(n){return r[n]},push:function(t){return r[t]=!0,n.push(t)}}}(r);var t=b.length,u=n.constructor,o=D(u)&&u.prototype||e,i="constructor";for(W(n,i)&&!r.contains(i)&&r.push(i);t--;)(i=b[t])in n&&n[i]!==o[i]&&!r.contains(i)&&r.push(i)}function nn(n){if(!_(n))return[];if(p)return p(n);var r=[];for(var t in n)W(n,t)&&r.push(t);return g&&Z(n,r),r}function rn(n,r){var t=nn(r),e=t.length;if(null==n)return!e;for(var u=Object(n),o=0;o<e;o++){var i=t[o];if(r[i]!==u[i]||!(i in u))return!1}return!0}function tn(n){return n instanceof tn?n:this instanceof tn?void(this._wrapped=n):new tn(n)}function en(n){return new Uint8Array(n.buffer||n,n.byteOffset||0,G(n))}tn.VERSION=n,tn.prototype.value=function(){return this._wrapped},tn.prototype.valueOf=tn.prototype.toJSON=tn.prototype.value,tn.prototype.toString=function(){return String(this._wrapped)};var un="[object DataView]";function on(n,r,t,e){if(n===r)return 0!==n||1/n==1/r;if(null==n||null==r)return!1;if(n!=n)return r!=r;var o=typeof n;return("function"===o||"object"===o||"object"==typeof r)&&function n(r,t,e,o){r instanceof tn&&(r=r._wrapped);t instanceof tn&&(t=t._wrapped);var i=a.call(r);if(i!==a.call(t))return!1;if(F&&"[object Object]"==i&&q(r)){if(!q(t))return!1;i=un}switch(i){case"[object RegExp]":case"[object String]":return""+r==""+t;case"[object Number]":return+r!=+r?+t!=+t:0==+r?1/+r==1/t:+r==+t;case"[object Date]":case"[object Boolean]":return+r==+t;case"[object Symbol]":return u.valueOf.call(r)===u.valueOf.call(t);case"[object ArrayBuffer]":case un:return n(en(r),en(t),e,o)}var f="[object Array]"===i;if(!f&&X(r)){if(G(r)!==G(t))return!1;if(r.buffer===t.buffer&&r.byteOffset===t.byteOffset)return!0;f=!0}if(!f){if("object"!=typeof r||"object"!=typeof t)return!1;var c=r.constructor,l=t.constructor;if(c!==l&&!(D(c)&&c instanceof c&&D(l)&&l instanceof l)&&"constructor"in r&&"constructor"in t)return!1}o=o||[];var s=(e=e||[]).length;for(;s--;)if(e[s]===r)return o[s]===t;if(e.push(r),o.push(t),f){if((s=r.length)!==t.length)return!1;for(;s--;)if(!on(r[s],t[s],e,o))return!1}else{var p,v=nn(r);if(s=v.length,nn(t).length!==s)return!1;for(;s--;)if(p=v[s],!W(t,p)||!on(r[p],t[p],e,o))return!1}return e.pop(),o.pop(),!0}(n,r,t,e)}function an(n){if(!_(n))return[];var r=[];for(var t in n)r.push(t);return g&&Z(n,r),r}function fn(n){var r=Y(n);return function(t){if(null==t)return!1;var e=an(t);if(Y(e))return!1;for(var u=0;u<r;u++)if(!D(t[n[u]]))return!1;return n!==hn||!D(t[cn])}}var cn="forEach",ln="has",sn=["clear","delete"],pn=["get",ln,"set"],vn=sn.concat(cn,pn),hn=sn.concat(pn),yn=["add"].concat(sn,cn,ln),dn=V?fn(vn):x("Map"),gn=V?fn(hn):x("WeakMap"),bn=V?fn(yn):x("Set"),mn=x("WeakSet");function jn(n){for(var r=nn(n),t=r.length,e=Array(t),u=0;u<t;u++)e[u]=n[r[u]];return e}function _n(n){for(var r={},t=nn(n),e=0,u=t.length;e<u;e++)r[n[t[e]]]=t[e];return r}function wn(n){var r=[];for(var t in n)D(n[t])&&r.push(t);return r.sort()}function An(n,r){return function(t){var e=arguments.length;if(r&&(t=Object(t)),e<2||null==t)return t;for(var u=1;u<e;u++)for(var o=arguments[u],i=n(o),a=i.length,f=0;f<a;f++){var c=i[f];r&&void 0!==t[c]||(t[c]=o[c])}return t}}var xn=An(an),Sn=An(nn),On=An(an,!0);function Mn(n){if(!_(n))return{};if(v)return v(n);var r=function(){};r.prototype=n;var t=new r;return r.prototype=null,t}function En(n){return _(n)?U(n)?n.slice():xn({},n):n}function Bn(n){return U(n)?n:[n]}function Nn(n){return tn.toPath(n)}function In(n,r){for(var t=r.length,e=0;e<t;e++){if(null==n)return;n=n[r[e]]}return t?n:void 0}function Tn(n,r,t){var e=In(n,Nn(r));return w(e)?t:e}function kn(n){return n}function Dn(n){return n=Sn({},n),function(r){return rn(r,n)}}function Rn(n){return n=Nn(n),function(r){return In(r,n)}}function Fn(n,r,t){if(void 0===r)return n;switch(null==t?3:t){case 1:return function(t){return n.call(r,t)};case 3:return function(t,e,u){return n.call(r,t,e,u)};case 4:return function(t,e,u,o){return n.call(r,t,e,u,o)}}return function(){return n.apply(r,arguments)}}function Vn(n,r,t){return null==n?kn:D(n)?Fn(n,r,t):_(n)&&!U(n)?Dn(n):Rn(n)}function Pn(n,r){return Vn(n,r,1/0)}function qn(n,r,t){return tn.iteratee!==Pn?tn.iteratee(n,r):Vn(n,r,t)}function Un(){}function Wn(n,r){return null==r&&(r=n,n=0),n+Math.floor(Math.random()*(r-n+1))}tn.toPath=Bn,tn.iteratee=Pn;var zn=Date.now||function(){return(new Date).getTime()};function Ln(n){var r=function(r){return n[r]},t="(?:"+nn(n).join("|")+")",e=RegExp(t),u=RegExp(t,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,r):n}}var $n={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},Cn=Ln($n),Kn=Ln(_n($n)),Jn=tn.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g},Gn=/(.)^/,Hn={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},Qn=/\\|'|\r|\n|\u2028|\u2029/g;function Xn(n){return"\\"+Hn[n]}var Yn=/^\s*(\w|\$)+\s*$/;var Zn=0;function nr(n,r,t,e,u){if(!(e instanceof r))return n.apply(t,u);var o=Mn(n.prototype),i=n.apply(o,u);return _(i)?i:o}var rr=j((function(n,r){var t=rr.placeholder,e=function(){for(var u=0,o=r.length,i=Array(o),a=0;a<o;a++)i[a]=r[a]===t?arguments[u++]:r[a];for(;u<arguments.length;)i.push(arguments[u++]);return nr(n,e,this,this,i)};return e}));rr.placeholder=tn;var tr=j((function(n,r,t){if(!D(n))throw new TypeError("Bind must be called on a function");var e=j((function(u){return nr(n,e,r,this,t.concat(u))}));return e})),er=K(Y);function ur(n,r,t,e){if(e=e||[],r||0===r){if(r<=0)return e.concat(n)}else r=1/0;for(var u=e.length,o=0,i=Y(n);o<i;o++){var a=n[o];if(er(a)&&(U(a)||L(a)))if(r>1)ur(a,r-1,t,e),u=e.length;else for(var f=0,c=a.length;f<c;)e[u++]=a[f++];else t||(e[u++]=a)}return e}var or=j((function(n,r){var t=(r=ur(r,!1,!1)).length;if(t<1)throw new Error("bindAll must be passed function names");for(;t--;){var e=r[t];n[e]=tr(n[e],n)}return n}));var ir=j((function(n,r,t){return setTimeout((function(){return n.apply(null,t)}),r)})),ar=rr(ir,tn,1);function fr(n){return function(){return!n.apply(this,arguments)}}function cr(n,r){var t;return function(){return--n>0&&(t=r.apply(this,arguments)),n<=1&&(r=null),t}}var lr=rr(cr,2);function sr(n,r,t){r=qn(r,t);for(var e,u=nn(n),o=0,i=u.length;o<i;o++)if(r(n[e=u[o]],e,n))return e}function pr(n){return function(r,t,e){t=qn(t,e);for(var u=Y(r),o=n>0?0:u-1;o>=0&&o<u;o+=n)if(t(r[o],o,r))return o;return-1}}var vr=pr(1),hr=pr(-1);function yr(n,r,t,e){for(var u=(t=qn(t,e,1))(r),o=0,i=Y(n);o<i;){var a=Math.floor((o+i)/2);t(n[a])<u?o=a+1:i=a}return o}function dr(n,r,t){return function(e,u,o){var a=0,f=Y(e);if("number"==typeof o)n>0?a=o>=0?o:Math.max(o+f,a):f=o>=0?Math.min(o+1,f):o+f+1;else if(t&&o&&f)return e[o=t(e,u)]===u?o:-1;if(u!=u)return(o=r(i.call(e,a,f),$))>=0?o+a:-1;for(o=n>0?a:f-1;o>=0&&o<f;o+=n)if(e[o]===u)return o;return-1}}var gr=dr(1,vr,yr),br=dr(-1,hr);function mr(n,r,t){var e=(er(n)?vr:sr)(n,r,t);if(void 0!==e&&-1!==e)return n[e]}function jr(n,r,t){var e,u;if(r=Fn(r,t),er(n))for(e=0,u=n.length;e<u;e++)r(n[e],e,n);else{var o=nn(n);for(e=0,u=o.length;e<u;e++)r(n[o[e]],o[e],n)}return n}function _r(n,r,t){r=qn(r,t);for(var e=!er(n)&&nn(n),u=(e||n).length,o=Array(u),i=0;i<u;i++){var a=e?e[i]:i;o[i]=r(n[a],a,n)}return o}function wr(n){var r=function(r,t,e,u){var o=!er(r)&&nn(r),i=(o||r).length,a=n>0?0:i-1;for(u||(e=r[o?o[a]:a],a+=n);a>=0&&a<i;a+=n){var f=o?o[a]:a;e=t(e,r[f],f,r)}return e};return function(n,t,e,u){var o=arguments.length>=3;return r(n,Fn(t,u,4),e,o)}}var Ar=wr(1),xr=wr(-1);function Sr(n,r,t){var e=[];return r=qn(r,t),jr(n,(function(n,t,u){r(n,t,u)&&e.push(n)})),e}function Or(n,r,t){r=qn(r,t);for(var e=!er(n)&&nn(n),u=(e||n).length,o=0;o<u;o++){var i=e?e[o]:o;if(!r(n[i],i,n))return!1}return!0}function Mr(n,r,t){r=qn(r,t);for(var e=!er(n)&&nn(n),u=(e||n).length,o=0;o<u;o++){var i=e?e[o]:o;if(r(n[i],i,n))return!0}return!1}function Er(n,r,t,e){return er(n)||(n=jn(n)),("number"!=typeof t||e)&&(t=0),gr(n,r,t)>=0}var Br=j((function(n,r,t){var e,u;return D(r)?u=r:(r=Nn(r),e=r.slice(0,-1),r=r[r.length-1]),_r(n,(function(n){var o=u;if(!o){if(e&&e.length&&(n=In(n,e)),null==n)return;o=n[r]}return null==o?o:o.apply(n,t)}))}));function Nr(n,r){return _r(n,Rn(r))}function Ir(n,r,t){var e,u,o=-1/0,i=-1/0;if(null==r||"number"==typeof r&&"object"!=typeof n[0]&&null!=n)for(var a=0,f=(n=er(n)?n:jn(n)).length;a<f;a++)null!=(e=n[a])&&e>o&&(o=e);else r=qn(r,t),jr(n,(function(n,t,e){((u=r(n,t,e))>i||u===-1/0&&o===-1/0)&&(o=n,i=u)}));return o}function Tr(n,r,t){if(null==r||t)return er(n)||(n=jn(n)),n[Wn(n.length-1)];var e=er(n)?En(n):jn(n),u=Y(e);r=Math.max(Math.min(r,u),0);for(var o=u-1,i=0;i<r;i++){var a=Wn(i,o),f=e[i];e[i]=e[a],e[a]=f}return e.slice(0,r)}function kr(n,r){return function(t,e,u){var o=r?[[],[]]:{};return e=qn(e,u),jr(t,(function(r,u){var i=e(r,u,t);n(o,r,i)})),o}}var Dr=kr((function(n,r,t){W(n,t)?n[t].push(r):n[t]=[r]})),Rr=kr((function(n,r,t){n[t]=r})),Fr=kr((function(n,r,t){W(n,t)?n[t]++:n[t]=1})),Vr=kr((function(n,r,t){n[t?0:1].push(r)}),!0),Pr=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;function qr(n,r,t){return r in t}var Ur=j((function(n,r){var t={},e=r[0];if(null==n)return t;D(e)?(r.length>1&&(e=Fn(e,r[1])),r=an(n)):(e=qr,r=ur(r,!1,!1),n=Object(n));for(var u=0,o=r.length;u<o;u++){var i=r[u],a=n[i];e(a,i,n)&&(t[i]=a)}return t})),Wr=j((function(n,r){var t,e=r[0];return D(e)?(e=fr(e),r.length>1&&(t=r[1])):(r=_r(ur(r,!1,!1),String),e=function(n,t){return!Er(r,t)}),Ur(n,e,t)}));function zr(n,r,t){return i.call(n,0,Math.max(0,n.length-(null==r||t?1:r)))}function Lr(n,r,t){return null==n||n.length<1?null==r||t?void 0:[]:null==r||t?n[0]:zr(n,n.length-r)}function $r(n,r,t){return i.call(n,null==r||t?1:r)}var Cr=j((function(n,r){return r=ur(r,!0,!0),Sr(n,(function(n){return!Er(r,n)}))})),Kr=j((function(n,r){return Cr(n,r)}));function Jr(n,r,t,e){A(r)||(e=t,t=r,r=!1),null!=t&&(t=qn(t,e));for(var u=[],o=[],i=0,a=Y(n);i<a;i++){var f=n[i],c=t?t(f,i,n):f;r&&!t?(i&&o===c||u.push(f),o=c):t?Er(o,c)||(o.push(c),u.push(f)):Er(u,f)||u.push(f)}return u}var Gr=j((function(n){return Jr(ur(n,!0,!0))}));function Hr(n){for(var r=n&&Ir(n,Y).length||0,t=Array(r),e=0;e<r;e++)t[e]=Nr(n,e);return t}var Qr=j(Hr);function Xr(n,r){return n._chain?tn(r).chain():r}function Yr(n){return jr(wn(n),(function(r){var t=tn[r]=n[r];tn.prototype[r]=function(){var n=[this._wrapped];return o.apply(n,arguments),Xr(this,t.apply(tn,n))}})),tn}jr(["pop","push","reverse","shift","sort","splice","unshift"],(function(n){var r=t[n];tn.prototype[n]=function(){var t=this._wrapped;return null!=t&&(r.apply(t,arguments),"shift"!==n&&"splice"!==n||0!==t.length||delete t[0]),Xr(this,t)}})),jr(["concat","join","slice"],(function(n){var r=t[n];tn.prototype[n]=function(){var n=this._wrapped;return null!=n&&(n=r.apply(n,arguments)),Xr(this,n)}}));var Zr=Yr({__proto__:null,VERSION:n,restArguments:j,isObject:_,isNull:function(n){return null===n},isUndefined:w,isBoolean:A,isElement:function(n){return!(!n||1!==n.nodeType)},isString:S,isNumber:O,isDate:M,isRegExp:E,isError:B,isSymbol:N,isArrayBuffer:I,isDataView:q,isArray:U,isFunction:D,isArguments:L,isFinite:function(n){return!N(n)&&d(n)&&!isNaN(parseFloat(n))},isNaN:$,isTypedArray:X,isEmpty:function(n){if(null==n)return!0;var r=Y(n);return"number"==typeof r&&(U(n)||S(n)||L(n))?0===r:0===Y(nn(n))},isMatch:rn,isEqual:function(n,r){return on(n,r)},isMap:dn,isWeakMap:gn,isSet:bn,isWeakSet:mn,keys:nn,allKeys:an,values:jn,pairs:function(n){for(var r=nn(n),t=r.length,e=Array(t),u=0;u<t;u++)e[u]=[r[u],n[r[u]]];return e},invert:_n,functions:wn,methods:wn,extend:xn,extendOwn:Sn,assign:Sn,defaults:On,create:function(n,r){var t=Mn(n);return r&&Sn(t,r),t},clone:En,tap:function(n,r){return r(n),n},get:Tn,has:function(n,r){for(var t=(r=Nn(r)).length,e=0;e<t;e++){var u=r[e];if(!W(n,u))return!1;n=n[u]}return!!t},mapObject:function(n,r,t){r=qn(r,t);for(var e=nn(n),u=e.length,o={},i=0;i<u;i++){var a=e[i];o[a]=r(n[a],a,n)}return o},identity:kn,constant:C,noop:Un,toPath:Bn,property:Rn,propertyOf:function(n){return null==n?Un:function(r){return Tn(n,r)}},matcher:Dn,matches:Dn,times:function(n,r,t){var e=Array(Math.max(0,n));r=Fn(r,t,1);for(var u=0;u<n;u++)e[u]=r(u);return e},random:Wn,now:zn,escape:Cn,unescape:Kn,templateSettings:Jn,template:function(n,r,t){!r&&t&&(r=t),r=On({},r,tn.templateSettings);var e=RegExp([(r.escape||Gn).source,(r.interpolate||Gn).source,(r.evaluate||Gn).source].join("|")+"|$","g"),u=0,o="__p+='";n.replace(e,(function(r,t,e,i,a){return o+=n.slice(u,a).replace(Qn,Xn),u=a+r.length,t?o+="'+\n((__t=("+t+"))==null?'':_.escape(__t))+\n'":e?o+="'+\n((__t=("+e+"))==null?'':__t)+\n'":i&&(o+="';\n"+i+"\n__p+='"),r})),o+="';\n";var i,a=r.variable;if(a){if(!Yn.test(a))throw new Error("variable is not a bare identifier: "+a)}else o="with(obj||{}){\n"+o+"}\n",a="obj";o="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{i=new Function(a,"_",o)}catch(n){throw n.source=o,n}var f=function(n){return i.call(this,n,tn)};return f.source="function("+a+"){\n"+o+"}",f},result:function(n,r,t){var e=(r=Nn(r)).length;if(!e)return D(t)?t.call(n):t;for(var u=0;u<e;u++){var o=null==n?void 0:n[r[u]];void 0===o&&(o=t,u=e),n=D(o)?o.call(n):o}return n},uniqueId:function(n){var r=++Zn+"";return n?n+r:r},chain:function(n){var r=tn(n);return r._chain=!0,r},iteratee:Pn,partial:rr,bind:tr,bindAll:or,memoize:function(n,r){var t=function(e){var u=t.cache,o=""+(r?r.apply(this,arguments):e);return W(u,o)||(u[o]=n.apply(this,arguments)),u[o]};return t.cache={},t},delay:ir,defer:ar,throttle:function(n,r,t){var e,u,o,i,a=0;t||(t={});var f=function(){a=!1===t.leading?0:zn(),e=null,i=n.apply(u,o),e||(u=o=null)},c=function(){var c=zn();a||!1!==t.leading||(a=c);var l=r-(c-a);return u=this,o=arguments,l<=0||l>r?(e&&(clearTimeout(e),e=null),a=c,i=n.apply(u,o),e||(u=o=null)):e||!1===t.trailing||(e=setTimeout(f,l)),i};return c.cancel=function(){clearTimeout(e),a=0,e=u=o=null},c},debounce:function(n,r,t){var e,u,o,i,a,f=function(){var c=zn()-u;r>c?e=setTimeout(f,r-c):(e=null,t||(i=n.apply(a,o)),e||(o=a=null))},c=j((function(c){return a=this,o=c,u=zn(),e||(e=setTimeout(f,r),t&&(i=n.apply(a,o))),i}));return c.cancel=function(){clearTimeout(e),e=o=a=null},c},wrap:function(n,r){return rr(r,n)},negate:fr,compose:function(){var n=arguments,r=n.length-1;return function(){for(var t=r,e=n[r].apply(this,arguments);t--;)e=n[t].call(this,e);return e}},after:function(n,r){return function(){if(--n<1)return r.apply(this,arguments)}},before:cr,once:lr,findKey:sr,findIndex:vr,findLastIndex:hr,sortedIndex:yr,indexOf:gr,lastIndexOf:br,find:mr,detect:mr,findWhere:function(n,r){return mr(n,Dn(r))},each:jr,forEach:jr,map:_r,collect:_r,reduce:Ar,foldl:Ar,inject:Ar,reduceRight:xr,foldr:xr,filter:Sr,select:Sr,reject:function(n,r,t){return Sr(n,fr(qn(r)),t)},every:Or,all:Or,some:Mr,any:Mr,contains:Er,includes:Er,include:Er,invoke:Br,pluck:Nr,where:function(n,r){return Sr(n,Dn(r))},max:Ir,min:function(n,r,t){var e,u,o=1/0,i=1/0;if(null==r||"number"==typeof r&&"object"!=typeof n[0]&&null!=n)for(var a=0,f=(n=er(n)?n:jn(n)).length;a<f;a++)null!=(e=n[a])&&e<o&&(o=e);else r=qn(r,t),jr(n,(function(n,t,e){((u=r(n,t,e))<i||u===1/0&&o===1/0)&&(o=n,i=u)}));return o},shuffle:function(n){return Tr(n,1/0)},sample:Tr,sortBy:function(n,r,t){var e=0;return r=qn(r,t),Nr(_r(n,(function(n,t,u){return{value:n,index:e++,criteria:r(n,t,u)}})).sort((function(n,r){var t=n.criteria,e=r.criteria;if(t!==e){if(t>e||void 0===t)return 1;if(t<e||void 0===e)return-1}return n.index-r.index})),"value")},groupBy:Dr,indexBy:Rr,countBy:Fr,partition:Vr,toArray:function(n){return n?U(n)?i.call(n):S(n)?n.match(Pr):er(n)?_r(n,kn):jn(n):[]},size:function(n){return null==n?0:er(n)?n.length:nn(n).length},pick:Ur,omit:Wr,first:Lr,head:Lr,take:Lr,initial:zr,last:function(n,r,t){return null==n||n.length<1?null==r||t?void 0:[]:null==r||t?n[n.length-1]:$r(n,Math.max(0,n.length-r))},rest:$r,tail:$r,drop:$r,compact:function(n){return Sr(n,Boolean)},flatten:function(n,r){return ur(n,r,!1)},without:Kr,uniq:Jr,unique:Jr,union:Gr,intersection:function(n){for(var r=[],t=arguments.length,e=0,u=Y(n);e<u;e++){var o=n[e];if(!Er(r,o)){var i;for(i=1;i<t&&Er(arguments[i],o);i++);i===t&&r.push(o)}}return r},difference:Cr,unzip:Hr,transpose:Hr,zip:Qr,object:function(n,r){for(var t={},e=0,u=Y(n);e<u;e++)r?t[n[e]]=r[e]:t[n[e][0]]=n[e][1];return t},range:function(n,r,t){null==r&&(r=n||0,n=0),t||(t=r<n?-1:1);for(var e=Math.max(Math.ceil((r-n)/t),0),u=Array(e),o=0;o<e;o++,n+=t)u[o]=n;return u},chunk:function(n,r){if(null==r||r<1)return[];for(var t=[],e=0,u=n.length;e<u;)t.push(i.call(n,e,e+=r));return t},mixin:Yr,default:tn});return Zr._=Zr,Zr}));
// Simple JavaScript Inheritance for ES 5.1
// based on http://ejohn.org/blog/simple-javascript-inheritance/
//  (inspired by base2 and Prototype)
// MIT Licensed.
;(function(global) {
  "use strict";
  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  function BaseClass(){}

  // Create a new Class that inherits from this class
  BaseClass.extend = function(props) {
    var _super = this.prototype;

    // Set up the prototype to inherit from the base class
    // (but without running the init constructor)
    var proto = Object.create(_super);

    // Copy the properties over onto the new prototype
    for (var name in props) {
      // Check if we're overwriting an existing function
      proto[name] = typeof props[name] === "function" && 
        typeof _super[name] == "function" && fnTest.test(props[name])
        ? (function(name, fn){
            return function() {
              var tmp = this._super;

              // Add a new ._super() method that is the same method
              // but on the super-class
              this._super = _super[name];

              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);        
              this._super = tmp;

              return ret;
            };
          })(name, props[name])
        : props[name];
    }

    // The new constructor
    var newClass = typeof proto.init === "function"
      ? proto.hasOwnProperty("init")
        ? proto.init // All construction is actually done in the init method
        : function SubClass(){ _super.init.apply(this, arguments); }
      : function EmptyClass(){};

    // Populate our constructed prototype object
    newClass.prototype = proto;

    // Enforce the constructor to be what we expect
    proto.constructor = newClass;

    // And make this class extendable
    newClass.extend = BaseClass.extend;

    return newClass;
  };

  // export
  global.Class = BaseClass;
})(this);

if( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ){
	global.Class = module.exports.Class
}

/*  DAGitty - a browser-based software for causal modelling and analysis
 *  Copyright (C) 2010-2015 Johannes Textor, Benito van der Zander
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
		return this.kv.hasOwnProperty( key )
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

/* This class provides a basic Graph datastructure. Graphs can contain 
 * both directed, undirected, and bidirected edges. 
 *	 
 * TODO: there are still some algorithmic methods in this class, these should
 * be moved to either GraphAnalyzer, GraphTransform or GraphSerializer in the future.
 */

/* globals _, Class, Hash, GraphSerializer */

var Graph = Class.extend({ 
	// additional getter and setter methods for these properties are mixed in below,
	// see code after definition of this class 
	managed_vertex_property_names : ["source","target","adjustedNode",
		"latentNode","selectedNode"],
	init : function(){
		this.vertices = new Hash()
		this.edges = []
		this.type = "digraph"
		this.name = null
		this.bb = null
		this.managed_vertex_properties = {}
		_.each(this.managed_vertex_property_names,function(p){
			this.managed_vertex_properties[p] = new Hash()
		},this)
	},

	getBoundingBox : function(){
		return this.bb
	},
	setBoundingBox : function( bb ){
		this.bb = bb
	},

	getName : function(){
		return this.name
	},
	setName : function( name ){
		this.name = name
	},
	
	getType : function(){
		return this.type
	},
	setType : function( type ){
		this.type = type
	},

	getEdges : function(){
		return this.edges
	},


	getVertexIDs : function(){
		return this.vertices.keys()
	},
	
	getNumberOfVertices : function(){
		return this.vertices.size()
	},

	getNumberOfEdges : function(){
		return this.edges.length
	},

	getVertices : function(){
		return this.vertices.values()
	},

	getVerticesWithProperty : function( p ){
		return this.managed_vertex_properties[p].values()
	},
	addVertexProperty : function( v, p ){
		var vv = this.getVertex( v )
		if( vv ){
			this.managed_vertex_properties[p].set( vv.id, vv )
		}
		return this
	},
	removeVertexProperty : function( v, p ){
		var vv = this.getVertex( v )
		if( vv ){
			this.managed_vertex_properties[p].unset( vv.id )
		}
		return this
	},
	removePropertyFromAllVertices : function( p ){
		this.managed_vertex_properties[p] = new Hash()
		return this
	},
	vertexHasProperty : function( v, p ){
		var vv = this.getVertex( v )
		return vv && this.managed_vertex_properties[p].contains( vv.id )
	},
	
	/** Copies all properties of every vertex and edge of this graph to the same 
	    vertex in g2 and sets the type of g2 to the type of this graph. */
	copyAllPropertiesTo : function( g2 ){
		var g = this
		_.each( g.managed_vertex_property_names, ( function( p ){
			_.each( g.getVerticesWithProperty( p ), function( v ){
				g2.addVertexProperty( v, p ) 
			} )
		} ) )
		_.each( g.getEdges(), function(e){
			var e2 = g2.getEdge( e.v1, e.v2, e.directed )
			if( e2 ){
				e2.layout_pos_x = e.layout_pos_x
				e2.layout_pos_y = e.layout_pos_y
				e2.style = e.style
				if( e.attributes ){
					e2.attributes = {}
					var vk = Object.keys( e.attributes )
					for( var i = 0 ; i < vk.length ; i ++ ){
						e2.attributes[vk[i]] = e.attributes[vk[i]]
					}
				}
			}
		} )
		g2.setType( this.getType() )
	},
	
	getVertex : function( v ){
		if( typeof v === "string" ){
			return this.vertices.get(v)
		} else if( v instanceof Graph.Vertex ){
			return this.vertices.get(v.id)
		} else if( v instanceof Array ){
			return v.map(this.getVertex,this)
		} else {
			throw( "Illegal value passed to getVertex : " + v )
		}
	},
	
	addVertex : function( v ){
		if( ! (v instanceof Graph.Vertex) ){
			return this.addVertex(new Graph.Vertex({id:v}))
		} else {
			this.vertices.set( v.id, v )
		}
		return v
	},
	
	renameVertex : function( id_old, id_new ){
		var v = this.getVertex( id_old )
		var properties = []
		_.each( 
		this.managed_vertex_property_names, function(p){
			var pcamel = p.substring(0,1).toUpperCase()+
				p.substring(1,p.length)
			if( this["is"+pcamel]( v ) ){
				properties.push(pcamel)
				this["remove"+pcamel]( v )
			}
		},this)
		this.vertices.unset( id_old )
		v.id = id_new
		this.vertices.set( v.id, v )
		_.each( properties, function(p){ this["add"+p](v) },this )
		return this
	},
	
	deleteVertex : function( v ){
		// first remove all edges adjacent to v 
		v = this.getVertex( v )
	
		_.each( v.outgoingEdges, function( e ) {
			e.v2.incomingEdges = _.without(e.v2.incomingEdges, e )
		} )
		_.each( v.incomingEdges, function( e ) {
			e.v1.outgoingEdges = _.without(e.v1.outgoingEdges, e )
		} )
		this.edges = _.filter(this.edges, 
		function( e ){ return ! ( 
			_.contains( v.incomingEdges, e ) || 
			_.contains( v.outgoingEdges, e ) ) } )
		
		// remove the vertex from all property lists
		_.each( this.managed_vertex_property_names, function(p){
			var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length)
			this["remove"+pcamel]( v )
		},this)
		
		// then remove the vertex itself
		this.vertices.unset( v.id )
		return this
	},
	
	clone : function( include_edges ){
		if( arguments.length == 0 ){
			include_edges = true
		}
		var g2 = new Graph()
		_.each( this.getVertices(), function( v ){
			g2.addVertex( v.cloneWithoutEdges() )
		} )
		if( include_edges ){
			_.each( this.edges, function( e ){
				g2.addEdge( e.v1.id, e.v2.id, e.directed )
			} )
		}
		this.copyAllPropertiesTo(g2)
		g2.setType( this.getType() )
		return g2
	},
	
	/** 
	 *         TODO for now, only works with specified edges 
	 */
	contractVertex : function( v0 ){
		var children = v0.getChildren()
		var parents = v0.getParents()
		var spouses = v0.getSpouses()
		var neighbours = v0.getNeighbours()
		
		var self = this
		
		_.each(children, function(v){
			_.each(children, function(w){   if (v.id != w.id) self.addEdge(w, v, Graph.Edgetype.Bidirected ) }) // v <- v0 -> w
			_.each(parents, function(w){ if (v.id != w.id) self.addEdge(w, v, Graph.Edgetype.Directed ) }) // v <- v0 <- w
			_.each(spouses, function(w){    if (v.id != w.id) self.addEdge(w, v, Graph.Edgetype.Bidirected ) }) // v <- v0 <-> w
			_.each(neighbours, function(w){ if (v.id != w.id) self.addEdge(w, v, Graph.Edgetype.Directed ) }) // v <- v0 - w
		})
		_.each(parents, function(v){
			_.each(neighbours, function(w){ if (v.id != w.id) self.addEdge(v, w, Graph.Edgetype.Directed ) }) // v -> v0 - w
		})
		_.each(spouses, function(v){
			_.each(neighbours, function(w){ if (v.id != w.id) self.addEdge(v, w, Graph.Edgetype.Bidirected ) }) // v <-> v0 - w
		})
		_.each(neighbours, function(v){
			_.each(neighbours, function(w){ if (v.id != w.id) self.addEdge(v, w, Graph.Edgetype.Undirected ) }) // v - v0 - w
		})
		this.deleteVertex( v0 )
	},
	
	clearVisited : function(){
		_.each( this.getVertices(), function( v ){
			v.traversal_info.visited = false
		} )
		return this
	},
	
	clearTraversalInfo : function(){
		_.each( this.getVertices(), function( v ){
			v.traversal_info = {}
		} )
		return this
	},
	
	transitiveClosureOf : function( vertex_array, kinship_function, clear_visited_function ){
		"use strict"
		if( clear_visited_function ){
			clear_visited_function()
		} else {
			this.clearVisited()
		}
		var q = _.reject( vertex_array.slice(), Graph.Vertex.isVisited )
		_.each( q, Graph.Vertex.markAsVisited )
		var r = []
		var visitAndPush = function(vn){
			Graph.Vertex.markAsVisited(vn)
			q.push(vn)
		}
		while( q.length > 0 ){
			var v = q.pop()
			var vv = _.reject( v[kinship_function](), Graph.Vertex.isVisited )
			_.each(vv, visitAndPush)
			r.push(v)
		}
		this.clearVisited()
		return r
	},
	
	districtOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getSpouses",
			clear_visited_function )
	},

	ancestorsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getParents",
			clear_visited_function )
	},

	anteriorsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getPossibleParentsAndPossibleNeighbours",
			clear_visited_function )
	},
	
	descendantsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getChildren",
			clear_visited_function )
	},
	
	posteriorsOf : function( vertex_array, clear_visited_function ){
		return this.transitiveClosureOf( vertex_array, "getChildrenAndNeighbours",
			clear_visited_function )
	},
	
	childrenOf : function( vertex_array ){
		var r = []
		for( var i = 0 ; i < vertex_array.length ; i ++ ){
			r = r.concat( vertex_array[i].getChildren() )
		}
		return _.uniq(r)
	},
	
	parentsOf : function( vertex_array ){
		var r = []
		for( var i = 0 ; i < vertex_array.length ; i ++ ){
			r = _.uniq( r.concat( vertex_array[i].getParents() ) )
		}
		return _.uniq(r)
	},
	
	/* 
	 *	Generalizes "neighbours" to vertex sets. 
	 *	Returns all vertices in G adjacent to any of the given vertices,
	 *	except for those that are already in the input set.
	 */ 
	neighboursOf : function( vertex_array ){
		var vh = new Hash()
		_.each( vertex_array, function(v){
			vh.set( v.id, v )
		})
		var rh = new Hash()
		_.each( vertex_array, function(v){
			_.each( v.getNeighbours(), function(w){
				if( !vh.get( w.id ) ){
					rh.set(w.id,w)
				}
			})
		})
		return rh.values()
	},
	
	spousesOf : function( vertex_array ){
		var vh = new Hash()
		_.each( vertex_array, function(v){
			vh.set( v.id, v )
		})
		var rh = new Hash()
		_.each( vertex_array, function(v){
			_.each( v.getSpouses(), function(w){
				if( !vh.get( w.id ) ){
					rh.set(w.id,w)
				}
			})
		})
		return rh.values()
	},
	
	adjacentNodesOf : function( vertex_array ){
		var vh = new Hash()
		_.each( vertex_array, function(v){
			vh.set( v.id, v )
		})
		var rh = new Hash()
		_.each( vertex_array, function(v){
			_.each( v.getAdjacentNodes(), function(w){
				if( !vh.get( w.id ) ){
					rh.set(w.id,w)
				}
			})
		})
		return rh.values()
	},

	areAdjacent : function( v1, v2 ){
		v1 = this.getVertex(v1)
		v2 = this.getVertex(v2)
		if( _.any( _.map( v1.outgoingEdges, function(e){ return e.v2 == v2 } ) ) ){
			return true
		}
		return _.any( _.map( v1.incomingEdges, function(e){ return e.v1 == v2 } ) ) 
	},
	
	/**
	 *      Graph is assumed to be a tree (not a forest), only
	 *      undirected edges are considered. */
	visitAllPathsBetweenVisitedNodesInTree : function(){
		// this gets a random vertex 
		var root = this.getVertex( Object.keys( this.vertices.kv )[0] )
		var v
		if( !root ) return 
						// calculate the depth of all nodes in the tree 
		var q = [root]
		_.each( this.vertices.values(), function(v){
			v.traversal_info.depth = 0
		})
		root.traversal_info.parent = null        
		var max_depth = 0
		while( q.length > 0 ){
			v = q.pop()
			var children = _.reject( v.getNeighbours(), 
			function(v2){ return (v2 === root) || (v2.traversal_info.depth > 0) })
			_.each( children, function(v2){
				v2.traversal_info.depth = v.traversal_info.depth + 1
				if(  Graph.Vertex.isVisited(v2) && 
					v2.traversal_info.depth > max_depth ){
					max_depth = v2.traversal_info.depth
				}
				v2.traversal_info.parent = v
				q.push(v2)
			})
		}
		// layer the tree
		var tokens = new Array( max_depth + 1 )
		for( var i = 0 ; i <= max_depth ; i ++ ){
			tokens[i] = []
		}
		var nr_tokens = 0
		_.chain(this.vertices.values()).filter(Graph.Vertex.isVisited).each(function(v){
			tokens[v.traversal_info.depth].push(v)
			nr_tokens ++
		})
		while( nr_tokens > 1 ){
			v = tokens[max_depth].pop()
			if( v.traversal_info.parent && !Graph.Vertex.isVisited( v.traversal_info.parent ) ){
				Graph.Vertex.markAsVisited( v.traversal_info.parent )
				tokens[max_depth-1].push( v.traversal_info.parent )
			} else {
				nr_tokens --
			}
			while( (nr_tokens > 0) && (tokens[max_depth].length == 0) ){
				max_depth --
			}
		}
	},
	
	getEdge : function( v1, v2, edgetype ){
		v1 = this.getVertex( v1 )
		v2 = this.getVertex( v2 )
		if( typeof edgetype == "undefined" ){
			edgetype = Graph.Edgetype.Directed
		}
		if( !(v1 && v2) ){ return undefined }
		var e = _.find( v1.outgoingEdges, function( e ){ 
			return e.v2.id==v2.id && e.directed == edgetype } )
		if( e ){ return e }
		if( Graph.Edgetype.Symmetric[edgetype] ){
			return _.find( v1.incomingEdges, function( e ){ 
				return e.v1.id==v2.id && e.directed == edgetype } )
		}
		return undefined
	},
	
	addEdge: function( v1, v2, edgetype ){
		v1 = this.getVertex( v1 )
		v2 = this.getVertex( v2 )
		if( typeof edgetype == "undefined" ){
			edgetype = Graph.Edgetype.Directed
		}
		var e = this.getEdge( v1, v2, edgetype )
		if( typeof e == "undefined" && Graph.Edgetype.Symmetric[edgetype] ){
			e = this.getEdge( v2, v1, edgetype )
		}
		if( typeof e == "undefined" ){
			e = this.quickAddEdge(v1, v2, edgetype)
		} 
		return e
	},

	quickAddEdge: function (v1, v2, edgetype){
		var e = new Graph.Edge({v1:v1,v2:v2,directed:edgetype})
		e.v1.outgoingEdges.push( e )
		e.v2.incomingEdges.push( e )
		this.edges.push( e )
		return e
	},

	quickAddDirectedEdge: function (v1, v2) {
		this.quickAddEdge(v1, v2, Graph.Edgetype.Directed)
	},

	deleteEdge : function( v1, v2, edgetype ) {
		if( typeof edgetype == "undefined" ){
			throw("too few parameters for deleteEdge!")
		}
		var e = this.getEdge( v1, v2, edgetype )
		if( typeof e == "undefined" ){
			return false
		}
		e.v1.outgoingEdges = _.without( e.v1.outgoingEdges, e )
		e.v2.incomingEdges = _.without( e.v2.incomingEdges, e )
		this.edges = _.without( this.edges, e )
		return true
	},

	changeEdge : function( e, edgetype_new, v1_new ){
		if( typeof v1_new == "undefined" ){
			v1_new = e.v1
		} else {
			v1_new = this.getVertex( v1_new )
		}
		var v2_new = v1_new == e.v1 ? e.v2 : e.v1
		if( typeof this.getEdge( v1_new, v2_new, edgetype_new ) != "undefined" ){
			return false
		}
		if( Graph.Edgetype.Symmetric[edgetype_new] ){
			e.directed = edgetype_new
		} else {
			if( v1_new != e.v1 ){
				this.reverseEdge( e )
			}
			e.directed = edgetype_new
		}
		return true
	},
	
	reverseEdge : function( e ){
		e.v1.outgoingEdges = _.without( e.v1.outgoingEdges, e )
		e.v2.incomingEdges = _.without( e.v2.incomingEdges, e )
		var vn = e.v2
		e.v2 = e.v1
		e.v1 = vn
		e.v1.outgoingEdges.push( e )
		e.v2.incomingEdges.push( e )
	},

	toAdjacencyList: function(){
		var ra = []
		var g = this
		_.each( g.vertices.values(), function( v ){
			var children = v.getChildren(), neighbours = v.getNeighbours(), spouses= v.getSpouses()
			var r = "",rc = []
			if( children.length + neighbours.length
				+ spouses.length > 0 ){
				_.each( neighbours, function( v2 ){
					var e = g.getEdge( v, v2, Graph.Edgetype.Undirected )
					if( e.v1.id === v.id ){
						r = encodeURIComponent(e.v2.id)
						if( e.layout_pos_x ){
							r += " @"+e.layout_pos_x.toFixed(3)+","
							+e.layout_pos_y.toFixed(3)
						}
					} else {
						r = encodeURIComponent(e.v1.id)
					}
					rc.push(r)
				} )
				_.each( 
				children, function( v2 ){
					var e = g.getEdge( v, v2, Graph.Edgetype.Directed )
					r = encodeURIComponent(v2.id)
					if( e.layout_pos_x ){
						r += " @"+e.layout_pos_x.toFixed(3)+","
						+e.layout_pos_y.toFixed(3)
					}
					rc.push(r)
				} )
				_.each( spouses, function( v2 ){
					var e = g.getEdge( v, v2, Graph.Edgetype.Bidirected )
					if( e.v1.id === v.id ){
						r = encodeURIComponent(e.v2.id)
						if( e.layout_pos_x ){
							r += " @"+e.layout_pos_x.toFixed(3)+","
							+e.layout_pos_y.toFixed(3)
						}
					} else {
						r = encodeURIComponent(e.v1.id)
					}
					rc.push(r)
				} )
			}
			if( rc.length > 0 ){
				rc.sort()
				ra.push(encodeURIComponent(v.id)+" "+rc.join(" "))
			}
		} )
		ra.sort()
		return ra.join("\n")
	},
	
	toVertexLabels: function(){
		var expandLabel = function( v, g ){
			var property_string = (g.isSource(v) ? "E" : "")
			+ (g.isTarget(v) ? "O" : "")
			+ (g.isAdjustedNode(v) ? "A" : "")
			+ (g.isLatentNode(v) ? "U" : "")
			//+ (v.weight !== undefined ? v.weight : "");
			if( !property_string ){ property_string = 1 }
			return encodeURIComponent(v.id) + " " + property_string + (v.layout_pos_x !== undefined ? 
			" @"+v.layout_pos_x.toFixed( 3 ) +","
			+v.layout_pos_y.toFixed( 3 ) : "")
		}
		var r = ""
		var g = this
		var ra = []
		_.each( 
		this.vertices.values(), function( v ){
			ra.push(expandLabel( v, g )+"\n")
		} )
		ra.sort()
		return r + ra.join("")
	},
	
	toString : function(){
		return GraphSerializer.toDot( this )
	},
	
	oldToString : function(){
		return this.toVertexLabels() + "\n" + this.toAdjacencyList()
	},
	
	hasCompleteLayout : function(){
		return _.all(this.vertices.values(),function(v){
			return v.layout_pos_x !== undefined && v.layout_pos_y !== undefined})
	},
	
	/*
	 *	Counts the different causal paths from any source to any target.
	 *	TODO currently does so by iterating over all pairs of sources and targets,
	 *	which is quite dumb.
	 */
	countPaths: function(){
		if( this.getSources().length == 0 || this.getTargets().length == 0 ){
			return 0
			//throw( "Source and/or target not set!" ); 
		}
		
		var visit = function( v, t ){
			if( !Graph.Vertex.isVisited( v ) ){
				Graph.Vertex.markAsVisited( v )
				if( v === t ){
					v.traversal_info.paths_to_sink = 1
				} else { 
					v.traversal_info.paths_to_sink = 0
					_.each(v.getChildren(), function( vc ){
						v.traversal_info.paths_to_sink += visit( vc, t )
					} )
				}
			}
			return v.traversal_info.paths_to_sink
		}
		var r = 0
		_.each(this.getSources(), function( s ){
			_.each( this.getTargets(), function( t ){
				this.clearTraversalInfo()
				r = r + visit( s, t )
			}, this )
		}, this )
		return r
	},
	
	sourceConnectedToTarget: function(){
		if( !this.getSource() || !this.getTarget() ){
			return false
		}
		if( arguments.length == 0 ){
			return this.sourceConnectedToTarget( this.getSource(), this.getTarget() )
		} else if( arguments.length == 1 ){
			var avoid_nodes = arguments[0]
			this.clearTraversalInfo()
			_.each( avoid_nodes, function(v){ 
				this.getVertex(v) && (this.getVertex(v).traversal_info.visited = true)
			}, this )
			return this.sourceConnectedToTarget( this.getSource(), this.getTarget() )
		} else {
			var s = arguments[0], t = arguments[1]
			if( !s.traversal_info ){ this.clearTraversalInfo() } 
			if( s == t ){
				return true
			}
			s.traversal_info.visited = true
			if( s.getChildren().any( function( n ){
				return !n.traversal_info.visited && !n.traversal_info.adjusted_for 
				&& this.sourceConnectedToTarget( n, t ) }, this ) ){
				return true
			}
			s.traversal_info.visited = false
			return false
		}
	}
} ); // Class.create

// mixin getters & setters for managed vertex properties
(function(c){
	_.each( c.prototype.managed_vertex_property_names, function(p){
		var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length)
		c.prototype["is"+pcamel] = function( v ){ return this.vertexHasProperty( v, p ) }
		c.prototype["add"+pcamel] = function( v ){ return this.addVertexProperty( v, p ) }
		c.prototype["remove"+pcamel] = function( v ){ return this.removeVertexProperty( v, p ) }
		c.prototype["get"+pcamel+"s"] = function(){ return this.getVerticesWithProperty( p ) }
		c.prototype["set"+pcamel+"s"] = function( vs ){ 
			this.removePropertyFromAllVertices( p )
			_.each(vs, function(v){ this.addVertexProperty( v, p ) }, this)
		}
		c.prototype["removeAll"+pcamel+"s"] = function(){ return this.removePropertyFromAllVertices( p ) }
	} )
})(Graph)


Graph.Vertex = Class.extend({
	init : function( spec ){
		this.id = spec.id
		this.weight = spec.weight !== undefined ? spec.weight : 1
		if( spec.layout_pos_x !== undefined ){
			this.layout_pos_x = spec.layout_pos_x
			this.layout_pos_y = spec.layout_pos_y
		} 
		//this.adjacentEdges = {}
		//this.adjacentBidirectedEdges = []
		this.incomingEdges = []
		this.outgoingEdges = []
		this.traversal_info = {}
	}, 
	/**
		*      see below for meaning of this generic function 
		*/
	getKinship : function( edgetype, outward ){
		var r = [], n = this
		if( arguments.length == 1 ){ outward = true }
		if( outward || Graph.Edgetype.Symmetric[edgetype] ){
			_.each( n.outgoingEdges, function( e ){
				if( e.directed == edgetype ) r.push( e.v1 === n ? e.v2 : e.v1 )
			} )
		}
		if( !outward || Graph.Edgetype.Symmetric[edgetype] ){
			_.each( n.incomingEdges, function( e ){
				if( e.directed == edgetype ) r.push( e.v1 === n ? e.v2 : e.v1 )
			} )
		}
		return r
	},
	getChildrenAndNeighbours : function(){
		return this.getNeighbours().concat(this.getChildren())
	},
	getParentsAndNeighbours : function(){
		return this.getNeighbours().concat(this.getParents())
	},
	getPossibleParentsAndPossibleNeighbours : function(){
		return this.getPossibleNeighbours().concat(this.getPossibleParents())
	},
	getPossibleNeighbours : function(){
		return this.getKinship( Graph.Edgetype.Undirected ).
			concat( this.getKinship( Graph.Edgetype.Unspecified ) )
	},
	getNeighbours : function(){
		return this.getKinship( Graph.Edgetype.Undirected )
	},
	getSpouses : function(){
		return this.getKinship( Graph.Edgetype.Bidirected )
	},
	getChildren : function(){
		return this.getKinship( Graph.Edgetype.Directed )
	},
	getParents : function(){
		return this.getKinship( Graph.Edgetype.Directed, false )
	},
	getPossibleParents : function(){
		return this.getKinship( Graph.Edgetype.Directed, false ).
			concat( this.getKinship( Graph.Edgetype.PartDirected, false ) )
	},
	getAdjacentNodes : function(){
		return (this.getChildrenAndNeighbours().
			concat(this.getParents()).
			concat(this.getSpouses()))
	},
	degree : function(){
		if( arguments.length >= 1 ){
			switch( arguments[0] ){
			case Graph.Edgetype.Bidirected :
				return this.getSpouses().length
			case Graph.Edgetype.Undirected :
				return this.getNeighbours().length
			case Graph.Edgetype.Directed :
				return this.getChildren().length+this.getParents().length
			}
		} else {
			return this.getAdjacentNodes().length
		}
	},
	cloneWithoutEdges : function(){
		var r = new Graph.Vertex( this )
		return r
	}
} )

Graph.Vertex.isVisited = function( v ){
	return v.traversal_info.visited
}
Graph.Vertex.markAsVisited = function( v ){
	v.traversal_info.visited = true
}
Graph.Vertex.markAsNotVisited = function( v ){
	v.traversal_info.visited = false
}

Graph.Edge = Class.extend( {
	init : function( spec ){
		this.v1 = spec.v1
		this.v2 = spec.v2
		this.directed = spec.directed
		this.style = spec.style
		this.layout_pos_x = spec.layout_pos_x
		this.layout_pos_y = spec.layout_pos_y
	},
	toString : function( ){
		var edge_join = Graph.Edgetype.Symbol[this.directed] 

		var v1id = GraphSerializer.dotQuoteVid(this.v1.id)
		var v2id = GraphSerializer.dotQuoteVid(this.v2.id)
	
		if( Graph.Edgetype.Symmetric[this.directed] && 
			(v1id > v2id) ){
			var tmp = v1id
			v1id = v2id
			v2id = tmp
		}
	
		return v1id + " " + edge_join + " " + v2id
	}
} )

Graph.Edgetype = {
	Undirected : 0,
	Directed : 1,
	Bidirected : 2,
	Unspecified : 3,
	PartDirected : 4,
	PartUndirected : 5,
	Symmetric : {
		0 : true,
		1 : false,
		2 : true,
		3 : true,
		4 : false,
		5 : false
	},
	Symbol : {
		0 : "--",
		1 : "->",
		2 : "<->",
		3 : "@-@",
		4 : "@->",
		5 : "@--"
	}
}

Graph.Edge.Bidirected = Graph.Edge.extend( {
	init : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Bidirected
	}
} )

Graph.Edge.Directed = Graph.Edge.extend( {
	init : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Directed
	}
} )

Graph.Edge.Undirected = Graph.Edge.extend( {
	init : function( spec ){
		this._super( spec )
		this.directed = Graph.Edgetype.Undirected
	}
} )
/* This is a namespace containing various methods that analyze a given
 * graph. These methods do not change the graph. */

/* globals _,Graph,GraphTransformer,Hash */
/* exported GraphAnalyzer */

var GraphAnalyzer = {
	/*
		test if two graphs are equal, with equal id s
	*/
	equals : function( g, h ){
		if( g == null ){ return h == null }
		if( h == null ){ return false }
		var gva = g.getVertexIDs()
		var hva = h.getVertexIDs()
		var i
		if( gva.length != hva.length ){
			return false
		}
		gva = gva.sort()
		hva = hva.sort()
		for( i = 0 ; i < gva.length ; i ++ ){
			if( gva[i] != hva[i] ){
				return false
			}
		}
		var gee = g.getEdges(), vee = h.getEdges()
		if( gee.length != vee.length ){
			return false
		}
		var gel = [], vel = []
		var acanon = function(a){
			var tmp
			if( Graph.Edgetype.Symmetric[ a[2] ] &&
				a[0] < a[1] ){
				tmp = a[1]
				a[1] =  a[0]
				a[0] =  tmp
			}
		}
		for( i = 0 ; i < gee.length ; i ++ ){
			gel[i] = [gee[i].v1.id,gee[i].v2.id,gee[i].directed]
			acanon( gel[i] )

			vel[i] = [vee[i].v1.id,vee[i].v2.id,vee[i].directed]
			acanon( vel[i] )
		}

		var edgecompare = function(a,b){
			for( var i = 0 ; i <= 2 ; i ++ ){
				if( a[i] != b[i] ){
					return a[i] < b[i] ? -1 : 1
				}
			}
			return 0
		}

		gel = gel.sort( edgecompare )
		vel = vel.sort( edgecompare )

		for( i = 0 ; i < gel.length ; i ++ ){
			if( edgecompare( gel[i], vel[i] ) != 0 ){
				return false
			}
		}
		return true
	},
	
	trekRule : function( g, v1, v2, use_ids_as_labels, standardized ){
		standardized = standardized ? 1 : 0
		var vnr = [], i, j, vi, vj
		var vv = g.getVertices(), ee = g.getEdges(), parameters = [],
			has_parameter = {}, p
		if( typeof use_ids_as_labels === "undefined" ){
			use_ids_as_labels = false
		}
		
		for( i = 0 ; i < vv.length ; i ++ ){
			if( use_ids_as_labels ){
				vnr[vv[i].id] = vv[i].id
			} else {
				vnr[vv[i].id] = i
			}
			if( !standardized ){
				parameters.push( "v"+vnr[vv[i].id] ) 
			}
		}
		
		var pars = function( e, c ){
			if( e.id ){ return e.id }
			if( e.attributes && e.attributes["beta"] ){
				return e.attributes["beta"]
			}
			vi = g.getVertex(e.v1)
			vj = g.getVertex(e.v2)
			if( c == "c" ){
				if( vi.id < vj.id ){
					return c+vnr[vi.id]+c+vnr[vj.id]
				} else {
					return c+vnr[vj.id]+c+vnr[vi.id]
				}
			} else {
				return c+vnr[vi.id]+c+vnr[vj.id]
			}
		}
	
		for( i = 0 ; i < ee.length ; i ++ ){
			var e = ee[i]
			if( e.directed == Graph.Edgetype.Bidirected ){
				p = pars(e,"c")
			} else if( e.directed == Graph.Edgetype.Directed ){
				p = pars(e,"b")
			}
			if( !has_parameter[p] ){
				if( parseFloat( p ) != p ){
					parameters.push( p )
				}
				has_parameter[p] = true
			}
		}
		
		var gtrek = GraphTransformer.trekGraph( g, "up_", "dw_" )
		
		var treks = []
		
		var visit = function( v, t, trek ){
			if( v == t )
			{
				treks.push( trek.slice() )
				return
			}
			_.each( v.getChildren(), function( vc ){
				if( !Graph.Vertex.isVisited( vc ) ){
					Graph.Vertex.markAsVisited( vc )
					var gd = 0
					if( standardized && v.id.substr(0,3) == "up_" && vc.id.substr(0,3) == "up_" ){
						gd = gtrek.getVertex( "dw_"+v.id.substr(3) )
						Graph.Vertex.markAsVisited( gd )
					}
					trek.push( vc.id )
					visit( vc, t, trek )
					Graph.Vertex.markAsNotVisited( vc )
					if( gd ){
						Graph.Vertex.markAsNotVisited( gd )
					}
					trek.pop()
				}
			} )
		}
		
		visit( gtrek.getVertex("up_"+v1.id), 
			gtrek.getVertex("dw_"+v2.id), 
			["up_"+v1.id] )
		
		var trek_monomials = []
		
		for( i = 0 ; i < treks.length ; i ++ ){
			trek_monomials[i] = []
			for( j = 0 ; j < treks[i].length-1 ; j ++ ){
				var v1_pre = treks[i][j].substring( 0, 3 )
				var v1_id = treks[i][j].substring( 3 )
				var v2_pre = treks[i][j+1].substring( 0, 3 )
				var v2_id = treks[i][j+1].substring( 3 )
				if( v1_pre == v2_pre ){
					if( v1_pre == "up_" )
						trek_monomials[i].push( 
								pars(g.getEdge(v2_id,v1_id,Graph.Edgetype.Directed),"b"))
						else
							trek_monomials[i].push( 
								pars(g.getEdge(v1_id,v2_id,Graph.Edgetype.Directed),"b"))
				} else {
					if( v1_id == v2_id ){
						if( !standardized ){
							trek_monomials[i].push( 
								/*<->*/"v"+vnr[v1_id] )
						}
					} else {
						trek_monomials[i].push( /*<-->*/
							pars(g.getEdge(v1_id,v2_id,Graph.Edgetype.Bidirected),"c"))
					}
				}
			}
		}
		//print( trek_monomials )
		return [trek_monomials,parameters]
	},
	
	vanishingTetrads : function( g, nr_limit, type ){
		var r = []
		g = GraphTransformer.canonicalDag(g).g
		var gtrek = GraphTransformer.trekGraph( g, "up_", "dw_" )
		gtrek.addVertex("s")
		gtrek.addVertex("t")	
		var latents = g.getLatentNodes()
		var is_latent = []; for( var i = 0 ; i < latents.length ; i ++ ){ is_latent[latents[i].id]=1 }
		
		var vv = _.pluck(_.reject(g.getVertices(),function(v){return is_latent[v.id]}),"id"), 
			i1, i2, i3, i4, iside, jside, s = gtrek.getVertex("s"), t = gtrek.getVertex("t")
		
		function examineQuadruple( i1, i2, j1, j2 ){
			var pi, pj
			iside = [ gtrek.getVertex( "up_"+i1 ),
				gtrek.getVertex( "up_"+i2 ) ]
			jside = [ gtrek.getVertex( "dw_"+j1 ),
				gtrek.getVertex( "dw_"+j2 ) ]
			if( type == "between" || type == "epistemic" ){
				pi = _.pluck(g.parentsOf( g.getVertex([i1,i2]) ),"id")
				pj = _.pluck(g.parentsOf( g.getVertex([j1,j2]) ),"id")
				if( type == "between" && ( pi.length != 1 || pj.length != 1 || pi[0] == pj[0] ) ){
					return
				}
				if( type == "epistemic" && 
					!( ( pi.length == 1 && pj.length == 2 ) || 
						( pi.length == 2 && pj.length == 1 ) ) ){
					return
				}
			}
			gtrek.addEdge( s, iside[0], Graph.Edgetype.Directed )
			gtrek.addEdge( s, iside[1], Graph.Edgetype.Directed )

			gtrek.addEdge( jside[0], t, Graph.Edgetype.Directed )
			gtrek.addEdge( jside[1], t, Graph.Edgetype.Directed )

			if( GraphAnalyzer.minVertexCut( gtrek, [s], [t] ) <= 1 ){
				r.push( [i1, j1, j2, i2] ) // lisrel convention
			}

			gtrek.deleteEdge( s, iside[0], Graph.Edgetype.Directed )
			gtrek.deleteEdge( s, iside[1], Graph.Edgetype.Directed )

			gtrek.deleteEdge( jside[0], t, Graph.Edgetype.Directed )
			gtrek.deleteEdge( jside[1], t, Graph.Edgetype.Directed )

		}

		var p1, p2, p3, p4	
		for( i1 = 0 ; i1 < vv.length ; i1 ++ ){
			p1 = _.pluck(g.getVertex(vv[i1]).getParents(),"id")
			if( type && ( p1.length != 1 ) ) continue
			for( i2 = i1+1 ; i2 < vv.length ; i2 ++ ){
				p2 = _.pluck(g.getVertex(vv[i2]).getParents(),"id")
				if( type && ( p2.length != 1 ) ) continue
				for( i3 = i2+1 ; i3 < vv.length ; i3 ++ ){
					p3 = _.pluck(g.getVertex(vv[i3]).getParents(),"id")
					if( type && ( p3.length != 1 ) ) continue
					for( i4 = i3+1 ; i4 < vv.length ; i4 ++ ){
						p4 = _.pluck(g.getVertex(vv[i4]).getParents(),"id")
						if( type && ( p4.length != 1 ) ) continue
						if( type == "within" && 
							_.intersection(p1,p2,p3,p4).length == 0 ) continue
						examineQuadruple( vv[i1], vv[i2], vv[i3], vv[i4] )
						examineQuadruple( vv[i1], vv[i3], vv[i2], vv[i4] )
						examineQuadruple( vv[i1], vv[i4], vv[i2], vv[i3] )
						if( nr_limit -- < 0 ) return r
					}
				}
			}
		}
		
		return r
	},
	
	minVertexCut : function( g, sources, targets ){
		var i, j, vv, ee, e, is_target = [], s, t
		
		if( !sources ) sources = g.getSources()
		if( !targets ) targets = g.getTargets()
				
		for( i = 0 ; i < sources.length ; i ++ ){
			s = sources[i]
			for( j = 0 ; j < targets.length ; j ++ ){
				t = targets[j]
				if( ( s.id == t.id ) || ( g.getEdge( s.id, t.id ) ) )
					return undefined
				is_target[t.id] = true
			}
		}
				
		var flowE = [], flowV = [], parents = []
				
		vv = g.getVertices()
		for( i = 0 ; i < vv.length ; i ++ ){
			flowV[ vv[i].id ] = 0
			if( flowE[ vv[i].id ] === undefined ) flowE[ vv[i].id ] = []
		}
				
		ee = g.getEdges()
		for( i = 0 ; i < ee.length ; i ++ ){
			e = ee[i]
			flowE[ e.v1.id ][ e.v2.id ] = 0
		}
				
		var findAugmentingPath = function( vqueue ){
			var i, vnext, qfront = 0, forwards
			var dirqueue = []
			for( i = 0 ; i < vqueue.length ; i ++ ){
				dirqueue[i] = 1
			}
					
			var pars = [ {}, {} ]
			for( i = 0 ; i < vqueue.length ; i ++ ) pars[1][vqueue[i]] = -1
						
			function checkPath( vn, fw ){
				if( pars[fw?1:0][vn.id] === undefined ){
					vqueue.push( vn.id )
					dirqueue.push( fw?1:0 )
					pars[fw?1:0][vn.id] = qfront
				}
			}
						
			while( qfront < vqueue.length ){
				vid = vqueue[qfront]
				forwards = dirqueue[qfront]
				// vqueue = [vstart.id], dirqueue = [1],
				if( is_target[vid] && forwards ){
					var v2id = t.id, dir = dirqueue[qfront]
					parents = [v2id]
					while( pars[dir][vqueue[qfront]] >= 0 ){
						parents.unshift( dir )
						qfront = pars[dir][vqueue[qfront]]
						dir = dirqueue[qfront]
						parents.unshift( vqueue[qfront] )
					}
					return true
				}
								
				if( flowV[ vid ] ){
					// If there has been flow, we can only move out
					// in the opposite direction that we came in.
					if( forwards ){
						vnext = g.getVertex(vid).getParents()
						for( i = 0 ; i < vnext.length ; i ++ ){
							/// going backwards only if previously went forwards
							if( flowE[vnext[i].id][vid] ){
								checkPath( vnext[i], false )
							}
						}
					} else {
						vnext = g.getVertex(vid).getChildren()
						for( i = 0 ; i < vnext.length ; i ++ ){
							checkPath( vnext[i], true )
						}
					}
									
				} else {
					// If there is no flow in this vertex, none
					// of the parent edges have flow. We can only move out
					// forwards. Also, we must have come in forwards.
					vnext = g.getVertex(vid).getChildren()
					for( i = 0 ; i < vnext.length ; i ++ ){
						checkPath( vnext[i], true )
					}
				}
				qfront ++
			}
						
			return false
		}
				
		var vid, trials = g.getVertices().length
		i = 0
		while( findAugmentingPath( _.pluck(sources,"id") ) && --trials > 0 ){
			i++
			for( j = 2 ; j < parents.length-1 ; j += 2 ){
				if( parents[j-1] && parents[j+1] ){ 
					flowV[parents[j]] = 1
				}
				if( !parents[j-1] && !parents[j+1] ){ 
					flowV[parents[j]] = 0
				}
			}
			for( j = 1 ; j < parents.length ; j += 2 ){
				if( parents[j] ){
					flowE[parents[j-1]][parents[j+1]] ++
				} else {
					flowE[parents[j+1]][parents[j-1]] --
				}
			}
			parents = []
		}
		return i
	},

	isAdjustmentSet : function( g, Z ){
		var gtype = g.getType()
		Z = _.map( Z, g.getVertex, g )
		if( gtype != "dag" && gtype != "pdag" && gtype != "mag" && gtype != "pag" ){
			throw( "Cannot compute adjustment sets for graph of type "+gtype )
		}
		if( g.getSources().length == 0 || g.getTargets().length == 0 ){
			return false
		}

		if( _.intersection( this.dpcp(g), Z ).length > 0 ){
			return false
		}
		var gbd = GraphTransformer.backDoorGraph(g)
		Z = _.map( Z, gbd.getVertex, gbd )
		return !this.dConnected( gbd, gbd.getSources(), gbd.getTargets(), Z )
	},
	
	listMsasTotalEffect : function( g, must, must_not, max_nr ){
		var gtype = g.getType()
		if( gtype != "dag" && gtype != "pdag" && gtype != "mag" && gtype != "pag" ){
			throw( "Cannot compute total affect adjustment sets for graph of type "+gtype )
		}
		if( gtype == "pdag" ){
			g = GraphTransformer.cgToRcg( g )
		}	
		if( !g ){ return [] }
	
		if(GraphAnalyzer.violatesAdjustmentCriterion(g)){ return [] }
		var adjusted_nodes = g.getAdjustedNodes()
		var latent_nodes = g.getLatentNodes().concat( this.dpcp(g) )
		
		var gam = GraphTransformer.moralGraph( 
			GraphTransformer.ancestorGraph( 
			GraphTransformer.backDoorGraph(g) ) )
				
		if( must )
			adjusted_nodes = adjusted_nodes.concat( must )
		if( must_not )
			latent_nodes = latent_nodes.concat( must_not )
		
		return this.listMinimalSeparators( gam, adjusted_nodes, latent_nodes, max_nr )
	},

	canonicalAdjustmentSet : function( g ){
		var Z = _.difference( g.anteriorsOf( _.union(g.getSources(), g.getTargets() ) ),
			_.union( g.getLatentNodes(),
				g.getSources(), g.getTargets(),
				GraphAnalyzer.dpcp( g ) ) )
		if( GraphAnalyzer.isAdjustmentSet( g, Z ) ){
			return [Z]
		} else {
			return []
		}
	},
	
	listMsasDirectEffect : function( g, must, must_not ){
		var gtype = g.getType()
		if( gtype != "dag" ){
			throw( "Cannot comute direct-effect adjustment sets for graphs of type "+gtype )
		}
		if( gtype == "pdag" ){
			g = GraphTransformer.cgToRcg( g )
		}
		if( !g ){ return [] }

		var adjusted_nodes = g.getAdjustedNodes()
		var de_y = g.descendantsOf( _.intersection( g.descendantsOf( g.getSources() ),
			g.getTargets() ) )
		if( _.intersection( de_y, adjusted_nodes ).length > 0 ){
			return []
		}
		var latent_nodes = g.getLatentNodes().concat( de_y )
		var gam =  GraphTransformer.moralGraph(
			GraphTransformer.ancestorGraph(
				GraphTransformer.indirectGraph(g) ) )
	
		if( must )
			adjusted_nodes = adjusted_nodes.concat( must )
		if( must_not )
			latent_nodes = latent_nodes.concat( must_not )
			
		return this.listMinimalSeparators( gam, adjusted_nodes, latent_nodes )
	},
	
	listDseparators : function( g, must, must_not, max_nr ){
		var adjusted_nodes = g.getAdjustedNodes()
		var latent_nodes = g.getLatentNodes()
		
		var gam = GraphTransformer.moralGraph( GraphTransformer.ancestorGraph(g) )
		
		if( must )
			adjusted_nodes = adjusted_nodes.concat( must )
		if( must_not )
			latent_nodes = latent_nodes.concat( must_not )

		return this.listMinimalSeparators( gam, adjusted_nodes, latent_nodes, max_nr )
	},

	/* Replaces the old "closeSeparator" function
	 */
	//find one minimal and nearest separator
	findMinimalSeparator : function( g, x, y, must, must_not ){
		if (!x) x = g.getSources()
		if (!y) y = g.getTargets()
		if (!must) must = []
		if (!must_not) must_not = []
		
		var a = g.anteriorsOf(_.union(x, y, must))
		
		var z1 = _.difference(a, x, y, must_not, g.getLatentNodes())
		
		function removeUnreachable(x2, y2, oldZ) {			
			var z = GraphAnalyzer.closeSeparator(g, x2, y2, a, oldZ )
			if (z === false) return z
			
			return _.union(_.intersection(oldZ, z), must)
		}
		
		var z2 = removeUnreachable(x, y, z1)
		if (z2 === false) return z2

		var z3 = removeUnreachable(y, x, z2)
		
		return z3
	},
	
	listBasisImplications : function( g ){
		var r = []
		var vv = g.vertices.values()
		_.each( vv, function(v){
			var nondescendants = _.difference( vv, g.descendantsOf( [v] ) )
			var parents = g.parentsOf( [v] )
			var sepnodes = _.difference( nondescendants, parents )
			if( sepnodes.length > 0 ){
				r.push( [v.id, _.pluck(sepnodes,"id"),
					[parents]] )
			}
		} )
		return r
	},
	
	listMinimalImplications : function( g, max_nr ){
		var r = []
		var g2 = g.clone()
		var vv = g2.vertices.values()
		// this ignores adjusted vertices for now 
		for( var i = 0 ; i < vv.length ; i ++ ){
			g2.removeAllAdjustedNodes()
		}
		var n = 0
		for( i = 0 ; i < vv.length ; i ++ ){
			for( var j = i+1 ; j < vv.length ; j ++ ){
				if( !g2.isLatentNode( vv[i] ) && !g2.isLatentNode( vv[j] ) 
					&& !g2.getEdge( vv[i].id, vv[j].id ) && !g2.getEdge( vv[j].id, vv[i].id ) ){
					g2.removeAllSources().addSource( g2.getVertex( vv[i].id ) )
					g2.removeAllTargets().addTarget( g2.getVertex( vv[j].id ) )
					var seps = GraphAnalyzer.listDseparators( g2, [], [], max_nr-n )
					if( seps.length > 0 ){
						seps = _.map( seps, function(s){
							return g.getVertex( _.pluck(s,"id") )
						})
						r.push( [vv[i].id, vv[j].id, seps] )
						n += seps.length
						if( n >= max_nr ){
							return r
						}
					}
				}
			}
		}
		return r
	},
	
	/** Given an undirected graph, this function checks whether the graph could
	  * enocde the correlations entailed by a DAG on the same variables.
	  * If so, it returns a CPDAG describing the class of edge-maximal DAGs
	  * that are consistent with the input graph. */
	isDG : function( g ){
		var cpdag = GraphTransformer.dependencyGraph2CPDAG( g ), p1, p2
		if( g.edges.all( function( e ){
			if( typeof cpdag.getEdge( e.v1.id, e.v2.id, 
					Graph.Edgetype.Undirected ) == "undefined" ){ 
				p1 = cpdag.getVertex(e.v1.id).getParents().pluck("id")
				p2 = cpdag.getVertex(e.v2.id).getParents().pluck("id")
				if( !p1.include(e.v2.id) && !p2.include(e.v1.id) 
						&& p1.intersect(p2).length == 0 ){
					return false
				}
			}
			return true
		} ) ){
			return cpdag
		}
		return false
	},
	
	/**
	 * Extracts the path pairs from the transformation by Eppstein, implemented
	 * as "pathPairGraph" in GraphTransformer.js
	 * 
	 * */
	listPathPairs : function( g ){
		var paths = g.listPaths().split("\n")
		var r = ""
		_.each( paths, function( p ){
			if( p == "..." ){
				r += "\n..."
			} else {
				var p_arr = p.split("->").slice(1).map( function(s){ return s.split(":") } )
				var left_side = _.uniq(_.pluck(p_arr,"0")).slice(1).join("->")
				var right_side = _.uniq(_.pluck(p_arr,"1")).reverse().join("<-")
				r += ( r == "" ? "" : "\n" ) + right_side + "->" + left_side
			}
		} )
		return r
	},
	
	directEffectEqualsTotalEffect : function( g ){
		return ( _.chain(g.childrenOf(g.getSources()))
			.difference( g.getSources() )
			.difference( g.getTargets() ).value().length == 0 )
	},
	
	violatesAdjustmentCriterion : function( g ){
		return _.some( this.dpcp(g), g.isAdjustedNode, g )
	},

	/** 
		Returns all nodes lying on proper causal paths including the nodes in X and Y.
		
		X and Y are optional, the exposures and outcomes defined in g are 
		taken by default.
	 */	
	properPossibleCausalPaths : function( g, X, Y ){
		var i, in_X = [], visited = {}, r = [],
			possible = true // this should become a parameter
		if( arguments.length == 1 ){
			X = g.getSources()
			Y = g.getTargets()
		}
		for( i = 0 ; i < X.length ; i ++ ){
			in_X[ X[i].id ] = 1
		}
		var visit = function( v ){
			if( !visited[v.id] ){
				visited[v.id] = true
				r.push(v)
				if( !in_X[v.id] ){
					var parents = v.getParents()
					if( possible ){
						parents = _.union( parents, v.getNeighbours() )
					}
					_.each( parents, visit )	
				}
			}
		}
		_.each( Y, visit )
		return _.intersection(r,g.posteriorsOf(X))
	},
	
	/*
		Possible descendants of nodes on proper causal paths, except X.
	 */
	dpcp : function( g, X, Y ){
		if( arguments.length < 2 ){
			X = g.getSources()
		}
		if( arguments.length < 3 ){
			Y = g.getTargets()
		}
		var gn
		if( g.getType() == "pag" ){
			gn = GraphTransformer.pagToPdag( g )
			gn.setType("pag")
		} else {
			gn = g
		}
		X = gn.getVertex(_.pluck(X,"id"))
		Y = gn.getVertex(_.pluck(Y,"id"))

		return g.getVertex( _.pluck(gn.posteriorsOf( _.difference( this.properPossibleCausalPaths( gn, X, Y ), 
			X ) ), "id" ) )
	},
	
	nodesThatViolateAdjustmentCriterion : function( g ){
		return _.intersection( this.dpcp(g), g.getAdjustedNodes() )
	},
	
	nodesThatViolateAdjustmentCriterionWithoutIntermediates : function( g ){
		var is_on_causal_path = []
		var set_causal =  function(v){ is_on_causal_path[v.id]=true }
		_.each( this.properPossibleCausalPaths(g), set_causal )
		var is_violator = function(v){ return g.isAdjustedNode( v ) && !is_on_causal_path[v.id] }
		return _.filter( this.dpcp(g), is_violator )
	},
	
	intermediates : function( g ){
		return _.chain( g.descendantsOf( g.getSources() ))
		.intersection( g.ancestorsOf( g.getTargets() ) )
		.difference( g.getSources() )
		.difference( g.getTargets() ).value()
	},
	
	/** 
	    Find all simple paths between X (default exposure) and Y (default outcome) in the
        given graph. Returns results as an array of graphs, each on the same node set as
        the original graph.
	 */ 
	listPaths: function( g, directed, limit, X, Y ){
		var r=[], gr, visited
		if( arguments.length < 2 ){
			directed = true
		}
		if( arguments.length < 3 ){
			limit=100
		}
		if( arguments.length < 5 ){
			X = g.getSources(); Y = g.getTargets()
		}
		if( X.length == 0 || Y.length == 0 ){
			return ""
		}
		
		gr = g.clone(false)
		visited = []
		
		var followEdges = function( u, v, kin, edgetype, reverse ){
			var st = []
			_.each( u[kin](), function( v2 ){
				if( !visited[v2.id] ){
					if( reverse ){
						st=[v2.id,u.id]
					} else {
						st=[u.id,v2.id]
					}
					visited[v2.id]=1
					gr.addEdge( st[0], st[1], Graph.Edgetype[edgetype] )
					listPathsRec( v2, v )
					gr.deleteEdge( st[0], st[1], Graph.Edgetype[edgetype] )
					visited[v2.id]=0
				}
			} )
		}

		var listPathsRec = function( u, v ){
			if( r.length >= limit ){
				return
			}
			if( u==v ){
				r.push(gr.clone())
			} else {
				followEdges( u, v, "getChildren", "Directed", false )
				if( !directed ){
					followEdges( u, v, "getParents", "Directed", true )
					followEdges( u, v, "getNeighbours", "Undirected", false )
					followEdges( u, v, "getSpouses", "Bidirected", false )
				}
			}
		}

		_.each( X, function(u){
			_.each( Y, function(v){
				try{
					visited[u.id]=1
					listPathsRec( u, v )
					visited[u.id]=0
				} catch( e ) {
					return r
				}
			})
		})

		return r
	},
	
	
	/*
	onCanVisitEdge: function(e, outgoing, from_parents){
	                  //e: edge
	                  //outgoing: we are moving from e.v1 to e.v2
	                    so (outgoing ? e.v1 : e.v2) is the node being left
	                  //from_parents: if there is an arrow pointing to e.v1 on the previous edge
	                  //  in a DAG (from_parents && !outgoing) means a collider is left

	                  return if (outgoing ? e.v2 : e.v1) should be visited
	                }
	onIsFinalNode: function(v) {
	               //v: current node
	               return if search should abort
	             }
	*/
	visitGraph : function (g, startNodes, onCanVisitEdge, onIsFinalNode) {
		if (!_.isArray(startNodes)) startNodes = [startNodes]
		if (!onCanVisitEdge) onCanVisitEdge = function(){return true}
		if (!onIsFinalNode) onIsFinalNode = function(){return false}

		var q_from_parent = [], q_from_child = startNodes
		var visited_from_parent = {}, visited_from_child = {}
		var v
		var from_parents

		function visitFromParentLike(t){
			if (!visited_from_parent[t.id]) {
				q_from_parent.push(t)
				visited_from_parent[t.id] = true
			}
		}
		function visitFromChildLike(t){
			if (!visited_from_child[t.id]) {
				q_from_child.push(t)
				visited_from_child[t.id] = true
			}
		}
		function visitEdge(e){
			var outgoing = e.v1 == v
			var t = outgoing ? e.v2 : e.v1
			if (!onCanVisitEdge(e, outgoing, from_parents)) return
			var arrowHeadAtT = (e.directed == Graph.Edgetype.Directed && outgoing) || e.directed == Graph.Edgetype.Bidirected
			if (arrowHeadAtT) visitFromParentLike(t)
			else visitFromChildLike(t)
		}

		while (q_from_parent.length > 0 || q_from_child.length > 0) {
			from_parents = q_from_parent.length > 0
			v = from_parents ? q_from_parent.pop() : q_from_child.pop()
			if (!onIsFinalNode(v)) return true
			_.each( v.incomingEdges, visitEdge)
			_.each( v.outgoingEdges, visitEdge)
		}
		return false
	},

	closeSeparator : function( g, y, z, anteriors, blockable_nodes ){
		if (!_.isArray(y)) y = [y]
		if (!_.isArray(z)) z = [z]
		if (!anteriors) anteriors = g.anteriorsOf(y.concat(z))
		
		var a = {}
		_.each(anteriors, function(v){ a[v.id] = true })
		
		var endOfRoad = {}
		_.each(z, function(v){ endOfRoad[v.id] = true })

		var isBlockableNode
		if (blockable_nodes) {
			var blockable_nodes_hash = {}
			_.each(blockable_nodes, function(v){ blockable_nodes_hash[v.id] = true })
			_.each(y, function(v){ blockable_nodes_hash[v.id] = false })
			isBlockableNode = function(v) { return blockable_nodes_hash[v.id] }
		} else {
			var start = {}
			_.each(y, function(v){ start[v.id] = true })
			isBlockableNode = function(v) { return !start[v.id] && !g.isLatentNode(v) }
		}
		
		var result = []
		var blockedNode = false
		
		function onCanVisitEdge(e, outgoing, from_parents) {
			var t = outgoing ? e.v2 : e.v1
			if (!a[t.id]) return false
			var arrowHeadAtV = (e.directed == Graph.Edgetype.Directed && !outgoing) || e.directed == Graph.Edgetype.Bidirected
			//var arrowHeadAtT = (e.directed == Graph.Edgetype.Directed && outgoing) || e.directed == Graph.Edgetype.Bidirected
			return !blockedNode || (from_parents && arrowHeadAtV)
		}
		function visitNode(v){
			if (endOfRoad[v.id]) return false
			blockedNode = isBlockableNode(v)
			if (blockedNode) 
				result.push(v)
			return true
		}
		
		if (GraphAnalyzer.visitGraph(g, y, onCanVisitEdge, visitNode)) return false
		return result
	},
	
	/** d-Separation test via Shachter's "Bayes-Ball" BFS.
	 * (actually, implements m-separation which is however not guaranteed to be meaningful
	 * in all mixed graphs).
	 * If Y is nonempty, returns true iff X and Z are d-separated given Z.
	 * If Y is empty ([]), return the set of vertices that are d-connected 
	 * to X given Z.
	 */
	dConnected : function( g, X, Y, Z, AnZ ){
		var go = g
		if( g.getType() == "pag" ){
			g = GraphTransformer.pagToPdag( g )
			X = g.getVertex(X)
			Y = g.getVertex(Y)
			Z = g.getVertex(Z)
			if( typeof AnZ !== 'undefined' ){ AnZ = g.getVertex( AnZ ) }
		}
		var forward_queue = []
		var backward_queue = []
		var forward_visited ={}
		var backward_visited = {}
		var i, Y_ids = {}, Z_ids = {}, AnZ_ids = {}, v, vv
		if( typeof AnZ == "undefined" ){	
			AnZ = g.ancestorsOf( Z )
		}
		for( i = 0 ; i < X.length ; i ++ ){
			backward_queue.push( X[i] )
		}
		for( i = 0 ; i < Y.length ; i ++ ){
			Y_ids[Y[i].id] = 1
		}
		for( i = 0 ; i < AnZ.length ; i ++ ){
			AnZ_ids[AnZ[i].id] = 1
		}
		for( i = 0 ; i < Z.length ; i ++ ){
			Z_ids[Z[i].id] = 1
		}

		while( forward_queue.length + backward_queue.length > 0 ){
			if( forward_queue.length > 0 ){
				v = forward_queue.pop()
				forward_visited[v.id]=1
				if( Y_ids[v.id] ) return true
				if( AnZ_ids[v.id] ){
					vv = v.getParents()
					for( i = 0 ; i < vv.length ; i ++ ){
						if( !backward_visited[vv[i].id] ){
							backward_queue.push( vv[i] )
						}
					}
					vv = v.getSpouses()
					for( i = 0 ; i < vv.length ; i ++ ){
						if( !forward_visited[vv[i].id] ){
							forward_queue.push( vv[i] )
						}
					}
				} 
				if( !Z_ids[v.id] ){
					vv = _.union( v.getChildren(), v.getNeighbours() )
					for( i = 0 ; i < vv.length ; i ++ ){
						if( !forward_visited[vv[i].id] ){
							forward_queue.push( vv[i] )
						}
					}
				}
			}
			if( backward_queue.length > 0 ){
				v = backward_queue.pop()
				backward_visited[v.id]=1
				if( Y_ids[v.id] ) return true
				if( Z_ids[v.id] ) continue
				vv = _.union( v.getChildren(), v.getSpouses() )
				for( i = 0 ; i < vv.length ; i ++ ){
					if( !forward_visited[vv[i].id] ){
						forward_queue.push( vv[i] )
					}
				}
				vv = _.union( v.getParents(), v.getNeighbours() )
				for( i = 0 ; i < vv.length ; i ++ ){
					if( !backward_visited[vv[i].id] ){
						backward_queue.push( vv[i] )
					}
				}
			}
		}
		if( Y.length > 0 ){
			return false
		} else {
			return go.getVertex(
				_.union( Object.keys( forward_visited ), Object.keys( backward_visited ) ) 
			)
		}
	},
	
	ancestralInstrument : function( g, x, y, z, 
			g_bd, de_y ){
		if( arguments.length < 5 ){
			g_bd = GraphTransformer.backDoorGraph( g, [x], [y] )
		}
		y = g_bd.getVertex(y.id); z = g_bd.getVertex(z.id)
		if( arguments.length < 6 ){
			de_y = g_bd.descendantsOf( [y] )
		}
		var W = GraphAnalyzer.findMinimalSeparator( g_bd, [y], [z], [], [] )
		if( W === false ){ return false }
		if( _.intersection( W, de_y ).length > 0 ){ return false }
		if( _.intersection( W, [x] ).length === 1 ){ return false }
		if( !GraphAnalyzer.dConnected( g_bd, [x], [z], W ) ){
			return false			
		} else {
			return W.map( function(v){return g.getVertex(v.id)} )
		} 
	},
	
	conditionalInstruments : function( g, x, y ){
		if( arguments.length < 2 ){
			x = g.getSources()
			if( x.length > 1 ) return false
			x = x[0]
		}
		if( arguments.length < 3 ){
			y = g.getTargets()
			if( y.length > 1 ) return false
			y = y[0]
		}
		g = GraphTransformer.canonicalDag( g ).g
		x = g.getVertex(x)
		y = g.getVertex(y)
		var vv = _.difference( g.getVertices(), [x,y] )
		var i, r = [], W
		var g_bd = GraphTransformer.backDoorGraph( 
			g, [x], [y] )
		/* make sure that mediators are not conditioned on */
		var mediators = GraphAnalyzer.intermediates( g )
		for( i = 0 ; i < mediators.length ; i ++ ){
			g_bd.addLatentNode( g_bd.getVertex( mediators[i].id ) )
		}
		var de_y = g_bd.descendantsOf( [g_bd.getVertex(y)] )
		for( i = 0 ; i < vv.length ; i ++ ){
			var z = vv[i]
			if( !g.isLatentNode( z ) && !g.isSelectedNode( z ) ){
				W = GraphAnalyzer.ancestralInstrument( g, x, y, z, g_bd, de_y )
				if( W !== false ){
					r.push( [z,W] )
				}
			}
		}
		return r
	},
	
	/** 
	 * This function lists all minimal vertex separators between 
	 * the source and the target in this graph. Remember that a 
	 * vertex separator with respect to source s and target t 
	 * (which can be swapped) is a set of *vertices* whose removal
	 * would result in a graph where s and t are no longer connected.
	 * 
	 * The two optional parameters are two lists of vertices which 
	 * must or must not be included in each separator. Note that 
	 * 
	 * (a) if _must contains any vertices, the resulting separators
	 * 	will be minimal only in the sense that no vertex can be
	 * 	removed unless one of those vertices is also removed; and
	 * 	
	 * (b) if _must_not contains any vertices, the output may be 
	 *     empty even if s-t-separators exist in the graph.
	 * 
	 * No vertices other than those provided will automatically be
	 * inserted into _must and/or _must_not.
	 * 
	 * This is a straightforward extension of Takata's algorithm. 
	 * See Takata K, Disc Appl Math 158:1660-1667, 2010.
	 */                         
	listMinimalSeparators: function( g, _must, _must_not, max_nr ){
		if( g.getSources().length == 0 || g.getTargets().length == 0 ){
			return []
		}
		var Uh = new Hash()
		_.each( g.getTargets(), function( v ){ Uh.set(v.id,v) } )
		_.each( g.neighboursOf( g.getTargets() ), function( v ){ Uh.set(v.id,v) } )
		var U = Uh.values()
		
		var R = []
		var must = []
		if( _must ){
			_.each( _must, function(v){must.push(g.getVertex(v.id))})
		}
		var must_not = []
		if( _must_not ){
			_.each( _must_not, function(v){must_not.push(g.getVertex(v.id))})
		}
		var realN = function( V ){
			g.clearVisited()
			_.each( V.concat(must), function(v){
				Graph.Vertex.markAsVisited(v)
			} )
			var r = []
			var q = V.slice()
			var mark_visited_and_push = function(w){
				if( !Graph.Vertex.isVisited( w ) ){
					Graph.Vertex.markAsVisited(w)
					if( _.contains(must_not,w) ){
						q.push( w )
					} else {
						r.push( w )                      
					}
				}
			} 
			while( q.length > 0 ){
				_.each( q.pop().getNeighbours(), mark_visited_and_push )
			}
			return r
		}
		
		var nearSeparator =  function( A, b ){
			var NA = realN( A )
			var C = GraphAnalyzer.connectedComponentAvoiding( g, b, NA.concat(must) )
			return realN( C )
		}
		
		var listMinSep = function( A, U ){
			if( R.length >= max_nr ) return
			var SA = nearSeparator( A, g.getTargets() )
			var Astar = GraphAnalyzer.connectedComponentAvoiding( g, g.getSources(),
				SA.concat(must) )
			if( _.intersection( Astar, U ).length == 0 ){
				var NA = realN(Astar)
				NA = _.difference( NA, U )
				if( NA.length > 0 ){
					var v = NA[0]
					Astar.push(v)
					listMinSep( Astar, U )
					Astar.pop()
					U.push(v)
					listMinSep( Astar, U )
					U.pop()
				} else {
					R.push( SA.concat(must) )
				}
			}
		}
		listMinSep( g.getSources(), U )
		return R
	},

	/** 
	 *  Computes a topological ordering of this graph, which 
	 *  is only meaningful if this graph is a DAG (in mixed
	 *  graphs, undirected edges are not used in the traversal). 
	 * 
	 *  Every vertex will be assigned a "topological_index"
	 *  which is a number i that is lower than the i of any of
	 *  its children. 
	 * 
	 *  Returns an array mapping vertex IDs to topological indices.
	 */
	topologicalOrdering: function( g ) {
		var ind = { i : g.vertices.size() }
		var topological_index = {}
		var visited = {}
		var visit = function( v ){
			if( !visited[v.id] ){
				visited[v.id] = true
				var children = v.getChildren()
				if( g.isSource(v) || g.isTarget(v) || children.length > 0 ||
					v.getParents().length > 0 ){ 
					for( var i = 0 ; i < children.length ; i ++ ){
						visit( children[i] )
					} 
					topological_index[v.id] = ind.i
					ind.i--
				}
			}
		}
		var vv = g.vertices.values() 
		for( var j = 0 ; j < vv.length ; j ++ ){
			topological_index[vv[j].id] = 0
		}
		for( var j = 0 ; j < vv.length ; j ++ ){
			visit( vv[j] )
		}
		return topological_index
	},

	bottleneckNumbers : function( g, topological_index ) {
		var s0 = g.getSources()[0]
		var t0 = g.getTargets()[0]
		var bottleneck_number = {}, reaches_source = {}, reaches_target = {},
			visited = {}
		_.each( g.ancestorsOf( g.getSources(),
			function(){
				var adj = g.getAdjustedNodes()
				g.clearTraversalInfo()
				_.each( adj, function(v){ Graph.Vertex.markAsVisited(v) })
			} ), function(v){
				reaches_source[v.id] = true
			})
		_.each( g.ancestorsOf( g.getTargets(),
			function(){
				var adj = g.getAdjustedNodes()
				g.clearTraversalInfo()
				_.each( adj, function(v){ Graph.Vertex.markAsVisited(v) })
			} ), function(v){
				reaches_target[v.id] = true
			})
		var vv = g.vertices.values()
		var bn_s = topological_index[s0.id]
		var bn_t = topological_index[t0.id]
		_.each( vv, function(v){
			if( reaches_source[v.id] && 
				!reaches_target[v.id] ){
				bottleneck_number[v.id] = bn_s
			} else if(!reaches_source[v.id] && 
				reaches_target[v.id] ){
				bottleneck_number[v.id] = bn_t
			} else {
				bottleneck_number[v.id] = undefined
			}
		})
		_.each( g.getSources(), function(s){
			topological_index[s.id] = bn_s
			bottleneck_number[s.id] = bn_s
			visited[s.id] = true
		})
		_.each( g.getTargets(), function(t){
			bottleneck_number[t.id] = bn_t
			topological_index[t.id] = bn_t
			visited[t.id] = true
		})
		var visit = function( v ){
			if( !visited[v.id] && 
				(reaches_source[v.id] || reaches_target[v.id]) ){
				visited[v.id]=true
				var children = _.filter( v.getChildren(), function(v){
					return reaches_source[v.id] ||
						reaches_target[v.id]
				})
				_.each( children, visit)
				if( children.length > 1 && _.some( children,
					function(v2){ return bottleneck_number[v2.id] != 
						bottleneck_number[children[0].id] } ) ){
					bottleneck_number[v.id] = topological_index[v.id]
				} else {
					bottleneck_number[v.id] = bottleneck_number[children[0].id]
				}
			}
		}
		_.each( vv, visit )
		return bottleneck_number
	},
	
	/** 
		returns an array of vertex arrays 
		only undirected edges are considered
	*/
	connectedComponents : function( g, kinship_function ){
		if( kinship_function == null ){
			kinship_function = "getNeighbours"
		}
		var visited = {}
		var vv = g.vertices.values()
		var component = function(v){
			var q = [v], r =[v]
			while( q.length > 0 ){
				var v2 = q.pop()
				visited[v2.id] = true
				_.each( v2[kinship_function](), function(vn2){
					if( !visited[vn2.id] ){
						q.push(vn2)
						r.push(vn2)
						visited[vn2.id] = true
					}
				} )
			}
			return r
		}
		var r = []
		_.each( vv, function(v){
			if( !visited[v.id] ){
				r.push( component(v) )
			}
		})
		return r
	},
	
	/***
	 *  Returns the vertices of connected component(s) of all 
	 *  vertices in "V" in the subgraph "G-U" where U is
	 *  a subset of vertices 
	 */
	connectedComponentAvoiding : function( g, V, U ){
		var visited = [], q = [], r = []
		if( U instanceof Array ){
			_.each( U, function(u){ visited[u.id]=1 })
		}
		_.each( V, function(v){ visited[v.id]=1; r.push(v); q.push(v) } )
		var mark_visited_and_push = function(w){
			if( !visited[w.id] ){
				visited[w.id]=1
				q.push(w)
				r.push(w)
			}
		}
		while( q.length > 0 ){
			_.each( q.pop().getNeighbours(), mark_visited_and_push )
		}
		return r
	},
	
	/***
	 * Returns the block tree given a pre-computed list of 
	 * biconnected components of graph g. The pre-computation of 
	 * biconnected components is assumed to have left the Boolean
	 * property "is_articulation_point" on every vertex object
	 * and the integer "component_index" on every edge.
	 * 
	 * If the second argument is not given, then the biconnected
	 * components are re-computed from scratch.
	 */
	blockTree : function( g, bicomps ) {
		if( bicomps == null ){
			bicomps = this.biconnectedComponents( g )
		}
		var bt = new Graph()
		_.each( bicomps, function( edge_list ){
			bt.addVertex( new Graph.Vertex( { id : "C"+edge_list[0].component_index } ) )
		} )
		_.each( g.vertices.values(), function( v ){
			if( v.is_articulation_point ){
				bt.addVertex( new Graph.Vertex( { id : "A"+v.id } ) )
				var vn = bt.getVertex("A"+v.id)
				vn.is_articulation_point = true
				_.each( v.getNeighbours(), function( n ){
					var e = g.getEdge( v, n, Graph.Edgetype.Undirected )
					bt.addEdge( vn, bt.getVertex("C"+e.component_index),
						Graph.Edgetype.Undirected ) 
				} )
			}
		} )
		return bt
	},
	
	/**
	 *  Returns the biconnected components of an undirected graph.
	 */
	biconnectedComponents : function( g ){
		var q = []
		var r = []
		var time = 0
		var vv = g.vertices.values()
		_.each( vv, function(v){
			v.traversal_info.parent = 0
			v.traversal_info.dtime = 0
			v.traversal_info.lowlink = vv.length + 1
		})
		var component_index = 0
		var visit = function(v){
			v.traversal_info.dtime = ++time
			v.traversal_info.lowlink = time
			var children_of_root = 0
			_.each( v.getNeighbours(), function(n){
				var e = g.getEdge( v, n, Graph.Edgetype.Undirected )
				var w = (e.v1 == v ? e.v2 : e.v1)
				if( w.traversal_info.dtime == 0 ){
					q.push(e)
					w.traversal_info.parent = v
					if( v.traversal_info.dtime == 1 ){
						children_of_root ++
					}
					visit( w )
					if( w.traversal_info.lowlink >= v.traversal_info.dtime ){
						if( v.traversal_info.dtime > 1 ){
							v.is_articulation_point = true
						}
						// new component discovered 
						component_index ++
						var component = []
						do {
							var ce = q.pop()
							ce.component_index = component_index
							component.push( ce )
						} while( ce != e )
						r.push( component )
					} else {
						if( w.traversal_info.lowlink < v.traversal_info.lowlink ){
							v.traversal_info.lowlink = w.traversal_info.lowlink
						}                    
					}
				} else {
					if(  (w.traversal_info.dtime < v.traversal_info.dtime)
						&& (w != v.traversal_info.parent) ){ // (v,w) is a back edge
						q.push( e )
						if( w.traversal_info.dtime < v.traversal_info.lowlink ){
							v.traversal_info.lowlink = w.traversal_info.dtime
						}
					}
				}
			})
			// special case for root
			if( children_of_root > 1 ){
				v.is_articulation_point = true
			}
		}
		_.each( vv, function(v){
			if( v.traversal_info.dtime == 0 ){
				visit(v)
			}
		})
		return r
	},

	//see https://en.wikipedia.org/wiki/Lexicographic_breadth-first_search
	lexicographicBreadthFirstSearch : function( g, componentV ){
		if (!componentV) componentV = g.getVertices()
		else componentV = componentV.concat()
		
		/*
			This uses a (doubly) linked list of sets for the ordering
			and a cache for each to get a random element from the set without having to call keys()
		*/
		
		
		var componentSet = new Hash()
		_.each(componentV, function(v){ componentSet.set(v.id, v) })
		
		var firstSet = {
			next: null,
			prev: null,
			prevIteration: 0,
			set: componentSet,
			setKeys: componentV.map(function(v){return v.id}), //cache of this.set.keys(), not updated for removed elements
			setKeyIndex: 0, //processed keys. 
			id: 0
		}
		
		var containedSet = new Hash()
		_.each(componentV, function(v){ containedSet.set(v.id, firstSet) })
			
		var iteration = 0
		var result = []
			
		while (firstSet) {		
			while (firstSet.setKeyIndex < firstSet.setKeys.length && 
				!firstSet.set.contains(firstSet.setKeys[firstSet.setKeyIndex]))
				firstSet.setKeyIndex++
			if (firstSet.setKeyIndex >= firstSet.setKeys.length) {
				firstSet = firstSet.next
				if (firstSet) firstSet.prev = null
				continue
			}
			
			var v = firstSet.set.get(firstSet.setKeys[firstSet.setKeyIndex])
			result.push(v)
			firstSet.setKeyIndex++
			iteration++
			
			firstSet.set.unset(v.id)
			containedSet.unset(v.id)
				
			
			_.each(v.getNeighbours(), function(w){
				var set = containedSet.get(w.id), newSet
				if (!set) return
				
				if (set.prevIteration != iteration) {
					//set has not yet been splitted in this iteration
					
					//create new empty set 
					newSet = {
						next: set,
						prev: set.prev,
						prevIteration: iteration,
						set: new Hash(),
						setKeys: [],
						setKeyIndex: 0
					}
					set.prevIteration = iteration
					//insert newSet in linked list
					if (set.prev) set.prev.next = newSet
					else firstSet = newSet
					set.prev = newSet
				}
				//move w from set to newSet
				newSet = set.prev
				newSet.setKeys.push(w.id)
				newSet.set.set(w.id, w)
				set.set.unset(w.id)
				containedSet.set(w.id, newSet)
			})
		}

		return result
	},

	/**
	 *  Test for chordality
	 */
	isChordal : function( g, componentV ){
		var ordering = GraphAnalyzer.lexicographicBreadthFirstSearch(g, componentV)
		var positions = new Hash()
		_.each(ordering, function(v,i) { positions.set(v.id, i) } )
		return _.every(ordering, function(v,i) { 
			var j = _.max(_.map(v.getNeighbours(), function(w) {
				var p = positions.get(w.id)
				if (p < i) return p
				else return -1
			}))
			if (j < 0) return true
			var w = ordering[j]
			//alert(w + " " + j  +" < " + i)
			var earlierNeigboursOfW = new Hash()
			_.each(w.getNeighbours(), function(x) {
				var p = positions.get(x.id)
				if (p < j) earlierNeigboursOfW.set(x.id, true)
			})
			return _.every(v.getNeighbours(), function(x){
				var p = positions.get(x.id)
				return (p >= j) || earlierNeigboursOfW.get(x.id)
			})
		})
	},

	/** Check whether the graph is syntactically valid for its type */
	validate : function( g ){
		switch( g.getType() ){
		case "dag":
			if( !_.every(g.getEdges(),function(e){ return e.directed ==
				Graph.Edgetype.Directed || e.directed == Graph.Edgetype.Bidirected }) ){
				return false
			}
			if( GraphAnalyzer.containsCycle( g ) ){
				return false
			}
			return true

		case "mag":
			// TODO implement proper MAG validation
			if( !_.every(g.getEdges(),function(e){ return e.directed ==
				Graph.Edgetype.Directed || e.directed == Graph.Edgetype.Bidirected || 
					e.directed == Graph.Edgetype.Undirected }) ){
				return false
			}
			if( GraphAnalyzer.containsSemiCycle( g ) ){
				return false
			}
			return true

		case "pag":
			// TODO implement proper PAG validation
			if( GraphAnalyzer.containsSemiCycle( g ) ){
				return false
			}
			return true

		case "graph":
			return _.every(g.getEdges(),function(e){ return e.directed ==
				Graph.Edgetype.Undirected })
		case "digraph":
			return true
		case "pdag":
			if( !_.every(g.getEdges(),function(e){ return e.directed ==
				Graph.Edgetype.Directed || e.directed == Graph.Edgetype.Undirected
				|| e.directed == Graph.Edgetype.Bidirected  }) ){
				return false
			}
			if( GraphAnalyzer.containsSemiCycle( g ) ){
				return false
			}
			return true
		default:
			throw("Do not know how to validate graph of type "+g.getType())
		}
	},

	containsCycle: function(g){
		var vv = g.vertices.values()
		for( var i = 0 ; i < vv.length ; i ++ ){
			var v = vv[i]
			g.clearVisited()
			var c = this.searchCycleFrom( v )
			if( c !== undefined ){
				var v_count = []
				for( var j = 0 ; j < c.length ; j ++ ){
					v_count[c[j]]?v_count[c[j]]++:v_count[c[j]]=1
				}
				for( j = 0 ; j < c.length ; j ++ ){
					if( v_count[c[j]] > 1 ){
						return c.slice( c.indexOf( c[j] ),  c.lastIndexOf( c[j] )+1 ).join("&rarr;")
					}
				}
			}
		}
		return false
	},
	
	searchCycleFrom: function( v, p ){
		if( p === undefined ){ p = [] }
		if( Graph.Vertex.isVisited( v ) ){ return p.concat(v.id) } 
		Graph.Vertex.markAsVisited( v )
		var children = v.getChildren() 
		// consider only simple directed edges, because
		// bidirected edges can never lie on a cycle
		for( var i = 0 ; i < children.length ; i ++ ){
			var pp = this.searchCycleFrom( children[i], p.concat(v.id) )
			if( pp !== undefined ){
				return pp
			}
		}
		Graph.Vertex.markAsNotVisited( v )
		return undefined
	},
	

	containsSemiCycle: function (g){
		return GraphAnalyzer.containsCycle( GraphTransformer.contractComponents(g, 
			GraphAnalyzer.connectedComponents(g), [Graph.Edgetype.Directed])
			)
	},

	/* Check whether the directed edge e is stronlgy protected */
	isEdgeStronglyProtected: function( g, e ) {
		var a = e.v1
		var b = e.v2

		// test m -> a -> b (turning generates new v structure)
		var adp = a.getParents()
		for (var i=0;i<adp.length;i++){
			if (adp[i].id != b.id && ! g.areAdjacent(adp[i],b)){
				return true
			}
		}

		// test a -> b <- m  or a -> b <- m <- a
		var bdp = b.getParents()
		for ( i=0;i<bdp.length;i++){
			if (bdp[i].id != a.id) {
				if ( !g.areAdjacent(bdp[i],a) || g.getEdge(a,bdp[i],Graph.Edgetype.Directed) ){
					return true
				}
			}
		}



		for ( i=0;i<bdp.length;i++){ 
			for (var j=0;j<bdp.length;j++){
				if( i != j && bdp[i].id != a.id && bdp[j].id != a.id
					&& !g.areAdjacent(bdp[i],bdp[j])
					&& g.getEdge(bdp[i],a,Graph.Edgetype.Undirected)
					&& g.getEdge(bdp[j],a,Graph.Edgetype.Undirected) ){
					return true
				}
			}
		}
		return false
	},

	isEdgeVisible : function( g, e ) {
		var t = g.getType()
		if( t == "dag" || t == "pdag" || t == "digraph" ){
			return true
		}
		if( e.directed != Graph.Edgetype.Directed ){
			return undefined
		}
		if( t != "pag" && t != "mag" ){
			throw("Cannot test edge visibility for graph of type : "+t)
		}

		// check case i o-> x -> y
		if( _.difference( _.union(e.v1.getParents(),e.v1.getSpouses()), 
			e.v2.getAdjacentNodes() ).length > 0 ){
			return true
		}

		// check case i o-> a ; { a <-> b } -> x -> y
		var vpar = GraphTransformer.inducedSubgraph( g, 
			_.union([e.v2],e.v2.getParents()) )
		vpar = g.getVertex(_.pluck(vpar.districtOf( [vpar.getVertex(e.v1.id)] ),"id"))	
	
		if( _.difference( _.union(g.parentsOf(vpar),g.spousesOf(vpar)), 
			e.v2.getAdjacentNodes() ).length > 0 ){
			return true
		}

		return false
	},
 
  graphToAdjacencyMatrix(g, nodeorder, edgetype) {
    return _.map(nodeorder, function(a) { 
      return _.map(nodeorder, function(b) { 
        return !!g.getEdge(a, b, edgetype)
      })
    })
  },
  
  enumerateTreks : function(g, v1, v2) {
    var treks = []
    var visitedDown = {}
    function visitDown(v, trek){
      if (v === v2) {
        treks.push(trek.slice())
        return
      }
      _.each( v.outgoingEdges, function( e ){
        var vc = e.v1 === v ? e.v2 : e.v1
        if (visitedDown[vc.id] || e.directed != Graph.Edgetype.Directed) return
        visitedDown[vc.id] = true
				trek.push( e )
        visitDown( vc, trek )
        trek.pop()
        visitedDown[vc.id] = false
      })
    }
    var visitedUp = {}
    function visitUp(v, trek){
      trek.push(v)
      visitDown(v, trek)
      trek.pop()
      _.each( v.incomingEdges, function( e ){
        var vc = e.v1 === v ? e.v2 : e.v1
				trek.push( e )
        if (e.directed == Graph.Edgetype.Bidirected) visitDown( vc, trek )
        else if (e.directed == Graph.Edgetype.Directed && !visitedUp[vc.id]) {
          visitedUp[vc.id] = true
          visitUp( vc, trek )        
          visitedUp[vc.id] = false
        }
        trek.pop()
      })
      _.each( v.outgoingEdges, function( e ){
        var vc = e.v1 === v ? e.v2 : e.v1
        if (e.directed == Graph.Edgetype.Bidirected) {
	  			trek.push( e )
          visitDown( vc, trek )
          trek.pop();
        }
      })
    }
    visitUp(v1, [])
    return treks
  },
  
  treeID : function (g) {
    // {"results": {"id": [  { "instrument": "id",  "propagate": "id", "missingCycle": ["id", "id", ], "fastp": [[p, q, r, t, s],..] } ] } }
    if (g.getEdges().find( function(e){return e.directed != Graph.Edgetype.Directed && e.directed != Graph.Edgetype.Bidirected } )) 
      return false
    var i
    var j
    
    var n = g.getNumberOfVertices()      
    var topology = GraphAnalyzer.topologicalOrdering(g)
    var toponodes = new Array(n)
    _.each(topology, function(index, id) { toponodes[index - 1] = g.getVertex(id) })

    function nodeidx(v) { return topology[v.id] - 1 }

    var pa = Array(n)
    var nontreenodes = []
    for (i=n-1; i > 0; i -- ) {
      var p = toponodes[i].getParents()
      pa[i] = nodeidx(p[0])
      if (p.length != 1) {
        nontreenodes.push(toponodes[i].id)
      }
    }
    
    var D = this.graphToAdjacencyMatrix(g, toponodes, Graph.Edgetype.Directed)
    var B = this.graphToAdjacencyMatrix(g, toponodes, Graph.Edgetype.Bidirected)
    
    var missingSpouses = _.map(B, function(a, i) { 
      return _.filter(_.map(a, function(v, j) { return  v || i == j ? -1 : j }), function (x) { return x >= 0 } )
    } )
    var sigma = _.map(toponodes, function(xxx, f){
      return _.map(toponodes, function(xxx, t){ 
        return MPoly("s"+Math.min(f,t)+"_"+Math.max(f,t))
      })
    })
    var lambda = _.map(toponodes, function(xxx, f){
      return _.map(toponodes, function(xxx, t){ 
        return  D[f][t] ? MPoly("l"+f+"_"+t) : null
      })
    })
    var omega = _.map(toponodes, function(xxx, f){
      return _.map(toponodes, function(xxx, t){ 
        return (f == t || B[f][t]) ? MPoly("w"+Math.min(f,t)+"_"+Math.max(f,t)) : null
      })
    })
    
    var ZERO = MPoly.zero
    var ONE = MPoly.one
    var MINUS_ONE = MPoly.minusOne
    var MUL = MPoly.mul
    var ADD = MPoly.add
    
    var sigmaexpand = _.map(new Array(n), function(xxx, i){ return new Array(n) } )
    var sigmaevalobj = {}
    for (i = 0; i < n; i++ )
      for (j = i; j < n; j++ ) {
        var treks = GraphAnalyzer.enumerateTreks(g, toponodes[i], toponodes[j])
        //console.log(treks)
        var terms = _.map(treks, function(t){ return _.map(t, function(e) { 
          if (e instanceof Graph.Vertex) 
            return omega[nodeidx(e)][nodeidx(e)]
          else if (e.directed == Graph.Edgetype.Bidirected)
            return omega[nodeidx(e.v1)][nodeidx(e.v2)]
          else 
            return lambda[nodeidx(e.v1)][nodeidx(e.v2)]
        })})
        var trekProducts = _.map(terms, function(t){ return _.reduce(t, function(a, b){
          return a.mul(b)
        }) })        
        var treksum = _.reduce(trekProducts, function(a, b) { return a.add(b) })
        sigmaexpand[i][j] = sigmaexpand[j][i] = treksum
        sigmaevalobj[sigma[i][j]] = treksum
        //console.log(toponodes[i].id + "  " + toponodes[j].id + " -> " +treksum)
      }

    function mulMasked(x, y){
      return x*y
    }
    function addMasked(x, y){

      return x+y
    }//*/
    var maskedEval = {"add": addMasked, "mul": mulMasked}
    function simulateNumeric(variableValue){
      var i
      var j
      var inputs = new Array(MPolyHelper.variableCount + 1)
      for (i=0;i<inputs.length;i++) inputs[i] = BigInt(variableValue(i))
      // i + 1
      var evaled = {}
      for (i = 0; i < n; i++ )
        for (j = i; j < n; j++ ) {
          evaled[sigma[i][j].toString()] = sigmaexpand[i][j].evalNumeric(inputs, maskedEval)
        }
      //console.log(evaled)
      return evaled
    }
    function findPrimes(n){
      var primes = [2,3,5,7,11,13]
      var cp = 17
      for (;primes.length < n;) {
        var isPrime = true
        for (var j=0;j<primes.length;j++)
          if (cp % primes[j] == 0) {
            isPrime = false
            break
          }
        if (isPrime) primes.push(cp)
        cp += 2
      }
      return primes
    }
    var primes = findPrimes(3*(MPolyHelper.variableCount + 1) + 20 )
    var simulated = [
                    simulateNumeric(function(){ return Math.floor((1 << 52)*Math.random()) + 1 }),
                    simulateNumeric(function(i){ return primes[3*i+20] })
                    //simulateNumeric(function(i){ return 1 }) this would be stupid, but it works
                    ]


    
    var FASTP = {
      __proto__: Array,
      make : function (p, q, r, t, s) {
        // ( p + q sqrt(s) ) / ( r + t sqrt(s) )
        var fastp = [p, q, r, t, s]
        fastp.__proto__ = FASTP
        return fastp
      },
      makeFraction : function(p, r) {
        return this.make(p, null, r)
      },
      toString : function(){
        function polyToString(p, sigmaWithIndices){
          if (!p) return "0"
          var p = p.toString()
          if (!sigmaWithIndices) p = p.replace( /(s)([0-9]+)_([0-9]+)/g, function(x,y,i,j) { 
            var a = toponodes[i].id
            var b = toponodes[j].id
            if (a > b) { b = toponodes[i].id; a = toponodes[j].id }
            return "σ"+a+b
          })
          return "(" + p + ")"
        }
        if (this[1] == null && this[3] == null && this[4] == null) {
          return polyToString(this[0]) + " /\n" + polyToString(this[2])
        }
        return "Let s = "+polyToString(this[4])+": \n\n" +
               "(" + polyToString(this[0]) + " + " + polyToString(this[1]) + " * sqrt(s) )  /\n" + 
               "(" + polyToString(this[2]) + " + " + polyToString(this[3]) + " * sqrt(s) ) "
      },
      p : function() { return this[0] } ,
      q : function() { return this[1] } ,
      r : function() { return this[2] } ,
      t : function() { return this[3] } ,
      s : function() { return this[4] } 
    }
    
    function isZeroSigmaPoly(p){
      //console.log("isZeroSigmaPoly")
      for (var i=0;i<simulated.length;i++)
        if (p.evalNumeric(simulated[i], maskedEval) != 0)
          return false
      var q = p.eval(sigmaevalobj)
      return q.isZero()
    }
    
    var ID = Array(n)
    
    function propagate(i){
      var p = pa[i]
      _.each( missingSpouses[i], function(j) {
        if (j == 0) return 
        var q = pa[j]
        if (ID[j] && ID[j].fastp.length <= ID[i].fastp.length) return       
        if (_.find(ID[i].fastp, function(fastp){ 
          var tempeval = {}
          tempeval[lambda[p][i]] = MPoly("0")
          return sigmaexpand[p][i].eval(tempeval).isZero()
        })) return
        var newfastp = _.map(ID[i].fastp, function(fastp){ 
          //insert fastp in (l*σ1 + σ2)/(l * σ3 + σ4 )   
          //return ( r*σ2+(p)*σ1  + s*(t*σ2+q*σ1) )/((r)*σ4+(p)*σ3+s*(t*σ4+q*σ3))
          var si1 = sigma[p][j]
          var si2 = sigma[i][j].negate()
          var si3 = sigma[p][q]
          var si4 = sigma[i][q].negate()
          return FASTP.make(  fastp.r().mul(si2).add(fastp.p().mul(si1)), fastp.s() ? fastp.t().mul(si2).add(fastp.q().mul(si1)) : null,
                              fastp.r().mul(si4).add(fastp.p().mul(si3)), fastp.s() ? fastp.t().mul(si4).add(fastp.q().mul(si3)) : null,
                              fastp.s() )
        }  )
        ID[j] = {propagate: i, 
                 fastp: newfastp, 
                 propagatedMissingCycles: ID[i].missingCycles,
                 oldMissingCycles: ID[j] ? ID[j].missingCycles : null, 
                 oldPropagatedMissingCycles: ID[j] ? ID[j].propagatedMissingCycles : null, 
                 }
        propagate(j)
      } )
    }
    
    var i
    for( i = 1 ; i < n; i++ ) 
      if (!B[0][i]) {
        ID[i] = {"instrument": 0, fastp: [ FASTP.makeFraction(sigma[0][i], sigma[0][pa[i]]) ]} 
        propagate(i)
      }

    function bidiEquation(i, j){
      var p = pa[i]
      var q = pa[j]
      return [ sigma[p][q], 
               sigma[p][j].negate(), //lambda[p][i]
               sigma[i][q].negate(), //lambda[q][j]
               sigma[i][j] ]
    }

    function missingCycleToQuadraticEquation(cycle){
      function DET2(d,e,f,g){
        return d.mul(e).sub(f.mul(g))
      }
      var A = 0
      var B = 1
      var C = 2
      var D = 3
      var k = cycle.length - 1
    //  var vars = cycle.slice(0, k)
      var eqs = _.map(new Array(k), function(x,i) { return bidiEquation(cycle[i], cycle[i+1]) } )
      while (k > 2) {
        var newk = Math.ceil(k/2)
        var newvars = Array(newk)
        var neweqs = Array(newk)
        var j = 0
        for (var i=0;i+1<k;i+=2,j++) {
          neweqs[j] = [ 
            DET2(eqs[i][A], eqs[i+1][C],  eqs[i+1][A], eqs[i][B]),
            DET2(eqs[i][A], eqs[i+1][D],  eqs[i+1][B], eqs[i][B]),
            DET2(eqs[i][C], eqs[i+1][C],  eqs[i+1][A], eqs[i][D]),
            DET2(eqs[i][C], eqs[i+1][D],  eqs[i+1][B], eqs[i][D])
          ]
       //   newvars[j] = vars[i]??
        }
        if (k % 2 == 1) neweqs[newk - 1] = eqs[k - 1]
        k = newk
        //vars = newvars 
        eqs = neweqs
      }
      if (k == 2) {
        eqs[0] = [ DET2(eqs[0][A], eqs[1][C],  eqs[1][A], eqs[0][B]),
                   DET2(eqs[0][A], eqs[1][D],  eqs[1][A], eqs[0][D]),
                   DET2(eqs[0][C], eqs[1][C],  eqs[1][B], eqs[0][B]),
                   DET2(eqs[0][C], eqs[1][D],  eqs[1][B], eqs[0][D])
                 ]
      }
      var a = eqs[0][0]
      var b = eqs[0][1].add(eqs[0][2])
      var c = eqs[0][3]
      return [a,b,c]
    }

    function solveQuadraticEquation(abc){
      //assume a != 0
      var a = abc[0]
      var b = abc[1]
      var c = abc[2]
      var ss = b.sqr().sub( MPoly("4").mul(a).mul(c) )
      var two_a = a.add(a)
      var minus_b = b.negate()
      if (isZeroSigmaPoly(ss)) return [ FASTP.makeFraction(minus_b, two_a) ]
      return [ FASTP.make(minus_b, MINUS_ONE, two_a, ZERO, ss),
               FASTP.make(minus_b, ONE, two_a, ZERO, ss) ]
    }

    function fastpMightSatisfyQuadraticEquation(fastp, abc) {
      //a ( ( p + q sqrt(s) ) / ( r + t sqrt(s) ) )^2 + b ( p + q sqrt(s) ) / ( r + t sqrt(s) ) + c = 0
      //a ( p + q sqrt(s) )^2 + b ( p + q sqrt(s) ) ( r + t sqrt(s) ) + c ( r + t sqrt(s) )^2  = 0
      //a ( p^2 + 2 p q sqrt(s) + q^2 s) + b ( p r + p t sqrt(s) + q r sqrt(s) + q t sqrt(s) sqrt(s) ) + c (r^2 + 2  r t sqrt(s) + t^2 s) = 0
      //a (p^2 + q^2 s) + b ( p r + q s t ) + c r^2 + c t^2 s + ( 2 a p q + b p t + b q r + 2 c r t ) sqrt(s) = 0
      //a (p^2 + q^2 s) + b ( p r + q s t ) + c r^2 + c t^2 s = - ( 2 a p q + b p t + b q r + 2 c r t ) sqrt(s)
      for (var i=0;i<simulated.length;i++) {
        var a = abc[0]
        var b = abc[1]
        var c = abc[2]
        var p = fastp.p()
        var q = fastp.q()
        var r = fastp.r()
        var s = fastp.s()
        var t = fastp.t()
        if (!s) return isZeroSigmaPoly(  ADD(MUL(a,p,p), MUL(b,p,r), MUL(c,r, r) ) )
        
        a = a.evalNumeric(simulated[i], maskedEval)
        b = b.evalNumeric(simulated[i], maskedEval)
        c = c.evalNumeric(simulated[i], maskedEval)
        p = p.evalNumeric(simulated[i], maskedEval)
        q = q.evalNumeric(simulated[i], maskedEval)
        r = r.evalNumeric(simulated[i], maskedEval)
        s = s.evalNumeric(simulated[i], maskedEval)
        t = t.evalNumeric(simulated[i], maskedEval)
        
        var app_aqqs_bpr_bqst_crr_ctts = (a*p*p) + (a*q*q*s) + (b*p*r) + (b*q*s*t) + (c*r*r) + (c*t*t*s)
        var minus_2apq_bpt_bqr_2crt = - ((2n*a*p*q) + (b*p*t) + (b*q*r) +  (2n* c*r*t))
        
        if (app_aqqs_bpr_bqst_crr_ctts < 0 && minus_2apq_bpt_bqr_2crt > 0) return false
        if (app_aqqs_bpr_bqst_crr_ctts > 0 && minus_2apq_bpt_bqr_2crt < 0) return false
        if (app_aqqs_bpr_bqst_crr_ctts != 0 && minus_2apq_bpt_bqr_2crt == 0) return false
        if (app_aqqs_bpr_bqst_crr_ctts == 0 && minus_2apq_bpt_bqr_2crt != 0 && s != 0) return false
        if (app_aqqs_bpr_bqst_crr_ctts**2n != (minus_2apq_bpt_bqr_2crt**2n) * s) return false
      }
        
      return true
/*    Symbolic approach does not work (too slow and loses sign)
      app_aqqs_bpr_bqst_crr_ctts = ADD(MUL(a,p,p), MUL(a,q,q,s), MUL(b,p,r), MUL(b,q,s,t), MUL(c,r, r), MUL(c,t,t,s))
      var TWO = MPoly("2")
      apq2_bpt_bqr_2crt =  ADD(MUL(TWO,a,p,q), MUL(b,p,t), MUL(b,q,r),  MUL(TWO, c,r,t))*/
    }

    function solveMissingCycle(cycle){
      //console.log("solve: "+cycle.join( " "))
      var i = cycle[0]
      //cycle to quadratic equation
      var abc = missingCycleToQuadraticEquation(cycle)
      //solve (quadratic) equation
      var aIsZero = isZeroSigmaPoly(abc[0])
      if (aIsZero && isZeroSigmaPoly(abc[1])) return
      if (aIsZero) {
        ID[i] = {"missingCycles": [cycle.slice()], fastp: [ FASTP.makeFraction( abc[2].negate(), abc[1] ) ] }
      } else if (!(i in ID)){
        ID[i] = {"missingCycles": [cycle.slice()], fastp: solveQuadraticEquation(abc) }
       // alert(fastpMightSatisfyQuadraticEquation(ID[i].fastp[0], abc))
      } else {
        var newfastp = _.filter( ID[i].fastp, function(fastp) { return fastpMightSatisfyQuadraticEquation(fastp, abc) } )
        //compare with other solutions
        if (newfastp.length == 0) throw "Inconsistent solutions"
        if (newfastp.length == ID[i].fastp.length) return
        ID[i].fastp = newfastp
        if (!ID[i].missingCycles) ID[i].missingCycles = [cycle.slice()]
        else ID[i].missingCycles = ID[i].missingCycles.concat([cycle.slice()])
      }
      
      return ID[i].fastp.length == 1
    }

    var visitedInCycle = new Array(n)
    var forceCycleLength
    var longerCyclesMightExists
    function findMissingCycle(cyclePrefix) {
      var s = cyclePrefix[0]
      var e = cyclePrefix[cyclePrefix.length - 1]
      return _.find( missingSpouses[e], function(j) {
        if (visitedInCycle[j]) {
          if (j == s && cyclePrefix.length == forceCycleLength) {
            cyclePrefix.push(j)
            if (solveMissingCycle(cyclePrefix)) 
              return true
            cyclePrefix.pop()
          }
          return false
        }
        if (cyclePrefix.length >= forceCycleLength) {
          longerCyclesMightExists = true
          return false
        }
        visitedInCycle[j] = true
        cyclePrefix.push(j)
        if (findMissingCycle(cyclePrefix)) return true
        cyclePrefix.pop()
        visitedInCycle[j] = false
      })
    }


    for ( forceCycleLength = 3; forceCycleLength < n; forceCycleLength++) {
      var solutionsChanged = false
      longerCyclesMightExists = false
      allEdgesIdentified = true
      for( i = 1 ; i < n; i++ ) {
        var oldPossibleSolutionCount = i in ID ? ID[i].fastp.length : 9999
        if (oldPossibleSolutionCount == 1) continue;
        visitedInCycle[i] = true
        findMissingCycle([i])
        visitedInCycle[i] = false
        var newPossibleSolutionCount = i in ID ? ID[i].fastp.length : 9999
        if (newPossibleSolutionCount < oldPossibleSolutionCount) {
          solutionsChanged = true
          propagate(i)
        }
        allEdgesIdentified = allEdgesIdentified && newPossibleSolutionCount == 1
      }
      if (!longerCyclesMightExists || allEdgesIdentified) break
    }
      
    var IDobject = {}
    for ( i = 0; i < n; i++ )
      if (i in ID) {
        var identification = {fastp: ID[i].fastp}
        if ("instrument" in ID[i]) identification.instrument = toponodes[ID[i].instrument].id
        if ("propagate" in ID[i]) identification.propagate = toponodes[ID[i].propagate].id
        _.map(["missingCycles", "propagatedMissingCycles", "oldPropagatedMissingCycles", "oldMissingCycles"], function(mcid){
          if (mcid in ID[i]) identification[mcid] = _.map( ID[i][mcid], function(c) {
            return _.map(c, function(v){ return toponodes[v].id } ) 
          })
        }) 
        IDobject[toponodes[i].id] = [ identification ]
      }
      
    var res = {"results": IDobject}
    if (nontreenodes.length > 0) res.warning = "Nodes " + nontreenodes.join(", ") + " have not exactly one parent. The algorithm assumes all nodes have one parent."
    return res
  }
}

/*
 * 
 *  Some parts of the code in this file have been written by other authors,
 *  and were originally licensed under the MIT license. They originate from 
 *  the following projects: 
 * 
 *  - Dracula Graph Layout and Drawing Framework 0.0.3alpha
 *  (c) 2010 Philipp Strathausen <strathausen@gmail.com>,
 *      http://dracula.ameisenbar.de/index.html
 * 
 *  - which in turn are based on the Graph JavaScript framework, version 0.0.1
 *  (c) 2006 Aslak Hellesoy <aslak.hellesoy@gmail.com>
 *  (c) 2006 Dave Hoover <dave.hoover@gmail.com>
 *
 *  - Ported from Graph::Layouter::Spring in
 *    http://search.cpan.org/~pasky/Graph-Layderer-0.02/
 *  The algorithm is based on a spring-style layouter of a Java-based social
 *  network tracker PieSpy written by Paul Mutton E<lt>paul@jibble.orgE<gt>.
 *
/*--------------------------------------------------------------------------*/

/* globals _  */
/* exported GraphLayouter */

var GraphLayouter = {}
GraphLayouter.prototype = {
	layoutCalcBounds: function() {
		var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity
		_.each(this.graph.vertices.values(), function( v ){
			var x = v.layout_pos_x
			var y = v.layout_pos_y

			if(x > maxx) maxx = x
			if(x < minx) minx = x
			if(y > maxy) maxy = y
			if(y < miny) miny = y            
		} )
		var xpad = Math.max( (maxx-minx)*.1, .5 )
		maxx += xpad
		minx -= xpad
		var ypad = Math.max( (maxy-miny)*.1, .5 )
		maxy += ypad
		miny -= ypad
		var trimn = function(n){ return Math.round(n*1e3)/1e3 }
		this.graph.setBoundingBox([minx,miny,maxx,maxy].map(trimn))
	}
}

GraphLayouter.Spring = function(graph) {
	this.graph = graph
	this.iterations = 500
	this.maxRepulsiveForceDistance = 6
	this.k = 2
	this.c = 0.01
	this.maxVertexMovement = 0.5
}

GraphLayouter.Spring.prototype = {
	layoutCalcBounds : GraphLayouter.prototype.layoutCalcBounds,

	layout: function() {
		this.layoutPrepare()
		for (var i = 0; i < this.iterations; i++) {
			this.layoutIteration()
		}
		this.layoutCalcBounds()
	},

	layoutPrepare: function() {
		_.each(this.graph.vertices.values(), function( v ){
			v.layout_pos_x = 0
			v.layout_pos_y = 0
			v.layoutForceX = 0
			v.layoutForceY = 0            
		} )
		_.each(this.graph.edges, function( e ){
			delete e.attraction
		} )
	},


	layoutIteration: function() {
		// Forces on nodes due to node-node repulsions
		var nodelist = this.graph.vertices.values()
		for (var i = 0; i < nodelist.length; i++) {
			var node1 = nodelist[i]
			for (var j = i + 1; j < nodelist.length; j++) {
				var node2 = nodelist[j]
				this.layoutRepulsive(node1, node2)
			}
		}
		// Forces on nodes due to edge attractions
		for ( i = 0; i < this.graph.edges.length; i++) {
			var edge = this.graph.edges[i]
			this.layoutAttractive(edge)             
		}
  
		// Move by the given force
		for ( i = 0 ; i < nodelist.length; i ++) {
			var node = nodelist[i]
			var xmove = this.c * node.layoutForceX
			var ymove = this.c * node.layoutForceY

			var max = this.maxVertexMovement
			if(xmove > max) xmove = max
			if(xmove < -max) xmove = -max
			if(ymove > max) ymove = max
			if(ymove < -max) ymove = -max

			node.layout_pos_x += xmove
			node.layout_pos_y += ymove
			node.layoutForceX = 0
			node.layoutForceY = 0
		}
	},

	layoutRepulsive: function(node1, node2) {
		var dx = node2.layout_pos_x - node1.layout_pos_x
		var dy = node2.layout_pos_y - node1.layout_pos_y
		var d2 = dx * dx + dy * dy
		if(d2 < 0.01) {
			dx = 0.1 * Math.random() + 0.1
			dy = 0.1 * Math.random() + 0.1
			d2 = dx * dx + dy * dy
		}
		var d = Math.sqrt(d2)
		if(d < this.maxRepulsiveForceDistance) {
			var repulsiveForce = this.k * this.k / d
			node2.layoutForceX += repulsiveForce * dx / d
			node2.layoutForceY += repulsiveForce * dy / d
			node1.layoutForceX -= repulsiveForce * dx / d
			node1.layoutForceY -= repulsiveForce * dy / d
		}
	},

	layoutAttractive: function(edge) {
		var node1 = edge.v1
		var node2 = edge.v2

		var dx = node2.layout_pos_x - node1.layout_pos_x
		var dy = node2.layout_pos_y - node1.layout_pos_y
		var d2 = dx * dx + dy * dy
		if(d2 < 0.01) {
			dx = 0.1 * Math.random() + 0.1
			dy = 0.1 * Math.random() + 0.1
			d2 = dx * dx + dy * dy
		}
		var d = Math.sqrt(d2)
		if(d > this.maxRepulsiveForceDistance) {
			d = this.maxRepulsiveForceDistance
			d2 = d * d
		}
		var attractiveForce = (d2 - this.k * this.k) / this.k
		if(edge.attraction == undefined || edge.attraction < 1) edge.attraction = 1
		attractiveForce *= Math.log(edge.attraction) * 0.5 + 1

		node2.layoutForceX -= attractiveForce * dx / d
		node2.layoutForceY -= attractiveForce * dy / d
		node1.layoutForceX += attractiveForce * dx / d
		node1.layoutForceY += attractiveForce * dy / d
	}
}
/** 
    This namespace contains functions that parse a graph structure from text.
    Three different formats are supported, but two of them for legacy reasons
    only. The most modern format is a dot-like format, in which a graph looks
    something like this:

    graph {
	X [exposure]
	X [outcome]
	X <- A -> M <- B -> Y
	X -> Y
	X <- M -> Y
	A <-> B
    }
*/

/* jshint undef: true, unused: true, asi: true */
/* globals Graph,GraphAnalyzer,GraphDotParser,_ */
/* exported GraphParser */

var GraphParser = {
	VALIDATE_GRAPH_STRUCTURE : false,
	
	parseDot : function( code ){
		"use strict"
		var ast = GraphDotParser.parse( code )
		var g = new Graph()
		this.parseDotStatementArray( ast.statements, g )
		g.setType( ast.type )
		if( ast.name ){ g.setName( ast.name ) }	
		if( this.VALIDATE_GRAPH_STRUCTURE ){
			if( !GraphAnalyzer.validate( g ) ){
				throw("invalid graph : ",g.toString() )
			}
		}
		return g	
	},

	parseDotStatementArray : function( statements, g ){
		var vsub = new Graph() // holds the vertices of this subgraph

		var v = function(id){ 
			if( id == "graph" || id == "node" ){
				throw("Syntax error: variables cannot be named 'graph' or 'node'. "+
					"Use the 'label' attribute instead.")
			}
			vsub.getVertex( id ) || vsub.addVertex( id )
			return( g.getVertex( id ) || g.addVertex( id ) ) 
		}
		var i,j,n,n2,e,pos,bb
		var positionre = new RegExp( "\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*" )
		var parse_position = function( s ){
			var tok = s.match(positionre)
			if( typeof tok[1] !== "string" || 
				typeof tok[2] !== "string" ){
				throw("Syntax error in \"pos\" option!")
			}
			return {x:parseFloat(tok[1]),y:parseFloat(tok[2])}
		}
		var bbre = new RegExp( "\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*,\\s*(-?[0-9.]+)\\s*" )
		var parse_bb = function( s ){
			var tok = s.match(bbre)
			tok.shift()
			if( _.any( tok, function(t){ return typeof t !== "string" } ) ){
				throw("Syntax error in \"bb\" option!")
			}
			return _.map( tok, parseFloat )
		}
		var recurse = function( sa ){
			var vsubnew = GraphParser.parseDotStatementArray( sa, g )
			_.each( vsubnew, function(v){
				vsub.getVertex(v.id) || vsub.addVertex( v.id )
			})
			return vsubnew
		}
		_.each( statements, function(s) {
			if( s.type == "node" && s.id == "graph" ){
				for( i = 0 ; i < s.attributes.length ; i ++ ){
					switch( s.attributes[i][0] ){
					case "bb":
						bb = parse_bb( s.attributes[i][1] )
						g.setBoundingBox( bb )
					}
				}
			} else if( s.type == "subgraph" ){
				recurse(s.statements)
			} else if( s.type == "node" ){
				n = v(s.id)
				for( i = 0 ; i < s.attributes.length ; i ++ ){
					switch( s.attributes[i][0] ){
					case "latent":
					case "l":
					case "unobserved":
					case "u":
						g.addLatentNode( n )
						break
					case "source":
					case "exposure":
					case "e":
						g.addSource( n )
						break
					case "target":
					case "outcome":
					case "o":
						g.addTarget( n )
						break
					case "adjusted":
					case "a":
						g.addAdjustedNode( n )
						break
					case "selected":
					case "s":
						g.addSelectedNode( n )
						break
					case "pos":
						pos = parse_position( s.attributes[i][1] )
						n.layout_pos_x = parseFloat( pos.x )
						n.layout_pos_y = parseFloat( pos.y )
						break
					case "label":
						n.label = s.attributes[i][1]
						break
					default:
						if( !n.attributes ){
							n.attributes={}
						}
						n.attributes[s.attributes[i][0]]=s.attributes[i][1]
						break
					}
				}
			} else if( s.type == "edge" ){
				for( i = 3; i <= s.content.length ; i += 2 ){
					if( typeof(s.content[i-3]) === "string" ){
						n = [v(s.content[i-3])]
					} else {
						n = recurse(s.content[i-3].statements)
					}
					if( typeof(s.content[i-1]) === "string" ){
						n2 = [v(s.content[i-1])]
					} else {
						n2 = recurse(s.content[i-1].statements)
					}

					_.each( n, function(n){
						_.each( n2, function(n2){
							switch( s.content[i-2] ){

							case "@-@" :
								e = g.addEdge( n, n2, Graph.Edgetype.Unspecified )
								break

							case "--" :
								e = g.addEdge( n, n2, Graph.Edgetype.Undirected )
								break

							case "<->" :
								e = g.addEdge( n, n2, Graph.Edgetype.Bidirected )
								break

							case "->" :
								e = g.addEdge( n, n2, Graph.Edgetype.Directed )
								break
							case "<-" :
								e = g.addEdge( n2, n, Graph.Edgetype.Directed )
								break

							case "@->" : 
								e = g.addEdge( n, n2, Graph.Edgetype.PartDirected )
								break
							case "<-@" : 
								e = g.addEdge( n2, n, Graph.Edgetype.PartDirected )
								break

							case "@--" : 
								e = g.addEdge( n, n2, Graph.Edgetype.PartUndirected )
								break
							case "--@" : 
								e = g.addEdge( n2, n, Graph.Edgetype.PartUndirected )
								break


							}
						})
					})

					for( j = 0 ; j < s.attributes.length ; j ++ ){
						switch( s.attributes[j][0] ){
						case "pos":
							pos = parse_position( s.attributes[j][1] )
							e.layout_pos_x = parseFloat( pos.x )
							e.layout_pos_y = parseFloat( pos.y )
							break
						case "label":
							e.id = s.attributes[j][1]
							break
						default:
							if( !e.attributes ){
								e.attributes = {}
							}
							e.attributes[s.attributes[j][0]]=s.attributes[j][1]
						}
					}
				}
			}
		} )
		return _.map( vsub.getVertices(), function(v){ return g.getVertex( v ) } )
	},
	
	parseVertexLabelsAndWeights : function( vertexLabelsAndWeights ){
		"use strict"
		var g = new Graph()
		var txt = vertexLabelsAndWeights.trim()
		var lines = txt.split(/\n/)
		var i,weight,posn
		for( i = 0 ; i < lines.length ; i ++ ){
			var l = lines[i]
			var a = l.trim().split(/\s+/)
			lines[i]=[]
			if( a.length >= 2 && l.indexOf("@") >= 0 ){
				lines[i][2]=a.pop()
				lines[i][1]=a.pop()
				lines[i][0]=a.join(" ")
			} 
			else if( a.length >= 2 ){
				lines[i][1]=a.pop()
				lines[i][0]=a.join(" ")
			}
			else if( a.length == 1 ){
				lines[i][1]="1"
				lines[i][0]=a.pop()
			}
		}
		for( i = 0 ; i<lines.length ; i ++ ){
			var vid = decodeURIComponent(lines[i][0])
			var props = lines[i][1]
			// TODO weights do not currently mean anything!
			weight = parseInt(props,10)||1
			g.addVertex( new Graph.Vertex( 
				{ id : vid, weight : weight } ) )
			if( props.indexOf("E")>=0 ){
				g.addSource( vid )
			}
			if( props.indexOf("O")>=0 ){
				g.addTarget( vid )
			}
			if( props.indexOf("A")>=0 ){
				g.addAdjustedNode( vid )
			}
			if( props.indexOf("U")>=0 ){
				g.addLatentNode( vid )
			}
			if( lines[i].length == 3 ){
				posn = lines[i][2].substring(1).split(",")
				g.getVertex( vid ).layout_pos_x = parseFloat(posn[0])
				g.getVertex( vid ).layout_pos_y = parseFloat(posn[1])
			}
		}
		g.setType("dag")
		return g
	},
  
	parseAdjacencyList : function( adjacencyList, vertexLabelsAndWeights ){
		"use strict"
		var g = this.parseVertexLabelsAndWeights( vertexLabelsAndWeights )
		var adj_list = adjacencyList.split("\n")
		var i,adj,v1, v1id, v2,v2id
		for( i = 0 ; i < adj_list.length ; i ++ ){
			adj = adj_list[i].trim().split(/\s+/)
			v1 = false; v1id = ""
			while( adj.length > 0 && !v1 ){
				v1id += adj.shift()
				v1 = g.getVertex( decodeURIComponent(v1id) )
				v1id += " "
			}
			while( adj.length > 0 ){
				v2 = false; v2id = ""
				while( adj.length > 0 && !v2 ){
					v2id += adj.shift()
					v2 = g.getVertex( decodeURIComponent(v2id) )
					v2id += " "
				}
				if( v2 ){
					var eold = g.getEdge( v2, v1, Graph.Edgetype.Directed )
					if( eold ){
						g.deleteEdge( v2, v1, Graph.Edgetype.Directed )
						var enew = g.addEdge( v1, v2, Graph.Edgetype.Bidirected )
						if( eold.layout_pos_x && !enew.layout_pos_x ){
							enew.layout_pos_x = eold.layout_pos_x
							enew.layout_pos_y = eold.layout_pos_y
						}
					} else {
						g.addEdge( v1, v2 )
					}
					if( adj.length > 0 && adj[0].charAt(0) == "@" ){
						var e = g.getEdge( v1, v2 )
						var coord_a = adj.shift().substring(1).split(",")
						if( coord_a.length >= 2 ){
							e.layout_pos_x = parseFloat( coord_a[0] )
							e.layout_pos_y = parseFloat( coord_a[1] )
						}
					}
				}
			}
		}
		if( this.VALIDATE_GRAPH_STRUCTURE ){
			if( !GraphAnalyzer.validate( g ) ){
				throw("invalid graph : ",g.toString() )
			}
		}
		return g
	},

	parseAdjacencyMatrix : function( adjacencyMatrix, vertexLabelsAndWeights ){
		"use strict"
		var g = this.parseVertexLabelsAndWeights( vertexLabelsAndWeights )

		var m = adjacencyMatrix.trim()
		var m_arr = m.split(/\s+/)
		var n = Math.sqrt( m.split(/\s+/).length )
		var l, l_arr, i, j

		if( parseInt( n, 10 ) !== n || n !== g.getNumberOfVertices()){
			throw( "Error loading data: Adjacency matrix is not square or does not match number of vertices: "+n+" , " +g.getNumberOfVertices() )
		}

		l = vertexLabelsAndWeights.trim()
		l_arr = l.split("\n")
		for( i = 0 ; i < l_arr.length ; i++ ){
			l_arr[i] = l_arr[i].trim().split(/\s+/)
		}

		for( i = 0 ; i <n ; i ++ ){
			for( j = 0 ; j <n ; j ++ ){
				if( parseInt( m_arr[i*n+j], 10 ) > 0 ){
					g.addEdge( l_arr[i][0], l_arr[j][0] )
				}
			}
		}
		if( this.VALIDATE_GRAPH_STRUCTURE ){
			if( !GraphAnalyzer.validate( g ) ){
				throw("invalid graph : ",g.toString() )
			}
		}
		g.setType( "dag" )
		return g
	},

	parseGuess : function( adjacencyListOrMatrix, vertexLabelsAndWeights ){
		"use strict"
		var first_blank, firstarg = adjacencyListOrMatrix.trim()
		if( !vertexLabelsAndWeights ){
			first_blank = adjacencyListOrMatrix.search( /\r?\n[ \t]*\r?\n/ )
			vertexLabelsAndWeights = adjacencyListOrMatrix.substr( 0, first_blank ).trim()
			adjacencyListOrMatrix = adjacencyListOrMatrix.substr( first_blank ).trim()
		}
		if( adjacencyListOrMatrix.match( /^[\s01]+$/ ) !== null ){
			return this.parseAdjacencyMatrix( adjacencyListOrMatrix, vertexLabelsAndWeights )
		} else {
			// [\s\S] is like . but also matches newline
			var isdot = firstarg.match(  /^(digraph|graph|dag|pdag|mag|pag)(\s+\w+)?\s*\{([\s\S]*)\}$/mi )
			if( isdot && isdot.length > 1 ){
				return this.parseDot( firstarg )
			} else {
				var hasarrow = firstarg.match( /(->|<->|<-)/mi )
				// allow users to omit explicit "dag{ ... }" if at least one arrow is also specified
				if( hasarrow  && hasarrow.length >= 1  ){
					return this.parseDot( "dag{"+firstarg+"}" )
				} else {
					return this.parseAdjacencyList( adjacencyListOrMatrix, vertexLabelsAndWeights )
				}
			}
		}
	}
}
/* globals _,Graph,GraphAnalyzer,Hash */
/* exported GraphTransformer */

/** Namespace containing various methods that analyze a given 
 * graph. These methods to not change the input graph; instead they
 * return a new graph.
 * @namespace GraphTransformer
 */

var GraphTransformer = {
	
	/** Transforms an arbitrary graph into its 'line graph'. The line graph
	  * of a graph G contains a node for each edge x->y in G, and an edge 
	  * (x->y,y->z) for each path x -> y -> z in G. 
	  *  
	  * @summary Line digraph (edge-vertex dual graph).
	  * @param g Input graph. Can have any type, but only simple directed edges
	  * (Graph.Edgetype.Directed) are taken into account. 
	  */
	lineDigraph : function( g ){
		var gn= new Graph()
		_.each( g.getEdges(), function(e){
			if( e.directed == Graph.Edgetype.Directed ){
				gn.addVertex( new Graph.Vertex( {id:(e.id || (e.v1.id+e.v2.id))} ) )
			}
		})
		_.each( g.getVertices(), function(v){
			var vp = v.getParents()
			var vc = v.getChildren()
			_.each( vp, function(p){
				var ep = g.getEdge( p, v, Graph.Edgetype.Directed )
				var vpn = gn.getVertex(  ep.id || (ep.v1.id+ep.v2.id) )
				_.each( vc, function(c){
					var ec = g.getEdge( v, c, Graph.Edgetype.Directed )
					var vcn = gn.getVertex(  ec.id || (ec.v1.id+ec.v2.id) )
					gn.addEdge( vpn, vcn, Graph.Edgetype.Directed )
				})
			})
		})
		return gn
	},

	/** 
	 *  Forms the subgraph of this graph consisting of the vertices in "vertex_array" 
	 *  and the edges between them, directed or undirected.
	 *  
	 *  If "vertex_array" contains source and/or target, source and/or target of the
	 *  returned graph are set accordingly. 
	 */
	inducedSubgraph : function( g, vertex_array ){
		var gn = new Graph(), i
		
		for( i = 0 ; i < vertex_array.length ; i++ ){
			gn.addVertex( new Graph.Vertex( vertex_array[i] ) )
		}
		
		var other_vertex_ids = _.pluck(vertex_array,"id")
		
		for( i = 0 ; i < g.edges.length ; i++ ){
			var e = g.edges[i]
			if( _.contains( other_vertex_ids, e.v1.id ) && 
				_.contains( other_vertex_ids, e.v2.id ) ){
				gn.addEdge( e.v1.id, e.v2.id, e.directed )
			}
		}
		
		g.copyAllPropertiesTo( gn )
		return gn
	},

	mergeGraphs : function(){
		var i, j, gn = new Graph(), vv, ee
		for( i = 0 ; i < arguments.length ; i ++ ){
			vv = arguments[i].getVertices()
			for( j = 0 ; j < vv.length ; j++ ){
				if( !gn.getVertex( vv[j].id ) ){
					gn.addVertex( new Graph.Vertex( vv[j] ) )
				}
			}
			ee = arguments[i].edges
			for( j = 0 ; j < ee.length ; j++ ){
				gn.addEdge( ee[j].v1.id, ee[j].v2.id, ee[j].directed )
			}
			arguments[i].copyAllPropertiesTo( gn )
		}
		return gn
	},

	structuralPart : function( g ){
		return GraphTransformer.inducedSubgraph( g, g.getLatentNodes() ) 
	},

	measurementPart : function( g ){
		var gn = new Graph(), i, vv = g.getVertices()
		for( i = 0 ; i < vv.length ; i++ ){
			gn.addVertex( new Graph.Vertex( vv[i] ) )
		}
		for( i = 0 ; i < g.edges.length ; i++ ){
			var e = g.edges[i]
			if( e.directed == Graph.Edgetype.Directed &&
				!g.isLatentNode(e.v2) ){
				gn.addEdge( e.v1.id, e.v2.id, e.directed )
			}
			if( e.directed == Graph.Edgetype.Bidirected &&
				!g.isLatentNode(e.v1) && !g.isLatentNode(e.v2) ){
				gn.addEdge( e.v1.id, e.v2.id, e.directed )
			}
		}
		g.copyAllPropertiesTo( gn )
		// remove isolated latent nodes from measurement model
		vv = _.pluck(gn.getLatentNodes(),"id")
		for( i = 0 ; i < vv.length ; i++ ){
			if( gn.getVertex(vv[i]).degree( Graph.Edgetype.Directed ) == 0 ) {
				gn.deleteVertex(gn.getVertex(vv[i]))
			}
		}
		return gn		
	},
	
	skeleton : function( g ){
		var gn = new Graph(), edge_array = g.edges, i, vv = g.vertices.values()
		for( i = 0 ; i < vv.length ; i++ ){
			gn.addVertex( vv[i].cloneWithoutEdges() )
		}
		for( i = 0 ; i < edge_array.length ; i++ ){
			var edge_other = edge_array[i]
			gn.addEdge( edge_other.v1.id, edge_other.v2.id,
				Graph.Edgetype.Undirected )
		}
		g.copyAllPropertiesTo( gn )
		gn.setType( "graph" )
		return gn
	},

	/**
	 * The sugraph of this graph induced by the edges in edge_array.
	 */
	edgeInducedSubgraph : function( g, edge_array ){
		var gn = new Graph()
		for( var i = 0 ; i < edge_array.length ; i++ ){
			var edge_other = edge_array[i]
			var edge_my = g.getEdge( edge_other.v1.id, edge_other.v2.id,
				edge_other.directed )
			if( edge_my ){
				if( !gn.getVertex( edge_my.v1.id ) )
					gn.addVertex( edge_my.v1.id )
				if( !gn.getVertex( edge_my.v2.id ) )
					gn.addVertex( edge_my.v2.id )
				gn.addEdge( edge_my.v1.id, edge_my.v2.id, edge_my.directed )
			}
		}
		g.copyAllPropertiesTo( gn ) 
		return gn
	},
	
	/**
	 * Constructs and returns the subgraph of g consisting of 
	 * (a) the source s and its ancestors;
	 * (b) the target t and its ancestors;
	 * (c) all adjusted/selection nodes Z and their ancestors.
	 * Otherwise, if V is provided, the ancestors of those nodes are 
	 * returned.
	 */
	ancestorGraph : function( g, V ){ 
		if( arguments.length < 2 ){
			V = g.getSources().
			concat(g.getTargets()).
			concat(g.getAdjustedNodes()).
			concat(g.getSelectedNodes())
		}
		var g_an = this.inducedSubgraph( g, g.anteriorsOf( V ) )
		return g_an
	},
	
	/***
	 * This is a slightly different version of Judea Pearl's BackDoor
	 * construction. Only such edges are deleted that are the first edge of a 
	 * proper causal path.
	 *
	 *		Parameters X and Y are source and target vertex sets, respectively,
	 *		and are optional.
	 *		
	 *
	 **/
	backDoorGraph : function( g, X, Y ){
		var gback, dpcp, gtarget = g.clone()
		if( g.getType() == "pag" ){
			gback = GraphTransformer.pagToPdag( g )
			gback.setType("pag")
		} else {
			gback = gtarget 
		}
		if( typeof X == "undefined" ){
			X = g.getSources()
		}
		if( typeof Y == "undefined" ){
			Y = g.getTargets()
		}
		if( X.length == 0 || Y.length == 0 ){
			return gback
		}
		X = gback.getVertex(_.pluck(X,"id"))
		Y = gback.getVertex(_.pluck(Y,"id"))
		dpcp = GraphAnalyzer.properPossibleCausalPaths( gback, X, Y )
		_.each( X, function(s){
			_.each( _.intersection( dpcp, s.getChildren() ), function( c ){
				if( GraphAnalyzer.isEdgeVisible( gback, gback.getEdge(s.id,c.id)) ){
					gtarget.deleteEdge( s, c, Graph.Edgetype.Directed )
				}
			})
		})
		return gtarget
	},
	
	/** This is the counterpart of the back-door graph for direct effects.
	 * We remove only edges pointing from X to Y.
	 */
	indirectGraph : function( g, X, Y ){
		var gback = g.clone()
		var ee = []
		if( arguments.length == 3 ){
			_.each( X, function(v){ gback.addSource(v.id) } )
			_.each( Y, function(v){ gback.addTarget(v.id) } )
		}
		_.each(gback.getSources(),function( s ){
			_.each( gback.getTargets(),function( t ){
				var e = gback.getEdge( s, t )
				if( e ) ee.push( e )
			})
		})
		_.each(ee,function(e){gback.deleteEdge(e.v1,e.v2,e.directed)})
		return gback
	},
	
	/** TODO
	 *		this is such a minor change from the usual descendants/ancestors
	 *		that there should be a nice generalization of both to avoid duplicating
	 *		the code here. */
	causalFlowGraph : function( g, X, Y ){
		if( arguments.length == 1 ){
			X = g.getSources()
			Y = g.getTargets()
		}
		var clearVisitedWhereNotAdjusted = function(){
			_.each( g.vertices.values(), function(v){
				if( g.isAdjustedNode( v ) ) 
					Graph.Vertex.markAsVisited( v )
				else 
					Graph.Vertex.markAsNotVisited( v )
			})
		}
		return this.inducedSubgraph( g, 
				_.intersection(g.ancestorsOf( Y, clearVisitedWhereNotAdjusted ),
						g.descendantsOf( X, clearVisitedWhereNotAdjusted ) ) )
	},
	
	/**
	 *		This function returns the subgraph of this graph that is induced
	 *		by all open simple non-causal routes from s to t. 
	 */
	activeBiasGraph : function( g, X, Y ){
		var g_chain, g_canon, L, S, in_type = g.getType(),
			reaches_source = {}, reaches_adjusted_node = {}, retain = {}
		var preserve_previous_visited_information = function(){}
		
		if( arguments.length > 1 ){
			g = g.clone()
			_.each(X,function(v){g.addSource(v.id)})
			_.each(Y,function(v){g.addTarget(v.id)})
		}
		
		if( g.getSources().length == 0 || g.getTargets().length == 0 ){
			return new Graph()
		}
		
		g_canon = GraphTransformer.canonicalDag(g)
		g = g_canon.g
		g_chain = GraphTransformer.ancestorGraph(g)
		
		_.each( g.ancestorsOf( g.getSources(),
			function(){
				var adj = g.getAdjustedNodes()
				g.clearTraversalInfo()
				_.each( adj, function(v){ Graph.Vertex.markAsVisited(v) } )
			} ), function(v){
			reaches_source[v.id] = true
		})
			
		_.each( g.ancestorsOf( g.getAdjustedNodes() ), function(v){
			reaches_adjusted_node[v.id] = true
		})
		
		// ..for this line, such that "pure causal paths" are traced backwards 
		var target_ancestors_except_ancestors_of_violators = 
		g.ancestorsOf( g.getTargets(), 
			function(){
				var an_violators = g.ancestorsOf(
					GraphAnalyzer.nodesThatViolateAdjustmentCriterion(g))
				g.clearTraversalInfo()
				_.each( an_violators, function(v){ Graph.Vertex.markAsVisited(v) } )
			}
		)
		var intermediates_after_source = _.intersection( g.childrenOf( g.getSources() ),
			target_ancestors_except_ancestors_of_violators)
		g.clearTraversalInfo()
		
		// Delete directed edges emitting from source that are only on causal routes
		_.each( g.getSources(), function(s){
			_.each( s.outgoingEdges, function(e){
				if( g.isSource(e.v2 ) || _.contains(intermediates_after_source, e.v2 ) ){
					g_chain.deleteEdge( e.v1, e.v2, Graph.Edgetype.Directed )
				}
			})
		})

		// Delete edges emitting from adjusted nodes
		_.each( g_chain.getAdjustedNodes(), function( v ){
			_.each( v.getChildren(), function( v2 ){ 
				g_chain.deleteEdge( v, v2, Graph.Edgetype.Directed )
			} )
		} )
		
		// clone because we shoulnd't modify an array while traversing it
		_.each( g_chain.edges.slice(), function(e){
			if( reaches_adjusted_node[e.v1.id] && reaches_adjusted_node[e.v2.id] ){
				g_chain.deleteEdge( e.v1, e.v2, e.directed )
				g_chain.addEdge( e.v1, e.v2, Graph.Edgetype.Undirected )
			}
		} )
		
		var topological_index = GraphAnalyzer.topologicalOrdering( g_chain )
		
		var bottleneck_number = GraphAnalyzer.bottleneckNumbers( g,
			topological_index )

		var comps = GraphAnalyzer.connectedComponents( g_chain )
		
		var check_bridge_node = function(v){ 
			return reaches_adjusted_node[v.id] && 
					topological_index[v.id] !== undefined &&
					bottleneck_number[v.id] !== undefined }

		var vv = g_chain.getVertices()
		
		for( var comp_i = 0 ; comp_i < comps.length ; comp_i ++ ){
			var comp = comps[comp_i]
			if( comp.length > 1 ){
				var bridge_nodes = _.filter( comp, check_bridge_node )

				var current_component = GraphTransformer.inducedSubgraph( 
					g_chain, comp )
				var bridge_node_edges = []
				var bridge_nodes_bottlenecks = []
				_.each( bridge_nodes, function(bn){
					bridge_nodes_bottlenecks.push(bottleneck_number[bn.id])
				})
				_.each( _.uniq(bridge_nodes_bottlenecks), function( i ){
					current_component.addVertex( "__START"+i )
					current_component.addVertex( "__END"+i )
					bridge_node_edges.push( 
						current_component.addEdge( "__START"+i, "__END"+i, 
							Graph.Edgetype.Undirected ) )
				})
				
				_.each( bridge_nodes, function( bridge ) {
					current_component.addEdge( 
						"__END"+bottleneck_number[bridge.id],
						bridge.id, Graph.Edgetype.Undirected )
				})
								
				var bicomps = GraphAnalyzer.biconnectedComponents( current_component )
								
				var current_block_tree = GraphAnalyzer.blockTree( current_component, bicomps )

				_.each( bridge_node_edges, function( e ){
					Graph.Vertex.markAsVisited(
						current_block_tree.getVertex( "C"+e.component_index ) )
				} )
				current_block_tree.visitAllPathsBetweenVisitedNodesInTree()
				
				var visited_components = _.filter( current_block_tree.vertices.values(),
					function(v){
						return v.id.charAt(0) == "C" && v.traversal_info.visited 
					})
								
				/** TODO is in O(|E|) - can this be accelerated? */
				_.each( visited_components, function( vc ){
					var component_index = parseInt(vc.id.substring(1))
					var component = bicomps[component_index-1]
					if( component.length > 1 || 
						component[0].v1.id.indexOf("__") !== 0 || 
						component[0].v2.id.indexOf("__") !== 0
					){
						_.each( bicomps[component_index-1], function( e ){
							var cv1 = g_chain.getVertex( e.v1.id )
							if( cv1 ){
								retain[cv1.id] = true
							}
							var cv2 = g_chain.getVertex( e.v2.id )
							if( cv2 ){
								retain[cv2.id] = true
							}
						} )
					}
				} )
			}
		}
		// after the above loop, all vertices that have two disjoint paths to 
		// a source and a target have been labeled for retention


		// now, retain all vertices that are "between" the labeled vertices and
		// sources/targets. to this end, descend from the labeled vertices but
		// avoid descending further than a source/target
		_.each( vv, function(v){
			if( g_chain.isSource(v) ){
				Graph.Vertex.markAsVisited(v)
				retain[v.id] = true
			} else if( g_chain.isTarget(v) ){
				if( reaches_source[v.id] ){
					Graph.Vertex.markAsNotVisited(v)
				} else {
					Graph.Vertex.markAsVisited(v)
				}
				retain[v.id] = true
			}
			else{
				Graph.Vertex.markAsNotVisited(v)
			}
		} )
		
		
		var start_nodes = _.filter( vv, function(v){ 
			return retain[v.id]
				|| ( topological_index[v.id] !== undefined &&
				topological_index[v.id] === bottleneck_number[v.id] ) } )
		
				
		var nodes_to_be_retained = g_chain.descendantsOf( start_nodes, 
			preserve_previous_visited_information )
		_.each( nodes_to_be_retained, function( v ){ retain[v.id] = true } )

		
		// All vertices on "back-door" biasing paths (starting with a x <- ) 
		// and all "front-door" biasing paths
		// have been labeled for retention now. 
		
		// To finish, add the vertices on biasing non-backdoor routes whose
		// simple versions are causal paths.
		var w_nodes = _.reject( GraphAnalyzer.dpcp(g), // See Shpitser et al, UAI 2010
			function(w){return !retain[w.id]} )
		var paths_to_violators = g.ancestorsOf(GraphAnalyzer.
			nodesThatViolateAdjustmentCriterionWithoutIntermediates(g))
		g.clearTraversalInfo(); _.each(w_nodes,Graph.Vertex.markAsVisited)
		_.each(w_nodes,function(w){
			Graph.Vertex.markAsNotVisited(w)
			_.chain(paths_to_violators).
				intersection(g.descendantsOf([w],preserve_previous_visited_information)).
				each(function(v){retain[v.id]=true})
			Graph.Vertex.markAsVisited(w)
		},g)
		
		// Delete edges between targets as long as they are not on a biasing route
		_.each(g.getTargets(),function(v){
			_.each(v.outgoingEdges,function(e){
				if( g.isTarget(e.v2) && ! _.contains(paths_to_violators,e.v2) ){
					g_chain.deleteEdge(e.v1,e.v2,e.directed)
				}
			})
		})
		
		// Delete all vertices that have not been marked for retention
		_.each(vv, function(v){
			if( typeof retain[v.id] === "undefined" ){
				g_chain.deleteVertex(v)
			}
		} )
		
		// Restore original edge types
		var edges_to_replace = []
		_.each( g_chain.edges, function(e){
			if( e.directed == Graph.Edgetype.Undirected ){
				edges_to_replace.push( e )
			}
		})
		_.each( edges_to_replace, function( e ){
			g_chain.deleteEdge( e.v1, e.v2, Graph.Edgetype.Undirected )
			if( g_canon.g.getEdge( e.v1.id, e.v2.id, Graph.Edgetype.Directed ) ){
				g_chain.addEdge( e.v1.id, e.v2.id, Graph.Edgetype.Directed )
			} else {
				g_chain.addEdge( e.v2.id, e.v1.id, Graph.Edgetype.Directed )
			}
		} )
		
		// Replace dummy nodes from canonical graph with original nodess
		var Lids = _.pluck(g_canon.L,"id"), Sids = _.pluck(g_canon.S,"id")
		L=[], S=[]
		_.each(Lids, function(vid){
			var v = g_chain.getVertex(vid)
			if( v ) L.push( v )
		})
		_.each(Sids, function(vid){
			var v = g_chain.getVertex(vid)
			if( v ) S.push( v )
		})
		g = GraphTransformer.decanonicalize( g_chain, L, S )
		g.setType( in_type )
		return g
	}, // end of activeBiasGraph
	
	trekGraph : function( g, up_prefix, down_prefix ) {
		var n = new Graph()
		var vv = g.getVertices()
		var ee = g.getEdges()
		var vup, vdown, ch, i
		if( ! up_prefix ) up_prefix = "up_"
		if( ! down_prefix ) down_prefix = "dw_"
		for( i = 0 ; i < vv.length ; i ++ ){
			vup = up_prefix+vv[i].id; vdown = down_prefix+vv[i].id
			n.addVertex( new Graph.Vertex( {id:vup} ) )
			n.addVertex( new Graph.Vertex( {id:vdown} ) )
			if( g.isSource( vv[i] ) ) n.addSource( n.getVertex(vup) )
			if( g.isTarget( vv[i] ) ) n.addSource( n.getVertex(vdown) )
			n.addEdge( vup, vdown )
		}
		for( i = 0 ; i < ee.length ; i ++ ){
			if( ee[i].directed == 2 ){ // bidirected edge
				vup = up_prefix+ee[i].v1.id; vdown = down_prefix+ee[i].v2.id
				n.addEdge( vup, vdown )
				vup = up_prefix+ee[i].v2.id; vdown = down_prefix+ee[i].v1.id
				n.addEdge( vup, vdown )
			}
		} 
		for( i = 0 ; i < vv.length ; i ++ ){
			vup = up_prefix+vv[i].id; vdown = down_prefix+vv[i].id
			ch = vv[i].getChildren( false ) // true -> consider also bidirected edges
			for( var j = 0 ; j < ch.length ; j ++ ){
				n.addEdge( vdown, down_prefix+ch[j].id )
				n.addEdge( up_prefix+ch[j].id, vup )
			}
		}
		return n
	},
	
	/**
		For a graph with bi- and undirected edges, forms the "canonical version"
		by replacing each <->  with <- L -> and each -- with -> S <-. Returns 
		an object {g,L,S] containing the graph and the newly created nodes L and
		S. 
		
		The output graph is always a DAG.
		
		*/
	canonicalDag : function( g ){
		var rg = new Graph(), i = 1, L = [], S = [], v
		_.each( g.getVertices(), function( v ){
			rg.addVertex( v.cloneWithoutEdges() )
		} )
		g.copyAllPropertiesTo( rg )
		_.each( g.getEdges(), function( e ){
			switch( e.directed ){
			case Graph.Edgetype.Undirected:
				while( rg.getVertex( "S"+i ) ){ i ++ }
				v = new Graph.Vertex({id:"S"+i})
				rg.addVertex( v ); rg.addSelectedNode( v )
				rg.addEdge(e.v2,v)
				rg.addEdge(e.v1,v)
				S.push(v)
				break

			case Graph.Edgetype.Directed:
				rg.addEdge(e.v1,e.v2)
				break

			case Graph.Edgetype.Bidirected:
				while( rg.getVertex( "L"+i ) ){ i ++ }
				v = new Graph.Vertex({id:"L"+i})
				rg.addVertex( v ); rg.addLatentNode( v )
				rg.addEdge(v,e.v2)
				rg.addEdge(v,e.v1)
				L.push(v)
				break
			}
		} )
		rg.setType( "dag" )
		return {g:rg,L:L,S:S}
	},

	decanonicalize : function( g, L, S ){
		var rg = g.clone(), vv, i, j
		_.each( L, function(v){
			vv = v.getChildren()
			for( i = 0 ; i < vv.length ; i ++ ){
				for( j = i+1 ; j < vv.length ; j ++ ){
					rg.addEdge(vv[i],vv[j],Graph.Edgetype.Bidirected)
				}
			}
			rg.deleteVertex(v)
		})
		_.each( S, function(v){
			vv = v.getParents()
			for( i = 0 ; i < vv.length ; i ++ ){
				for( j = i+1 ; j < vv.length ; j ++ ){
					rg.addEdge(vv[i],vv[j],Graph.Edgetype.Undirected)
				}
			}
			rg.deleteVertex(v)
		})
		if( S.length == 0 ){
			rg.setType("dag")
		} else {
			rg.setType("mag")
		}
		return rg
	},
	
	//algorithms as in "Causal Reasoning with Ancestral Graphs" by Jiji Zhang
	dagToMag: function( g, latent ){
		if (!latent) latent = g.getLatentNodes()
		var latentSet = {}
		_.each(latent, function(v){ latentSet[v.id] = true })
		var V = _.difference(g.getVertices(), latent)

		var ancestors = {}
		_.each(V, function(v){ 
			var newHash = {}
			_.each(g.ancestorsOf( [v] ), function(w){
				newHash[w.id] = true
			})
			ancestors[v.id] = newHash
		} )

		var rgv = {}
		var rg = new Graph()
		_.each(V, function(v){ 
			rgv[v.id] = rg.addVertex( v.cloneWithoutEdges() ) 
		} )
		g.copyAllPropertiesTo( rg )
		rg.setType("mag")

		_.each(V, function(v){
			var Av = ancestors[v.id]
			_.each(V, function(u){
				if (u.id >= v.id) return
				var Au = ancestors[u.id]

				var reachable = GraphAnalyzer.visitGraph(g, [v], function(e, outgoing, from_parents){
					var w = outgoing ? e.v1 : e.v2
					if (from_parents && !outgoing) {
						//collider
						if (!Av[w.id] && !Au[w.id]) return false
					} else if (w.id != v.id && w.id != u.id && !latentSet[w.id]) return false
					return true
				}, function(w){
					return w != u
				})

				if (!reachable) return

				var rv = rgv[v.id]
				var ru = rgv[u.id]
				if (Au[v.id]) rg.quickAddDirectedEdge( rv, ru )
				else if (Av[u.id]) rg.quickAddDirectedEdge( ru, rv )
				else rg.quickAddEdge( ru, rv, Graph.Edgetype.Bidirected )
			})
		})
		return rg
	},
	
	/**	
	 *	Returns a "moralized" version of this graph, i.e.: 
	 *	
	 *	(1) for each pair of edges (u,v), (w,v) a new
	 *		undirected edge {u,w} is inserted
	 *		
	 *	(2) all directed edges are converted to undirected edges
	 *
	 *  (3) all undirected edges are copied		
	 */
	moralGraph : function( g ){
		if( g.getType() == "pag" ){
			g = GraphTransformer.pagToPdag( g )
		}

		var mg = new Graph()
		
		_.each( g.getVertices(), function( v ){
			mg.addVertex( v.cloneWithoutEdges() )
		} )

		var comp = GraphAnalyzer.connectedComponents( g, "getSpouses" )
		_.each( comp, function(c){
			var comp_p = g.parentsOf( c ).concat(c)
			for( var i = 0 ; i < comp_p.length ; i ++ ){
				for( var j = i+1 ; j < comp_p.length ; j ++ ){
					mg.addEdge( comp_p[i].id,
						comp_p[j].id, Graph.Edgetype.Undirected )
				}
			}
		})
		
		_.each( g.edges, function( e ){
			if( e.directed == Graph.Edgetype.Undirected ){
				mg.addEdge( e.v1.id, e.v2.id, e.directed )
			}
		} )
		g.copyAllPropertiesTo( mg )
		mg.setType("graph")
		return mg
	},
	
	/**
	 * Constructs a flow network corresponding to the given directed graph.
	 * A flow network is a tuple of a graph and a capacity function.
	 * 
	 * Capacities for certain edge may be given as an argument. If not provided,
	 * all edges will be initialized to have capacity 1.
	 * 
	 * Two new 'supernodes' will be created for source(s) and target(s) to allow
	 * for multi source / sink flow problems. The default names for these new
	 * vertices are  "__SRC" and  "__SNK" ; underscores will be prepended as necessary
	 * if this conflics with existing vertex names. 
	 */
	flowNetwork : function(g, capacities) {
		var i, v, vin, vout
		if( capacities === undefined ) capacities = new Hash()
		var n = g.clone()
		for( i = 0 ; i < g.edges.length ; i++ ){
			var e = g.edges[i]
			var eback = g.getEdge( e.v2.id, e.v1.id )
			if( !eback ){
				eback = n.addEdge( e.v2.id, e.v1.id, Graph.Edgetype.Directed )
			}
			
			if( capacities.get(e) === undefined ){
				capacities.set(e,1)
			}
			if( capacities.get(eback) === undefined ){
				capacities.set(eback,0)
			}
		}
		var ssource = "__SRC"
		while( g.getVertex( ssource ) ){
			ssource = "_" + ssource
		}
		var ssink = "__SNK"
		while( g.getVertex( ssink ) ){
			ssink = "_" + ssink
		}
		n.addVertex( new Graph.Vertex( {id:ssource} ) )
		n.removeAllSources(); n.addSource( ssource )
		n.addVertex( new Graph.Vertex( {id:ssink} ) )
		n.removeAllTargets(); n.addTarget( ssink )
			
		vout = n.getVertex(ssource)
		vin = n.getVertex(ssink)
			
		var srcs = g.getSources()
		for( i = 0 ; i < srcs.length ; i ++ ){
			v = n.getVertex(srcs[i].id)
			capacities.set( n.addEdge( vout, v ), Number.MAX_VALUE )
			capacities.set( n.addEdge( v, vout ), 0 )
		}
			
		var tgts = g.getTargets()
		for( i = 0 ; i < tgts.length ; i ++ ){
			v = n.getVertex(tgts[i].id)
			capacities.set( n.addEdge( v, vin ), Number.MAX_VALUE )
			capacities.set( n.addEdge( vin, v ), 0 )
		}
		return { graph: n, capacities: capacities }
	},
	
	/***
	 * Applies a well-known tranformation to turn a vertex capacity flow problem into 
	 * an edge capacity flow problem: Each vertex v in the given graph is substituted by
	 * a vertex pair v_in -> v_out where the edge capacity is the given vertex capacity.
	 * All edges going into v are connected to v_in and all edges going out of v are connected
	 * to v_out.
	 **/
	vertexCapacityGraph : function( g ) {
		var gn = new Graph()
		_.each(g.vertices.values(),function( v ){
			if( g.getSource() !== v ){
				gn.addVertex( new Graph.Vertex( { id : "I" + v.id } ) )
			}
			if( g.getTarget() !== v ){
				gn.addVertex( new Graph.Vertex( { id : "O" + v.id } ) )
			}
			if( g.getSource() !== v && g.getTarget() !== v ){
				gn.addEdge( new Graph.Edge.Directed( { 
					v1:gn.getVertex("I"+v.id), v2:gn.getVertex("O"+v.id), capacity: 1, is_backedge : false } ) )
				gn.addEdge( new Graph.Edge.Directed( { 
					v2:gn.getVertex("I"+v.id), v1:gn.getVertex("O"+v.id), capacity: 0, is_backedge : true } ) )
			}
		} )
		_.each(g.edges,function( e ){
			if( e.v1 !== g.getTarget() && e.v2 !== g.getSource() ){
				gn.addEdge( new Graph.Edge.Directed( { v1 : gn.getVertex("O"+e.v1.id),
					v2 : gn.getVertex("I"+e.v2.id) , capacity: 1, is_backedge : false } ) )
				gn.addEdge( new Graph.Edge.Directed( { 
					v2 : gn.getVertex("O"+e.v1.id),
					v1 : gn.getVertex("I"+e.v2.id), 
					capacity: 0, is_backedge : true 
				} ) )
			}
		} )
		return gn.
		setSource(gn.getVertex("O"+g.getSource().id)).
		setTarget(gn.getVertex("I"+g.getTarget().id))
	},
	
	/***
	 * The transitive reduction removes all edges from a graph
	 * that follow transitively from other edges. (The result of this 
	 * transformation is uniquely defined.)
	 * 
	 * This is used to compute the "atomic directed edges", which
	 * are the directed edges that are essential for the ancestral structure
	 * of a graph. 
	 * */
	transitiveReduction : function( g ) {
		var gn = g.clone(), en
		_.each( g.edges, function( e ){
			en = gn.getEdge( e.v1, e.v2 )
			if( en ){
				// delete edge (u,v) if there is at least one mediator between u and v 
				if( _.intersection( g.descendantsOf( [e.v1] ), 
						g.ancestorsOf( [e.v2] ) ).length > 2 ){
					gn.deleteEdge( e.v1, e.v2, Graph.Edgetype.Directed )
				}
			}
		} )
		return gn
	},
	
	transitiveClosure : function( g ){
		var gn = g.clone()
		_.each(gn.vertices.values(), function(v){
			_.each(gn.descendantsOf( [v] ), function(w){
				if( v != w ) gn.addEdge( v, w )
			} )
		} )
		return gn
	},

	dagToCpdag : function( g ){
		var r = g.clone()

		var changed = true
		var es = r.getEdges()
		while( changed ){
			changed = false
			for( var i=0; i<es.length; i++ ){
				if( es[i].directed == Graph.Edgetype.Directed &&
					!GraphAnalyzer.isEdgeStronglyProtected(r, es[i])) {
					r.changeEdge(es[i], Graph.Edgetype.Undirected)
					changed = true
				}
			}
		}
		r.setType("pdag")
		return r
	},
		
	/** TODO make this work with undirected edges, add unit test */
	dependencyGraph : function( g ){
		var gc = GraphTransformer.canonicalDag( g ).g
		var gd = GraphTransformer.dag2DependencyGraph( gc )
		var vn = []
		_.each(g.vertices.values(),function(v){ vn.push(gd.getVertex(v.id)) } )
		return GraphTransformer.inducedSubgraph( gd, vn )
	},


	dag2DependencyGraph : function( g ){
		var gn = GraphTransformer.transitiveClosure( g )
		var gm = GraphTransformer.skeleton( gn )
		_.each(gn.vertices.values(),function(v){
			var ch = gn.childrenOf( [v] ), i=0, j=1
			for( ; i < ch.length ; i ++ ){
				for( j = i+1 ; j < ch.length ; j ++ ){
					gm.addEdge( ch[i].id, ch[j].id, Graph.Edgetype.Undirected )
				}
			}
		} )
		gm.setType("graph")
		return gm
	},
	
	/** TODO add unit test */
	dependencyGraph2CPDAG : function( g ){
		var gn = new Graph()
		gn.setType( "pdag" )
		var vv = g.vertices.values()
		_.each(vv,function(v){ gn.addVertex( v.cloneWithoutEdges() ) } )
		_.each(g.edges,function(e){
			var n1 = g.neighboursOf( [e.v1] )
			var n2 = g.neighboursOf( [e.v2] )
			n1.push(e.v1)
			n2.push(e.v2)
			var both = n1.intersect( n2 )
			if( n1.length == n2.length && both.length == n1.length ){
				gn.addEdge( e.v1.id, e.v2.id, Graph.Edgetype.Undirected )
			} else if( both.length == n1.length ){
				gn.addEdge( e.v1.id, e.v2.id )
			} else if( both.length == n2.length ){
				gn.addEdge( e.v2.id, e.v1.id )
			}
		})
		return gn
	},
	
	/**
	 * This function implements a tranformation by Eppstein that maps pairs of 
	 * paths to common ancestors in a DAG bijectively to paths in another DAG.
	 * 
	 * See D. Eppstein, "Finding Common Ancestors and Disjoint Paths in DAGs",
	 *  Tech Report 95-52, UC Irvine, 1995
	 */
	pathPairGraph : function( g ){
		// store topological_index at all vertices 
		var topological_index = g.topologicalOrdering()
		
		// create a new vertex (x,y) for each vertex pair where index(x) <= index(y) 
		// (in particular, for every (x,x)   
		var gp = new Graph()
		var i, ei
		gp.addVertex( new Graph.Vertex( { id : "s" } ) )
		gp.setSource( gp.getVertex( "s" ) )
		
		var topo_sort = g.vertices.values().pluck("id")
		topo_sort.sort( function(a,b){ return topological_index[a] < topological_index[b] ? -1 : 1 } )
		
		for( i = 0 ; i < topo_sort.length ; i ++ ){
			var id_p = topo_sort[i]+":"
			for( var j = 0 ; j < topo_sort.length ; j ++ ){
				gp.addVertex( new Graph.Vertex( { id : id_p+topo_sort[j] } ) )
			}
			gp.addEdge( new Graph.Edge.Directed( {
				v1 : gp.getVertex( "s" ), 
				v2 : gp.getVertex( id_p+topo_sort[i] ) 
			} ) )
		}
		
		for( ei = 0 ; ei < g.edges.length ; ei ++ ){
			var e = g.edges[ei]
			for( i = 0 ; i < e.v2.topological_index-1; i ++ ){
				gp.quickAddDirectedEdge( 
				gp.getVertex( topo_sort[i]+":"+e.v1.id ),
					gp.getVertex( topo_sort[i] +":"+e.v2.id ) )
				gp.quickAddDirectedEdge( 
				gp.getVertex( e.v1.id+":"+topo_sort[i] ),
					gp.getVertex( e.v2.id+":"+topo_sort[i] ) )
			}
		}
		
		if( g.getSource().topological_index < g.getTarget().topological_index ){
			gp.setTarget( g.getSource().id + ":" + g.getTarget().id )
		} else {
			gp.setTarget( g.getTarget().id + ":" + g.getSource().id )
		}
		
		return gp
	},
	
	/*
	  Replace every occurence of the induced subgraph A -> B -- C with A -> B -> C
	*/
	cgToRcg: function(g) {
		var gn = new Graph()
		gn.setType( g.getType() )

		_.each(g.vertices.values(), function(v){gn.addVertex( v.cloneWithoutEdges() )})
		var fail = false
		//checks if v is connected to a node with id w.id in the graph containing v
		function areConnected(v,w) { 
			return _.some(v.getAdjacentNodes(), function(x){ return x.id == w.id })
		}
		function processDirectedEdge(a,b){
			if (fail) return
			_.each(b.getNeighbours(), function(c){
				if (a.id != c.id && !areConnected(a, c)) {
					_.each(gn.getVertex(c.id).getParents(),  //parents in gn is a superset of the parents in g
									function(d){ 
										if (a.id != d.id && b.id != d.id && !areConnected(b,d)) 
											fail = true 
									})
					if (fail) return
					if (!gn.getEdge(b.id, c.id, Graph.Edgetype.Directed)) {
						gn.addEdge(b.id, c.id, Graph.Edgetype.Directed)
						processDirectedEdge(b,c)
					}
				}
			})
		}
		_.each(g.getEdges(), function(e){
			if (e.directed == Graph.Edgetype.Directed) 
				gn.addEdge(e.v1.id, e.v2.id, Graph.Edgetype.Directed)
		})
		_.each(g.getEdges(), function(e){
			if (e.directed == Graph.Edgetype.Directed) 
				processDirectedEdge(e.v1,e.v2)
		})
		if (fail) return null
		_.each(g.getEdges(), function(e){
			if (e.directed != Graph.Edgetype.Directed && !areConnected(gn.getVertex(e.v1.id), e.v2)) 
				gn.addEdge(e.v1.id, e.v2.id, e.directed)
		})
		g.copyAllPropertiesTo( gn )
		return gn
	},
	
	/*
		Contracts every array C of vertices in components to a single vertex V_c that is connected to a vertex W
		if one of the vertices in C was connected to W
	*/
	contractComponents: function(g, components, includeSelfEdges) {
		var selfEdges = [false, false, false]
		if (typeof includeSelfEdges === "boolean" ) selfEdges = selfEdges.map(function() { return includeSelfEdges })
		else if (_.isArray( includeSelfEdges ) ) _.each(includeSelfEdges, function(t) { selfEdges[t] = true })
		var targetVertices = new Hash()

		var gn = new Graph()
		gn.setType( g.getType() )

		_.each(components, function(component) { 
			var ids = component.map(function(v){
				if (typeof v === "string" ) return v
				else return v.id 
			})
			var mergedVertex = gn.addVertex(ids.sort().join(","))
			_.each(ids,function(vid){
				targetVertices.set(vid, mergedVertex)
			})
		})
		_.each( g.getVertices(), function( v ){
			if (targetVertices.contains(v.id)) return
			var w = gn.addVertex( v.cloneWithoutEdges() )
			targetVertices.set(v.id, w)
		} )
		_.each(g.getEdges(), function(e){
			var c1 = targetVertices.get(e.v1.id)
			var c2 = targetVertices.get(e.v2.id)
			if (c1 == c2 && !selfEdges[e.directed]) return
			gn.addEdge( c1, c2, e.directed )
		})
		_.each( g.managed_vertex_property_names, ( function( p ){
			_.each( g.getVerticesWithProperty( p ), function( v ){
				gn.addVertexProperty( targetVertices.get(v.id), p ) 
			} )
		} ) )
		return gn
	},

	contractLatentNodes: function(g){
		var gn = g.clone()
		_.each( gn.getLatentNodes(), function (v) {
			gn.contractVertex(v)
		} )
		return gn
	},
	
	markovEquivalentDags : function(g,n){
		var c = this.dagToCpdag(g)
		g = c.clone()
		var result = []

		function enumerate() {
			if(GraphAnalyzer.containsCycle(g)){ return }
			if(result.length >=n ){ return } 
			var es = g.getEdges()
			for (var i=0;i<es.length;i++){
				if (es[i].directed == Graph.Edgetype.Undirected) {
					g.changeEdge(es[i],Graph.Edgetype.Directed)
					enumerate()

					g.reverseEdge(es[i])
					enumerate()

					g.reverseEdge(es[i])
					g.changeEdge(es[i], Graph.Edgetype.Undirected)         
					return
				}
			}
			var d = GraphTransformer.dagToCpdag(g)
			if (GraphAnalyzer.equals(c,d)){
				var gr = g.clone()
				gr.setType("dag")
				result.push(gr)
			}
		}

		enumerate()
		return result
	},

	pagToPdag : function(g) {
		if( g.getType() != "pag" ){
			return undefined
		}
		g = g.clone()
		var es = g.getEdges()
		for( var i = 0 ; i < es.length ; i ++ ){
			if( es[i].directed == Graph.Edgetype.Unspecified ){
				g.changeEdge(es[i], Graph.Edgetype.Undirected)
			}
			if( es[i].directed == Graph.Edgetype.PartDirected ){
				g.changeEdge(es[i], Graph.Edgetype.Directed)
			}
			if( es[i].directed == Graph.Edgetype.PartUndirected ){
				g.changeEdge(es[i], Graph.Edgetype.Undirected)
			}

		}
		g.setType("pdag")
		return g
	}
}
/* This is a namespace containing various methods that generate graphs,
 * e.g. at random.*/
 
/* globals Graph	*/
/* exported GraphGenerator */

var GraphGenerator = {
	/**
	 * Generates a random DAG on the given variables. The topological
	 * ordering will reflect the given order of the variables.
	 * p is the probability that an edge will be created. If p=1, then
	 * the number of edges created will be maximal. It is advisable to
	 * scale p with 1/|V|. 
	 * p can also be an object with entries { p.Edge, ... } where ... are
	 * parameters for the setRandomNodes function (see below)
	 */
	randomDAG : function( variables, p){
		var i, j
		if (typeof variables == "number" ) {
			var n = variables
			variables = []
			for (i = 1; i <= n; i++) variables.push("v" + i)
		}
		var g = new Graph()
		var vertices = [] 
		for( i = 0 ; i < variables.length ; i ++ ){
			var v = g.addVertex( variables[i] )
			vertices.push(v)
		}
		
		var pEdge = p
		if (typeof p == "object") {
			pEdge = p.pEdge
			this.setRandomNodes(g, p)
		}
		for( i = 0 ; i < variables.length ; i ++ ){
			for( j = i+1 ; j < variables.length ; j ++ ){
				if( Math.random() < pEdge ){
					g.quickAddDirectedEdge( vertices[i], vertices[j] )
				}
			}
		}
		g.setType("dag")
		return g
	},
	
	
	/**
	 * Marks nodes as source, target or latentnode.
	 * Parameter pSource is the probability of a node becoming a source node, 
	 * minSource and maxSource the minimum and maximum count of these nodes.
	 * pTarget, minTarget, maxTarget, pLatentNode, minLatentNode, maxLatentNode control the creation of other node types.
	*/
	setRandomNodes: function (g, p) {
		var i, j, k
		var vertices = g.vertices.values()
		var prop = ["Source", "Target", "LatentNode"]
		for (i=0;i<prop.length;i++) g["removeAll"+prop[i]+"s"]()
		for (i=0,j=1,k=2;i<prop.length;i++,j++,k++) {
			if (j >= prop.length) j = 0
			if (k >= prop.length) k = 0
			var minOthers = (p["min"+prop[j]] ? p["min"+prop[j]] : 0) + (p["min"+prop[k]] ? p["min"+prop[k]] : 0)
			if (!(("max" + prop[i])  in p) || (p["max"+prop[i]] > vertices.length - minOthers ))
				p["max"+prop[i]] = vertices.length - minOthers
		}
		var pSource = p.pSource ? p.pSource : 0, 
			pTarget = p.pTarget ? p.pTarget : 0, 
			pLatentNode = p.pLatentNode ? p.pLatentNode : 0
		var maxSource = "maxSource" in p ? p.maxSource : vertices.length,
			maxTarget = "maxTarget" in p ? p.maxTarget : vertices.length,
			maxLatentNode = "maxLatentNode" in p ? p.maxLatentNode : vertices.length
		
		var counts = {"Source": 0, "Target": 0, "LatentNode": 0}
		var availableVertices = []
		for (i=0;i<vertices.length;i++) {
			var v = vertices[i]
			var q = Math.random()
			var kind = null
			if (q < pSource) { if (counts.Source < maxSource) kind = "Source" }
			else if (q < pSource + pTarget) { if (counts.Target < maxTarget) kind = "Target" }
			else if (q < pSource + pTarget + pLatentNode) { if (counts.LatentNode < maxLatentNode) kind = "LatentNode" }
			if (kind)	{
				g["add" + kind](v) 
				counts[kind]++ 
			} else availableVertices.push(v)
		}
		for (i=0;i<prop.length;i++) {
			if (!p["min"+prop[i]]) continue
			for (var existing = counts[prop[i]]; existing < p["min"+prop[i]]; existing++) {
				if (availableVertices.length == 0) throw "no available vertices"
				j = Math.floor(Math.random() * availableVertices.length)
				g["add"+prop[i]](availableVertices[j])
				availableVertices.splice(j, 1)
			}
		} 
	}
}
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
	
/* globals Class,_  */
/* exported ObservedGraph */

var ObservedGraph = Class.extend({
	init : function( graph ){
		this.graph = graph
		this.event_listeners = {}
		_.each(Object.keys( this.event_mapping ),function(k){
			this.event_listeners[this.event_mapping[k]]=[]
		},this)
		for( var k in graph ){
			if( _.isFunction(graph[k]) ){
				var f = graph[k]
				if( this.event_mapping[k] ){
					this[k] = (function(f,k){
						return function(){
							var r = f.apply( graph, arguments )
							_.each(this.event_listeners[this.event_mapping[k]],
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

	observe : function( event, listener ){
		this.event_listeners[event].push(listener)
	}
} )

/* globals _,Graph,GraphAnalyzer,GraphTransformer,Hash */
/* exported GraphSerializer */

var GraphSerializer = {

	SHORTEN_SYNTAX : true,

	toDot : function( g ){
		var n = g.getName(), bb = g.getBoundingBox()
		return (g.getType()+" "+(n == null?"":n)+"{\n" + 
			(bb == null ? "" : "bb=\""+bb.join(",")+"\"\n") +
			this.toDotVertexStatements(g)+
			this.toDotEdgeStatements(g)+"\n}\n")
	},
	
	toDotVertexStatements : function( g ){
		var expandLabel = function( v, g ){
			var properties = [], property_string = ""
			g.isSource(v) && properties.push("exposure")
			g.isTarget(v) && properties.push("outcome")
			g.isAdjustedNode(v) && properties.push("adjusted")
			g.isLatentNode(v) && properties.push("latent")
			g.isSelectedNode(v) && properties.push("selected")
			if( typeof v.layout_pos_x!== "undefined"  ){
				properties.push( "pos=\"" + 
					v.layout_pos_x.toFixed(3) + "," + 
					v.layout_pos_y.toFixed(3) + "\"" )
			}
			if( v.label ){
				properties.push( "label=\""+v.label.replace(/"/g, "\\\"")+"\"" )
			}
			if( v.attributes ){
				var vk = Object.keys( v.attributes )
				for( var i = 0 ; i < vk.length ; i ++ ){
					if( v.attributes[vk[i]] ){
						properties.push(vk[i]+"=\""+(""+v.attributes[vk[i]]).replace(/"/g, "\\\"")+"\"")
					} else {
						properties.push(vk[i])
					}
				}
			}
			if( properties.length > 0 ){
				return GraphSerializer.dotQuoteVid( v.id ) +
					" ["+properties.join(",")+"]"
			} else {
				if( !this.SHORTEN_SYNTAX || v.getAdjacentNodes().length == 0 ){
					return GraphSerializer.dotQuoteVid( v.id )
				} else {
					return ""
				}
			}
		}
		var r = ""
		var ra = []
		_.each( 
		g.vertices.values(), function( v ){
			var vl = expandLabel( v, g )
			if( vl ){
				ra.push(vl+"\n")
			}
		} )
		ra.sort()
		return r + ra.join("")
	},
	
	dotBarewordRe : new RegExp( "^[0-9a-zA-Z_.]+$" ),
	
	quoteVid : function ( vid ){
		return "\"" + vid.replace(/"/g, "\\\"") + "\""
	},
	
	dotQuoteVid : function( vid ){
		if( !vid.match( this.dotBarewordRe ) ) return this.quoteVid( vid )
		return vid
	},
	
	toDotEdgeStatements : function( g ){
		var edgestat = [], es, eop, 
			barewordre = 
		_.each(g.edges,function(e){
			es = e.toString( barewordre )
			eop = []
			if( e.layout_pos_x ){
				eop.push("pos=\"" + 
					e.layout_pos_x.toFixed(3) + "," + 
					e.layout_pos_y.toFixed(3) + "\"")
			}
			if( e.id ){
				eop.push("label=\"" + encodeURIComponent( e.id ) + "\"")
			}
			if( e.attributes ){
				var vk = Object.keys( e.attributes )
				for( var i = 0 ; i < vk.length ; i ++ ){
					if( e.attributes[vk[i]] ){
						eop.push(vk[i]+"=\""+(""+e.attributes[vk[i]]).replace(/"/g, "\\\"")+"\"")
					} else {
						eop.push(vk[i])
					}
				}
			}
			if( eop.length > 0 ){
				es += " ["+eop.join(",")+"]"
			}
			edgestat.push( es )
		})
		edgestat.sort()
		return edgestat.join("\n")
	},

	/** Assumes that g contains only a single path that starts at a source 
	    and converts it to DOT syntax.
	 **/
	pathToDot : function( g ){
		var vids = g.vertices.keys(), v, i, j,
			visited, vn, r = "", arrows
		if( vids.length == 0 ){
			return ""
		}
		if( g.getSources().length != 1 ){
			return ""
		}
		visited = {}
		v = g.getSources()[0]
		visited[v.id] = 1
		r = this.dotQuoteVid(v.id)
		arrows = ["->","<-","--","<->"]
		while( v ){
			vn = {
				"->" : v.getChildren(),
				"<-" : v.getParents(),
				"--" : v.getNeighbours(),
				"<->" : v.getSpouses()
			}
			out:
			for( j = 0 ; j < 4 ; j ++ ){
				for( i = 0 ; i < vn[arrows[j]].length ; i ++ ){
					if( !visited[vn[arrows[j]][i].id] ){
						break out
					}
				}
			}
			if( j==4 ){
				v = null
			} else { 
				v = vn[arrows[j]][i]
				r += " "+arrows[j]+" "+this.dotQuoteVid(v.id)
				visited[v.id]=1
			}
		}
		return r
	},

	toLavaan : function( g ){
		var ee = g.getEdges(), edgetype, 
			r = "# Please set lavaan's fixed.x appopriately!\n"
		var v_nonzero_degree = {}
		_.each( ee, function(e){
			edgetype = ""
			var reverse = true
			if( e.directed == Graph.Edgetype.Directed ){
				if( g.isLatentNode( e.v1 ) ){
					if( g.isLatentNode( e.v2 ) ){
						edgetype = "~"
					} else {
						edgetype = "=~"
						reverse = false
					}
				} else {
					edgetype = "~"
				}
			} else if( e.directed == Graph.Edgetype.Bidirected ){
				edgetype = " ~~ "
			} else {
				throw( "Unsupported edge for lavaan conversion : " + e.toString() )
			}
			if( reverse ){
				r += e.v2.id + edgetype + e.v1.id+ "\n"
			} else {
				r += e.v1.id + edgetype + e.v2.id+ "\n"
			}
			v_nonzero_degree[e.v1.id] = 1
			v_nonzero_degree[e.v2.id] = 1
		} )
		// include vertices without adjacent edges as well
		_.each( _.difference( _.pluck(g.getVertices(),"id"), _.keys( v_nonzero_degree ) ),
			function(vid){
				r += vid+" ~~ "+vid+"\n"
			}
		)
		return r
	},

	toTikz : function( g, precision ){
		if( precision == null ){ precision = 5 }
		var vv = g.getVertices(), i, r = "", ee = g.getEdges(), v_index = [], edgetype,
			p1x, p1y, p2x, p2y
		for( i = 0 ; i < vv.length ; i ++ ){
			r += "\\node (v"+i+") at ("+vv[i].layout_pos_x.toPrecision(precision)+
				","+(-vv[i].layout_pos_y).toPrecision(precision)+") {"+vv[i].id+"};\n"
			v_index[vv[i].id] = i
		}
		for( i = 0 ; i < ee.length ; i ++ ){
			edgetype = ""
			if( ee[i].directed == Graph.Edgetype.Directed ){
				edgetype = "[->] "
			}
			if( ee[i].directed == Graph.Edgetype.Bidirected ){
				edgetype = "[->,<-] "
			}
			if( ee[i].layout_pos_x ){
				p1x = (1/3*ee[i].v1.layout_pos_x + 2/3*ee[i].layout_pos_x).
					toPrecision(precision)
				p1y = -(1/3*ee[i].v1.layout_pos_y + 2/3*ee[i].layout_pos_y).
					toPrecision(precision)
				p2x = (1/3*ee[i].v2.layout_pos_x + 2/3*ee[i].layout_pos_x).
					toPrecision(precision)
				p2y = -(1/3*ee[i].v2.layout_pos_y + 2/3*ee[i].layout_pos_y).
					toPrecision(precision)
				r += "\\draw "+edgetype+"(v"+v_index[ee[i].v1.id]+
						") .. controls ("+p1x+","+p1y+
						") and ("+p2x+","+p2y+") .. (v"+v_index[ee[i].v2.id]+");\n"
			} else {
				r += "\\draw "+edgetype+"(v"+v_index[ee[i].v1.id]+") edge (v"+v_index[ee[i].v2.id]+");\n"
			}
		}
		return r
	},

	toEdgelist : function( g ){
		var ee = g.getEdges(), r = []
		_.each( ee, function(e){
			r.push( "('" + 
					e.v1.id.replace( /'/g, "\\'" ) +
					"','" + 
					e.v2.id.replace( /'/g, "\\'" ) +
			"')" ) 
		} )
		return "["+r.join(",")+"]"
	},

	toBnlearn : function( g ){
		var vv = g.getVertices(), r = ""
		_.each( vv, function(v){
			r += "["+v.id
			var rpar = _.pluck(v.getParents(),"id").join(":")
			if( rpar ){
				r += "|"+rpar
			}
			r += "]"
		} )
		return r
	},
	
	mathematicaSyntax : function( g, use_ids_as_labels ){
		var pv = this.polynomialVariety( g, use_ids_as_labels )
		return "GroebnerBasis[{"+pv[0]+"},\n{"+pv[2].join(",")+"},\n{"+pv[1].join(",")+"}]"
	},

	singularSyntax : function( g, use_ids_as_labels, standardized ){
		standardized = standardized ? 1 : 0
		var pv = this.polynomialVariety( g, use_ids_as_labels, standardized )

		// constraints
		return "ring r = 0,("+pv[1].join(",")+","+pv[2].join(",")+"),(dp("+pv[1].length+"),lp);\n" +
			"ideal i = "+pv[0]+";\noption(redSB);\nideal j = groebner(i); print( j );"

		// solution of just-identified system
		//return "ring r = (0,"+pv[2].join(",")+"),("+pv[1].join(",")+"),(dp);\n" +
		//	"ideal i = "+pv[0]+";\noption(redSB);\nideal j = groebner(i); print( j );"

		//return "GroebnerBasis[{"+pv[0]+"},{"+pv[2].join(",")+"},{"+pv[1].join(",")+"}]"
	},

	toSingular : function( g ){
		return this.singularSyntax( g, true, true )
	},

	polynomialVariety : function( g, use_ids_as_labels, standardized ){
		if( typeof use_ids_as_labels === "undefined" ){
			use_ids_as_labels = false
		}
		standardized = standardized ? 1 : 0
		var vv = g.getVertices(), i, j, v_elements = [], 
			values = [], vnr = []
		for( i = 0 ; i < vv.length ; i ++ ){
			if( use_ids_as_labels ){
				vnr[vv[i].id] = vv[i].id
			} else {
				vnr[vv[i].id] = i
			}
		}
		
		var covs = function( i, j ){
			return "a"+vnr[vv[i].id]+"a"+vnr[vv[j].id]
		}
		
		for( i = 0 ; i < vv.length ; i ++ ){
			//if( !standardized ){
			if( i == 0 ){
				var parameters = GraphAnalyzer.trekRule( g, vv[i], vv[i],
					use_ids_as_labels, standardized )[1]
			}
			//}
			if( g.isLatentNode( vv[i] ) ) continue
			for( j = i + standardized; j < vv.length ; j ++ ){
				if( g.isLatentNode( vv[j] ) ) continue
				values.push(covs(i,j))
				var monomials = GraphAnalyzer.trekRule( g, 
					vv[i], vv[j], use_ids_as_labels, standardized )
				if( monomials[0].length > 0 ){
					v_elements.push( 
						covs(i,j)+" - (" + 
							monomials[0].map( function( t ){ return t.join("*") } ).join(" + ") + ")"
					)
					/*v_elements.push( 
						 monomials[0].map( function( t ){ return t.join("*") } ).
						join(" + ")
					)*/
				} else {
					v_elements.push( covs(i,j) ) 
				}
			}
		}
		return [v_elements.join(",\n"),parameters,values]
	},
	
	toImplicationTestRCode : function( g, max_nr ){
		var imp, i, j, r_str
		if( max_nr == null ){ max_nr = 1000 }
		imp = GraphAnalyzer.listMinimalImplications( g, max_nr )
		r_str = []
		for( i = 0 ; i < imp.length ; i ++ ){
			for( j = 0 ; j < imp[i][2].length ; j ++ ){
				r_str.push( "c(\""+
				imp[i][0]+"\",\""+imp[i][1]+"\""+
				( imp[i][2][j].length > 0 ?
					",\""+_.pluck(imp[i][2][j],"id").join("\",\"")+"\""
					: "" ) +
				")" )
			}
		}
		return "testImplications <- function( covariance.matrix, sample.size ){\n"+
				"\tlibrary(ggm)\n\t"+
				"tst <- function(i){ pcor.test( pcor(i,covariance.matrix), length(i)-2, sample.size )$pvalue }\n"+
				"tos <- function(i){ paste(i,collapse=\" \") }\n"+
				"implications <- list("+ 
				r_str.join(",\n\t\t")+")\n\t"+
				"data.frame( implication=unlist(lapply(implications,tos)),\n\t\t"+
				"pvalue=unlist( lapply( implications, tst ) ) )\n"+
			"\n}"
	},
	
	toJavascriptMultilineString : function( g ){
		var gt = g.toString().split("\n"), i, r_str = []
		for( i = 0 ; i < gt.length ; i ++ ){
			r_str.push(gt[i])
		}
		return "\t\""+r_str.join("\\n\"+\n\t\"")+"\""
	},

	//Exports the graph as igraph edge list with the attributes needed for the causaleffect package.
	//Latent nodes are replaced by bidirectional edges, only directed and bidirectional edges are allowed
	toCausalEffectIgraphRCode : function (g){
		var gbidi = GraphTransformer.contractLatentNodes(g)
		var edgesresult = []
		var bidirectional = []
		var withEdges = new Hash()
		_.each(gbidi.getEdges(), function(e){
			withEdges.set(e.v1.id, true)
			withEdges.set(e.v2.id, true)
			edgesresult.push( GraphSerializer.quoteVid(e.v1.id) + "," + GraphSerializer.quoteVid(e.v2.id) )
			if (e.directed == Graph.Edgetype.Bidirected) {
				bidirectional.push(edgesresult.length)
				edgesresult.push( GraphSerializer.quoteVid(e.v2.id) + "," + GraphSerializer.quoteVid(e.v1.id) )
				bidirectional.push(edgesresult.length)
			}
		} )
		
		var result = edgesresult.length > 0 ? "set.edge.attribute(graph = graph_from_edgelist(matrix(c( "+edgesresult.join(", ")+" ),nc = 2,byrow = TRUE)), name = \"description\", index = c("+bidirectional.join(", ")+"), value = \"U\")" : "make_empty_graph()"
		
		var withoutEdges = _.filter(g.getVertices(), function(v){return !withEdges.get(v.id)})
		if (withoutEdges.length > 0) result = result + " + vertices(" + withoutEdges.map(function(v){ return GraphSerializer.quoteVid(v.id) }).join(", ")+  ")"
		
		return result
	},
	
	//Exports R-code to find the causal effect from the current exposures to current outcomes using the causaleffect package
	toCausalEffectRCode : function(g){
		var nodeList = function(a) { return "c(" + a.map(function(v){return GraphSerializer.quoteVid(v.id)}).join(", ") + ")" }
		return "causal.effect(y = "+nodeList(g.getTargets())+", x = "+nodeList(g.getSources())+", G = "+this.toCausalEffectIgraphRCode(g)+")"
	}
}; // eslint-disable-line 

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
      if (res[k][0] == 0) k--;
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
  var TIMES = "TIMES" in formatting ? formatting.TIMES : "*"
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
    for (var i=1; i < term.length; i+=2) {
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
    var replacements = new Array(MPolyHelper.variableCount + 1)
    for (p in insert) 
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
//    console.log(newsum)
  }
  if (newsum === null) newsum = MPoly.zero
  return newsum
}
MPoly.prototype.evalNumeric = function(insert, options){
  var replacements
  if (_.isArray(insert)) replacements = insert
  else {
    var replacements = new Array(MPolyHelper.variableCount + 1)
    for (p in insert) 
      replacements[MPolyHelper.variableFromString(p, true)] = insert[p]
  }
  if (!options) options = {}
  var MUL = "mul" in options ? options.mul : function(x,y){return x*y}
  var ADD = "add" in options ? options.add : function(x,y){return x+y}

  var newsum = 0n
  for (var i=0;i<this.length;i++) {
    var old = this[i]
    var newproduct = BigInt(old[0])
    for (var j=1;j<old.length;j+=2) {
      if (old[j] in replacements) {
        var replacement = replacements[old[j]]
        for (var k=0;k<old[j+1];k++) 
          newproduct = MUL(newproduct, replacement)
      } else throw "No value given for " + MPolyHelper.variableToString(old[j])
    }
    newsum = ADD(newsum, newproduct)
//    console.log(newsum)
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
    for (var i = 1; i < monos.length; i++) 
      if (monos[i - 1][0] == monos[i][0]) {
        monos[i - 1][1] += monos[i][1]
        monos.splice(i,1)
        i--
      }
    var resa = new Array(monos.length*2 + 1)
    resa[0] = factor
    for (var i=0;i < monos.length; i++) {
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
     var res = MPolyHelper.createEmptyMPoly(p.length)
     var j = 0
     for (; j < i; j++) res[j] = p[j]
     for (; i < p.length && (p[i].length == 0 || p[i][0] == 0); i++) {}
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


;/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
(function(root) {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = "strict",
        peg$c1 = peg$literalExpectation("strict", true),
        peg$c2 = "{",
        peg$c3 = peg$literalExpectation("{", false),
        peg$c4 = "}",
        peg$c5 = peg$literalExpectation("}", false),
        peg$c6 = function(type, name, statements) {
          	return { type : type.toLowerCase(), name:name, statements:statements }
          },
        peg$c7 = function(name, statements) {
        	  return { type : 'subgraph', name:name, statements:statements }
          },
        peg$c8 = function(head, tail) { return buildList(head,tail,1) },
        peg$c9 = "=",
        peg$c10 = peg$literalExpectation("=", false),
        peg$c11 = function(a, b) { 
          	return { type:'node', id:'graph', attributes:[[a,b]] }
          },
        peg$c12 = function(v, tl, a) { 
           	if( a === null ){
          		a = []
          	}
        	return {type:'edge', content:[v].concat(tl), attributes:a} 
         },
        peg$c13 = function(a, v, tl) {return tl},
        peg$c14 = function(a, v, more) {
         	return [a,v].concat(more||[]) },
        peg$c15 = function(l) { return l },
        peg$c16 = function(name, a) { 
          	if( a === null ){
          		a = {}
          	}
          	return {type:'node', id:name, attributes:a} 
          },
        peg$c17 = "[",
        peg$c18 = peg$literalExpectation("[", false),
        peg$c19 = "]",
        peg$c20 = peg$literalExpectation("]", false),
        peg$c21 = function(a) { return a },
        peg$c22 = ";",
        peg$c23 = peg$literalExpectation(";", false),
        peg$c24 = ",",
        peg$c25 = peg$literalExpectation(",", false),
        peg$c26 = function(k, v, tl) { 
        	if( v === null ){ v = 1 }
        	else{ v = v[2] }
        	var r = [[k,v]]
        	if( tl ) r = r.concat( tl )
        	return r
          },
        peg$c27 = "@->",
        peg$c28 = peg$literalExpectation("@->", false),
        peg$c29 = "<-@",
        peg$c30 = peg$literalExpectation("<-@", false),
        peg$c31 = "->",
        peg$c32 = peg$literalExpectation("->", false),
        peg$c33 = "--@",
        peg$c34 = peg$literalExpectation("--@", false),
        peg$c35 = "--",
        peg$c36 = peg$literalExpectation("--", false),
        peg$c37 = "<->",
        peg$c38 = peg$literalExpectation("<->", false),
        peg$c39 = "<-",
        peg$c40 = peg$literalExpectation("<-", false),
        peg$c41 = "@-@",
        peg$c42 = peg$literalExpectation("@-@", false),
        peg$c43 = "@--",
        peg$c44 = peg$literalExpectation("@--", false),
        peg$c45 = function(e) { return e },
        peg$c46 = "graph",
        peg$c47 = peg$literalExpectation("graph", true),
        peg$c48 = "digraph",
        peg$c49 = peg$literalExpectation("digraph", true),
        peg$c50 = "dag",
        peg$c51 = peg$literalExpectation("dag", true),
        peg$c52 = "mag",
        peg$c53 = peg$literalExpectation("mag", true),
        peg$c54 = "pdag",
        peg$c55 = peg$literalExpectation("pdag", true),
        peg$c56 = "pag",
        peg$c57 = peg$literalExpectation("pag", true),
        peg$c58 = function(t) { return t },
        peg$c59 = "-",
        peg$c60 = peg$literalExpectation("-", false),
        peg$c61 = /^[0-9a-zA-Z_.]/,
        peg$c62 = peg$classExpectation([["0", "9"], ["a", "z"], ["A", "Z"], "_", "."], false, false),
        peg$c63 = function(m, id) { return (m===null?'':'-') + id.join('') },
        peg$c64 = "\"",
        peg$c65 = peg$literalExpectation("\"", false),
        peg$c66 = function() {return "";},
        peg$c67 = "\\",
        peg$c68 = peg$literalExpectation("\\", false),
        peg$c69 = /^[\r\n]/,
        peg$c70 = peg$classExpectation(["\r", "\n"], false, false),
        peg$c71 = "+",
        peg$c72 = peg$literalExpectation("+", false),
        peg$c73 = function(v, v2) {return v2},
        peg$c74 = function(v, rest) { return rest === null ? v[1] : (v[1] + rest); },
        peg$c75 = function(chars) { return chars.join(""); },
        peg$c76 = /^[^"\\\0-\x1F\x7F]/,
        peg$c77 = peg$classExpectation(["\"", "\\", ["\0", "\x1F"], "\x7F"], true, false),
        peg$c78 = "\\\"",
        peg$c79 = peg$literalExpectation("\\\"", false),
        peg$c80 = function() { return '"'; },
        peg$c81 = /^[\n\r]/,
        peg$c82 = peg$classExpectation(["\n", "\r"], false, false),
        peg$c83 = function() { return ""; },
        peg$c84 = function() { return '\\'; },
        peg$c85 = /^[\n\r\t ;]/,
        peg$c86 = peg$classExpectation(["\n", "\r", "\t", " ", ";"], false, false),

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location
      );
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsegraph();

      return s0;
    }

    function peg$parsegraph() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6).toLowerCase() === peg$c0) {
          s2 = input.substr(peg$currPos, 6);
          peg$currPos += 6;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c1); }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseGRAPHTYPE();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseid();
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 123) {
                  s6 = peg$c2;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c3); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsestmt_list();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 125) {
                        s9 = peg$c4;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c5); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c6(s4, s5, s8);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsesubgraph() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 123) {
          s2 = peg$c2;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c3); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsestmt_list();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 125) {
                s5 = peg$c4;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c5); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c7(s1, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsestmt_list() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsestmt();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 === peg$FAILED) {
          s4 = null;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parsestmt();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsestmt();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c8(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsestmt() {
      var s0;

      s0 = peg$parseglobaloption();
      if (s0 === peg$FAILED) {
        s0 = peg$parseedge_stmt();
        if (s0 === peg$FAILED) {
          s0 = peg$parsenode_stmt();
          if (s0 === peg$FAILED) {
            s0 = peg$parsesubgraph();
          }
        }
      }

      return s0;
    }

    function peg$parseglobaloption() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c9;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseid();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c11(s1, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseedge_stmt() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 === peg$FAILED) {
        s1 = peg$parsesubgraph();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseedgeRHS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseattr_list();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c12(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseedgeRHS() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseEDGE();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseid();
        if (s3 === peg$FAILED) {
          s3 = peg$parsesubgraph();
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          s5 = peg$parseedgeRHS();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s4;
            s5 = peg$c13(s2, s3, s5);
          }
          s4 = s5;
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s1;
            s2 = peg$c14(s2, s3, s4);
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c15(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenode_stmt() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseattr_list();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c16(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseattr_list() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c17;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsea_list();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c19;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c20); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c21(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsea_list() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseid();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c9;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseid();
            if (s5 !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 59) {
            s3 = peg$c22;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c23); }
          }
          if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s3 = peg$c24;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c25); }
            }
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsea_list();
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c26(s1, s2, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEDGE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c27) {
        s1 = peg$c27;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c29) {
          s1 = peg$c29;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c31) {
            s1 = peg$c31;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c33) {
              s1 = peg$c33;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c34); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c35) {
                s1 = peg$c35;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c36); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c37) {
                  s1 = peg$c37;
                  peg$currPos += 3;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c38); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c39) {
                    s1 = peg$c39;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c40); }
                  }
                  if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 3) === peg$c41) {
                      s1 = peg$c41;
                      peg$currPos += 3;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c42); }
                    }
                    if (s1 === peg$FAILED) {
                      if (input.substr(peg$currPos, 3) === peg$c43) {
                        s1 = peg$c43;
                        peg$currPos += 3;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c44); }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c45(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseGRAPHTYPE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5).toLowerCase() === peg$c46) {
        s1 = input.substr(peg$currPos, 5);
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 7).toLowerCase() === peg$c48) {
          s1 = input.substr(peg$currPos, 7);
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c49); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 3).toLowerCase() === peg$c50) {
            s1 = input.substr(peg$currPos, 3);
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c51); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 3).toLowerCase() === peg$c52) {
              s1 = input.substr(peg$currPos, 3);
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c53); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 4).toLowerCase() === peg$c54) {
                s1 = input.substr(peg$currPos, 4);
                peg$currPos += 4;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c55); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 3).toLowerCase() === peg$c56) {
                  s1 = input.substr(peg$currPos, 3);
                  peg$currPos += 3;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c57); }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c58(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseid() {
      var s0;

      s0 = peg$parseBAREWORD();
      if (s0 === peg$FAILED) {
        s0 = peg$parseSTRING();
      }

      return s0;
    }

    function peg$parseBAREWORD() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s1 = peg$c59;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c61.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c62); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c61.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c62); }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c63(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTRING() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c64;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c64;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c65); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c66();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c64;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c65); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsechars();
          if (s3 !== peg$FAILED) {
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s5 = peg$c67;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c68); }
            }
            if (s5 !== peg$FAILED) {
              s6 = [];
              if (peg$c69.test(input.charAt(peg$currPos))) {
                s7 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c70); }
              }
              if (s7 !== peg$FAILED) {
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  if (peg$c69.test(input.charAt(peg$currPos))) {
                    s7 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c70); }
                  }
                }
              } else {
                s6 = peg$FAILED;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsechars();
                if (s7 !== peg$FAILED) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 34) {
                s5 = peg$c64;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c65); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s2 = [s2, s3, s4, s5, s6];
                  s1 = s2;
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 43) {
            s3 = peg$c71;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c72); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseSTRING();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c73(s1, s5);
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c74(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c75(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3;

      if (peg$c76.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c77); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c78) {
          s1 = peg$c78;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c79); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c80();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 92) {
            s1 = peg$c67;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c81.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c82); }
            }
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c81.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c82); }
                }
              }
            } else {
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c83();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 92) {
              s1 = peg$c67;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c68); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c84();
            }
            s0 = s1;
          }
        }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      if (peg$c85.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c86); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c85.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c86); }
        }
      }

      return s0;
    }


      function extractList(list, index) {
        var result = [], i;

        for (i = 0; i < list.length; i++) {
          if (list[i][index] !== null) {
            result.push(list[i][index]);
          }
        }

        return result;
      }

      function buildList(head, tail, index) {
        return (head !== null ? [head] : []).concat(extractList(tail, index));
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  root.GraphDotParser = {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})(this);
/* DAGitty - a browser-based software for causal modelling and analysis
 *   Copyright (C) 2010-2020 Johannes Textor, Benito van der Zander
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

/* globals Hash,GraphGUI_SVG,Graph,GraphTransformer,Class,_ */
/* exported DAGittyGraphView */

var DAGittyGraphView = Class.extend({
	init : function( el, graph, controller, obj ){
		// el -> parent element to hook into
		// graph -> graph object to use (model)
		// controller -> controller to send commands to 
		// obj -> further options
		//    autofocus -> if true, will set an event handler giving
		//                 focus to the container on mouse entry
		
		this.setContainer(el)
		this.setGraph(graph)
		this.setController(controller)
		
		var c = this.getContainer()
		
		c.style.userSelect = "none"
		c.style.whiteSpace="normal"
		c.style.textAlign="center"
		this.width = c.offsetWidth-4
		this.height = c.offsetHeight-4
		c.setAttribute("tabindex",0)

		c.style.WebkitUserSelect = "none"
		c.style.MozUserSelect = "none"
		c.style.MsUserSelect = "none"
		c.style.UserSelect = "none"
		
		if( getComputedStyle( c ).getPropertyValue("position") != "absolute" ){
			c.style.position = "relative"
		}
		
		el.innerHTML = ""
		this.impl = new GraphGUI_SVG( c, this.width, this.height, {
			interactive : obj.interactive
		} )

		if( ! (obj.interactive === false || obj.mutable===false) ){
			this.initEventListeners(obj)
		}

		// We always pass on the "vertex_marked" event if available
		this.impl.setEventListener( "vertex_marked", 
			_.bind( function(v){ this.callEventListener( "vertex_marked", [v] ) }, this ) )

		this.view_mode = "normal"
		this.drawGraph()
	},

	initEventListeners : function(obj){
		this.impl.setEventListener( "vertex_drag", _.bind( function( vs ){
			var g_coords = this.toGraphCoordinate( vs.x, vs.y )
			vs.v.layout_pos_x = g_coords[0] // changes model
			vs.v.layout_pos_y = g_coords[1] // changes model
			if( this.getViewMode() != "normal" ){
				var v = this.getGraph().getVertex(vs.v.id)
				v.layout_pos_x = g_coords[0]
				v.layout_pos_y = g_coords[1]
			}
		}, this ) )

		this.impl.setEventListener( "edge_drag", _.bind( function( es ){
			var g_coords = this.toGraphCoordinate( es.cx, es.cy )
			es.e.layout_pos_x = g_coords[0] // changes model
			es.e.layout_pos_y = g_coords[1] // changes model
		}, this ) )

		this.impl.setEventListener( "drag_end", _.bind( function(){
			this.getController().graphLayoutChanged()}, this ) )

		this.impl.setEventListener( "vertex_connect", 
			_.bind( this.connectVertices, this ) )	

		this.registerEventListeners( obj?obj.autofocus:false )
	},

	pointerX : function(e) {
		var docElement = document.documentElement,
			body = document.body || { scrollLeft: 0 }

		return e.pageX || (e.clientX +
			(docElement.scrollLeft || body.scrollLeft) -
			(docElement.clientLeft || 0))
	},

	pointerY : function(e) {
		var docElement = document.documentElement,
			body = document.body || { scrollTop: 0 }

		return  e.pageY || (e.clientY +
			(docElement.scrollTop || body.scrollTop) -
			(docElement.clientTop || 0))
	},

	setStyle : function( sheetname ){
		this.impl && this.impl.setStyle( sheetname )
	},
	getStyle : function(){
		if( this.impl ){
			return this.impl.getStyle()
		} else {
			return null
		}
	},
	getGraph : function(){
		return this.graph
	},
	setGraph : function( graph ){
		this.setCoordinateSystemValid( false )
		this.graph=graph
	},
	getContainer : function(){
		return this.container
	},
	setContainer : function( container ){
		this.container=container
	},
	getController : function(){
		return this.controller
	},
	setController : function( controller ){
		this.controller=controller
	},
	getCurrentVertex : function(){
		var el = this.getImplementation().getLastHoveredElement()
		if( el && el.vertex ){
			return el.vertex
		} 
		el = this.getImplementation().getMarkedVertex()
		if( el ){
			return el
		}
		return void(0)
	},
	getCurrentEdge : function(){
		var el = this.impl.getLastHoveredElement()
		if( el && el.edge ){
			return el.edge
		} else {
			return void(0)
		}
	},
	registerEventListeners : function( autofocus ){
		/* register event handlers on canvas */
		var myself = this, mycontainer = myself.getContainer()
		
		var boundClickHandler = _.bind( this.clickHandler, this )
		this.getContainer().addEventListener( "click", boundClickHandler )
		
		if( autofocus ){
			var f = function(){ if(!mycontainer.contains( document.activeElement )){ 
				mycontainer.focus() } }
			this.getContainer().addEventListener( "mouseenter", f )
			this.getContainer().addEventListener( "touchenter", f )
		}
		
		this.getContainer().addEventListener( "keydown", function(e){ myself.keydownHandler(e) } )
	},

	clickHandler : function(e){
		// click handler can be set to emulate keypress action
		// using this function
		console.log(" click handler called on canvas" )
		this.last_click_x = this.pointerX(e)-this.getContainer().offsetLeft
		this.last_click_y = this.pointerY(e)-this.getContainer().offsetTop
		this.last_click_g_coords = this.toGraphCoordinate( this.last_click_x, this.last_click_y )
		this.newVertexDialog() 
	},

	unmarkVertex : function(){
		this.impl.unmarkVertexShape()
	},

	toggleVertexProperty : function( v, prop ){
		// this will trigger a redraw
		this.getController().toggleVertexProperty( v, prop ) 
		this.impl.unmarkVertexShape()
	},

	keydownHandler : function(e){
		if( this.dialogOpen() ) return
		var v = this.getCurrentVertex()
		var es = this.getCurrentEdge()
		switch( e.keyCode ){
		case 8: // backspace
		case 46: //del
		case 65: //a
			if(v) this.toggleVertexProperty(v,"adjustedNode")
			break
		case 67: //c
			if(v) this.impl.touchVertexShape( this.getVertexShape(v.id), e )
			break
		case 68: //d
			if(v) this.getController().deleteVertex(v)
			if(es) this.getController().deleteAnyEdge(es.v1.id, es.v2.id)
			break
		case 69: //e
			if(v) this.toggleVertexProperty(v,"source")
			break
		case 78: //n
			this.newVertexDialog()
			e.stopPropagation()
			e.preventDefault()
			break
		case 79: //o
			if(v) this.toggleVertexProperty(v,"target")
			break
		case 82: //r
			if(v){
				this.renameVertexDialog()
				e.stopPropagation()
				e.preventDefault()
			}
			break
		case 85: //u
			if(v) this.toggleVertexProperty(v,"latentNode")
			break
		}
	},

	getImplementation : function(){
		return this.impl
	},

	callEventListener : function( event_name, args ){
		var en = event_name+"_listener"
		if( typeof this[en] == "function" ){
			this[en].apply( this, args )
		}
	},

	setEventListener : function( event_name, f ){
		this[event_name+"_listener"] = f
	},


	resize : function(){
		var newwidth = this.getContainer().offsetWidth-4,
			newheight = this.getContainer().offsetHeight-4
		if( this.width != newwidth || this.height != newheight ){
			this.setCoordinateSystemValid( false )
			this.width = newwidth
			this.height = newheight
			this.impl.resize( this.width, this.height )
			this.drawGraph()
		}
	},
	getViewMode : function(){
		return this.view_mode
	},
	setViewMode : function( m ){
		this.view_mode = m
		this.drawGraph()
	},
	connectVertices : function( v1, v2 ){
		if( this.dialogOpen() ){ return }
		if( v1 == v2 ) return

		this.lastEdge = this.getController().toggleEdgeFromTo( v1, v2 )
	},
	newVertex : function( n ){
		if( !n ){
			this.dialogErrorMessage( "Please enter the variable name!")
			return
		}
		// sanitize -> no longer needed
		n = n.replace(/^\s+|\s+$/g,"") //.replace( /\s+/g, "_" )
		var v = this.graph.getVertex( n )
		if( v ){
			this.dialogErrorMessage( "The variable "+n+" already exists!")
			return
		}
		this.getController().newVertex( n, this.last_click_g_coords[0], this.last_click_g_coords[1] )
		this.closeDialog()
	},
	renameVertex : function( n, v ){
		if( !n ){
			this.dialogErrorMessage( "Please enter the variable name!")
			return
		}
		// var v = this.getCurrentVertex()
		// sanitize -> no longer needed
		//n.replace( /\s+/, "_" )
		if( !v || (n === v.id) ){ return }
		if( this.getGraph().getVertex( n ) ){
			this.dialogErrorMessage( "The variable "+n+" already exists!")
			return
		}
		this.getController().renameVertex( v.id, n )
		this.closeDialog()
	},
	closeDialog : function(){
		if( this.current_dialog ){
			this.getContainer().removeChild( this.current_dialog.dom )
			this.getContainer().focus()
		}
		delete this.current_dialog
	},
	// This is meant to display an error message in an already open
	// dialog.
	dialogErrorMessage : function( m ){
		if( this.current_dialog ){
			this.current_dialog.error_message_field.innerHTML = m
		}
	},
	openHTMLDialog : function(h, button_text){
		this.closeDialog()
		var el = function(n){return document.createElement(n)}
		var txt = function(el,t){el.appendChild( document.createTextNode(t) ) }
		var myself = this
		var qdiv = el( "div" )
		qdiv.className="dialogwin"
		qdiv.appendChild( el("p") )
		var qform = el( "form" )
		qform.setAttribute( "name", "newvertexform" )
		qform.onsubmit = function(){return false}
		var qf = el("p")
		qf.innerHTML = h
		qform.appendChild(qf)
		if( button_text ){
			qform.appendChild(el("br"))
			qf = el("button")
			qf.setAttribute( "type", "button" )
			txt(qf,"OK")
			qf.onclick = function(){myself.closeDialog()}
			qform.appendChild(document.createTextNode(" "))
			qform.appendChild(qf)
		}
		qdiv.appendChild(qform)
		this.getContainer().appendChild( qdiv )
		this.current_dialog = { 
			dom : qdiv
		}
		qdiv.onclick=function(e){e.stopPropagation()}
	},
	openAlertDialog : function(t){
		this.closeDialog()
		var el = function(n){return document.createElement(n)}
		var txt = function(el,t){el.appendChild( document.createTextNode(t) ) }
		var myself = this
		var qdiv = el( "div" )
		qdiv.className="dialogwin"
		qdiv.appendChild( el("p") )
		var qform = el( "form" )
		qform.setAttribute( "name", "newvertexform" )
		qform.onsubmit = function(){return false}
		var qf = el("p")
		txt(qf,t)
		qform.appendChild(qf)
		qform.appendChild(el("br"))
		qf = el("button")
		qf.setAttribute("type","button")
		txt(qf,"OK")
		qf.onclick = function(){myself.closeDialog()}
		qform.appendChild(document.createTextNode(" "))
		qform.appendChild(qf)
		qdiv.appendChild(qform)
		this.getContainer().appendChild( qdiv )
		this.current_dialog = { 
			dom : qdiv
		}
		qf.focus()
		qdiv.onclick=function(e){e.stopPropagation()}
	},
	// t : text ; v : default value ; f : callback when clicked "OK"
	openPromptDialog : function(t,v,f){
		this.closeDialog()
		var el = function(n){return document.createElement(n)}
		var txt = function(el,t){el.appendChild( document.createTextNode(t) ) }
		var myself = this
		var qdiv = el( "div" )
		qdiv.className="dialogwin"
		qdiv.style.width="100%"
		qdiv.style.height="100%"
		qdiv.style.position="absolute"
		qdiv.style.backgroundColor="#999"
		qdiv.style.textAlign="center"
		qdiv.style.top="0px"
		qdiv.style.left="0px"
		qdiv.style.opacity=".9"
		
		qdiv.appendChild( el("p") )
		var qform = el( "form" )
		qform.setAttribute( "name", "newvertexform" )
		var qf = el("label")
		qf.style.fontFamily = "sans-serif"
		qf.setAttribute("for","vertexname")
		txt(qf,t)
		qform.appendChild(qf)
		qform.appendChild(el("br"))
		var qfin = el("input")
		qfin.setAttribute( "type", "text" )
		qfin.setAttribute( "size", 30 )
		qfin.setAttribute( "maxlength", 255 )
		qfin.setAttribute( "value", v )	
		if( v.length > 0 ){
			qfin.setSelectionRange( 0, v.length )
		}
		qform.appendChild(qfin)
		qform.appendChild(el("br"))
		var qferr = el("span")
		qferr.className="err"
		qform.appendChild( qferr )
		qform.appendChild(el("br"))
		qf = el("button")
		qf.setAttribute("type","submit")
		txt(qf,"OK")
		qf.onclick = function(){ 
			f.call(myself,qfin.value)
		}
		qform.onsubmit = function(){qf.onclick(); return false}
		qform.appendChild(qf)
		var qfc = el("button")
		qfc.setAttribute("type","button")
		txt(qfc,"Cancel")
		qfc.onclick = function(){myself.closeDialog()}
		qform.appendChild(document.createTextNode(" "))
		qform.appendChild(qfc)
		qdiv.appendChild(qform)
		this.getContainer().appendChild( qdiv )
		this.current_dialog = { 
			dom : qdiv,
			error_message_field : qferr
		}
		qfin.focus()
		qdiv.onclick=function(e){e.stopPropagation()}
	},
	dialogOpen : function(){
		return this.current_dialog !== undefined
	},
	newVertexDialog : function(){
		var i=1
		if( !this.dialogOpen() ){
			while( this.getGraph().getVertex("v"+i) ){ i++ }
			this.openPromptDialog( "name of the new variable:", "v"+i, this.newVertex )
		}
	},
	renameVertexDialog : function( vid ){
		var myself = this, v
		if( vid ){
			v = this.getGraph().getVertex(vid)
		} else {
			v = this.getCurrentVertex()
		}
		if( !this.dialogOpen() && v ){
			this.openPromptDialog( "rename variable:", v.id, function(n){ myself.renameVertex( n, v ) } )
		}
	},
	isCoordinateSystemValid : function(){
		return this.coordinate_system_valid
	},
	setCoordinateSystemValid : function(b){
		this.coordinate_system_valid = b
	},
	initializeCoordinateSystem : function( g ){
		var bb = g.getBoundingBox()
		if( bb ){
			this.bounds = [bb[0],bb[2],bb[1],bb[3]]
		} else {
			if( this.isCoordinateSystemValid() ){ return }
			var min_x = Infinity, max_x = -Infinity, min_y = Infinity, max_y = -Infinity
			var vv = g.getVertices()
			for( var i = 0 ; i < vv.length ; i ++ ){
				min_x = vv[i].layout_pos_x < min_x ? vv[i].layout_pos_x : min_x
				min_y = vv[i].layout_pos_y < min_y ? vv[i].layout_pos_y : min_y
				max_x = vv[i].layout_pos_x > max_x ? vv[i].layout_pos_x : max_x
				max_y = vv[i].layout_pos_y > max_y ? vv[i].layout_pos_y : max_y
			}
			if( max_x == min_x ){ max_x = min_x + 1 }
			if( max_y == min_y ){ max_y = min_y + 1 }
			var xpad=50/this.width*(max_x-min_x)
			var ypad=80/this.height*(max_y-min_y)
			this.bounds = [min_x-xpad,max_x+xpad,min_y-ypad,max_y+ypad]
		}
		this.setCoordinateSystemValid( true )
	},
	toScreenCoordinate : function( x, y ){
		return [(x-this.bounds[0])/(this.bounds[1]-this.bounds[0])*this.width,
			(y-this.bounds[2])/(this.bounds[3]-this.bounds[2])*this.height]
	},
	toGraphCoordinate : function( x, y ){
		return [x/this.width*(this.bounds[1]-this.bounds[0])+this.bounds[0],
			y/this.height*(this.bounds[3]-this.bounds[2])+this.bounds[2]]
	},
	getVertexShape : function( vid ){
		return this.vertex_shapes.get( vid )
	},
	drawGraph : function(){
		var g,i,c
		var g_causal = new Graph()
		var g_bias = new Graph()
		var g_trr = new Graph()

		var g_an = GraphTransformer.ancestorGraph(
				GraphTransformer.backDoorGraph(
					this.getGraph() ) )

		switch( this.getViewMode() ){
		case "moral" : 
			if( this.graph.getSources().length > 0 && this.graph.getTargets().length > 0 ){
				g = GraphTransformer.moralGraph( g_an )
			} else {
				g = new Graph()
			}
			break
		case "dependency" : 
			g = GraphTransformer.dependencyGraph( this.getGraph() )
			break
		case "equivalence" :
			g = GraphTransformer.dagToCpdag( this.getGraph() )
			break
		default:
			g = this.getGraph()
			g_trr = GraphTransformer.transitiveReduction( g )
			if( g.getSources().length > 0 && g.getTargets().length > 0 ){
				g_causal = GraphTransformer.causalFlowGraph(g)
				g_bias = GraphTransformer.activeBiasGraph(g)
			}
		}

		this.initializeCoordinateSystem( g )
		
		var vv = g.getVertices()
		this.impl.suspendRedraw( 50000 )
		this.impl.clear()

		this.edge_shapes = new Hash()		
		this.vertex_shapes = new Hash()
		
		var ean_ids = {}
		_.each(g_an.ancestorsOf( g_an.getSources() ),function(v){ean_ids[v.id]=1})
		var oan_ids = {}
		_.each(g_an.ancestorsOf( g_an.getTargets() ),function(v){oan_ids[v.id]=1})

		for( i = 0 ; i < vv.length ; i ++ ){
			c = this.toScreenCoordinate( vv[i].layout_pos_x, vv[i].layout_pos_y )
			var vs = { id: vv[i].id, 
				x : c[0],
				y : c[1],
				adjacent_edges : [],
				v : vv[i] }

			var vertex_type = ""			
			if( g.isSource(vv[i]) ){
				vertex_type = "exposure"
			} else if( g.isTarget(vv[i]) ){
				vertex_type = "outcome"
			} else if( g.isAdjustedNode(vv[i]) ){
				vertex_type = "adjusted"
			} else if( g.isLatentNode(vv[i]) ){
				vertex_type = "latent"
			} else if( ean_ids[vv[i].id]
				&& oan_ids[vv[i].id] ){
				vertex_type = "confounder"
			} else if( ean_ids[vv[i].id] ){
				vertex_type = "anexposure"
			} else if( oan_ids[vv[i].id] ){
				vertex_type = "anoutcome"
			}
			
			this.impl.createVertexShape( vertex_type, vs )
			this.vertex_shapes.set( vv[i].id, vs )
		}
		this.impl.appendShapes( this.vertex_shapes.values() )
		this.impl.appendTextBackgrounds( this.vertex_shapes.values() )
		
		var ee = g.getEdges()
		for( i = 0 ; i < ee.length ; i ++ ){
			c = this.toScreenCoordinate( ee[i].v1.layout_pos_x, ee[i].v1.layout_pos_y ) 
			
			var es = { 
				v1 : this.getVertexShape( ee[i].v1.id ), 
				v2 : this.getVertexShape( ee[i].v2.id ),
				directed : ee[i].directed,
				e: ee[i]
			}

			if( ee[i].layout_pos_x ){
				var s_coord = this.toScreenCoordinate( ee[i].layout_pos_x,
					ee[i].layout_pos_y )
				es.cx = s_coord[0]
				es.cy = s_coord[1]
			}

			var edgetypes = []
			switch( ee[i].directed ){
			case 0 : edgetypes.push("undirected")
				break
			case 1 : edgetypes.push("directed")
				break
			case 2 : edgetypes.push("bidirected")
				break
			}

			if( g_causal.getEdge( ee[i].v1, ee[i].v2, ee[i].directed ) ){
				edgetypes.push( "causal" )
			}
			
			if( g_bias.getEdge( ee[i].v1, ee[i].v2, ee[i].directed ) ){
				edgetypes.push( "biasing" )
			}

			if( g_trr.getEdge( ee[i].v1, ee[i].v2 ) ){
				edgetypes.push( "puredirect" )
			}
			
			this.impl.createEdgeShape( edgetypes.join(" "), es )
			this.edge_shapes.set( ee[i].v1.id+"\0"+ee[i].v2.id+"\0"+ee[i].directed, es )
			es.v1.adjacent_edges.push( es )
			es.v2.adjacent_edges.push( es )
		}
		this.impl.prependShapes( this.edge_shapes.values() )
		this.impl.unsuspendRedraw()
	}
})

/* globals ObservedGraph,Class,_,Graph,DAGittyGraphView,GraphParser,GraphLayouter */
/* exported DAGittyController */

var DAGittyController = Class.extend({
	init : function( obj ){
		this.event_listeners = {
			"graphchange" : [],
			"graphlayoutchange" : [],
			"vertex_marked" : []
		}

		// the controller initializes the model ... 
		if( !obj.canvas ) return
		if( obj.graph ){
			this.setGraph( obj.graph )
		} else {
			this.setGraph( GraphParser.parseGuess( 
				obj.canvas.textContent||obj.canvas.innerText
			) )
		}
		
		// ... creates a simple graph layout if necessary ...
		if( !this.getGraph().hasCompleteLayout() ){
			new GraphLayouter.Spring( this.getGraph() ).layout()
		}

		// ... and creates the view ...
		this.view = new DAGittyGraphView( obj.canvas,
			this.getGraph(),
			this, { 
				interactive : obj.interactive,
				mutable : obj.mutable,
				autofocus : (obj.autofocus !== undefined) ? obj.autofocus : false,
			}
		)
	
		this.view.setEventListener( "vertex_marked", 
			_.bind( function(v){ _.each(this.event_listeners["vertex_marked"],
					function(l){ l(v) }) }, this ) )

		window.addEventListener( "resize", 
			_.debounce( _.bind( this.getView().resize, this.getView() ), 300 ) )
	
		// graph change event listeners are wired in the
		// function "setGraph" (because they might need to be 
		// changed when a completely new graph is loaded)
	},

	on : function( event_name, listener ){
		this.event_listeners[event_name].push( listener )
	},

	getGraph : function(){
		return this.graph
	},
	setGraph : function( graph ){
		this.graph = graph
		this.observed_graph = new ObservedGraph( graph )
		var myself = this
		this.observed_graph.observe( "change", 
			function(){ myself.graphChanged() } )
		if( this.view ){
			this.view.setGraph( graph )
		}
		this.graphChanged()
	},
	getObservedGraph : function(){
		return this.observed_graph
	},
	getView : function(){
		return this.view
	},
	setView : function( view ){
		this.view = view
	},
	setViewMode : function( viewmode ){
		if( this.view ){
			this.view.setViewMode( viewmode )
			this.view.drawGraph()
		}
	},
	setStyle : function( sheetname ){
		if( this.view ){
			this.view.setStyle( sheetname )
			this.view.drawGraph()
		}
	},
	getStyle : function(){
		if( this.view ){
			return this.view.getStyle()
		} else {
			return undefined
		}
	},
	redraw : function(){
		if( this.view ){
			this.view.drawGraph()
		}
	},
	graphChanged : function(){
		this.redraw()
		var g = this.getGraph()
		_.each(this.event_listeners["graphchange"],
			function(l){ l( g ) })
	},
	graphLayoutChanged : function(){
		var g = this.getGraph()
		_.each(this.event_listeners["graphlayoutchange"],
			function(l){ l( g ) })	
	},
	observe : function( _event, listener ){
		this.event_listeners[_event].push(listener)
	},
	setActionOnClick : function( a ){
		if( this.view ){
			this.view.setActionOnClick( a )
		}
	},

	toggleEdgeFromTo : function( v1, v2 ){
		var myself = this
		var done = function( e ){
			if(e){
				myself.getObservedGraph().deleteEdge( e.v1, e.v2, e.directed )
			}
			return 0
		}
		var e = this.getGraph().getEdge( v1, v2, Graph.Edgetype.Directed )
		if( e ){
			return done( e )
		}
		e = this.getGraph().getEdge( v1, v2, Graph.Edgetype.Bidirected )
		if( e ){
			return done( e )
		}
		e = this.getGraph().getEdge( v2, v1, Graph.Edgetype.Directed )
		if( e ){
			this.getObservedGraph().addEdge( v1, v2, Graph.Edgetype.Bidirected )
			return done( e )
		} else {
			this.getObservedGraph().addEdge( v1, v2, Graph.Edgetype.Directed )
			return done()
		}
	},
	/* 
		Handler that is called when an edge is clicked on. Cycles through the available types of edges.
		For now, I do not support undirected edges.
	*/
	toggleEdgeBetween : function( v1, v2 ){ 
		var edgeType = [ Graph.Edgetype.Directed, Graph.Edgetype.Bidirected,  Graph.Edgetype.Directed ]
		var edgeReversed = [false, false, true]
		var e, newe
		var i=0
		var v3

		// Search for already existing edge and delete it
		for (;i<edgeType.length;i++) {
			if( edgeReversed[i] ){
				e = this.getGraph().getEdge( v2, v1, edgeType[i] )
			} else {
				e = this.getGraph().getEdge( v1, v2, edgeType[i] )
			}
			if( e ){
				this.getObservedGraph().deleteEdge( e.v1, e.v2, e.directed )
				break
			}
		}
		
		// No previous edge; just add directed edge
		if (i >= edgeType.length) {
			newe = this.getObservedGraph().addEdge( v1, v2, Graph.Edgetype.Directed )
		} else {
			// previous edge exists, add new edge
			if( edgeReversed[(i+1) % edgeType.length] ){
				v3 = v1; v1 = v2; v2 = v3
			}
			newe = this.getObservedGraph().addEdge( v1, v2, edgeType[(i+1) % edgeType.length] )
		}
		
		if (newe && e) {
			newe.layout_pos_x = e.layout_pos_x
			newe.layout_pos_y = e.layout_pos_y
			this.graphChanged()
		}
		return newe
	},
	deleteAnyEdge : function( v1, v2 ){
		var edgeType = [ Graph.Edgetype.Directed,  Graph.Edgetype.Bidirected ]
		var i, et, any = false
		for( i = 0 ; i < edgeType.length ; i++ ){
			et = edgeType[i]
			any = any || this.getObservedGraph().deleteEdge( v1, v2, et )
			any = any || this.getObservedGraph().deleteEdge( v2, v1, et )
		}
		if( any ){ this.graphChanged() }
	},
	deleteVertex : function( v ){
		if( this.getGraph().getVertex(v) ){
			this.getObservedGraph().deleteVertex( v )
		}
	},
	renameVertex : function( vold, vnew ){
		if(  this.getGraph().getVertex(vold) &&
			!this.getGraph().getVertex(vnew) ){
			this.getObservedGraph().renameVertex( vold, vnew )
		}
	},
	newVertex : function( id, x, y ){
		this.getObservedGraph().addVertex( 
			new Graph.Vertex( { id : id, 
				layout_pos_x : x, 
				layout_pos_y : y } ) )
	},
	hasVertexProperty : function( _v, p ){
		var v = this.graph.getVertex(_v)
		if( v ){
			var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length) 
			return this.getGraph()["is"+pcamel](v)
		}
	},
	toggleVertexProperty : function( _v, p ){
		var v = this.graph.getVertex(_v)
		if( v ){
			if( this.hasVertexProperty( _v, p ) ){
				this.unsetVertexProperty( _v, p )
			} else {
				this.setVertexProperty( _v, p )
			}
		}
	},
	unsetVertexProperty : function( _v, p ){
		var v = this.graph.getVertex(_v)
		if( v ){
			var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length)
			this.getObservedGraph()["remove"+pcamel](v)
		}
	},
	setVertexProperty : function( _v, p ){
		var v = this.graph.getVertex(_v)
		if( v ){
			var pcamel = p.substring(0,1).toUpperCase()+p.substring(1,p.length) 
			// at the moment, just one property at a time
			_.each(["Source","Target","AdjustedNode","LatentNode"],function(pc){
				this.getGraph()["remove"+pc](v)
			},this)
			this.getObservedGraph()["add"+pcamel](v)
		}
	},
	unmarkVertex : function(){
		this.view.unmarkVertex()
	}
})

var DAGitty = {
	makeController : function( el, op ){
		for( var k of Object.keys( el.dataset ) ){
			if( !op.hasOwnProperty( k ) ){
				op[k] = JSON.parse(el.dataset[k])
			}
		}
		if( !("interactive" in op) ){
			op.interactive = true
		}
		if( !("mutable" in op) ){
			op.mutable = false
		}
		var c = new DAGittyController( op )
		this.controllers.push( c )
		if( el.id ){
			this.controllers_by_id[el.id] = c
		}
		return c
	},
	setup : function( op ){
		if( !op ){ op = {} }
		if( this.setupCalled && !op.force ){ return }
		this.controllers = []
		this.controllers_by_id = []
		var el, c
		if( op.el ){
			el = document.getElementById( op.el )
			if( el ){
				return makeController( el, op )
			}
		} else {
			var tags = op.tags || ["div", "pre"]
			for( var j = 0 ; j < tags.length ; j ++ ){
				var divs = document.getElementsByTagName( tags[j] )
				var re = new RegExp("\\bdagitty\\b")
				for( var i = 0 ; i < divs.length ; i ++ ){
					el = divs.item(i)
					if( re.test(el.className) ){
						// some styles are added automatically to the container
						// inside the constructor of the view (GraphGUI_View.js)
						op.canvas = el
						this.makeController( el, Object.assign({},op) )
					}
				}
			}
			this.setupCalled = true
		}
	},
	get : function( id ){
		return this.controllers_by_id[id]
	},
	resize : function(){
		for( var i = 0 ; i < DAGitty.controllers.length ; i ++ ){
			DAGitty.controllers[i].getView().resize()
		}
	},
	Math : {
		distance : function( x1, y1, x2, y2 ){
			return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))
		},
		anglerad : function( x1, y1, x2, y2 ){
			if( x1 < x2 ){
				return Math.asin((y2-y1)/this.distance(x1, y1, x2, y2))
			} else {
				return Math.PI - Math.asin((y2-y1)/this.distance(x1, y1, x2, y2))
			}
		},
		angle : function( x1, y1, x2, y2 ){
			return this.anglerad( x1, y1, x2, y2 )*360./(Math.PI * 2.)
		},
		ellipseAnchorPoint : function( cx, cy, rx, ry, tx, ty ){
			var tanth = (cy-ty)/(cx==tx ? 0.00001 : cx-tx)
			var x = rx * ry / Math.sqrt( ry * ry + rx * rx * tanth * tanth )
			if( tx > cx ){
				x = -x
			}
			var y = tanth * x
			return [cx-x, cy-y]
		},
		svgEdgeAnchor : function( el, reverse, edgetype ){
			var v = ["v1","v2"]
			if( reverse == 1 ){ 
				v = ["v2","v1"]
			}
			var svgpath = el[v[0]].dom.firstChild, svgpoint
			try{
				var svglength = svgpath.getTotalLength()
				var dx = (el.cx||el[v[1]].x)-el[v[0]].x,
					dy = (el.cy||el[v[1]].y)-el[v[0]].y
				var l = Math.sqrt( dx*dx+dy*dy )
				if( l < 0.01 ){ l = 0.01 }
				if( dy > 0 ){
					svgpoint = svgpath.getPointAtLength( 
						Math.acos( dx / l ) / 2. / Math.PI * svglength )
				} else {
					svgpoint = svgpath.getPointAtLength( 
						(1.-Math.acos( dx / l ) / 2. / Math.PI) * svglength )
				}
				var lp = Math.sqrt(svgpoint.x*svgpoint.x+svgpoint.y*svgpoint.y)
				var elongate = (lp+5) / lp
				if( edgetype == Graph.Edgetype.Undirected || 
					( edgetype == Graph.Edgetype.Directed && reverse == 0 ) ){
					elongate = 1
				}
				return [svgpoint.x*elongate+el[v[0]].x,
					svgpoint.y*elongate+el[v[0]].y]
			} catch( e ){
				return [0,0]
			}
		}
	},
	stylesheets : {
		"default" : {
			style : {
				node : {
					"d" : "M 0 0 m 20, 0 a 20,15 0 1,1 -40,0 a 20,15 0 1,1 40,0",
					fill: "#aaaaaa",
					stroke : "#666666"
				},
				exposurenode : { fill : "#bed403", stroke : "#000000" },
				outcomenode : { fill : "#00a2e0", stroke : "#000000" },
				adjustednode : { fill : "#ffffff", stroke : "#000000" },
				latentnode : { fill : "#eeeeee", stroke : "#cccccc" },
				confoundernode : { fill : "#ff7777", stroke : "#ff7777" },
				anexposurenode : { fill : "#bed403", stroke : "#bed403" },
				anoutcomenode : { fill : "#00a2e0", stroke : "#00a2e0" },
				nodelabel : { y: 35, "text-anchor" : "middle" },
				nodelabelbg : { fill: "#ffffff" },
				path : { stroke : "black", "stroke-width": 1.5, fill : "none" },
				causalpath : { stroke : "green" },
				biasingpath : { stroke : "red" }
			},
			decoration : {
				exposurenode : [ {d:"M-4,-6L7,0L-4,6Z", fill:"#000000"} ],
				outcomenode : [ {d:"M-2,-6L2,-6L2,6L-2,6Z", fill:"#000000"} ],
				directedpath : [ { "class" : "arrowfront", "d": "M-1,0L15,5L15,-5Z", fill : "white" } ],
				bidirectedpath : [
					{ "class" : "arrowfront", "d": "M-1,0L15,5L15,-5Z", fill : "white" },
					{ "class" : "arrowback", "d": "M-1,0L15,5L15,-5Z", fill : "white" }
				]
			}
		}
	}
}


/* globals DAGitty,Class,_ */
/* exported GraphGUI_SVG */

var svgns = "http://www.w3.org/2000/svg"

var GraphGUI_SVG = Class.extend({
	init : function( canvas_element, width, height, op ){
		var style = "default"
		if( op.style ){
			style = op.style
		}
		// create SVG root element
		var svg = document.createElementNS( svgns, "svg" ) // don't need to pass in 'true'
		svg.setAttribute( "width", width )
		svg.setAttribute( "height", height )
		svg.setAttribute( "style", "font-family: Arial, sans-serif" )
		canvas_element.appendChild( svg )
		this.container = canvas_element
		this.setStyle(style)
		this.svg = svg
		this.interactive = true
		if( op.interactive === false ){
			this.interactive = false
		}
		_.map( ["touchmove","mouseup","mousemove","mouseleave","click"],
			function(x){ svg.addEventListener( x, _.bind( this[x+"Handler"], this ) ) },
			this )
	},

	getStyle : function(){
		return this.style
	},
	setStyle : function( stylename ){
		if( DAGitty.stylesheets[stylename] ){
			this.style = DAGitty.stylesheets[stylename]
		} else {
			this.style = DAGitty.stylesheets["default"]
		}
	},
	clear : function(){
		while( this.svg.firstChild ) this.svg.removeChild( this.svg.firstChild )
		_.defer( _.bind( this.unmarkVertexShape, this ) )
	},
	/* SVG elements for edges and vertices need to be first "created", and then "anchored".
	 * This is because SVG supports no real Z index, so we need to first create the edge shapes
	 * and then the vertex shapes. However to know the edge anchor points, we need to know the 
	 * vertex positions first. To solve this, we first create the DOM elements for edges,
	 * then for vertices, and finally we set the attributes for edges that define their actual
	 * positions. 
	 *
	 * @parameter edge_type : a space-separated string containing edgetype information, e.g.
	 *                        "directed causal" or "bidirected biasing" or "undirected".
	 * @parameter el : parent DOM element to append newly created SVG elements to
	 * 
	 */
	createEdgeShape : function( edge_type, el ){
		var e = document.createElementNS( svgns, "path" ), i, j, f, pathclass
		
		el.dom = document.createElementNS( svgns, "g" )
		el.dom.setAttribute("class", "path")

		var sty = this.getStyle()
		var finalstyle = {}
		
		// create edge line
		var edge_types_a = [""].concat(edge_type.split(" "))
		for( i = 0 ; i < edge_types_a.length ; i ++ ){
			pathclass = edge_types_a[i]+"path"
			for( j in sty.style[pathclass] ){
				if( sty.style[pathclass].hasOwnProperty( j ) ){
					finalstyle[j] = sty.style[pathclass][j]
				}
			}
		}
		for( j in finalstyle ){
			e.setAttribute( j, finalstyle[j] )
		}
		el.dom.appendChild( e )

		// create arrowheads and perhaps other decorations
		for( i = 0 ; i < edge_types_a.length ; i ++ ){
			pathclass = edge_types_a[i]+"path"
			if( sty.decoration[pathclass] ){
				j=0
				while( sty.decoration[pathclass][j] ){
					e = document.createElementNS( svgns, "path" )
					for( f in finalstyle ){
						e.setAttribute( f, finalstyle[f] )
					}
					for( f in sty.decoration[pathclass][j] ){
						e.setAttribute( f, sty.decoration[pathclass][j][f] )
					}
					el.dom.appendChild( e )
					j++
				}
			}
		}
		if( this.interactive ){
			this.addEdgeEventListeners( el )
		}
		this.anchorEdgeShape( el )
		el.dom.style.cursor = "move"
	},
	addEdgeEventListeners : function( el ){
		el.dom.addEventListener( "touchstart",
			_.bind( function(e){ 
				this.touchEdgeShape( el, e.changedTouches[0] )
				e.preventDefault()
			}, this ) )

		el.dom.addEventListener( "touchend",
			_.bind( function(e){ 
				var v = this.getLastTouchedElement()
				if( v ){
					for( var i = 0 ; i < e.changedTouches.length ; i ++ ){
						if( e.changedTouches[i].identifier == v.last_touch ){
							this.stopMousemove()
						}
					}
				}
			}, this ) )

		el.dom.addEventListener( "mousedown",
			_.bind( function(e){ 
				this.touchEdgeShape( el, e ) 
			}, this ) )
		
		el.dom.addEventListener( "mouseover", _.bind(
			function(){ this.last_hovered_element={edge:el.e} }, this
		) )

		el.dom.addEventListener( "mouseout", _.bind(
			this.unsetLastHoveredElement, this ) )
	},
	anchorEdgeShape : function( el ){
		var anchorback = DAGitty.Math.svgEdgeAnchor( el, 0, el.directed )
		el.x1 = anchorback[0]; el.y1 = anchorback[1]
		
		var anchorfront = DAGitty.Math.svgEdgeAnchor( el, 1., el.directed )
		el.x2 = anchorfront[0]; el.y2 = anchorfront[1]
		
		if( el.cx ){
			// (el.cx, el.cy) are the anchor points of the quadratic spline for bent edges
			el.dom.firstChild.setAttribute( "d", "M"+el.x1.toFixed(2)+","+el.y1.toFixed(2)
				+"Q"+el.cx.toFixed(2)+","+el.cy.toFixed(2)
				+" "+el.x2.toFixed(2)+","+el.y2.toFixed(2) )
		} else {
			// otherwise we just draw a straight line
			el.dom.firstChild.setAttribute( "d", "M"+el.x1.toFixed(2)+","+el.y1.toFixed(2)
				+"L"+el.x2.toFixed(2)+","+el.y2.toFixed(2) )
		}
		
		// display front and/or back arrows
		var sx, sy, afront, aback
		
		for( var i = 0 ; i < el.dom.childNodes.length ; i ++ ){
			if( el.dom.childNodes.item(i).getAttribute("class") == "arrowfront" ){
				sx = el.cx||el.x1; sy = el.cy||el.y1
				afront = 360*Math.atan( (el.y2-sy)/(el.x2-sx) )/2/Math.PI
				if( sx<el.x2 ) afront += 180
				if( sx == el.x2 ) afront = el.y2 > sy ? -90 : 90
				el.dom.childNodes.item(i).setAttribute( "transform", "translate("+el.x2+","+el.y2+") rotate("+afront+")" )
			}
			if( el.dom.childNodes.item(i).getAttribute("class") == "arrowback" ){
				sx = el.cx||el.x2; sy = el.cy||el.y2
				aback = 360*Math.atan( (el.y1-sy)/(el.x1-sx) )/2/Math.PI
				if( sx<el.x1 ) aback += 180
				if( sx == el.x1 ) aback = el.y1 > sy ? -90 : 90
				el.dom.childNodes.item(i).setAttribute( "transform", "translate("+el.x1+","+el.y1+") rotate("+aback+")" )
			}
		}
	},
	createVertexShape : function( vertex_type, el ){
		var e = document.createElementNS( svgns, "path" ), f, i
		
		el.dom = document.createElementNS( svgns, "g" )
		e.setAttribute( "fill-opacity", 0.7 )
		e.setAttribute( "stroke-width", 2 )
		e.setAttribute( "z-index", 1 )

		var sty = this.getStyle()
		
		// First set default node style, then apply more specific settings
		var iobj = { "" : 0 }; iobj[vertex_type] = 0
		for( var vtype in iobj ){
			for( f in sty.style[vtype+"node"] ){
				if( f == "d" && sty.style[vtype+"node"][f].indexOf("[") !== -1 ){
					el.pathtemplate = sty.style[vtype+"node"][f]
				} else {
					e.setAttribute( f, sty.style[vtype+"node"][f] )
				}
			}
		}
		el.dom.appendChild( e )
		
		var rect = document.createElementNS( svgns, "rect" )
		rect.setAttribute("class", "textbg" )
		// First set default node style
		for( f in sty.style["nodelabelbg"] ){
			rect.setAttribute( f, sty.style["nodelabelbg"][f] )
		}
		// Then apply more specific settings
		for( f in sty.style[vertex_type+"nodelabelbg"] ){
			rect.setAttribute( f, sty.style[vertex_type+"nodelabelbg"][f])
		}
		el.dom.appendChild( rect )
		
		var elabel = document.createElementNS( svgns, "text" )
		// First set default node style
		elabel.setAttribute("class","nodelabel")
		for( f in sty.style["nodelabel"] ){
			elabel.setAttribute( f, sty.style["nodelabel"][f] )
		}
		// Then apply more specific settings
		for( f in sty.style[vertex_type+"nodelabel"] ){
			elabel.setAttribute( f, sty.style[vertex_type+"nodelabel"][f])
		}
		elabel.appendChild( document.createTextNode(el.id, true) )
		el.dom.appendChild( elabel )
		
		if( sty.decoration[vertex_type+"node"] ){
			i=0
			while(  sty.decoration[vertex_type+"node"][i] ){
				e = document.createElementNS( svgns, "path" )
				for( f in sty.decoration[vertex_type+"node"][i] ){
					e.setAttribute( f, sty.decoration[vertex_type+"node"][i][f] )
				}
				el.dom.appendChild( e )
				i++
			}
		}
		
		el.dom.style.cursor = "move"
		el.dom.style.touchAction = "none"

		if( this.interactive ){
			this.addVertexEventListeners( el )
		}
		this.moveVertexShape( el )
	},
	addVertexEventListeners : function( el ){
		el.dom.addEventListener( "touchstart",
			_.bind( function(e){ 
				this.touchVertexShape( el, e.changedTouches[0] )
				e.preventDefault()
			}, this ) )

		el.dom.addEventListener( "touchend",
			_.bind( function(e){ 
				var v = this.getLastTouchedElement()
				if( v ){
					for( var i = 0 ; i < e.changedTouches.length ; i ++ ){
						if( e.changedTouches[i].identifier == v.last_touch ){
							this.stopMousemove()
						}
					}
				}
			}, this ) )

		el.dom.addEventListener( "mousedown",
			_.bind( function(e){ 
				this.touchVertexShape( el, e )
			}, this ) )

		el.dom.addEventListener( "mouseover", _.bind(
			function(){ this.last_hovered_element={vertex:el.v} }, this
		) )

		el.dom.addEventListener( "mouseout", _.bind(
			this.unsetLastHoveredElement, this
		) )
	},
	touchVertexShape : function( el, e ){
		this.last_touched_element = {"vertex" : el, "last_touch" : e.identifier}
		this.start_x = this.pointerX(e)-this.getContainer().offsetLeft
		this.start_y = this.pointerY(e)-this.getContainer().offsetTop
		var pel = this.getMarkedVertexShape()
		if( pel ){
			this.unmarkVertexShape()
			if( pel != el ){
				this.callEventListener( "vertex_connect", [pel.v, el.v] )
			} else {
				this.cancel_next_click = true 
			}
		} else{
			this.cancel_next_click = true 
			this.markVertexShape( el )
		}
	},
	touchEdgeShape : function( el, e ){
		this.last_touched_element = {"edge" : el, "last_touch" : e.identifier}
		this.start_x = this.pointerX(e)-this.getContainer().offsetLeft
		this.start_y = this.pointerY(e)-this.getContainer().offsetTop
		this.cancel_next_click = true
		this.unmarkVertexShape()
	},
	markVertexShape : function( el ){
		el.previous_stroke  = el.dom.firstChild.getAttribute( "stroke",
			this.getStyle().style.node.stroke )
		el.previous_stroke_width  = el.dom.firstChild.getAttribute( "stroke-width",
			this.getStyle().style.node["stroke-width"] )
		el.dom.firstChild.setAttribute( "stroke-width", 3*el.previous_stroke_width )
		if( !el.previous_stroke ){
			el.dom.firstChild.setAttribute( "stroke", "black" )
		}
		this.marked_vertex_shape = el
		this.callEventListener( "vertex_marked", [el.v] )
	},
	unmarkVertexShape : function( el ){
		if( !el ) el = this.marked_vertex_shape
		if( el && el.dom ){
			el.dom.firstChild.setAttribute( "stroke", el.previous_stroke )
			el.dom.firstChild.setAttribute( "stroke-width", el.previous_stroke_width )
		}
		delete this.marked_vertex_shape	
		this.callEventListener( "vertex_marked", [void(0)] )	
	},
	unsetLastHoveredElement : function(){
		delete this.last_hovered_element
	},
	getLastTouchedElement : function(){
		return this.last_touched_element
	},
	getMarkedVertex : function(){
		if( "marked_vertex_shape" in this ){
			return this.marked_vertex_shape.v
		} else {
			return void(0)
		}
	},
	getMarkedVertexShape : function(){
		if( "marked_vertex_shape" in this ){
			return this.marked_vertex_shape
		} else {
			return void(0)
		}
	},
	getLastHoveredElement : function(){
		return this.last_hovered_element
	},
	moveVertexShape : function( el ){
		el.dom.setAttribute( "transform", "translate("+el.x+","+el.y+")" )
	},
	prependShapes : function( shape_array ){
		var frag = document.createDocumentFragment( true )
		for( var i = 0 ; i < shape_array.length ; i ++ ){
			frag.appendChild( shape_array[i].dom )
		}
		if( this.svg.hasChildNodes() ){
			this.svg.insertBefore( frag, this.svg.firstChild )
		} else {
			this.svg.appendChild( frag )
		}
	},
	appendShapes : function( shape_array ){
		var frag = document.createDocumentFragment( true )
		for( var i = 0 ; i < shape_array.length ; i ++ ){
			frag.appendChild( shape_array[i].dom )
		}
		this.svg.appendChild( frag )
	},
	appendTextBackgrounds : function( shape_array ){
		var bb, min_w, w, h
		for( var i = 0 ; i < shape_array.length ; i ++ ){
			var texts = shape_array[i].dom.getElementsByTagNameNS( svgns, "text" )
			// tune node size to bounding box of inner text
			if( shape_array[i].pathtemplate ){
				bb = texts.item(0).getBBox()
				w = bb.width + 15
				h = bb.height + 15
				min_w = 40.
				shape_array[i].pathtemplate = shape_array[i].pathtemplate.
						replace( /\[dx\]/g, Math.max( min_w, w ) ).
						replace( /\[rx\]/g, Math.max( min_w, w )/2 ).
						replace( /\[dy\]/g, h ).
						replace( /\[ry\]/g, h/2 )
				shape_array[i].dom.firstChild.setAttribute("d", shape_array[i].pathtemplate )
				delete shape_array[i]["pathtemplate"]
			}
			for( var j = 0 ; j < texts.length ; j ++ ){
				var prevsib = texts.item(j).previousSibling
				if( prevsib && prevsib.getAttribute("class") == "textbg" ){
					bb = texts.item(j).getBBox()
					prevsib.setAttribute("width", bb.width )
					prevsib.setAttribute("height", bb.height )
					prevsib.setAttribute("x", bb.x)
					prevsib.setAttribute("y", bb.y)
				}
			}
		}
	},
	removeShapes : function( els ){
		for( var i = 0 ; i < els.length ; i ++ ){
			this.removeShape( els[i] )
		}
	},
	removeShape : function( el ){
		//el.dom.style.display="none";
		this.svg.removeChild( el.dom )
	},
	suspendRedraw : function(){
		// this is deprecated in SVG2, so we do nothing
		// this.unsuspend_id = this.svg.suspendRedraw( time );
	},
	unsuspendRedraw : function(){
		// this is deprecated in SVG2
		// this.svg.unsuspendRedraw( this.unsuspend_id );
	},


	callEventListener : function( event_name, args ){
		var en = event_name+"_listener"
		if( typeof this[en] == "function" ){
			this[en].apply( this, args )
		}
	},


	setEventListener : function( event_name, f ){
		this[event_name+"_listener"] = f
	},



	clickHandler : function( e ){
		if( "cancel_next_click" in this ){
			delete this.cancel_next_click
			e.preventDefault()
			e.stopPropagation()
			return
		}
		if( this.getMarkedVertex() ){
			this.unmarkVertexShape()
			e.preventDefault()
			e.stopPropagation()
			return
		}
	},

	touchmoveHandler : function( e ){
		var i
		var v = this.getLastTouchedElement()
		if( v ){
			for( i=0 ; i < e.changedTouches.length ; i ++ ){
				if( e.changedTouches[i].identifier == 
					v.last_touch ){
					this.mousemoveHandler( e.changedTouches[i] ); 
					e.preventDefault()
					return
				}
			}
		}
	},


	mousemoveHandler : function( e ){
		var v	
		if( !( "start_x" in this ) ){ 
			return
		}
		v =  this.getLastTouchedElement()
		if( !v ){ 
			return
		}

		var ptr_x = this.pointerX(e)-this.getContainer().offsetLeft
		var ptr_y = this.pointerY(e)-this.getContainer().offsetTop
		
		if(Math.abs(this.start_x - ptr_x) + 
			Math.abs(this.start_y - ptr_y) > 30 ){
			this.dragging = true
		}

		if( this.dragging ){
			if( v.vertex ){
				v = v.vertex
				v.x = ptr_x
				v.y = ptr_y
				this.moveVertexShape(v)
				_.each(v.adjacent_edges,function(es){
					this.anchorEdgeShape( es )
				},this)
				if( typeof this.vertex_drag_listener == "function" ){
					this.vertex_drag_listener( v )
				}
			} else if ( v.edge ){
				v = v.edge
				v.cx = ptr_x
				v.cy = ptr_y
				if( typeof this.edge_drag_listener == "function" ){
					this.edge_drag_listener( v )
				}
				this.anchorEdgeShape( v )
			}
		}
	},

	stopMousemove : function(){
		if( this.dragging ){
			if( typeof this.drag_end_listener == "function" ){
				this.drag_end_listener()
				this.unmarkVertexShape()
			}
		}
		delete this.dragging
		delete this.last_touched_element
		delete this.start_x
		delete this.start_y
	},

	mouseupHandler : function(){
		this.stopMousemove()
	},

	mouseleaveHandler : function(){
		this.stopMousemove()
	},

	getController : function(){
		return this.controller
	},

	getContainer : function(){
		return this.container
	},

	resize : function( w, h ){
		var svg = this.svg
		svg.style.width = w+"px"
		svg.style.height = h+"px"
		svg.setAttribute("width", w)
		svg.setAttribute("height", w)
	},


	pointerX : function(e) {
		var docElement = document.documentElement,
			body = document.body || { scrollLeft: 0 }

		return e.pageX || (e.clientX +
			(docElement.scrollLeft || body.scrollLeft) -
			(docElement.clientLeft || 0))
	},

	pointerY : function(e) {
		var docElement = document.documentElement,
			body = document.body || { scrollTop: 0 }

		return  e.pageY || (e.clientY +
			(docElement.scrollTop || body.scrollTop) -
			(docElement.clientTop || 0))
	}
})
