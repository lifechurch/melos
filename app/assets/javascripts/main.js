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

  var nm = new Menus.NavMobile("#slideToNav","#nav_mobile");
  var n = new Menus.Notifications("#header .notifications-btn",".header-popover.notifications");
  var f = new Menus.FriendRequests("#header .friend-requests-btn",".header-popover.friend-requests"); 
  var mg = new Menus.MenuGroup("#header")
      mg.addMenu(nm)
      mg.addMenu(n)
      mg.addMenu(f)

  $(".moment-verse.empty").each(function() {
    new Moments.Verse({el: $(this)});
  });

  $(".comment-field").each(function() {
    var field = $(this);
    var list  = field.closest("form").siblings(".moment-comments-list")
    new Moments.CommentForm({
      textarea: field,
      update: list,
      template: $("#comment-list-item-tmpl")
    })
  });

  $(".social-feed .moment").wookmark({
    autoResize:   true,
    offset:       15,
    container:    $(".social-feed")
  });

  var timezone = jstz.determine();
  setCookie('cs-time-zone',timezone.name());
  
});

jQuery(window).load(function() { });
