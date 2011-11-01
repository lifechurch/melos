class Reference
  def initialize(ref)
    @api_data = {}
    case ref
    when String
      @ref = ref.to_osis_hash
    when Hash
      @ref = ref
    end
      # raise "Tried to create an invalid reference. Make sure you're passing an OSIS string or hash with at least a book name, chapter, and version." unless (@ref[:book] && @ref[:chapter] && @ref[:version])
  end

  def hash
    @ref
  end

  def to_s
    @string = self.ref_string
    @string += " (#{self.version_string})" if @ref[:version]
    @string
  end

  def ref_string
    case @ref[:verse]
    when Fixnum
      @human ||= api_data.items[0].data.reference.human.to_s
    when Range
      @human ||= api_data.items[0].data.reference.human.to_s + "-#{@ref[:verse].last.to_s}"
    when NilClass
      # it's a chapter only; use the chapter API data
      @human ||= api_data[0].data.request.reference.human.to_s
    end
  end

  def version_string
    @version_string ||= @ref[:version].upcase
  end

  def merge(hash)
    Reference.new(@ref.merge(hash))
  end

  def merge!(hash)
    @ref.merge!(hash)
    return self
  end

  def [](arg)
    @ref[arg]
  end

  def to_param
    osis
  end

  def contents
    @contents ||= parse_contents
  end

  def copyright
    @copyright ||= @ref[:verse] ? api_data.copyright : api_data[0].data.copyright
    return nil if @copyright.blank?
    @copyright
  end

  def osis
    @ref.to_osis_string
  end

  def human

  end
  private

  def api_data
    api_type = @ref[:verse] ? 'verse' : 'chapter'
    format = api_type == 'verse' ? 'text' : 'html'
    @api_data[:format] ||= YvApi.get("bible/#{api_type}",
                                      format: format,
                                      version: @ref[:version],
                                      reference: @ref.except(:version).to_osis_string)
  end

  def parse_contents
    if @ref[:verse]
      # then it's a verse range; use the verse style
      api_data.items.map { |a| a.data.content }
    else
      # It's a chapter
      [api_data[0].data.request.content]
    end
  end
end



