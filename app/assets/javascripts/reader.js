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

    if ((brightnessDifference >= brightnessThreshold) && (colorDifference >= colorThreshold))   {
      return true;
    } else if ((brightnessDifference >= brightnessThreshold) || (colorDifference >= colorThreshold)){
      return true;
    }

    return false;
}

function Reader(opts) {

  this.selected = {
    verses : [],
    verse_usfms : [],
    verse_params : [],
    verse_numbers : [],
    verse_usfm_ranges : [],
    verse_number_ranges : [],
  }


  this.version    = opts.version || "";
  this.abbrev     = opts.abbrev || "";
  this.reference  = opts.reference || "";
  this.book       = opts.book || "";
  this.book_api   = opts.book_api || "";
  this.book_human = opts.book_human || "";
  this.chapter    = opts.chapter || "";

  this.full_screen     = opts.full_screen || false;
  this.parallel_mode   = opts.parallel_mode || false;
  this.selected_verses = [];

  this.font           = opts.font || "";
  this.size           = opts.size || "";

  // elements

  this.html_el        = $(document.documentElement);
  this.verse_els      = $('#version_primary .verse');
  this.audio_player   = $('#audio_player');

  // menus

  this.initSelectedVerses();
  this.initSecondaryVersion();
  this.initHighlights();
  this.initAudioPlayer();
  this.initTranslationNotes();
  this.initNextPrev();

  this.book_chapter_menu  = new BookChapterMenu({trigger: "#menu_book_chapter_trigger", menu: "#menu_book_chapter"});
  this.selected_menu      = new SelectedMenu({trigger:"#menu_selected_trigger",menu:"#menu_bookmark"});  // need to update this html id.

  $(this.selected_menu).bind("verses:clear", $.proxy(function(e){
    this.clearSelectedVerses();
  },this));

  this.parseVerses(); // run once on load
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
        })

    // Set click handlers for all verses
    // Todo, potentially set click delegate on parent element for optimization?
    this.verse_els.click( $.proxy(function(e) {
      e.preventDefault();
      this.verseClicked(e.delegateTarget);
    },this));

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

  verseClicked : function( verse ) {
    var v = $(verse);
    (this.isSelected(v)) ? this.deselectVerse(v) : this.selectVerse(v);
    this.parseVerses();
  },

  deselectVerse : function( v ) {
    $(this.parseVerseClasses(v)).each( function(i,val) {
      $(".verse." + val ).removeClass("selected");
    });
  },

  selectVerse : function( v ) {
    $(this.parseVerseClasses(v)).each( function(i,val) {
      $(".verse." + val ).addClass("selected");
    });
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
    this.parseVerses();
  },

  scrollToSelectedVerse : function(easingType) {
    // TODO: set this up in a way we can cancel if user scrolls before it happens
    easingType = easingType || 'easeInOutCirc';
    var first = $('#version_primary .selected:first');
    if (first.length){
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
    var classes = v.attr('class').split(/\s+/) || [];
    var v_classes = [];
        $(classes).each( function(i, val) {
          var match = val.match(/v[0-9]+/g);
          if(match && match.length) { v_classes.push(match[0].toString())}
        });
    return v_classes;
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

      this.selected.verses.each(function() {
        var verse   = $(this);
        var _usfms  = thiss.parseVerseUsfms(verse);
        var _vid    = verse.closest('.version').data('vid');
        var _nums   = thiss.parseVerseNums(verse);

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
    var chapter = $(article_id).find('.chapter');
    var version = $(article_id).find('.version').data("vid");
    var verse = null;
    var userShowsHighlights = $('#main article').attr('data-setting-show-highlights') || 'true';

    var thiss = this;

    if(!chapter.length || !version){return;}

    $.ajax({
      url: "/bible/" + version + "/" + chapter.data("usfm") + "/highlights",
      method: "get",
      dataType: "json",
      success: function(jsonHighlights) {

        //reset any old highlights in the current chapter
        thiss.clearHighlights(article_id);

        //apply the new highlights
        $.each(jsonHighlights, function(i, highlight) {
            verse = chapter.find(".verse.v" + highlight.verse);
            verse.addClass("highlighted");

            verse.attr("data-highlight-color", "#" + highlight.color);
            if (isColorDark(highlight.color)) { verse.addClass("dark_bg"); }

            //add the highlight ids (so if user clears they can clear them all)
            highlight_ids = verse.attr('data-highlight-ids');
            if (highlight_ids){
              highlight_ids = highlight_ids.split(',');
            }else{highlight_ids = [];}
            highlight_ids.push(highlight.id);
            verse.attr('data-highlight-ids', highlight_ids.join(','));
        });//end highlights each

        if (userShowsHighlights == 'true') { thiss.showHighlights(article_id); }

        // have to reparse the verses again due to adding new attribute values
        thiss.parseVerses();

      },//end success function
      error: function(req, status, err) {
        //console.log(status + err);
      }//end error function
    });//end ajax delegate
  },

  updateMenus : function() {
    // Set total selected verse count
      var total = this.selected.verse_usfms.length;
      this.selected_menu.setTotal(total);

    // After parsing, update the highlights pane.
      this.selected_menu.updateHighlights( this.selected.verse_params );

    // Set selected references
      this.selected_menu.setSelectedRefs( this.selected.verse_usfm_ranges );
  },

  generateLinks : function( ) {
    var joined        = this.selected.verse_number_ranges.join(",");
    var short_link    = "http://bible.us/" + this.version + "/" + this.book + "." + this.chapter + "." + joined + "." + this.abbrev;
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
        thiss.deselectVerse($("#version_primary .verse[data-usfm='" + usfm + "']"));
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
      $('.nav_next, .nav_prev').height(initviewport-initoffset-40);

      if( main_reader_height + offset_height > initviewport ) {
        //recalculate the nav button height and change the height.
        $(window).resize(function(e) {
          window.offset = $('.main_reader article').offset().top;
          window.viewport = $(window).height();
          window.doc_height = $(document).height();
          window.main_height = $('.main_reader article').height();
          window.bottom_offset =  doc_height - offset - main_height;
          $('.nav_next, .nav_prev').height(viewport - offset - 40);
        })

        if (!$('html').hasClass("full_screen")) {
          $('.main_reader footer').waypoint(function(event, direction) {
              // Yeah bro, what do I do?
              if (direction === 'down') {
                $('.nav_items, .nav_prev, .nav_next').addClass('snap');
              }
              else {
                $('.nav_items, .nav_prev, .nav_next').removeClass('snap');
              }
            }, { offset: '100%'  // middle of the page
          });
        }
      }
      else {
        $('.nav_prev, .nav_next').height(main_reader_height);
      }
    }
  },

  // In text notes, hover over # to display.
  initTranslationNotes : function() {

    // We dynamically position note on each hover, as position
    // can change based on interactive reader options
    function overNote(){
      var ctn = $(this).next('.outer_container');
      var label_left  = $(this).offset().left;
      var reader_right = $(this).closest('.version').innerWidth() + $(this).closest('.version').offset().left;
      var left = $(this).position().left;

      if ((label_left + ctn.outerWidth()) < reader_right){
        ctn.css('left', left + "px");
      } else {
        // reverse tip to fit in reader
        ctn.css('left', left - ctn.outerWidth() + $(this).closest('.note').outerWidth() + "px");
      }

      ctn.show();
      ctn.animate({opacity: 1}, "200");
    }

    function offNote(){
      // MouseOut
      var ctn = $(this).next('.outer_container');
      ctn.delay(350).animate({opacity: 0}, "200", function() {ctn.hide();});
    }

    $('.note .body').wrap('<div class="outer_container"></div>');
    $('.note .body').wrap('<div class="inner_container"></div>');
    $('.note .label').hoverIntent(overNote, offNote)
  },

  initAudioPlayer : function() {

    if (!this.audio_player.length) { return; }

    var audio_menu = $('#menu_audio_player').show();

    this.audio_player.mediaelementplayer({
      features: ['playpause', 'current', 'progress', 'duration'],
      audioWidth: '100%'
    });

    audio_menu.hide();
  },

  initSelectedVerses : function() {

    // list of verses "" or "1" or "1,2,3"
    // .attr retrieves value as string and doesn't attempt to cast to other type.
    var verses = $("article").attr("data-selected-verses");
        verses = verses.split(",");
    var thiss = this;

    if (verses.length) {
      for (var i = 0; i < verses.length; i++) {
        $(".verse.v" + verses[i]).addClass("selected");
      }

      $(document).ready(function() {
        //DOM is loaded, wait a bit for css to load then scroll to first verse
        window.setTimeout(thiss.scrollToSelectedVerse, 300);
      });
    }
  },

  initSecondaryVersion : function() {
    var version_elem = $('#version_secondary');
    var v_id = getCookie('alt_version') || 1;
    var usfm = version_elem.attr('data-usfm');
    var thiss = this;

    $.ajax({
        url: "/bible/" + v_id + "/" + usfm + ".json",
        method: "get",
        dataType: "json",
        success: function(ref) {
          if (thiss.isParallel() == 'true'){
            //fade in/out adds in-line style that will bork our css styling
            var origStyle = version_elem.attr('style') || '';
            version_elem.fadeOut(100, function() {
              version_elem.html(ref.content);
              version_elem.fadeIn(200);
              version_elem.attr('style', origStyle);
              thiss.loadHighlights("#version_secondary");
            });
          }else{
            version_elem.html(ref.content);
            thiss.loadHighlights("#version_secondary");
          }
        },//end success function
        error: function(xhr, status, err) {
          // set HTML to error HTML
          if(xhr.status == '404'){
            var ref = jQuery.parseJSON(xhr.responseText);
            version_elem.html(ref.content);
          }else{version_elem.html("<h1>Error Loading Secondary Version</h1>\
                            <p>You might try <a href=''>reloading</a>. \
                            Still having trouble? Contact our \
                            <a href='http://support.youversion.com' \
                            target='_blank'>support team</a>.</p>");}
        }//end error function
      });//end ajax delegate

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

      page.killWidgetSpacers();
      page.fixWidgetHeader();
      page.fixWidgetLast();
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

      page.killWidgetSpacers();
      page.fixWidgetHeader();
      page.fixWidgetLast();

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