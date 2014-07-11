class Version < YV::Resource

  attribute :id
  attribute :title
  attribute :audio
  attribute :publisher_id

  class << self

    # Version.all
    # Version.all("eng")
    # Version.all(Hashie::Mash.new(id: "eng"))  ?? Why ??

    # return an array of Versions
    # - possibly filtered by language tag

    def all(app_lang_tag = "")
      # `bible_langauge_id` is the arbitrariy identifier of the language
      # to the Bible API (iso_639_3[_variant tag]), langauge_tag in the response
      #
      # `app_lang_tag` is the language tag used within the app (pt-BR, for example)
      # that comes from the user's preferred languages or the language they've selected
      
      return versions.values if app_lang_tag == ""

      bible_langauge_id = case app_lang_tag
        when Hash, Hashie::Mash
          app_lang_tag.id.to_s
        else
          YV::Conversions.to_bible_api_lang_code(app_lang_tag).to_s
      end
      versions.select { |k, v| v.language.id.to_s == bible_langauge_id }.values
    end


    # Version.all_by_language
    # Group all versions by language

    # returns a hash where:
    # - key: language_tag
    # - value: array of Version instances

    # example:
    # {"acn"=>[Ngochang Common Language Bible (NGCL)],
    #  "acr"=>
    #         [Ri utzilaj tzij re ri kanimajawal Jesucristo (ACRNNT),
    #         I 'utz laj tzij re i dios (ACRNT),
    #         Ri utzilaj tzij re ri kanimajawal Jesucristo (ACRTNT)] ...

    def all_by_language(opts={})
      # to allow a restricted subset of versions (e.g. for white-list sites)
      _all = Version.all.find_all{|v| opts[:only].include? v.id} if opts[:only]
      _all ||= all
      _all.group_by {|v| v.language.tag}
    end

    def by_language(opts={})
      # to only allow certain languages (eg. "en"), instead of all_by_language which is actually filtering by version id
      _all = Version.all.find_all{|v| opts[:only].include? v.language.tag } if opts[:only]
      # _all ||= all
      # _all.group_by {|v| v.language.tag}
    end


    # Version.all_by_publisher
    # Group all versions by Publisher id

    # returns a hash where:
    # - key: id of publisher
    # - value: array of Version instances
    
    # example:
    # {94=>
    #      [Ngochang Common Language Bible (NGCL),
    #       Falam Common Language Bible (FCL) ....

    def all_by_publisher(opts={})
      # to allow a restricted subset of versions (e.g. for white-list sites)
      _all = Version.all.find_all{|v| opts[:only].include? v.id} if opts[:only]
      _all ||= all
      _all.group_by {|v| v.publisher_id}
    end

    # Version.find(1)
    # Version.find("1")
    # Version.find("1-KJV")
    # Version.find(Version instance)

    # Find a particular version
    def find(version)
      ver = versions[self.id_from_param(version)]
      raise NotAVersionError if ver.nil?
      return ver
    end


    # Version.default_for("eng")
    # retrieve a default version for a particular language tag

    def default_for(app_lang_tag)
      bible_langauge_id = case app_lang_tag
        when Hash, Hashie::Mash
          app_lang_tag.id.to_s
        else
          YV::Conversions.to_bible_api_lang_code(app_lang_tag).to_s
      end

      defaults[bible_langauge_id]
    end


    # Version.default
    # defaults to "eng" version which is KJV.

    def default()
      defaults["eng"] || find(1)
    end

    # Version.sample_for()
    # Return a random sampled Version id for a provided language
    # TODO: This should probably jsut return the version and not just an ID.

    def sample_for(lang, opts={})
      except_id = id_from_param(opts[:except])
      lang = lang.to_s

      samples = all_by_language[lang]
      return nil if samples.nil?

      samples = samples.find_all{|v| v.id != except_id}
      sample = nil

      until sample.blank?
        sample = samples.delete_at(Random.rand(samples.length))
        sample = nil if opts[:has_ref] && !sample.include?(opts[:has_ref])
      end

      return nil if sample.nil?
      return sample.id
    end

    # API Method, cached as class @versions variable
    # Returns a hash where:
    # - key: language_tag
    # - value: human readable language name
    # ex: {"acn"=>"Achang", "acr"=>"Achi", "acu"=>"Achuar", "en" => "English" ...

    def languages(opts={})
      return @languages if @languages.present?

      @languages = Hashie::Mash.new(Hash[all_by_language(opts).map{|tag,versions| [tag, versions.first.language.human]}])
    end


    # Version.id_from_param(1 | "1" | "1-KJV" | Version Instance)
    # retrieve the numeric version id for a given param

    def id_from_param(ver)
      case ver
      when Fixnum         # 1
        ver
      when /^\d+$/        # "1"
        ver.to_i
      when /^(\d+)\-.*/   #  "1-KJV"
        $1.to_i
      when String
        YV::Conversions.usfm_version(ver) || ver
      when Version
        ver.id
      else
        ver
      end
    end


    private # Private class methods

    # API Method, cached as class @versions variable
    # Returns a hash of version id(key) -> Version instance(value)
    # ex: {515=>Yamajam chicham apajuinu (AGRNT), 579=>KAMIITHARI ÑAANTSI (CPCNT) ...

    def versions
      return @versions if @versions.present?

      # Example returned data from API call

      # [{"versions"=>
      #    [{"id"=>373,
      #      "abbreviation"=>"NGCL",
      #      "local_abbreviation"=>"NGCL",
      #      "title"=>"Ngochang Common Language Bible",
      #      "local_title"=>"Ngochang Common Language Bible",
      #      "audio"=>false,
      #      "text"=>true,
      #      "language"=>
      #       {"iso_639_1"=>nil,
      #        "iso_639_3"=>"acn",
      #        "language_tag"=>"acn",
      #        "name"=>"Achang",
      #        "local_name"=>"Achang",
      #        "text_direction"=>"ltr"},
      #      "publisher_id"=>94,
      #      "platforms"=>
      #       {"win8"=>true,
      #        "wp7"=>true,
      #        "ios"=>true,
      #        "facebook"=>true,
      #        "blackberry"=>true,
      #        "android"=>true},
      #      "offline"=>
      #       {"build"=>{"max"=>5, "min"=>5},
      #        "platforms"=>
      #         {"win8"=>true,
      #          "wp7"=>true,
      #          "ios"=>true,
      #          "blackberry"=>true,
      #          "android"=>true},
      #        "always_allow_updates"=>true,
      #        "allow_redownload"=>false,
      #        "url"=>
      #         "//static-youversionapi-com.commondatastorage.googleapis.com/bible/text/offline/373-5.zip",
      #        "require_email_agreement"=>false},
      #      "metadata_build"=>12},

      
      data, errs = get("bible/versions", type: "all", cache_for: YV::Caching.a_short_time)
      results = YV::API::Results.new(data,errs)
        raise_errors(results.errors, "Version#versions") unless results.valid?
        
      #versions hash of form [<version numerical uid> => <Version object instance>]
      return @versions = Hash[ data["versions"].map {|ver| [ver["id"], Version.new(ver)]} ]
    end



    # API Method, cached as class @defaults variable
    # Returns a hash of language_tag(key) -> id(value)
    # ex: {"acn"=>373, "acr"=>3, "acu"=>4, "ach"=>nil ...
    def defaults
      return @defaults if @defaults.present?

      # Example returned data

      # [{"stylesheets"=>
      #    {"android"=>
      #      "//static-youversionapi-com.commondatastorage.googleapis.com/bible/text/styles/android.css",
      #     "ios"=>
      #      "//static-youversionapi-com.commondatastorage.googleapis.com/bible/text/styles/ios.css"},
      #   "default_versions"=>
      #    [{"name"=>"Achang",
      #      "language_tag"=>"acn",
      #      "iso_639_1"=>nil,
      #      "iso_639_3"=>"acn",
      #      "text_direction"=>"ltr",
      #      "local_name"=>"Achang",
      #      "id"=>373},
      #     {"name"=>"Achi",
      #      "language_tag"=>"acr",
      #      "iso_639_1"=>nil,
      #      "iso_639_3"=>"acr",
      #      "text_direction"=>"ltr",
      #      "local_name"=>"Achi",
      #      "id"=>3} ...


      data, errs = get("bible/configuration") # We don't need to cache this, as we're memoizing in @defaults class variable.
      results = YV::API::Results.new(data,errs)
        raise_errors(results.errors, "Version#defaults") unless results.valid?

      return @defaults = Hash[data.default_versions.map {|d| [d.language_tag, d.id]}]
    end

  end
  # END Class method definitions ------------------------------------------------------------------------


  # version_instance.to_param
  # return a value to be used as a url parameter
  # kjv.to_param
  # => "1"
  def to_param
    "#{id}"
  end

  # A hashed value of param
  # not sure the need / value of this or where it's used.
  def hash
    to_param.hash
  end


  # version_instance.language
  # get language info for a version
  # ex: kjv.language
  #     => {"tag"=>"en", "id"=>"eng", "human"=>"English", "direction"=>"ltr"}

  def language
    @language ||= Hashie::Mash.new({tag: YV::Conversions.bible_to_app_lang_code(@attributes.language.language_tag),
                                    id: @attributes.language.language_tag,
                                    human: @attributes.language.local_name,
                                    direction: @attributes.language.text_direction})
  end


  # version_instance.include?( reference_instance )
  # returns boolean if version includes a particular reference.

  def include?(ref)
    raise "versions only contain references!" unless ref.is_a? Reference

    begin
      book = books[ref.book.to_s]
      return false if book.nil?

      chapter_found = book.chapters.any? {|hash| hash.usfm == ref.chapter_usfm }
      return false if chapter_found == false

    rescue
      return false #if we get any errors here false is the better choice.
    end

    #API doesn't send verse information anymore :(
    return true
  end



  # API Method
  # attributes of a version that can only be found with a specific /version call
  def detailed_attributes
    
    return @detailed_attributes unless @detailed_attributes.nil?

    data, errs = self.class.get("bible/version", cache_for: YV::Caching.a_very_long_time, id: id)
    if errs.blank?
       @detailed_attributes = data
    else
       #TODO track exception?
    end
    
    # uncommenting to show API issue, leavning here in case we need it in a pinch
    # @detailed_attributes.publisher.name = nil if @detailed_attributes.publisher.name == 'null'
    return @detailed_attributes
  end



  # version_instance.books
  # return a hash of book data for a version
  # example data returned
  
  # {"GEN"=>
  #   {"text"=>true,
  #    "canon"=>"ot",
  #    "chapters"=>
  #     [{"toc"=>true, "canonical"=>true, "human"=>"1", "usfm"=>"GEN.1"},
  #      {"toc"=>true, "canonical"=>true, "human"=>"2", "usfm"=>"GEN.2"}...],
  #    "usfm"=>"GEN",
  #    "abbreviation"=>"Genesis",
  #    "human"=>"Genesis",
  #    "audio"=>true,
  #    "human_long"=>"Genesis",
  #    "to_meta"=>"GEN Genesis"},
  # "EXO"=>
  # { ... }

  # TODO: turn this into an Object/Model

  def books
    return @books if @books.present?

    @books = Hashie::Mash.new
    detailed_attributes['books'].each_with_index do |b, i|
      @books[b.usfm] = b.merge({chapters: b.chapters, to_meta: "#{b.usfm} #{b.human}"})
    end
    return @books
  end


  def blurb
    self.class.i18nize(detailed_attributes.reader_footer)
  end
  
  def copyright
    self.class.i18nize(detailed_attributes.copyright_short)
  end

  def info
    self.class.i18nize(detailed_attributes.copyright_long)
  end

  # instance.audio_version?
  # find out if this version supports audio
  # returns boolean

  def audio_version?
    audio
  end

  def rtl?
   text_direction =="rtl"
  end


  def text_direction
    language.direction
  end


  def title
    @attributes.local_title || @attributes.title
  end


  def abbreviation
    (@attributes.local_abbreviation || @attributes.abbreviation).try :upcase
  end


  def to_s
    "#{title} (#{abbreviation.upcase})"
  end


  def to_meta
    to_s
  end

  def human
    #only return first section (before any - or _ qualifier) of abbreviation
    abbreviation.upcase.match(/\A[^-_]*/).to_s
  end


  def publisher
    detailed_attributes.publisher || Hashie::Mash.new({"id"=>nil, "name"=>nil, "url"=>nil, "description"=>nil})
  end


  def url
    detailed_attributes.reader_footer_url
  end


  def has_publisher?
    publisher_id.present?
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

  def ==(compare)
    #if same class
    (compare.class == self.class) &&  compare.hash == hash
  end


  def eql?(compare)
    self == compare
  end


end
