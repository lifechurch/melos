class Version < YouVersion::Resource

  attribute :id
  attribute :title
  attribute :audio
  attribute :publisher_id

  def self.all(app_lang_tag = "")
    # `bible_langauge_id` is the arbitrariy identifier of the language
    # to the Bible API (iso_639_3[_variant tag]), langauge_tag in the response
    #
    # `app_lang_tag` is the language tag used within the app (pt-BR, for example)
    # that comes from the user's preferred languages or the language they've selected
    bible_langauge_id = case app_lang_tag
    when ""
      return versions.values
    when Hash, Hashie::Mash
      app_lang_tag.id.to_s
    else
      YvApi::to_bible_api_lang_code(app_lang_tag).to_s
    end

    versions.select { |k, v| v.language.id.to_s == bible_langauge_id }.values
  end
  def self.all_by_language(opts={})
    # to allow a restricted subset of versions (e.g. for white-list sites)
    _all = Version.all.find_all{|v| opts[:only].include? v.id} if opts[:only]
    _all ||= all
    _all.group_by {|v| v.language.tag}
  end
  def self.all_by_publisher(opts={})
    # to allow a restricted subset of versions (e.g. for white-list sites)
    _all = Version.all.find_all{|v| opts[:only].include? v.id} if opts[:only]
    _all ||= all
    _all.group_by {|v| v.publisher_id}
  end
  def self.find(version)
    ver = versions[self.id_from_param(version)]
    raise NotAVersionError if ver.nil?
    ver
  end
  def self.default_for(app_lang_tag)
    bible_langauge_id = case app_lang_tag
    when Hash, Hashie::Mash
      app_lang_tag.id.to_s
    else
      YvApi::to_bible_api_lang_code(app_lang_tag).to_s
    end

    defaults[bible_langauge_id]
  end
  def self.default()
    defaults["eng"] || find(1)
  end
  def self.sample_for(lang, opts={})
    except_id = id_from_param(opts[:except])
    lang = lang.to_s

    samples = all_by_language[lang]
    return nil if samples.nil?

    samples = samples.find_all{|v| v.id != except_id}
    sample = nil

    until !sample.nil? || samples.empty?
      sample = samples.delete_at(Random.rand(samples.length))

      sample = nil if opts[:has_ref] && !sample.include?(opts[:has_ref])
    end

    return nil if sample.nil?

    return sample.id
  end
  def self.languages(opts={})
    return @languages if @languages.present?

    @languages = Hashie::Mash.new(Hash[all_by_language(opts).map{|tag,versions| [tag, versions.first.language.human]}])
  end
  def self.id_from_param(ver)
    case ver
    when Fixnum         # 1
      ver
    when /^\d+$/        # "1"
      ver.to_i
    when /^(\d+)\-.*/   #  "1-KJV"
      $1.to_i
    when String
      YvApi::get_usfm_version(ver) || ver
    when Version
      ver.id
    else
      ver
    end
  end

  def hash
    to_param.hash
  end
  def ==(compare)
    #if same class
    (compare.class == self.class) &&  compare.hash == hash
  end
  def eql?(compare)
    self == compare
  end
  def language
    @language ||= Hashie::Mash.new({tag: YvApi::bible_to_app_lang_code(@attributes.language.language_tag),
                                    id: @attributes.language.language_tag,
                                    human: @attributes.language.local_name,
                                    direction: @attributes.language.text_direction})
  end
  def copyright
    detailed_attributes['copyright_short']['html'] || detailed_attributes['copyright_short']['text'] || ""
  end
  def info
    detailed_attributes['copyright_long']['html'] || detailed_attributes['copyright_long']['text'] || ""
  end
  def audio_version?
    audio
  end
  def books
    return @books if @books.present?

    @books = Hashie::Mash.new
    detailed_attributes['books'].each_with_index do |b, i|
      @books[b.usfm] = b.merge(chapters: b.chapters)
    end
    @books
  end

  def rtl?
   text_direction =="rtl"
  end

  def text_direction
    language.direction
  end

  def include?(ref)
    raise "versions only contain references!" unless ref.is_a? Reference

    begin
      book = books[ref.book.to_s]
      return false if book.nil?

      chapter_found = book.chapters.any? {|hash| hash.usfm == ref.usfm }
      return false if chapter_found == false

    rescue
      return false #if we get any errors here false is the better choice.
    end

    #API doesn't send verse information anymore :(
    return true
  end
  def title
    @attributes.local_title || @attributes.title
  end
  def abbreviation
    @attributes.abbreviation.try :upcase
  end
  def to_s
    "#{title} (#{abbreviation.upcase})"
  end
  def to_param
    "#{id}"
  end
  def human
    #only return first section (before any - or _ qualifier) of abbreviation
    abbreviation.upcase.match(/\A[^-_]*/).to_s
  end
  def publisher
    detailed_attributes.publisher || Hashie::Mash.new({"id"=>nil, "name"=>nil, "url"=>nil, "description"=>nil})
  end

  private
   def self.versions
    return @versions if @versions.present?
    response = YvApi.get("bible/versions", type: "all", cache_for: a_long_time)

    #versions hash of form [<version numerical uid> => <Version object instance>]
    @versions = Hash[ response.versions.map {|ver| [ver.id, Version.new(ver)]} ]
  end
  def self.defaults
    return @defaults if @defaults.present?

    response = YvApi.get("bible/configuration", cache_for: a_long_time)
    @defaults = Hash[response.default_versions.map {|d| [d.language_tag, d.id]}]
  end
  def detailed_attributes
    #attributers that can only be found with a specific /version call
    return @detailed_attributes unless @detailed_attributes.nil?

    @detailed_attributes = YvApi.get("bible/version", cache_for: a_long_time, id: id)
    # uncommenting to show API issue, leavning here in case we need it in a pinch
    # @detailed_attributes.publisher.name = nil if @detailed_attributes.publisher.name == 'null'
    @detailed_attributes
  end
  def versions
    self.class.versions
  end
  def versions_api_data
    self.class.versions_api_data
  end
  def to_attribute
    to_param
  end
end
