//REN Shihong © 2017
inlets = 1; 
outlets = 3;

var filename = "CollList.txt";
var debugOn = 0;
var printOn = 1;
var coll;
var data;
var index;
var subIndex;

function read(filenameIn) {
	filename = filenameIn;
	init();
}

function goto(indexIn) {
	if (indexIn < data.length) index = indexIn;
	outlet(2, "goto", indexIn);
}

function gotocue(cueIn) {
	for (var i = data.length - 1; i >= 0 ; i--) {
		if (data[i]["cue"] <= cueIn) {
			index = i;
			outlet(2, "goto", index);
			return;
		}
	}

}

function first() {
	index = 0;
	subIndex = 0;
	outlet(2, "goto", index);
}

function last() {
	index = data.length - 1;
	subIndex = 0;
	outlet(2, "goto", index);
}

function prev() {
	if (index > 0) index--;
	subIndex = 0;
	outlet(2, "goto", index);
}

function next() {
	if (index < data.length - 1) index++;
	subIndex = 0;
	outlet(2, "goto", index);
}

function print(b) {
	printOn = b;
}

function oneline(b) {
	debugOn = b;
}

function init() {
	outlet(2, "init");
	index = 0;
	subIndex = 0;
	coll = new File(filename, "read");
	data = [];
	coll.open();
	if (!coll.isopen) {
		post("Read CollList Failed.\n");
		return;
	}
	var curIndex = -1;
	while (coll.position < coll.eof) {
		var line = coll.readline().split(/[,\s;]+/);
		var key = line.shift();
		if (key == parseInt(key)) {
			curIndex++;
			data[curIndex] = {"cue": key};
			if (line.length > 0) data[curIndex]["title"] = line[0];
			if (line.length > 1) data[curIndex]["comment"] = line.slice(1).join(" ");
			data[curIndex]["msg"] = [];
			outlet(2, "newcue", key + " " + line[0]);
		} else if (key === "msg") {
			data[curIndex]["msg"].push(line);
		} else if (key === "nextIn") {
			data[curIndex]["nextIn"] = parseInt(line[0]);
		}
	}
	coll.close();
	outlet(2, "goto", 0);
	outlet(2, "title", "READY");
	outlet(2, "comment", " ");
	post(data[0]["cue"]);
	if ("title" in data[0]) {
		post(" : ", data[0]["title"]);
	}
	if ("comment" in data[0]) {
		post(" ", data[0]["comment"], "\n");
	} else post();
	outlet(2, "initend");
}

function bang() {
	outlet(2, "cue", data[index]["cue"]);
	outlet(2, "index", index);
	outlet(2, "cuestart");
	if (data == null) init();
	if (debugOn == 0) {
		for (var i = subIndex; i < data[index]["msg"].length; i++) {
			sendTo(data[index]["msg"][i][0], data[index]["msg"][i].slice(1));
			if (printOn) post(data[index]["msg"][i].join(" "), "\n");
		}
		info(index);
		next();
		if ("nextIn" in data[index]) outlet(2, "nextin", data[index]["nextIn"]);
	} else {
		sendTo(data[index]["msg"][subIndex][0], data[index]["msg"][subIndex].slice(1));
		if (printOn) post(data[index]["msg"][subIndex].join(" "), "\n");
		if (subIndex == data[index]["msg"].length - 1) {
			info(index);
			next();
			if ("nextIn" in data[index]) outlet(2, "nextin", data[index]["nextIn"]);
		} else subIndex++;
	}
	outlet(2, "cueend");
}

function info(indexIn) {
	if (indexIn < data.length - 1) outlet(2, "goto", indexIn + 1); else outlet(2, "goto", 0);
	post(data[indexIn]["cue"]);
	if ("title" in data[indexIn]) {
		outlet(2, "title", data[indexIn]["cue"] + " : " + data[indexIn]["title"]);
		post(" : ", data[indexIn]["title"]);
	}
	if ("comment" in data[indexIn]) {
		outlet(2, "comment", data[indexIn]["comment"]);
		post(" ", data[indexIn]["comment"], "\n");
	} else post();
}

function sendTo(destination, msg) {
	outlet(1, destination + " " + msg.join(" "));
	outlet(0, "bang")
}
