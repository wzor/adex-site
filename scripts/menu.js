$(function(){
	$('#navigation').on('click', 'a', function() {
		$('#menu-toggle').prop('checked', false);
	});
	$(document).scroll(function() { 
		var scrollTop = $(this).scrollTop();
		if (scrollTop > 30) $("nav").addClass("background");
		else $("nav").removeClass("background");
	}).trigger('scroll');
});