//REN Shihong © 2018
inlets = 1;
outlets = 2;
var clipSlotsID = [];
var clipSlotsAPI = [];
var list = {};
var loaded = false;
function bang() {
    loaded = false;
    var trackAPI = new LiveAPI("this_device canonical_parent");
    if (!trackAPI["id"]) return;
    clipSlotsID = trackAPI.get("clip_slots").filter(function (element, index, array) {
        return (index % 2 === 1);
    });
    for (var i = 0; i < clipSlotsID.length; i++) {
        clipSlotsAPI[i] = new LiveAPI(slotFired, "id " + clipSlotsID[i]);
        clipSlotsAPI[i].property = "is_triggered";
    }
    reload();
}

function reload() {
    loaded = false;
    for (var i = 0; i < clipSlotsAPI.length; i++) {
        var clipID = clipSlotsAPI[i].get("clip");
        if (clipID[1]) {
            var clipAPI = new LiveAPI("id " + clipID[1]);
            list[clipSlotsID[i]] = [clipAPI.get("name")[0], clipAPI.get("file_path")[0]];
        }
    }
    loaded = true;
    outlet(0, "clear");
    outlet(1, "clear");
    for (var key in list) {
        outlet(0, "append", list[key][0]);
        outlet(1, "append", list[key][1]);
    }
}

function slotFired(args) {
    if (loaded && args[1]) outlet(0, "symbol", list[this.id][0]);
}