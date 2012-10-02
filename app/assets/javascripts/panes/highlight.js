// Highlight Pane found in Selected Verses dynamic menu

function HighlightPane( el ) {
  this.el     = $(el);
  this.form   = this.el.find("form");
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
        $(".color_picker_list").append("<button type='submit' name='highlight[color]' class='color' id='highlight_" + hex +"' value='"+ hex +"' style='display: none; background-color: #'" + hex + "'></button>");
        $("#highlight_" + hex).css('background-color', '#' + hex);
        $("#highlight_" + hex).click();
        $(el).ColorPickerHide();
      }
    });

    $(window).resize(function() { $('.colorpicker').hide(); });
  },

  getHighlightedVerses : function() {
    return $('.verse.selected.highlighted');
  },

  updateForm : function( params ) {

    var selected_verses = params.selected_verses;
    var highlights = this.getHighlightedVerses();

    // Populate references field
    if(selected_verses.length) {
      this.form.find('input[name="highlight[references]"]').val(selected_verses.join(','));
    }

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