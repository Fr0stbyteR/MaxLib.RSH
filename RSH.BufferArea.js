//REN Shihong © 2017
inlets = 1; 
outlets = 1;

var buffers = [];
var index = 0;

function create(bufname, arg2, channels) {
	if (bufname.length = 0) return;
	var file = "";
	if (arg2 != parseInt(arg2)) file = arg2;
	if (selectBuf(bufname) != -1) {
		if (file.length) replace(file);
		return;
	}
	index = buffers.push({
		"name" : bufname, 
		"isPoly" : false, 
		"bufferObj" : this.patcher.newdefault(0, 30 * buffers.length, "buffer~", bufname, arg2, channels),
		"buffer" : new Buffer(bufname),
		"file" : file
	}) - 1;
	samptype("int24");
	filetype("wave");
	dumplist();
	outlet(0, "index", index);
	outlet(0, "ispoly", false);
}

function createpoly(bufname, folder) {
	if (bufname.length = 0) return;
	if (selectBuf(bufname) != -1) {
		if (folder.length) replace(folder);
		return;
	}
	index = buffers.push({
		"name" : bufname, 
		"isPoly" : true, 
		"bufferObj" : this.patcher.newdefault(0, 30 * buffers.length, "polybuffer~", bufname),
		"buffer" : new PolyBuffer(bufname),
		"file" : folder
	}) - 1;
	buffers[index]["bufferObj"].message("readfolder", new Folder(folder).pathname);
	dumplist();
	outlet(0, "index", index);
	outlet(0, "ispoly", true);
}

function selectBuf(bufname) {
	for (var i = 0; i < buffers.length; i++) {
		if (buffers[i]["name"] == bufname) {
			index = i;
			outlet(0, "index", index);
			return i;
		}
	}
	return -1;
}

function selectIndex(indexIn) {
	index = indexIn;
	outlet(0, "index", index);
	outlet(0, "selbuffer", buffers[index]["name"]);
	outlet(0, "ispoly", buffers[index]["isPoly"]);
}

function replace(file) {
	if (buffers.length <= index) return;
	if (buffers[index]["isPoly"]) {
		buffers[index]["bufferObj"].message("readfolder", new Folder(file).pathname);
		buffers[index]["file"] = file.split("/").pop();
	} else {
		buffers[index]["bufferObj"].message("replace", file);
		buffers[index]["file"] = file.split("/").pop();
	}
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
	if (!buffers[index]["isPoly"]) return;
	buffers[index]["bufferObj"].message("samptype", v);
}

function filetype(v) {
	if (buffers.length <= index) return;
	if (!buffers[index]["isPoly"]) return;
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
		var b = buffers[i];
		outlet(0, "buffer", b["name"] + " " + b["file"] + " " + (b["isPoly"] ? b["buffer"].count : b["buffer"].length() + " " + b["buffer"].channelcount()));
	}
	outlet(0, "dumpend");
}