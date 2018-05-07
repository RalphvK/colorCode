class colorCode {

    constructor(...args) {
        return this.set(...args);
    }

    // general setter
    set(red, green, blue, alpha) {
        // color channels
        this.red = (red !== undefined) ? red : 0;
        this.green = (green !== undefined) ? green : 0;
        this.blue = (blue !== undefined) ? blue : 0;
        // alpha channel
        this.alpha = (alpha !== undefined) ? alpha : undefined;
        // return object
        return this;
    }

    // get or parse HEX code
    hex(hex) {
        if (hex !== undefined) {
            return this.parseHex(hex);
        } else {
            return this.getHex();
        }
    }

    // get or parse RGB code
    rgb(rgb) {
        if (rgb !== undefined) {
            return this.parseRgb(rgb);
        } else {
            return this.getRgb();
        }
    }

    // parse HEX string to set properties
    parseHex(hex) {
        // removing pound symbol if present
        hex = hex.replace('#', '');
        // 6 and 8 character strings
        if (hex.length == 6 || hex.length == 8) {
            // splitting channels
            var channels = this.splitString(hex, 2);
            // setting color channels
            this.red = this.hexToNumber(channels[0]);
            this.green = this.hexToNumber(channels[1]);
            this.blue = this.hexToNumber(channels[2]);
            // setting alpha channel if available
            this.alpha = (channels[3] !== undefined) ? this.hexToOpacity(channels[3]) : undefined;
        // 3 and 4 character shorthand strings
        } else if (hex.length == 3 || hex.length == 4) {
            // splitting channels
            var channels = this.splitString(hex, 1);
            // setting color channels
            this.red = this.hexToNumber(channels[0] + channels[0]);
            this.green = this.hexToNumber(channels[1] + channels[1]);
            this.blue = this.hexToNumber(channels[2] + channels[2]);
            // setting alpha channel if available
            this.alpha = (channels[3] !== undefined) ? this.hexToOpacity(channels[3]) : undefined;
        // else throw error
        } else {
            throw "Invalid HEX string provided to parseHex()! Provided: "+hex;
        }
        // return object
        return this;
    }

    // parse RGB string to set properties
    parseRgb(rgb) {
        // if parentheses are present
        if (rgb.indexOf('(') > -1) {
            // get string between parentheses
            rgb = rgb.substring(rgb.lastIndexOf("(")+1,rgb.lastIndexOf(")"));
        }
        // remove spaces
        rgb = rgb.replace(/\s+/g, '');
        // explode string into channels
        var channels = rgb.split(',');
        // if valid number of channels
        if (channels.length == 3 || channels.length == 4) {
            // setting channels
            this.red = parseInt(channels[0]);
            this.green = parseInt(channels[1]);
            this.blue = parseInt(channels[2]);
            // alpha channel
            channels[3] = parseFloat(channels[3]);
            if (!isNaN(channels[3])) {
                this.alpha = this.round(channels[3], 2);
            } else {
                this.alpha = undefined;
            }
        // else throw error
        } else {
            throw "Invalid RGB string provided to parseRgb()";
        }
        // return object
        return this;
    }
    
    // returns HEX string
    getHex() {
        // init output
        var output = '';
        // rgb channels
        var colorChannels = [this.red, this.green, this.blue];
        var dedupeFlag = true;
        colorChannels.forEach(value => {
            output += this.numberToHex(value);
            if (!this.isDoubleChar(this.numberToHex(value))) {
                dedupeFlag = false;
            }
        });
        // alpha channel
        if (this.alpha !== undefined) {
            dedupeFlag = false;
            output += this.decToHexAlpha(this.alpha);
        }
        // deduping if possible
        if (dedupeFlag) {
            output = this.dedupe(output);
        }
        // prepend pound symbol
        output = '#'+output;
        return output;
    }

    // returns CSS RGB or RGBA string
    getRgb() {
        // function open
        var output = (this.alpha !== undefined) ? 'rgba(' : 'rgb(';
        output += [this.red, this.green, this.blue].join(',');
        output += (this.alpha !== undefined) ? ',' + this.alpha + ')' : ')';
        return output;
    }

    // number to hex function
    numberToHex(number) {
        var hex = number.toString(16);
        // ensuring output is always at least two chars long
        if (hex.length == 1) {
            return "0" + hex;
        } else {
            return hex;
        }
    }

    // decimal to hex alpha
    decToHexAlpha(decimal) {
        return this.numberToHex(this.round(decimal * 100 * (255 / 100), 0));
    }
    // simple test function for hexAlpha that outputs the hex codes for 0%-100%
    testHexAlpha() {
        for (var i=100; i > 0; i -= 1){
            console.log(i + "% - " + this.decToHexAlpha(i/100));
        }
    }
    
    // hex alpha to decimal
    hexToOpacity(hex) {
        // getting scale
        var scale = Math.pow(16, hex.length) - 1;
        // calculating decimal value
        return this.round(this.hexToNumber(hex) / scale, 2);
    }

    // hex to number
    hexToNumber(hex) {
        return parseInt(hex, 16);
    }

    // easy round function
    round(value, precision) {
        return Number(Math.round(value+'e'+precision)+'e-'+precision);
    }

    // explode string into chunks of length, returns array with segments
    splitString(string, size) {
        return string.match(new RegExp('.{1,' + size + '}', 'g'));
    }

    // check if HEX value could be single character
    isDoubleChar(string) {
        return string[0] == string[1];
    }

    // dedupe function
    dedupe(string) {
        var chars = string.split('');
        for (var i = 1; i < chars.length; i+=2) {
            chars[i] = '';
        }
        return chars.join('');
    }

}