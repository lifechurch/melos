class Note
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  def persisted?
    false
  end

  attr_reader :errors
  
  def initialize(params = {})
    reg_data = {id: 0, title: "", content: "", language_iso: "", reference: "", version: "", published: "", user_status: "", share_connections: "", auth: nil}    
    reg_data.merge! params
    reg_data.each do |k,v|    
      # Create instance variable
      self.instance_variable_set("@#{k}", v)
      # Create the getter
      self.class.send(:define_method, k, proc{self.instance_variable_get("@#{k}")})
      # Create the setter
      self.class.send(:define_method, "#{k}=", proc{|v| self.instance_variable_set("@#{k}", v)})
    end
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

    response = YvApi.post('notes/create', attributes(:title, :content, :language_iso, :reference, :version,
        :published, :user_status, :shared_connections, :token, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }      
      return false
    end
    id = response.id    
    response
  end
  
  def update(id, fields)
    save_values(fields)
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    @content = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE yv-note SYSTEM "http://' << Cfg.api_root << '/pub/yvml_1_0.dtd"><yv-note>' << @content << '</yv-note>'
    @reference = @reference.gsub('+', '%2b')

    response = YvApi.post('notes/update', attributes(:id, :title, :content, :language_iso, :reference, :version,
        :published, :user_status, :shared_connections, :token, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }      
      return false
    end
    response
  end
  
  def destroy
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    
    response = YvApi.post('notes/delete', attributes(:id, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
    response
  end
  
  private
  
  def attributes(*args)
    array = args
    array = self.instance_variables.map { |e| e.to_s.gsub("@", "").to_sym} if array == []
    attrs = {}
    array.each do |var|
      attrs[var] = instance_variable_get("@#{var}")
    end
    attrs
  end
  
  def save_values(values)
    values.each do |k,v|    
      # Create instance variable
      self.instance_variable_set("@#{k}", v)
      # Create the getter
      self.class.send(:define_method, k, proc{self.instance_variable_get("@#{k}")})
      # Create the setter
      self.class.send(:define_method, "#{k}=", proc{|v| self.instance_variable_set("@#{k}", v)})
    end    
  end
  
  def self.build_object(response, auth)
    @note = Note.new(response)
    @note.auth = auth
    #@note.content = @note.content_html
    @note.content = @note.content_text
    @note.reference = hash_to_osis(@note.reference)
    @note
  end
  
  def self.build_objects(response, auth)
    @return_notes = []
    response.each do |note|
      @note = Note.new(note)
      @note.auth = auth
      #@note.content = @note.content_html
      @note.content = @note.content_text
      @note.reference = hash_to_osis(@note.reference)
      @return_notes << @note      
    end
    @return_notes
  end
  
  # PARM (values): Array of Reference hashies
  # RETURN: String in OSIS format
  def self.hash_to_osis(values) 
    return_val = ""
    values.each do |ref|
      return_val << "#{ref.osis}+"
    end
    return_val[0..-2]
  end
      
end
