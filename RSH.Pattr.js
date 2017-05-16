//REN Shihong © 2017
inlets = 1;
outlets = 2;
var p;
var pname;
var attr = {};
var slots = [];
var lockedslots = [];
var current = 0;
var allowedAttr = ["activewritemode", "autopattr_vis", "autorestore", "autowatch", "backupmode", "changemode", "dirty", "flat", "greedy", "name", "notifymode", "outputmode", "savemode", "subscribemode"];
var uRecall;
var uDelete;
var uAttr;
var iStore;
var fRecall;
var last = 0;
var lastStored = 0;
var inited = 0;

function init() {
	p = this.patcher;
	pname = jsarguments.length > 1 ? jsarguments[1] : "#1";
	attr = {};
	slots = [];
	lockedslots = [];
	current = 0;
	last = 0;
	lastStored = 0;
	uRecall = p.getnamed(pname + "_Pattr_MenuRecall");
	uDelete = p.getnamed(pname + "_Pattr_MenuDelete");
	uAttr = p.getnamed(pname + "_Pattr_MenuAttr");
	iStore = p.getnamed(pname + "_Pattr_IStore");
	fRecall = p.getnamed(pname + "_Pattr_FRecall");
	uRecall.message("bgfillcolor", 0, 0.25, 0, 0.5)
	uRecall.message("clear");
	uDelete.message("clear");
	uAttr.message("clear");
	uAttr.message("append", "(" + pname + "_Pattr)");
	uAttr.message("append", "<separator>");
	for (var i = 0; i < allowedAttr.length - 1; i++) {
		uAttr.message("append", allowedAttr[i]);
	}
	uAttr.message("append", "<separator>");
	uAttr.message("append", "(File:)");
	inited = 1;
	out0("readagain");
	out0("getgreedy");
	out0("getautorestore");
	out0("getchangemode");
	out0("getnotifymode");
	out0("getflat");
	out0("getdirty");
	out0("getbackupmode");
	out0("getautopattr_vis");
	out0("getautowatch");
	out0("getactivewritemode");
	out0("getsubscribemode");
	out0("getname");
	out0("getsavemode");
	out0("getoutputmode");
	out0("getslotnamelist");
	out0("getlockedslots");
	out0("getedited");
}

function out0(l) {
	outlet(0, l);
}

function store() {
	var args = arrayfromargs(arguments);
	var number = args[0];
	var name = args[1];
	lastStored = number;
	out0(["store", number]);
	out0(["slotname", number, name]);
	refreshList();
}

function replace() {
	if (getIndex(Math.floor(current)) == -1) {
		error(pname + "_Pattr: Current preset index doesn't exist.\n");
		return;
	}
	out0(["store", Math.floor(current)]);
}

function insert_before() {
	var args = arrayfromargs(arguments);
	var name = args[0];
	out0(["insert", Math.floor(current)]);
	out0(["slotname", Math.floor(current), name]);
	refreshList();
}

function insert_after() {
	var args = arrayfromargs(arguments);
	var name = args[0];
	out0(["insert", Math.floor(current) + 1]);
	out0(["slotname", Math.floor(current) + 1, name]);
	refreshList();
}

function lock() {
	if (getIndex(Math.floor(current)) == -1) {
		error(pname + "_Pattr: Current preset index doesn't exist.\n");
		return;
	}
	out0(["lock", Math.floor(current), isLocked(Math.floor(current)) == 0]);
	out0("getlockedslots");
}

function rename() {
	if (getIndex(Math.floor(current)) == -1) {
		error(pname + "_Pattr: Current preset index doesn't exist.\n");
		return;
	}
	var args = arrayfromargs(arguments);
	var name = args[0];
	out0(["slotname", Math.floor(current), name]);
	refreshList();
}

function refreshList() {
	slots = [];
	lockedslots = [];
	last = 0;
	uRecall.message("bgfillcolor", 0, 0.25, 0, 0.5)
	uRecall.message("clear");
	uDelete.message("clear");
	out0("getslotnamelist");
	out0("getlockedslots");
}

function change(attrIn) {
	var i = allowedAttr.length;
	while (i--) {
		if (allowedAttr[i] == attrIn) {
			if (attrIn == "outputmode") prompt("outputmode");
			else if (attrIn == "savemode") prompt("savemode");
			else if (attrIn == "backupmode") prompt("backupmode");
			else {
				attr[attrIn] = attr[attrIn] == 0;
				uAttr.message("setitem", i + 2, attrIn, attr[attrIn]);
				uAttr.message("checkitem", i + 2, attr[attrIn] > 0 ? 1 : 0);
			}
		}
	}
}

function getIndex(iIn) {
	for (var i = 0; i < slots.length; i++) {
		if (iIn == slots[i][0]) {
			return i;
		}
	}
	return -1;
}

function dumped() {
	if (inited == 0) return;
	var args = arrayfromargs(arguments);
	var attrIn = args.shift();
	if (attrIn == "lockedslots") {
		lockedslots = [];
		lockedslots = args;
		for (var i = 0; i < lockedslots.length; i++) {
			uDelete.message("enableitem", getIndex(i), 0);
		}
	}
	if (args.length == 0) return;
    var i = allowedAttr.length;
    while (i--) {
        if (allowedAttr[i] == attrIn) {
			attr[attrIn] = args[0];
			uAttr.message("setitem", i + 2, attrIn, attr[attrIn]);
			uAttr.message("checkitem", i + 2, attr[attrIn] > 0 ? 1 : 0);
        }
    }
	if (attrIn == "read") uAttr.message("setitem", 16, "(File:" + args[0] + ")");
	if (attrIn == "delete") refreshList();
	if (attrIn == "slotname") {
		if (args[1] == "(undefined)") return;
		if (args[0] == "done") {	
			iStore.message(last + 1);
			return;
		}
		else {
			last = args[0];
			slots.push([args[0], args[1]]);
			uRecall.message("append", args[0] + " " + args[1]);
			uDelete.message("append", args[0] + " " + args[1]);
		}
	}
	if (attrIn == "edited") {
		if (isLocked(Math.floor(current))) {
			uRecall.message("bgfillcolor", 0.25, 0.25, 0.25, 0.5);
			return;
		}
		if (args[0]) uRecall.message("bgfillcolor", 0.25, 0.25, 0, 0.5)
		else uRecall.message("bgfillcolor", 0, 0.25, 0, 0.5);
	};
	if (attrIn == "recall") {
		current = Math.floor(args[0]);
		uRecall.message("set", getIndex(current));
		fRecall.message("set", args[0]);
	}
}

function isLocked(number) {
	for (var i = 0; i < lockedslots.length; i++) {
		if (lockedslots[i] == number) return 1;
	}
	return 0;
}

function delete_unlocked() {
	lDelete = []
	for (var i = 0; i < slots.length; i++) {
		if (!isLocked(slots[i][0])) lDelete.push(slots[i][0]);
	}
	for (var i = 0; i < lDelete.length; i++) {
		out0(["delete", lDelete[i]]);
	}
}

function prompt(l) {
	outlet(1, l);
}