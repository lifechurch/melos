// Selected Verses dynamic menu

function SelectedMenu( opts ) {

  this.menu                = $(opts.menu);
  this.counter             = $('#verses_selected_count');
  this.paneList            = this.menu.find('dl');
  this.selected_count      = 0;
  this.selected_references = [];
  this.clear_trigger       = this.menu.find('dt.clear-selected');
  this.activeClass         = 'active';
  this.readerArticle       = $('article');

  this.initPanes(); // setup our pane actions / handlers

  this.highlight_pane      = new HighlightPane("#highlight-pane");
  this.bookmark_pane       = new BookmarkPane("#bookmark-pane");
  this.share_pane          = new SharePane("#share-pane");
  this.link_pane           = new LinkPane("#link-pane");
  this.note_pane           = new SharePane("#note-pane");

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

    // de-activate any panes
    this.paneList.find('dd').hide();
    this.paneList.find('dt').removeClass(this.activeClass);
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

    if (!this.paneList.length) { return; }

    var thiss = this;

    this.paneList.find('dt').click(function(e) {
      var dt = $(this);
      var dd = dt.next('dd');

      if (dd.is(':hidden')) {
        dt.addClass(thiss.activeClass);
        dd.slideDown('default', function() {
          // Animation complete, items visible
          if (dd.attr('id') == "link-pane"){
            if(!dd.find('#ZeroClipboardMovie_1').length){
              thiss.link_pane.renderClipboard();
            }
          }
        }).siblings('dd').slideUp().removeClass(thiss.activeClass);
        // adjust margin of reader to position relatively to new reader header height
        var newMargin = 400;
        thiss.readerArticle.stop().animate({ marginTop : newMargin}, 400);
      } else {
        dd.slideUp();
        dt.removeClass(thiss.activeClass);
        // put readerHeader margin back
        var newMargin = 34;
        thiss.readerArticle.stop().animate({ marginTop : newMargin}, 400);
      }

      this.blur();
    });

  },
}