// Selected Verses dynamic menu

function SelectedMenu( opts ) {

  this.menu       = $(opts.menu);
  this.trigger    = $(opts.trigger);
  this.counter    = $('#verses_selected_count');
  this.accordion  = this.menu.find('.accordion');
  this.selected_count = 0;
  this.selected_references = [];

  this.initAccordion(); // setup our accordion actions / handlers

  this.bookmark_pane    = new BookmarkPane("#bookmark-pane");
  this.highlight_pane   = new HighlightPane("#highlight-pane");
  this.link_pane        = new LinkPane("#link-pane");
  this.share_pane       = new SharePane("#share-pane");

  $('#clear_selected_verses').on("click",$.proxy(function(e) {
    $(this).trigger("verses:clear");
    this.setTotal(0);
  },this));

  var widgets = $("div.widget.bookmarks, div.widget.notes, div.widget.ad_bible_app");
  var pnotes = $("div.widget.parallel_notes");
  var speed = 200;

  // Show note form when clicking the "New Note" menu item in the accordion.
  $("#new_note_modal").click( $.proxy(function(e) {
    e.preventDefault();
    this.close();
    widgets.hide( speed , function() {
      pnotes.show( speed );
    });
  },this));

  // Hide/show note form in widget sidebar
  pnotes.find('.cancel').click(function(e){
    e.preventDefault();
    pnotes.hide( speed , function() {
      widgets.show( speed );
    });
  });
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
    $("#li_selected_verses").removeClass("li_active");
    this.menu.hide();
  }
}