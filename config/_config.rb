# This file is loaded by application.rb after Rails
# is loaded, but before the app is initialized. It
# reads in _config.yml and allows access to environment-
# specific confgurations via `Cfg.value`.
#

class Cfg 
 @@settings = YAML::load_file(File.expand_path('../_config.yml', __FILE__))[Rails.env] 
 class MissingConfigOptionError < StandardError; end 
 def self.method_missing(key) 
  raise MissingConfigOptionError("#{key.to_s} is not in the config file") unless @@settings.include?(key.to_s) 
  @@settings[key.to_s] 
 end 
end

