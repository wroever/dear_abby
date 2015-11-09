$(document).ready(function () {
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
		$("#result").empty();
		if ($("#query").val().length < 1) {
			$("#result").html('<p class="lead error">Please enter a query.</p>');
		} else {
            $("#results-loading").show();
			submitQuery("results");
		}
	});
	$("#submit-query-google").bind("click", function (e) {
		e.preventDefault();
		$("#result").empty();
		if ($("#query").val().length < 1) {
			$("#result").html('<p class="lead error">Please enter a query.</p>');
		} else {
            $("#results-loading").show();
			submitQuery("google");
		}
	});
});