// Selected Verses dynamic menu

function SelectedMenu( opts ) {

  this.menu       = $(opts.menu);
  this.trigger    = $(opts.trigger);
  this.counter    = $('#verses_selected_count');
  this.accordion  = this.menu.find('.accordion');
  this.selected_count = 0;
  this.initAccordion(); // setup our accordion actions / handlers
  this.selected_references = [];

  this.bookmark_pane    = new BookmarkPane("#bookmark-pane");
  this.highlight_pane   = new HighlightPane("#highlight-pane");
  this.link_pane        = new LinkPane("#link-pane");
  this.share_pane       = new SharePane("#share-pane");

  $('#clear_selected_verses').on("click",$.proxy(function(e) {
    $(this).trigger("verses:clear");
    this.setTotal(0);
  },this));


  // Hide/show note form in widget sidebar

  $("div.widget.parallel_notes").find('a.cancel').click(function(){
    $("div.widget.parallel_notes").hide(200, function() {
      $("div.widget.bookmarks, div.widget.notes, div.widget.ad_bible_app").show(200);
    });
    return false;
  });

  $("#new_note_modal").click( $.proxy(function(e) {
    e.preventDefault();
    this.close();
    $("div.widget.bookmarks, div.widget.notes, div.widget.ad_bible_app").hide(200, function() {
      $("div.widget.parallel_notes").show(200);
    });
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

  setSelectedRefs : function( refs ) {
    this.selected_references = refs;
    this.bookmark_pane.updateForm({references: this.selected_references});
  },

  updateHighlights : function( selected_verses ) {
    this.highlight_pane.updateForm({ selected_verses : selected_verses })
  },

  updateLink : function( link ) {
    this.link_pane.setLink(link);
  },

  updateSharing : function( params ) {
    this.share_pane.updateForm( params )
  },

  initAccordion : function() {

    if (!this.accordion.length) { return; }

    var thiss = this;

    this.accordion.find('dt').click(function(e) {
      var dt = $(this);
      var dd = dt.next('dd');

      if (dd.is(':hidden')) {
        dd.slideDown('default', function() {
          // Animation complete, items visible
          if (dd.attr('id') == "link-pane"){
            if(!dd.find('#ZeroClipboardMovie_1').length){
              thiss.link_pane.renderClipboard();
            }
          }
        }).siblings('dd').slideUp();
      }

      if(!dt.hasClass("propagate_click")){ e.stopPropagation(); return false; }
      this.blur();

    });

  },

  close : function() {
    this.trigger.parent('li').removeClass('li_active');
    this.menu.hide();
  }
}