//REN Shihong © 2017
inlets = 1;
outlets = 1;
var iSize = jsarguments.length > 1 ? jsarguments[1] : 1;
var fMin = jsarguments.length > 2 ? jsarguments[2] : 0;
var fMax = jsarguments.length > 3 ? jsarguments[3] : 1;

function min(number) {
    fMin = number;
}

function max(number) {
    fMax = number;
}

function size(number) {
    iSize = number;
}

function asc() {
    var step = (fMax - fMin) / iSize;
    a = [];
    for (var i = 0; i < iSize; i++) {
        a[i] = step * (i + 1) + fMin;
    }
    outlet(0, a);
}

function asc0() {
    var step = (fMax - fMin) / (iSize - 1);
    a = [0];
    for (var i = 1; i < iSize; i++) {
        a[i] = step * i + fMin;
    }
    outlet(0, a);
}

function desc() {
    var step = (fMax - fMin) / iSize;
    a = [];
    for (var i = 0; i < iSize; i++) {
        a[iSize - i - 1] = step * (i + 1) + fMin;
    }
    outlet(0, a);
}

function desc0() {
    var step = (fMax - fMin) / (iSize - 1);
    a = [];
    a[iSize - 1] = 0;
    for (var i = 1; i < iSize; i++) {
        a[iSize - i - 1] = step * i + fMin;
    }
    outlet(0, a);
}

function random() {
    var range = fMax - fMin;
    a = [];
    for (var i = 0; i < iSize; i++) {
        a[i] = Math.random() * range + fMin;
    }
    outlet(0, a);
}
