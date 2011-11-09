class Note < YvModel

  attr_reader :errors, :title, :id, :content, :version, :user_status
  attr_accessor :references
  set_defaults(id: nil, title: "", content: "", prexml_content: "", language_iso: "", reference: "", version: "", published: "", user_status: "", share_connections: "", auth: nil)
  
  def to_param    
    id    
  end
  
  def like
    Like.for_note(id)
  end

  def like_for_user
    Like.for_note(id, auth.user_id)
  end

  def self.find(id, auth = nil)
    response = YvApi.get('notes/view', id: id ) do |errors|   # anonymous    
      YvApi.get('notes/view', id: id, auth: auth) do |ee| # auth'ed
        @errors = ee.map { |e| e["error"] }
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

  def for_user(user_id)
    self.class.for_user(user_id, auth)
  end

  def self.for_reference(ref)
    response = YvApi.get('notes/items', reference: ref.notes_api_string) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
  end

  def create
    save
  end

  def update(fields)
    hash_to_vars(fields)
    save
  end

  def save
    @token = Digest::MD5.hexdigest "#{@auth.username}.Yv6-#{@auth.password}"
    @prexml_content = @content
    @content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{@content}</yv-note>"
    @reference = @references.map { |r| r.notes_api_string }.join("+")
    @version = @version.osis
    endpoint = persisted? ? "notes/update" : "notes/create"
    attrs = attributes(:title, :content, :language_iso, :reference, :version, :published, :user_status, :shared_connections, :token, :auth)
    attrs[:id] = @id.to_s if persisted?
    response = YvApi.post(endpoint, attrs) do |errors|
      @errors = errors.map { |e| e["error"] }
      @content = @prexml_content
      return false
    end
    @id = response.id.to_i
    @version = Version.new(response.version)
    @references = []
    response.reference.each do |r|
      @references << Reference.new(r)
    end
    !response.false?
  end
  
  def destroy
    @token = Digest::MD5.hexdigest "#{@auth.username}.Yv6-#{@auth.password}"
    
    response = YvApi.post('notes/delete', attributes(:id, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
    response
  end
  
  private
   
  def self.build_object(response, auth)
    response.references = response.reference.map { |n| Reference.new("#{n.osis}.#{response.version}") }
    response.version = Version.find(response.version)
    @note = Note.new(response.merge(auth: auth, content: response.content_text))
  end
  
  def self.build_objects(response, auth)
    @return_notes = []
    response.each do |note|
      @return_notes << build_object(note, auth)
    end
    @return_notes
  end
  
end
