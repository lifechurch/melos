$(function(){

	var toggleState = true;
	$('.share a').on("click", function(e) {
	  if(toggleState) {
	  	e.preventDefault();
	    $(this).parents('.share_wrapper').addClass('share_bg_effect');
		$(this).parents('.share').next('.share_panel').show();
		$('.share').css({'z-index':'1999'});
	  } else {
	  	e.preventDefault();
	    $(this).parents('.share_wrapper').removeClass('share_bg_effect');
		$(this).parents('.share').next('.share_panel').hide();
		$('.share').css({'z-index':'1'});
	  }
	  toggleState = !toggleState;
	});

});