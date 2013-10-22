#I18n::Backend::Simple.include(I18n::Backend::Gettext)

#I18n.load_path += Dir[Rails.root.join('config', 'locales', 'po', '*.po')]

FastGettext.add_text_domain('api', path: 'config/locales/po', type: :po)
FastGettext.default_available_locales = ['en']
FastGettext.default_text_domain = 'api'