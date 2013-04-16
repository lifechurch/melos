// Class for managing Language menu in the bottom footer

function LanguageMenu( el , opts ) {
  this.el = $(el);
  this.locales = ["af","bg","ca","cs","cy","de","en-GB","en","es-ES","es","fi","fr","hi","id","it","ja","km","ko","mk","mn","ms","nl","no","pl","pt-BR","pt-PT","ro","ru","sk","sq","sv","ta","tl","tr","uk","vi","zh-CN","zh-TW"];

  var path = window.location.pathname;
  var new_path = "";
  var replacement_locale_str = "";

  _this = this;

  // User selects a new language.
  this.el.change( function() {
    replacement_locale_str = "/" + $(this).val();

    for(var i=0; i < _this.locales.length; i++) {
      var locale = _this.locales[i];
      var rstr = "^\\/" + locale;
      var regex = new RegExp(rstr);     // build dynamic regex to check locale: /:locale
      var match = path.match(regex);
      if( match && match.length > 0 ) {
        // match found, replace the match with our new locale
        new_path = path.replace(regex, replacement_locale_str);
        break
      }
    }
    // match wasn't found, add the locale extension to our current path
    if(new_path == "")
       new_path = replacement_locale_str + path;

    window.location = new_path;
  })
}

LanguageMenu.prototype = {
  constructor : LanguageMenu
}