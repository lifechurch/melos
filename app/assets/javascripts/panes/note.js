// Note Pane found in verse actions menu
function NotePane( el ) {
  this.el = $(el);
  this.note_content_field = this.el.find('textarea[name="note[content]"]');
  this.references_field = this.el.find("input[name='note[usfm_references]']");
  this.references_field.val("");

  this.initWYSIWYG();
}

NotePane.prototype = {
  constructor : NotePane,

  updateForm : function( data ) {
    var refs = data.references || "";
    this.references_field.val( refs.join("+") );
  },

  initWYSIWYG : function(){
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
  }
}