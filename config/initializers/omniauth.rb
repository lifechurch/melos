Rails.application.config.middleware.use OmniAuth::Builder do
    provider :twitter, Cfg.twitter_key, Cfg.twitter_secret
    provider :facebook, Cfg.facebook_app_id, Cfg.facebook_secret
    # provider :google_oauth2, ENV['GOOGLE_KEY'], ENV['GOOGLE_SECRET']
end
