$(document).ready(function () {
	function submitQuery() {
		var data = { query : $("#query").val() };
		//var data = { "a" : true };
		//console.log(JSON.stringify(data))
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
            url: '/results',						
            success: function(html) {
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
		$("#result-text").removeClass("error");
		if ($("#query").val().length < 1) {
			$("#result-text").addClass("error").html("Please enter a query.");
		} else {
			submitQuery();
		}
	});
});