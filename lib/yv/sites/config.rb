module YV
  module Sites
    module Config

      def self.sites
        # this makes the hash return the normal Site class for undefined keys
        hash = Hash.new(YV::Sites::Site)

        # set hash key to a Site class value
        hash["biblesocietywebsite.org"]   = ElSalvador
        hash["biblesociety.co.za"]        = Sabs
        hash["sbb.org.br"]                = Sbb
        hash["sbiblica.youversion.com"]   = Sbg
        hash["www.bible.com"]             = Bible
        hash["bible.com"]                 = Bible
        hash["dev.bible.com"]             = Bible
        hash["staging.bible.com"]         = Bible
        hash["lvh.me"]                    = Bible
        hash["www.lvh.me"]                = Bible
        hash
      end
    end
  end
end
