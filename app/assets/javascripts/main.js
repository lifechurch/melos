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

  // Toggle feature
  // Add  the attribute data-toggle-trigger="true" to any link
  // and data-toggle-target="#id-of-element"
  // This will turn the trigger element into a clickable element
  // to toggle the id of the target element with a SlideDown animation

  $('a[data-toggle-trigger="true"]').each(function() {
    var link = $(this);
    var target = $(link.data("toggle-target"));
    var toggle_class = "toggle-active"
    link.click(function(ev) {
      ev.preventDefault()
      if(target.hasClass(toggle_class)) { target.slideUp().removeClass(toggle_class); }
      else                              { target.slideDown().addClass(toggle_class); }
    });
  });


  // Setup tooltips on hovering over primary nav

  $("#nav_primary a.icon").each(function(){
    var link = $(this);
    var link_parent = link.parent();
    var link_text = link.data("title");
    var link_href = link.attr("href");
    
    // Build base tooltip element
    var tooltip_el = $('<a/>', {
      href: link_href,
      style: "display: none;",
      class: "tooltip"
    });

    // Build inner span for tooltip_el
    var tooltip_span = $('<span/>',{
      text: link_text
    });

    tooltip_el.append(tooltip_span);

    // Append the tooltip element to the hovered links parent.
    link_parent.append(tooltip_el);

    // Create a hover listener for the link to show the tooltip
    link_parent.hover(function(){
        $(this).find(".tooltip").fadeIn(100);
      }, function() {
        $(this).find(".tooltip").fadeOut(100);
    });
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
