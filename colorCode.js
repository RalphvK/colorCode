var colorCode = class {

    constructor(...args) {
        if (typeof arguments[0] == 'string') {
            return this.hex(...args);
        } else {
            return this.set(...args);
        }
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

    // get hsl
    hsl() {
        return getHsl();
    }

    // compare with another colorCode object
    // returns difference in hue, saturation and lightness in percentages
    // helps you transform color A into B through hue, saturation and lightness operations in scss
    relativeHslTo(object) {
        var a = this.rgbToHsl(this.red, this.green, this.blue);
        var b = object.rgbToHsl(object.red, object.green, object.blue);
        var diff = [];
        diff[0] = (parseInt(b[0]) - parseInt(a[0])) + 'deg';
        diff[1] = (parseInt(b[1]) - parseInt(a[1])) + '%';
        diff[2] = (parseInt(b[2]) - parseInt(a[2])) + '%';
        return diff;
    }
    
    // compare with another colorCode object
    // returns SCSS color operations to transform color into another color
    // @param variationColor colorCode object
    // @param colorVariable string used to reference color, equals base color HEX by default
    scssTransformTo(variationColor, colorVariable) {
        // get baseColor
        var baseColor = this.hex();
        var diff = this.relativeHslTo(variationColor);
        // use color variable
        if (colorVariable !== undefined) {
            // start output
            var output = colorVariable;
        } else {
            // start output
            var output = '#' + baseColor.replace("#", "");
        }
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

    // returns SCSS color operations to transform color by provided HSL values
    // @param diff array from relativeHslTo()
    // @param colorString string used to reference color, equals base color HEX by default
    scssTransformBy(diff, colorVariable) {
        // get baseColor
        var baseColor = this.hex();
        // use color variable
        if (colorVariable !== undefined) {
            // start output
            var output = colorVariable;
        } else {
            // start output
            var output = '#' + baseColor.replace("#", "");
        }
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

    // returns CSS HSL or HSLA string
    getHsl() {
        var hsl = this.rgbToHsl(this.red, this.green, this.blue);        
        var output = (this.alpha !== undefined) ? 'hsla(' : 'hsl(';
        output += hsl.join(',');
        output += (this.alpha !== undefined) ? ',' + this.alpha + ')' : ')';
        return output;
    }
    // returns array with HSL values
    getHslArray(format = 'string') {
        var hsl = this.rgbToHsl(this.red, this.green, this.blue);
        if (format == 'string') {
            var output = hsl;
        } else if (format == 'integer') {
            var output = [];
            hsl.forEach(element => {
                output.push(parseInt(element));
            });
        } else if (format == 'decimal') {
            var output = [];
            output[0] = parseInt(hsl[0]) / 360;
            output[1] = parseInt(hsl[1]) / 100;
            output[2] = parseInt(hsl[2]) / 100;
        }
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

    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and l in the set [0, 1].
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSL representation
     */
    rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [((h * 100) / 100 * 360 + 0.5) | 0, ((s * 100 + 0.5) | 0) + '%', ((l * 100 + 0.5) | 0) + '%'];
    }

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    }

}