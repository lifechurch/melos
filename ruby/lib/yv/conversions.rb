# Utility module to perform miscellaneous conversions
# USFM <-> OSIS format conversions
#

module YV
	module Conversions

		class << self

			# Convert a language code to a properly formatted language code for API calls
			# ex: pt-BR -> pt_BR
			# Web facing language codes are formatted with a hyphen, API expects to see underscored lang codes
		  def to_api_lang_code(lang_code)
		    code = lang_code.to_s.gsub("-", "_")
		    lang_code.is_a?(Symbol) ? code.to_sym : code
		  end

		  #  Convert a given lang_code str to a proper Bible API language code
		  def to_bible_api_lang_code(lang_code)
		  	code_str	= lang_code.to_s
		    code 			= bible_api_custom_languages[code_str]
		    code 			= LanguageList::LanguageInfo.find(code_str).iso_639_3 if code.nil?

		    lang_code.is_a?(Symbol) ? code.to_sym : code.to_s
		  end

		  # Convert a given lang_code string into an appropriate app language code
		  # ex: pt_BR -> pt-BR
		  def to_app_lang_code(lang_code)
		    lang_code = lang_code.gsub("_", "-")
		  end


		  # Convert a Bible API lang_code string to a usable App language code
		  def bible_to_app_lang_code(lang_code)
		    code = bible_api_custom_languages.key(lang_code.to_s)
		    code ||= LanguageList::LanguageInfo.find(lang_code.to_s).try(:iso_639_1)
		    # the code will be empty if not a common or iso 639_1 language
		    # or if we don't have the language supported in our custom tags
		    # the app won't be able to recognize this code if empty
		    # return the code passed so there's at least something?
		    code = lang_code if code.to_s == ""
		    code
		  end


			# Get a USFM version from a osis_version string passed as param
			def usfm_version(osis_version)
				raise "OSIS version must be a string" unless osis_version.is_a? String
		    Cfg.osis_usfm_hash[:versions][osis_version.downcase]
		  end



		  # Get a USFM book from a osis_book string passed as param
		  def usfm_book(osis_book)
		    raise "OSIS book must be a string" unless osis_book.is_a? String
	      return osis_book.upcase if Cfg.osis_usfm_hash[:books].key(osis_book.upcase)
	      return Cfg.osis_usfm_hash[:books][osis_book.downcase]
		  end

		  # USFM delimeter used to concatenate multiple USFM strings
		  def usfm_delimeter
		    "+"
		  end

		  private

		  def bible_api_custom_languages
		    {
		      'en-GB' => 'eng_gb',
		      'pt-PT' => 'por_pt',
		      'pt-BR' => 'por',
		      'zh-CN' => 'zho',
		      'zh-TW' => 'zho_tw',
		      'es-ES' => 'spa_es',
          'my-MM' => 'mya',
          'no' => 'nob',
          'sw' => 'swh',
          'sq' => 'alb',
          'mn' => 'khk',
          'ar' => 'arb',
          'fa' => 'pes'
        }
        # norwegian macro languages: api has default under 'nob' not 'nor' as returned by LanguageInfo.find ISO 639-3
        # norwegian has two macro languages 'nob' and 'nno' not technically a part of ISO 639-3
        # swahili is using 'swh' for default version (Coastal Swahili) instead of 'swa' - (inclusive code for Swahili)
        # sq default version requires ISO 639-3 = 'alb' not 'sqi' default version is (292)
        # mn default version requires ISO 639-3 = 'khk' default version is (369)
        # ar default version requires ISO 639-3 = 'arb' not 'ara' default version is (101)
        # fa default version requires ISO 639-3 = 'pes' default version is (181)
		  end

      # Method(s) not found in the rest of the app - commenting out for now.

      # Get a OSIS version from a usfm_version string passed as param
      #def osis_version(usfm_version)
      # version = usfm_version.to_i
      # raise "USFM version doesn't exist" unless Cfg.osis_usfm_hash[:versions].has_value?( version )
      #  Cfg.osis_usfm_hash[:versions].key( version )
      #end

      # Get a OSIS book from a usfm_book string passed as param
      #def osis_book(usfm_book)
      # raise "USFM book must be a string" unless usfm_book.is_a? String

      # book = usfm_book.upcase
      # raise "Invalid USFM book" unless Cfg.osis_usfm_hash[:books].has_value? book
      # return Cfg.osis_usfm_hash[:books].key(book)
      #end

		end

	end
end
