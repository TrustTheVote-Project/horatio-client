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

	  			if (n && this.value !== "") { // ignore the field if it doesn't follow the above format
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
	        else if (size(f) == 0) { // skip the fieldset if it's blank
	        	return;
	        }
	        else if (size(f) == 1 && fieldset == "assistant") { // don't make a new object for assistant field
	  			o[fieldset] = firstValue(f) || '';
        	}
	        else {
	            o[fieldset] = f || '';
	        }
	  	});
	    
	    return o;
	};

	/* trigger when page is ready */
	$(document).ready(function (){

		// hide our dialog boxes
		$('#modal-success').modal({ show: false})
		$('#modal-failure').modal({ show: false})

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

			var label = "";
			var doc_field = $("#reason__documentation");
			doc_field.show();

			switch($(this).val()) {
				case "1A":
				case "1B":
					label = "Please enter the name of your college or university.";
					break;
				case "1C":
				case "6D":
					label = "Please enter the name of your employer or business.";
					break;
				case "1D":
					label = "Please enter your place of travel (VA county/city or state or country).";
					break;
				case "1E":
					label = "Please enter the name of the employer or business and election day hours of working and commuting (AM to PM).";
					break;
				case "2B":
					label = "Please enter your relationship to the family member.";
					break;
				case "3A":
				case "3B":
					label = "Please enter the name of your institution.";
					break;
				case "5A":
					label = "Please describe the nature of your obligation.";
					break;
				case "6A":
					label = "Please enter your branch of service.";
					break;
				case "6B":
					label = "Please enter their branch of service.";
					break;
				case "6C":
					label = "Please enter your last date of residency at your Virginia voting residence only if you have given up that address permanently or have no intent to return.";
					break;
				case "7A":
					label = "Please enter your new state of residence and date moved from Virginia. Only eligible if you moved less than 30 days before the presidential election.";
					break;
				case "1F":
				case "2A":
				case "2C":
				case "4A":
				case "8A":
					doc_field.hide();
					break;
			}

			$("label[for='reason__documentation']").text(label);
		});

		// email/fax field
		$("input[name='email']").change( function() {
			var val = $(this).val();
			$("input[name='more_info__email_fax']").val(val);
		});

		// change state_or_country to state if a state
		$("select[name='deliv-state']").change( function() {
			var val = $(this).find("option:selected").val();
			$("input[name='delivery__state_or_country']").val(val);
		});

		// change state_or_country to country if a country other than US,
		// and remove state/ZIP fields
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

		// generate the signature date, which we have to do manually to avoid the inclusion of
		// microseconds
		var d = new Date();
		var formattedDate = d.getFullYear() + '-' + ('0' + d.getMonth()).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + 'T' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2) + 'Z';
		$("input[name='signature__date']").val(formattedDate);

	    $('form').submit(function(e) {

	    	e.preventDefault();
	    	// for testing, output the JSON at the bottom of the page
	        //$('#result').text(JSON.stringify($('form').serializeObject()));

	        $.post( "https://www.democraticabsentee.com/api/submit/", JSON.stringify($('form').serializeObject()) )
	        	
	        	.done(function() {
					// prohibit resubmissions of the form
					$(this).attr('disabled', 'disabled');
					$(this).parents('form').submit()
					//$('#result').text('Error: Your absentee ballot application could not be processed.');
					$('#modal-success').modal('show');
				})
				
				.fail(function() {
					$('#modal-failure').modal('show');
					//$('#result').text('Error: Your absentee ballot application could not be processed.');
				});

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
