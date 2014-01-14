// Highlight Pane found in Selected Verses dynamic menu

function HighlightPane( el ) {
  this.el               = $(el);
  this.form             = this.el.find("form");
  this.references_field = this.form.find('input[name="highlight[usfm_references]"]');
  this.init();
}

HighlightPane.prototype = {

  constructor : HighlightPane,

  init : function() {

    // Setup the ColorPicker widget
    this.el.find('.color_picker').ColorPicker({
      flat: false,

      onChange: function(hsb, hex, rgb, el) {
        $(".colorpicker_hex").css('background-color', "#" + hex);
      },

      onSubmit: function(hsb, hex, rgb, el) {
        var id        = "highlight_" + hex;
        var selector  = "#" + id;
        // Get only the closest color_picker_ilst and append to
        // There are multiple on a given page due to desktop/mobile.
        $(el).closest(".color_picker_list").append("<button type='submit' name='highlight[color]' class='color' id='" + id +"' value='"+ hex +"'></button>");
        $(selector).css('background-color', '#' + hex);
        $(el).ColorPickerHide();
        $(selector).click();
      }
    });

    $(window).resize(function() { $('.colorpicker').hide(); });
  },

  getHighlightedVerses : function() {
    return $('.verse.selected.highlighted');
  },

  updateForm : function( params ) {

    var refs = params.references || [];
    this.references_field.val(refs.join("+")); // populate hidden field

    var highlights = this.getHighlightedVerses();
    // Populate existing_ids field
    if(highlights.length) {
      existing_ids = $.makeArray( this.getHighlightedVerses().map( function(){ return $(this).data('highlight-ids'); }));
      this.form.find('input[name="highlight[existing_ids]"]').val(existing_ids.join(','));
    }

    this.formatIcons( highlights );
  },

  formatIcons : function( highlights ) {
    // Style / hide highlight icons
    if(highlights.length) {
      // hide the 10th icon to make room for clear icon
      $('#highlight_9').addClass('hide');
      $('#clear_highlights').removeClass('hide');
    } else {
      $('#clear_highlights').addClass('hide');
      $('#highlight_9').removeClass('hide');
    }
  }
}