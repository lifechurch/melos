function VersionMenu( opts ) {
  this.menu       = $(opts.menu);
  this.trigger    = $(opts.trigger);
  this.initLinks();  // Copied directly from previous code.  Needs refactoring.
}

VersionMenu.prototype = {
  constructor : VersionMenu,

  initLinks : function() {

    // Add spinner trigger class.
    var links = this.menu.find("th a, td a");
        links.each(function(i) {
          $(this).attr("data-spinner-trigger", true );
        });


    this.menu.find('a').click(function() {
      var version_id = $(this).closest('tr').data("version");
      var abbrev = $(this).closest('tr').data("abbrev");
      var menu = $(this).closest(".dynamic_menu.version_select");
      var path_verses = $("article").data("selected-verses-path-partial");
      var path_chapter = $('article .chapter').data('usfm');
      var link_base = '/bible/' + version_id + '/' + path_chapter;

      if (path_verses) link_base = link_base + path_verses;
      link_base = link_base + "." + abbrev;

      //TODO: erase this hack with new reading plans design (in-reader
      var plan_url = menu.data("plan-url");
      if (plan_url) link_base = plan_url;

      if (version_id){
        var recent = getCookie('recent_versions');
        if (recent == null){
          recent = [];
        }else {
          //extra caution here because of IE bug with .indexOf on empty array
          //buble up the version just picked if it was already in list
          recent = recent.split('/');
          var exists = recent.indexOf(String(version_id));
          //remove version if it already is in recent list
          if(exists != -1) recent.splice(exists, 1);
        }

        //add new version to beginning of recents list cookie
        recent.unshift(version_id);
        recent_str = recent.splice(0,5).join('/');
        setCookie('recent_versions', recent_str);

        //send user on to new page as requested
        if (menu.data("link-needs-param")){
          var delim = (link_base.indexOf("?") != -1) ? "&" : "?";
          window.location = link_base + delim + "version=" + version_id;
        }else{
          window.location = link_base;
        }
      }
    });

  }
}