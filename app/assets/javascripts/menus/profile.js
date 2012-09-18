function ProfileMenu( opts ) {

  this.menu       = $(opts.menu);
  this.trigger    = $(opts.trigger);
  this.active_class = "li_active";
  this.init();
}

ProfileMenu.prototype = {
  constructor : ProfileMenu,

  init : function() {

    if (!this.trigger.length) { return; }

    this.trigger.on("click", $.proxy( function(e) {
      e.preventDefault();
      (this.activated()) ? this.hide() : this.show()

    }, this));

    $(window).on("resize", $.proxy( function(e) {
      e.preventDefault();
      this.hide();
    }, this));

    $(document).on("mousedown", $.proxy(function(e) {
      if (!$(e.target).closest('#header_profile_menu, #header_profile_trigger').length) {
        this.hide();
      }
    }, this));

    $(document).on("keydown", $.proxy(function(e) {
      if (e.keyCode === 27) { this.hide(); } // 27 === Escape key
    }, this));

  },

  hide : function() {
    this.container().removeClass( this.active_class );
  },

  show : function() {
    this.container().addClass( this.active_class );
  },

  activated : function() {
    return this.container().hasClass( this.active_class );
  },

  container : function() {
    return this.trigger.closest('li');
  }
}