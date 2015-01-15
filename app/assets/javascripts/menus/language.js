// Class for managing Language menu in the bottom footer

function LanguageMenu( el , opts ) {
  this.el = $(el);
  // Sadly order here is important.
  // make sure all xx-XX format locales come first before any 2 letter locales.
  // has to do with matching /pt early when we're trying to match for /pt-PT
  // this should be updated to work better.
  this.locales = ["zh-CN","zh-TW","es-ES","en-GB","pt-PT","af","ar","bg","ca","cs","cy","de","da","en","es","fa","fi","fr","hi","hu","id","it","ja","km","ko","lv","mk","mn","ms","nl","no","pl","pt","ro","ru","sk","sq","sv","sw","ta","th","tl","tr","uk","vi"];

  var path = window.location.pathname;
  var new_path = "";
  var replacement_locale_str = "";

  _this = this;

  // User selects a new language.
  this.el.change( function() {
    replacement_locale_str = "/" + $(this).val();

    for(var i=0; i < _this.locales.length; i++) {
      var locale = _this.locales[i];
      var rstr = "^(\\/" + locale + "\\/*)";    // (\/es\/+)
      var regex = new RegExp(rstr);             // build dynamic regex to check locale: /:locale
      var match = path.match(regex);
      if( match && match.length > 0 ) {
        // match found, replace the match with our new locale
        new_path = path.replace(regex, replacement_locale_str + "/");
        break
      }
    }

    // match wasn't found, add the locale extension to our current path
    if(new_path == "")
       new_path = replacement_locale_str + path;

    // Post new locale to server endpoint
    $.ajax({
      type: "PUT",
      url: "/language_settings", 
      data: {'language_tag': $(this).val()}
    });

    // Navigate to new path
    window.location = new_path;
  })
}

LanguageMenu.prototype = {
  constructor : LanguageMenu
}