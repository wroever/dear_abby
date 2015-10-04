$(document).ready(function () {
	$("#submit-query").bind("click", function (e) {
		e.preventDefault();
		$("#result-text").removeClass("error");
		if ($("#query").val().length < 1) {
			$("#result-text").addClass("error").html("Please enter a query.");
		} else {
			/*
			$.get(function () {

			});
			*/
		}
	});
});