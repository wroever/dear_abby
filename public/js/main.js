$(document).ready(function () {
	var querying = false;
	/*
	var advisors = ["Abby","Harriette","Dan Savage"];
	var iter = 0;
	var l = 0;
	var typed = "";
	var should = true;
	var typeHeaderNames = setInterval(typeLoop, 300);
	function typeLoop() {
		if(should) {
			if(typed.length === advisors[iter].length) {
				clearInterval(typeHeaderNames);
				if(iter < advisors.length) {
					iter++;
					l = 0;
					typed = "";
					setTimeout(function () {
						typeHeaderNames = setInterval(typeLoop, 300);
					},1000);
				} else {
					should = false;
				}
			} else {
				typed += advisors[iter][l++];
				$("#who").html(typed);
			}
		}
	}
	*/
	function htmlDecode(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	}
	function submitSearchQuery(qType) {
		$(".sublinks").addClass('collapse');
		var data = { query : $("#query").val(),
					 qtype : qType};
		var $currentQ = $('a.list-group-item:eq('+qType+')');
		var $target = $currentQ.next();
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
            url: '/google'
		}).done(function(d) {
			if (++qType < 3) {
        		submitSearchQuery(qType);
        	} else {
        		querying = false;
        	}
			$target.html(d.html);
        }).fail(function () {
        	querying = false;
        	alert("Something went wrong. Please refresh the page and try again.");
        }).always(function (d) {
        	var n = typeof d == 'object' && d.hits ? d.hits : 0;
			$currentQ.find('.label-info').html(n).removeClass('hide');
			$currentQ.find('.results-loading').addClass('hide');
        });
	}
	function submitQuery(type) {
		var data = { query : $("#query").val() };

		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
            url: type
		}).done(function(html) {
            $("#result").html(html).promise().done(function () {
            	$(".show-more").click(function () {
            		$(".result-cont.more").slideDown();
            		$(this).hide();
            	});
            });
        }).fail(function () {
        	alert("Something went wrong. Please refresh the page and try again.");
        }).always(function () {
        	$("#results-loading").hide();
        });
	}
	$("#query").keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			submitQuery("results");
		}
	});
	$("#submit-query").bind("click", function (e) {
		e.preventDefault();
		//$("#result").empty();
		if ($("#query").val().length > 0) { submitQuery("results"); }
	});
	$("#submit-query-google").bind("click", function (e) {
		e.preventDefault();
		if(!querying) {
			if ($("#query").val().length > 0) {
				querying = true;
				$resultHeads = $("a.list-group-item");
				$resultHeads.each(function (i) {
					if($(this).attr('aria-expanded')) {
						$(this).click();
					}
				});
				$resultHeads.find('.label-info').addClass('hide').empty();
				$resultHeads.find('.results-loading').removeClass('hide');
				submitSearchQuery(0);
			}
		}
	});
});