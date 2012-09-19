function HighlightsPane( el ) {

  this.el = $(el);
  this.init();
}

HighlightsPane.prototype = {

  constructor : HighlightsPane,

  init : function() {

    $('.color_picker').ColorPicker({
      flat: false,
      onChange: function(hsb, hex, rgb, el) {
        $(".colorpicker_hex").css('background-color', "#" + hex)
      },
      onSubmit: function(hsb, hex, rgb, el) {
        $(".color_picker_list").append("<button type='submit' name='highlight[color]' class='color' id='highlight_" + hex +"' value='"+ hex +"' style='display: none; background-color: #'" + hex + "'></button>");
        $("#highlight_" + hex).click();
        $("#highlight_" + hex).css('background-color', '#' + hex);
        $(el).ColorPickerHide();
      }
    });

    $(window).resize(function() {
        $('.colorpicker').hide();
    });
  }

}