// Class for managing the Books/Chapter dynamic menu selector.
// Found in the bible reader header.

function BookChapterMenu( opts ) {

  this.menu              = $(opts.menu);
  this.trigger           = $(opts.trigger);
  this.search_input      = this.menu.find('.search input');
  this.book_menu         = this.menu.find('#menu_book');
  this.chapter_menu      = this.menu.find('#menu_chapter');
  this.loaded_book       = $('#main article').data('book');
  this.current_book      = $('#main article').data('book') || "jhn";
  this.current_chapter   = $('#main article').data('chapter') || "1";
  this.active_class      = "li_active";
  this.searchTimer       = null;
  this.firstMatch        = 'first-match';
  this.book_chapter_tabs = $('.tab_navigation.ref a');
  this.book_tab          = $('a.book');
  this.chapter_tab       = $('a.chapter');
  this.FontSettings      = $('#font_settings');
  this.SizeSettings      = $('#size_settings');
  this.ExtraSettings     = $('#extra_settings');
  this.font              = $('.tab_navigation.settings a.font');
  this.font_size         = $('.tab_navigation.settings a.font_size');
  this.extras            = $('.tab_navigation.settings a.extras');

  // Select initial book
  this.setCurrentBook( this.current_book );
  this.populateChapters( this.current_book );
  this.initSearch( this.current_book );

  //show chapters when users clicks a book
  this.book_menu.delegate('a', 'click', $.proxy(function(e) {
    e.preventDefault();

    var link = $(e.currentTarget);
    var book = link.data("book");  // data-book attribute on book menu a tag.

    this.setCurrentBook(book);
    this.populateChapters(book);
    this.showChapters();
    window.scrollTo(0,0);
    link.blur();
  },this));

  // setup click handlers for book/chapter tabs
  $('.chapter').click($.proxy(function(e){
    e.preventDefault();
    this.showChapters();
  },this));

  $('.book').click($.proxy(function(e){
    e.preventDefault();
    this.showBooks();
  },this));

  // setup click handlers for the settings tabs
  $('.font').click($.proxy(function(e){
    e.preventDefault();
    this.showFontSettings();
  },this));

  $('.font_size').click($.proxy(function(e){
    e.preventDefault();
    this.showSizeSettings();
  },this));

  $('.extras').click($.proxy(function(e){
    e.preventDefault();
    this.showExtraSettings();
  },this));

}

