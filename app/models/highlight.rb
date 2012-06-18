class Highlight < YouVersion::Resource
  attribute :color
  attribute :reference
  attribute :version

  def after_build
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
    self.reference = self.reference.osis_noversion.sub(/(\D{1})/){$1.upcase}
  end

  def self.for_reference(reference, params = {})
    reference = Reference.new(reference) unless reference.is_a? Reference
    params[:page] ||= 1
    opts = {reference: reference.osis_book_chapter, version: reference.version}.merge(params)
    opts[:reference].sub!(/(\D{1})/){$1.upcase}

    response = YvApi.get("highlights/chapter", opts) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)not_found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      end
    end

    list = ResourceList.new
    list.total = response.total
    response.highlights.each {|h| list << new(h.merge(auth: params[:auth]))}
    list
  end

  def as_json(options = {})
    #API/apps shouldn't support ranged highlights, but some exist, so use only the first verse if range.
    #EVENTUALLY: make this pervasive/complete so anyone using this object only sees the 1st verse and we can just pass raw_hash[:verses]
    {verse: self.reference.first_verse, color: self.color, id: id, version: version}
  end

end
