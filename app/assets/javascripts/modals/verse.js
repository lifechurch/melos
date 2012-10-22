function VerseModal(opts) {

  this.el       = $('#modal_single_verse');
  this.window   = $('#modal_single_verse #modal_window');
  this.overlay  = $('#modal_single_verse #modal_overlay');
  this.close    = this.window.find(".close");

  // show the modal
  var verses = $("article").data("selected-verses"); // value can be a single verse ("1") or multiple ("1,2,3")
  if (verses && this.enabled()) {
    if (verses >= 1) { this.show(); } // given ("1,2,3") this conditional does not pass for multi selected verses ex. /bible/1/jhn.1.3-5.kjv
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

  show : function() {
    this.window.show();
    this.overlay.show();

    var top = Math.round(this.window.outerHeight() / 2);
    var left = Math.round(this.window.outerWidth() / 2);

    this.window.css({ marginTop: -top, marginLeft: -left });
  },

  hide : function() {
    this.window.hide();
    this.overlay.hide();
  }
}