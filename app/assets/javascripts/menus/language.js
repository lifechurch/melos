function LanguageMenu( el , opts ) {
  this.el = $(el);
  this.init();
}

LanguageMenu.prototype = {

  constructor : LanguageMenu,

  init : function() {
    this.el.change(function() { window.location = $(this).val(); });
  }
}