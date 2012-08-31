module SiteConfigs
  def self.sites
    # this makes the hash return the normal Site class for undefined keys
    hash = Hash.new(SiteConfigs::Site)

    # Define white-label classes here.
    hash["biblesocietywebsite.org"] = SiteConfigs::ElSalvador
    hash["biblesociety.co.za"] = SiteConfigs::Sabs
    hash["www.bible.com"] = SiteConfigs::Bible
    hash["dev.bible.com"] = SiteConfigs::Bible
    hash["staging.bible.com"] = SiteConfigs::Bible
    hash["lvh.me"] = SiteConfigs::Bible
    hash
  end

end
