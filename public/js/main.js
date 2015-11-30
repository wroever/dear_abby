var q;

$(document).ready(function () {
	var querying = false;
	function htmlDecode(input){
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
	}
	function submitSearchQuery(qType,via) {
		$(".sublinks").addClass('collapse');
		var data = { query : $("#query").val(),
					 qtype : qType};
		var $currentQ = $('a.list-group-item:eq('+qType+')');
		var $target = $currentQ.next();
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
            url: via
		}).done(function(d) {
			if (++qType < 3) {
        		submitSearchQuery(qType,via);
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
	q = submitSearchQuery;
	$("#query").keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			submitSearchQuery(0,'/results');
		}
	});
	$("#submit-query").bind("click", function (e) {
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
				submitSearchQuery(0,'/results');
			}
		}
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
				submitSearchQuery(0,'/google');
			}
		}
	});
});