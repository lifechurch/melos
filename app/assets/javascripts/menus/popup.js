// Class to manage dynamic menu / popup menu functionality.
// Eventually this should become a base class for all /menus/*

function PopupMenu( opts ) {
  this.trigger  = $(opts.trigger);
  this.menu     = $(this.trigger.attr("href"));
  this.icon     = this.trigger.find('span:first').length ? this.trigger.find('span:first') : this.trigger;

  this.active_class = "li_active";

  this.trigger.on("click", $.proxy( function(e) {
    e.preventDefault();
    var ev = jQuery.Event("menu:click", {menu: this});
    $(this).trigger( ev );
  },this));
}

PopupMenu.prototype = {
  constructor : PopupMenu,

  hide : function() {
    this.trigger.parent("li").removeClass( this.active_class );
    this.menu.hide();
  },

  show : function() {
    this.trigger.closest("li").addClass( this.active_class );
    this.showMenu();
  },

  showMenu : function() {

    var li            = this.trigger.closest('li');
    var offset        = this.icon.offset();
    var offset_right  = offset.left + this.menu.outerWidth();
    var window_width  = $(window).innerWidth();
    var reverse       = 'dynamic_menu_reverse';
    var reverse_nudge;
    var left;

    if (offset_right >= window_width) {
      reverse_nudge = this.trigger.hasClass('button') ? 31 : 30;
      left = offset.left - this.menu.outerWidth() + reverse_nudge;
      this.menu.addClass(reverse);
    }
    else {
      this.menu.removeClass(reverse);

      if (this.trigger.attr('id') === 'menu_selected_trigger') {
        left = offset.left - 1;
      }
      else if (this.trigger.hasClass('button')) {
        left = offset.left - 6;
      }
      else {
        left = offset.left + parseInt(this.icon.css('border-left-width'), 10) - 8;
      }
    }

    li.addClass(this.active_class);
    this.menu.css({ left: left }).show();
    // Scroll to book if this menu is book/chapter menu.
    if(this.menu.attr('id') == 'menu_book_chapter'){
      var index = this.menu.find('#menu_book').data('selected-book-num');
      this.menu.find('.scroll').first().scrollTop((index - 1) * (this.menu.find('li').height() + 1)); //TODO: why are 1st and last elements 1px shorter than the rest??
    }
  }
}