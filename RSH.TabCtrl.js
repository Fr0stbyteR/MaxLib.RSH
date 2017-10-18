//REN Shihong © 2017
inlets = 1;
outlets = 1;
var p2load;
var pname;
var tabsName = [];
var selected = 0;
var bMode = 0;

function msg_int(v) {
	selected = v;
	updateui();
}

function p() {
	p2load = arrayfromargs(arguments)[0];
}

function mode() {
	arg0 = arrayfromargs(arguments)[0];
	if (arg0 == 1 || arg0 == 0) {
		bMode = arg0;
		updateui();
	}
}

function tabs() {
	tabsName = arrayfromargs(arguments);
}


function updateui() {
	if (pname == null) pname = jsarguments.length > 1 ? jsarguments[1] : "#1";
	if (p2load == null || tabsName.length == 0) return;
	for (var i = 0; i < tabsName.length; i++) {
		outlet(0, "script", "sendbox", pname + "_" + tabsName[i] + "_" + p2load, "bgmode", bMode * 2);
		outlet(0, "script", "sendbox", pname + "_" + tabsName[i] + "_" + p2load, "hidden", !bMode && (selected != i));
		outlet(0, "script", "sendbox", pname + "_" + tabsName[i] + "_" + p2load, "bgcolor", 0, 0, 0, (bMode && (selected == i)) * 0.5);
		outlet(0, "script", "sendbox", pname + "_" + tabsName[i] + "_" + p2load, "background", selected != i);
	}
}
