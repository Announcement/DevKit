function note(n){return Math.pow(2,n/12)*440;}
function guess(a,b){var c=Math.pow(10, b);return Math.round(a*c)/c;}
var notes = ['A', '', 'B', 'C', '', 'D', '', 'E', 'F', '', 'G', ''];
var notedb = [];
function regNote(note, octave, frequency){
	notedb.push({'note':note,'octave':octave,'frequency':frequency});
}
var $own = Object.hasOwnProperty;
function noteFind(o){
	var note = o.note;
	var octa = o.octave;
	var freq = o.frequency;
	var list = notedb.filter(function(v){
		if (typeof note === "string" && note!=v.note) return false;
		if (typeof octa === "number" && octa!=v.octave) return false; 
		if (typeof freq === "number" && freq!=v.frequency) return false;
		return true;
	});
	return list;
}
Array.prototype.rotate=function(){
	this.push(this.shift());
	return this[0];
};
Object.defineProperty(Array.prototype,'rotate',{enumerable:false});
(function book(){
	var a = -4;
	console.log(notes[0]);
	while (a<=5){
		var b = notes[0];
		var offset = a*12-notes.indexOf('A')-1;
		if (!b){
			regNote(notes[-1]+"#",a+3,guess(note(offset),2));
			regNote(notes[1]+"b",a+3,guess(note(offset),2));
		}else{
			regNote(b,a+3,guess(note(offset),2));
		}
		notes.rotate();
		if (b=='C') a++;
	}
})();
console.log(noteFind({'note': 'A'}));
var audio = new window.webkitAudioContext(),
		position = 0,
		scale = {
				g: 392,
				f: 349.23,
				e: 329.63,
				b: 493.88
		},
		song = "G4,4 fefG4,4 G4,4 -fff-G4,4 bb-G4,4 fefG4,4 G4,4 G4,4 G4,4 ffG4,4 fe---";

//setInterval(play, 1000 / 4);
var disp = document.getElementById("disp");
function createOscillator(freq,time) {
		var osc = audio.createOscillator();

		osc.frequency.value = freq;
		osc.type = "square";
		osc.connect(audio.destination);
		osc.start(0);

		setTimeout(function() {
				osc.stop(0);
				osc.disconnect(audio.destination);
		}, (time || 1000 / 4));
}

function play() {
		var note = song.charAt(position),
				freq = scale[note];
		position += 1;
		if(position >= song.length) {
				position = 0;
		}
		if(freq) {
				createOscillator(freq);
		}
};

//play();
function make(){
	var note = song[0];
	song = song.substring(1);
	createOscillator(scale[note]);
	if (song.length>0) setTimeout(make,1000/4);
}
//var music = "G4,4 F4,4 E4,4 F4,4 G4,4 G4,4 - F4,4 F4,4 F4,4 - G4,4 B4,4 B4,4 - G4,4 F4,4 E4,4 F4,4 G4,4 G4,4 G4,4 G4,4 F4,4 F4,4 G4,4 F4,4 E4,4 - - -".split(" "),
//var music =/*"gfefgg-fff-gbb-gfefggggffgfe---""zzzgzzgzzzbegfefbe-bb-zzzz-feb--fffbbf"*/
var music = "C G E A B A# A G E G A F G E C D B".split(" "),
	timing = 1000;
var force = "- A A# B C D E F G".split(" "),
	lookup= "H0,4 A4,4 A#4,4 B4,4 C4,4 D4,4 E4,4 F4,4 G4,4".split(" ");
//C G E A B A# A G E G A F G E C D B
function player(){
	var beat = 1000*60/60;
	setTimeout(function(){
		var next = music[0];
		if (force.indexOf(next)!==-1){
			next = lookup[force.indexOf(next)];
		}
		var	noteQ= next.split(",")[0],
			tempo= parseInt(next.split(",")[1],10),
			octo = parseInt(noteQ.match(/\d+/)[0],10),
			rend = 1/tempo,
			hold = beat*rend;
		if (noteQ!=="H0"){
			var	note = noteFind({"octave": octo, "note": noteQ.replace(octo,"")})[0];
			disp.innerHTML = note.frequency + " - " + noteQ.replace(octo,"");
			console.log(disp.innerHTML);
			createOscillator(note.frequency, hold);
		}
		timing = hold;
		music.rotate();
		player();
	}, timing);
}
player();
/*

window.onload = function() {
 
		var audio = new window.webkitAudioContext(),
				position = 0,
				scale = {
						g: 392,
						f: 349.23,
						e: 329.63,
						b: 493.88
				},
				song = "gfefgg-fff-gbb-gfefggggffgfe---";
 
		setInterval(play, 1000 / 4);
 
		function createOscillator(freq) {
				var osc = audio.createOscillator();
 
				osc.frequency.value = freq;
				osc.type = "square";
				osc.connect(audio.destination);
				osc.start(0);
				 
				setTimeout(function() {
						osc.stop(0);
						osc.disconnect(audio.destination);
				}, 1000 / 4)
		}
 
 
		function play() {
				var note = song.charAt(position),
						freq = scale[note];
				position += 1;
				if(position >= song.length) {
						position = 0;
				}
				if(freq) {
						createOscillator(freq);
				}
		}
};*/
