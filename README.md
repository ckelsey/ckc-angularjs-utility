# ckc-angularjs-utility
An Angularjs module that has some common helper functions

###Example
####Javascript
```javascript
angular.module('st4rtApp',[
	'utility_module'
]).controller('AppCtlr', ['Sendgrid', function (Sendgrid){
    var self = this;
	this.Sendgrid = Sendgrid;
}]);
```

###Methods
* ___.localStorageSize()___
  * Returns the size of localStorage in KB

* ___.log(somethingToLog, titleString)___
  * Formatted console.log()

* ___.debug(anything)___
  * Print a javascript expression, object, string, etc. in the console. It will also write the into the html as a return

* ___.domain()___
  * Returns the current domain

* ___.scroll_to(string)___
  * Scrolls the page to a specific element id(Angular has issues with anchor tags using hashtags)

* ___.trim_text(string, limit)___
  * Trims the passed text to the passed length. If it is longer than specified, adds an ellipses

* ___.parse_json(json)___
  * Safely returns an object from JSON. If error, returns the supplied json

* ___.stringify(object)___
  * Safely returns a string from an object. If error, returns the supplied object

* ___.parse_commas(string)___
  * Returns an array of a string split by commas

* ___.object_length(object)___
  * Returns the number of properties in an object

* ___.color_luminance(color(string), adjustment(float))___
  * Adjusts a given color(hex, rgb, rgba, hsl) up or down where 1 is 16 bits. Note 1, 0, -1 equals no change. Returns rgb()

* ___.convert_color(color(string), target_type(string))___
  * Converts a color from one standard to another (hls, rgb, hex)

* ___.is_it(start(object), expression(string), equals(boolean))___
  * Returns true or false. The first argument is either the starting object, array, string, number. The second argument is the object/array property path if it applies. Lastly, the third argument is what it should equal

* ___.to_text(HTML)___
  * Takes html and converts it to text

* ___.validate_email(string)___
  * Checks to see if the passed string is a valid email in that it contains '@' and a domain name

* ___.get_time(object{timestamp, hours, minutes, seconds, miliseconds, am_pm, delimiter})___
  * Returns a formatted time as hour:minute:second:miliseconds AM/PM

* ___.format_date(object{date, display(string)})___
  * Returns a formatted date using these keys:
    * year_short
    * year_long
    * month_number
    * month_name_short
    * month_name_long
    * day_number
    * day_name_short
    * day_name_long
    * hours
    * minutes
    * seconds
    * miliseconds
    * am_pm
* ___.merge(object, object)___
  * Merges object2 properties and values into object1

* ___.math(method(string), expression(number/string))___
  * Will perform javascript math functions in a template

* ___.is_past(then(date))___
  * Will compare the current date and time with a supplied date and time to see if it is in the past or not

* ___.trust_url(string)___
  * An angular helper to that declares a safe url to bind to. Only use if you know the source of the url

* ___.trust_html(anything)___
  * An angular helper to that declares safe html to bind to. Only use if you know the source of the html

###Directives
* ___ellipsis-bind___
  * Limits a body of text by a specified number of lines

  * ___Attributes___
    * ___ellipsis-symbol___
      * Defaults to "...", can be whatever you want
    * ___ellipsis-lines___
      * Defaults to "...", can be whatever you want
    * ___ellipsis-watch___
      * Makes Angular specifically watch the text, in case it's going to change
    * ___ellipsis-bind___
      * What calls the directive as well as defines what is the text


###Use
* ___Bower___ - ckc-angularjs-utility
* Add "utility_module" to your app's dependencies
* Add "utility.min.js" to your scripts
