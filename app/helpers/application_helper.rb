module ApplicationHelper
  
  def object_status   #TODO: More useful name?
    status = {}
    status['Public'] = 'public'
    status['Private'] = 'private'
    status['Draft'] = 'draft'
    status
  end

  def truncate_words(text, length = 30, truncate_string = "...")
    return if text.empty?
    l = length - truncate_string.length
    text.length > length ? text[/\A.{#{l}}\w*\;?/m][/.*[\w\;]/m] + truncate_string : text
  end 

  def bible_path(ref = nil)
    ref = last_read || Reference.new(book: "gen", chapter: "1", version: current_version) if ref.nil?
    
    if ref.raw_hash[:verse]
      reference_path(ref.raw_hash.except(:verse).to_osis_string, anchor: ref.verse_string)
    else
      reference_path(ref.osis)
    end
  end
end
