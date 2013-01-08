// Selected Verses dynamic menu

function SelectedMenu( opts ) {

  this.menu                = $(opts.menu);
  this.counter             = $('#verses_selected_count');
  this.panes               = this.menu.find('dl');
  this.selected_count      = 0;
  this.selected_references = [];
  this.clear_trigger       = this.menu.find('dt.clear-verses');

  this.initPanes(); // setup our pane actions / handlers

  this.highlight_pane   = new HighlightPane("#highlight-pane");
  this.bookmark_pane    = new BookmarkPane("#bookmark-pane");
  this.share_pane       = new SharePane("#share-pane");
  this.link_pane        = new LinkPane("#link-pane");
  this.note_pane       = new SharePane("#note-pane");

  this.clear_trigger.on("click",$.proxy(function(e) {
    e.preventDefault();
    $(this).trigger("verses:clear");
    this.setTotal(0);
  },this));
}

SelectedMenu.prototype = {
  constructor : SelectedMenu,

  setTotal : function(total) {
    this.selected_count = total;
    this.counter.html(total);

    (total > 0) ? this.open() : this.close()
  },

  open : function() {
    this.menu.show();
  },

  close : function() {
    this.menu.hide();
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

  initPanes : function() {

    if (!this.panes.length) { return; }

    var thiss = this;

    this.panes.find('dt').click(function(e) {
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

      this.blur();
    });

  },
}