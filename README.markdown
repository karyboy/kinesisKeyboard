
[kinesisKeyboard](http://github.com/karyboy/kinesisKeyboard)

## kinesisKeyboard


kinesisKeyboard is an onscreen keyboard that can be used by web applications, with the kinesis framework for kinect, to input characters in input fields , textarea etc. using the kinect motion sensor. It uses the [mottie keyboard](https://github.com/Mottie/Keyboard) and bridges it with [kinesis](http://kinesis.io).

## Usage


To make an input field use the kinesisKeyboard , do the following :

	$(function(){
                        bridge.setOpts({holdtime:1000});  // holdtime sets the time after which the character under kinesis cursor is input to the field
                        $('.kinesiskeyboard').keyboard(); // jquery selector for the input element 
              });

## Dependencies


* [mottie keyboard](https://github.com/Mottie/Keyboard)
* [kinesis](http://kinesis.io) with kinect sensor or the simulator which comes with kinesis install package.
* jquery UI theme

## License


* bridge.js licensed under the MIT License.
* License Terms for [mottie keyboard](https://github.com/Mottie/Keyboard) & [kinesis](http://kinesis.io).