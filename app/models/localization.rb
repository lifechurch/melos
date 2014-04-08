# TODO: 3.1
# figure out what backend we can use for API po files

# http://developers.youversion.com/api/docs/3.1/sections/localization.html

class Localization < YV::Resource

  
  HTTParty.get('http://twitter.com/statuses/public_timeline.json')



  class << self


    def po(language)
      default_headers = YV::API::Client.default_headers
      query           = {language_tag: language.to_s}
      HTTParty.get('https://localization.youversionapistaging.com/3.1/items.po', {
        headers: default_headers,
        timeout: Cfg.api_default_timeout,
        query: query
      })
    end



    def language_tags
      default_headers = YV::API::Client.default_headers
      resp = HTTParty.get('https://localization.youversionapistaging.com/3.1/configuration.json', {
        headers: default_headers,
        timeout: Cfg.api_default_timeout
      })
      Hashie::Mash.new(resp["response"]["data"]) if resp and resp["response"]
    end



 #    {"moments"=>
 #  ["af",
 #   "ar",
 #   "bg",
 #   "ca",
 #   "cs",
 #   "da",
 #   "de",
 #   "en",
 #   "en_GB",
 #   "es",
 #   "es_ES",
 #   "fi",
 #   "fr",
 #   "hi",
 #   "hr",
 #   "hu",
 #   "id",
 #   "it",
 #   "ja",
 #   "km",
 #   "ko",
 #   "mk",
 #   "mn",
 #   "ms",
 #   "nl",
 #   "no",
 #   "pl",
 #   "pt",
 #   "pt_PT",
 #   "ro",
 #   "ru",
 #   "sk",
 #   "sq",
 #   "sv",
 #   "sw",
 #   "th",
 #   "tl",
 #   "tr",
 #   "uk",
 #   "vi",
 #   "zh_CN",
 #   "zh_TW"],
 # "notifications"=>
 #  [...]},
 # "share"=>
 #  [...]}

  end

end