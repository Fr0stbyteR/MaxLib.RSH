//REN Shihong © 2017
inlets = 1;
outlets = 2;
var path;
var files = [];
var tags = {};
var mostTags = [];
var umenuTags = [];
var choosedTags = [];
var choosed = [];
var p = this.patcher;
var pname = jsarguments.length > 1 ? jsarguments[1] : "#1";
var uTagList;

function setpath(pathIn) {
	files = [];
	tags = {};
	mostTags = [];
	umenuTags = [];
	choosedTags = [];
	if (pathIn.slice(-1) != "/") pathIn += "/";
	path = pathIn;
	searchPath(path);
	dumpTagList(10);
}

function searchPath(pathIn) {
	if (pathIn.slice(-1) != "/") pathIn += "/";
	var f = new Folder(pathIn);
	f.reset();
	f.typelist = ["fold", "AIFF", "WAVE"];
	while (!f.end) {
		if (f.filetype == "fold") {
			searchPath(pathIn + f.filename + "/");
		} else if (f.filename.length > 0) {
			files.push([f.filename, pathIn + f.filename, getTagsFromPath(pathIn + f.filename)]);
		}
		f.next();
  	}
}

function getTagsFromPath(str) {
	arr = str.replace(path, "").split(/[\W_-]+/);
	arr = removeFromArray(arr, /V?X?\d{1,2}/);
	arr = removeFromArray(arr, /wav|WAV|aif|AIF|aiff|AIFF/);
	arr = removeXFromArray(arr);
	tagStat(arr);
	return arr;
}

function removeFromArray(arr, regex) {
	var i = arr.length;
	while (i--) {
		if (arr[i].match(regex) != null) arr.splice(i);
	}
	return arr;
}

function removeXFromArray(arr) {
	var i = arr.length;
	while (i--) {
		arr.push(arr[i]);
		arr[i] = arr[i].replace(/X$/, "");
		if (arr[i].length == 0) arr.splice(i);
	}
	return arr;
}

function tagStat(arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] in tags) tags[arr[i]]++;
		else tags[arr[i]] = 0;
	}
}

function getMostTags(amount) {
	var arr = [];
	for (tag in tags) {
		if (arr.length < amount) {
			arr.push(tag);
			continue;
		}
		for (var i = 0; i < arr.length; i++) {
			if (tags[tag] > tags[arr[i]]) {
				if (arr.length >= amount) arr.pop();
				arr.splice(i, 0, tag);
				break;
			} 
		}
	}
	return arr;
}

function dumpTagList(amount) {
	uTagList = p.getnamed(pname + "_SoundBank_TagList");
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
	uTagList = p.getnamed(pname + "_SoundBank_TagList");
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
	tTags = p.getnamed(pname + "_SoundBank_TTags");
	tTags.message("set", umenuTags);
}

function settags() {
	var choosedTags = arrayfromargs(arguments);
	uTagList = p.getnamed(pname + "_SoundBank_TagList");
	for (var i = 0; i < mostTags.length; i++) {
		var found = indexOf(mostTags[i], choosedTags);
		if (found > -1) uTagList.message("checkitem", i, 1);
		else uTagList.message("checkitem", i, 0);
	}
	uFiles = p.getnamed(pname + "_SoundBank_Files");
	uFiles.message("clear");
	choosed = [];
	for (var i = 0; i < files.length; i++) {
		var flag = 1;
		for (var j = 0; j < choosedTags.length; j++) {
			var tag = choosedTags[j];
			if (!hasTag(i, choosedTags[j])) {
				flag = 0;
				break;
			}
		}
		if (flag) {
			uFiles.message("append", files[i][0]);
			choosed.push(i);
		}
	}
}

function hasTag(i, tag) {
	var found = indexOf(tag, files[i][2]);
	return found > -1;
}

function random() {
	var count = choosed.length;
	if (count == 0) return;
	var i = Math.floor(Math.random() * count);
	outlet(0, "open", files[choosed[i]][1]);
}

function preload() {
	var count = choosed.length;
	if (count == 0) return;
	outlet(0, "clear");
	for (var i = 0; i < choosed.length; i++) {
		outlet(0, "preload", i + 2, files[choosed[i]][1]);
	}
	outlet(0, "count", count);
}