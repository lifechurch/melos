# This file is loaded by application.rb after Rails
# is loaded, but before the app is initialized. It
# reads in _config.yml and allows access to environment-
# specific confgurations via `Cfg.value`.
#

class Cfg
  cattr_reader :languages
  cattr_reader :usstates
  @@settings = YAML::load_file(File.expand_path('../_config.yml', __FILE__))[Rails.env]
  @@languages = YAML::load_file(File.expand_path('../languages.yml', __FILE__))
  @@usstates = YAML::load_file(File.expand_path('../usstates.yml', __FILE__))
  class MissingConfigOptionError < StandardError; end
  def self.method_missing(key, *arguments)
    raise MissingConfigOptionError("#{key.to_s} is not in the config file") unless @@settings.include?(key.to_s)
    @@settings[key.to_s]
  end
end

