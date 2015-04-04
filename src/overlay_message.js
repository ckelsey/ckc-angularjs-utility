'use strict';
angular.module('overlaymessage',[])
.service("overlay_message", ['$rootScope', '$timeout', function ($rootScope, $timeout) {
	var object = {};
	var defaults = {
		"class":"",
		"content":"",
	};
	object.message = {};

	for(var p in defaults){
		object.message[p] = defaults[p];
	}
	
	var t = null;
	var triedApply = 0;

	function runApply(){
		$timeout.cancel(t);
		return tryApply();
	}

	function tryApply(){
		var phase = $rootScope.$root.$$phase;
		if((phase == '$apply' || phase == '$digest') && triedApply < 100){
			triedApply++;
			t = $timeout(function(){runApply();}, 100);
		}else if(triedApply < 100){
			triedApply = 0;
			$rootScope.$apply();
			return object;
		}
	}

	object.set = function (data) {
		for(var p in data){
			if(object.message.hasOwnProperty(p)){
				object.message[p] = data[p];
			}
		}
		console.log(object);
		return runApply();
	};

	object.close = function(){
		console.log(defaults)
		return object.set(defaults);
	};

	return object;
}])

.directive('overlayMessage', function(){
	return {
		restrict: 'E',
		controller: ['$scope', '$element', 'overlay_message', function($scope, $element, overlay_message){
			$scope.overlay_message = overlay_message;
		}],
		template:'<div id="overlay-message" class="{{overlay_message.message.class}}">'+
			'<div id="overlay-message-outer"><div id="overlay-message-inner"><div id="overlay-message-section">'+
				'<div id="overlay-message-content" ng-bind="overlay_message.message.content"></div>'+
			'</div></div></div>'+
		'</div>',
		link:function(scope,elm,attr){}
	};
})
; 
