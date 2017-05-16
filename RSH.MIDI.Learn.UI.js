//REN Shihong © 2017
function list() {
	var list = arrayfromargs(arguments);
	if (list.length != 4) return;
	var width = list[2] - list[0];
	var height = list[3] - list[1];
	var p = this.patcher;
	//main cellblock
	var map = p.getnamed("MIDI_Learn_Map");
	map.message("presentation_rect", 0, 0, width, height - 60);
	
	//device in select uemnu
	var deviceinmenu = p.getnamed("MIDI_Learn_InDeviceMenu");
	deviceinmenu.message("presentation_rect", 0, height - 60, width - 30, 20);
	
	//device out select uemnu
	var deviceoutmenu = p.getnamed("MIDI_Learn_OutDeviceMenu");
	deviceoutmenu.message("presentation_rect", 0, height - 40, width - 30, 20);
	
	//in button
	var bDelete = p.getnamed("MIDI_Learn_In");
	bDelete.message("presentation_rect", width - 30, height - 60, 30, 20);
	
	//out button
	var bDelete = p.getnamed("MIDI_Learn_Out");
	bDelete.message("presentation_rect", width - 30, height - 40, 30, 20);
	
	//delete button
	var bDelete = p.getnamed("MIDI_Learn_Delete");
	bDelete.message("presentation_rect", 0, height - 20, 60, 20);
	
	//deleteAll button
	var bDeleteAll = p.getnamed("MIDI_Learn_DeleteAll");
	bDeleteAll.message("presentation_rect", 60, height - 20, 60, 20);
	
	//AutoSave button
	var bAutoSave = p.getnamed("MIDI_Learn_AutoSave");
	bAutoSave.message("presentation_rect", 120, height - 20, 60, 20);
	
	//deleteAll button
	var bRead = p.getnamed("MIDI_Learn_Read");
	bRead.message("presentation_rect", 180, height - 20, 45, 20);
	
	//TextBind Comment
	var tBind = p.getnamed("MIDI_Learn_TextBind");
	tBind.message("presentation_rect", 0, height - 80, width - 30, 20);
	
	//clearBind button
	var bBind = p.getnamed("MIDI_Learn_ClearBind");
	bBind.message("presentation_rect", width - 50, height - 80, 20, 20);
	
	//recent Comment
	var recent = p.getnamed("MIDI_Learn_Recent");
	recent.message("presentation_rect", width - 30, height - 80, 30, 20);
	
	//MultiSlider
	var ms = p.getnamed("MIDI_Learn_MS");
	var ms_size = ms.getattr("size");
	ms.message("presentation_rect", 0, 18, 300, 18 * ms_size);
}