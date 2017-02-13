"use strict";
(function($){
	$(document).ready(function(){
		// ======================
		for (var i in navigator) {
			console.log(i +' : ' + navigator[i]);
		}
		var ua = navigator.userAgent;
		// var reg = ua.search(/Chrome/gi)
		// console.log(ua);
		if (ua.search(/Chrome/gi)) {
			console.log('chrome');
		}else {
			console.log('errod');
		}
		// ======================
	});
})(jQuery)