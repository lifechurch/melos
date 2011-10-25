class Note
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  def persisted?
    false
  end

  attr_reader :errors
  
  def initialize(params = {})
    reg_data = {title: "", content: "", precontent: "", language_iso: "", reference: "", version: "", published: "", user_status: "", share_connections: "", auth: nil}    
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
  
  def self.find(id, auth) 
    response = YvApi.get('notes/view', {:id => id, :auth => auth} ) do |errors|     
      @errors = errors.map { |e| e["error"] }
      return false
    end

    @note = Note.new(response)
    @note.auth = auth
    @note
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
  
  def self.all(auth)    
    if auth
      response = YvApi.get('notes/items', {:user_id => auth.id, :auth => auth} ) do |errors|
        @errors = errors.map { |e| e["error"] }
        return false
      end
    else        
      response = YvApi.get('notes/items') do |errors|     
        @errors = errors.map { |e| e["error"] }
        return false
      end
    end
    response.notes    
  end
  
  def all(auth)
    self.class.all(auth)
  end
    
  def create
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    @content = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE yv-note SYSTEM "http://' << Cfg.api_root << '/pub/yvml_1_0.dtd"><yv-note>' << @precontent << '</yv-note>'
    @reference = @reference.gsub('+', '%2b')

    response = YvApi.post('notes/create', attributes(:title, :content, :language_iso, :reference, :version,
        :published, :user_status, :shared_connections, :token, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }      
      return false
    end
    response
  end
  
  def update(id, fields)
    save_values(fields)
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"
    @content = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE yv-note SYSTEM "http://' << Cfg.api_root << '/pub/yvml_1_0.dtd"><yv-note>' << @precontent << '</yv-note>'
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
    
end
