namespace :cache do
  class AppCaching
    def self.clear
      ap "**Clearning Rails cache:"
      ap Rails.cache.try(:stats)

      ap "***Rails.cache.clear => "
      ap Rails.cache.clear

      ap "***Rails cache cleared:"
      ap Rails.cache.try(:stats)
    end
  end

  task :clear => :environment do
    AppCaching.clear
  end

  task :clear_and_warm_versions => :environment do
    AppCaching.clear

    start = Time.now.to_f
    ap "* warming bible/versions, type=all"
    test = YV::API::Client.get("bible/versions", type: "all", cache_for: Version.cache_length, timeout: 30)

    start = Time.now.to_f
    ap "* warming bible/version, id=1 (KJV)"
    test = YV::API::Client.get("bible/version", cache_for: Version.cache_length, id: 1, timeout: 30)

    start = Time.now.to_f
    ap "* warming bible/configuration"
    test = YV::API::Client.get("bible/configuration", cache_for: Version.cache_length, timeout: 30)
  end
end
