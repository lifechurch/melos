class Note
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include Model
  def persisted?
    false
  end

  attr_reader :errors
  
  def initialize(params = {})
    reg_data = {id: 0, title: "", content: "", language_iso: "", reference: "", version: "", published: "", user_status: "", share_connections: "", auth: nil}    
    initialize_class(self, params, reg_data)    
  end
  
  def to_param    
    id    
  end
  
  def self.find(id, auth)
    response = YvApi.get('notes/view', {:id => id, :auth => auth} ) do |errors|     
      @errors = errors.map { |e| e["error"] }
      return false
    end

    build_object(response, auth)
  end
    
  def find(id, auth)
    self.class.find(id, auth)
  end
  
  def self.find_by_search(query, auth)
    response = YvApi.get('notes/search', {:user_id => auth.id, :query => URI.escape(query), :page => 1, :auth => auth} ) do |errors|     
      @errors = errors.map { |e| e["error"] }
      return false
    end

    response
  end
    
  def find_by_search(query)
    self.class.find_by_search(query, auth)
  end  
  
  def self.all(user_id, auth)    
    if auth
      response = YvApi.get('notes/items', {:user_id => user_id, :auth => auth} ) do |errors|
        @errors = errors.map { |e| e["error"] }
        return false
      end
    else        
      response = YvApi.get('notes/items') do |errors|     
        @errors = errors.map { |e| e["error"] }
        return false
      end
    end

    build_objects(response.notes, auth)
  end
  
  def all(user_id, auth)
    self.class.all(user_id, auth)
  end
    
  def create
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    @content = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE yv-note SYSTEM "http://' << Cfg.api_root << '/pub/yvml_1_0.dtd"><yv-note>' << @content << '</yv-note>'
    @reference = @reference.gsub('+', '%2b')

    response = YvApi.post('notes/create', class_attributes(:title, :content, :language_iso, :reference, :version,
        :published, :user_status, :shared_connections, :token, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }      
      return false
    end
    id = response.id    
    response
  end
  
  def update(id, fields)
    set_class_values(self, fields)
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    @content = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE yv-note SYSTEM "http://' << Cfg.api_root << '/pub/yvml_1_0.dtd"><yv-note>' << @content << '</yv-note>'
    @reference = @reference.gsub('+', '%2b')

    response = YvApi.post('notes/update', class_attributes(:id, :title, :content, :language_iso, :reference, :version,
        :published, :user_status, :shared_connections, :token, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }      
      return false
    end
    response
  end
  
  def destroy
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    
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
    #@note.content = @note.content_html
    @note.content = @note.content_text
    @note.reference = Model::hash_to_osis(@note.reference)
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
