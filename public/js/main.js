$(document).ready(function () {
	function submitQuery(type) {
		var data = { query : $("#query").val() };

		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
            url: type,						
            success: function(html) {
            	$("#results-loading").hide();
                $("#result").html(html).promise().done(function () {
                	$(".show-more").click(function () {
                		$(".result-cont.more").slideDown();
                		$(this).hide();
                	});
                });
            }
		});

	}
	$("#query").keypress(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			submitQuery();
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