// Page class.  This is the main class that is run when the page loads.
// This class sets up the entire page javascript functionality and interactivity.
// Long term we should refactor, subclass this page, and dynamicaly load page class at page load time.

function Page() {
  this.selected_menu  = undefined;
  this.menus          = new Array();
  this.current_menu   = null;
  this.html_el        = $(document.documentElement);

  this.initConstants();
  this.initHTML();
  this.initNav();
  this.initInputs();
  this.initMenus();
  this.initBookmarkEdits();
  this.initAjaxReplace();
  this.initFlash();
  this.initAutoFocus();
  this.initRadiosAndChecks();
  this.initProgressBars();
  this.initInplaceConfirms();
  this.fixWidgetLast();
  this.fixWidgetHeader();
}

Page.prototype = {
  constructor : Page,

  initConstants : function() {
    // Internet Explorer detection.
    this.BROWSER = $.browser;
    this.VERSION = parseInt(this.BROWSER.version, 10);
    this.IE = this.BROWSER.msie;
    this.IE7 = !!(this.IE && VERSION === 7);
    this.IE8 = !!(this.IE && VERSION === 8);
    this.IE9 = !!(this.IE && VERSION === 9);

  },

  // Setup miscellaneous html needs.
  initHTML : function() {

    // Last child classes
    if (this.IE7 || this.IE8) {
      $('li, tr, td, th, dd, span, tbody').filter(':last-child').addClass('last-child');
    }

    // Tables
    var table = $('table');
    if ((this.IE7 && table.length) || table.length) {
      table.attr('cellspacing', '0');
    }

    // External links are _blank'd
    $("a").each(function(i) {
      var link = $(this);
      if (link.attr("href") && link.attr("href").substr(0,7) == "http://") {
        link.attr("target", "_blank");
      }
    });
  },

  initInputs : function() {

    var input = $('input[type="radio"], input[type="checkbox"]');

    if (this.IE7 || !input.length) { return; }

    function determine_checked() {
      input.each(function() {
        var el    = $(this);
        var label = el.closest("label");

        (this.checked)  ? label.addClass('is_checked') : label.removeClass('is_checked');
        (this.disabled) ? label.addClass('is_disabled') : label.removeClass('is_disabled');
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

  initInplaceConfirms : function() {
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
  },

  // On user/bookmarks page.  Fades in edit controls.
  initBookmarkEdits : function() {

    $('.li_bookmark').hover(
      function(){
        $(this).find('.bookmark_edit').animate({opacity: 1});
      },
      function(){
        $(this).find('.bookmark_edit').animate({opacity: 0});
      }
    );
  },


  initNav : function() {

    // Primary navigation tooltips
    $("#nav_primary ul li").hover(function(){
        $(this).find(".tooltip").fadeIn(100);
      }, function() {
        $(this).find(".tooltip").fadeOut(100);
    });

  },

  menuClick : function( clicked ) {
    // if menu clicked is already selected, hide all menus and set to null.
    if(this.current_menu == clicked) {
      this.hideMenus(null);
    } else {
      this.hideMenus( clicked );
    }
  },

  hideMenus : function( except ) {
    var thiss = this;
    $(this.menus).each(function() {
      if(this == except) { except.show(); }
      else               { this.hide(); }
    });

    this.current_menu = except;

    // Remove all handlers created on menu:click
    $(document).off("mousedown", this.onDocumentMouseDown);
    $(document).off("keydown", this.onDocKeydown);
    $(window).off("resize", this.onWindowResized);
  },

  initMenus : function() {


    // only create menu / widget if element id is found on the page.
    // should eventually be in a subclass of Page for each individual page type.

      var widget_note = "#widget_note";
      if($(widget_note).length) {
        var note_widget     = new NoteWidget( widget_note );
      }

      var settings_trigger  = "#menu_settings_trigger";
      var settings_menu     = "#menu_settings";
      if($(settings_trigger).length && $(settings_menu).length) {
        var settings_menu   = new SettingsMenu({trigger: settings_trigger , menu: settings_menu })
      }

      var version_trigger  = "#menu_version_trigger";
      var version_menu     = "#menu_version";
      if($(version_trigger).length && $(version_menu).length) {
        var version_menu    = new VersionMenu({trigger: version_trigger , menu: version_menu});
      }

      var alt_version_trigger  = "#menu_alt_version_trigger";
      var alt_version_menu     = "#menu_alt_version";
      if($(alt_version_trigger).length && $(alt_version_menu).length) {
        var alt_menu    = new VersionMenu({trigger: alt_version_trigger , menu: alt_version_menu, alt_version: true});
      }

      var pro_trigger  = "#header_profile_trigger";
      var pro_menu     = "#header_profile_menu";
      if($(pro_trigger).length && $(pro_menu).length) {
        var profile_menu    = new ProfileMenu({trigger: pro_trigger , menu: pro_menu });
      }

      var choose_language  = "#choose_language";
      if($(choose_language).length) {
        var language_menu   = new LanguageMenu("#choose_language");
      }


    var thiss = this;
    var all_menu_triggers = $('.dynamic_menu_trigger');
        all_menu_triggers.each( function(index) {
          var m = new PopupMenu({trigger: this});
          thiss.menus.push(m);
          $(m).bind("menu:click", function(e) {
            thiss.menuClick(e.target);
            // Add handlers only after click
            $(window).on("resize", $.proxy(thiss.onWindowResized,thiss));
            $(document).on("mousedown", $.proxy(thiss.onDocMousedown, thiss));
            $(document).on("keydown", $.proxy(thiss.onDocKeydown, thiss));
            // ------------------------------------------------------------------------
          });
        });

    var all_menus = $('.dynamic_menu');
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

        all_menus.find('[data-spinner-trigger="true"]').click(function(e){
          this.blur();
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
  },

  onDocKeydown : function(e) {
    if (e.keyCode === 27) { this.hideMenus(null); }
  },

  onWindowResized : function(e) {
    this.hideMenus(null);
  },

  onDocMousedown : function(e) {
    var el = $(e.target);
    if (el.hasClass('close') || (!el.closest('.dynamic_menu_trigger').length && !el.closest('.colorpicker').length && !el.closest('.dynamic_menu').length)) {
      this.hideMenus(null);
    }
  },

  initProgressBars : function() {

    var progress_bar = $('.progress_bar');


    if (!progress_bar.length) { return; }

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

      if (raw_width > 4) {
        el.delay(250).animate({
          width: width
        }, speed, function() { arrow.css({ visibility: 'visible' }); });
      }
      else {
        arrow.css({ left: '14px', visibility: 'visible' });
      }
    });

  },

  initAutoFocus : function() {
    $(".autofocus").focus();
  },

  initRadiosAndChecks : function() {
    var input = $('input[type="radio"], input[type="checkbox"]');
  },

  initFlash : function() {
    var divs = $(".flash_error, .flash_notice");
    divs.click(function() {
      $(this).slideUp(200);
    });
    window.setTimeout(function() {
      divs.slideUp(200);
    }, 5000);
  },


  initAjaxReplace : function() {

    var page = this;

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


  killWidgetSpacers: function() {
    // Kill spacers, if they exist already
    // because this function is called when
    // exiting "full screen" mode, so make
    // them up anew, to clean the slate.
    $('.widget_spacer').remove();
  },

  fixWidgetHeader : function() {

    // Used later.
    var timer;

    // Last sidebar widget is special, leave it alone.
    //var last_widget = $('#sidebar').find('.widget:last');


    function position_widgets() {
      // For IE. Really belongs in the window event listener,
      // but having it cleared here doesn't hurt anything.
      clearTimeout(timer);

      // have to retrieve headers on each call because widgets can be loaded dynamically
      // TODO: this may need to be optimized.  look into a fix/optimization for this.
      // It would be great if we could load just the content of the widget into the widget shell
      // rather than loading the entire widget markup shell + content.
      var header = $('.widget header');

      if (!header.length) { return; }

      // Insert spacers.
      header.each(function() {
        var el = $(this);
        var this_widget = el.closest('.widget');

        //if ((this_widget[0] === last_widget[0]) || this_widget.has(".widget_spacer").length) { return; }

        $('<div class="widget_spacer">&nbsp;</div>').insertBefore(el);
      });



      header.each(function() {
        var el = $(this);
        var this_widget = el.closest('.widget');

        //if (this_widget[0] === last_widget[0]) {
          // Don't do anything, we'll treat this differently
          // if it's within the very last sidebar widget.
        //  return;
        //}

        var TOP_OFFSET  = 82;
        var next_widget = this_widget.next('.widget');
        var window_top  = $(window).scrollTop() + TOP_OFFSET;
        var spacer      = el.siblings('.widget_spacer:first');
        var spacer_top  = spacer.offset().top;


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

    var thiss = this;
    // Kill off event listeners, re-create them.
    $(window).off('.widget_header').on('scroll.widget_header resize.widget_header load.widget_header', function() {
      // Irrelevant, if in "full screen" mode.
      if (thiss.html_el.hasClass('full_screen')) {
        return;
      }

      clearTimeout(timer);

      // Super-low timer, just so that we don't get caught
      // in a repetetive loop due to window scroll firing.
      timer = setTimeout(position_widgets, 1);
    });

  },

  fixWidgetLast : function() {
    // only targeting the new note widget for now.
    var el = $("#widget_new_note");//$('#sidebar > .widget:last-child');

    if (!el.length) { return; }

    var timer;
    var spacer = $('<div class="widget_spacer">&nbsp;</div>').insertBefore(el);
    var TOP_OFFSET = 82;

    function pin_widget() {
      // For IE. Really belongs in the window event listener,
      // but having it cleared here doesn't hurt anything.
      clearTimeout(timer);

      var spacer = el.prev('.widget_spacer');
      var spacer_top = spacer.offset().top;
      var window_top = $(window).scrollTop() + TOP_OFFSET;

      if (window_top >= spacer_top) { el.addClass('widget_last_fixed'); }
      else                          { el.removeClass('widget_last_fixed'); }
    }

    // Initial call.
    pin_widget();

    var thiss = this;

    $(window).off('.widget_last').on('scroll.widget_last resize.widget_last load.widget_last', function() {
      if (thiss.html_el.hasClass('full_screen')) {
        return;
      }

      clearTimeout(timer);

      // Super-low timer, just so that we don't get caught
      // in a repetetive loop due to window scroll firing.
      timer = setTimeout(pin_widget, 1);
    });
  },

}