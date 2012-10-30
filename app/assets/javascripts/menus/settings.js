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

    $('#user_setting_trans_notes').click(function(){
      if($(this).parent('.is_checked').length) {
        setCookie('data-setting-trans-notes', 'true');
        article.attr('data-setting-trans-notes', 'true');
      } else {
        setCookie('data-setting-trans-notes', 'false');
        article.attr('data-setting-trans-notes', 'false');
      }
    });

    $('#user_setting_cross_refs').click(function(){
    if($(this).parent('.is_checked').length) {
      setCookie('data-setting-cross-refs', 'true');
      article.attr('data-setting-cross-refs', 'true');
    } else {
      setCookie('data-setting-cross-refs', 'false');
      article.attr('data-setting-cross-refs', 'false');
    }
  });
  }
}