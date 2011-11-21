class Note < YouVersion::Resource
  attr_accessor :references

  attribute :reference
  attribute :title
  attribute :content_text
  attribute :content
  attribute :published
  attribute :user_status
  attribute :share_connections
  attribute :version, Version
  attribute :user_avatar_url

  belongs_to_remote :user
  has_many_remote :likes

  def self.for_reference(ref)
    all(reference: ref.notes_api_string)
  end

  def self.for_user(user_id, params = {})
    all(params.merge({:user_id => user_id}))
  end

  # Override Resource's base method here, because Note API
  # returns a different error key for non-auth requests.
  def self.retry_with_auth?(errors)
    errors.find {|t| t['key'] =~ /notes.note.private/}
  end

  def before_save
    @original_content = self.content
    self.content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{self.content}</yv-note>"
    self.reference = self.reference.map(&:notes_api_string).join("+") if self.reference.is_a?(Array)
    # self.version = self.version.osis
  end

  def after_save(response)
    self.content = @original_content
    if response
      case self.reference
      when Array
        self.reference = self.reference.map { |r| Reference.new("#{r.osis.downcase}.#{response.version}") }
      when String
        self.reference = [Reference.new("#{self.reference.downcase}.#{response.version}")]
      end
    end
  end

  def before_update
    @original_content = self.content
    self.content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{self.content}</yv-note>"
    self.reference = self.reference.map(&:osis).join("%2b") if self.reference.is_a?(Array)
  end

  def after_update(response)
    self.content = @original_content
    if response
      self.reference = Reference.new("#{Model::hash_to_osis(response.reference)}.#{response.version}")
    end
  end

  def after_build
    self.content = self.content_text unless self.content_text.blank?

    if self.reference.is_a?(Array)
      self.references = self.reference.map { |n| Reference.new("#{n.osis}.#{self.version.osis}") }
    end
  end

end
