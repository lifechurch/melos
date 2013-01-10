// Selected Verses menu
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
  this.note_pane           = new NotePane("#note-pane");

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
    this.menu.moveDown(this.speed);
    this.readerArticle.stop().animate({ marginTop : newMargin}, this.speed);
  },

  close : function() {
    var thiss = this;
    this.menu.moveUp(this.speed, function(){
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
    this.note_pane.updateForm({references: reader.getSelectedData().verse_usfms});
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

  openPane : function( dt ) {
    var dd = dt.next('dd');
    var newMargin = reader.header.outerHeight() + this.menu.height() + dd.height();
    var thiss = this;

    function _open(){
      // slide down the pane
      dd.moveDown(thiss.speed, function() {

        // Animation complete, items visible
        if (dd.attr('id') == "link-pane"){
          if(!dd.find('#ZeroClipboardMovie_1').length){
            thiss.link_pane.renderClipboard();
          }
        }
        // set active class
        dt.siblings('dt').removeClass(thiss.activeClass);
        dt.addClass(thiss.activeClass);

        // bind escape key to close the pane
        $(document).on("keydown", $.proxy(function(e) {
          if (e.keyCode === 27) { // 27 === Escape key
            e.preventDefault();
            this.closePanes();
          }
        }, thiss));
      });

      // slide up the article margin at the same time
      thiss.readerArticle.stop().animate({ marginTop : newMargin}, thiss.speed);
    }

    var open_dd = dt.siblings('.' + this.activeClass).next('dd');
    if (open_dd.length){
      // quickly slide up any active panes
      thiss.closePanes(thiss.speed / 2, function(){
        // then after up, slide the new one down
        _open();
      });
    } else{
      // no open pane, just slide the new one down
      _open();
    }

  },

  closePanes : function(speed, complete) {
    var dt = this.paneList.find('dt.' + this.activeClass);
    var dd = dt.next('dd');
    var thiss = this;

    speed = speed || this.speed;

    if(dt.length){
      dd.moveUp(speed, complete);
      dt.removeClass(thiss.activeClass);

      // unbind escape key to close the pane
      $(document).off("keydown", $.proxy(function(e) {
        if (e.keyCode === 27) { // 27 === Escape key
          e.preventDefault();
          this.closePanes();
        }
      }, thiss));

      // put readerHeader margin back
      var newMargin = reader.header.outerHeight() + thiss.menu.height();
      thiss.readerArticle.stop().animate({ marginTop : newMargin}, speed);
    }
  },

  initPanes : function() {

    if (!this.paneList.length) { return; }

    var thiss = this;

    this.paneList.find('dt').click(function(e) {
      var dt = $(this);
      var dd = dt.next('dd');

      if (dd.is(':hidden')) {
        thiss.openPane(dt);
      } else {
        thiss.closePanes();
      }

      this.blur();
    });

  },
}