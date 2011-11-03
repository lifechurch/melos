// Module pattern + Closure
var YV = (function($, window, document, undefined) {
  // Private constants.
  var KEY_ESC = 27;

  // Expose YV methods.
  return {
    // Run everything in YV.init
    go: function() {
      for (var i in YV.init) {
        YV.init[i]();
      }
    },
    // YV.init
    init: {
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

        if (!input.length) {
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
        }).unbind('click.faux_input').bind('click.faux_input', function() {
          determine_checked();
        }).unbind('focus.faux_input').bind('focus.faux_input', function() {
          $(this).closest('label').addClass('is_focused');
        }).unbind('blur.faux_input').bind('blur.faux_input', function() {
          $(this).closest('label').removeClass('is_focused');
        });

        // Run for first time.
        determine_checked();
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

        trigger.click(function() {
          var el = $(this);
          var menu = $(el.attr('href'));
          var li = el.closest('li');
          var span = el.find('span:first');
          var offset = span.offset();
          var left = offset.left + parseInt(span.css('border-left-width'), 10) - 8;
          var top = offset.top + el.outerHeight() + 7;

          if (menu.is(':hidden')) {
            hide_all_menus();

            li.addClass(li_class);

            menu.css({
              left: left,
              top: top
            }).show();
          }
          else {
            hide_all_menus();
          }

          this.blur();
          return false;
        });

        $('#menu_book a').live('click', function() {
          var el = $(this);
          var ol = el.closest('.dynamic_menu').find('ol:first');
          var chapters = parseInt(el.data('chapters'), 10) + 1;
          var book = el.data('book');
          var version = el.data('version');
          var li = el.closest('li');
          var list = '';

          for (var i = 1; i < chapters; i++) {
            list += '<li><a href="' + book + "." + i + "." + version + '">' + i + '</a></li>';
          }

          li.addClass(li_class).siblings().removeClass(li_class);
          ol.html(list);

          this.blur();
          return false;
        });

        $(document).mousedown(function(ev) {
          var el = $(ev.target);

          if (!el.closest('.dynamic_menu_trigger').length && !el.closest('.dynamic_menu').length) {
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
      }
    }
  };
})(this.jQuery, this, this.document);

// Fire it off!
YV.go();