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
    params.merge!({references: ref.to_usfm, query: '*'})
    #TODO: constrain this to only work for <= 10 verses or chapter
    all(params)
  end

  def self.all(params = {})
    params[:query] ||= '*'

    _auth = params[:auth]
    response = YvApi.get('search/notes', params) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s( |\.)not( |_)found$/, /^Search did not match any documents$/].detect { |r| r.match(errors.first["error"]) }
        Hashie::Mash.new(notes: [])
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end

    notes = ResourceList.new
    notes.total = response.total || 0
    response.notes.each {|data| (notes << new(data.merge(auth:_auth))) rescue nil}
    notes
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
    self.version_id = Version.id_from_param self.version

    # self.version_id = self.version.class == Version ? self.version.id : YvApi::get_usfm_version(self.version).id
    self.references = self.reference_list.to_flat_usfm unless self.reference_list.empty?
  end

  def after_save(response)

    if response
      # To map to API 2.x style to minimize changes
      self.content_html = response.content.try :html
      self.content = response.content.try :text

      self.reference = ReferenceList.new(response.references, Version.find(response.version_id)) if response.references
      self.reference_list = self.reference
      self.version = Version.find(response.version_id) if response.version_id
    end
  end

  def after_build
    # self.content = self.content_text unless self.content_text.blank?
    self.content = self.content_html if self.content_html
    unless self.references.blank?
      self.reference_list = ReferenceList.new(self.references, self.version_id)
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

#   def update(fields)
#     self.version = Version.find(fields[:version]) if fields[:version]
#     self.reference = ReferenceList.new(fields[:reference], self.version) if fields[:reference]
#   end
end
