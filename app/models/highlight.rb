class Highlight < YouVersion::Resource
  attribute :color
  attribute :reference
  attribute :version

  def after_build
    puts "!@# in the after build"
    case reference
    when String
      self.reference = Reference.new("#{self.reference}.#{self.version}")
    when Hashie::Mash
      self.reference = Reference.new("#{self.reference.osis}.#{self.version}")
    end
  end

  def before_save
    self.reference = Reference.new(self.reference) unless self.reference.is_a? Reference
    self.version = self.reference.version
    self.reference = self.reference.osis_noversion
  end

  def self.for_reference(reference, params = {})
    reference = Reference.new(reference) unless reference.is_a? Reference
    reference = Reference.new(reference.raw_hash.except(:verse))
    params[:page] ||= 1
    opts = {reference: reference.osis_noversion, version: reference.version}.merge(params)

    response = YvApi.get("highlights/chapter", opts) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)not_found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        puts(errors)
      end
    end

    list = ResourceList.new
    list.total = response.total
    response.highlights.each { |h| list << new(h.merge(auth: params[:auth]))}
    list
  end

  def as_json(options = {})
    {verse: self.reference.raw_hash[:verse], color: self.color}

  end

end
