angular.module('utility_module',[])
.service( 'Utility', ['$http', '$location', '$sce', '$anchorScroll', function($http, $location, $sce, $anchorScroll) {
	var self = this;
	this.domain = $location.host();

	this.debug = function(data){
		console.log(data, 'From debug');
		return data;
	};

	this.scroll_to = function(id){
		var old = $location.hash();
		$location.hash(id);
		$anchorScroll();
		$location.hash(old);
	};

	this.trim_text = function(str, limit){
		str = str.trim();
		if(str.length > limit){
			var trimmedString = str.substr(0, limit);
			str = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + '...';
			return str;
		}else{
			return str;
		}
	};

	this.ev = function(str){
		var truths = str;
		return truths;
	};

	this.parse_json = function(json){
		var obj = null;
		try{
			obj = JSON.parse(json);
		}
		catch(e){
			console.log('returning json::', e);
			return json;
		}
		return obj;
	};

	this.stringify = function(obj){
		return JSON.stringify(obj);
	};

	this.parse_commas = function(str){
		var parts = str.split(',');
		var results = [];
		angular.forEach(parts, function(part){
			part = part.trim();
			results.push(part);
		});
		return results;
	};

	this.object_length = function(obj){
		if(obj && (obj !== '' || obj !== undefined || obj !== null)){
			return Object.keys(obj).length;
		}else{
			return 0;
		}
	};

	this.color_luminance = function(hex, lum) {
		var splits = [];
		if(hex && hex.split(',').length > 1){
			splits = hex.split(',');
			var len = splits.length;
			while(len--){
				splits[len] = parseFloat(String(splits[len]).replace(/[^0-9\.]/gi, ''))
			}
		}else{
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if(hex.length<6){hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];}
			for(var i=0;i<3;i++){
				splits.push(parseInt(hex.substr(i*2,2), 16));
			}
		}
		if(lum == undefined || lum == null || lum == 0 || lum == -1 || isNaN(lum)){
			lum = 1;
		}
		var colors = [],
			rgb = (splits.length == 4)? 'rgba(' : 'rgb(',
			bit = (16 * lum) - 16,
			a,
		i;
		for (i = 0; i < 3; i++) {
			a = Math.round(bit + splits[i]);
			if(a > 255){a = 255}
			else if(a < 0){a = 0}
			colors.push(a);
		}
		rgb += colors.join(',');
		rgb += (splits.length == 4)? ','+splits[3]+')' : ')';
		return rgb;
	}

	this.convert_color = function(color, target_type) {
		var splits = [];
		var type = '';
		var hex = color;
		if(hex && hex.split(',').length > 1){
			splits = hex.split(',');
			var len = splits.length;
			while(len--){
				splits[len] = parseFloat(String(splits[len]).replace(/[^0-9\.]/gi, ''))
			}
			if(hex.split('hsl').length > 1){
				type = 'hsl';
				var h = splits[0] / 360,
					s = splits[1] / 100,
					l = splits[2] / 100,
					r,g,b;
				if(s == 0){
					splits[0] = splits[1] = splits[2] = parseInt(l) * 255;
				}else{
					var hue2rgb = function hue2rgb(p, q, t){
						if(t < 0) t += 1;
						if(t > 1) t -= 1;
						if(t < 1/6) return p + (q - p) * 6 * t;
						if(t < 1/2) return q;
						if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
						return p;
					}
					var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
					var p = 2 * l - q;
					r = hue2rgb(p, q, h + 1/3);
					g = hue2rgb(p, q, h);
					b = hue2rgb(p, q, h - 1/3);
					splits = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
				}
			}else{
				type = 'rgb';
			}
		}else{
			hex = String(hex).replace(/[^0-9a-f]/gi, '');
			if(hex.length<6){hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];}
			for(var i=0;i<3;i++){
				splits.push(parseInt(hex.substr(i*2,2), 16));
			}
			type = 'hex';
		}

		var to_hex = function(c){
			var h = c.toString(16);
			return h.length == 1 ? "0" + h : h;
		};

		var rgb_to_hsl = function(r, g, b){
			r /= 255, g /= 255, b /= 255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;
			if(max == min){
				h = s = 0; // achromatic
			}else{
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}

			return [h,s, l];
		};

		switch(target_type){
			case 'hex':
				if(type == 'hex'){
					return '#'+String(color).replace(/[^0-9a-f]/gi, '');
				}else{
					return '#'+to_hex(splits[0])+to_hex(splits[1])+to_hex(splits[2]);
				}
			break;
			case 'hsl':
				if(type == 'hsl'){
					return color;
				}else{
					var r = rgb_to_hsl(splits[0],splits[1],splits[2]);
					return 'hsl('+Math.round(r[0] * 360)+','+Math.round(r[1] * 100)+'%,'+Math.round(r[2] * 100)+'%)';
				}
				break;
			default:
				return 'rgb('+splits.join(',')+')';
		}
	}

	this.to_text = function(str){
		var tmp = document.createElement("span");
		tmp.innerHTML = str;
		var newStr = (tmp.hasOwnProperty('innerText'))? tmp.innerText : tmp.textContent;
		tmp = null;
		return newStr;
	}

	this.is_it = function(start, expression, equals){
		var check_truth = function(it, equals){
			if(it){
				if(it !== null){
					if(it !== ''){
						if(it !== undefined){
							if(equals && equals !== undefined){
								if(it == equals){
									return true;
								}else{
									return false;
								}
							}else{
								return true;
							}
						}else{
							return false;
						}
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else{
				return false;
			}
		};
		if(start && (typeof start == 'object' || typeof start == 'array') && expression){
			var toCheck = expression.split('.');
			var len = toCheck.length;
			var results = [];
			var it = start;
			for(var i=0;i<len;i++){
				if((typeof it == 'object' && toCheck[i] in it) || (typeof it == 'array' && it[toCheck[i]])){
					results.push(1);
					it = it[toCheck[i]];
				}else{
					return false;
				}
			}
			if(results.length == len){
				return check_truth(it,equals);
			}else{
				return false;
			}
		}else if(start == equals){
			return true;
		}else{
			return false;
		}
	};

	this.validate_email = function(str){
		if(str && str !== ''){
			var atpos = str.indexOf("@");
			var dotpos = str.lastIndexOf(".");
			if (atpos < 1 || ( dotpos - atpos < 2 )){
				return false;
			}
			return true;
		}else{
			return false;
		}
	};

	this.get_time = function(object){
		var timestamp,
			hours=true,
			minutes=true,
			seconds,
			miliseconds,
			am_pm,
			delimiter = ':';
		if(object){
			timestamp = object.timestamp,
			hours = object.hours,
			minutes = object.minutes,
			seconds = object.seconds,
			miliseconds = object.miliseconds,
			am_pm = object.am_pm,
			delimiter = object.delimiter;
		}
		if(!timestamp){
			timestamp = Date.now();
		}
		if(timestamp.length < 13){
			timestamp = timestamp * 1000;
		}
		var d = new Date(timestamp),
			hh = d.getHours(),
			h = hh,
			min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
			sec = ('0' + d.getSeconds()).slice(-2),		// Add leading 0.
			mil = d.getMilliseconds().toString().substr(0,2),		// Add leading 0.
			ampm = 'AM',
			time = '';
		if(mil.length < 2){
			mil = mil + '0';
		}
		if (hh > 12) {
			h = hh - 12;
			ampm = 'PM';
		} else if (hh === 12) {
			h = 12;
			ampm = 'PM';
		} else if (hh == 0) {
			h = 12;
		}
		if(hours){
			time = h;
		}
		if(hours && minutes){
			time += delimiter + min;
		}else if(minutes){
			time += min;
		}
		if((hours || minutes) && seconds){
			time += delimiter + sec;
		}else if(seconds){
			time += sec;
		}
		if((hours || minutes || seconds) && miliseconds){
			time += delimiter + mil;
		}else if(miliseconds){
			time += mil;
		}
		if((hours || minutes || seconds || miliseconds) && am_pm){
			time += ' ' + ampm;
		}else if(am_pm){
			time += ampm;
		}
		return time;
	};

	this.format_date = function(object){
		var now = new Date();
		now = now.getTime();
		var values_keys = ["year_short", "year_long", "month_number", "month_name_short", "month_name_long", "day_number", "day_name_short", "day_name_long", "hours", "minutes", "seconds", "miliseconds", "am_pm"];
		var values_keys_length = values_keys.length;
		var defaults = {
			"timestamp":now,
			"display":"day_name_long month_name_long day_number, year_long hours:minutes am_pm"
		}

		var values = self.merge_into(defaults, object);
		values.timestamp = (values.timestamp == '')? values.timestamp = now : values.timestamp;
		values.timestamp = (values.timestamp.length < 13)? values.timestamp * 13 : values.timestamp;
		var date = new Date(values.timestamp);
		var month_array_short = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		var month_array_long = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
		var day_array_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var day_array_long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var get_date_element = function (element){
			switch(element){
				case "year_short":
					return date.getFullYear().toString().substr(2,2);
					break;
				case "year_long":
					return date.getFullYear().toString();
					break;
				case "month_number":
					return date.getMonth() + 1;
					break;
				case "month_name_short":
					return month_array_short[date.getMonth()];
					break;
				case "month_name_long":
					return month_array_long[date.getMonth()];
					break;
				case "day_number":
					return date.getDate();
					break;
				case "day_name_short":
					return day_array_short[date.getDay()];
					break;
				case "day_name_long":
					return day_array_long[date.getDay()];
					break;
				case "hours":
					return self.get_time({
						"timestamp":values.timestamp,
						"hours":true,
						"minutes":false,
						"seconds":false,
						"miliseconds":false,
						"am_pm":false
					});
					break;
				case "minutes":
					return self.get_time({
						"timestamp":values.timestamp,
						"hours":false,
						"minutes":true,
						"seconds":false,
						"miliseconds":false,
						"am_pm":false
					});
					break;
				case "seconds":
					return self.get_time({
						"timestamp":values.timestamp,
						"hours":false,
						"minutes":false,
						"seconds":true,
						"miliseconds":false,
						"am_pm":false
					});
					break;
				case "miliseconds":
					return self.get_time({
						"timestamp":values.timestamp,
						"hours":false,
						"minutes":false,
						"seconds":false,
						"miliseconds":true,
						"am_pm":false
					});
					break;
				case "am_pm":
					return self.get_time({
						"timestamp":values.timestamp,
						"hours":false,
						"minutes":false,
						"seconds":false,
						"miliseconds":false,
						"am_pm":true
					});
					break;
				default:
					return '';
			}
		}
		for(var i = 0; i < values_keys_length; i++){
			if(values.display.indexOf(values_keys[i] > -1)){
				var date_element = get_date_element(values_keys[i]);
				values.display = values.display.replace(values_keys[i], date_element);
			}
		}
		return values.display.toString();
	};

	this.merge = function(obj1, obj2){
		if(obj1 && obj1.typeof == 'Object' && obj2 && obj2.typeof !== 'Object'){
			return obj1;
		}else if(obj1 && obj1.typeof !== 'Object' && obj2 && obj2.typeof == 'Object'){
			return obj2;
		}else{
			for(var key in obj2){
				if(obj2.hasOwnProperty(key)){
					obj1[key] = obj2[key];
				}
			}
			return obj1;
		}
	};

	this.math = function(prop,str){
		return Math[prop](str);
	};

	this.is_past = function(then){
		if(typeof then == 'number' || !isNaN(then)){
			if(then.length < 13){
				then = then * 1000;
			}
		}
		var date = new Date(then);
		console.log(date)
		if(!date || date == 'Invalid Date'){
			return 'Invalid Date';
		}
		if (date.getTime() < Date.now()) {
			return true;
		}else{
			return false;
		}
	};

	this.trust_url = function(str){
		try{
			return $sce.trustAsUrl(str);
		}catch(e){
			console.log(e)
		}
	};

	this.trust_html = function(str){
		try{
			return $sce.trustAsHtml(str);
		}catch(e){
			console.log(e)
		}
	};

	this.array_has_object = function(arr, obj, key){
		Array.prototype.hasObject = (
			function(obj, key){
				var l = this.length;
				var v = obj[key];
				while(l--){
					if(this[l].hasOwnProperty(key) && this[l][key] == v){return true;}
				}
				return false;
			}
		);
		return arr.hasObject(obj);
	};
}])
.directive('ellipsisBind',['$timeout',function($timeout){
	return{
		restrict:'A',
		link:function(scope,elm,attrs,ctlr){
			var original_symbol = (attrs.ellipsisSymbol)? attrs.ellipsisSymbol : '...';
			var symbol = original_symbol;
			var original_lines = (attrs.ellipsisLines)? attrs.ellipsisLines : 2;
			var lines = original_lines;
			var watch = (attrs.hasOwnProperty('ellipsisWatch'))? attrs.ellipsisWatch : false;
			elm.css('position','relative');
			var timer = null;
			var original_html = elm.html();
			var original_width = parseInt(elm.width());
			var wrap = function(element){
				var ellipse_wrapper = document.createElement('ellipse_wrapper');
				var text_array = element.textContent.split('');
				var text_length = text_array.length
				for(var t=0;t<text_length;t++){
					var ellipse_item = document.createElement('ellipse_item');
					ellipse_item.textContent = text_array[t];
					ellipse_wrapper.appendChild(ellipse_item);
				}
				var parent_element = element.parentNode;
				parent_element.insertBefore(ellipse_wrapper, element);
				parent_element.removeChild(element);
			};
			var cycle_children = function(element){
				var children = element.childNodes;
				var child_length = children.length;
				for(var c=0;c<child_length;c++){
					var this_child = children[c];
					if(this_child.childNodes.length > 0){
						cycle_children(this_child);
					}else{
						if(this_child.tagname !== 'ellipse_wrapper'){
							wrap(this_child);
						}
					}
				}
			};
			var show_hide = function(){
				var line_height = parseInt(elm.css('line-height'));
				var elements = elm[0].getElementsByTagName('ellipse_item');
				var elements_array = Array.prototype.slice.call(elements);
				var elements_length = elements_array.length;
				for(var e=0;e<elements_length;e++){
					var top = elements[e].offsetTop;
					if(top < (line_height * lines)){
						elements[e].className = top;
					}else{
						elements[e].className = 'hiding ' + top;
					}
				}
				var hidden = elm[0].querySelectorAll('.hiding');
				var hidden_array = Array.prototype.slice.call(hidden);
				var hidden_length = hidden_array.length;
				if(hidden_length > 0){
					var first_hidden = hidden[0];
					var symbol_length = symbol.length + 1;
					while(symbol_length-- && first_hidden){
						first_hidden = first_hidden.previousSibling;
						if(first_hidden){
							first_hidden.className = 'hiding hidden';
						}
					}
					for(var h=0;h<hidden_length;h++){
						hidden_array[h].className = 'hiding hidden';
					}
					var ellipsi = elm[0].querySelectorAll('.ellipsi');
					if(ellipsi.length == 0){
						var ellipsi = document.createElement('span');
						ellipsi.className = 'ellipsi';
						ellipsi.textContent = symbol;
						elm[0].appendChild(ellipsi);
					}
				}else{
					var ellipsi = elm[0].querySelectorAll('.ellipsi');
					if(ellipsi.length > 0){
						elm[0].removedChild(ellipsi[0]);
					}
				}
			};
			var get_html = function(){
				if(timer !== null){$timeout.cancel(timer);}
				var bound = attrs.ellipsisBind;
				if(bound && bound !== ''){
					if(bound.split('.').length > 1){
						bound = bound.split('.');
					}else{
						bound = [bound];
					}
					var object = scope.$parent;
					var object_length = bound.length;
					for(var i=0;i<object_length;i++){
						object = object[bound[i]];
					}
					var new_width = parseInt(elm.width());
					if(original_html !== object || original_width !== new_width || lines !== original_lines || original_symbol !== symbol){
						original_symbol = symbol;
						original_width = new_width;
						original_html = object;
						original_lines = lines;
						var element = document.createElement('span');
						element.className = 'ellipsis_container';
						element.innerHTML = original_html;
						var children = element.childNodes;
						var child_length = children.length;
						for(var c=0;c<child_length;c++){
							var this_child = children[c];
							if(this_child.tagname !== 'ellipse_wrapper' && this_child.childNodes.length > 0){
								cycle_children(this_child);
							}else{
								if(this_child.tagname !== 'ellipse_wrapper'){
									wrap(this_child);
								}
							}
						}
						elm[0].innerHTML = '';
						elm[0].appendChild(element);
						show_hide();
					}
				}
				reset();
			};
			var reset = function(){
				timer = $timeout(get_html, 500);
			};
			get_html();
			var addEvent = function(elem, type, eventHandle){
				if(elem == null || typeof(elem) == 'undefined') return;
				if(elem.addEventListener){
					elem.addEventListener(type, eventHandle, false);
				}else if(elem.attachEvent){
					elem.attachEvent("on" + type, eventHandle);
				}else{
					elem["on"+type]=eventHandle;
				}
			};
			addEvent(window, "resize", get_html());
			if(watch == true || watch == "true"){
				scope.$watch(function(){
					return attrs.ellipsisLines;
				},function(newVal){
					if(newVal){
						lines = newVal;
						get_html();
					}
				},true);

				scope.$watch(function(){
					return attrs.ellipsisSymbol;
				},function(newVal){
					if(newVal){
						symbol = newVal;
						get_html();
					}
				},true);
			}
		}
	};
}])
;
