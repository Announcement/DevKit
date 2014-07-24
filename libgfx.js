function Accelerator(ctx){
	var width = ctx.canvas.width, height = ctx.canvas.height,
		meta = ctx.getImageData(0, 0, width, height),
		buf = new ArrayBuffer(meta.data.length),
		buf8 = new Uint8ClampedArray(buf),
		data = new Uint32Array(buf);
	console.log(width,height);
	data[1] = 0x0a0b0c0d;
	var isLittleEndian = true;
	function find(x, y){
		return y * width + x;
	}
	function look(index){
		var y = Math.floor(index / width),
			x = index - y * width;
		return {'x': x, 'y': y};
	}
	function get(index){
		index = index * 4;
		var	r = meta.data[index+0];
			g = meta.data[index+1];
			b = meta.data[index+2];
			a = meta.data[index+3];
		return Color().rgba(r, g, b, a);
	}
	function put(index, color) {
		var pixel;
		if (isLittleEndian){
			pixel = 
				(color.a << 24) |
				(color.b << 16) |
				(color.g <<  8) |
				(color.r);
		} else {
			pixel = 
				(color.r << 24) |
				(color.g << 16) |
				(color.b <<  8) |
				(color.a);
		}
		data[index] = pixel;
		return pixel;
	}
	if (buf[4] === 0x0a && buf[5] === 0x0b && buf[6] === 0x0c &&
		buf[7] === 0x0d) {
		isLittleEndian = false;
	}
	function WORD(z) {
		var y0 = (z >> 24) & 0xFF,
			y1 = (z >> 16) & 0xFF,
			y2 = (z >>  8) & 0xFF,
			y3 = (z      ) & 0xFF;

		return ( isLittleEndian ) ? 
			Color().rgba(y3, y2, y1, y0)
			:
			Color().rgba(y0, y1, y2, y3)
			;
	}
	function ask(a) {
		return WORD(data[a]);
	}
	for (var y = 0; y < height; ++y) {
		for (var x = 0; x < width; ++x) {
			var index = find(x, y),
				pixel = get(index);
			put(index, pixel);
		}
	}
	var filterData = [];
	var dictionary = {
		"saturation": "hsl",
		"brightness": "hsl",
		"contrast": "rgb",
		"controller": "rgb",
		"blur-median": "blur",
		"blur-average": "blur"
	};
	function queue(name, value) {
		if (Object.keys(dictionary).indexOf(name)!==-1) {
			filterData.push([name, value]);
		}
	}
	function mod(r, g, b, a) {
		var Saturation = 1/2,
			Brightness = 50,
			Controller = 'sepia';
			ContrastMx = 1.5;
		var color = (new Color()).rgb(r, g, b),
			hsl = color.hsl;
			done = (new Color()).hsl(hsl.h, (hsl.s*Saturation).min(255), hsl.l).rgb;
		r=done.r;g=done.g;b=done.b; 
		r=(r-128+Brightness)*ContrastMx+128;
		g=(g-128+Brightness)*ContrastMx+128;
		b=(b-128+Brightness)*ContrastMx+128;
		r=r.min(255).max(0);g=g.min(255).max(0);b=b.min(255).max(0);
		//done = color.rgb;
		if(Controller=='sepia')
			done = Color().desaturate(Color().rgb(r,g,b)).rgb;
		r=done.r;g=done.g;b=done.b; 
		return Color().rgba(r, g, b, a);
	}
	function filter(){
		var inf = {"hsl":[],"rgb":[],"blur":[]}, i;
		var ix = {
			"bright": 0,
			"satura": 1,
			"contro": 'normal',
			"contra": 1
		};
		i = filterData.length;
		while(i--) {
			var index = filterData[i][0],
				value = filterData[i][1];
			ix[index.toLowerCase().substring(0,6)] = value;
		}
		var hsl = inf.hsl.length>0;
		i = data.length;
		while (i--) {
			var pixel = ask(i),
				r = pixel.r,
				g = pixel.g,
				b = pixel.b,
				a = pixel.a;
			if (r > 100 && b > 100 && g > 100){
				a = 0;
			}
			if (hsl) {
				var xHSL = (new Color()).rgb(r,g,b).hsl,
					done = (new Color()).hsl(xHSL.h, (xHSL.s*ix.satura).min(255), hsl.l).rgb;
				r = (done.r - 128 + ix.bright) * ix.contra;
				g = (done.g - 128 + ix.bright) * ix.contra;
				b = (done.b - 128 + ix.bright) * ix.contra;
				switch(ix.contro){
					case("sepia"): done = Color().sepia(done).rgb; break;
					case("invert"): done = Color().invert(done).rgb; break;
					case("desaturate"): done = Color().desaturate(done).rgb; break;
					default: break;
				}
				r = done.r; g = done.g; b = done.b;
			}
			put(i, Color().rgba(r.min(255).max(0),g.min(255).max(0),b.min(255).max(0),a));
		}
		console.log("Filtered");
		meta.data.set(buf8);
		ctx.putImageData(meta, 0, 0);
	}
	this.queue = queue;
	this.filter = filter;
	return this;
}
var img = new Image();


document.body.appendChild(img);

var gfx = new Graphics(img);

gfx.mode = "image";
gfx.brightness = 50;
gfx.saturation = 1/2;
gfx.controller = 'invert';
gfx.contrast   = 1.5;
gfx.median = 1;
gfx.average = 1;

gfx.render();

img.src = "/meta/glytch.jpg";

function Graphics(source) {
	var data = {
		brightness: 0,
		saturation: 1,
		controller: 'normal',
		contrast: 1,
		median: 0,
		average: 0,
		mode: "image"
	};
	function render() {
		var cvs = document.createElement("canvas"),
			ctx = cvs.getContext("2d"),
			mode = data.mode.toLowerCase(),
			processor;
		function initiate() {
			if (mode == "image") {
				source.onload = function() {
					cvs.width = source.width;
					cvs.height = source.height;
					ctx.drawImage(source, 0, 0);
					processor = new Accelerator(ctx);
					complete();
				}
			}
		}
		function complete() {
			if (mode=="image"){
				processor.queue("contrast", data.contrast);
				processor.queue("saturation", data.saturation);
				processor.queue("brightness", data.brightness);
				processor.queue("controller", data.controller);
				processor.queue("blur-median", data.median);
				processor.queue("blur-average", data.average);
				processor.filter();
				var src = cvs.toDataURL("image/png");
				source.src = src;
				source.onload = function(){console.log("Graphics Processing Complete");};
			}
		}
		initiate();
	}
	data.render = render;
	return data;
}
