class Note < YV::Resource

  attr_accessor :reference_list

  attribute :id
  attribute :user_id
  attribute :reference
  attribute :references
  attribute :title
  attribute :content
  attribute :content_text
  attribute :content_html
  attribute :published
  attribute :user_status
  attribute :system_status
  attribute :share_connections
  attribute :version
  attribute :version_id
  attribute :user_avatar_url
  attribute :username
  attribute :highlight_color


  class << self


    # API Method
    # Returns ResourceList of Note instances

    # Constrained to only work for <= 10 verses or a chapter
    # API doesn't want more than 10 verses or returns the following error:
    # YV::ResourceError: search.references.exceeded_10_verse_references
    
    # reference.to_usfm 
    # => "GEN.2.5+GEN.2.6+GEN.2.7+GEN.2.8+GEN.2.9+GEN.2.10+GEN.2.11+GEN.2.12+GEN.2.13+GEN.2.14+GEN.2.15"
    # lets take the output and truncate it to 10 or less.

    def for_reference(ref, params = {})
      only_10_refs = ref.to_usfm.split("+")[0...10].join("+")
      params.merge!({references: only_10_refs, query: '*'})
      return search(params)
    end



    # API Method
    # return all notes for a given search via query: param
    # ex: Note.search(query: "love")
    # returns ResourceList of Note instances

    def search(params = {})
      _auth = params[:auth]
      params[:query] ||= '*'

      data, errs = get("search/notes", params)
      results = YV::API::Results.new(data,errs)

      unless results.valid?
        if results.has_error?("not found") or 
           results.has_error?("Search did not match any documents")
           
           data = Hashie::Mash.new(notes: [])
        else raise_errors(results.errors,"Note#search") end
      else
        #
      end

      notes = ResourceList.new
      data.notes.each do |d|
        notes << new(d)
      end
      notes.total = data.total || 0
      return notes
    end

    def for_user(user_id, params = {})
      params.merge!({user_id: user_id})
      return all(params)
    end

    def destroy_id_param
      :ids
    end

  end
  # END Class method definitions ------------------------------------------------------------------------


  def user
    User.find( self.user_id )
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

    # self.version_id = self.version.class == Version ? self.version.id : YV::Conversions::usfm_version(self.version).id
    self.references = self.reference_list.to_flat_usfm unless self.reference_list.empty?
  end

  def after_save(response)

    if response
      # TODO: this needed?
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

  def can_share?
    return (self.system_status == "new" || self.system_status == "approved") && self.user_status == "public"
  end
end
