// Page class.  This is the main class that is run when the page loads.
// This class sets up the entire page javascript functionality and interactivity.
// Long term we should refactor, subclass this page, and dynamicaly load page class at page load time.

// KM: add string.trim() for IE
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
}

// KM: add array.indexOf() for IE
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

// call jRespond and add breakpoints
var jRes = jRespond([

    {
        label: 'mobile',
        enter: 0,
        exit: 770
    },{
        label: 'widescreen',
        enter: 771,
        exit: 10000
    }
]);

function Page() {
  this.selected_menu  = undefined;
  this.menus          = new Array();
  this.current_menu   = null;
  this.html_el        = $(document.documentElement);

  //page interactive elements
  this.new_note_widget = undefined;
  this.reader = undefined;


  this.initConstants();
  this.initHTML();
  this.initNav();
  this.initInputs();
  this.initMenus();
  this.initEditControls();
  this.initAjaxReplace();
  this.initFlash();
  this.initAutoFocus();
  this.initRadiosAndChecks();
  this.initProgressBars();
  this.initInplaceConfirms();
}

Page.prototype = {
  constructor : Page,

  initConstants : function() {
    // Internet Explorer detection.
    this.BROWSER = $.browser;
    this.VERSION = parseInt(this.BROWSER.version, 10);
    this.IE = this.BROWSER.msie;
    this.IE7 = !!(this.IE && this.VERSION === 7);
    this.IE8 = !!(this.IE && this.VERSION === 8);
    this.IE9 = !!(this.IE && this.VERSION === 9);
    this.MODERN_BROWSER = !((this.IE && this.VERSION < 9) || this.BROWSER.opera);

  },

  // Ability to set the reader on the page publicly.
  setReader : function( rdr ) {
    this.reader = rdr;
    $(this.reader).on("verses:parsed", $.proxy(this.onVersesParsed, this) );
  },

  onVersesParsed : function() {
    var note_widget = this.new_note_widget;
    var reader      = this.reader;

    if(reader && note_widget) {
      var selected_data = reader.getSelectedData();
      var usfms = selected_data.verse_usfms;
          note_widget.updateForm({references: usfms});
    }
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

    // responsive links
    jRes.addFunc({
      breakpoint: 'mobile',
      enter: function() {
        $("html").addClass("mobile-client");
        // make data-mobile-href elements hrefs
        var $this = null;
        $('a[data-mobile-href]').each(function() {
          $this = $(this);
          $this.attr('data-original-href', $this.attr('href'));
          $this.attr('href', $this.attr('data-mobile-href'));
        });
      },
      exit: function() {
        $("html").removeClass("mobile-client");
        // set mobile links back
        var $this = null;
        $('a[data-original-href]').each(function() {
          $this = $(this);
          $this.attr('href', $this.attr('data-original-href'));
          $this.removeAttr('data-original-href');
        });
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
  initEditControls : function() {

    $('.resource_list .bookmark, .resource_list .note').hover(
      function(){
        $(this).find('.edit_controls .hidden').animate({opacity: 1});
      },
      function(){
        $(this).find('.edit_controls .hidden').animate({opacity: 0});
      }
    );

    jRes.addFunc({
      breakpoint: 'mobile',
      enter: function() {
        // bind mobile menu events, giving their handler's the Selected context via $.proxy
        $('.resource_list .bookmark, .resource_list .note').unbind('mouseenter mouseleave');
        $('.edit_controls .hidden').css("opacity","1.0");
      },
      exit: function() {
        $('.edit_controls .hidden').css("opacity","0");
        // unbind mobile menu events, giving their handler's the Selected context via $.proxy
        $('.resource_list .bookmark, .resource_list .note').hover(
          function(){
            $(this).find('.edit_controls .hidden').animate({opacity: 1});
          },
          function(){
            $(this).find('.edit_controls .hidden').animate({opacity: 0});
          }
        );
      }
    });
  },


  initNav : function() {

    // Primary navigation tooltips
    $("#nav_primary ul li").hover(function(){
        $(this).find(".tooltip").fadeIn(100);
      }, function() {
        $(this).find(".tooltip").fadeOut(100);
    });

    // Slide to mobile nav
    $('#slideToNav').click(function(){
      $(window).scrollTop($('#nav_mobile').offset().top);
    });

    // Hide address bar on smartphones, unless there is smart banner
    //if ($('head meta[name="apple-itunes-app"]').length == 0){
      //window.addEventListener("load",function() {
        //setTimeout(function(){
          //// console.log('Hide the address bar!');
          //window.scrollTo(0, 1);
      //}, 0);
      //});
    //}

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
    var menu_to_show;
    $(this.menus).each(function() {
      if(this == except) { menu_to_show = this; }
      this.hide();
    });

    if(except != null) {menu_to_show.show();}

    this.current_menu = except;

    // Remove all handlers created on menu:click
    $(document).off("mousedown", this.onDocumentMouseDown);
    $(document).off("keydown", this.onDocKeydown);
    $(window).off("resize", this.onWindowResized);
  },




  initMenus : function() {


    // only create menu / widget if element id is found on the page.
    // should eventually be in a subclass of Page for each individual page type.

      var modal_el = "#modal_single_verse";
      if($(modal_el).length) {
        var single_verse_modal = new VerseModal();
      }

      var widget_note = "#widget_new_note";
      if($(widget_note).length) {
        this.new_note_widget = new NoteWidget( widget_note );
      }

      var settings_trigger  = "#menu_settings_trigger";
      var settings_menu     = "#menu_settings";
      if($(settings_trigger).length && $(settings_menu).length) {
        var settings_menu   = new SettingsMenu({trigger: settings_trigger , menu: settings_menu });
      }

      if($('#version_primary').length) {
        var mobile_menus   = new MobileMenus();
      }

      var version_triggers  = "#menu_version_trigger, #menu_alt_version_trigger";
      var version_menu     = "#menu_version";
      if($(version_triggers).length && $(version_menu).length) {
        var version_menu    = new VersionMenu({triggers: version_triggers , menu: version_menu});
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

      var share_form = "article > form.share";
      if($(share_form).length){
        var share_form = new SharePane(share_form);
        share_form.initForm();
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
    var divs = $("#flash_error, #flash_notice");
    divs.click(function() {
      $(this).slideUp(200);
    });
    window.setTimeout(function() {
      divs.slideUp(200);
    }, 5000);
  },

  initAjaxReplace : function() {

    $(".ajax_me").each(function() {
      var that = $(this);
      var targets = that;
      if (that.attr('data-dup')){ targets = targets.add(that.attr('data-dup')); }
      $.ajax({
        url: that.data('ajax'),
        method: "get",
        dataType: "html",

        success: function(data) {
          targets.fadeOut(200, function() {
            targets.html(data);
            targets.fadeIn(200);
          });
        }

      });
    });
  }

}
