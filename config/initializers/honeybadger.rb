if key = ENV['HONEYBADGER_API_KEY']
  Honeybadger.configure do |config|
    config.api_key = key
  end
end