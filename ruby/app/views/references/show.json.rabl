object @presenter.reference

attributes :chapter => :reader_chapter, :version_string => :reader_version, :content_plain => :reader_html, :to_path => :to_path, :previous_chapter_hash => :previous_chapter_hash, :next_chapter_hash => :next_chapter_hash, :audio => :reader_audio

node :reader_book do |r|
	r.human[0, r.human.length - (r.chapter.to_s.length + 1)]
end

node :human do |r|
    r.human
end