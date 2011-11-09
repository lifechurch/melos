class Note < YouVersion::Resource
  attr_accessor :references

  attribute :reference
  attribute :title
  attribute :content_text
  attribute :content
  attribute :published
  attribute :user_status
  attribute :share_connections

  def self.for_reference(ref)
    all(reference: ref.notes_api_string)
  end

  def before_save
    self.content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{@content}</yv-note>"
    self.reference = self.reference.gsub('+', '%2b')
  end
  
  def after_save
    self.reference = Reference.new("#{Model::hash_to_osis(response.reference)}.#{response.version}")
  end
  
  def before_update
    self.content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{@content}</yv-note>"
    self.reference = @reference.gsub('+', '%2b')
  end
  
  def after_update(response)
    self.version = Version.new(response.version)
    self.reference = Reference.new("#{Model::hash_to_osis(response.reference)}.#{response.version}")
  end
  
  def after_build
    self.content = self.content_text
    self.references = self.reference.map { |n| Reference.new("#{n.osis}.#{self.version}") }
    self.version = Version.new(self.version)
  end
  
end
