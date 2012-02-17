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

ZeroClipboard.setMoviePath('/javascripts/ZeroClipboard.swf');
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
        if (verses) {
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
            $("span." + book + "_" + chapter + "_" + verses[i]).addClass("selected");
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

        $(".alt_version_link").click(function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          setCookie('alt_version', $(this).data('version'));
          window.location.href = window.location.href;
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
                  console.log('clip glued to copy_link_container');
                  }
                }
              }).siblings('dd').slideUp();
          }
          
          this.blur();
          return false;
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
          $(".spinner_wrapper").fadeIn(200);
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

            menu.css({
              left: left
            }).show();
          }
          else {
            hide_all_menus();
          }

          el.blur();
        });

        $('#menu_book').delegate('a', 'click', function() {
          var el = $(this);
          var ol = el.closest('.dynamic_menu').find('ol:first');
          var chapters = parseInt(el.data('chapters'), 10) + 1;
          var book = el.data('book');
          var version = el.data('version');
          var li = el.closest('li');
          var list = '';

          for (var i = 1; i < chapters; i++) {
            list += '<li><a href="/bible/' + book + '.' + i + '.' + version + '">' + i + '</a></li>';
          }

          li.addClass(li_class).siblings().removeClass(li_class);
          ol.html(list);

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
        var verse = $('#version_primary .verse');

        if (!verse.length) {
          return;
        }

        var clear_verses = $('#clear_selected_verses');
        var li = $('#li_selected_verses');
        var share_menu = $('#menu_bookmark');
        var button = $('#verses_selected_button');
        var count = $('#verses_selected_count');
        var input = $('.verses_selected_input');
        var copy_button = $("#copy_link");
        var input_individual = $('.individual_verses_selected_input');
        var input_highlights_ids = $('.verses_selected_highlight_ids_input');
        var article = $('#main article:first');
        var book = article.attr('data-book');
        var book_human = article.attr('data-book-human');
        var book_api = article.attr('data-book-api');
        var chapter = article.attr('data-chapter');
        var version = article.attr('data-version');
        var highlights = $('#version_primary').data('highlights');
        var alt_highlights = $('#version_secondary').data('highlights');
        var flag = 'selected';
        var hide = 'hide';
        var verse_numbers = [];
        var verse_ranges = [];

        
        if (IE8){
          copy_button.hide();
        }
        
        clip.addEventListener('load', function(client) {
                console.log( "movie is loaded" );
        });
                                
        clip.addEventListener('complete', function(client, text) {
                console.log("Copied text to clipboard: " + text);
                var temp = copy_button.html();
                copy_button.html(copy_button.data('confirm-text'));
                setTimeout(function() {copy_button.html(temp);}, 2000);
         } );

         clip.addEventListener( 'mouseOver', function(client) {
                clip.setText(text_to_send);
                console.log(text_to_send + " sent to clip");
                //this is done in mouseOver due to ZeroClipboard bug
         } );
         
         //Zero clipboard adds and removes "hover" and "active" classes as you would expect

        function parse_verses() {
          var total = $('#version_primary .verse.' + flag).length;
          verse_numbers.length = 0;
          verse_ranges.length = 0;

          // Zero out value.
          input.val('');
          input_highlights_ids.val('');

          verse.each(function() {
            var el = $(this);
            var verse_number = parseInt(el.find('strong:first').html());
            var this_id = book + '.' + chapter + '.' + verse_number + '.' + version;

            if (el.hasClass(flag)) {
              verse_numbers.push(verse_number);
              if ($.trim(input.val()).length) {
                // Add to hidden input.
             //   input.val(input.val() + ',' + this_id);
                // Create reference token.
               // $(".reference_tokens").append("<li><a href='#'>" + book + "</a></li>");

              }
            }
          });

          // Create ranges
          if (verse_numbers.length > 0) {
            if (verse_numbers.length == 1) {
              verse_ranges.push(verse_numbers[0]);;
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
                  } else {
                    // it's just a single verse
                    verse_ranges.push(verse_numbers[i]);
                  }

                } else if (i == verse_numbers.length) {
                  if (in_range == true) {
                    verse_ranges.push(range_start + "-" + verse_numbers[i]);
                  } else {
                    verse_ranges.push(verse_numbers[i]);
                  }
                  exit = true;
                } else {
                  if (verse_numbers[i+1] == verse_numbers[i] + 1) {
                    // If we're in a range, don't do anything
                    // If not, start one
                    if (in_range == false) {
                      in_range = true;
                      range_start = verse_numbers[i];
                    }
                  } else {
                    // Stop a range if we're in it, add number if we're not
                    if (in_range == true) {
                      in_range = false;
                      verse_ranges.push(range_start + "-" + verse_numbers[i]);
                    } else {
                      verse_ranges.push(verse_numbers[i]);
                    }
                  }
                }
              }
            }
            //
            // Add reference info and create tokens

            var verse_refs = [];
            $(".reference_tokens").html("");
            $.each(verse_ranges, function(i,e) {
              verse_refs.push(book + "." + chapter + "." + e + "." + version);
              $(".reference_tokens").append("<li><a data-verses='" + e + "' href='#'>" + book_human + " " + chapter + ":" + e + "</a></li>");
            });

            // Populate the verse_numbers hidden input
            input.val(verse_refs.join(","));
            
            // Generate a short link
            var link = "http://bible.us/" + book + chapter + "." + verse_ranges.join(',') + "." + version;
            $("b#short_link").html(link);
            $(".share_message .character_count").remove();
            $(".share_message textarea").charCount({
              allowed: 140 - link.length - 1,
              css: "character_count"
            });
            
            // Populate the "link" input
            $("#copy_link_input").attr("value", link);
            text_to_send = link;
            console.log(text_to_send + " stored in global");

            // get highlight id_s of all selected verses that are highlighted
            var sel_hlt_ids = [];
            var hlt_verses = [];

            var hlt_selected = false;
            $.each(highlights, function(i,h){hlt_verses.push(h.verse)});
            
            var i_h;
            $.each(verse_numbers, function(i,v) {
              i_h = $.inArray(v, hlt_verses);
              if (i_h == -1) {
                sel_hlt_ids.push(-1);
              } else {
                sel_hlt_ids.push(highlights[i_h].id);
                hlt_selected = true;
              }
            });
            
            // Populate the selected verses and highlight ids hidden input
            input_highlights_ids.val(sel_hlt_ids.join(","));
            
            var sel_verses_osis = [];
            $.each(verse_numbers, function(i,e) {
              sel_verses_osis.push(book + "." + chapter + "." + e + "." + version);
            });
            input_individual.val(sel_verses_osis.join(","));
            
            if (hlt_selected) {
              $('#clear_highlights').removeClass('hide');
              $('#highlight_9').addClass('hide'); // hide the 10th icon if we're showing the clear
            } else {
              $('#clear_highlights').addClass('hide');
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
          var el = $(this);
          /*var verse_id = Ael.attr('class').replace('verse', '').replace('selected', '').replace(/\s+/, '');

          verse_id = $('.' + verse_id);
*/
          if (el.hasClass(flag)) {
            el.removeClass(flag);
          }
          else {
            el.addClass(flag);
          }

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

          font && article.attr('data-setting-font', font);
          size && article.attr('data-setting-size', size);
        });
      },
      // YV.init.parallel_notes
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
            css: '/javascripts/wysiwyg/editor.css',
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
        var highlights = $('#version_primary').data('highlights');
        var alt_highlights = $('#version_secondary').data('highlights');
        var book = $('article').data('book-api');
        var chapter = $('article').data('chapter');
        
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
        
        if (highlights && highlights.length) {
          for (var h = 0; h < highlights.length; h++) {
            var hi = highlights[h];
            if ((hi.verse) instanceof Array) {
              //#TODO: in theory this is unreachable code as highlights can't be multi-verse (enforced in highlights model)
              for (var hh = 0; hh < hi.verse.length; hh++) {
                $("#version_primary span." + book + "_" + chapter + "_" + hi.verse[hh]).css("background-color", "#" + hi.color);
                if (is_dark(hi.color)) {$("#version_primary span." + book + "_" + chapter + "_" + hi.verse[hh]).addClass("dark_highlight");}
              }
            } else {
              $("#version_primary span." + book + "_" + chapter + "_" + hi.verse).css("background-color", "#" + hi.color);
              if (is_dark(hi.color)) {$("#version_primary span." + book + "_" + chapter + "_" + hi.verse).addClass("dark_highlight");}
            }
          }
        }
        if (alt_highlights && alt_highlights.length) {
          for (var h = 0; h < alt_highlights.length; h++) {
            var hi = alt_highlights[h];
            if ((hi.verse) instanceof Array) {
              //#TODO: in theory this is unreachable code as highlights can't be multi-verse (enforced in highlights model)
              for (var hh = 0; hh < hi.verse.length; hh++) {
                $("#version_secondary span." + book + "_" + chapter + "_" + hi.verse[hh]).css("background-color", "#" + hi.color);
                if (is_dark(hi.color)) {$("#version_secondary span." + book + "_" + chapter + "_" + hi.verse[hh]).addClass("dark_highlight");}
              }
            } else {
              $("#version_secondary span." + book + "_" + chapter + "_" + hi.verse).css("background-color", "#" + hi.color);
              if (is_dark(hi.color)) {$("#version_secondary span." + book + "_" + chapter + "_" + hi.verse).addClass("dark_highlight");}
            }
          }
        }
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
          document.location.href = $(this).val();
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
