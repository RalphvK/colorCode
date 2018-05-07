# colorCode.js

A color conversion class with support for 4 and 8 digit CSS4 HEX rgb + alpha codes.

Conversion tool example: [https://ravk.nl/colorcode](https://ravk.nl/colorcode)

## Basic Usage Example

A simple example using the colorCode class to convert a color to a hex value:

```javascript
var color = new colorCode(162,222,208,0.9);
return color.hex();
```

```javascript
'#a2ded0e5' // return
```

### Modifying Channels

Besides using the ```hex()``` and ```rgb()``` methods to set new colors, the color can also be modified by directly editing the object properties. The following example sets the color using an rgba() string, and then changes each of the channels individually.

```javascript
// creating colorCode instance
var color = new colorCode().rgb('rgba(162,222,208,0.9)');

// setting RGB values
color.red = 185;
color.green = 255;
color.blue = 160;

console.log(color.hex());

// setting opacity to 50%
color.alpha = 0.5;

console.log(color.hex());
```

```javascript
'#b9ffa0e5' // rgba(185, 255, 160, 0.9)
'#b9ffa07f' // rgba(185, 255, 160, 0.5)
```

The alpha value can be 'removed' by setting it to undefined. The ```hex()``` and ```rgb()``` methods will then return a six digit code and an rgb() string respectively.

```javascript
color.alpha = undefined;
```

## ```constructor(red, green, blue, alpha)```

When creating an instance of the colorCode class, you have the option of setting the RGB and A channels.

```javascript
var color = new colorCode(162,222,208,0.5);
```

Alternatively, another method can be chained to the constructor to immediately parse a string instead.

```javascript
var color = new colorCode().hex('#a2ded0');
```

The constructor is equivalent to the set() method.

```javascript
color.set(162,222,208,0.5);
```

## ```hex(string)```

To set or get the color in hex format, use the ```hex()``` method.

### Setter

When a value is provided to the method, it parses the hex string to set the color. Using a pound symbol is optional and not required. The method supports both six (standard) and eight (with alpha channel) digit hex codes.

```javascript
color.hex('#a2ded07f');
```

In addition to six and eight digit hex codes, three (standard) and four (with alpha channel) codes are also supported.

```javascript
color.hex('#aed7');
```

### Getter

When no value is provided, the ```hex()``` method returns the hex code of the object's color. When no alpha channel is set, the function returns a six digit hex string. When an alpha value *is* set the method returns an eight digit hex string.

```javascript
return color.hex();
```
```javascript
'#a2ded07f' // return
```

## ```rgb(string)```

To set or get the color in rgb format, use the ```rgb()``` method.

### Setter

When a value is provided to the method, it parses the CSS rgb or rgba string to set the color.

```javascript
color.rgb('rgba(162,222,208,0.5)');
```

### Getter

When no value is provided, the ```rgb()``` method returns a CSS rgb or rgba string of the object's color. When no alpha channel is set, the function returns a CSS ```rgb()``` string. When an alpha value *is* set the method returns a CSS ```rgba()``` string.

```javascript
return color.rgb();
```
```javascript
'rgba(162,222,208,0.5)' // return
```