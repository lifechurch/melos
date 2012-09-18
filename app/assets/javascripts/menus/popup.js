function PopupMenu( opts ) {
  this.trigger  = $(opts.trigger);
  this.menu     = $(this.trigger.attr("href"));
  this.icon     = this.trigger.find('span:first').length ? this.trigger.find('span:first') : this.trigger;

  this.active_class = "li_active";

  this.trigger.on("click", $.proxy(this.triggerClick,this));


  var thiss = this;
  $(document).mousedown(function(ev) {
    var el = $(ev.target);

    if (el.hasClass('close') || (!el.closest('.dynamic_menu_trigger').length && !el.closest('.colorpicker').length && !el.closest('.dynamic_menu').length)) {
      thiss.hideAll();
    }
  }).keydown(function(ev) {
    if (ev.keyCode === 27) {
      thiss.hideAll();
    }
  });

  $(window).resize(function() {
    thiss.hideAll();
  });



}

PopupMenu.prototype = {
  constructor : PopupMenu,

  triggerClick : function( e ) {
    e.preventDefault();
    e.stopPropagation();

    var li            = this.trigger.closest('li');
    var offset        = this.icon.offset();
    var offset_right  = offset.left + this.menu.outerWidth();
    var window_width  = $(window).innerWidth();
    var reverse       = 'dynamic_menu_reverse';
    var active_class  = this.active_class;
    var reverse_nudge;
    var left;


    if (offset_right >= window_width) {
      reverse_nudge = this.trigger.hasClass('button') ? 31 : 30;
      left = offset.left - this.menu.outerWidth() + reverse_nudge;
      menu.addClass(reverse);
    }
    else {

      this.menu.removeClass(reverse);

      if (this.trigger.attr('id') === 'verses_selected_button') {
        left = offset.left - 1;
      }
      else if (this.trigger.hasClass('button')) {
        left = offset.left - 6;
      }
      else {
        left = offset.left + parseInt(this.icon.css('border-left-width'), 10) - 8;
      }
    }


    if (this.menu.is(':hidden')) {

      this.hideAll();
      li.addClass(active_class);

      if(this.menu.css('position') != "absolute"){
         this.menu.css({ left: left }).show();

        if(this.menu.attr('id') == 'menu_book_chapter'){
         var index = this.menu.find('#menu_book').data('selected-book-num');
         this.menu.find('.scroll').first().scrollTop((index - 1) * (this.menu.find('li').height() + 1)); //TODO: why are 1st and last elements 1px shorter than the rest??
        }
      }
      else{
        this.menu.show();
      }
    }
    else {
      this.hideAll();
    }

    this.trigger.blur();
  },

  hideAll : function() {
    var active_class = 'li_active';
    var items = this.trigger.parent('li');
        items.removeClass(active_class);

    var menus = $('.dynamic_menu');
        menus.hide();
  }

}