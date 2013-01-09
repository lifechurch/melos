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
  this.speed               = 200;

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
    var newMargin = reader.header.outerHeight() + this.menu.height();
    this.menu.slideDown();
    this.readerArticle.stop().animate({ marginTop : newMargin}, this.speed);
  },

  close : function() {
    var thiss = this;
    this.menu.slideUp(this.speed, function(){
      // de-activate any panes after it has slid up
      thiss.paneList.find('dd').hide();
      thiss.paneList.find('dt').removeClass(thiss.activeClass);
    });

    // put readerHeader margin back
    var newMargin = reader.header.outerHeight();
    thiss.readerArticle.stop().animate({ marginTop : newMargin}, this.speed);
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
        var newMargin = reader.header.outerHeight() + thiss.menu.height() + dd.height();

        dd.slideDown(thiss.speed, function() {
          // Animation complete, items visible
          if (dd.attr('id') == "link-pane"){
            if(!dd.find('#ZeroClipboardMovie_1').length){
              thiss.link_pane.renderClipboard();
            }
          }
          dt.siblings('dt').removeClass(thiss.activeClass);
          dt.addClass(thiss.activeClass);
        }).siblings('dd').slideUp();

        thiss.readerArticle.stop().animate({ marginTop : newMargin}, thiss.speed);
      } else {
        dd.slideUp();
        dt.removeClass(thiss.activeClass);
        // put readerHeader margin back
        var newMargin = reader.header.outerHeight() + thiss.menu.height();
        thiss.readerArticle.stop().animate({ marginTop : newMargin}, thiss.speed);
      }

      this.blur();
    });

  },
}