BookChapterMenu.prototype = {
  constructor : BookChapterMenu,

  populateChapters : function( book ) {

    // Handle case where requested book/chapters is not actually available in this version
    // One book versions is an example (v564) - can't request any other version than "mrk".
    if(book == undefined || version_json.books[book] == undefined) return;

    // version_json is currently embedded directly in markup.
    // Could create an endpoint for this and make a separate request or store locally in another format

    var version = version_json.id;
    var abbrev  = version_json.abbreviation;

    var list = '';
    var chapters = version_json.books[book].chapters;

    for( var i = 0; i < chapters.length; i++) {
      var canonical = chapters[i].canon;

      var chapter_name = chapters[i].human;
      var chapter_usfm = chapters[i].usfm;

      var link_body = (canonical) ? chapter_name : "i";
      var classes = ""
          classes += (book == this.loaded_book && chapter_name == this.current_chapter) ? this.active_class : '';
          classes += (canonical) ? " canonical" : " info";

      var locale = $('html').data("locale")
      locale = (locale == "en") ? '' : "/" + locale;
      list += '<li class="' + classes + '"><a href="' + locale + '/bible/' + version + "/" + chapter_usfm + '.' + abbrev + '">' + link_body + '</a></li>';
    }
    var chapters_ol = $("#chapter_selector");
        chapters_ol.html(list);
  },

  clearChapters : function() {
    $("#chapter_selector").html('');
  },

  setCurrentBook : function( book ) {

    this.current_book = book;

    var book = book;
    var active_class = this.active_class;
    var book_menu = this.book_menu;

    book_menu.find("li").each(function(index) {
      var li      = $(this);
      var a       = li.find("a");
      var a_book  = a.data("book");

      if ( a_book == book ){
        li.addClass(active_class).siblings().removeClass(active_class);
        book_menu.data('selected-book-num', index + 1);
      }
    });
  },

  scrollToSelected : function(){
    // Scroll to book if this menu is book/chapter menu.
    if (this.book_menu.is(':visible')){
      var location = this.book_menu.find('li.' + this.active_class).offset().top - this.book_menu.offset().top + this.book_menu.scrollTop() - 27;
      this.book_menu.find('.scroll').scrollTop(location);
    }
    // TODO: set up event to execute code when made visible (else for ^^)
  },

  filterBooks : function (filter) {
    if(filter.length){
      var thiss = this;
      var regexp = new RegExp(filter, 'i');

      // hide all books and unflag first match
      this.menu.find("li").hide();
      this.menu.find("li." + this.firstMatch).removeClass(this.firstMatch);
      var noMatch = true;

      // show matching books
      $.each(thiss.menu.find("li[data-meta]"), function() {
        if($(this).attr('data-meta').match(regexp)){
          $(this).show();

          // mark first match
          if(noMatch) {
            $(this).addClass(thiss.firstMatch);
            noMatch = false;
          }
        }
      });

      // select and populate chapter list for first match
      this.clearChapters();
      this.book_menu.find('.' + this.active_class).removeClass(this.active_class);
      //TODO: fire hover event and fill chapter list for first match
    }
    else{
      //empty search, show and restore loaded book
      $("#menu_book li").show();
      this.book_menu.find('.' + this.active_class).removeClass(this.active_class);
      this.setCurrentBook(this.loaded_book);
      this.scrollToSelected();
      this.populateChapters(this.loaded_book);
    }

  },

  initSearch : function( book ) {
    //on keyup, start the countdown
    var thiss = this;

    this.trigger.click(function() {                           // focus filter input on menu show
      setTimeout(function() {          // we wait because it may take a bit
        thiss.search_input.focus();    // to show the menu on slow browsers
      }, 100);
    });

    this.search_input.focus( function(){                      // select any existing text on focus
      $(this).select();
    });

    this.search_input.keyup(function(){
      clearTimeout(thiss.searchTimer);
      thiss.searchTimer = setTimeout(thiss.filterBooks(thiss.search_input.val()), 350);
    });

    this.search_input.keyup(function(e){                  // enter or tab selects first match
      if(e.keyCode == 13 || e.keyCode == 9) {
        var firstMatchLink = thiss.menu.find('.' + thiss.firstMatch + ' a');
        if (firstMatchLink.click()){
          thiss.setCurrentBook(firstMatchLink.data("book"));
          thiss.search_input.val(firstMatchLink.html()).blur();
          thiss.menu.find("li." + thiss.firstMatch).removeClass(thiss.firstMatch);
        }
      }
    });
  },

  showBooks : function() {
    this.chapter_menu.addClass('hide_list');
    this.book_menu.removeClass('hide_list');
    this.chapter_tab.removeClass('selected');
    this.book_tab.addClass('selected');
  },

  showChapters : function() {
    this.book_menu.addClass('hide_list');
    this.chapter_menu.removeClass('hide_list');
    this.book_tab.removeClass('selected');
    this.chapter_tab.addClass('selected');
  },

  showFontSettings : function() {
    this.SizeSettings.addClass('hide_list');
    this.ExtraSettings.addClass('hide_list');
    this.FontSettings.removeClass('hide_list');
    this.font.addClass('selected');
    this.font_size.removeClass('selected');
    this.extras.removeClass('selected');
  },

  showSizeSettings : function() {
    this.FontSettings.addClass('hide_list');
    this.ExtraSettings.addClass('hide_list');
    this.SizeSettings.removeClass('hide_list');
    this.font_size.addClass('selected');
    this.font.removeClass('selected');
    this.extras.removeClass('selected');
  },

  showExtraSettings : function() {
    this.FontSettings.addClass('hide_list');
    this.SizeSettings.addClass('hide_list');
    this.ExtraSettings.removeClass('hide_list');
    this.extras.addClass('selected');
    this.font_size.removeClass('selected');
    this.font.removeClass('selected');
  }
}