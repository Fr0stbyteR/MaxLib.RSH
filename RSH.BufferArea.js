//REN Shihong © 2017
inlets = 1; 
outlets = 1;

var buffers = [];
var index = 0;

function create(bufname, arg2, channels) {
	if (arg2 == parseInt(arg2)) file = "";
	else file = arg2;
	if (selectBuf(bufname) != null) {
		if (file.length == 0) deleteBuf();
		else {
			replace(file);
			return;
		}
	}
	index = buffers.push({
		"name" : bufname, 
		"bufferObj" : this.patcher.newdefault(0, 30 * buffers.length, "buffer~", bufname, arg2, channels),
		"buffer" : new Buffer(bufname),
		"file" : file
	}) - 1;
	samptype("int24");
	filetype("wave");
	dumplist();
	outlet(0, "index", index);
}

function selectBuf(bufname) {
	for (var i = 0; i < buffers.length; i++) {
		if (buffers[i]["name"] == bufname) {
			index = i;
			outlet(0, "index", index);
			return i;
		}
	}
	return null;
}

function selectIndex(indexIn) {
	index = indexIn;
	outlet(0, "index", index);
	outlet(0, "selbuffer", buffers[index]["name"]);
}

function replace(file) {
	if (buffers.length <= index) return;
	buffers[index]["bufferObj"].message("replace", file);
	buffers[index]["file"] = file.split("/").pop();
	dumplist();
}

function deleteBuf() {
	if (buffers.length <= index) return;
	this.patcher.remove(buffers[index]["bufferObj"]);
	buffers.splice(index, 1);
	dumplist();
	outlet(0, "index", index);
}

function deleteAll() {
	for (var i = 0; i < buffers.length; i++) {
		this.patcher.remove(buffers[i]["bufferObj"]);
	}
	buffers = [];
	dumplist();
}

function openBuf() {
	if (buffers.length <= index) return;
	buffers[index]["bufferObj"].message("open");
}

function samptype(v) {
	if (buffers.length <= index) return;
	buffers[index]["bufferObj"].message("samptype", v);
}

function filetype(v) {
	if (buffers.length <= index) return;
	buffers[index]["bufferObj"].message("filetype", v);
}

function anything() {
	if (buffers.length <= index) return;
	if (arguments.length == 0) buffers[index]["bufferObj"].message(messagename);
	else buffers[index]["bufferObj"].message(arrayfromargs(messagename, arguments));
}

function dumplist() {
	outlet(0, "dumpstart");
	for (var i = 0; i < buffers.length; i++) {
		outlet(0, "buffer", buffers[i]["name"] + " " + buffers[i]["file"] + " " + buffers[i]["buffer"].length() + " " + buffers[i]["buffer"].channelcount());
	}
	outlet(0, "dumpend");
}