class Highlight < YouVersion::Resource
  attribute :color
  attribute :reference
  attribute :version

  def before_save
    self.reference = Reference.new(self.reference) unless self.reference.is_a? Reference
    version = self.reference.version
    self.reference = self.reference.osis_noversion
  end

  def self.for_reference(reference, params = {})
    reference = Reference.new(reference) unless reference.is_a? Reference
    reference = Reference.new(reference.raw_hash.except(:verse))
    params[:page] ||= 1
    opts = {reference: reference.osis_noversion, version: reference.version}.merge(params)

    response = YvApi.get("highlights/chapter", opts) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end

    list = ResourceList.new
    list.total = response.total
    response.highlights.each { |h| list << new(h.merge(auth: params[:auth]))}
    list
  end

end
