class Bloodhound
  class << self
    def locate(ip)
      HTTParty.get("https://lctv-bloodhound.herokuapp.com/geo",
                   query: {ip: ip},
                   basic_auth: {username: Cfg.bloodhound_username,
                                password: Cfg.bloodhound_password})
    end
    
    def bleed_american?(ip)
      locate(ip)["country_code"] == "US"
    end
  end
end
