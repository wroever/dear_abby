$(document).ready(function () {
	$("#submit-query").bind("click", function (e) {
		e.preventDefault();
		$("#result-text").removeClass("error");
		if ($("#query").val().length < 1) {
			$("#result-text").addClass("error").html("Please enter a query.");
		} else {
			var data = {};

			data.query = $("#query").val();
			console.log(JSON.stringify(data))
			
			$.ajax({
				type: 'POST',
				data: JSON.stringify(data),
		        contentType: 'application/json',
                url: '/endpoint',						
                success: function(data) {
                    $("#result-text").html(JSON.stringify(data));
                }
			});
			//$("#result-text").load("/endpoint",JSON.stringify(data),function (d) {});
		}
	});
});