function setCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function deleteCookie(name) {
  setCookie(name,"",-1);
}

// Fire it off!
jQuery(document).ready(function() {
  window.app = new App();
  window.app.setPage( new Page() );

  $('.popover-link').click(function(e){
    e.preventDefault();
    var $this = $(this);
    var $headerPopover = $this.next('.header-popover');
    var popoverVisible = $this.siblings('.popover-link').next('.header-popover').hasClass('open');

    // if the popover is visible, close it
    if($headerPopover.hasClass('open')){
      $headerPopover.animate({'opacity' : '0'}, 200);
      $headerPopover.removeClass('open');
    }

    else if(popoverVisible){
      $('.header-popover').animate({'opacity' : '0'}, 200);
      $('.header-popover').removeClass('open');
      $headerPopover.animate({'opacity' : '1'}, 200);
      $headerPopover.addClass('open');
    }

    // otherwise, open it
    else {
      $headerPopover.animate({'opacity' : '1'}, 200);
      $headerPopover.addClass('open');
    }
    

  });  
});

jQuery(window).load(function() { });
