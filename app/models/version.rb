class Version
  @@api_data = nil
  @@versions = {}
  @@all_by_language = {}
  @@languages = {}
  def self.all(lang = "")

    if lang == ""
      versions
    else
      versions.select { |k, v| v.language == lang }
    end
  end

  def self.find(version)
    versions[version]
  end

  def self.languages
    if @@languages = {}
      @@languages = Hash[*Version.all.group_by { |k, v| v.language}.keys.each {|a| a.to_a}.map {|h| h.to_a.flatten - ["iso", "human"]}.flatten]
    end
    @@languages
  end

  def self.all_by_language
    # versions.group_by { |k, v| v.language }
    if @@all_by_language == {}
      @@all_by_language = Version.all.group_by {|k, v| v.language.iso}
      @@all_by_language.each {|k, v| @@all_by_language[k] = Hash[*v.flatten]}
    end
    @@all_by_language
  end

  def initialize(version)
    @version = version
    @data = api_data.versions[version]
  end

  def language
    @data.language
  end

  def title
    @data.title
  end

  def osis
    @version
  end
  
  private

  def self.versions
    api_data.versions.each { |k, v| @@versions[k] = Version.new(k) } if @@versions.empty?
    @@versions
  end

  def versions
    self.class.versions
  end

  def self.api_data
    @@api_data ||= YvApi.get("bible/versions", type: "all")
  end

  def api_data
    self.class.api_data
  end
end