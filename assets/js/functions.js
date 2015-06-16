// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs

// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);

// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }


// remap jQuery to $
(function($){
	
	$.fn.serializeObject = function() {
	    
	    var o = {};

	  	$.each(this.find("fieldset"), function() {
	    	var f = {};
	  		var fieldset = $(this).attr("id");

	  		var a = $(this).serializeArray();
	  		$.each(a, function() {

	  			// input names follow the format "[fieldset id]_[n]"
	  			var n = this.name.split('__')[1];

		        if (f[n] !== undefined) {
		            if (!f[n].push) {
		                f[n] = [f[n]];
		            }
		            f[n].push(this.value || '');
		        } else {
		            f[n] = this.value || '';
		        }
		    });

	  		// add each fieldset object to the meta object
		    if (o[fieldset] !== undefined) {
	            if (!o[fieldset].push) {
	                o[fieldset] = [o[fieldset]];
	            }
	            o[fieldset].push(f || '');
	        } else {
	            o[fieldset] = f || '';
	        }
	  	});
	    
	    return o;
	};

	/* trigger when page is ready */
	$(document).ready(function (){

		$("select[name='election__locality_gnis']").change( function() {
			var val = $(this).find("option:selected").text();
			$("input[name='election__locality']").val(val);
		});

	    $('form').submit(function() {

	    	// for testing, output the JSON at the bottom of the page
	        $('#result').text(JSON.stringify($('form').serializeObject()));

	        $.post( "http://jaquith.org/api/submit/", JSON.stringify($('form').serializeObject()) );

	        return false;
	    });
	
	});
	
	
	/* optional triggers
	
	$(window).load(function() {
		
	});
	
	$(window).resize(function() {
		
	});
	
	*/

})(window.jQuery);
