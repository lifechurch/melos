class Note
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include Model
  def persisted?
    return !id.blank?
  end

  attr_reader :errors
  attr_accessor :references
  
  def initialize(params = {})
    reg_data = {id: nil, title: "", content: "", prexml_content: "", language_iso: "", reference: "", version: "", published: "", user_status: "", share_connections: "", auth: nil}    
    initialize_class(self, params, reg_data)    
  end
  
  def to_param    
    puts "listening"
    id    
  end

  def like
    Like.for_note(id)
  end

  def self.find(id, auth = nil)
    response = YvApi.get('notes/view', id: id ) do |e|   # anonymous    
      YvApi.get('notes/view', id: id, auth: auth) do |e| # auth'ed
        @errors = errors.map { |e| e["error"] }
        return false
      end
    end

    build_object(response, auth)
  end
    
  def find(id, auth)
    self.class.find(id, auth)
  end

  def self.all
    response = YvApi.get('notes/items') do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end

    build_objects(response.notes, nil)
  end
  
  def all
    self.class.all
  end

  def self.for_user(user_id, auth)
    response = YvApi.get('notes/items', {:user_id => user_id, :auth => auth} ) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end

  build_objects(response.notes, auth)
  end

  def self.for_reference(ref)
    response = YvApi.get('notes/items', reference: ref.notes_api_string) do |errors|
      puts errors
      @errors = errors.map { |e| e["error"] }
      return false
    end
  end

  def for_user(user_id)
    self.class.for_user(user_id, auth)
  end

  def create
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    @prexml_content = @content
    @content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{@content}</yv-note>"
    @reference = @reference.gsub('+', '%2b')

    response = YvApi.post('notes/create', class_attributes(:title, :content, :language_iso, :reference, :version,
        :published, :user_status, :shared_connections, :token, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }
      @content = @prexml_content
      return false
    end
    @id = response.id
    @version = Version.new(response.version)
    @reference = response.reference
    response
  end

  def update(id, fields)
    set_class_values(self, fields)
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    @prexml_content = @content
    @content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{@content}</yv-note>"
    @reference = @reference.gsub('+', '%2b')

    response = YvApi.post('notes/update', class_attributes(:id, :title, :content, :language_iso, :reference, :version,
        :published, :user_status, :shared_connections, :token, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }
      @content = @prexml_content
      return false
    end
    @version = Version.new(response.version)
    @reference = response.reference
    response
  end

  def destroy
    response = YvApi.post('notes/delete', class_attributes(:id, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
    response
  end
  
  private
   
  def self.build_object(response, auth)
    @note = Note.new(response)
    @note.auth = auth
    @note.content = @note.content_text
    @note.references = @note.reference.map { |n| Reference.new("#{n.osis}.#{@note.version}") }
    @note.version = Version.new(@note.version)
      
    #@note.reference = Reference.new("#{Model::hash_to_osis(@note.reference)}.#{@note.version.osis}")
    @note
  end
  
  def self.build_objects(response, auth)
    @return_notes = []
    response.each do |note|
      @return_notes << build_object(note, auth)
    end
    @return_notes
  end
  
end
