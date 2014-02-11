// Bible Reader
function isColorDark(hex_color) {
    //Using same code as android for this algorithm - EP
    //perform math for WCAG1
    var brightnessThreshold = 125;
    var colorThreshold = 500;

    // testing FG white
    var fr = 255;
    var fg = 255;
    var fb = 255;

    // hex color as RGB
    var br = parseInt(hex_color.substring(0, 2), 16);
    var bg = parseInt(hex_color.substring(2, 4), 16);
    var bb = parseInt(hex_color.substring(4, 6), 16);

    var bY= ((br * 299) + (bg * 587) + (bb * 114)) / 1000;
    var fY= ((255 * 299) + (255 * 587) + (255 * 114)) / 1000;
    var brightnessDifference = Math.abs(bY-fY);

    var colorDifference = (Math.max (fr, br) - Math.min (fr, br)) +
        (Math.max (fg, bg) - Math.min (fg, bg)) +
        (Math.max (fb, bb) - Math.min (fb, bb));

    return ((brightnessDifference >= brightnessThreshold) || (colorDifference >= colorThreshold));
}

function Reader(opts) {
  this.selected = {
    verses : [],
    verse_usfms : [],
    verse_params : [],
    verse_numbers : [],
    verse_usfm_ranges : [],
    verse_number_ranges : []
  };


  this.version          = opts.version || "";
  this.abbrev           = opts.abbrev || "";
  this.reference        = opts.reference || "";
  this.book             = opts.book || "";
  this.book_api         = opts.book_api || "";
  this.book_human       = opts.book_human || "";
  this.chapter          = opts.chapter || "";

  this.full_screen      = opts.full_screen || false;
  this.parallel_mode    = opts.parallel_mode || false;
  this.selected_verses  = [];
  this.secondary_loaded = false;
  this.bookmarks_loaded = false;
  this.notes_loaded     = false;

  this.font             = opts.font || "";
  this.size             = opts.size || "";

  // elements

  this.html_el          = $(document.documentElement);
  this.verse_els        = $('#version_primary .verse');
  this.audio_player     = $('#audio_player');
  this.header           = $('#reader_header header');
  this.primary          = $('#version_primary');
  this.secondary        = $('#version_secondary');

  // menus

  this.initVerses();
  this.initSecondaryVersion();
  this.initHighlights();
  this.initAudioPlayer();
  this.initTranslationNotes();
  this.initNextPrev();
  this.initSidebar();

  this.book_chapter_menu  = new BookChapterMenu({trigger: "#menu_book_chapter_trigger", menu: "#menu_book_chapter"});
  this.selected_menu      = new Panes.VerseActions();//new SelectedMenu({menu:"#menu_verse_actions", trigger:"#menu_selected_trigger", mobile_menu:".verse_toolbar"});

  $(this.selected_menu).bind("verses:clear", $.proxy(function(e){
    this.clearSelectedVerses();
  },this));
}

