// Class to manage mobile menus in reader header.

function MobileMenus() {
  this.windowH            = $(window).height();
  this.settingsToolbar    = $('#menu_settings');
  this.settingsH          = this.settingsToolbar.height();
  this.settingsBtn        = $('.settings_btn');
  this.shareToolbar       = $('.share_toolbar');
  this.shareBtn           = $('.share_btn')
  this.verseToolbar       = $('.verse_toolbar');
  this.verse              = $('.verse');
  this.audioToolbar       = $('.audio_toolbar');
  this.bookChapterTrigger = $('#page_title a');
  this.referenceToolbar   = $('#menu_book_chapter');
  this.versionMenu        = $('#menu_version');
  this.documentH          = $(document).height();
  this.referenceH         = $('.reference_toolbar').height();
  this.colorMenu          = $('.color_toolbar');
  this.openFlag           = "open";

  this.init();
  this.initReferenceMenu();
  this.initBookChapterMenu();
  this.initVersionMenu();
  this.initSettingsMenu();
  this.initAudioMenu();
}

MobileMenus.prototype = {

  constructor : MobileMenus,

  init : function() {
    var thiss = this;

    // make refToolbar the height of the document
    this.referenceH = this.referenceToolbar.css({'height':this.documentH});

    // Toggle Functionality for all overlays
    this.settingsToolbar.css({'top' : -(this.settingsH)});

    // Close menus tab trigger
    $('.menu_close').click($.proxy(function(e) {
      e.preventDefault();

      if(thiss.settingsBtn.hasClass('selected')){
          thiss.settingsToolbar.stop().animate({ top : -(this.settingsH)}, 200, function(){
              // verse toolbar animation complete, show nav_items
              $('.nav_items').stop().animate({ top : '0px'}, 200);
              thiss.settingsBtn.removeClass('selected');
          });
      }

      // check to see if share_toolbar is visible, if it is hide it
      else if(thiss.shareBtn.hasClass('selected')){
          thiss.shareToolbar.stop().animate({ top : '-46px'}, 200, function(){
              // share toolbar animation complete
              thiss.verseToolbar.stop().animate({ top : '-86px'}, 200, function(){
                  // verse toolbar animation complete, show nav_items
                  $('.nav_items').stop().animate({ top : '0px'}, 200);
              });
              thiss.verseToolbar.removeClass('open');
              thiss.shareToolbar.removeClass('open');
              thiss.verse.removeClass('selected');
              thiss.shareBtn.removeClass('selected');
          });
      }
      // otherwise hide the verse_toolbar and show nav_items menu

      else {
          thiss.shareToolbar.hide();
          thiss.verseToolbar.stop().animate({ top : '-86px'}, 200, function(){
              // verse toolbar animation complete, show nav_items
              $('.nav_items').stop().animate({ top : '0px'}, 200);
              thiss.verse.removeClass('selected');
              thiss.verseToolbar.removeClass('open');
              thiss.shareBtn.removeClass('selected');
          });
      }
    },this));

  },

  initReferenceMenu : function(){
    var thiss = this;

    // Reference createBookmark
    $('.mobile .verse_toolbar .bookmark_btn').click(function () {
      var form = $('#menu_bookmark #bookmark-pane form');
      form.attr('action', $(this).attr('data-action'));
      form.attr('method', $(this).attr('data-method'));
      form.find('*[type="submit"]').click();
    });

    // createHighlight
    $('.mobile .verse_toolbar .highlight_btn').click(function () {
      thiss.openColorMenu();
    });

    // createNote
    $('.mobile .verse_toolbar .note_btn').click(function () {
      var form = $('form#new_note');
      form.attr('action', $(this).attr('data-action'));
      form.attr('method', $(this).attr('data-method'));
      form.submit();
    });

    // createShare
    $('.mobile .verse_toolbar .share_btn').click(function () {
      var form = $('#menu_bookmark #share-pane form');
      form.attr('action', $(this).attr('data-action'));
      form.attr('method', $(this).attr('data-method'));
      form.submit();
    });
  },

  initBookChapterMenu : function(){
    var thiss = this;

    // Book/Chapter menu trigger
    this.bookChapterTrigger.click(function(e){
      e.preventDefault();
      thiss.openBookChapterMenu();
    });

    // Book/Menu close trigger
    $('.reference_close_btn').click(function(e){
        e.preventDefault();

        $(this).parents('#menu_book_chapter').fadeOut('fast').removeClass('open');
        thiss.bookChapterTrigger.toggleClass('selected');
    });
  },

  initVersionMenu : function(){
    var thiss = this;
    // Version menu trigger
    $('.version_btn').click(function(e){
        e.preventDefault();

        thiss.versionMenu.css({'z-index':'1000'}).fadeIn('fast').addClass('open');
    });

    // Version menu close trigger
    $('.version_close_btn').click(function(e){
        e.preventDefault();

        thiss.versionMenu.fadeOut('fast').removeClass('open');
        $('.version_close_btn').toggleClass('selected');
    });
  },

  initSettingsMenu : function(){
    var thiss = this;

    // Settings menu trigger
    $('.settings_btn').click(function(e){
      e.preventDefault();
      $(this).toggleClass('selected');

      thiss.closeShareMenu();
      thiss.closeAudioMenu();
      thiss.closeVerseMenu();

      if($(this).hasClass('selected')){
          $('.nav_items').animate({ 'top' : '-46px'}, 200, function(){
          // nav_items animation complete, show verse toolbar
              thiss.settingsToolbar.show().stop().animate({ 'top' : '46px'}, 200).addClass('open');
          });
      } else {
          thiss.settingsToolbar.stop().animate({ 'top' : -(thiss.settingsH)}, 200, function(){
              // settings toolbar animation complete, show nav_items
              thiss.settingsToolbar.hide().removeClass('open');
              $('.settings_btn').removeClass('selected');
              $('.nav_items').stop().animate({ 'top' : '0px'}, 200);
          });
      }

    });

    // Settings menu close trigger
    $('.settings_close_btn').click(function(e){
        e.preventDefault();
        var $this = $(this);
        thiss.settingsH = $('.settings_toolbar').height();

        $this.parents('.settings_toolbar').stop().animate({ top : -(thiss.settingsH)}, 400, function(){
            $this.parents('.settings_toolbar').siblings('.nav_items').stop().animate({ top : '0px'}, 400).addClass('open');
        }).removeClass('open');
        $('.settings_btn').toggleClass('selected');

    });
  },

  initAudioMenu : function(){
    // Audio menu trigger
    $('.audio_btn').click(function(e){
        e.preventDefault();
        var $this = $(this);

        if(!$this.hasClass('disabled')){
          $this.toggleClass('selected');
          if($this.hasClass('selected')){
              $this.parents('.nav_items').stop().animate({ top : '-46px'}, 400, function(){
                  $this.parents('.nav_items').siblings('.audio_toolbar').stop().animate({ top : '0px'}, 400).addClass('open');
              }).removeClass('open');
          }
        } else {
            $this.parents('.nav_items').siblings('.audio_toolbar').stop().animate({ top : '-175px'}, 400, function(){
                $this.parents('.nav_items').stop().animate({ top : '0px'}, 400).addClass('open');
            }).removeClass('open');

        }
    });

    // Audio menu close trigger
    $('.audio_close_btn').click(function(e){
        e.preventDefault();
        var $this = $(this);

        $this.parents('.audio_toolbar').stop().animate({ top : '-190px'}, 400, function(){
            $this.parents('.audio_toolbar').siblings('.nav_items').stop().animate({ top : '0px'}, 400).addClass('open');
        }).removeClass('open');
        $('.audio_btn').toggleClass('selected');
    });
  },

  closeAudioMenu : function(){
    if(this.audioToolbar.hasClass('open')){
      var thiss = this;
      this.audioToolbar.stop().animate({ top : '-190px'}, 300, function(){
        // audio toolbar animation complete, show nav_items
        thiss.audioToolbar.removeClass('open');
        $('.audio_btn').toggleClass('selected');
        thiss.settingsToolbar.show().stop().animate({ 'top' : '0px'}, 200).addClass('open');
      });
    }
  },

  openBookChapterMenu : function(){
    this.bookChapterTrigger.toggleClass('selected');

    this.closeShareMenu();
    this.closeSettingsMenu();
    this.closeAudioMenu();
    this.closeVerseMenu();

    this.referenceToolbar.fadeIn('fast').addClass('open');
  },

  openColorMenu : function(){
    //TODO: build closeMenus function that closes any menus flagged as open.
    this.closeVerseMenu();
    this.closeAudioMenu();

    this.colorMenu.addClass(this.openFlag);
    this.colorMenu.show();
  },

  closeColorMenu : function(){
    this.colorMenu.removeClass(this.openFlag);
    this.colorMenu.hide();
  },

  closeShareMenu : function(){
    var thiss = this;
    if(this.shareToolbar.hasClass('open')){
      this.shareToolbar.stop().animate({ top : '-46px'}, 300, function(){
        // share toolbar animation complete
        this.shareToolbar.removeClass('open');
        $('.share_btn').toggleClass('selected');
        this.verseToolbar.stop().animate({ top : '-86px'}, 300, function(){
            // verse toolbar animation complete, show nav_items
            thiss.verseToolbar.removeClass('open');
            $('.verse').toggleClass('selected');
            thiss.referenceToolbar.show().stop().animate({ 'top' : '0px'}, 200).addClass('open');
        });

      });
    }
  },

  closeVerseMenu : function(){
    if(this.verseToolbar.hasClass('open')){
      this.shareToolbar.hide();
      var thiss = this;
      this.verseToolbar.stop().animate({ top : '-86px'}, 300, function(){
          // verse toolbar animation complete, show nav_items
          thiss.verseToolbar.removeClass('open');
          thiss.settingsToolbar.show().stop().animate({ 'top' : '0px'}, 200).addClass('open');
      });
    }
  },

  closeSettingsMenu : function(){
    var thiss = this;
    if(this.settingsToolbar.hasClass('open')){
      this.settingsToolbar.stop().animate({ top : -(thiss.settingsH)}, 300, function(){
        // settings toolbar animation complete
        thiss.settingsToolbar.removeClass('open').hide();
        $('.settings_btn').toggleClass('selected');
        thiss.referenceToolbar.show().stop().animate({ 'top' : '0px'}, 200).addClass('open');
      });
    }
  }

}
