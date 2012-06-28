class Version < YouVersion::Resource

attribute :id
attribute :title
attribute :abbreviation
attribute :audio

  def self.all(lang = "")
    iso_3 = case lang
    when ""
      return versions
    when Hash
      lang.iso.to_s
    else
      lang.to_s
    end

    versions.select { |k, v| v.language.iso.to_s == iso_3 }
  end

  def self.find(version)
    ver = versions[self.id_from_param(version)]
    raise NotAVersionError if ver.nil?
    ver
  end

  def self.id_from_param(ver)
    case ver
    when Fixnum
      ver
    when /^\d+$/
      ver.to_i
    when /^(\d+)\-.*/
      $1.to_i
    when Version
      ver.id
    else
      ver
    end
  end

  def self.languages
    return @languages unless @languages.nil?

    @languages = Hashie::Mash.new(Hash[*Version.all.group_by { |k, v| v.language}.keys.map{|k| [k[:iso], k[:human]]}.flatten])
  end

  def self.all_by_language(opts={})
    # to allow a restricted subset of versions (e.g. for white-list sites)
    all_by_language = Version.all.find_all{|k, v| opts[:only].include? k}.group_by {|k, v| v.language.iso} if opts[:only]

    all_by_language ||= Version.all.group_by {|k, v| v.language}
    all_by_language.each {|k, v| all_by_language[k] = Hash[*v.flatten]}
    all_by_language
  end

  def language
    Hashie::Mash.new({iso: YvApi::to_app_lang_code(@attributes.language.iso_639_3), human: @attributes.language.local_name})
  end

  def copyright
    detailed_attributes['copyright_short']['html'] || detailed_attributes['copyright_short']['text'] || ""
  end

  def info
    detailed_attributes['copyright_long']['html'] || detailed_attributes['copyright_long']['text']
  end

  def audio_version?
    audio
  end

  def books
    return @books unless @books.nil?

    @books = Hashie::Mash.new
    detailed_attributes['books'].each_with_index do |b, i|
      @books[b.usfm] = b.merge(chapters: b.chapters)
    end
    @books
  end

  def rtl?
    @data.text_direction=="rtl"
  end

  def text_direction
    @data.text_direction
  end

  def contains?(ref)
    raise "versions contain references!" if !ref.is_a? Reference
    listing = books_list

    return false if ref.book && books[ref.book.to_s].nil?
    return false if ref.chapter && books[ref.book.to_s].chapters >= ref.chapter #[ref.chapter.to_s].nil?
    #API doesn't send verse information
    return true
  end

  def chapter_before(book, chapter)
    debugger
  end

  def chapter_after(book, chapter)
    debugger
  end

  def title
    @attributes.title
  end

  def to_s
    "#{title} (#{abbreviation})"
  end

  def to_param
    "#{id}-#{human}"
  end

  def human
    #only return first section (before any - or _ qualifier) of abbreviation
    abbreviation.upcase.match(/\A[^-_]*/).to_s
  end

  def self.default_for(lang)
    iso_3 = case lang
    when ""
      return default
    when Hash
      lang.iso.to_s
    else
      lang.to_s
    end

    defaults[iso_3]
  end

  def self.default()
    defaults["eng"]
  end

  def self.sample_for(lang, opts={})
    opts[:except] ||= ""

    samples = all_by_language[lang.to_s]
    return nil if samples.nil?

    samples = samples.find_all{|k,v| k != opts[:except]}
    sample = nil

    until !sample.nil? || samples.empty?
      sample = samples.delete_at(Random.rand(samples.length))[1]

      sample = nil if opts[:has_ref] && !sample.include?(opts[:has_ref])
    end

    return nil if sample.nil?

    return sample.id
  end




  #DEBUGprivate

  def detailed_attributes
    #attributers that can only be found with a specific /version call
    return @detailed_attributes unless @detailed_attributes.nil?

    @detailed_attributes = YvApi.get("bible/version", cache_for: 12.hours, id: id)
  end

  def self.versions
    return @versions unless @versions.nil?
    response = YvApi.get("bible/versions", type: "all", cache_for: 12.hours)

    #versions hash of form [<version numerical uid> => <Version object instance>]
    @versions = Hash[ response.versions.map {|ver| [ver.id, Version.new(ver)]} ]
  end

  def versions
    self.class.versions
  end

  def self.defaults
    return @defaults unless @defaults.nil?

    response = YvApi.get("bible/configuration", cache_for: 12.hours)
    @defaults = Hash[response.default_versions.map {|d| [d.iso_639_3, d.id]}]
  end

  def versions_api_data
    self.class.versions_api_data
  end

  def to_attribute
    to_param
  end
end
