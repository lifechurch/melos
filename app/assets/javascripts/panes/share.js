function SharePane( el ) {
  this.el           = $(el);
  this.form         = this.el.find("form");
  this.short_link   = this.el.find("#short_link");
  this.share_link_field     = this.el.find("#share_link");
  this.tw_share_message_field  = this.el.find(".share_verse_twitter");
  this.fb_share_message_field  = this.el.find(".share_verse_facebook");
  this.textarea = this.el.find('textarea');
}

SharePane.prototype = {
  constructor : SharePane,

  updateForm : function( params ) {

    // Populate link fields
    var link = params.link.toLowerCase();
    this.short_link.html( link );
    this.share_link_field.val( link );

    this.el.find(".character_count").remove();

    // Populate textarea message field
    var selected_content = this.getSelectedVersesContent();
    if( selected_content.length != 0 ) {
      var verses_str = $.makeArray(
        selected_content.map(function(){
          return $(this).html();
        })
      ).join(' ').trim();

      this.textarea.html( verses_str );

      // Populate character count info
      var chars_left = 140 - link.length - 1;
      this.tw_share_message_field.charCount({
        allowed: chars_left,
        css: "character_count",
        target: this.textarea
      });

      // Populate character count info
      chars_left = 420 - link.length - 1;
      this.fb_share_message_field.charCount({
        allowed: chars_left,
        css: "character_count",
        target: this.textarea
      });
    }

  },

  getSelectedVersesContent : function() {
    return $('#version_primary .verse.selected .content');
  }

}