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

// async
inputA.ask(function (answer) {
    var hexA = answer;
    inputB.ask(function (answer) {
        var hexB = answer;
        // instantiate color objects
        var colorA = new colorCode(hexA);
        var colorB = new colorCode(hexB);
        // get difference
        var diff = colorA.relativeHslTo(colorB);
        // output relative HSL
        console.log('\n\nHue: ' + diff[0]);
        console.log('Sat: ' + diff[1]);
        console.log('Lit: ' + diff[2]);
        // output SCSS
        console.log('\n\n' + colorA.scssTransformBy(diff));
    });
});