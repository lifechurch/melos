# encoding: UTF-8
class Language
  include LanguageList

  def self.all
    return @all unless @all.nil?

    @all = ALL_LANGUAGES

    custom_languages.each do |lang|

    end

  end

  def self.find_2_letter(code_3_letter)
  return @hash_3_letter[code_3_letter].iso_693_1 unless @hash_3_letter.nil?

  @hash_3_letter = response = YvApi.get("bible/configuration", cache_for: 12.hours)
  @defaults = Hash[response.default_versions.map {|d| [d.iso_639_3, d.id]}]
  end

  def initialize(language)
  @code = case language
  when /.+ (?: [\-_].+)? /x   #iSO 639_1, _ or - delim
    language.gsub('_','-')
  else
    nil
  end
  raise "Unrecognized or invalid laguage code format" if @code.nil?
  end

  def to_s
  "#{human} (#{iso_693_3}) (#{iso_693_1})"
  end




  private

  def custom_languages
    # def initialize(options)
    #   @name = options[:name]
    #   @iso_639_3 = options[:iso_639_3]
    #   @iso_639_1 = options[:iso_639_1]
    #   @common = options[:common]
    #   @type = options[:type]
    # end
    [
      {name: 'Português (Portugal)', iso_639_3: 'por-portugal', iso_639_1: 'pt-BR'},
      {name: 'Português (Brasil)', iso_639_3: 'por', iso_639_1: 'pt'}
    ]
  end
end
