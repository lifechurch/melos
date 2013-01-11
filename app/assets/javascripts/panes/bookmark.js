// Bookmark Pane found in Selected Verses dynamic menu
function BookmarkPane( el ) {
  this.el = $(el);
  this.references_field = this.el.find(".verses_selected_input");
  this.references_field.val("");
}

BookmarkPane.prototype = {
  constructor : BookmarkPane,

  updateForm : function( data ) {
    var refs = data.references || [];
    console.log(data);
    this.references_field.val(refs.join(",")); // populate hidden field
  }
}