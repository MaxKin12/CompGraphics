function numberChanged(color) {
    changeRangeValue(color);
    // upgrade other models
    if (color === "r" || color === "g" || color === "b") {
        changedRGB();
    }
    else if (color === "h" || color === "l" || color === "s")
        changedHLS();
    else
        changedCMYK();
}

function rangeChanged(color) {
    changeNumberValue(color);
    // upgrade other models
    if (color === "r" || color === "g" || color === "b") {
        changedRGB();
    }
    else if (color === "h" || color === "l" || color === "s")
        changedHLS();
    else
        changedCMYK();
}

function changeRangeValue(color) {
    let number_id = "number_" + color;
    let range_id = "range_" + color;
    let new_val = parseInt(document.getElementById(number_id).value, 10);
    document.getElementById(range_id).value = isNaN(new_val) ? 0 : new_val;
}

function changeNumberValue(color) {
    let number_id = "number_" + color;
    let range_id = "range_" + color;
    let new_val = parseInt(document.getElementById(range_id).value, 10);
    document.getElementById(number_id).value = isNaN(new_val) ? 0 : new_val;
}

function RGBtoCMYK() {
    let r = document.getElementById("number_r").value;
    let g = document.getElementById("number_g").value;
    let b = document.getElementById("number_b").value;

    // RGB to CMYK //
    let k = Math.min(1 - r/255, 1 - g/255, 1 - b/255);
    if (k === 1) {
        document.getElementById("number_c").value = 0;
        document.getElementById("number_m").value = 0;
        document.getElementById("number_y").value = 0;
    }
    else {
        document.getElementById("number_c").value = Math.round((1 - r / 255 - k)/(1 - k) * 100);
        document.getElementById("number_m").value = Math.round((1 - g / 255 - k)/(1 - k) * 100);
        document.getElementById("number_y").value = Math.round((1 - b / 255 - k)/(1 - k) * 100);
    }
    document.getElementById("number_k").value = Math.round(k * 100);
    changeRangeValue("c");
    changeRangeValue("m");
    changeRangeValue("y");
    changeRangeValue("k");
}

function RGBtoHLS() {
    let r = document.getElementById("number_r").value;
    let g = document.getElementById("number_g").value;
    let b = document.getElementById("number_b").value;

    let r_ = r/255;
    let g_ = g/255;
    let b_ = b/255;
    let max = Math.max(r_, g_, b_);
    let min = Math.min(r_, g_, b_);
    let c = max - min;
    let h, s = 0, l = (max + min)/2;
    if (c === 0)
        h = 0;
    else if (max === r_)
        h = 60 * ((g_ - b_)/c % 6)
    else if (max === g_)
        h = 60 * ((b_ - r_)/c + 2)
    else
        h = 60 * ((r_ - g_)/c + 4)
    if (h < 0)
        h += 360;
    if (l !== 0 && l !== 1)
        s = c/(1 - Math.abs(2 * max - c - 1))
    document.getElementById("number_h").value = Math.round(h);
    document.getElementById("number_l").value = Math.round(l * 100);
    document.getElementById("number_s").value = Math.round(s * 100);
    changeRangeValue("h");
    changeRangeValue("l");
    changeRangeValue("s");
}

function changedRGB() {
    RGBtoCMYK();
    RGBtoHLS();
}

function changedCMYK() {
    let c = document.getElementById("number_c").value / 100;
    let m = document.getElementById("number_m").value / 100;
    let y = document.getElementById("number_y").value / 100;
    let k = document.getElementById("number_k").value / 100;

    // CMYK to RGB //
    document.getElementById("number_r").value = Math.round(255*(1 - c)*(1 - k));
    document.getElementById("number_g").value = Math.round(255*(1 - m)*(1 - k));
    document.getElementById("number_b").value = Math.round(255*(1 - y)*(1 - k));
    changeRangeValue("r");
    changeRangeValue("g");
    changeRangeValue("b");

    // CMYK to HLS //
    RGBtoHLS();
}

function changedHLS() {
    let h = document.getElementById("number_h").value;
    let l = document.getElementById("number_l").value / 100;
    let s = document.getElementById("number_s").value / 100;

    // HLS to RGB //
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let h_ = h/60;
    let x = c * (1 - Math.abs(h_ % 2 - 1))
    let r, g, b;
    if (h_ < 1) {
        r = c; g = x; b = 0;
    }
    else if (h_ < 2) {
        r = x; g = c; b = 0;
    }
    else if (h_ < 3) {
        r = 0; g = c; b = x;
    }
    else if (h_ < 4) {
        r = 0; g = x; b = c;
    }
    else if (h_ < 5) {
        r = x; g = 0; b = c;
    }
    else {
        r = c; g = 0; b = x;
    }
    let m = l - c/2;
    document.getElementById("number_r").value = Math.round((r + m) * 255);
    document.getElementById("number_g").value = Math.round((g + m) * 255);
    document.getElementById("number_b").value = Math.round((b + m) * 255);
    changeRangeValue("r");
    changeRangeValue("g");
    changeRangeValue("b");

    // HLS to CMYK //
    RGBtoCMYK();
}



    // function numberChangePalette(color) {
    //     // Change palette
    //     let r = document.getElementById("number_r").value;
    //     let g = document.getElementById("number_g").value;
    //     let b = document.getElementById("number_b").value;
    //     let hex = rgbToHex(r,g,b);
    //     joe.set(hex);
    // }
    // function componentToHex(c) {
    //     let hex = c.toString(16);
    //     return hex.length == lab1 ? "0" + hex : hex;
    // }
    //
    // function rgbToHex(r, g, b) {
    //     return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    // }
