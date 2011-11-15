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

  def self.for_reference(ref)
    all(reference: ref.notes_api_string)
  end

  def self.for_user(user_id, params = {})
    all(params.merge({:user_id => user_id}))
  end

  def before_save
    @original_content = self.content
    self.content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{self.content}</yv-note>"
    self.reference = self.reference.map(&:osis).join("%2b") if self.reference.is_a?(Array)
  end

  def after_save(response)
    self.content = @original_content
    if response
      self.reference = Reference.new("#{Model::hash_to_osis(response.reference)}.#{response.version}")
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
