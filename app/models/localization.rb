# TODO: 3.1
# figure out what backend we can use for API po files

# http://developers.youversion.com/api/docs/3.1/sections/localization.html

class Localization < YV::Resource

  api_response_mapper YV::API::Mapper::Localization

  class << self

    def api_path_prefix
      "localization"
    end

    # Localization.available_locales
    # http://developers.youversion.com/api/docs/3.1/sections/localization/configuration.html
    # ------------------------------------------------------------------------------------------------------------
    # returns an array of locales as symbols [:en,:es,:ca,:af, ...]
    
    # options
    # none





  end

end