class Note < YouVersion::Resource
  attr_accessor :references

  attribute :reference
  attribute :title
  attribute :content_text
  attribute :content
  attribute :published
  attribute :user_status
  attribute :share_connections
  attribute :version
  
  def self.for_reference(ref)
    all(reference: ref.notes_api_string)
  end

  def before_save
    @original_content = self.content
    self.content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{self.content}</yv-note>"
    self.reference = self.reference.map(&:osis).join("%2b") if self.reference.is_a?(Array)
    self.version = self.version.osis if self.version.is_a?(Version)
  end
  
  def after_save(response)
    self.content = @original_content
    self.version = Version.new(response.version)
    self.reference = Reference.new("#{Model::hash_to_osis(response.reference)}.#{response.version}")
  end
  
  def before_update
    @original_content = self.content
    self.content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{self.content}</yv-note>"
    self.reference = self.reference.map(&:osis).join("%2b") if self.reference.is_a?(Array)
    self.version = self.version.osis if self.version.is_a?(Version)
  end
  
  def after_update(response)
    self.content = @original_content
    self.version = Version.new(response.version)
    self.reference = Reference.new("#{Model::hash_to_osis(response.reference)}.#{response.version}")
  end
  
  def after_build
    self.content = self.content_text unless self.content_text.blank?

    if self.reference.is_a?(Array)
      self.references = self.reference.map { |n| Reference.new("#{n.osis}.#{self.version}") }
    end
    
    self.version = Version.new(self.version)
  end
  
end
