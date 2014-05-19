# enable fallback handling
I18n::Backend::Simple.include(I18n::Backend::Fallbacks)
#I18n::Backend::Simple.include(I18n::Backend::Gettext)
#I18n.load_path += Dir[Rails.root.join('config', 'locales', 'po', '*.po')]

FastGettext.add_text_domain('api', path: 'config/locales/po', type: :po)
FastGettext.default_available_locales = Localization.language_tags.moments.to_a
FastGettext.default_text_domain = 'api'

# set some locale fallbacks
I18n.fallbacks[:"en_GB"] = [:"en-GB", :en]
I18n.fallbacks[:"en_ES"] = [:"en-ES", :es]
I18n.fallbacks[:"pt_BR"] = [:"pt", :pt]
I18n.fallbacks[:"pt_PT"] = [:"pt-PT", :pt]
I18n.fallbacks[:"zh_CN"] = [:"zh-CN"]
I18n.fallbacks[:"zh_TW"] = [:"zh-TW"]
