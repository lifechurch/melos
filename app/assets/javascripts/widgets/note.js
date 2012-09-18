function NoteWidget( el , opts ) {
  this.el = $(el);
  this.init();
}

NoteWidget.prototype = {
  constructor : NoteWidget,

  init : function() {

  },

  show : function() {
    this.el.show();
  }
}