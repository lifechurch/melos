// Class for managing Language menu in the bottom footer

function LanguageMenu( el , opts ) {
  this.el = $(el);
  this.el.change(function() { window.location = $(this).val(); });
}

LanguageMenu.prototype = {
  constructor : LanguageMenu
}