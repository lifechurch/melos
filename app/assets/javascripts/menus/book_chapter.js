function BookChapterMenu() {

  this.book_menu        = $('#menu_book');
  this.chapter_menu     = $('#menu_chapter');
  this.current_book     = $('.main_reader article').data('book');;
  this.current_chapter  = $('.main_reader article').data('chapter');
  this.active_class = "li_active";

  var thiss = this;

  this.selectInitialBook();

  //show chapters when users clicks a book
  this.book_menu.delegate('a', 'click', function(e) {
    var book = $(this).data("book");  // data-book attribute on book menu a tag.
    var link = $(this);
    var active_class = "li_active";

    thiss.setCurrentBook(book)
    thiss.populateChapters(book);

    e.preventDefault();
    this.blur();
  });
}

BookChapterMenu.prototype = {
  constructor : BookChapterMenu,

  selectInitialBook : function() {

    this.setCurrentBook( this.current_book );
    this.populateChapters( this.current_book );

  },

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

  setCurrentBook : function( book ) {

    this.current_book = book;
    var active_class = this.active_class;

    $('#menu_book_chapter #menu_book li').each(function(index) {
      var li      = $(this);
      var a       = $(this).find("a");
      var a_book  = a.data("book");

      if ( a_book == book ){
        li.addClass(active_class).siblings().removeClass(active_class);
        li.closest('#menu_book').data('selected-book-num', index + 1);
      }

    });
  }

}