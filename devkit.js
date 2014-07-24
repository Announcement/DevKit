function Animate(a){
	var b = a.seconds,
		g = a.maximum,
		h = a.drawing,
		i = a.exhaust,
		c = new Date();
	function Render(){
		var d = new Date(),
			e = (d - c) / (b * 1000),
			f = Math.max(0, Math.min(g, g - g * e));
		h(f);
		if (d - c < 1000 * b) requestAnimationFrame(Render);
		else i();
	}
	requestAnimationFrame(Render);
}

/* fucking tiny animation framework. */ 
function Values(object){
	return Object.keys(object).map(function(v, k){
		return object[k];
	});
}
var Is = {
	'empty': function(v){
		return !v;
	}
}
function Construct(a){
    return function () {
		this.vars = {
			arraysn :[],
			object:{},
			number:0,
			string:""
		};
		var result = a.apply(this, arguments);
		var var_ = Values(this.vars).filter(Is.empty)[0];
		delete this.vars;
		return this.result || var_ || this || result || !1;
    }
}
var range = Construct(function(n) {
	for(var tmp=[];tmp[--n]=n;this.result=tmp);
});
var Keep = Function.prototype.call.bind(Array.prototype.slice);
Array.prototype.add = Construct(function(){
	this.push(arguments[0]);
});
Array.prototype.matrix = function(a) {
	var b=[], c=this; 
	if (!a) a = c;
	c.forEach(function(d){b=b.concat(a.before(d));});
	return b;
};
Array.prototype.after = function(a) {
	return this.map(function(v){return v + a;});
};
Array.prototype.before = function(a){
	return this.map(function(v){return a + v;});
};
Array.prototype.backwards = function(){
	return this.map(function(v){return v.reverse();});
};
Array.prototype.median = function(){
	return this[this.length/2|0];
};
Array.prototype.average = function(){
	var num = 0;
	this.forEach(function(v,k){num+=v;});
	return num/this.length;
};
Array.prototype.sum = function(){
	var num = 0;
	this.forEach(function(v,k){num+=v;});
	return num;
};
Object.defineProperties(Array.prototype, {	
'-1': {
	get: function() { 
		return this.slice(-1)[0];
	},	
	set: function(v){ 
		if(this.length>0)this[this.length-1]=v; 
	},	
	enumerable: false
},
'max': {
	get: function() { 
		return this.sort(function(a,b){return a<b;})[0];
	},	
	set: function(v){
		this[this.indexOf(this.sort(function(a,b){return a<b;})[0])] = v;
	},	
	enumerable: false
},
'min': {
	get: function() { 
		return this.sort(function(a,b){return a>b;})[0];
	},	
	set: function(v){ 
		this[this.indexOf(this.sort(function(a,b){return a>b;})[0])] = v;
	},	
	enumerable: false
},
'matrix': 
	{ enumerable: false },
'median': 
	{ enumerable: false },
'average': 
	{ enumerable: false },
'before': 
	{ enumerable: false },
'backwards': 
	{ enumerable: false },
'add': 
	{ enumerable: false },
'sum': 
	{ enumerable: false },
'after': 
	{ enumerable: false }
});
function Characters(){
	var set = [];
	for (var i = 0; i < 0xFF; i++){
		set.push(String.fromCharCode(i));
	}
	var Keys = {
		'A': 65,
		'Z': 65+26,
		'a': 97,
		'z': 97+26,
		'0': 48,
		'9': 48+10,
	}
	var Letter_Origin = 96;
	var Letter_Offset = 32;
	var Letter_Streak = 26;
	var Number_Origin = 48-1;
	var Number_Streak = 10;
	function Range(a, b){
		return [a + 1, a + b];
	}
	function Gather(a, b){
		return set.slice(a + 1, a + b + 1);
	}
	function Scan(a){
		a = (a||[0, 0xFF]).sort(function(q, r){return q > r});
		var c = [];
		while (a.length>1){
			c = c.concat(set.slice(a.shift(), a.shift()));
		}
		return c;
	}
	var Lookup = {
		'ALPHA': [Keys.A,Keys.Z],
		'alpha': [Keys.a,Keys.z],
		'Alpha': [Keys.A,Keys.Z,Keys.a,Keys.z],
		'numeric': [Keys[0],Keys[9]],
		'_': [95, 96],
		'*': [0,0xFF]
	};
	function Search(str){
		var b = [];
		while (str.length>0){
			Object.keys(Lookup).some(function(v){
				if (str.indexOf(v) === 0){
					b = b.concat(Lookup[v]);
					str = str.substring(v.length);
					return true;
				}
				return false;
			}) || (str="");
		}
		console.log(b);
		return Scan(b);
	}
	return Search(arguments[0]||'*');
}
String.prototype.lines = function(){
	return this.match(/^.+$/mg);
};
String.prototype.repeat = function(n){
	return (new Array(n+1)).join(this);
};
String.prototype.reverse = function(){
	return this.split("").reverse().join("");
}
Object.defineProperties(String.prototype, {
	"lines":{enumerable: false},
	"reverse":{enumerable: false},
	"repeat":{enumerable:false}
});
Number.prototype.min = function(n){
	return Math.min(this,n);
};
Number.prototype.max = function(n){
	return Math.max(this,n);
};
Number.prototype.more = function(n){
	return this > n;
};
Number.prototype.less = function(n){
	return this < n;
};
Number.prototype.eqls = function(n){
	var c;
	if (typeof n === "string"){
		if (n.matches(/[01]+/)) c = ParseInt(n,2);
		if (n.matches(/0x[0-9a-f]+/)) c = parseInt(n,16);
		if (n.indexOf("0")===0) c = parseInt(n,8);
		else c = parseInt(n, 10);
	} else if (typeof n === "object") {
		if (n instanceof Array) c = n.length;
		else if (n instanceof Element) c = n.childElementCount;
		else c = Object.keys(n).length;
	} else if (typeof n === "number") {
		c = n;
	} else if (typeof n === "boolean") {
		c = n * 1;
	} else {
		return false;
	}

	return this < n;
};
Object.defineProperties(Number.prototype, {
	"min":{enumerable: false},
	"max":{enumerable: false},
	"more":{enumerable:false},
	"eqls":{enumerable:false},
	"less":{enumerable:false}
});

	/*	'use strict';
		var arr = [];
		function fromArgs(a){
			arr.concat(Array.prototype.slice.call(arguments[0], 0));
			return arr;
		}
		function fromLoop(n){
			for(var tmp=[];tmp[--n]=n;);
			arr.concat(tmp);
			return arr;
		}
		function from(a){
			console.log(typeof a);
		}
		Object.defineProperty(arr.prototype, "from", {enumerable:false})
		arr.fromArgs = fromArgs;
		arr.fromLoop = fromLoop;
		return arr;
	}*/

