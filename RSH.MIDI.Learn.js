//REN Shihong © 2017
inlets = 1;
outlets = 4;

var map = new Dict("MIDI.Map");
var ms;
var ctlCount = 0;
var keys;
function bang() {
	ctlCount = 0;
	if (ms == null) ms = this.patcher.getnamed("MIDI_Learn_MS");
	map.clear();
	map.pull_from_coll("MIDI.Map");
	keys = map.getkeys();
	if (keys == null) {
		sendTo("MIDI.Learn.In", "deleteall");
		keys = [];
	}
	if (typeof keys === 'string') keys = [keys];
	if (keys != null && keys[0] == "Name") {
		map.remove("Name");
		keys.shift();
	}
	if (keys != null && keys.length != 0) {
		ctlCount = keys.length;
	}
	if (ctlCount == 0) ms.message("hidden", 1);
	else ms.message("hidden", 0);
	ms.message("size", ctlCount);
}

function scaleTo(i, minimum, maximum, exp) {
	return Math.pow(i / 127, exp) * (maximum - minimum) + minimum;
}

function scaleFrom(i, minimum, maximum, exp) {
	return Math.round(Math.pow((i - minimum) / (maximum - minimum), 1 / exp) * 127);
}

function ctl() {
	var list = arrayfromargs(arguments);
	for (var i = 0; i < ctlCount; i++) {
		if (map.get(keys[i])[0] == list[1] && map.get(keys[i])[1] == list[2]) {
			var found = map.get(keys[i]);
			var value = scaleTo(list[0], found[2], found[3], found[4]);
			sendTo(keys[i], value);
			sendToMS(i + 1, list[0]);
		}
	}
}

function sync() {
	var list = arrayfromargs(arguments);
	for (var i = 0; i < ctlCount; i++) {
		if (keys[i] == list[0]) {
			var found = map.get(keys[i]);
			var value = scaleFrom(list[1], found[2], found[3], found[4]);
			sendMIDIOut(found[0], found[1], value);
			sendToMS(i + 1, value);
		}
	}
}

function sendTo(destination, msg) {
	outlet(1, destination, msg);
	outlet(0, "bang")
}

function sendMIDIOut(ctl, chan, value) {
	outlet(2, value, ctl, chan);
}

function sendToMS(i, v) {
	ms.message("set", i, v);
	outlet(3, v);
}