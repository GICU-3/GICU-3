// npm install rpi-ws2801
var leds = require('rpi-ws2801');

// connecting to Raspberry Pi SPI
leds.connect(32); // assign number of WS2801 LEDs
  
// set all colors to yellow
console.log("fill all yellow");
// fill(r, g, b)
// r, g, b: value as hex (0x00 = 0, 0xFF = 255, 0x7F = 127)
leds.fill(0xFF, 255, 0x00);
  
// after 2 seconds set first 6 LEDs to (red, green, blue, red, green, blue)
setTimeout(function(){
  console.log("red green blue red green blue");
  // setRGB(ledIndex, hexColor);
  // ledIndex: 0 = LED1, 1 = LED2, …
  // hexColor: '#FF0000' = red, '#00FF00' = green, ...
  leds.setRGB(0, '#FF0000');    // set LED1 to red
  leds.setRGB(1, '#00FF00');    // set LED2 to green
  leds.setRGB(2, '#0000FF');    // set LED3 to blue
 
  // setColor(ledIndex, color);
  // ledIndex: 0 = LED1, 1 = LED2, …
  // color: array[red, green, blue] = [255,0,0] = red, [0,255,0] = green
  leds.setColor(3, [255,0,0]);  // set LED4 to red
  leds.setColor(4, [0,255,0]);  // set LED5 to green
  leds.setColor(5, [0,0,255]);  // set LED6 to blue
  
  // send all set colors to SPI via update();
  leds.update();
}, 2000);