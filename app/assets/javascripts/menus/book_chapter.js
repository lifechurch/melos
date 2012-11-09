// Class for managing the Books/Chapter dynamic menu selector.
// Found in the bible reader header.

function BookChapterMenu( opts ) {

  this.menu             = $(opts.menu);
  this.trigger          = $(opts.trigger);
  this.search_input     = this.menu.find('.search input');
  this.book_menu        = this.menu.find('#menu_book');
  this.chapter_menu     = this.menu.find('#menu_chapter');
  this.current_book     = $('#main article').data('book') || "jhn";
  this.current_chapter  = $('#main article').data('chapter') || "1";
  this.active_class     = "li_active";
  this.searchTimer      = null;

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
    link.blur();
  },this));


}

BookChapterMenu.prototype = {
  constructor : BookChapterMenu,

  populateChapters : function( book ) {

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
          classes += (book == this.current_book && chapter_name == this.current_chapter ? this.active_class : '');
          classes += (canonical) ? "canonical" : "info";

      list += '<li class="' + classes + '"><a href="/bible/' + version + "/" + chapter_usfm + '.' + abbrev + '">' + link_body + '</a></li>';
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
      var regexp = new RegExp(filter, 'i');
      $("#menu_book li").hide();
      $.each($("#menu_book li"), function() {
        if($(this).attr('data-meta').match(regexp)) $(this).show();
      });
      this.clearChapters();
      this.book_menu.find('.' + this.active_class).removeClass(this.active_class);
      //TODO: fire hover event and fill chapter list for first match
    }
    else{
      //empty search, show and restore current book
      $("#menu_book li").show();
      this.setCurrentBook(this.current_book);
      this.scrollToSelected();
      this.populateChapters(this.current_book);
    }

  },

  initSearch : function( book ) {
    //on keyup, start the countdown
    var thiss = this;

    thiss.search_input.keyup(function(){
      clearTimeout(thiss.searchTimer);
      thiss.searchTimer = setTimeout(thiss.filterBooks(thiss.search_input.val()), 350);
    });

    this.trigger.click(function() {
      setTimeout(function() {               // we wait because it may take a bit
        thiss.search_input.focus();         // to show the menu on slow browsers
      }, 100);
    });

    this.search_input.focus( function(){
      $(this).select();
    });
  }

}