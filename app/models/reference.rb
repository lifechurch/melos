# encoding: UTF-8
class Reference < YouVersion::Resource

  attr_reader :book
  attr_reader :chapter
  attr_reader :verses
  attr_reader :version

  # We lazy load API attributes for performance
  # see attributes method and attributes.<attr name> for use.
  # The following lines are just for documentation
  #
  # attribute reference
  # attribute copyright
  # attribute audio

  def initialize(ref="", opts={})
    #sometimes we use reference classes just for data management
    #i.e. we don't always need to hit the API. So we'll lazy load
    #API attributes

    ref_hash = case ref
    when String
      YvApi::parse_reference_string ref
    when Hash
      ref
    else
      {}
    end

    #attempt to convert book and version from legacy OSIS to USFM
    _book = ref_hash.try(:[], :book) || opts[:book]
    @book = YvApi::get_usfm_book(_book) || _book
    @book = @book.try :upcase
    @chapter = ref_hash.try :[], :chapter || opts[:chapter]
    @chapter = @chapter.to_i if @chapter
    @verses = ref_hash.try :[], :verses || opts[:verse] || opts[:verses]
    @verses = parse_verses(@verses)
    _version = ref_hash.try(:[], :version) || opts.try(:[], :version)
    @version = YvApi::get_usfm_version(_version) || _version
    @version = Version.id_from_param(@version)

    unless @book && @chapter
      raise InvalidReferenceError, "Tried to create an invalid reference.
            Make sure you're passing a valid period separated string or hash, with
            at least a book and chapter"
    end
  end

  def to_s(opts={})
    return human if opts[:version] == false
    return "#{human} (#{version_string})" if version
    return human
  end

   def human
    case verses
    when Fixnum
      attributes.reference.human.to_s + ":#{verses}"
    when Range
      attributes.reference.human.to_s + ":#{verses.first.to_s}" + "-#{verses.last.to_s}"
    when NilClass
      # it's a chapter only
      attributes.reference.human.to_s
    end
  end

  def to_param
    return "#{to_usfm}.#{Version.find(version).to_param}" if version
    return to_usfm
  end

  def version_string
    Version.find(version).human if version
  end

  def to_usfm
      return "#{chapter_usfm}" unless verses
      return "#{chapter_usfm}.#{verses}" if single_verse?
      return verses.map {|v| "#{chapter_usfm}.#{v}"}.join(YvApi::usfm_delimeter) if verses
  end

  def usfm
    to_usfm
  end

  def chapter_usfm
    "#{book}.#{chapter}"
  end

  def [](arg)
    return self.try(arg.to_sym)
  end

    def hash
    to_param.hash
  end

  def ==(compare)
    #if same class
    (compare.class == self.class) &&  compare.hash == hash
  end

  def eql?(compare)
    self == compare
  end

  def notes
    Note.for_reference(self)
  end

  def merge(hash)
    Reference.new(to_hash.merge(hash))
  end

  def single_verse?
    verses.is_a? Fixnum
  end

  def short_link
    "http://bible.us/#{self.to_param.sub(/\./, "")}"
  end

  def content(opts={})
    return content_mock if is_chapter? && mock?
    return attributes.content if is_chapter?


    case opts[:as]
      when :plaintext
        selector = verses.map{|v_num|".v#{v_num} .content"}.join(', ')
        content_document.css(selector).inner_html
      else #:html
        selector = verses.map{|v_num|".v#{v_num}"}.join(', ')
        content_document.css(selector).to_html
    end
  end

  def copyright
    attributes.copyright.html || attributes.copyright.text if version
  end

  def audio
    return @audio unless @audio.nil?
    return nil if attributes.audio.nil?

    opts = {id: attributes.audio[0].id, cache_for: 12.hours}

    #we have to make this additional call to get the audio bible copyright info
    response = YvApi.get("audio-bible/view", opts) do |errors|
        raise YouVersion::ResourceError.new(errors)
    end
    @audio = attributes.audio[0].merge(response)
    @audio.url = attributes.audio[0].download_urls.format_mp3_32k
    @audio
  end

  def previous_chapter
     return nil unless version

     start = Time.now.to_f
    _usfm = chapter_usfm
    @chapter_list = Version.find(version).books.map{|k,v| v["chapters"]}.flatten unless @chapter_list
    @index = @chapter_list.index{|c| c.usfm == _usfm} unless @index
    return nil if @index == 0

    Rails.logger.apc "**Reference.previous_chapter took #{Time.now.to_f - start} sec to find the chapter", :debug
    self.class.new(@chapter_list[@index - 1].usfm, version: version)
  end

  def next_chapter
    return nil unless version

    start = Time.now.to_f
    _usfm = chapter_usfm
    @chapter_list = Version.find(version).books.map{|k,v| v["chapters"]}.flatten unless @chapter_list
    @index = @chapter_list.index{|c| c.usfm == _usfm} unless @index
    return nil if @index == @chapter_list.count - 1

    Rails.logger.apc "**Reference.next_chapter took #{Time.now.to_f - start} sec to find the chapter", :debug
    self.class.new(@chapter_list[@index - 1].usfm, version: version)
  end

  def first_verse
    case verses
      when Range
        verses.first
      when Fixnum
        verses
      when NilClass
        nil
    end
  end

  def verses_in_chapter
    return @verses_in_chapter unless @verses_in_chapter.nil?

    start = Time.now.to_f
    # regex = /
    #           (?:
    #             <[^>]*                          # a tag
    #             class=                          # with a class attribute
    #               [^>]*\"                       # defined within the tag
    #               [^\"]*                        # with possibly some other classes in the same attribute
    #               verse_content                 # has the verse_content class
    #               [^\"]*                        # with possibly some other classes in the same attribute
    #               (REF_#{book}_#{chapter}_\d+)  # and has a verse class
    #           )
    #         /x

    # # there may be multiple verse spans per verse (inline notes, etc)
    # # so we count unique verse classes
    # @verses_in_chapter = attributes.content.scan(regex).uniq!.size

    # it takes about the same amount of time to parse the html as a document
    # as it does to run a regular expression on it. Since we may need multiple
    # queries, we might as well create and cache the document
    @verses_in_chapter = content_document.css(".verse_label").count
    Rails.logger.apc "** Reference.verses_in_chapter: It took #{Time.now.to_f - start} seconds to scan the content", :debug
    @verses_in_chapter
  end

  def is_chapter?
    verses.nil?
  end

  def valid?
    attributes.reference.human.is_a?(String) rescue false
  end

  def verse_string
    case verses
      when Range
        verses.first.to_s + "-" + verses.last.to_s
      when Fixnum
        verses.to_s
    end
  end

  def verses_string
    # for reader: turns 3,4,8-12 to 3,4,8,9,10,11,12
    case verses
    when Fixnum
      @verses = verses.to_s
    when Range
      @verses = verses.to_a.join(",")
    when String
      @verses = verses.split(",").map do |r|
        case r
        when /^[0-9]+$/
          r
        when /^[0-9-]+$/
          ((r.split("-")[0])..(r.split("-")[1])).to_a.join(",")
        end
      end.flatten.join(",")
      @verses
    end
  end

  def notes_api_string
    case verses
    when Fixnum
      return to_usfm
    when Range
      return to_usfm
    when NilClass
      return (1..verses_in_chapter).map {|r| "#{book}.#{chapter}.#{r}" }.join("+")
    end
  end

  def plan_api_string
    notes_api_string.capitalize
  end

  def osis
    Rails.logger.apc "#{self.class}##{__method__} is deprecated,use the 'to_param' or 'to_usfm' methods instead", :warn
    to_param
  end

  def osis_noversion
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :warn
    to_usfm
  end

  def osis_book_chapter
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :warn
    chapter_usfm
  end

  def to_osis_string
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :warn
    to_param
  end

  def to_hash
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the [] method or attr_reader methods instead", :warn
    #here for transition to API3, replacing raw_hash until not needed
    {book: book, chapter: chapter, verses: verses, version: version}
  end





  #DEBUGprivate

  def attributes
    return @attributes unless @attributes.nil?

    opts = {cache_for: 12.hours}
    # sometimes we just need generic info about a verse, like the human spelling of a chapter
    # in this rare case, we will just use the YouVersion default Version
    opts[:id] =  version || Version.default
    # we will always just get the chapter, and parse down to verses if needed
    # this will utilize server side cache more effectively
    # as the alternative (for multiple verses) is multiple bible/verse calls
    opts[:reference] = chapter_usfm

      @attributes = YvApi.get("bible/chapter", opts) do |errors|
        if errors.length == 1 && [/^Reference not found$/].detect { |r| r.match(errors.first["error"]) }
          raise NotAChapterError
        elsif errors.length == 1 && [/^Version is invalid$/].detect { |r| r.match(errors.first["error"]) }
          raise NotAVersionError
        elsif errors.length == 1 && [/Invalid chapter reference$/].detect { |r| r.match(errors.first["error"]) }
          raise NotABookError
        end
      end
  end

  def parse_verses(verses_str)
    case verses_str
    when Fixnum
      verses_str
    when /^\d+$/
      verses_str.to_i
    when /^(\d+)\-(\d+)/
      Range.new($1, $2)
    else
      verses_str
    end
  end

  def content_document
    @content_document ||= Nokogiri::HTML(attributes.content) unless mock?
    @content_document ||= Nokogiri::HTML(content_mock) if mock?
    #TODO: #PERF: cache this with memcache if we keep and use it
  end
  def mock?
    false
  end
  def content_mock
    <<-end_of_string
      <div class="version vid69 iso6393eng" data-vid="69" data-iso6393="eng">
        <div class="book bkMRK">
          <div class="chapter ch6" data-usfm="MRK.6">
             <div class="label">6</div>
             <div class="s"><span class="heading">Jesus Is Rejected at Nazareth</span></div>
             <div class="r"><span class="heading">(Matthew 13.53-58; Luke 4.16-30)</span></div>
             <div class="p"><span class="content">  </span><span class="verse v1" data-usfm="MRK.6.1"><span class="verse label">1</span><span class="content">Jesus left that place and went back to his hometown, followed by his disciples. </span></span><span class="verse v2" data-usfm="MRK.6.2"><span class="verse label">2</span><span class="content">On the Sabbath he began to teach in the synagogue. Many people were there; and when they heard him, they were all amazed. “Where did he get all this?” they asked. “What wisdom is this that has been given him? How does he perform miracles? </span></span><span class="verse v3" data-usfm="MRK.6.3"><span class="verse label">3</span><span class="content">Isn't he the carpenter, the son of Mary, and the brother of James, Joseph, Judas, and Simon? Aren't his sisters living here?” And so they rejected him.</span></span></div>
             <div class="p"><span class="verse v3" data-usfm="MRK.6.3"><span class="content">  </span></span><span class="verse v4" data-usfm="MRK.6.4"><span class="verse label">4</span><span class="content">  </span><span class="note x"><span class="label">#</span><span class=" body"><span class="ft">  </span><span class="xo"><span class="content">6.4: </span></span><span class="ft">  </span><span class="xt"><span class="content">Jn 4.44.</span></span><span class="ft">  </span></span></span><span class="content"> Jesus said to them, “Prophets are respected everywhere except in their own hometown and by their relatives and their family.”</span></span></div>
             <div class="p"><span class="verse v4" data-usfm="MRK.6.4"><span class="content">  </span></span><span class="verse v5" data-usfm="MRK.6.5"><span class="verse label">5</span><span class="content">He was not able to perform any miracles there, except that he placed his hands on a few sick people and healed them. </span></span><span class="verse v6" data-usfm="MRK.6.6"><span class="verse label">6</span><span class="content">He was greatly surprised, because the people did not have faith.</span></span></div>
             <div class="s"><span class="heading">Jesus Sends Out the Twelve Disciples</span></div>
             <div class="r"><span class="heading">(Matthew 10.5-15; Luke 9.1-6)</span></div>
             <div class="p"><span class="verse v6" data-usfm="MRK.6.6"><span class="content">Then Jesus went to the villages around there, teaching the people. </span></span><span class="verse v7" data-usfm="MRK.6.7"><span class="verse label">7</span><span class="content">He called the twelve disciples together and sent them out two by two. He gave them authority over the evil spirits </span></span><span class="verse v8" data-usfm="MRK.6.8"><span class="verse label">8</span><span class="content">and ordered them, “Don't take anything with you on the trip except a walking stick—no bread, no beggar's bag, no money in your pockets. </span></span><span class="verse v9" data-usfm="MRK.6.9"><span class="verse label">9</span><span class="content">Wear sandals, but don't carry an extra shirt.” </span></span><span class="verse v10" data-usfm="MRK.6.10"><span class="verse label">10</span><span class="content">He also told them, “Wherever you are welcomed, stay in the same house until you leave that place. </span></span><span class="verse v11" data-usfm="MRK.6.11"><span class="verse label">11</span><span class="note x"><span class="label">#</span><span class=" body"><span class="xo"><span class="content">6.11: </span></span><span class="xt"><span class="content">Ac 13.51.</span></span></span></span><span class="note x"><span class="label">#</span><span class=" body"><span class="xo"><span class="content">6.8-11: </span></span><span class="xt"><span class="content">Lk 10.4-11.</span></span></span></span><span class="content"> If you come to a town where people do not welcome you or will not listen to you, leave it and shake the dust off your feet. That will be a warning to them!”</span></span></div>
             <div class="p"><span class="verse v11" data-usfm="MRK.6.11"><span class="content">  </span></span><span class="verse v12" data-usfm="MRK.6.12"><span class="verse label">12</span><span class="content">So they went out and preached that people should turn away from their sins. </span></span><span class="verse v13" data-usfm="MRK.6.13"><span class="verse label">13</span><span class="note x"><span class="label">#</span><span class=" body"><span class="xo"><span class="content">6.13: </span></span><span class="xt"><span class="content">Jas 5.14.</span></span></span></span><span class="content"> They drove out many demons, and rubbed olive oil on many sick people and healed them.</span></span></div>
             <div class="s"><span class="heading">The Death of John the Baptist</span></div>
             <div class="r"><span class="heading">(Matthew 14.1-12; Luke 9.7-9)</span></div>
             <div class="p"><span class="verse v13" data-usfm="MRK.6.13"><span class="content">  </span></span><span class="verse v14" data-usfm="MRK.6.14"><span class="verse label">14</span><span class="content">  </span><span class="note x"><span class="label">#</span><span class=" body"><span class="ft">  </span><span class="xo"><span class="content">6.14,15: </span></span><span class="ft">  </span><span class="xt"><span class="content">Mt 16.14; Mk 8.28; Lk 9.19.</span></span><span class="ft">  </span></span></span><span class="content"> Now King Herod </span><span class="note f"><span class="label">#</span><span class=" body"><span class="fr"><span class="content">6.14: </span></span><span class="fk"><span class="content">king Herod: </span></span><span class="ft"><span class="content">Herod Antipas, ruler of Galilee.</span></span></span></span><span class="content"> heard about all this, because Jesus' reputation had spread everywhere. Some people were saying, “John the Baptist has come back to life! That is why he has this power to perform miracles.”</span></span></div>
             <div class="p"><span class="verse v14" data-usfm="MRK.6.14"><span class="content">  </span></span><span class="verse v15" data-usfm="MRK.6.15"><span class="verse label">15</span><span class="content">Others, however, said, “He is Elijah.”</span></span></div>
             <div class="p"><span class="verse v15" data-usfm="MRK.6.15"><span class="content">Others said, “He is a prophet, like one of the prophets of long ago.”</span></span></div>
             <div class="p"><span class="verse v15" data-usfm="MRK.6.15"><span class="content">  </span></span><span class="verse v16" data-usfm="MRK.6.16"><span class="verse label">16</span><span class="content">When Herod heard it, he said, “He is John the Baptist! I had his head cut off, but he has come back to life!” </span></span><span class="verse v17" data-usfm="MRK.6.17"><span class="verse label">17</span><span class="note x"><span class="label">#</span><span class=" body"><span class="xo"><span class="content">6.17,18: </span></span><span class="xt"><span class="content">Lk 3.19,20.</span></span></span></span><span class="content"> Herod himself had ordered John's arrest, and he had him tied up and put in prison. Herod did this because of Herodias, whom he had married, even though she was the wife of his brother Philip. </span></span><span class="verse v18" data-usfm="MRK.6.18"><span class="verse label">18</span><span class="content">John the Baptist kept telling Herod, “It isn't right for you to marry your brother's wife!”</span></span></div>
             <div class="p"><span class="verse v18" data-usfm="MRK.6.18"><span class="content">  </span></span><span class="verse v19" data-usfm="MRK.6.19"><span class="verse label">19</span><span class="content">So Herodias held a grudge against John and wanted to kill him, but she could not because of Herod. </span></span><span class="verse v20" data-usfm="MRK.6.20"><span class="verse label">20</span><span class="content">Herod was afraid of John because he knew that John was a good and holy man, and so he kept him safe. He liked to listen to him, even though he became greatly disturbed every time he heard him.</span></span></div>
             <div class="p"><span class="verse v20" data-usfm="MRK.6.20"><span class="content">  </span></span><span class="verse v21" data-usfm="MRK.6.21"><span class="verse label">21</span><span class="content">Finally Herodias got her chance. It was on Herod's birthday, when he gave a feast for all the top government officials, the military chiefs, and the leading citizens of Galilee. </span></span><span class="verse v22" data-usfm="MRK.6.22"><span class="verse label">22</span><span class="content">The daughter of Herodias </span><span class="note f"><span class="label">#</span><span class=" body"><span class="fr"><span class="content">6.22: </span></span><span class="fq"><span class="content">The daughter of Herodias; </span></span><span class="ft"><span class="content">some manuscripts have </span></span><span class="fq"><span class="content">His daughter Herodias.</span></span></span></span><span class="content"> came in and danced, and pleased Herod and his guests. So the king said to the girl, “What would you like to have? I will give you anything you want.” </span></span><span class="verse v23" data-usfm="MRK.6.23"><span class="verse label">23</span><span class="content">With many vows he said to her, “I swear that I will give you anything you ask for, even as much as half my kingdom!”</span></span></div>
             <div class="p"><span class="verse v23" data-usfm="MRK.6.23"><span class="content">  </span></span><span class="verse v24" data-usfm="MRK.6.24"><span class="verse label">24</span><span class="content">So the girl went out and asked her mother, “What shall I ask for?”</span></span></div>
             <div class="p"><span class="verse v24" data-usfm="MRK.6.24"><span class="content">“The head of John the Baptist,” she answered.</span></span></div>
             <div class="p"><span class="verse v24" data-usfm="MRK.6.24"><span class="content">  </span></span><span class="verse v25" data-usfm="MRK.6.25"><span class="verse label">25</span><span class="content">The girl hurried back at once to the king and demanded, “I want you to give me here and now the head of John the Baptist on a plate!”</span></span></div>
             <div class="p"><span class="verse v25" data-usfm="MRK.6.25"><span class="content">  </span></span><span class="verse v26" data-usfm="MRK.6.26"><span class="verse label">26</span><span class="content">This made the king very sad, but he could not refuse her because of the vows he had made in front of all his guests. </span></span><span class="verse v27" data-usfm="MRK.6.27"><span class="verse label">27</span><span class="content">So he sent off a guard at once with orders to bring John's head. The guard left, went to the prison, and cut John's head off; </span></span><span class="verse v28" data-usfm="MRK.6.28"><span class="verse label">28</span><span class="content">then he brought it on a plate and gave it to the girl, who gave it to her mother. </span></span><span class="verse v29" data-usfm="MRK.6.29"><span class="verse label">29</span><span class="content">When John's disciples heard about this, they came and got his body, and buried it.</span></span></div>
             <div class="s"><span class="heading">Jesus Feeds Five Thousand</span></div>
             <div class="r"><span class="heading">(Matthew 14.13-21; Luke 9.10-17; John 6.1-14)</span></div>
             <div class="p"><span class="verse v29" data-usfm="MRK.6.29"><span class="content">  </span></span><span class="verse v30" data-usfm="MRK.6.30"><span class="verse label">30</span><span class="content">The apostles returned and met with Jesus, and told him all they had done and taught. </span></span><span class="verse v31" data-usfm="MRK.6.31"><span class="verse label">31</span><span class="content">There were so many people coming and going that Jesus and his disciples didn't even have time to eat. So he said to them, “Let us go off by ourselves to some place where we will be alone and you can rest a while.” </span></span><span class="verse v32" data-usfm="MRK.6.32"><span class="verse label">32</span><span class="content">So they started out in a boat by themselves to a lonely place.</span></span></div>
             <div class="p"><span class="verse v32" data-usfm="MRK.6.32"><span class="content">  </span></span><span class="verse v33" data-usfm="MRK.6.33"><span class="verse label">33</span><span class="content">Many people, however, saw them leave and knew at once who they were; so they went from all the towns and ran ahead by land and arrived at the place ahead of Jesus and his disciples. </span></span><span class="verse v34" data-usfm="MRK.6.34"><span class="verse label">34</span><span class="note x"><span class="label">#</span><span class=" body"><span class="xo"><span class="content">6.34: </span></span><span class="xt"><span class="content">Nu 27.17; 1 K 22.17; 2 Ch 18.16; Ez 34.5; Mt 9.36.</span></span></span></span><span class="content"> When Jesus got out of the boat, he saw this large crowd, and his heart was filled with pity for them, because they were like sheep without a shepherd. So he began to teach them many things. </span></span><span class="verse v35" data-usfm="MRK.6.35"><span class="verse label">35</span><span class="content">When it was getting late, his disciples came to him and said, “It is already very late, and this is a lonely place. </span></span><span class="verse v36" data-usfm="MRK.6.36"><span class="verse label">36</span><span class="content">Send the people away, and let them go to the nearby farms and villages in order to buy themselves something to eat.”</span></span></div>
             <div class="p"><span class="verse v36" data-usfm="MRK.6.36"><span class="content">  </span></span><span class="verse v37" data-usfm="MRK.6.37"><span class="verse label">37</span><span class="content">“You yourselves give them something to eat,” Jesus answered.</span></span></div>
             <div class="p"><span class="verse v37" data-usfm="MRK.6.37"><span class="content">They asked, “Do you want us to go and spend two hundred silver coins </span><span class="note f"><span class="label">#</span><span class=" body"><span class="fr"><span class="content">6.37: </span></span><span class="fk"><span class="content">silver coins: </span></span><span class="ft"><span class="content">A silver coin was the daily wage of a rural worker (see Mt 20.2).</span></span></span></span><span class="content"> on bread in order to feed them?”</span></span></div>
             <div class="p"><span class="verse v37" data-usfm="MRK.6.37"><span class="content">  </span></span><span class="verse v38" data-usfm="MRK.6.38"><span class="verse label">38</span><span class="content">So Jesus asked them, “How much bread do you have? Go and see.”</span></span></div>
             <div class="p"><span class="verse v38" data-usfm="MRK.6.38"><span class="content">When they found out, they told him, “Five loaves and also two fish.”</span></span></div>
             <div class="p"><span class="verse v38" data-usfm="MRK.6.38"><span class="content">  </span></span><span class="verse v39" data-usfm="MRK.6.39"><span class="verse label">39</span><span class="content">Jesus then told his disciples to make all the people divide into groups and sit down on the green grass. </span></span><span class="verse v40" data-usfm="MRK.6.40"><span class="verse label">40</span><span class="content">So the people sat down in rows, in groups of a hundred and groups of fifty. </span></span><span class="verse v41" data-usfm="MRK.6.41"><span class="verse label">41</span><span class="content">Then Jesus took the five loaves and the two fish, looked up to heaven, and gave thanks to God. He broke the loaves and gave them to his disciples to distribute to the people. He also divided the two fish among them all. </span></span><span class="verse v42" data-usfm="MRK.6.42"><span class="verse label">42</span><span class="content">Everyone ate and had enough. </span></span><span class="verse v43" data-usfm="MRK.6.43"><span class="verse label">43</span><span class="content">Then the disciples took up twelve baskets full of what was left of the bread and the fish. </span></span><span class="verse v44" data-usfm="MRK.6.44"><span class="verse label">44</span><span class="content">The number of men who were fed was five thousand.</span></span></div>
             <div class="s"><span class="heading">Jesus Walks on the Water</span></div>
             <div class="r"><span class="heading">(Matthew 14.22-33; John 6.15-21)</span></div>
             <div class="p"><span class="verse v44" data-usfm="MRK.6.44"><span class="content">  </span></span><span class="verse v45" data-usfm="MRK.6.45"><span class="verse label">45</span><span class="content">At once Jesus made his disciples get into the boat and go ahead of him to Bethsaida, on the other side of the lake, while he sent the crowd away. </span></span><span class="verse v46" data-usfm="MRK.6.46"><span class="verse label">46</span><span class="content">After saying good-bye to the people, he went away to a hill to pray. </span></span><span class="verse v47" data-usfm="MRK.6.47"><span class="verse label">47</span><span class="content">When evening came, the boat was in the middle of the lake, while Jesus was alone on land. </span></span><span class="verse v48" data-usfm="MRK.6.48"><span class="verse label">48</span><span class="content">He saw that his disciples were straining at the oars, because they were rowing against the wind; so sometime between three and six o'clock in the morning, he came to them, walking on the water. He was going to pass them by, </span><span class="note f"><span class="label">#</span><span class=" body"><span class="fr"><span class="content">6.48: </span></span><span class="fq"><span class="content">pass them by; </span></span><span class="ft"><span class="content">or </span></span><span class="fq"><span class="content">join them.</span></span></span></span><span class="content">  </span></span><span class="verse v49" data-usfm="MRK.6.49"><span class="verse label">49</span><span class="content">but they saw him walking on the water. “It's a ghost!” they thought, and screamed. </span></span><span class="verse v50" data-usfm="MRK.6.50"><span class="verse label">50</span><span class="content">They were all terrified when they saw him.</span></span></div>
             <div class="p"><span class="verse v50" data-usfm="MRK.6.50"><span class="content">Jesus spoke to them at once, “Courage!” he said. “It is I. Don't be afraid!” </span></span><span class="verse v51" data-usfm="MRK.6.51"><span class="verse label">51</span><span class="content">Then he got into the boat with them, and the wind died down. The disciples were completely amazed, </span></span><span class="verse v52" data-usfm="MRK.6.52"><span class="verse label">52</span><span class="content">because they had not understood the real meaning of the feeding of the five thousand; their minds could not grasp it.</span></span></div>
             <div class="s"><span class="heading">Jesus Heals the Sick in Gennesaret</span></div>
             <div class="r"><span class="heading">(Matthew 14.34-36)</span></div>
             <div class="p"><span class="verse v52" data-usfm="MRK.6.52"><span class="content">  </span></span><span class="verse v53" data-usfm="MRK.6.53"><span class="verse label">53</span><span class="content">They crossed the lake and came to land at Gennesaret, where they tied up the boat. </span></span><span class="verse v54" data-usfm="MRK.6.54"><span class="verse label">54</span><span class="content">As they left the boat, people recognized Jesus at once. </span></span><span class="verse v55" data-usfm="MRK.6.55"><span class="verse label">55</span><span class="content">So they ran throughout the whole region; and wherever they heard he was, they brought to him the sick lying on their mats. </span></span><span class="verse v56" data-usfm="MRK.6.56"><span class="verse label">56</span><span class="content">And everywhere Jesus went, to villages, towns, or farms, people would take their sick to the marketplaces and beg him to let the sick at least touch the edge of his cloak. And all who touched it were made well.</span></span></div>
            </div>
         </div>
      </div>
    end_of_string
  end
end
