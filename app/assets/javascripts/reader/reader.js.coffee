class window.Reader

  constructor: (opts)->

    @version      = opts.version      || ""
    @abbrev       = opts.abbrev       || ""
    @reference    = opts.reference    || ""
    @book         = opts.book         || ""
    @book_api     = opts.book_api     || ""
    @book_human   = opts.book_human   || ""
    @chapter      = opts.chapter      || ""
    @html_el = $(document.documentElement)
    @primary   = $('#version_primary')
    @secondary = $('#version_secondary')
    @header    = $('#reader_header header')
    @audio_player = new AudioPlayer()

    @selected =
      verses              : [],
      verse_usfms         : [],
      verse_params        : [],
      verse_numbers       : [],
      verse_usfm_ranges   : [],
      verse_number_ranges : []

    @book_chapter_menu  = new BookChapterMenu({trigger: "#menu_book_chapter_trigger", menu: "#menu_book_chapter"})


    @processSelectedVerses

    # fire initial events
    if @numSelectedVerses() >= 1
      Events.Emitter.emit("verses:first_selected")
      Events.Emitter.emit("verses:selected")

    @verse_els = $('#version_primary .verse')
    @verse_els.on "click", (event)=>
      event.preventDefault()
      @verseClicked(event.delegateTarget)


    @verse_actions = new Panes.VerseActions()
    Events.Emitter.addListener "verses:clear", (e)=>
      @clearSelectedVerses()

    @setupFullscreenMode()
    @setupParallelMode()
    @setupSecondaryVersion()
    @setupTranslationNotes()
    @setupNavigation()        # next / prev links inside reader.
    @initializeVerses()       # setup selected and focused verses upon page load
    @loadHighlights("#version_primary")

    $("#sidebar").on "click", "#widget-notes div.ft span.pagination", (event)=>
      cls = $(event.target).parent().attr("class")
      if cls.indexOf("next") != -1
        $("#widget-notes").data("paginate-direction", "next")
      else
        $("#widget-notes").data("paginate-direction", "previous")
      Events.Emitter.emit("community_notes:paginate", event)

    $('.calendar-next').click ->
      PlanWidget.toNext()

    $('.calendar-prev').click ->
      PlanWidget.toPrev()

    PlanWidget.initialScroll()


  verseClicked: (verse)->
    v = $(verse)
    if @isVerseSelected(v) then @deselectVerse(v) else @selectVerse(v)


  isVerseSelected: (verse_el)->
    return verse_el.hasClass("selected")


  # Public: clear all selected verses.
  clearSelectedVerses: ()->
    return if @numSelectedVerses() == 0

    @allSelectedVerses().removeClass("selected")
    @processSelectedVerses()
    if @numSelectedVerses() == 0 then Events.Emitter.emit("verses:all_deselected")


  # TODO: don't reparse all verses, just add to current set of verses being tracked
  selectVerse: (verse_el)->

    # map ["v1","v2","v3"] to [".verse.v1",".verse.v2",".verse.v3"] to get us a proper selector
    classes = $.map @parseVerseClasses($(verse_el)), (val,index)->
      return ".verse." + val

    # Select verses in the reader via class
    # classes need to be comma separated as they are distinct selectors
    $(classes.join(", ")).addClass("selected")

    @processSelectedVerses()

    # Trigger events
    num_selected = @numSelectedVerses()
    if num_selected == 1 then Events.Emitter.emit("verses:first_selected")
    if num_selected      then Events.Emitter.emit("verses:selected")



  # TODO: don't reparse all verses, just add to current set of verses being tracked
  deselectVerse: (verse_el)->

    # map ["v1","v2","v3"] to [".verse.v1",".verse.v2",".verse.v3"] to get us a proper selector
    classes = $.map @parseVerseClasses($(verse_el)), (val,index)->
      return ".verse." + val

    # Deselect verses in the reader
    # classes need to be comma separated as they are distinct selectors
    $(classes.join(", ")).removeClass("selected")

    @processSelectedVerses()

    # Trigger events
    Events.Emitter.emit "verses:deselected"
    Events.Emitter.emit "verses:all_deselected" if @numSelectedVerses() == 0


  fetchSelectedVerses: ()->
    return $('#version_primary .verse.selected')


  fetchHighlightedVerses: (article_id)->
    # if no article passed, just grab all highlights
    prefix = if article_id then article_id += " " else ""
    return $(prefix + '.verse.highlighted')


  allSelectedVerses: ()->
    return $('.verse.selected')


  numSelectedVerses: ()->
    return $('#version_primary  .verse.selected > .label').length


  processSelectedVerses: ()->

    # Zero out stored data values on article
    $("article").data('selected-verses-rel-link', false)
    $('.verses_selected_input').val('')                     # <- crazy coupling across different elements, refactor this.

    # Reset and zero out our @selected hash key/values
    @selected.verses                      = @fetchSelectedVerses()
    @selected.verse_usfms.length          = 0
    @selected.verse_params.length         = 0
    @selected.verse_numbers.length        = 0
    @selected.verse_usfm_ranges.length    = 0
    @selected.verse_number_ranges.length  = 0


    # Get USFM refs and App params for each selected verse
    usfms     = []
    $.each @selected.verses, (index,verse)=>
      _nums     = @parseVerseNums(verse)
      _usfms    = @parseVerseUsfms(verse)

      usfms.push(_usfms)

      # aggregate all selected verse usfms and params
      $.each _usfms, (index, usfm)=>
        if @selected.verse_usfms.indexOf(usfm) == -1
          @selected.verse_usfms.push(usfm) # ex. 2CO.1.1
          @selected.verse_params.push(@referenceParam({usfm: usfm, version: @version })) #ex. 2CO.1.1.1-VID

      $.each _nums, (index, num)=>
        if @selected.verse_numbers.indexOf(num) == -1
          @selected.verse_numbers.push(num)

    @parseRanges()

    # FIX.  When a range is created (consecutive verses) clicking the token
    # does not currently remove the range from being selected.  In markup and pill/token.
    @generateReferenceTokens();

    # Generate short link and document link paths for selected verses
    @generateLinks();

    # Update any menus and widgets now that we have parsed our selected verses
    @updateMenus()

    Events.Emitter.emit("verses:parsed")

  #
  parseRanges: ()->
    # setup variables for creating our ranges.
    verse_numbers = @selected.verse_numbers
    verse_numbers_length = verse_numbers.length

    usfm_ranges = []
    verse_ranges = []

    # Create our ranges
    if verse_numbers_length > 0 && verse_numbers_length == 1

      verse_ranges.push @selected.verse_numbers[0]
      usfm_ranges.push @selected.verse_usfms[0]

    else # more than 1 verse number to deal with

      in_range    = false
      range_start = 0

      i = 0
      while i < verse_numbers_length

        # Start of our loop of verse numbers
        if i == 0
          next_verse_item_val = verse_numbers[i+1]
          next_verse_number   = verse_numbers[i] + 1

          if next_verse_item_val == next_verse_number
            # Then start a range with current iteration value
            in_range    = true
            range_start = verse_numbers[i]
            usfm_range_start = @selected.verse_usfms[i]

          else
            # just a single verse
            verse_ranges.push verse_numbers[i]
            usfm_ranges.push @selected.verse_usfms[i]

        # End of our loop of verse numbers
        else if i == verse_numbers_length

          if in_range
            # push the range as we're at the end of our loop
            num_range  = range_start + "-" + verse_numbers[i]
            usfm_range = usfm_range_start + "-" + verse_numbers[i]

            verse_ranges.push num_range
            usfm_ranges.push usfm_range

          else
            # just push the current iteration
            verse_ranges.push verse_numbers[i]
            usfm_ranges.push @selected.verse_usfms[i]


        # Iteration of our verse number loop other than first (0) or last (nums.length)
        else
          next_verse_item_val = verse_numbers[i+1]
          next_verse_number   = verse_numbers[i] + 1

          # next verse item value is the next successive number
          if next_verse_item_val == next_verse_number

            # If we're not in a range then start one
            unless in_range
              in_range = true
              range_start = verse_numbers[i]
              usfm_range_start = @selected.verse_usfms[i]

          # next verse item is not the next successive number
          else
            if in_range # Stop and push the range
              num_range  = range_start + "-" + verse_numbers[i]
              usfm_range = usfm_range_start + "-" + verse_numbers[i]

              verse_ranges.push num_range
              usfm_ranges.push usfm_range
              in_range = false

            else
              verse_ranges.push verse_numbers[i]
              usfm_ranges.push @selected.verse_usfms[i]

        i++ # keep our while loop going.

    # populate our selected hash with values after creating ranges.
    @selected.verse_usfm_ranges   = usfm_ranges
    @selected.verse_number_ranges = verse_ranges

  parseVerseUsfms: (verse_el)->
    return [] unless verse_el?
    return $(verse_el).data("usfm").split("+") # multi verse usfm strings can exist: ex. JHN.1.1+JHN.1.2


  # expected to return an array with a single element or more.
  parseVerseNums: (verse_el)->
    classes = @parseVerseClasses $(verse_el)
    v_nums = $.map classes, (val,index)->
      return parseInt(val.match(/(\d+)$/)[0], 10)

    return v_nums


  # will return an array of verse classes for a given verse element
  # ex: ["v1","v2","v3"] - ["v1"]
  parseVerseClasses: (v)->
    return unless v.length > 0
    classes = v.attr('class').split(/\s+/) || []
    v_classes = []
    $.each classes, (index,val)->
      match = val.match(/v[0-9]+/g)
      if match && match.length then v_classes.push(match[0].toString())

    return v_classes


  # TODO - optimize this
  # every time a token is clicked, all verses are parsed, token lists are regenerated, built and rerendered

  generateReferenceTokens: ()->
    verse_ranges  = @selected.verse_number_ranges;
    usfm_ranges   = @selected.verse_usfm_ranges;

    # Reference info, tokens and handlers
    lists       = $(".reference_tokens")
    lists.html("")

    $.each verse_ranges, (index,range)=>
      usfm  = usfm_ranges[index].toString() # cast to a string here.

      # Build our elements
      li    = $("<li/>")
      link  = $("<a/>",{ href: "#", "data-usfm": usfm})
      link.html(@book_human + " " + @chapter + ":" + range)

      # Append our elements to DOM
      li.append(link)
      lists.append(li) # Append token link to all .reference_token lists


      link.on "click", (event)=>
        event.preventDefault()
        target = $(event.currentTarget)
        verses = []

        # this is a single verse
        if usfm.indexOf("-") == -1
          verses.push(usfm.split('.')[2]) # Get the 3 from "JHN.1.3"

        # this is a verse range
        else
          nums = usfm.split('.')[2].split('-') # Get the 3-5 from "JHN.1.3-5"
          range_begin = nums[0]
          range_end   = nums[1]

          i = range_begin
          while i <= range_end
            verses.push(i)
            i++

        # Link has been clicked, for all verses associated with the link, deselect the verse.
        $("#version_primary .verse.v" + verses.join(', #version_primary .verse.v')).each (index,verse_el)=>
          @deselectVerse verse_el

        # After deselecting, reparse the verses again #TODO - optimize this
        @processSelectedVerses()



  # Generate links for selected verses
  generateLinks: ()->
    joined        = @selected.verse_number_ranges.join(",");
    short_link    = "https://bible.com" + @getLocale() + "/" + @version + "/" + @book + "." + @chapter + "." + joined + "." + @abbrev
    partial_path  = "." + joined
    relative_link = "/bible/" + @version + "/" + @book + "." + @chapter + partial_path

    @verse_actions.updateLink( short_link );
    @verse_actions.updateSharing({ link: short_link });

    $("article").data('selected-verses-rel-link', relative_link.toLowerCase())
    $("article").attr('data-selected-verses-path-partial', partial_path)


  updateMenus: ()->
    @verse_actions.setSelectedReferences( @selected.verse_usfms )


  referenceParam : (opts)->
    usfm    = opts.usfm || undefined
    version = opts.version || undefined
    if usfm && version then return usfm + "." + version + "-VID"



  getLocale: ()->
    locale          = ""
    html_locale     = $('html').data("locale")
    if html_locale != "en" then locale = "/" + html_locale
    return locale



  initializeVerses: ()->
    # list of verses "" or "1" or "1,2,3"
    # .attr retrieves value as string and doesn't attempt to cast to other type.

    # Selected verses
    verses = $("article").attr("data-selected-verses")
    verses = if verses? then verses.split(",") else []

    if verses.length != 0
      $.each verses, (index,verse)->
        $(".verse.v" + verse).addClass("selected")
      scroll_verse = $('#version_primary .selected:first')

    # Focused verses
    verses = $("article").attr("data-focused-verses")
    verses = if verses? then verses.split(",") else []

    if verses.length != 0
      $.each verses, (index,verse)->
        $(".verse.v" + verse).addClass("focused")
      scroll_verse = $('#version_primary .focused:first')


    if scroll_verse.length != 0 && $('head meta[name="apple-itunes-app"]').length == 0 && $('#mobile-sb-subscription.initial').length == 0
      # TODO: make the 2nd part actually if there is modal display
      # DOM is loaded, wait a bit for css to load then scroll to first verse
      $(document).ready ()=>
        setTimeout ()=>
          @scrollToVerse(scroll_verse)
        ,300



  scrollToVerse: (verse)->
    Scroll.toVerse(verse)
    return

  showHighlights: (article_id)->
    highlights = @fetchHighlightedVerses(article_id)
    $(highlights).each (index,highlight)->
      target = $(highlight)
      target.addClass("highlighted").css("background-color",target.attr('data-highlight-color'))

  hideHighlights: (article_id)->
    highlights = @fetchHighlightedVerses(article_id)
    highlights.removeClass('dark_bg').css('background-color','transparent')

  clearHighlights: (article_id)->
    highlights = @fetchHighlightedVerses(article_id)
    highlights.removeClass('highlighted dark_bg').css("background-color", 'transparent')


  loadHighlights: (article_id)->
    article         = $(article_id)
    ref             = article.data("reference")
    version         = article.find('.version').data("vid")
    chapter         = article.find('.chapter')
    show_highlights = $('#main article').attr('data-setting-show-highlights') || 'true'

    # HACK: looking for "intro" is not a great way to check if a chapter may have highlights, but it "works"
    if (!chapter.length || !version || chapter.data("usfm").match(/intro/i)) then return

    $.ajax
      url:      @getLocale() + "/highlights/" + version + "/" + ref,
      method:   "get",
      dataType: "json",
      success: (data)=>

        @clearHighlights(article_id)
        $.each data, (index,highlight)->
          $.each highlight.references, (index,ref_hash)->
            window.Highliter.highlight(ref_hash.usfm,highlight.color)

        # have to reparse the verses again due to adding new attribute values
        # parse verses

      error: (jqXHR, status, err)->



  isSecondaryVersionLoaded: ()->
    return @secondary_version_loaded


  setupFullscreenMode: ()->
    @mode_fullscreen = getCookie("full_screen") == "1" || false
    @fullscreen_btn = $('#button_full_screen')
    @fullscreen_btn.on "click", (event)=>
      event.preventDefault()
      @toggleFullScreen()
      # blur element


  setupParallelMode: ()->
    @mode_parallel = getCookie("parallel_mode") == "1" || false
    @parallel_btn = $('#button_read_parallel')
    @parallel_btn.on "click", (event)=>
      event.preventDefault()
      @toggleParallel()
      # blur element


  setupSecondaryVersion: ()->
    @secondary_version_loaded = false
    if @isParallel() then @loadSecondaryVersion()



  loadSecondaryVersion: ()->
    return if @isSecondaryVersionLoaded()

    target  = $('#version_secondary')
    usfm    = target.attr('data-usfm')
    version = getCookie('alt_version') || 1

    $.ajax
      method:     "get",
      dataType:   "json",
      url:        @getLocale() + "/bible/" + version + "/" + usfm + ".json",

      success:    (ref)=>
        @secondary_version_loaded = true

        content = ref.content_plain

        if @isParallel()
          # fade in/out adds in-line style that will bork our css styling
          original_styles = target.attr('style') || ''

          target.fadeOut 100, ()=>
            target.html content
            target.fadeIn 200
            target.attr "style", original_styles
            @loadHighlights("#version_secondary")

        else
          target.html content
          @loadHighlights("#version_secondary")

      error: (jqXHR,status,err)->
        target.html("<h1>Error Loading Secondary Version</h1>\
                            <p>You might try <a href=''>reloading</a>. \
                            Still having trouble? Contact our \
                            <a href='http://support.youversion.com' \
                            target='_blank'>support team</a>.</p>")


  isFullScreen: ()->
    return @mode_fullscreen


  toggleFullScreen: ()->
    if @isFullScreen()
      @mode_fullscreen = false
      @html_el.removeClass("full_screen")
      deleteCookie("full_screen")
    else
      @mode_fullscreen = true
      @html_el.addClass("full_screen")
      setCookie "full_screen", 1


  isParallel: ()->
    return @mode_parallel


  toggleParallel: ()->
    alt_version_menu_link = $("#menu_alt_version").find("a");

    if @isParallel()
      @mode_parallel = false
      @html_el.removeClass('parallel_mode')
      deleteCookie("parallel_mode")
      alt_version_menu_link.off "click" #remove click handler from element
      if (getCookie("full_screen") == null) then @html_el.removeClass("full_screen") #if user didn't explicitly set full_screen, go back to regular

    else
      @mode_parallel = true
      setCookie "parallel_mode", 1
      @loadSecondaryVersion()
      @html_el.addClass('parallel_mode').addClass('full_screen');

      alt_version_menu_link.on "click", (event)=>
        event.preventDefault()
        event.stopPropagation()
        setCookie('alt_version', $(event.currentTarget).closest('tr').data('version')) # TODO: UGLY coupling to html markup - encapsulate this data request.
        window.location = window.location.href # reload page after setting alt_version cookie


  # Sets up next / prev links inside reader.
  setupNavigation: ()->
    if $(".main_reader").length
      article               = $('.main_reader article')
      initoffset            = article.offset().top
      initviewport          = $(window).height()
      main_reader_height    = article.height() + 35
      offset_height         = article.offset().top
      prev_next_selector    = '.reader-prev, .reader-next'
      reader_nav_selector   = '.reader-nav, .reader-prev, .reader-next'

      $(prev_next_selector).height(initviewport-initoffset-40)

      if main_reader_height + offset_height > initviewport
        # recalculate the nav button height and change the height.
        $(window).resize (e)->
          window.offset         = $('.main_reader article').offset().top
          window.viewport       = $(window).height()
          window.doc_height     = $(document).height()
          window.main_height    = $('.main_reader article').height()
          window.bottom_offset  =  doc_height - offset - main_height
          $(prev_next_selector).height(viewport - offset-40)

        if !$('html').hasClass("full_screen")
          $('.main_reader footer').waypoint (event,direction)->
            if direction == "down" then $(reader_nav_selector).addClass('snap') else $(reader_nav_selector).removeClass('snap')
          ,{offset: '100%'}
      else
        $(prev_next_selector).height(main_reader_height)


  # We dynamically position note on each hover, as position
  # can change based on interactive reader options
  setupTranslationNotes: ()->

    # Mouse over item
    overItem = (event)=>
      target        = $(event.currentTarget)
      label         = target.find('.label')
      ctn           = target.find('.outer_container')
      inner         = ctn.find('.inner_container')
      label_left    = label.offset().left
      label_bottom  = label.offset().top + label.outerHeight()
      reader_right  = label.closest('.version').innerWidth() + target.closest('.version').offset().left
      reader_top    = target.closest('.version').position().top
      reader_bottom = label.closest('.version').innerHeight() + target.closest('.version').offset().top
      left          = label.position().left
      top           = label.position().top

      # Set X position
      if label_left + ctn.outerWidth() < reader_right
        xval = left + "px"
      else
        xval = left - ctn.outerWidth() + target.outerWidth() + "px"

      ctn.css("left", xval)

      # Set Y position
      # flip vertically if too tall for reader
      if (label_bottom + ctn.outerHeight()) > reader_bottom
        newTop = top - ctn.outerHeight()
        if newTop >= reader_top
          ctn.css('top', newTop)
        else
          # note reaches past the top of the reader when flipped,
          # do the best we can by positioning at top of reader
          # reducing font size, and increasing width
          if !inner.hasClass('hacked')
            ctn.css('top', reader_top + "px");
            inner.css('font-size', parseInt(inner.css('font-size')) - 2 + "px")
            inner.css('max-width', parseInt(inner.css('max-width')) + 30 + "px")
            inner.addClass('hacked')

      ctn.show().animate({opacity: 1}, "200")

    # Mouse out item
    offItem = (event)=>
      target = $(event.currentTarget)
      ctn    = target.find('.outer_container')
      ctn.delay(350).animate {opacity: 0}, "200", ()->
        ctn.hide()

    hoverConfig = {
      timeout: 350,
      over: overItem,
      out: offItem
    }

    $('.note .body').wrap('<div class="outer_container"></div>')
    $('.note .body').wrap('<div class="inner_container"></div>')
    $('.note .label').closest('.note').hoverIntent(hoverConfig)
