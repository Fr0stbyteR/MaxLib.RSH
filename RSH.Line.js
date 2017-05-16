inlets = 4;
outlets = 4;
var line = [];
function bang() {
	if (inlet != 3) return;
	nextPair();
}

function msg_int(v) {
	outlet(inlet, v);
}

function msg_float(v) {
	outlet(inlet, v);
}

function list() {
	if (inlet != 0) return;
	line = arrayfromargs(arguments);
	pairCount = parseInt(line.length / 2);
	nextPair();
}

function nextPair() {
	if (line.length <= 1) {
		outlet(3, "bang");
		line = [];
	} else {
		outlet(0, line.shift(), line.shift());
	}
}
