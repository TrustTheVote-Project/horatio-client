// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs

// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);

// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }


// remap jQuery to $
(function($){

	// length of an object
	var size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	}

	// return an object's first value
	var firstValue = function(obj) {
	    for (var key in obj) return obj[key];
	}
	

	$.fn.serializeObject = function() {
	    
	    var o = {};

	  	$.each(this.find("fieldset"), function() {
	    	var f = {};
	  		var fieldset = $(this).attr("id");

	  		var a = $(this).serializeArray();
	  		$.each(a, function() {

	  			// input names follow the format "[fieldset id]_[n]"
	  			var n = this.name.split('__')[1];

	  			if (n) { // ignore the field if it doesn't follow the above format
			        if (f[n] !== undefined) {
			            if (!f[n].push) {
			                f[n] = [f[n]];
			            }
			            f[n].push(this.value || '');
			        }
			        else {
			        	// make sure booleans aren't expressed as strings
			            if (this.value == "true")
			            	f[n] = true;
			            else
			            	f[n] = this.value || '';
			        }
			    }
		    });

	  		// add each fieldset object to the meta object
		    if (o[fieldset] !== undefined) {
	            if (!o[fieldset].push) {
	                o[fieldset] = [o[fieldset]];
	            }
	            o[fieldset].push(f || '');
	        }
	        else {
	        	// don't make a new object unless there's > 1 value
	        	if (size(f) <= 1) {
		  			o[fieldset] = firstValue(f) || '';
	        	}
		  		else
	            	o[fieldset] = f || '';
	        }
	  	});
	    
	    return o;
	};

	/* trigger when page is ready */
	$(document).ready(function (){

		// update locality hidden field with locality_gnis select value
		$("select[name='election__locality_gnis']").change( function() {
			var val = $(this).find("option:selected").text();
			$("input[name='election__locality']").val(val);
		});

		// generate single date values from multiple selects
		$(".date").change( function() {
			var date = $(this).find(".year").val() + "-" +
						$(this).find(".month").val() + "-" +
						$(this).find(".day").val();
			$(this).find("input[type='hidden']").val(date);
		});

		// reason documentation field
		$("input[name='reason__code']").change( function() {
			// get label text, remove extranneous spaces and new lines
			var val = $(this).parent("label").text().replace(/([ ][ ]|\n)/g,"");
			$("input[name='reason__documentation']").val(val);
		});

		// generate telephone value from multiple selects
		$(".phone").change( function() {
			var date = $(this).find("input:eq(0)").val() + "-" +
						$(this).find("input:eq(1)").val() + "-" +
						$(this).find("input:eq(2)").val();
			$(this).find("input[type='hidden']").val(date);
		});

		// change state_or_country to state if a state
		$("select[name='deliv-state']").change( function() {
			var val = $(this).find("option:selected").val();
			$("input[name='delivery__state_or_country']").val(val);
		});

		// change state_or_country to country if a country other than US,
		// and remove state/zip fields
		$("select[name='country']").change( function() {
			var val = $(this).find("option:selected").val();
			if (val != "United States") {
				$("input[name='delivery__state_or_country']").val(val);
				$("#delivery__statezip").hide();
			}
			else {
				$("input[name='delivery__state_or_country']").val($("select[name='deliv-state'] option:selected").val());
				$("#delivery__statezip").show();
			}
		});

		// generate signature date
		var todays_date = new Date();
		$("input[name='signature__date']").val(todays_date.toISOString());

	    $('form').submit(function(e) {

	    	// for testing, output the JSON at the bottom of the page
	    	e.preventDefault();
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
