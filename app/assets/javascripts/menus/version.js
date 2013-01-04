function VersionMenu( opts ) {
  this.menu         = $(opts.menu);
  this.trigger      = $(opts.trigger);
  this.alt_version  = opts.alt_version || false;
  this.search_input = this.menu.find('.search input');
  this.searchTimer  = null;
  this.firstMatch   = 'first-match';
  this.activeClass  = 'li_active';
  this.hiddenClass  = 'hide';

  this.trigger.bind('click', $.proxy(this.loadVersions, this));

  this.initSearch();
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
      var path_chapter  = $('article .chapter').data('usfm') || 'JHN.1'; //TODO: grab first ref usfm in this version (from json model of version)
      // using attr instead of data() to ensure that value doesn't get type cast to a number
      // ex: ".1" should not be type cast to 0.1 --> toString() turns into "0.1". In this case ".1" we want to be ".1"
      var path_verses   = $("article").attr("data-selected-verses-path-partial");

      var link_base     = '/bible/' + version_id + '/' + path_chapter;

      // hack, but works for now.
      if(thiss.isAlternateVersion() && thiss.trigger.closest('li').hasClass(thiss.activeClass)) {
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
          window.location = link_base.toLowerCase();
        }
      }
    });

  },

  loadVersions : function(){
    var thiss = this;
    var rows = '';

    if (!this.menu.find('.loading').length > 0){
      // menu was loaded from another trigger, unbind
      this.trigger.unbind('click', $.proxy(thiss.loadVersions, thiss));
      return;
    }

    $.ajax({
      url: "/versions",
      method: "get",
      dataType: "json",
      success: function(languageGroups) {

        // create the new rows
        $.each(languageGroups.by_language, function(i, languageGroup) {
          rows += '<tr class="cat"><th colspan="2">' + languageGroup.name + '</th></tr>';

          $.each(languageGroup.versions, function(j, v){
            rows += '<tr data-version="' + v.id + '" data-meta="' + v.meta + '" >';
            rows += '<th><a href="#">' + v.abbr + '</a></th>';
            rows += '<td ' + ((v.audio) ? 'class="audio"' : '') + '><a href="#">' + '<div>' + v.title + '</div></a></td>';
            rows += '</tr>';
          });
        });

        // add new rows to table
        thiss.menu.find('.browse table').append(rows);

        // hookup click handlers for links
        // TODO: refactor to just create the links here, inline
        thiss.initLinks();

        // unbind all click handlers to load versions, hide loading text
        thiss.trigger.unbind('click', $.proxy(thiss.loadVersions, thiss));
        thiss.menu.find('.loading').remove();

      },//end success function
      error: function(req, status, err) {
        var loading = thiss.menu.find('.loading');
        loading.html(loading.data('error-text'));
      }//end error function
    });//end ajax delegate
  },

  filterVersions : function (filter) {
    if(filter.length){
      var regexp = new RegExp(filter, 'i');
      var category = null;
      var thiss = this;

      // hide all rows and remove previous first-match
      this.menu.find("tr").hide();
      this.menu.find("tr." + this.firstMatch).removeClass(this.firstMatch);
      var noMatch = true;


      // show matching rows
      $.each(this.menu.find("tr"), function() {
        if($(this).hasClass('cat')){
          //show matching categories and all versision 'within'
          if($(this).find('th').html().match(regexp)){
            // show matching version row
            $(this).show();

            // give first match hover style
            if (noMatch){
              $(this).next('tr').addClass(thiss.firstMatch);
              noMatch = false;
            }

            // and all versions
            $(this).nextUntil('tr.cat').show();
          }
        }
        else if($(this).attr('data-meta').length){
          // show matching versions and their category headers
          if($(this).attr('data-meta').match(regexp)){
            // show matching version row
            $(this).show();

            // give first match hover style
            if (noMatch){
              $(this).addClass(thiss.firstMatch);
              noMatch = false;
            }

            // show closest language header
            category = $(this).prev('tr.cat'); //if immediately previous sibling
            if (category.length == 0){
              // if more than one sibling back -- avoiding use of prevAll() inefficiently
              category = $(this).prevUntil('tr.cat').last().prev();
            }
            category.show();
          }
      }
      });
      //TODO: highlight first result via css
      //.dynamic_menu .browse.searching li:first(visible)
      //TODO: fire hover event so user knows what would select if enter is pressed
    }
    else{
      //empty search, show list
      this.menu.find("tr, th").show();
    }

  },

  initSearch : function() {
    //on keyup, start the countdown
    var thiss = this;

    this.trigger.click(function(){                        // focus search on menu open
      setTimeout(function() {                             // we have to wait because it takes a bit
        thiss.search_input.focus();                       // to show the menu (?!)
      }, 100);
    });

    this.search_input.focus( function(){
      $(this).select();
    });

    this.search_input.keyup(function(){                   // search as user types
      clearTimeout(thiss.searchTimer);
      thiss.searchTimer = setTimeout(thiss.filterVersions(thiss.search_input.val()), 350);
    });

    this.search_input.keyup(function(e){                  // enter selects first match
      if(e.keyCode == 13) {
        thiss.menu.find('.' + thiss.firstMatch + ' a').click();
      }
    });
  }

}