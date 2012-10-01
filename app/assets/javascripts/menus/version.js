function VersionMenu( opts ) {
  this.menu         = $(opts.menu);
  this.trigger      = $(opts.trigger);
  this.alt_version  = opts.alt_version || false;
  this.initLinks();  // Copied directly from previous code.  Needs refactoring.
}

VersionMenu.prototype = {
  constructor : VersionMenu,

  isAlternateVersion : function() {
    return this.alt_version;
  },

  initLinks : function() {

    // Add spinner trigger class.
    var links = this.menu.find("th a, td a");
        links.each(function(i) {
          $(this).attr("data-spinner-trigger", true );
        });

    var thiss = this;

    this.menu.find('a').click(function(e) {
      e.preventDefault();

      // Todo: should definitely look at being refactored
      var tr            = $(this).closest('tr');
      var version_id    = tr.data("version");
      var abbrev        = tr.data("abbrev");
      var menu          = $(this).closest(".dynamic_menu.version_select");
      var path_chapter  = $('article .chapter').data('usfm');
      // using attr instead of data() to ensure that value doesn't get type cast to a number
      // ex: ".1" should not be type cast to 0.1 --> toString() turns into "0.1". In this case ".1" we want to be ".1"
      var path_verses   = $("article").attr("data-selected-verses-path-partial");

      var link_base     = '/bible/' + version_id + '/' + path_chapter;

      // hack, but works for now.
        if(thiss.isAlternateVersion()) {
          setCookie('alt_version', version_id );
          window.location = window.location.href;
          return;
        }

      // Could/should be properly refactored to not store path partial on html element.
      // Ex: path_verses --> ".1" or ".1,2,3" or ".1,22,45"

      if (path_verses && (path_verses != ".")) { link_base = link_base + path_verses;}

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