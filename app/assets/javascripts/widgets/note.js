// Class to wrap functionality around the Parallel Note Widget
// This widget is activated when clicking on the "New Note" menu item
// in the Selected Verses dynamic menu.

function NoteWidget( el , opts ) {
  this.el     = $(el);
  this.form   = this.el.find("form");
  this.note_content_field = this.form.find('textarea[name="note[content]"]');
  this.init();
}

NoteWidget.prototype = {
  constructor : NoteWidget,

  init : function() {


  },

}