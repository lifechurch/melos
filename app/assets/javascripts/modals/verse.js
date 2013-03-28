function VerseModal(opts) {

  this.el         = $('#modal_single_verse');
  this.window     = $('#modal_single_verse .window');
  this.overlay    = $('#modal_single_verse .overlay');
  this.close      = this.window.find(".close");
  this.open       = false;

  // show the modal
  var verses = $("article").attr("data-selected-verses").split(","); //using attr() here so jQuery doesn't type cast, just give me a string.
  if (verses && this.enabled()) {
    if (verses.length > 0) {
      this.open = true;
      var thiss = this;
      var windowH = $(window).height();

      jRes.addFunc({
        breakpoint: 'mobile',
        enter: function() {
          // done with CSS
          if (this.open){ 
            thiss.showMobile();
            $('article').css({'height' : '0px'});
            $(thiss.window).css({'height' : windowH});
          }
        },
        exit: function() {
          // noop
        }
      });

      jRes.addFunc({
        breakpoint: 'widescreen',
        enter: function() {
          if (verses.length > 0 && this.open) {
            thiss.showWidescreen();
          }
        },
        exit: function() {
          // noop
        }
      });
    }
  }

  this.overlay.click($.proxy( function(e){
      e.preventDefault();
      this.hide();
    },this ));

  this.close.mousedown($.proxy( function(e) {
      e.preventDefault();
      this.hide();
    },this ));

  $("#single_verse_read_link").click($.proxy( function(e) {
      e.preventDefault();
      this.hide();
      $('article').css({'height' : 'auto'});
    },this ));

  $(document).keydown($.proxy(function(e) {
      if(e.keyCode === 27) this.hide(); // 27 === ESCAPE
    },this ));

}

VerseModal.prototype = {
  constructor: VerseModal,

  enabled : function() {
    return $("article").data("verse-modal-enabled");
  },

  showWidescreen : function() {
    this.window.show();
    this.overlay.show();

    var top = Math.round(this.window.outerHeight() / 2);
    var left = Math.round(this.window.outerWidth() / 2);

    this.window.css({ marginTop: -top, marginLeft: -left });
  },

  showMobile : function() {
    this.window.css({ marginTop: 0, marginLeft: 0 });
  },

  hide : function() {
    this.window.hide();
    this.overlay.hide();
    this.open = false;
    reader.scrollToVerse();
  }
}