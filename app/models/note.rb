class Note < YouVersion::Resource

  attr_accessor :reference_list

  attribute :id
  attribute :reference
  attribute :references
  attribute :title
  attribute :content
  attribute :content_text
  attribute :content_html
  attribute :published
  attribute :user_status
  attribute :share_connections
  attribute :version
  attribute :version_id
  attribute :user_avatar_url
  attribute :username
  attribute :highlight_color

  belongs_to_remote :user
  has_many_remote :likes

  def self.for_reference(ref, params = {})
    all(params.merge({references: ref.notes_api_string}))
  end

  def self.for_user(user_id, params = {})
    all(params.merge({user_id: user_id}))
  end
  
  def self.destroy_id_param
    :ids
  end

  # Override Resource's base method here, because Note API
  # returns a different error key for non-auth requests.
  def self.retry_with_auth?(errors)
    errors.find {|t| t['key'] =~ /notes.note.private/}
  end

  def content_as_xml
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{self.content.gsub(/\n/, " ")}</yv-note>"
  end

  def before_save
    @original_content = self.content
    self.content = self.content_as_xml
    if self.reference.nil? || self.reference.try(:empty?)
      self.reference_list = ReferenceList.new(nil)
    else
      self.reference_list = self.reference.class == ReferenceList ? self.reference : ReferenceList.new(self.reference)
      self.version = self.reference_list.first[:version] if self.reference_list.first[:version]
    end
    self.version_id = case self.version
                      when Fixnum
                        self.version
                      when String
                        YvApi::get_usfm_version(self.version).id
                      when Version
                        self.version.id
                      end
    # self.version_id = self.version.class == Version ? self.version.id : YvApi::get_usfm_version(self.version).id
    self.references = self.reference_list.to_api_string
  end

  def after_save(response)

    if response
      # To map to API 2.x style to minimize changes
      self.content_html = response.content.html
      self.content = response.content.text

      self.reference = ReferenceList.new(response.references, Version.find(response.version_id))
      self.version = Version.find(response.version_id)
    end
  end

  def after_build
    # self.content = self.content_text unless self.content_text.blank?
    self.content = self.content_html if self.content_html
    if self.references
      self.reference_list = ReferenceList.new(self.references, Version.find(self.version_id))
    else
      self.reference_list = ReferenceList.new(nil)
    end
    self.version = Version.find(self.version_id) if self.version_id
    # To map to API 2.x style to minimize changes
    unless self.content.is_a? String
      self.content_html = self.content.try :html
      self.content = self.content.try :text
    end
  end

  def user_avatar_url
    return @ssl_avatar_urls unless @ssl_avatar_urls.nil?

    #we only want to use secure urls
    sizes = ["24x24", "48x48", "128x128", "512x512"]
    hash ={}
    sizes.each do |size|
      hash["px_#{size}"] = attributes["user_avatar_url"]["px_#{size}_ssl"]
    end

    @ssl_avatar_urls = Hashie::Mash.new(hash)
  end
#   def update(fields)
#     self.version = Version.find(fields[:version]) if fields[:version]
#     self.reference = ReferenceList.new(fields[:reference], self.version) if fields[:reference]
#   end
end
