//REN Shihong © 2017
inlets = 1;
outlets = 2;
var path = "";
var files = {filelist : [], tags : {}};
var mostTags = [];
var umenuTags = [];
var choosedTags = [];
var choosed = [];
var p = this.patcher;
var pname = jsarguments.length > 1 ? jsarguments[1] : "#1";
var uTagList;

function read(filename) {
	var s = "";
	var f = new File(filename, "read", ["JSON", "TEXT", "DICT"]);
	while (f.isopen && f.position < f.eof) {
		s += f.readline(1);
	}
	f.close();
	files = JSON.parse(s);
	mostTags = [];
	umenuTags = [];
	choosedTags = [];
	dumpTagList(20);
}

function write(filename) {
	var s = JSON.stringify(files, null, "\t");
	var f = new File(filename, "write", ["JSON", "TEXT", "DICT"]);
	if (f.isopen) {
		while (s.length > 0) {
			f.writestring(s.substring(0, 16384));
			s = s.substring(16384);
		}
	}
	f.eof = f.position;
	f.close();
}

function setpath(pathIn) {
	files = {filelist : [], tags : {}};
	mostTags = [];
	umenuTags = [];
	choosedTags = [];
	if (pathIn.slice(-1) != "/") pathIn += "/";
	path = pathIn;
	searchPath(pathIn);
	dumpTagList(20);
	uFiles = p.getnamed(pname + "_SoundDB_Files");
	uFiles.message("clear");
}

function searchPath(pathIn) {
	if (pathIn.slice(-1) != "/") pathIn += "/";
	var f = new Folder(pathIn);
	f.reset();
	f.typelist = ["fold", "AIFF", "WAVE"];
	var tempList = [];
	while (!f.end) {
		if (f.filetype == "fold") {
			searchPath(pathIn + f.filename + "/");
		} else if (f.filename.length > 0) {
			files.filelist.push([f.filename, pathIn + f.filename, getTagsFromPath(pathIn + f.filename)]);
		}
		f.next();
  	}
}

function getTagsFromPath(str) {
	arr = str.replace(path, "").split(/[\W_-]+/);
	arr = cleanArray(arr);
	tagStat(arr);
	return arr;
}

function cleanArray(arr) {
    var seen = {};
	var i = arr.length;
	while (i--) {
		var tag = arr[i];
		if (tag.match(/^[VX]?\d{1,2}$/) != null //not match 1 2 or V1 X1...
 				|| tag.match(/wav|WAV|aif|AIF|aiff|AIFF/) != null) {
			arr.splice(i, 1);
			continue;
		}
		arr[i] = tag.replace(/([^F])X$/, "$1"); // let SomethingX in the same class of Something (except FX, SFX)
		if (arr[i].length == 0) {
			arr.splice(i, 1);
			continue;
		}
		tag = arr[i];
        if (seen[tag] == 1) {
			arr.splice(i, 1);
			continue;
		} else seen[tag] = 1;
	}
	return arr;
}

function tagStat(arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] in files.tags) files.tags[arr[i]]++;
		else files.tags[arr[i]] = 1;
	}
}

function getMostTags(amount) {
	var arr = [];
	for (tag in files.tags) {
		if (arr.length < amount) {
			arr.push(tag);
			continue;
		}
		for (var i = 0; i < arr.length; i++) {
			if (files.tags[tag] > files.tags[arr[i]]) {
				if (arr.length >= amount) arr.pop();
				arr.splice(i, 0, tag);
				break;
			} 
		}
	}
	return arr;
}

function dumpTagList(amount) {
	uTagList = p.getnamed(pname + "_SoundDB_TagList");
	uTagList.message("clear");
	mostTags = getMostTags(amount);
	for (var i = 0; i < mostTags.length; i++) {
		uTagList.message("append", mostTags[i]);
	}
}

function indexOf(elem, arr) {
	var i = arr.length;
	while (i--) {
		if (arr[i] == elem) return i;
	}
	return -1;
}

function umenutag(s) {
	var found = indexOf(s, umenuTags);
	var inMostTags = indexOf(s, mostTags);
	uTagList = p.getnamed(pname + "_SoundDB_TagList");
	if (found == -1) {
		umenuTags.push(s);
		if (inMostTags > -1) {
			uTagList.message("checkitem", inMostTags, 1);
		}
	} else {
		umenuTags.splice(found, 1);
		if (inMostTags > -1) {
			uTagList.message("checkitem", inMostTags, 0);
		}
	}
	tTags = p.getnamed(pname + "_SoundDB_TTags");
	tTags.message("set", umenuTags);
}

function settags() {
	var choosedTags = arrayfromargs(arguments);
	uTagList = p.getnamed(pname + "_SoundDB_TagList");
	for (var i = 0; i < mostTags.length; i++) {
		var found = indexOf(mostTags[i], choosedTags);
		if (found > -1) uTagList.message("checkitem", i, 1);
		else uTagList.message("checkitem", i, 0);
	}
	uFiles = p.getnamed(pname + "_SoundDB_Files");
	uFiles.message("clear");
	choosed = [];
	if (choosedTags.length == 0) {
		for (var i = 0; i < files.filelist.length; i++) {
			uFiles.message("append", files.filelist[i][0]);
			choosed.push(i);
		}
		return;
	}
	for (var i = 0; i < files.filelist.length; i++) {
		var flag = 1;
		for (var j = 0; j < choosedTags.length; j++) {
			var tag = choosedTags[j];
			if (!hasTag(i, choosedTags[j])) {
				flag = 0;
				break;
			}
		}
		if (flag) {
			uFiles.message("append", files.filelist[i][0]);
			choosed.push(i);
		}
	}
}

function hasTag(i, tag) {
	var found = indexOf(tag, files.filelist[i][2]);
	return found > -1;
}

function random() {
	var count = choosed.length;
	if (count == 0) return;
	var i = Math.floor(Math.random() * count);
	outlet(0, "open", files.filelist[choosed[i]][1]);
}

function preload() {
	var count = choosed.length;
	if (count == 0) return;
	outlet(0, "clear");
	for (var i = 0; i < choosed.length; i++) {
		outlet(0, "preload", i + 2, files.filelist[choosed[i]][1]);
	}
	outlet(0, "count", count);
}

function get(i) {
	if (i > choosed.length) return;
	var file = files.filelist[choosed[i]][1];
	outlet(0, "file", file);
}

function getall() {
	var count = choosed.length;
	if (count == 0) return;
	outlet(0, "allfiles");
	for (var i = 0; i < choosed.length; i++) {
		outlet(0, "file", files.filelist[choosed[i]][1]);
	}
	outlet(0, "count", count);
}
