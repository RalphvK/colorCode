var include = require("./include.js");
include.file('../colorCode.js');

// inputs
var Input = require('prompt-input');
var inputA = new Input({
    name: 'colorA',
    message: 'Base color:'
});
var inputB = new Input({
    name: 'colorB',
    message: 'Variation color:'
});

function compare(hexA, hexB) {
    var colorA = new colorCode(hexA);
    var colorB = new colorCode(hexB);
    // get percentage values required to transform color A into color B with HSL operations
    return colorA.hslDeltaTo(colorB);
}

function generateScss(baseColor, diff) {
    var output = '#'+baseColor.replace("#", "");
    // hue
    if (parseInt(diff[0]) !== 0) {
        output = 'adjust-hue(' + output + ',' + diff[0] + ')';
    }
    // saturation
    if (parseInt(diff[1]) > 0) {
        output = 'saturate(' + output + ',' + diff[1] + ')';
    } else if (parseInt(diff[1]) < 0) {
        output = 'desaturate(' + output + ',' + diff[1].replace(/-/g, '') + ')';
    }
    // lightness
    if (parseInt(diff[2]) > 0) {
        output = 'lighten(' + output + ',' + diff[2] + ')';
    } else if (parseInt(diff[2]) < 0) {
        output = 'darken(' + output + ',' + diff[2].replace(/-/g, '') + ')';
    }
    return output + ';';
}

// async
inputA.ask(function (answer) {
    var colorA = answer;
    inputB.ask(function (answer) {
        var colorB = answer;
        var diff = compare(colorA, colorB);
        console.log('\n\nHue: ' + diff[0]);
        console.log('Sat: ' + diff[1]);
        console.log('Lit: ' + diff[2]);
        console.log('\n\n'+generateScss(colorA, diff));
    });
});