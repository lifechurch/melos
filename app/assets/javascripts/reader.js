function Reader(opts) {
  this.version    = opts.version || "";
  this.abbrev     = opts.abbrev || "";
  this.reference  = opts.reference || "";
  this.book       = opts.book || "";
  this.book_api   = opts.book_api || "";
  this.book_human = opts.book_human || "";
  this.chapter    = opts.chapter || "";
  this.selected_verses = [];

  this.font         = opts.font || "";
  this.size         = opts.size || "";
  alert(opts.full_screen);
  this.full_screen  = opts.full_screen || false;

  this.html_el  = $(document.documentElement);
}

Reader.prototype = {
  constructor : Reader,
  init : function() {

    var thiss = this;
    var button = $('#button_full_screen');
        button.click( function(e) {
          thiss.toggleFullScreen();
          e.preventDefault();
        });
  },

  isFullScreen : function() {
    return this.full_screen;
  },

  toggleFullScreen : function() {
    if(this.isFullScreen()) {
      alert("isFULL");
      this.html_el.removeClass("full_screen");
      deleteCookie("full_screen");
      this.full_screen = false;

      YV.misc.kill_widget_spacers();
      YV.init.fixed_widget_header();
      YV.init.fixed_widget_last();
    }
    else {
      alert("isntFULL");
      this.html_el.addClass("full_screen");
      setCookie("full_screen", 1);
      this.full_screen = true;
    }
  }
}