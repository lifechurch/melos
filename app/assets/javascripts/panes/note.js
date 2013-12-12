// Note Pane found in verse actions menu
function NotePane( el ) {
  this.el = $(el);
  this.note_content_field = this.el.find('textarea[name="note[content]"]');
  this.references_field = this.el.find("input[name='note[usfm_references]']");
  this.references_field.val("");
}

NotePane.prototype = {
  constructor : NotePane,

  updateForm : function( data ) {
    var refs = data.references || "";
    this.references_field.val( refs.join("+") );
  }
}