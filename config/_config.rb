# This file is loaded by application.rb after Rails
# is loaded, but before the app is initialized. It
# reads in _config.yml and allows access to environment-
# specific confgurations via `Cfg.value`.
#

class Cfg
  cattr_reader :languages
  @@settings = YAML::load_file(File.expand_path('../_config.yml', __FILE__))[Rails.env]
  @@languages = YAML::load_file(File.expand_path('../languages.yml', __FILE__))
  class MissingConfigOptionError < StandardError; end

  def self.method_missing(key, *arguments)
    raise MissingConfigOptionError("#{key.to_s} is not in the config file") unless @@settings.include?(key.to_s)

    #allow config var override for heroku deploys
    return ENV["CFG_#{key.to_s.upcase}"] if ENV["CFG_#{key.to_s.upcase}"]

    @@settings[key.to_s]
  end
end