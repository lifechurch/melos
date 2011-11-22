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

  def content_as_xml
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE yv-note SYSTEM \"http://#{Cfg.api_root}/pub/yvml_1_0.dtd\"><yv-note>#{self.content}</yv-note>"
  end

  def before_save
    @original_content = self.content
    self.content = self.content_as_xml
    unless self.reference.is_a?(String)
      self.reference = [self.reference].flatten.compact.map(&:osis_noversion).join("%2b")
    end
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

  def prep_reference_for_persist
    if self.reference.is_a?(Hash) or (self.reference.is_a?(Enumerable) && self.reference.first.is_a?(Hash))
      [self.reference].flatten.map(&:osis).join('%2b')
    else
      unless self.reference.is_a?(String)
        [self.reference].flatten.compact.map(&:osis_noversion).join("%2b")
      end
    end
  end

  def before_update
    @original_content = self.content
    self.content = self.content_as_xml
    # If the format of self.reference needs changing, change it
    if (mod_reference = prep_reference_for_persist)
      self.reference = mod_reference
    end
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
