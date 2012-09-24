// Page class.  This is the main class that is run when the page loads.
// This class sets up the entire page javascript functionality and interactivity.

function Page() {

  this.selected_menu = undefined;
  this.menus = new Array();

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
    this.hideMenus( clicked );
  },

  hideMenus : function( except ) {
    var thiss = this;
    $(this.menus).each(function() {
      if(this == except) { except.show(); }
      else               { this.hide(); }
    });
  },

  initMenus : function() {


    var note_widget     = new NoteWidget("#widget_new_note");
    var settings_menu   = new SettingsMenu({trigger: "#menu_settings_trigger" , menu: "#menu_settings" })
    var version_menu    = new VersionMenu({trigger: "#menu_version_trigger" , menu: "#menu_version"});
    var language_menu   = new LanguageMenu("#choose_language");
    var profile_menu    = new ProfileMenu({trigger: "#header_profile_trigger" , menu: "#header_profile_menu" });

    var thiss = this;
    var all_menu_triggers = $('.dynamic_menu_trigger');
        all_menu_triggers.each( function(index) {
          var m = new PopupMenu({trigger: this});
          thiss.menus.push(m);
          $(m).bind("menu:click", function(e) {
            thiss.menuClick(e.target);
          });
        });

        $(window).resize(function() {
          thiss.hideMenus(true);
        });

        $(document).mousedown(function(ev) {
          var el = $(ev.target);
          if (el.hasClass('close') || (!el.closest('.dynamic_menu_trigger').length && !el.closest('.colorpicker').length && !el.closest('.dynamic_menu').length)) {
            thiss.hideMenus(true);
          }
        }).keydown(function(ev) {
          if (ev.keyCode === 27) { thiss.hideMenus(true); }
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
  }
}