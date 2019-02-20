//REN Shihong © 2017
var pname = jsarguments.length > 1 ? jsarguments[1] : "#1";
var p = this.patcher;
var lastmode = 0;
var mode = 0;

function list() {
	var list = arrayfromargs(arguments);
	if (list.length != 4) return;
	var width = list[2] - list[0];
	var height = list[3] - list[1];
	if (width >= 240 && height <= 30) mode = 0; //horiz
	else if (width < 240 && height > 30) mode = 1; //vertic
	else if (width < 240 && height <= 30) mode = 2 //min
	else lastmode = mode;

	var uRecall = p.getnamed(pname + "_Pattr_MenuRecall");
	var uDelete = p.getnamed(pname + "_Pattr_MenuDelete");
	var uStore = p.getnamed(pname + "_Pattr_MenuStore");
	var uMsg = p.getnamed(pname + "_Pattr_MenuMsg");
	var uAttr = p.getnamed(pname + "_Pattr_MenuAttr");
	var iStore = p.getnamed(pname + "_Pattr_IStore");
	var fRecall = p.getnamed(pname + "_Pattr_FRecall");
	var bMIDI = p.getnamed(pname + "_Pattr_MIDILearn");
	if (mode == 2) {
		uRecall.message("presentation_rect", 0, 0, 75, height);
		uRecall.message("fontsize", 8);
	} else if (mode == 0) {
		uRecall.message("presentation_rect", 0, 0, 75, 20);
		uRecall.message("fontsize", 10);
		fRecall.message("presentation_rect", 75, 0, 30, 20);
		bMIDI.message("presentation_rect", 105, 0, 20, 20);
		uDelete.message("presentation_rect", 125, 0, 75, 20);
		uStore.message("presentation_rect", 200, 0, 75, 20);
		iStore.message("presentation_rect", 275, 0, 30, 20);
		uMsg.message("presentation_rect", 305, 0, 75, 20);
		uAttr.message("presentation_rect", 380, 0, 75, 20);
	} else if (mode == 1) {
		uRecall.message("presentation_rect", 0, 0, 75, 20);
		uRecall.message("fontsize", 10);
		fRecall.message("presentation_rect", 75, 0, 30, 20);
		uDelete.message("presentation_rect", 0, 20, 75, 20);
		bMIDI.message("presentation_rect", 75, 20, 30, 20);
		uStore.message("presentation_rect", 0, 40, 75, 20);
		iStore.message("presentation_rect", 75, 40, 30, 20);
		uMsg.message("presentation_rect", 0, 60, 75, 20);
		uAttr.message("presentation_rect", 0, 80, 75, 20);
	}
}