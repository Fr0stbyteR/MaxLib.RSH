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
	infoMaxWindow(index);
	outlet(2, "goto", indexIn);
	outlet(2, "gotocue", data[indexIn]["cue"]);
}

function gotocue(cueIn) {
	for (var i = data.length - 1; i >= 0 ; i--) {
		if (data[i]["cue"] <= cueIn) {
			index = i;
			outlet(2, "goto", index);
			outlet(2, "gotocue", data[index]["cue"]);
			return;
		}
	}

}

function first() {
	if (data.length == 0) return;
	index = 0;
	subIndex = 0;
	infoMaxWindow(index);
	outlet(2, "goto", index);
	outlet(2, "gotocue", data[index]["cue"]);
}

function last() {
	if (data.length == 0) return;
	index = data.length - 1;
	subIndex = 0;
	infoMaxWindow(index);
	outlet(2, "goto", index);
	outlet(2, "gotocue", data[index]["cue"]);
}

function prev() {
	if (data.length == 0) return;
	if (index > 0) index--;
	subIndex = 0;
	infoMaxWindow(index);
	outlet(2, "goto", index);
	outlet(2, "gotocue", data[index]["cue"]);
}

function next() {
	if (data.length == 0) return;
	if (index < data.length - 1) index++;
	subIndex = 0;
	infoMaxWindow(index);
	outlet(2, "goto", index);
	outlet(2, "gotocue", data[index]["cue"]);
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
	outlet(2, "gotocue", data[0]["cue"]);
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
		infoComments(index);
		if (index < data.length - 1) {
			outlet(2, "goto", index + 1);
			outlet(2, "gotocue", data[index + 1]["cue"]);
		} else {
			outlet(2, "goto", 0);
			outlet(2, "gotocue", data[0]["cue"]);
		}
		if ("nextIn" in data[index]) outlet(2, "nextin", data[index]["nextIn"]);
		next();
	} else {
		sendTo(data[index]["msg"][subIndex][0], data[index]["msg"][subIndex].slice(1));
		if (printOn) post(data[index]["msg"][subIndex].join(" "), "\n");
		if (subIndex == data[index]["msg"].length - 1) {
			infoComments(index);
			if (index < data.length - 1) {
				outlet(2, "goto", index + 1);
				outlet(2, "gotocue", data[index + 1]["cue"]);
			} else {
				outlet(2, "goto", 0);
				outlet(2, "gotocue", data[0]["cue"]);
			}
			if ("nextIn" in data[index]) outlet(2, "nextin", data[index]["nextIn"]);
			next();
		} else subIndex++;
	}
	outlet(2, "cueend");
}

function infoComments(indexIn) {
	if ("title" in data[indexIn]) {
		outlet(2, "title", data[indexIn]["cue"] + " : " + data[indexIn]["title"]); // send to title
	}
	if ("comment" in data[indexIn]) {
		outlet(2, "comment", data[indexIn]["comment"]); // send to title
	} else post();
}

function sendTo(destination, msg) {
	outlet(1, destination + " " + msg.join(" "));
	outlet(0, "bang")
}

function infoMaxWindow(indexIn) {
	post(data[indexIn]["cue"]); 
	if ("title" in data[indexIn]) {
		post(" : ", data[indexIn]["title"]); // send to max window
	}
	if ("comment" in data[indexIn]) {
		post(" ", data[indexIn]["comment"], "\n"); // send to max window
	} else post();
}