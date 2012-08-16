namespace :cache do
  task :clear => :environment do
    ap "**Clearning Rails cache:"
    ap Rails.cache.try(:stats)

    ap "***Rails.cache.clear => "
    ap Rails.cache.clear

    ap "**Rails cache cleared:"
    ap Rails.cache.try(:stats)
  end
end
