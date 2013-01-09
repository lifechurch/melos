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

    // setup WYSIWYG editor
    this.note_content_field.wysiwyg({
      css: '/assets/wysiwyg/editor.css',
      initialContent: "",
      controls: {
        justifyLeft: { visible: false },
        justifyCenter: { visible: false },
        justifyRight: { visible: false },
        justifyFull: { visible: false },
        indent: { visible: false },
        outdent: { visible: false },
        subscript: { visible: false },
        superscript: { visible: false },
        undo: { visible: false },
        redo: { visible: false },
        insertHorizontalRule: { visible: false },
        h1: { visible: false },
        h2: { visible: false },
        h3: { visible: false },
        insertTable: { visible: false },
        code: { visible: false }
      },
      plugins: {
        i18n: { lang: getCookie('locale').toLowerCase() }
      }
    });
  },

  updateForm : function( data ) {
    var refs = data.references || "";
    var refs_field = this.form.find("input[name='note[references]']");
        refs_field.val( refs.join("+") );
  }

}