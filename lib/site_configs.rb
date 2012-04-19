module SiteConfigs
  def self.sites
    # this makes the hash return the normal Site class for undefined keys
    hash = Hash.new(SiteConfigs::Site)

    # Define white-label classes here.
    # These are strings to prevent rails from barfing on the class names
    hash["biblesocietywebsite.org"] = SiteConfigs::ElSalvador
    hash["biblesociety.co.za"] = SiteConfigs::Sabs
    hash["lvh.me"] = SiteConfigs::ElSalvador
    hash
  end

end
