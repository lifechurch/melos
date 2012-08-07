function setCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function deleteCookie(name) {
  setCookie(name,"",-1);
}

ZeroClipboard.setMoviePath('/assets/lib/ZeroClipboard.swf');
var clip = new ZeroClipboard.Client();
clip.setHandCursor(true);
var text_to_send = "";


// Module pattern + Closure
var YV = (function($, window, document, undefined) {
  // Private constants.
  var HTML = $(document.documentElement);
  var KEY_ESC = 27;
  var TOP_OFFSET = 82;

  // Internet Explorer detection.
  var BROWSER = $.browser;
  var VERSION = parseInt(BROWSER.version, 10);
  var IE = BROWSER.msie;
  var IE7 = !!(IE && VERSION === 7);
  var IE8 = !!(IE && VERSION === 8);
  var IE9 = !!(IE && VERSION === 9);

  // Expose YV methods.
  return {
    // Run everything in YV.init
    go: function() {
      var i, j = YV.init;

      for (i in j) {
        j.hasOwnProperty(i) && j[i]();
      }
    },
    load: function() {
      var i, j = YV.init_load;

      for (i in j) {
        j.hasOwnProperty(i) && j[i]();
      }
    },
    // YV.misc
    misc: {
      // YV.misc.kill_widget_spacers
      kill_widget_spacers: function() {
        // Kill spacers, if they exist already
        // because this function is called when
        // exiting "full screen" mode, so make
        // them up anew, to clean the slate.
        $('.widget_spacer').remove();
      }
    },

    init_load: {
      ajax: function() {
        $(".ajax_me").each(function() {
          var that = $(this);
          $.ajax({
            url: that.data('ajax'),
            method: "get",
            dataType: "html",
            success: function(data) {
              that.fadeOut(200, function() {
                that.html(data);
                that.fadeIn(200);
              });
            },
            error: function(req, status, err) {
              //console.log(status + err);
            }//end error function
          });
        });
      },
    },
    // YV.init
    init: {
      // YV.init.last_child
      last_child: function() {
        if (IE7 || IE8) {
          $('li, tr, td, th, dd, span, tbody').filter(':last-child').addClass('last-child');
        }
      },
      // YV.init.flash_message
      flash_message: function() {
        var divs = $(".flash_error, .flash_notice");
        divs.click(function() {
          $(this).slideUp(200);
        });
        window.setTimeout(function() {
          divs.slideUp(200);
        }, 5000);
      },
      // YV.init.autofocus
      autofocus: function() {
        $(".autofocus").focus();
      },
      // YV.init.modal_window
      modal_window: function() {
        var modal = $('#modal_single_verse #modal_window');

        if (!modal.length) {
          return;
        }

        var overlay = $('#modal_single_verse #modal_overlay');
        var close = modal.find('.close');
        var hash = window.location.hash;

        function show_modal() {
          overlay.show();
          modal.show();

          var top = Math.round(modal.outerHeight() / 2);
          var left = Math.round(modal.outerWidth() / 2);

          modal.css({
            marginTop: -top,
            marginLeft: -left
          });
        }

        function hide_modal() {
          overlay.hide();
          modal.hide();
        }

        overlay.click(function() {
          hide_modal();
        });

        close.mousedown(function() {
          hide_modal();
          return false;
        });

        var verses = $("article").data("selected-verses")

        if (verses && $("article").data("verse-modal-enabled")) {
          if (verses.length == 1) {
            show_modal();
          }
        }

        $("#single_verse_read_link").click(function(e) {
          e.preventDefault();
          hide_modal();
          return false;
        });

        $(document).keydown(function(ev) {
          if (ev.keyCode === KEY_ESC) {
            hide_modal();
          }
        });
      },
      // YV.init.set_selection
      set_selection: function() {
        var verses = $("article").data("selected-verses");
        var book = $("article").data("book-api");
        var chapter = $("article").data("chapter");
        if (verses) {
          for (var i = 0; i < verses.length; i++) {
            $(".verse" + ".v" + verses[i]).addClass("selected");
          }
        }
      },
      // YV.init.modal_window
      share_modal_window: function() {
        var modal = $('#modal_share_verse #modal_window');

        if (!modal.length) {
          return;
        }

        var overlay = $('#modal_share_verse #modal_overlay');
        var close = modal.find('.close');
        var hash = window.location.hash;

        function show_modal() {
          overlay.show();
          modal.show();

          var top = Math.round(modal.outerHeight() / 2);
          var left = Math.round(modal.outerWidth() / 2);

          modal.css({
            marginTop: -top,
            marginLeft: -left
          });
        }

        function hide_modal() {
          overlay.hide();
          modal.hide();
        }

        overlay.click(function() {
          hide_modal();
        });

        $(".action_cancel").click(function() {
          hide_modal();
        });

        close.mousedown(function() {
          hide_modal();
          return false;
        });

        if (hash.match('#share_')) {
          show_modal();
        }
        //Share Modal Tab System
        function hide_tabs() {
          $('#share_tab').removeClass('selected_tab');
          $('#share_tab_content').hide()
          $('#link_tab').removeClass('selected_tab');
          $('#link_tab_content').hide()
        }
        function show_link_tab(){
          hide_tabs();
          $('#link_tab').addClass('selected_tab');
          $('#link_tab_content').show()
        }
        function show_share_tab(){
          hide_tabs();
          $('#share_tab').addClass('selected_tab');
          $('#share_tab_content').show()
        }
        $('#link_tab').click(function(){
          show_link_tab();
        })
        $('#share_tab').click(function(){
          show_share_tab();
        })
        $(".share_message textarea").charCount({
          css: "character_count"
        });

        // Opening Share Modal from Dynamic Menu

        $("#open_share_modal").click(function(){
          show_modal();
          show_share_tab();
        })
        $("#open_share_modal_link").click(function(){
          show_modal();
          show_link_tab();
        })
        $("div.widget.parallel_notes").find('a.cancel').click(function(){
          $("div.widget.parallel_notes").hide(200, function() {
            $("div.widget.bookmarks, div.widget.notes, div.widget.ad_bible_app").show(200);
          });
        return false;
        });
        $("#new_note_modal").click(function() {
          $('.dynamic_menu_trigger').parent('li').removeClass('li_active');
          $('.dynamic_menu').hide();

          $("div.widget.bookmarks, div.widget.notes, div.widget.ad_bible_app").hide(200, function() {
            $("div.widget.parallel_notes").show(200);
          });
          return false;
        });
        $(document).keydown(function(ev) {
          if (ev.keyCode === KEY_ESC) {
            hide_modal();
          }
        });
      },
      // YV.init.read_parallel
      read_parallel: function() {
        var button = $('#button_read_parallel');

        if (!button.length) {
          return;
        }

        button.click(function() {
          if (HTML.hasClass('parallel_mode')) {
            HTML.removeClass('parallel_mode');
            deleteCookie('parallel_mode');
            if (getCookie('full_screen') == null) HTML.removeClass('full_screen'); //if user didn't explicitly set full_screen, go back to regular
            YV.misc.kill_widget_spacers();
            YV.init.fixed_widget_header();
            YV.init.fixed_widget_last();
          }
          else {
            HTML.addClass('parallel_mode').addClass('full_screen');
            setCookie('parallel_mode', 1);
          }

          this.blur();
          return false;
        });

        $("#menu_alt_version").find("a").click(function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          setCookie('alt_version', $(this).closest('tr').data('version'));
          window.location = window.location.href;
        });
      },
      // YV.init.full_screen
      full_screen: function() {
        var button = $('#button_full_screen');

        if (!button.length) {
          return;
        }

        if (IE7 || IE8 || IE9) {
          $('#main article > div *:last-child').addClass('ie_last_child');
        }

        button.click(function() {
          if (HTML.hasClass('full_screen')) {
            HTML.removeClass('full_screen');
            deleteCookie("full_screen");
            YV.misc.kill_widget_spacers();
            YV.init.fixed_widget_header();
            YV.init.fixed_widget_last();
          }
          else {
            HTML.addClass('full_screen');
            setCookie("full_screen", 1);
          }

          this.blur();
          return false;
        });
      },
      // YV.init.table_cellspacing
      table_cellspacing: function() {
        var table = $('table');

        if (!IE7 || !table.length) {
          return;
        }

        table.attr('cellspacing', '0');
      },
      // YV.init_progress_bars
      progress_bar: function() {
        var progress_bar = $('.progress_bar');

        if (!progress_bar.length) {
          return;
        }

        var speed = 1500;

        progress_bar.each(function() {
          var el = $(this);
          var width = el[0].style.width;
          var raw_width = parseInt(width, 10);
          var arrow = el.closest('.progress_wrap').find('.progress_percent_complete');

          el.css({
            width: '14px',
            visibility: 'visible'
          });

          $(window).load(function() {
            if (raw_width > 4) {
              el.delay(250).animate({
                width: width
              }, speed, function() {
                arrow.css({
                  visibility: 'visible'
                });
              });
            }
            else {
              arrow.css({
                left: '14px',
                visibility: 'visible'
              });
            }
          });
        });
      },
      // YV.init.radio_checkbox
      radio_checkbox: function() {
        var input = $('input[type="radio"], input[type="checkbox"]');

        if (IE7 || !input.length) {
          return;
        }

        function determine_checked() {
          input.each(function() {
            var el = $(this);

            if (this.checked) {
              el.closest('label').addClass('is_checked');
            }
            else {
              el.closest('label').removeClass('is_checked');
            }

            if (this.disabled) {
              el.closest('label').addClass('is_disabled');
            }
            else {
              el.closest('label').removeClass('is_disabled');
            }
          });
        }

        input.each(function() {
          var el = $(this);
          var label_class = 'faux_' + el.attr('type');

          if (el.closest('.' + label_class).length) {
            el.unwrap();
          }

          el.wrap('<label class="' + label_class + '" for="' + el.attr('id') + '"></label>');
        }).off('click.faux_input').on('click.faux_input', function() {
          determine_checked();
        }).off('focus.faux_input').on('focus.faux_input', function() {
          $(this).closest('label').addClass('is_focused');
        }).off('blur.faux_input').on('blur.faux_input', function() {
          $(this).closest('label').removeClass('is_focused');
        });

        // Run for first time.
        determine_checked();
      },
      // YV.init.accordion
      accordion: function() {
        var accordion = $('.accordion');


        if (!accordion.length) {
          return;
        }

        accordion.find('dt').click(function() {
          var dt = $(this);
          var dd = dt.next('dd');

          if (dd.is(':hidden')) {
            dd.slideDown('default', function() {
                // Animation complete, items visible
                if (dt.attr('id') == "link"){
                  if(!dd.find('#ZeroClipboardMovie_1').length){
                  clip.glue('copy_link', 'copy_link_container');
                  }
                }
              }).siblings('dd').slideUp();
          }

          this.blur();

          if(!dt.hasClass("propagate_click")){
            return false;
          }
        });

      },
      // YV.init.dynamic_menus
      dynamic_menus: function() {
        var trigger = $('.dynamic_menu_trigger');

        if (!trigger.length) {
          return;
        }

        var all_items = trigger.parent('li');
        var all_menus = $('.dynamic_menu');
        var li_class = 'li_active';
        var cur_book = $('.main_reader article').data('book');
        var cur_chapter = $('.main_reader article').data('chapter');

        function hide_all_menus() {
          all_items.removeClass(li_class);
          all_menus.hide();
        }

        all_menus.find("form").submit(function() {
          var spinner = new Spinner({
            lines: 12,
            length: 7,
            width: 5,
            radius: 10,
            color: '#fff',
            speed: 1,
            shadow: false
            }).spin(document.getElementById("bookmark_spinner"));
          var spinner_book_chapter = new Spinner({
            lines: 12,
            length: 7,
            width: 5,
            radius: 10,
            color: '#fff',
            speed: 1,
            shadow: false
            }).spin(document.getElementById("book_chapter_spinner"));

          $(".spinner_wrapper").fadeIn(200);
        });

        all_menus.find(".spinner_trigger").click(function(){
           var spinner_book_chapter = new Spinner({
              lines: 12,
              length: 7,
              width: 5,
              radius: 10,
              color: '#fff',
              speed: 1,
              shadow: false
              }).spin(document.getElementById("book_chapter_spinner"));

            var spinner_version = new Spinner({
                lines: 12,
                length: 7,
                width: 5,
                radius: 10,
                color: '#fff',
                speed: 1,
                shadow: false
                }).spin(document.getElementById("version_spinner"));
            //TODO make these 3 spinners more generic/dynamic and just one of them :) (use spinner_trigger and click for all)
            $(".spinner_wrapper").fadeIn(200);
        });

        function populate_chapter_list(book_a_el){
          var ol = book_a_el.closest('.dynamic_menu').find('ol:first');
          var chapter_refs = book_a_el.data('chapter-refs');
          var chapters = book_a_el.data('chapters');
          var book = book_a_el.data('book');
          var version = book_a_el.data('version');
          var li = book_a_el.closest('li');
          var list = '';

          for (var i = 0; i < chapters.length; i++) {
            list += '<li class="' + (book == cur_book && chapters[i] == cur_chapter ? li_class : '') + '"><a href="/bible/' + chapter_refs[i] + '.' + version + '">' + chapters[i] + '</a></li>';
          }

          li.addClass(li_class).siblings().removeClass(li_class);
          ol.html(list);
        }

        //select initial book and populate chapter list
        $('#menu_book_chapter #menu_book li').each(function(index) {
          var li = $(this);
          var a = $(this).find('a');

          if (a.data('book') == cur_book){
            li.addClass(li_class).siblings().removeClass(li_class);
            li.closest('#menu_book').data('selected-book-num', index + 1);
            populate_chapter_list(a);
          }
        });

        trigger.click(function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          var el = $(this);
          var menu = $(el.attr('href'));
          var li = el.closest('li');
          var icon = el.find('span:first').length ? el.find('span:first') : el;
          var offset = icon.offset();
          var is_full_screen = HTML.hasClass('full_screen');
          var window_width = $(window).innerWidth();
          var offset_right = offset.left + menu.outerWidth();
          var reverse = 'dynamic_menu_reverse';
          var reverse_nudge;
          var left;

          // if (is_full_screen && menu[0].id === 'menu_bookmark') {
          if (offset_right >= window_width) {
            reverse_nudge = el.hasClass('button') ? 31 : 30;
            left = offset.left - menu.outerWidth() + reverse_nudge;
            menu.addClass(reverse);
          }
          else {
            menu.removeClass(reverse);

            if (el.attr('id') === 'verses_selected_button') {
              left = offset.left - 1;
            }
            else if (el.hasClass('button')) {
              left = offset.left - 6;
            }
            else {
              left = offset.left + parseInt(icon.css('border-left-width'), 10) - 8;
            }
          }

          if (menu.is(':hidden')) {
            hide_all_menus();

            li.addClass(li_class);

            if(menu.css('position') != "absolute"){
              menu.css({
                left: left
              }).show();

              if(menu.attr('id') == 'menu_book_chapter'){
               var index = menu.find('#menu_book').data('selected-book-num');
               menu.find('.scroll').first().scrollTop((index - 1) * (menu.find('li').height() + 1)); //TODO: why are 1st and last elements 1px shorter than the rest??
              }
            }
            else{
              menu.show();
            }
          }
          else {
            hide_all_menus();
          }

          el.blur();
        });

        //show chapters when users clicks a book
        $('#menu_book').delegate('a', 'click', function() {
          populate_chapter_list($(this));

          this.blur();
          return false;
        });

        $(document).mousedown(function(ev) {
          var el = $(ev.target);

          if (el.hasClass('close') || (!el.closest('.dynamic_menu_trigger').length && !el.closest('.colorpicker').length && !el.closest('.dynamic_menu').length)) {
            hide_all_menus();
          }
        }).keydown(function(ev) {
          if (ev.keyCode === KEY_ESC) {
            hide_all_menus();
          }
        });

        $(window).resize(function() {
          hide_all_menus();
        });
      },
      // YV.init.fixed_widget_header
      fixed_widget_header: function() {
        var header = $('.widget header');

        if (!header.length) {
          return;
        }

        // Used later.
        var timer;

        // Last sidebar widget is special, leave it alone.
        var last_widget = $('#sidebar').find('.widget:last');

        // Insert spacers.
        header.each(function() {
          var el = $(this);
          var this_widget = el.closest('.widget');

          if (this_widget[0] === last_widget[0]) {
            return;
          }

          $('<div class="widget_spacer">&nbsp;</div>').insertBefore(el);
        });

        function position_widgets() {
          // For IE. Really belongs in the window event listener,
          // but having it cleared here doesn't hurt anything.
          clearTimeout(timer);

          header.each(function() {
            var el = $(this);
            var this_widget = el.closest('.widget');

            if (this_widget[0] === last_widget[0]) {
              // Don't do anything, we'll treat this differently
              // if it's within the very last sidebar widget.
              return;
            }

            var next_widget = this_widget.next('.widget');
            var window_top = $(window).scrollTop() + TOP_OFFSET;
            var spacer = el.siblings('.widget_spacer:first');
            var spacer_top = spacer.offset().top;

            if (window_top >= spacer_top) {
              el.addClass('widget_header_fixed');

              spacer.css({
                height: 34
              });
            }
            else {
              el.removeClass('widget_header_fixed');

              spacer.css({
                height: 0
              });
            }

            if (next_widget.length) {
              if (window_top >= next_widget.offset().top) {
                el.hide();
              }
              else {
                el.show();
              }
            }
          });
        }

        // Initial call.
        position_widgets();

        // Kill off event listeners, re-create them.
        $(window).off('.widget_header').on('scroll.widget_header resize.widget_header load.widget_header', function() {
          // Irrelevant, if in "full screen" mode.
          if (HTML.hasClass('full_screen')) {
            return;
          }

          clearTimeout(timer);

          // Super-low timer, just so that we don't get caught
          // in a repetetive loop due to window scroll firing.
          timer = setTimeout(position_widgets, 1);
        });
      },
      // YV.init.fixed_widget_last
      fixed_widget_last: function() {
        var el = $('#sidebar > .widget:last-child');

        if (!el.length) {
          return;
        }

        var timer;
        var spacer = $('<div class="widget_spacer">&nbsp;</div>').insertBefore(el);

        function pin_widget() {
          // For IE. Really belongs in the window event listener,
          // but having it cleared here doesn't hurt anything.
          clearTimeout(timer);

          var spacer = el.prev('.widget_spacer');
          var spacer_top = spacer.offset().top;
          var window_top = $(window).scrollTop() + TOP_OFFSET;

          if (window_top >= spacer_top) {
            el.addClass('widget_last_fixed');
          }
          else {
            el.removeClass('widget_last_fixed');
          }
        }

        // Initial call.
        pin_widget();

        $(window).off('.widget_last').on('scroll.widget_last resize.widget_last load.widget_last', function() {
          if (HTML.hasClass('full_screen')) {
            return;
          }

          clearTimeout(timer);

          // Super-low timer, just so that we don't get caught
          // in a repetetive loop due to window scroll firing.
          timer = setTimeout(pin_widget, 1);
        });
      },
      // YV.init.verse_sharing
      verse_sharing: function() {
        var verses = $('#version_primary .verse');

        if (!verse.length) {return;}

        var clear_verses = $('#clear_selected_verses');
        var li = $('#li_selected_verses');
        var share_menu = $('#menu_bookmark');
        var button = $('#verses_selected_button');
        var count = $('#verses_selected_count');
        var input = $('.verses_selected_input');
        var copy_button = $("#copy_link");
        var highlight_form = $('.verses_selected .highlight form');
        var article = $('#main article:first');
        var book = article.data('book');
        var book_human = article.data('book-human');
        var book_api = article.data('book-api');
        var chapter = article.data('chapter');
        var version_id = $('#version_primary .version').data('vid');
        var version_abbreviation = $('#version_primary').data('abbreviation');
        var flag = 'selected';
        var hide = 'hide';
        var verse_numbers = [];
        var verse_ranges = [];


        if (IE8){
          copy_button.hide();
        }

        clip.addEventListener('load', function(client) {
        });

        clip.addEventListener('complete', function(client, text) {
                var temp = copy_button.html();
                copy_button.html(copy_button.data('confirm-text'));
                setTimeout(function() {copy_button.html(temp);}, 2000);
         } );

         clip.addEventListener( 'mouseOver', function(client) {
                clip.setText(text_to_send);
                //this is done in mouseOver due to ZeroClipboard bug
         } );

         //Zero clipboard adds and removes "hover" and "active" classes as you would expect

        function parse_verses() {
          $("article").attr('data-selected-verses-rel-link', false);
          var selected_verses = $('#version_primary .verse.' + flag);
          var selected_verses_usfm = [];
          var selected_verses_param = [];
          var ranges_usfm = [];

          // Zero out values for new selection analysis
          input.val('');
          verse_ranges.length = 0;
          verse_numbers.length = 0;

          // Get USFM refs and App params for each selected verse
          var _usfm = "";
          selected_verses.each(function() {
                  _usfm = $(this).data('usfm');
                  if (selected_verses_usfm.indexOf(_usfm) == -1) {
                    // New verse, add to array of verses
                    selected_verses_usfm.push(_usfm);
                    verse_numbers.push(parseInt($(this).find('.label').html()));
                    selected_verses_param.push(_usfm + "." + $(this).closest('.version').data('vid') + "-VID");
                  }
              });
          var total = selected_verses_usfm.length;


          // Create ranges
          if (verse_numbers.length > 0) {
            if (verse_numbers.length == 1) {
              verse_ranges.push(verse_numbers[0]);
              ranges_usfm.push(selected_verses_usfm[0]);
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
                    usfm_range_start = selected_verses_usfm[i];
                  } else {
                    // it's just a single verse
                    verse_ranges.push(verse_numbers[i]);
                    ranges_usfm.push(selected_verses_usfm[i]);
                  }

                } else if (i == verse_numbers.length) {
                  if (in_range == true) {
                    verse_ranges.push(range_start + "-" + verse_numbers[i]);
                    ranges_usfm.push(usfm_range_start + "-" + verse_numbers[i]);
                  } else {
                    verse_ranges.push(verse_numbers[i]);
                    ranges_usfm.push(selected_verses_usfm[i]);
                  }
                  exit = true;
                } else {
                  if (verse_numbers[i+1] == verse_numbers[i] + 1) {
                    // If we're in a range, don't do anything
                    // If not, start one
                    if (in_range == false) {
                      in_range = true;
                      range_start = verse_numbers[i];
                      usfm_range_start = selected_verses_usfm[i];
                    }
                  } else {
                    // Stop a range if we're in it, add number if we're not
                    if (in_range == true) {
                      in_range = false;
                      verse_ranges.push(range_start + "-" + verse_numbers[i]);
                    ranges_usfm.push(usfm_range_start + "-" + verse_numbers[i]);
                    } else {
                      verse_ranges.push(verse_numbers[i]);
                      ranges_usfm.push(selected_verses_usfm[i]);
                    }
                  }
                }
              }
            }
            //
            // Add reference info and create tokens
            var verse_refs = [];
            $(".reference_tokens").html("");
            $.each(verse_ranges, function(i, range) {
              verse_refs.push(ranges_usfm[i] + "." + version_id + '-' + version_abbreviation);
              $(".reference_tokens").append("<li><a data-usfm='" + ranges_usfm[i] + "' href='#'>" + book_human + " " + chapter + ":" + range + "</a></li>");
            });

            // Populate the verse_numbers hidden input
            input.val(verse_refs.join(","));

            // Generate a short link
            var link = "http://bible.us/" + version_id + "/" + book + chapter + "." + verse_ranges.join(',') + "." + version_abbreviation;
            var sel_verses_path_partial = "." + verse_ranges.join(',');
            var rel_link = "/bible/" + book + "." + chapter + sel_verses_path_partial;

            $("article").attr('data-selected-verses-rel-link', rel_link);
            $("article").attr('data-selected-verses-path-partial', sel_verses_path_partial);
            $('.share_message textarea').html($.makeArray($('.verse.selected .content').map(function(){
              return $(this).html();
            })).join(' ').trim());
            $("b#short_link").html(link);
            $("input#share_link").val(link);
            $(".share_message .character_count").remove();
            $(".share_message textarea").charCount({
              allowed: 140 - link.length - 1,
              css: "character_count"
            });

            // Populate the "link" input
            $("#copy_link_input").attr("value", link);
            text_to_send = link;

            existing_ids = $.makeArray($('.verse.selected.highlighted').map(function(){
              return $(this).data('highlight-ids');
            }));

            highlight_form.find('.references').val(selected_verses_param.join(','));
            highlight_form.find('.existing_ids').val(existing_ids.join(','));

            if ($('.verse.selected.highlighted').length) {
              // hide the 10th icon to make room for clear icon
              $('#highlight_9').addClass('hide');
              $('#clear_highlights').removeClass('hide');
            } else {
              $('#clear_highlights').addClass('hide');
              $('#highlight_9').removeClass('hide');
            }
            // Create reference tokens
          }

          if (total > 0) {
            li.removeClass(hide);
          }
          else {
            li.addClass(hide);
            share_menu.hide();
          }

          count.html(total);
        }
        // Run once, automatically.
        parse_verses();

        // Watch for verse selection.

        verse.click(function() {
          // All parts of the verse will have the same usfm identifier
          // Corner cases of verse ranges and verses split across paragraphs and notes
          // Require that we search for all parent verse elements
          // and add or remove the appropriate class to all those parts
          $('.verse[data-usfm="' + $(this).data('usfm') + '"]').toggleClass(flag);

          parse_verses();
        });

        button.click(function() {
          // form.submit();
          // return false;
        });

        clear_verses.click(function() {
          $('.verse.selected').removeClass('selected');
          parse_verses();
          this.blur();
          return false;
        });


        copy_button.click(function(){
          $("#copy_link_input").attr("value");
        });

        // Watch for clicking a reference token to clear it
        $("ul.reference_tokens>li>a").live("click", function(e) {
          e.preventDefault();
          var verse = $(this).attr('data-verses');
          if (verse.indexOf('-') == -1) {
            // Then it's a single one
            // clear it
            $("#version_primary span." + book_api + "_" + chapter + "_" + verse).removeClass(flag);
          } else {
            // it's a verse range, expand it to remove all verses
            var ranges = verse.split("-");
            for (i = ranges[0]; i <= ranges[1]; i++) {
              $("#version_primary span." + book_api + "_" + chapter + "_" + i).removeClass(flag);
            }
          }
          parse_verses();
        });

      },
      // YV.init.external_links
      external_links: function() {
        $("a").each(function(i) {
          var that = $(this);
          if (that.attr("href") && that.attr("href").substr(0,7) == "http://") {
            that.attr("target", "_blank");
          }
        });

      },
      // YV.init.profile_menu
      profile_menu: function() {
        var trigger = $('#header_profile_trigger');

        if (!trigger.length) {
          return;
        }

        var li = trigger.closest('li');
        var li_class = 'li_active';

        function hide_profile_menu() {
          li.removeClass(li_class);
        }

        function show_profile_menu() {
          li.addClass(li_class);
        }

        trigger.click(function() {
          if (li.hasClass(li_class)) {
            hide_profile_menu();
          }
          else {
            show_profile_menu();
          }

          this.blur();
          return false;
        });

        $(document).mousedown(function(ev) {
          if (!$(ev.target).closest('#header_profile_menu, #header_profile_trigger').length) {
            hide_profile_menu();
          }
        }).keydown(function(ev) {
          if (ev.keyCode === KEY_ESC) {
            hide_profile_menu();
          }
        });

        $(window).resize(function() {
          hide_profile_menu();
        });
      },
      // YV.init.user_settings
      user_settings: function() {
        var radio = $('.radio_user_setting');
        var article = $('#main article');

        if (!radio.length) {
          return;
        }

        radio.click(function() {
          var el = $(this);
          var font = el.attr('data-setting-font');
          var size = el.attr('data-setting-size');
          font && setCookie('data-setting-font', font);
          size && setCookie('data-setting-size', size);

          font && article.attr('data-setting-font', font);
          size && article.attr('data-setting-size', size);
        });
      },
      // YV.init.highlightsmenu
      highlight: function() {
        var color = $('.color, .color_picker_clear');
        color.live('click', function(){
          color = $('.color, .color_picker_clear');
          if(color.has('span')){
            color.empty('span');
            $(this).append("<span class='selected'></span>")
          } else {
            $(this).append("<span class='selected'></span>")
          }
        });
      $('.color_picker').ColorPicker({
        flat: false,
        onChange: function(hsb, hex, rgb, el) {
          $(".colorpicker_hex").css('background-color', "#" + hex)
        },
        onSubmit: function(hsb, hex, rgb, el) {
          $(".color_picker_list").append("<button type='submit' name='highlight[color]' class='color' id='highlight_" + hex +"' value='"+ hex +"' style='display: none; background-color: #'" + hex + "'></button>");
          $("#highlight_" + hex).click();
          $("#highlight_" + hex).css('background-color', '#' + hex);
          $(el).ColorPickerHide();
        }
      });
      $(window).resize(function() {
          $('.colorpicker').hide();
      });
      $(".remove_color").click(function(){
        color.empty('span');
      });
      },
      // YV.init.parallel_notesnotes
      parallel_notes: function() {
        $('.alternate_select').on('change', function(){
          if($(this).val() == "publish_on"){
            $('.secret').fadeIn();
            $('#publish_time').addClass('publish_on_selected');
          } else{
            $('.secret').hide();
            $('#publish_time').removeClass('publish_on_selected');
          }
        });
        $("#note_content").wysiwyg({
            css: '/assets/wysiwyg/editor.css',
            initialContent: "",
            controls: {
              justifyLeft: { visible: false },
              justifyCenter: { visible: false },
              justifyRight: { visible: false },
              justifyFull: { visible: false },
              indent: { visible: false },
              outdent: { visible: false },
              subscript: { visible: false },
              superscript: { visible: false },
              undo: { visible: false },
              redo: { visible: false },
              insertHorizontalRule: { visible: false },
              h1: { visible: false },
              h2: { visible: false },
              h3: { visible: false },
              insertTable: { visible: false },
              code: { visible: false }
            },
            plugins: {
	          i18n: { lang: getCookie('locale').toLowerCase() }
            }
          });
      },
      // YV.init.reference_tokens
      reference_tokens: function() {
        $('#add_reference_token > a').click(function(){
          $('#add_reference_token input').show();
        })
        $('.reference_tokens li').click(function(){
          $(this).remove();
        })
      },
      // YV.init.highlight_references
      highlight_references: function() {

        function is_dark(hex_color) {
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
              //return "FFFFFF";
              return true;
          } else if ((brightnessDifference >= brightnessThreshold) || (colorDifference >= colorThreshold)){
              //TODO test black here and go with the best option
              //return "FFFFFF";
              return true;
          }

          // go with black
          //return "000000";
          return false;
        }

        $("#version_primary, #version_secondary").each(function() {
          var chapter = $(this).find('.chapter');
          var version_id = $(this).find('.version').data('vid');
          var verse = null;
          var flag = 'highlighted';

          if(!chapter.length || !version_id){return;}

          $.ajax({
            url: "/bible/" + version_id + "/" + chapter.data("usfm") + "/highlights",
            method: "get",
            dataType: "json",
            success: function(highlights) {
              //reset any old highlights in the current chapter
              chapter.find('.verse.' + flag).css("background-color", 'transparent');
              chapter.find('.verse.' + flag).removeClass(flag);

              //apply the new highlights
              $.each(highlights, function(i, highlight) {
                  verse = chapter.find(".verse.v" + highlight.verse);
                  verse.css("background-color", "#" + highlight.color);

                  verse.addClass(flag);
                  if (is_dark(highlight.color)) {
                    verse.addClass("dark_bg");
                  }

                  //add the highlight ids (so if user clears they can clear them all)
                  highlight_ids = verse.attr('data-highlight-ids');
                  if (highlight_ids){
                    highlight_ids = highlight_ids.split(',');
                  }else{highlight_ids = [];}
                  highlight_ids.push(highlight.id);
                  verse.attr('data-highlight-ids', highlight_ids.join(','));
              });//end highlights each
            },//end success function
            error: function(req, status, err) {
              //console.log(status + err);
            }//end error function
          });//end ajax delegate
        });//end primary/secondary each


      },
      // YV.init.audio_player
      audio_player: function() {
        var audio = $('#audio_player');

        if (!audio.length) {
          return;
        }

        var audio_menu = $('#menu_audio_player').show();

        audio.mediaelementplayer({
          features: ['playpause', 'current', 'progress', 'duration'],
          audioWidth: '100%'
        });

        audio_menu.hide();
      },
      // YV.init.language
      language: function() {
        $("#choose_language").change(function() {
          window.location = $(this).val();
        });
      },
      // YV.init.recent_version
      version_links: function() {
       $("#menu_version").find('a').click(function() {
          var version_id = $(this).closest('tr').data("version");
          var abbrev = $(this).closest('tr').data("abbrev");
          var menu = $(this).closest(".dynamic_menu.version_select");
          var path_verses = $("article").data("selected-verses-path-partial");
          var path_chapter = $('article .chapter').data('usfm');
          var link_base = '/bible/' + version_id + '/' + path_chapter;

          if (path_verses) link_base = link_base + path_verses;
          link_base = link_base + "." + abbrev;

          //TODO: erase this hack with new reading plans design (in-reader
          var plan_url = menu.data("plan-url");
          if (plan_url) link_base = plan_url;

          if (version_id){
            var recent = getCookie('recent_versions');
            if (recent == null){
              recent = [];
            }else {   //extra caution here because of IE bug with .indexOf on empty array
              //buble up the version just picked if it was already in list
              recent = recent.split('/');
              var exists = recent.indexOf(String(version_id));
              if(exists != -1) recent.splice(exists, 1);
            }

            recent.unshift(version_id);
            recent_str = recent.splice(0,5).join('/');
            setCookie('recent_versions', recent_str);
            console.log(menu.data("link-needs-param"));
            console.log(menu.data("link-needs-param").length);
            if (menu.data("link-needs-param")){
              var delim = (link_base.indexOf("?") != -1) ? "&" : "?";
              window.location = link_base + delim + "version=" + version_id;
            }else{
              window.location = link_base;
            }
          }
        });
      },
      // YV.init.fullscreen
      fullscreen: function() {
        if ($("article").data("fullscreen") == "1") {
          HTML.addClass("full_screen");
        }
      },
      // YV.init.bookmarks
      bookmarks: function() {
        $('.li_bookmark').hover(
          function(){
            $(this).find('.bookmark_edit').animate({opacity: 1});
          },
          function(){
            $(this).find('.bookmark_edit').animate({opacity: 0});
          }
        );
      },
      nav_labels: function() {
        $("#nav_primary ul li").hover(function(){
          $(this).find(".tooltip").fadeIn(100);
        }, function() {
          $(this).find(".tooltip").fadeOut(100);
        });
      },
      translation_notes: function() {
        $('.verse .note .body').wrap('<div class="outer_container"></div>');
        $('.verse .note .body').wrap('<div class="inner_container"></div>')
        $('.note .label').hoverIntent(function(){
          $(this).next('.outer_container').animate({opacity: 1}, "200");
        }, function(){
          $(this).next('.outer_container').delay(350).animate({opacity: 0}, "200");
        })
      },
      fancy_nav: function()
        {
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
              }, {
              offset: '100%'  // middle of the page
            });
            }}
            else {
              $('.nav_prev, .nav_next').height(main_reader_height);
            }
          }
      },
      // YV.init.in_place_confirm
      in_place_confirm: function() {
        $('.confirm').click(function(ev){
          el = $(this);
          if(el.hasClass('confirm')){
            ev.preventDefault();
            ev.stopPropagation();
            $(this).removeClass('confirm');
            $(this).addClass('danger');

            if(el.val()){
              //button
              el.val(el.data('confirm-text') ? el.data('confirm-text') : (el.val() + '?'));
            }else{
              //link
              el = el.find("a");
              el.html(el.data('confirm-text') ? el.data('confirm-text') : (el.html() + '?'));
            }
          }
        });
      }
   }
  };
})(jQuery, this, this.document);

// Fire it off!
jQuery(document).ready(function() {
  YV.go();
});
jQuery(window).load(function() {
  YV.load();
});
