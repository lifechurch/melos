#I18n::Backend::Simple.include(I18n::Backend::Gettext)
#I18n.load_path += Dir[Rails.root.join('config', 'locales', 'po', '*.po')]

FastGettext.add_text_domain('api', path: 'config/locales/po', type: :po)

# FastGettext.default_available_locales = Localization.language_tags.moments.to_a
# put 'en' as first, the first item is used as a fallback
FastGettext.default_available_locales = ["en"]
# get available locales automatically
Dir[File.join(File.dirname(__FILE__), '..', 'locales', "po/*/*.po")].each do |l|
  if l.match(/po\/.*\.po/) && !FastGettext.default_available_locales.include?($1)
    FastGettext.default_available_locales << l.match(/po\/.*\.po/).to_s.gsub('po/', '').gsub('/api.po', '')
  end
end
FastGettext.default_text_domain = 'api'

