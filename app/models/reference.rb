class Reference
  def initialize(ref)
    @api_data = {}
    case ref
    when String
      @ref = ref.to_osis_hash
    when Hash
      @ref = ref
    end
      raise "Tried to create an invalid reference. Make sure you're passing an OSIS string or hash with at least a book name, chapter, and version." unless (@ref[:book] && @ref[:chapter] && @ref[:version])
  end


  def hash
    @ref
  end

  def string
    @ref.to_osis_string
  end

  def text
    @text ||= parse_contents(:text)
  end

  def html
    @html ||= parse_contents(:html)
  end

  def copyright
    @copyright ||= @ref[:verse] ? api_data.copyright : api_data[0].data.copyright
    return nil if @copyright.blank?
    @copyright
  end

  def human
    case @ref[:verse]
    when Fixnum
      @human ||= api_data.items[0].data.reference.human.to_s
    when Range
      @human ||= api_data.items[0].data.reference.human.to_s + "-#{@ref[:verse].last.to_s}"
    when NilClass
      # it's a chapter only; use the chapter API data
      @human ||= api_data[0].data.request.reference.human.to_s
    end
    @human += " (#{@ref[:version].upcase})" if @ref[:version]
    @human
  end
  private

  # Because there are two formats, text and html, this api wrapper
  # takes a symbol argument for the format (either :html or :text)
  def api_data(format = :html)
    # hard-coding to :html in the case when no format is passed (like for
    # human, etc where it doesn't matter).
    format = :html_basic if format == :html
    api_type = @ref[:verse] ? 'verse' : 'chapter'
    @api_data[:format] ||= YvApi.get("bible/#{api_type}",
                                      format: format,
                                      version: @ref[:version],
                                      reference: @ref.except(:version).to_osis_string)
  end

  def parse_contents(format)
    if @ref[:verse]
      # then it's a verse range; use the verse style
      api_data(format).items.map { |a| a.data.content }
    else
      # It's a chapter
      api_data(format)[0].data.request.content.map(&:content)
    end
  end
end



