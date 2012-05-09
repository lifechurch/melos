module ApplicationHelper

  def object_status   #TODO: More useful name?
    status = {}
    status[t('notes.public')] = 'public'
    status[t('notes.private')] = 'private'
    status[t('notes.draft')] = 'draft'
    status
  end

  def truncate_words(text, length = 30, truncate_string = "...")
    return if text.empty?
    l = length - truncate_string.length
    text.length > length ? text[/\A.{#{l}}\w*\;?/m][/.*[\w\;]/m] + truncate_string : text
  end

  def bible_path(ref = nil, opts={})
    ref = last_read || Reference.new(book: "gen", chapter: "1", version: current_version) if ref.nil?
    reference_path(ref.osis, opts)
  end

  def bible_url(ref = nil, opts={})
    ref = last_read || Reference.new(book: "gen", chapter: "1", version: current_version) if ref.nil?
    reference_url(ref.osis, opts)
  end

  def external_url(host, default_locale_path, locale_path={})
    host = case host
      when :blog 
        'http://blog.youversion.com'
      else 
        host
    end

    path = case
      when locale_path[I18n.locale]
        locale_path[I18n.locale]
      when I18n.locale != I18n.default_locale && locale_path[:default]
        locale_path[:default]
      else 
        default_locale_path
    end

    "#{host}/#{lang_code(I18n.locale, :blog)}/#{path}"
  end

  def convert_to_brightness_value(hex_color)
      (hex_color.scan(/../).map {|color| color.hex}).sum
  end

  def report_exception(exception)
      #This is only necessarry in the case of an exception handled by rescue_from, as they are swallowed.
      #This may not be needed in the future if Exceptional adds support for the rescue_from.
      if Exceptional::Remote.error(Exceptional::ExceptionData.new(exception))
        Rails.logger.apc "Exceptional: #{exception.class} has been reported to Exceptional", :info
      else
        Rails.logger.apc "Exceptional: Problem sending exception. Check your API key.", :error
      end
  end

  def is_dark?(hex_color)
    convert_to_brightness_value(hex_color) <= 382.5 #halfway between black (0+0+0 = 0) and white (255+255+255 = 765)
  end

  def scale_frame(html, opts={})
    h_w = html.scan(/<iframe width=\"(\d+)\" height=\"(\d+)\"/).flatten
    unless h_w.empty?
      ratio = 1
      if opts[:width]
        ratio = opts[:width].to_f/h_w[0].to_f
      end
      scaled_w = (h_w[0].to_f * ratio).to_i
      scaled_h = (h_w[1].to_f * ratio).to_i

      html = html.gsub(/<iframe width=\"\d+\" height=\"\d+\"/, '<iframe width="' + scaled_w.to_s + '" height="' + scaled_h.to_s + '"')
    end
    html
  end

  private 
  def lang_code(locale, host=nil)
    case host
      when :blog
        {:'zh-CN' => 'zh-hans', :'zh-TW' => 'zh-hant', :'pt-BR' => 'pt-br'}[locale] || locale
      else
        locale
    end
  end
end
