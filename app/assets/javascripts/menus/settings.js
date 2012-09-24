// Class to manage Settings menu in reader header.

function SettingsMenu( opts ) {
  this.menu    = $(opts.menu);
  this.trigger = $(opts.trigger);
  this.init();
}

SettingsMenu.prototype = {

  constructor : SettingsMenu,

  init : function() {
    var radio = $('.radio_user_setting');
    var article = $('#main article');

    if (!radio.length) { return; }

    radio.click(function() {
      var el = $(this);
      var font = el.attr('data-setting-font');
      var size = el.attr('data-setting-size');
      font && setCookie('data-setting-font', font);
      size && setCookie('data-setting-size', size);

      font && article.attr('data-setting-font', font);
      size && article.attr('data-setting-size', size);
    });
  }
}