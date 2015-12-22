$(function() {
  // init locale for js I18n-js
  I18n.fallbacks = true;
  I18n.defaultLocale = $('html').data('default-locale');
  I18n.locale = $('html').data('locale');
});