function Color(){
	function p16(a){return parseInt(a,16);}
	function rgb(r, g, b){
		return {'r':r,'g':g,'b':b};
	}
	function rgba(r, g, b, a){
		return {'r':r,'g':g,'b':b,'a':a};
	}
	function rgbF(r,g,b){
		return rgb(Math.floor(r),Math.floor(g),Math.floor(b));
	}
	function rgbR(r,g,b){
		return rgb(Math.round(r),Math.round(g),Math.round(b));
	}
	function toHex(r, g, b){
		 return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}
	function fromHex(hex){
		var rx1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
		var rx2 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		var res = rx1.exec(hex.replace(rx2,function(m,r,g,b){return r+r+g+g+b+b;}));
		return res && rgb(p16(res[1]),p16(res[2]),p16(res[3]));
	}
	function fromCMYK_GNU(c, m, y, k){
		c *= 255, m *= 255, y *= 255, k *= 255;
		var a = 255 - k,
			r = a * (255 - c) / 255,
			g = a * (255 - m) / 255,
			b = a * (255 - y) / 255;
		return rgb(r, g, b);
	}
	function fromCMYK_APS(c, m, y, k){ //Bad alg
		c *= 255, m *= 255, y *= 255, k *= 255;
		c = Math.min(255, c + k),
		m = Math.min(255, m + k),
		y = Math.min(255, y + k);
		return rgb(255 - c, 255 - m, 255 - y);
	}
	function toCMYK(r,g,b){
		if (!(r||g||b)){
			return {
				'c': 0, 
				'm': 0, 
				'y': 0, 
				'k': 1
			};
		} 
		var c = 1 - (r / 255),
			m = 1 - (g / 255),
			y = 1 - (b / 255),
			k = 0,
			min = ([c,m,y]).min;
		c = (c - min) / (1 - min);
		m = (m - min) / (1 - min);
		y = (y - min) / (1 - min);
		k = min;
		return {'c': c, 'm': m, 'y': y, 'k': k};
	}
	function toHSV(r, g, b) {
		var h = 0,
			r = 0,
			v = 0;
		r = r / 255;
		g = g / 255;
		b = b / 255;
		var min = ([r, g, b]).min,
			max = ([r, g, b]).max;
		if (min == max) return {'h': 0, 's': 0, 'v': min};
		var d = r == min && g - b || b == min && r - g || b - r,
			h = r == min && 3 || b == min && 1 || 5;
		h = 60 * (h - d / max - min);
		s = (max - min) / max;
		v = max;
		return {'h': h, 's': s, 'v': v};
	}
	function fromHSV(h, s, v){
		var i = Math.floor(h * 6),
			f = h * 6 - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s);
		return ([
			rgbF(v * 255, t * 255, p * 255),
			rgbF(q * 255, v * 255, p * 255),
			rgbF(p * 255, v * 255, t * 255),
			rgbF(p * 255, q * 255, v * 255),
			rgbF(t * 255, p * 255, v * 255),
			rgbF(v * 255, p * 255, q * 255),
		])[i%6];
	}
	function fromHSL(h, s, l){
		var r, g, b;

		if(!s) r = g = b = l; 
		else{
		function hue2rgb(p, q, t){
			if(t<0)
				t += 1;

			if(t>1)
				t -= 1;

			if(t<1/6) 
				return p + (q - p) * 6 * t;

			if(t<1/2) 
				return q;

			if(t<2/3) 
				return p + (q - p) * (2/3 - t) * 6;

			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
		}
		return rgbR(r * 255, g * 255, b * 255);
	}
	function toHSL(r, g, b){
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		var h, s, l = (max + min)/2;
		if (max==min) h=s=0;
		else {
			var d = max - min;
			s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break; 
			}
			h /= 6;
		}
		return {'h': h, 's': s, 'l': l};
	}
	function as(a){
		return {
			'hsv': toHSV(a.r, a.g, a.b),
			'hsl': toHSL(a.r, a.g, a.b),
			'hex': toHex(a.r, a.g, a.b),
			'rgb': a,
			'cmyk': toCMYK(a.r, a.g, a.b)
		};
	}
	return {
		'rgba': rgba,
		'invert': function(a){
			if (!a.hasOwnProperty('rgb')){
				return false;
			}
			var r = 255 - a.rgb.r,
				g = 255 - a.rgb.g,
				b = 255 - a.rgb.b;
			var res = rgb(r, g, b);
			return as(res);
		},
		'sepia': function(a){
			if (!a.hasOwnProperty('rgb')){
				return false;
			}
			var or = a.rgb.r, og = a.rgb.g, ob = a.rgb.b;
			var r = (or * 0.393 + og * 0.769 + ob * 0.189),
				g = (or * 0.349 + og * 0.686 + ob * 0.168),
				b = (or * 0.272 + og * 0.534 + ob * 0.131);
			var res = rgb(r, g, b);
			return as(res);
		},
		'desaturate': function(a){
			if (!a.hasOwnProperty('rgb')){
				return false;
			}
			//.3 .59 .11
			var r = a.rgb.r, g = a.rgb.g, b = a.rgb.b;
			var a = r * 0.3 + g * 0.59 + b * 0.11; 
			var res = rgb(a, a, a);
			return as(res);
		},
		'rgb': function(r,g,b){
			if (typeof arguments[0] === "object") {
				g = r.g;
				b = r.b;
				r = r.r;
			}
			var res = rgb(r, g, b);
			return as(res);
		},
		'hsv': function(h,s,v){
			if (typeof arguments[0] === "object") {
				s = h.s;
				v = h.v;
				h = h.h;
			}
			var res = fromHSV(h,s,v);
			return as(res);
		},
		'hsl': function(h,s,l){
			if (typeof arguments[0] === "object") {
				s = h.s;
				l = h.l;
				h = h.h;
			}
			var res = fromHSL(h,s,l);
			return as(res);
		},
		'hex': function(str){
			var res = fromHex(str);
			return as(res);
		},
		'cmyk': function(c,m,y,k){
			if (typeof arguments[0] === "object") {
				m = c.m;
				y = c.y;
				k = c.k;
				c = c.c;
			}
			var res = fromCMYK_GNU(c, m, y, k);
			return as(res);
		}
	}
}
function Color_x86(word){
	function Wash(){

	}
}
function AJAX(url){
	var req;
	if (window.XMLHttpRequest) 
		req = new XMLHttpRequest();
	else if(window.ActiveXObject) {
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch (e) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP");
			} 
			catch (e) {}
		}
	}
	if (!req) return false;
	function finish(){
		return (req.readyState===4&&req.status===200)?req.responseText:!1;
	}
	function request(o){
		var arr = [];
		for (var k in o){
			if (o.hasOwnProperty(k)){
				var v = o[k];
				arr.push(encodeURIComponent(k)+"="+encodeURIComponent(v));
			}
		}
		return arr.join("&");
	}
	function get(data){
		if (data) data = "?" + data;
		req.open('GET', url + data, false);
		req.withCredentials = "true";
		req.send(null);
		return finish();
	}
	function cors(data) {
		if (data) data = "?" + data;
		req.open('GET', url + data, false);
		//req.withCredentials = "true";
		req.setRequestHeader("Content-Type","text/plain");
	    req.setRequestHeader("X-Requested-With","XMLHttpRequest");
	    req.setRequestHeader("Accept","application/json");
		req.send(null);
		return finish();
	}
	function post(data){
		req.open('POST',url,false);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		if (typeof data==="object")
			req.send(request(data));
		else
			req.send(data);
		return finish();
	}
	return {'get' : get, 'post' : post, 'request': request, 'cors': cors};
}
function cors(){
var getXHR=function()
{
    try{return new XMLHttpRequest();}   catch(e){}
    try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}    catch(e){}
    try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}    catch(e){}
    try{return new ActiveXObject("Microsoft.XMLHttp");}     catch(e){}
    console.err("Could not find XMLHttpRequest");
};
var makeRequest=function(uri,data)
{
    //make the actual XMLHttpRequest
    var xhr=getXHR();
    if('withCredentials' in xhr)    console.log("Using XMLHttpRequest2 to make AJAX requests");
    xhr.open("POST",uri,true);
    xhr.onreadystatechange=function(){
        if(xhr.readyState===4)
        {
            if(xhr.status===200 || xhr.status===304)
            {
                var response=JSON.parse(xhr.responseText);
                if(response.status==="ok")  console.log("You just posted some valid geoJSON");
                else if(response.status==="error")  console.log("There was a problem with your geoJSON "+response.message); 
                else    console.log("Response has been recieved using "+response.status);
            }
        }
        else    console.log("Response recieved with status "+xhr.status);
    };
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
    //supported in new browsers...do JSONP based stuff in older browsers...figure out how
    xhr.setRequestHeader("Access-Control-Allow-Origin","http://geojsonlint.com/");
    xhr.setRequestHeader("Accept","application/json");
    xhr.send(JSON.stringify(data));
};
}
var docCookies = {
	getItem: function (sKey) {
		return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	},
	setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
		var sExpires = "";
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
				break;
				case String:
					sExpires = "; expires=" + vEnd;
				break;
				case Date:
					sExpires = "; expires=" + vEnd.toUTCString();
				break;
			}
		}
		document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		return true;
	},
	removeItem: function (sKey, sPath, sDomain) {
		if (!sKey || !this.hasItem(sKey)) { return false; }
		document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
		return true;
	},
	hasItem: function (sKey) {
		return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	},
	keys: /* optional method: you can safely remove it! */ function () {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
		return aKeys;
	}
};
/* 
docCookies.	setItem(name, value[, end[, path[, domain[, secure]]]])
			getItem(name)
			removeItem(name[, path], domain)
			hasItem(name)
			keys()
 */
