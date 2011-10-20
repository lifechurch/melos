class Note
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  def persisted?
    false
  end

  def attributes(*args)
    array = args
    array = self.instance_variables.map { |e| e.to_s.gsub("@", "").to_sym} if array == []
    attrs = {}
    array.each do |var|
      attrs[var] = instance_variable_get("@#{var}")
    end
    attrs
  end
  
  attr_reader :errors
  
  def initialize(params = {})
    reg_data = {title: "", content: "", language_iso: "", reference: "", version: "", published: "", user_status: "", share_connections: "", user: nil}    
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
  
  def self.find(id, user)
    response = YvApi.get('notes/view', {:id => id, :user => user} ) do |errors|     
      @errors = errors.map { |e| e["error"] }
      return false
    end
    Note.new(response)
  end
  
  def find(id, user)
    self.class.find(id, user)
  end
  
  def self.all(user)
    response = YvApi.get('notes/items', {:user_id => user.id, :user => user} ) do |errors|     
      @errors = errors.map { |e| e["error"] }
      return false
    end

    #TODO: Complete return

  end
  
  def all(user)
    self.class.all(user)
  end
  
  def save
    @token = Digest::MD5.hexdigest "#{user.username}.Yv6-#{user.password}"
    
    response = YvApi.post('notes/create', attributes(:title, :content, :language_iso, :reference, :version,
        :published, :user_status, :shared_connections, :token, :user)) do |errors|
      @errors = errors.map { |e| e["error"] }
#debugger      
      return false
    end
    response
  end  
  
end
