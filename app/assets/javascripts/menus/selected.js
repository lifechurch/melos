function SelectedMenu( opts ) {
  this.menu     = $(opts.menu);
  this.trigger  = $(opts.trigger);
  this.counter  = $('#verses_selected_count');
  this.selected_count = 0;
  this.initAccordion(); // setup our accordion actions / handlers


  this.highlights_pane = new HighlightsPane("#highlights-pane");

  $('#clear_selected_verses').on("click",$.proxy(function(e) {
    $(this).trigger("verses:clear");
    this.setTotal(0);
  },this));

}

SelectedMenu.prototype = {
  constructor : SelectedMenu,

  setTotal : function(total) {
    this.selected_count = total;
    this.counter.html(total);

    var li = $('#li_selected_verses');

    if (total > 0) {
      li.removeClass("hide");
    }
    else {
      li.addClass("hide");
      this.menu.hide();
    }
  },

  initAccordion : function() {

    var accordion = this.menu.find('.accordion');

    if (!accordion.length) { return; }

    accordion.find('dt').click(function() {
      var dt = $(this);
      var dd = dt.next('dd');

      if (dd.is(':hidden')) {
        dd.slideDown('default', function() {
            // Animation complete, items visible
            if (dt.attr('id') == "link"){
              if(!dd.find('#ZeroClipboardMovie_1').length){
                clip.glue('copy_link', 'copy_link_container');
              }
            }
          }).siblings('dd').slideUp();
      }

      if(!dt.hasClass("propagate_click")){ return false; }
      this.blur();

    });

  }
}