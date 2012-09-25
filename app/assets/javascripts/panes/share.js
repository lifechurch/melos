function SharePane( el ) {
  this.el           = $(el);
  this.form         = this.el.find("form");
  this.short_link   = this.el.find("#short_link");
  this.char_count   = this.el.find(".character_count");
  this.share_link_field     = this.el.find("#share_link");
  this.share_message_field  = this.el.find("textarea");

}

SharePane.prototype = {
  constructor : SharePane,

  updateForm : function( params ) {

    // Populate link fields
    var link = params.link;
    this.short_link.html( link );
    this.share_link_field.val( link );

    // Populate textarea message field
    var selected_content = this.getSelectedVersesContent();
    if( selected_content.length != 0 ) {

      var verses_str = $.makeArray(
        selected_content.map(function(){
          return $(this).html();
        })
      ).join(' ').trim();

      this.share_message_field.html( verses_str );

      // Populate character count info
      var chars_left = 140 - link.length - 1;
      this.char_count.remove();
      this.share_message_field.charCount({
        allowed: chars_left,
        css: "character_count"
      });
    }

  },

  getSelectedVersesContent : function() {
    return $('.verse.selected .content');
  }

}