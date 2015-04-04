# ckc-angularjs-utility
An Angularjs module that has some common helper functions

##Example
####HTML
```html
<form>
		<div class="form-group">
			<label>Class (".active" makes it appear)</label>
			<input class="form-control" ng-model="om.class" type="text" style="display:block;" />
		</div>
		<div class="form-group">
			<label>Content</label>
			<textarea class="form-control" ng-model="om.content" style="display:block;"></textarea>
		</div>
		<label style="display:block;">(Classes "error" makes it red and "warning" makes it orange)</label>
		<br />
		<button class="btn btn-primary" ng-click="overlay_message.set(om)">Try it</button>
	</form>
	<overlay-message></overlay-message>
```
####Javascript
```javascript
angular.module('st4rtApp',[
	'overlaymessage'
]);
```

##Options
* ___class___ - A class to add to the message container. "active" is what activates the message.
* ___content___ - The text content of the message. In the near future, html will be supported.

##Methods
* ___.set(data)___ - "data" is the options above.
* ___.close()___ - Closes the overlay message.

##Use
* ___Bower___ - ckc-angularjs-overlay-message
* Add "overlay_message" to your app's dependencies
* Add "overlay_message.js" and "overlay_message.css" to you scripts/css

##Todo
* Add a timeout to automatically close
