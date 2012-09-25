function LinkPane( el ) {

  ZeroClipboard.setMoviePath('/assets/lib/ZeroClipboard.swf');

  this.el           = $(el);
  this.copy_button  = $("#copy_link");
  this.clipper      = new ZeroClipboard.Client();
  this.link         = "";

  this.clipper.setHandCursor(true);

  //if (IE8){ copy_button.hide(); } // guessing this is due to a bug?

  this.clipper.addEventListener('complete', $.proxy(function(client, text) {
    var html = this.copy_button.html();
    var btn = this.copy_button;
        btn.html(btn.data('confirm-text'));
    setTimeout(function() {btn.html(html);}, 2000);
  },this));

  // have to set the text on mouseover to avoid bug with ZeroClipboard.
  this.clipper.addEventListener('mouseover', $.proxy(function(client) {
    client.setText( this.clipper_text );
  },this));

}

LinkPane.prototype = {

  constructor : LinkPane,

  // ZeroClip 'glue' needs to happen when the element is rendered on the page
  // Essentially when the element is visible.  This ensures that the
  // flash movie has a proper width and height set.  This should be
  // called via script when the 'copy_link' dom element becomes visible.
  renderClipboard : function() {
    this.clipper.glue('copy_link', 'copy_link_container');
  },

  setLink : function( link ) {
    this.link = link;
  }

}