Reader.prototype = {
  constructor : Reader,
  init : function() {

    var thiss = this;

    // click handler for full screen mode
    var btn_fs = $('#button_full_screen');
        btn_fs.click( function(e) {
          thiss.toggleFullScreen();
          e.preventDefault();
          this.blur();
        });

    // click handler for parallel mode
    var btn_pll = $('#button_read_parallel');
        btn_pll.click( function(e) {
          thiss.toggleParallel();
          e.preventDefault();
          this.blur();
        });

    // Set click handlers for all verses
    // Todo, potentially set click delegate on parent element for optimization?
    this.verse_els.click( $.proxy(function(e) {
      e.preventDefault();
      this.verseClicked(e.delegateTarget);
    },this));

    this.parseVerses();

    // fire initial events
    if (this.numSelectedVerses() >= 1){
      $(this.primary).trigger("verses:first_selected");
      $(this.primary).trigger("verses:selected");
    }
  },

  fetchSelectedVerses : function() {
    return $('#version_primary  .verse.selected');
  },

  allSelectedVerses : function() {
    return $('.verse.selected');
  },

  fetchHighlightedVerses : function(article_id) {
    //if no article passed, just grab all highlights
    if (article_id) { article_id += " " } else { var article_id = '' }

    return $(article_id + '.verse.highlighted');
  },

  numSelectedVerses : function() {
    return $('#version_primary  .verse.selected > .label').length;
  },

  verseClicked : function( verse ) {
    var v = $(verse);
    if (this.isSelected(v)) {
        this.deselectVerse(v);
    } else {
        this.selectVerse(v);
    }
    this.parseVerses();
  },

  deselectVerse : function( v ) {
    $(this.parseVerseClasses(v)).each( function(i,val) {
      $(".verse." + val ).removeClass("selected");
    });
    $(this.primary).trigger("verses:deselected");
    if (this.numSelectedVerses() === 0){ $(this.primary).trigger("verses:all_deselected"); }
  },

  selectVerse : function( v ) {
    $(this.parseVerseClasses(v)).each( function(i,val) {
      $(".verse." + val ).addClass("selected");
    });
    if (this.numSelectedVerses() === 1){ $(this.primary).trigger("verses:first_selected"); }
    if (this.numSelectedVerses()){ $(this.primary).trigger("verses:selected"); }
  },

  isSelected : function( v ) {
    return v.hasClass("selected");
  },

  getSelectedData : function() {
    return this.selected;
  },

    // Public: clear all selected verses.
  clearSelectedVerses : function() {
    this.allSelectedVerses().removeClass('selected');
    if (this.numSelectedVerses() == 0){ $(this.primary).trigger("verses:all_deselected"); }
    this.parseVerses();
  },

  scrollToVerse : function(verse) {
    var easingType = 'easeInOutCirc';
    verse = verse || $('#version_primary .selected:first');
    if (verse.length){
      var newPosition = verse.offset().top - $('article').offset().top + $('article').scrollTop() - parseInt(verse.css('line-height'), 10)/4;
      if(app.getPage().MODERN_BROWSER){
        $('html:not(:animated),body:not(:animated)').animate({scrollTop: newPosition },{easing: easingType, duration:1200});
      }else {$(window).scrollTop(newPosition);}
    }
  },

  scrollToSelectedVerse : function(easingType) {
    // TODO: set this up in a way we can cancel if user scrolls before it happens
    easingType = easingType || 'easeInOutCirc';
    var first = $('#version_primary .selected:first');
    if ( first.length && !first.hasClass('v1') ){
      var newPosition = first.offset().top - $('article').offset().top + $('article').scrollTop() - parseInt(first.css('line-height'))/4;
      if(app.getPage().MODERN_BROWSER){
        $('html:not(:animated),body:not(:animated)').animate({scrollTop: newPosition },{easing: easingType, duration:1200});
      }else {$(window).scrollTop(newPosition);}
    }
  },

  referenceParam : function( opts ) {
    var usfm    = opts.usfm || undefined;
    var version = opts.version || undefined;
    if(usfm && version) { return usfm + "." + version + "-VID";}
  },

  parseVerseClasses : function(v) {
    if (v.length > 0){
      var classes = v.attr('class').split(/\s+/) || [];
      var v_classes = [];
          $(classes).each( function(i, val) {
            var match = val.match(/v[0-9]+/g);
            if(match && match.length) { v_classes.push(match[0].toString())}
          });
      return v_classes;
    } else { return ""; }
  },

  // expected to return an array with a single element or more.
  parseVerseUsfms : function( verse_el ) {
    // multi verse usfm strings can exist: ex. JHN.1.1+JHN.1.2
    var usfm = verse_el.data("usfm");
    return usfm.split("+");
  },

  // expected to return an array with a single element or more.
  parseVerseNums : function( verse_el ) {
    var v_classes = this.parseVerseClasses( verse_el );
    var v_nums = $.map( v_classes , function(val) { return parseInt(val.match(/(\d+)$/)[0], 10); });
    return v_nums;
  },

  parseVerses : function() {

    // Zero out values
    $("article").attr('data-selected-verses-rel-link', false);
    $('.verses_selected_input').val('');

    this.selected.verses = this.fetchSelectedVerses();
    this.selected.verse_usfms.length = 0;
    this.selected.verse_params.length = 0;
    this.selected.verse_numbers.length = 0;
    this.selected.verse_usfm_ranges.length = 0;
    this.selected.verse_number_ranges.length = 0;

    // Get USFM refs and App params for each selected verse
      var thiss = this;
      var selected = this.selected;

      var usfms = [];

      this.selected.verses.each(function() {
        var verse   = $(this);
        var _usfms  = thiss.parseVerseUsfms(verse);
        var _vid    = verse.closest('.version').data('vid');
        var _nums   = thiss.parseVerseNums(verse);

        usfms.push(_usfms)

        // aggregate all selected verse usfms and params
        $(_usfms).each( function(i, usfm) {
          if(selected.verse_usfms.indexOf(usfm) == -1) {  //usfm reference not in array
             selected.verse_usfms.push(usfm);                                                    // ex. 2CO.1.1
             selected.verse_params.push( thiss.referenceParam({usfm: usfm, version: _vid } ));  // ex. 2CO.1.1.1-VID
          }
        });
        // aggregate all selected verse numbers
        $(_nums).each( function(i,num) {
          if(selected.verse_numbers.indexOf(num) == -1) {
             selected.verse_numbers.push( num );
          }
        });
      });

      this.parseRanges();

    // FIX.  When a range is created (consecutive verses) clicking the token
    // does not currently remove the range from being selected.  In markup and pill/token.
      this.generateReferenceTokens();

    // Generate short link and document link paths
      this.generateLinks();

    // Update any menus and widgets now that we have parsed our selected verses
      this.updateMenus();

      $(this).trigger("verses:parsed");
  },

  parseRanges : function() {

    // setup variables for creating ranges.
    var verse_numbers = this.selected.verse_numbers;
    var usfm_ranges   = [];
    var verse_ranges  = [];

    // Create ranges
    if (verse_numbers.length > 0) {
      if (verse_numbers.length == 1) {
        verse_ranges.push(this.selected.verse_numbers[0]);
        usfm_ranges.push(this.selected.verse_usfms[0]);
      } else {
        var in_range = false;
        var range_start = 0;
        var exit = false;
        for (var i = 0; i < verse_numbers.length; i++) {
          if (i == 0) {
            if (verse_numbers[i+1] == verse_numbers[i] + 1) {
              // Then start a range
              in_range = true;
              range_start = verse_numbers[i];
              usfm_range_start = this.selected.verse_usfms[i];
            } else {
              // it's just a single verse
              verse_ranges.push(verse_numbers[i]);
              usfm_ranges.push(this.selected.verse_usfms[i]);
            }

          } else if (i == verse_numbers.length) {
            if (in_range == true) {
              verse_ranges.push(range_start + "-" + verse_numbers[i]);
              usfm_ranges.push(usfm_range_start + "-" + verse_numbers[i]);
            } else {
              verse_ranges.push(verse_numbers[i]);
              usfm_ranges.push(this.selected.verse_usfms[i]);
            }
            exit = true;
          } else {
            if (verse_numbers[i+1] == verse_numbers[i] + 1) {
              // If we're in a range, don't do anything
              // If not, start one
              if (in_range == false) {
                in_range = true;
                range_start = verse_numbers[i];
                usfm_range_start = this.selected.verse_usfms[i];
              }
            } else {
              // Stop a range if we're in it, add number if we're not
              if (in_range == true) {
                in_range = false;
                verse_ranges.push(range_start + "-" + verse_numbers[i]);
                usfm_ranges.push(usfm_range_start + "-" + verse_numbers[i]);
              } else {
                verse_ranges.push(verse_numbers[i]);
                usfm_ranges.push(this.selected.verse_usfms[i]);
              }
            }
          }
        }
      }
    }

    // populate our selected hash with values after creating ranges.
    this.selected.verse_usfm_ranges = usfm_ranges;
    this.selected.verse_number_ranges = verse_ranges;
  },

  clearHighlights : function(article_id) {
    var highlights = this.fetchHighlightedVerses(article_id);

    highlights.css("background-color", 'transparent');
    highlights.removeClass('highlighted dark_bg');
  },

  showHighlights : function(article_id) {
    $.each(this.fetchHighlightedVerses(article_id), function() {
      $(this).css('background-color', $(this).attr('data-highlight-color'));
    });
  },

  hideHighlights : function(article_id) {
    $.each(this.fetchHighlightedVerses(article_id), function() {
      $(this).css('background-color', 'transparent');
    });
  },

  loadHighlights : function(article_id) {
    var _this   = this;
    var ref     = $(article_id).data("reference");
    var version = $(article_id).find('.version').data("vid");
    var chapter = $(article_id).find('.chapter');
    var userShowsHighlights = $('#main article').attr('data-setting-show-highlights') || 'true';

    // Apply locale to our ajax urls to avoid 302 to correct locale'd url.
    var locale = "";
    var html_locale = $('html').data("locale");
    if(html_locale != "en") { locale = "/" + html_locale; }

    //HACK: looking for "intro" is not a great way to check if a chapter may have
    //highlights, but it "works"
    if(!chapter.length || !version || chapter.data("usfm").match(/intro/i)){return;}

    $.ajax({
      url: locale + "/highlights/" + version + "/" + ref,
      method: "get",
      dataType: "json",
      success: function(highlights) {

        _this.clearHighlights(article_id);

        $.each(highlights, function(i, highlight) {
          $.each(highlight.references, function(i,ref_hash) {
            window.Highliter.highlight(ref_hash.usfm,highlight.color)    
          });
        });

        // have to reparse the verses again due to adding new attribute values
        _this.parseVerses();

      },//end success function
      error: function(req, status, err) { }
    });
  },

  updateMenus : function() {
    // Set total selected verse count
      var total = this.selected.verse_usfms.length;
      
      this.selected_menu.setTotal(total);

    // Set selected references
      this.selected_menu.setSelectedReferences( this.selected.verse_usfms );
  },

  generateLinks : function( ) {
    var joined        = this.selected.verse_number_ranges.join(",");
    var short_link    = "http://bible.com/" + this.version + "/" + this.book + "." + this.chapter + "." + joined + "." + this.abbrev;
    var partial_path  = "." + joined;
    var relative_link = "/bible/" + this.version + "/" + this.book + "." + this.chapter + partial_path;

    this.selected_menu.updateLink( short_link );
    this.selected_menu.updateSharing({ link: short_link });

    $("article").attr('data-selected-verses-rel-link', relative_link.toLowerCase());
    $("article").attr('data-selected-verses-path-partial', partial_path);
  },

  generateReferenceTokens : function( ) {

    var verse_ranges  = this.selected.verse_number_ranges;
    var usfm_ranges   = this.selected.verse_usfm_ranges;

    // Reference info, tokens and handlers
    var verse_refs = [];
    var thiss = this;
    var lists = $(".reference_tokens");
        lists.html("");

    var temp = [];
    $.each(verse_ranges, function(i, range) {
      var li = $("<li/>");
      var a  = $("<a/>",{ href: "#", "data-usfm": usfm_ranges[i]}).html(thiss.book_human + " " + thiss.chapter + ":" + range);

      // Clicking reference token will deselect verse and run parsing
      a.click( function(e) {
        e.preventDefault();

        var usfm = $(this).data("usfm");

        var verses = [];
        if( usfm.indexOf('-') == -1){
          // single verse
          verses.push(usfm.split('.')[2]);
        } else {
          // verse range
          var nums = usfm.split('.')[2].split('-');
          for (var i = nums[0]; i <= nums[1]; i++) {
           verses.push(i);
          }
        }

        $("#version_primary .verse.v" + verses.join(', #version_primary .verse.v')).each( function(){
          thiss.deselectVerse($(this));
        });

        thiss.parseVerses();
      });

      li.append(a);
      lists.append(li); // Append token to all .reference_token lists
    });
  },

  // Next & Prev navigation controls on reader
  initNextPrev : function() {

    if ($(".main_reader").length > 0){
      var initoffset = $('.main_reader article').offset().top;
      var initviewport = $(window).height();
      var main_reader_height = $('.main_reader article').height() + 35
      var offset_height = $('.main_reader article').offset().top;
      var prev_next_selector  = '.reader-prev, .reader-next';
      var reader_nav_selector = '.reader-nav, .reader-prev, .reader-next'

      $(prev_next_selector).height(initviewport-initoffset-40);

      if( main_reader_height + offset_height > initviewport ) {
        //recalculate the nav button height and change the height.
        $(window).resize(function(e) {
          window.offset = $('.main_reader article').offset().top;
          window.viewport = $(window).height();
          window.doc_height = $(document).height();
          window.main_height = $('.main_reader article').height();
          window.bottom_offset =  doc_height - offset - main_height;
          $(prev_next_selector).height(viewport - offset-40);
        })

        if (!$('html').hasClass("full_screen")) {
          $('.main_reader footer').waypoint(function(event, direction) {
              // Yeah bro, what do I do?
              if (direction === 'down') {
                $(reader_nav_selector).addClass('snap');
              }
              else {
                $(reader_nav_selector).removeClass('snap');
              }
            }, { offset: '100%'  // middle of the page
          });
        }
      }
      else {
        $(prev_next_selector).height(main_reader_height);
      }
    }
  },

  // In text notes, hover over # to display.
  initTranslationNotes : function() {

    // We dynamically position note on each hover, as position
    // can change based on interactive reader options
    function overNote(){
      var label = $(this).find('.label');
      var ctn = $(this).find('.outer_container');
      var inner = ctn.find('.inner_container');
      var label_left  = label.offset().left;
      var label_bottom  = label.offset().top + label.outerHeight();
      var reader_right = label.closest('.version').innerWidth() + $(this).closest('.version').offset().left;
      var reader_top = $(this).closest('.version').position().top;
      var reader_bottom = label.closest('.version').innerHeight() + $(this).closest('.version').offset().top;
      var left = label.position().left;
      var top = label.position().top;


      // Set X position
      if ((label_left + ctn.outerWidth()) < reader_right){
        ctn.css('left', left + "px");
      } else {
        // reverse tip to fit in reader
        ctn.css('left', left - ctn.outerWidth() + $(this).outerWidth() + "px");
      }

      // Flip vertically if too tall for reader
      if ((label_bottom + ctn.outerHeight()) > reader_bottom){
        var newTop = top - ctn.outerHeight();
        if(newTop >= reader_top){
          ctn.css('top', newTop);
        }else {
          // note reaches past the top of the reader when flipped,
          // do the best we can by positioning at top of reader
          // reducing font size, and increasing width
          if (!inner.hasClass('hacked')){
            ctn.css('top', reader_top + "px");
            inner.css('font-size', parseInt(inner.css('font-size')) - 2 + "px");
            inner.css('max-width', parseInt(inner.css('max-width')) + 30 + "px");
            inner.addClass('hacked');
          }
        }


      }

      ctn.show();
      ctn.animate({opacity: 1}, "200");
    }

    function offNote(event){
      // MouseOut
      var ctn = $(this).find('.outer_container');
      ctn.delay(350).animate({opacity: 0}, "200", function() {ctn.hide();});
    }

    $('.note .body').wrap('<div class="outer_container"></div>');
    $('.note .body').wrap('<div class="inner_container"></div>');
    var hoverConfig = {
     over: overNote,
     timeout: 350, // number = milliseconds delay before onMouseOut
     out: offNote
    };
    $('.note .label').closest('.note').hoverIntent( hoverConfig )
  },

  initAudioPlayer : function() {

    if (!this.audio_player.length) { return; }

    var audio_menu = $('#menu_audio_player').show();

    var adjustBarWidth = function() {
        $('.mejs-time-rail').css('width', 191);
        $('.mejs-time-total').css('width', 190);
    };

    this.audio_player.mediaelementplayer({
      pluginPath: "https://web-production.s3.amazonaws.com/assets/",
      features: ['playpause', 'current', 'progress', 'duration'],
      audioWidth: '100%',
      success: function(mediaElement, domObject) {
        //KM: using the timeupdate event for this which gets fired quite a bit.
        //There might be a less frequent event we can use but this work for
        //now.
        mediaElement.addEventListener('timeupdate', function(e) {
            adjustBarWidth();
        }, false);
      }
    });

    audio_menu.hide();

    //KM: the player sets the width in JS sometime after loading but I don't
    //see an event to hook into. This timer seems to do the trick.
    setTimeout(function() {
        adjustBarWidth();
    }, 100);
  },

  initVerses : function() {
    // list of verses "" or "1" or "1,2,3"
    // .attr retrieves value as string and doesn't attempt to cast to other type.

    // Selected verses
    var verses = $("article").attr("data-selected-verses");
        verses = (verses) ? verses.split(",") : [];

    var thiss = this;

    if (verses.length) {
      for (var i = 0; i < verses.length; i++) {
        $(".verse.v" + verses[i]).addClass("selected");
      }
      var scroll_verse = $('#version_primary .selected:first');
    }

    // Focused verses
    var verses = $("article").attr("data-focused-verses");
        verses = (verses) ? verses.split(",") : [];

    if (verses.length) {
      for (var i = 0; i < verses.length; i++) {
        $(".verse.v" + verses[i]).addClass("focused");
      }
      var scroll_verse = $('#version_primary .focused:first');
    }

    if(scroll_verse && $('head meta[name="apple-itunes-app"]').length == 0 && $('#mobile-sb-subscription.initial').length == 0){
      //TODO: make the 2nd part actually if there is modal display
      $(document).ready(function() {
        //DOM is loaded, wait a bit for css to load then scroll to first verse
        window.setTimeout(function(){thiss.scrollToVerse(scroll_verse)}, 300);
      });
    }

  },

  ajaxSecondaryVersion : function() {

    if (this.secondary_loaded) { return; }

    var target  = $('#version_secondary');
    var v_id    = getCookie('alt_version') || 1;
    var usfm    = target.attr('data-usfm');
    var _this   = this;

    // Apply locale to our ajax urls to avoid 302 to correct locale'd url.
    var locale = "";
    var html_locale = $('html').data("locale");
    if(html_locale != "en") { locale = "/" + html_locale; }
    var request_url = locale + "/bible/" + v_id + "/" + usfm + ".json";

    $.ajax({
        method: "get",
        dataType: "json",
        url: request_url,
        
        success: function(ref) {
          var content = ref.content_plain;

          if (_this.isParallel() == 'true'){
            //fade in/out adds in-line style that will bork our css styling
            var orig_style = target.attr('style') || '';
            target.fadeOut(100, function() {
              target.html(content);
              target.fadeIn(200);
              target.attr('style', orig_style);
              _this.loadHighlights("#version_secondary");
            });
          }
          else{
            target.html(content);
            _this.loadHighlights("#version_secondary");
          }
          _this.secondary_loaded = true;
        },//end success function
        error: function(xhr, status, err) {
          // set HTML to error HTML
          target.html("<h1>Error Loading Secondary Version</h1>\
                            <p>You might try <a href=''>reloading</a>. \
                            Still having trouble? Contact our \
                            <a href='http://support.youversion.com' \
                            target='_blank'>support team</a>.</p>");
        }//end error function
      });//end ajax delegate
  },

  ajaxNotesWidget : function() {
    if (this.notes_loaded) { return; }
    var _this = this;

    $(".ajax_notes").each(function() {
      var widget = $(this);
      var targets = widget;

      if (widget.attr('data-dup')) targets = targets.add(widget.attr('data-dup'));

      $.ajax({
        url: widget.data('ajax'),
        method: "get",
        dataType: "html",
        success: function(data) {

          targets.fadeOut(200, function() {
            var new_widget = $('<div>').html(data).hide();
            targets.after(new_widget); // place new widget in markup directly after loading widget (not inside)
            new_widget.fadeIn(200);
            widget.remove();
          });

          _this.notes_loaded = true;
        }
      });
    });

  },

  ajaxBookmarksWidget : function() {
    if (this.bookmarks_loaded) { return; }

    var _this = this;

    $(".ajax_bookmarks").each(function() {
      var widget = $(this);
      var targets = widget;

      if (widget.attr('data-dup')){ targets = targets.add(widget.attr('data-dup')); }

      $.ajax({
        url: widget.data('ajax'),
        method: "get",
        dataType: "html",
        success: function(data) {

          targets.fadeOut(200, function() {
            var new_widget = $('<div>').html(data).hide();
            targets.after(new_widget); // place new widget in markup directly after loading widget (not inside)
            new_widget.fadeIn(200);
            widget.remove();
          });

          _this.bookmarks_loaded = true;
        }

      });
    });

  },

  initSidebar : function() {
    var thiss = this;
    jRes.addFunc({
      breakpoint: 'widescreen',
      enter: function() {
        thiss.ajaxNotesWidget();
        thiss.ajaxBookmarksWidget();
      },
      exit: function() {
        // already loaded, no worries
      }
    });
  },

  initSecondaryVersion : function() {
    var thiss = this;

    jRes.addFunc({
      breakpoint: 'widescreen',
      enter: function() {
        thiss.ajaxSecondaryVersion();
      },
      exit: function() {
        // already loaded, no worries
      }
    });
  },

  initHighlights : function() {
    this.loadHighlights("#version_primary");
  },

  // Public: returns true/false if reader is in full screen mode
  isFullScreen : function() {
    return this.full_screen;
  },

  // Public: toggle full screen mode for Reader
  toggleFullScreen : function() {

    var page = window.app.getPage(); //window.page;

    if( this.isFullScreen() ) {
      this.html_el.removeClass("full_screen");
      deleteCookie("full_screen");
      this.full_screen = false;
    }
    else {
      this.html_el.addClass("full_screen");
      setCookie("full_screen", 1);
      this.full_screen = true;
    }
  },

  // Public: returns true/false if reader is in parallel mode
  isParallel : function() {
    return this.parallel_mode;
  },

  // Public: toggle parallel mode for Reader
  toggleParallel : function() {

    var alt_version_menu_link = $("#menu_alt_version").find("a");
    var page = window.app.getPage();

    if( this.isParallel() ) {

      this.html_el.removeClass('parallel_mode');
      deleteCookie('parallel_mode');
      if (getCookie('full_screen') == null) this.html_el.removeClass('full_screen'); //if user didn't explicitly set full_screen, go back to regular

      alt_version_menu_link.off('click'); // remove click handler from element

      this.parallel_mode = false;
    }
    else {
      this.html_el.addClass('parallel_mode').addClass('full_screen');
      setCookie('parallel_mode', 1);

      alt_version_menu_link.click(function(e) {
          e.preventDefault();
          e.stopPropagation();
          setCookie('alt_version', $(this).closest('tr').data('version'));
          window.location = window.location.href;
      });
      this.parallel_mode = true;
    }
  }
}
