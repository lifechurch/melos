function VerseModal(opts) {

  this.el       = $('#modal_single_verse');
  this.window   = $('#modal_single_verse .window');
  this.overlay  = $('#modal_single_verse .overlay');
  this.close    = this.window.find(".close");

  // show the modal
  var verses = $("article").attr("data-selected-verses").split(","); //using attr() here so jQuery doesn't type cast, just give me a string.
  if (verses && this.enabled()) {

    if (verses.length == 1) { this.show();}
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