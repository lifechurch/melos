// Class to manage mobile menus in reader header.

function MobileMenus() {
  this.windowH            = $(window).height();
  this.settingsToolbar    = $('#menu_settings');
  this.settingsH          = this.settingsToolbar.height();
  this.settingsBtn        = $('.reader_settings_btn');
  this.shareToolbar       = $('.share_toolbar');
  this.shareBtn           = $('.share_btn')
  this.verseToolbar       = $('.verse_toolbar');
  this.verse              = $('.verse');
  this.audioToolbar       = $('#menu_audio_player');
  this.bookChapterTrigger = $('#m_book_chap_btn');
  this.referenceToolbar   = $('#menu_book_chapter');
  this.referenceH         = this.referenceToolbar.height();
  this.subscriptionMenu   = $('#sidebar');
  this.versionMenu        = $('#menu_version');
  this.versionH           = this.versionMenu.height();
  this.documentH          = $(document).height();
  this.colorMenu          = $('.color_toolbar');
  this.navItems           = $('.reader-nav');
  this.openFlag           = "open";

  this.init();
  this.initReferenceMenu();
  this.initBookChapterMenu();
  this.initSubscriptionMenu();
  this.initVersionMenu();
  this.initSettingsMenu();
  this.initAudioMenu();
}

MobileMenus.prototype = {

  constructor : MobileMenus,

  isMobileClient : function() {
    return $('html').hasClass('mobile-client');
  },

  init : function() {
    var thiss = this;

    // make refToolbar the height of the document
    if(this.isMobileClient()) {
      this.referenceH = this.referenceToolbar.css({'height':this.documentH});
      this.versionH = this.versionMenu.css({'height':this.documentH});
      this.versionMenu.find('.scroll').css({'height':(this.windowH) - 50});
      this.referenceToolbar.find('.scroll').css({'height':(this.windowH) - 100});
    }

    // Toggle Functionality for all overlays
    //this.settingsToolbar.css({'top' : -(this.settingsH)});

    // TODO: Fix this hacky solution to the alignment issue on mobile header page titles
    if ($('.mobile #page_title').children().length == 0){
      $('.mobile #page_title').addClass('pad');
    }

    // Close menus tab trigger
    $('.menu_close').click($.proxy(function(e) {
      e.preventDefault();

      if(thiss.settingsBtn.hasClass('selected')){
          thiss.settingsToolbar.stop().animate({ top : -(this.settingsH)}, 400, function(){
              // verse toolbar animation complete, show nav_items
              thiss.navItems.stop().animate({ top : '0px'}, 400);
              thiss.settingsBtn.removeClass('selected');
          });
      }

      // check to see if share_toolbar is visible, if it is hide it
      else if(thiss.shareBtn.hasClass('selected')){
          thiss.shareToolbar.stop().animate({ top : '-46px'}, 400, function(){
              // share toolbar animation complete
              thiss.verseToolbar.stop().animate({ top : '-88px'}, 400, function(){
                  // verse toolbar animation complete, show nav_items
                  $('.reader-nav').stop().animate({ top : '0px'}, 400);
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
          thiss.verseToolbar.stop().animate({ top : '-88px'}, 400, function(){
              // verse toolbar animation complete, show nav_items
              thiss.navItems.stop().animate({ top : '0px'}, 200);
              thiss.verse.removeClass('selected');
              thiss.verseToolbar.removeClass('open');
              thiss.shareBtn.removeClass('selected');
          });
      }
    },this));

    // Audio menu close trigger
    $('.highlight_close_btn').click(function(e){
        e.preventDefault();
        var $this = $(this);

        thiss.colorMenu.stop().animate({ top : '-329px'}, 400, function(){
            thiss.navItems.stop().animate({ top : '0px'}, 400).addClass(thiss.openFlag);
        }).removeClass('open');
    });
  },

  initReferenceMenu : function(){
    var thiss = this;

    $('verse_close_btn').click(function(){
      this.closeVerseMenu();
    });

    // Reference createBookmark
    $('.mobile .verse_toolbar .bookmark_btn').click(function () {
      var form = $('#menu_verse_actions #bookmark-pane form');
      if (thiss.verseToolbar.hasClass('authed')){
        // if not authed, just submit form so we hit sign-up
        form.attr('action', $(this).attr('data-action'));
        form.attr('method', $(this).attr('data-method'));
      }
      form.find('*[type="submit"]').click();
    });

    // createHighlight
    $('.mobile .verse_toolbar .highlight_btn').click(function () {
      thiss.openColorMenu();
    });

    // createNote
    $('.mobile .verse_toolbar .note_btn').click(function () {
      var form = $('form#new_note');
      if (thiss.verseToolbar.hasClass('authed')){
        form.attr('action', $(this).attr('data-action'));
        form.attr('method', $(this).attr('data-method'));
      }
      form.submit();
    });

    // createShare
    $('.mobile .verse_toolbar .share_btn').click(function () {
      var form = $('#menu_verse_actions #share-pane form');
      if (thiss.verseToolbar.hasClass('authed')){
        form.attr('action', $(this).attr('data-action'));
        form.attr('method', $(this).attr('data-method'));
      }
      form.submit();
    });
  },

  initBookChapterMenu : function(){
    var thiss = this;

    // Book/Chapter menu trigger
    this.bookChapterTrigger.click(function(e){
      e.preventDefault();
      thiss.openBookChapterMenu();
      reader.book_chapter_menu.showBooks()
    });

    // Book/Menu close trigger
    $('.reference_close_btn').click(function(e){
        e.preventDefault();

        thiss.referenceToolbar.fadeOut('fast').removeClass('open');
        $(document).scrollTop(0);
        thiss.bookChapterTrigger.toggleClass('selected');
    });
  },

  initVersionMenu : function(){
    var thiss = this;

    // TODO: make this load on page.js with other menus, but
    // make sure to modify version.js to only ajax for widescreen!

    // Version menu trigger
    $('#m_version_btn').click(function(e){
        e.preventDefault();

        thiss.versionMenu.css({'z-index':'1000','left':0}).fadeIn('fast').addClass(this.openFlag);
    });
    // Version menu close trigger
    $(document).on('click', '.version_close_btn', function(e){
        e.preventDefault();
        thiss.versionMenu.fadeOut('fast').removeClass('open');
        $(document).scrollTop(0);
        $('.version_close_btn').toggleClass('selected').scrollTop(0);
    });
  },

  openSubscriptionMenu : function(){
    if(this.isMobileClient()) {
      this.subscriptionMenu.css({'z-index':'1000'}).fadeIn('fast').addClass('open');
      $(document).scrollTop(0);
    }
  },

  closeSubscriptionMenu : function(){
    var _this = this;
    this.subscriptionMenu.fadeOut('fast', function() {
      // remove the inline display style so CSS styles work for widescreen
      _this.subscriptionMenu.css('display', '');
      $(document).scrollTop(0);
    }).removeClass('open');
    $('.subscription_close_btn').toggleClass('selected');
  },

  initSubscriptionMenu : function(){
    var _this = this;

    // open subscription modal initially in some cases
    if(this.subscriptionMenu.find('.initial').length){
      this.openSubscriptionMenu();
    }

    // Version menu trigger
    $('#m_plan_btn').click(function(e){
        e.preventDefault();
        _this.openSubscriptionMenu();
    });

    // Version menu close trigger
    $('.subscription_close_btn, .active.content_target span').click(function(e){
        e.preventDefault();
        _this.subscriptionMenu.find('.initial').removeClass('initial');
        _this.closeSubscriptionMenu();
    });

    // Adjust our subscription menu / sidebar if we enter/exit mobile-client states
    // Possible on tablets at the moment.
    jRes.addFunc({
      breakpoint: 'mobile',
      enter: function() {
        if(_this.subscriptionMenu.find('.initial').length){
          _this.openSubscriptionMenu();
        }
      },
      exit: function() {
        _this.subscriptionMenu.css({'z-index':'0'}).removeClass('open');
      }
    });

  },

  initSettingsMenu : function(){
    var thiss = this;

    // Settings menu trigger
    this.settingsBtn.click(function(e){
      e.preventDefault();
      $(this).toggleClass('selected');

      thiss.closeShareMenu();
      thiss.closeAudioMenu();
      thiss.closeVerseMenu();

      if($(this).hasClass('selected')){
          thiss.navItems.animate({ 'top' : '-46px'}, 400, function(){
          // nav_items animation complete, show verse toolbar
              thiss.settingsToolbar.show().stop().animate({ 'top' : '0px'}, 400).addClass(this.openFlag);
          });
      } else {
          thiss.settingsToolbar.stop().animate({ 'top' : -(thiss.settingsH)}, 400, function(){
              // settings toolbar animation complete, show nav_items
              thiss.settingsToolbar.hide().removeClass('open');
              thiss.settingsBtn.removeClass('selected');
              thiss.navItems.stop().animate({ 'top' : '0px'}, 400);
          });
      }

    });

    // Settings menu close trigger
    $('.settings_close_btn').click(function(e){
        e.preventDefault();
        var $this = $(this);

        this.settingsToolbar.stop().animate({ top : -(thiss.settingsH)}, 400, function(){
            this.navItems.stop().animate({ top : '0px'}, 400).addClass(this.openFlag);
        }).removeClass('open');

        this.settingsBtn.toggleClass('selected');
    });
  },

  audioMenuHeight: 0,
  audioCloseAnimateHeight: function() {
    return MobileMenus.prototype.audioMenuHeight + 'px'
  },
  initAudioMenu : function(){
    // Audio menu trigger
    var thiss = this;
    MobileMenus.prototype.audioMenuHeight = -thiss.audioToolbar.height();

    $('.audio_btn').click(function(e) {
        e.preventDefault();
        var $this = $(this);

        if(!$this.hasClass('disabled')){
          $this.toggleClass('selected');
          if($this.hasClass('selected')){
              thiss.navItems.stop().animate({ top : '-46px'}, 400, function(){
                  thiss.audioToolbar.show().stop().animate({ top : '0px'}, 400).addClass(thiss.openFlag);
              }).removeClass('open');
          }
        } else {
            thiss.audioToolbar.stop().animate({ top : MobileMenus.prototype.audioCloseAnimateHeight()}, 400, function(){
                thiss.navItems.stop().animate({ top : '0px'}, 400).addClass(thiss.openFlag);
            }).hide().removeClass('open');

        }
    });

    // Audio menu close trigger
    $('.audio_close_btn').click(function(e){
        if (MobileMenus.prototype.isMobileClient()) {
          e.preventDefault();
          var $this = $(this);
          //if audio is playing, pause it.
          $('.mejs-pause button').click();
          thiss.audioToolbar.stop().animate({ top : MobileMenus.prototype.audioCloseAnimateHeight()}, 400, function(){
              thiss.navItems.stop().animate({ top : '0px'}, 400).addClass(thiss.openFlag);
          }).removeClass('open');
          $('.audio_btn').toggleClass('selected')
        }
    });
  },

  closeAudioMenu : function(){
    if(this.audioToolbar.hasClass('open')){
      var thiss = this;
      this.audioToolbar.stop().animate({ top : MobileMenus.prototype.audioCloseAnimateHeight()}, 400).removeClass(this.openFlag);
    }
  },

  openBookChapterMenu : function(){
    this.bookChapterTrigger.toggleClass('selected');

    this.closeShareMenu();
    this.closeSettingsMenu();
    this.closeAudioMenu();
    this.closeVerseMenu();
    this.openNavMenu();
    this.referenceToolbar.fadeIn('fast').addClass(this.openFlag);
  },

  openColorMenu : function(){
    //TODO: build closeMenus function that closes any menus flagged as open.
    //this.closeVerseMenu();
    var thiss = this;

    this.closeAudioMenu();
    this.closeNavMenu();
    this.closeSettingsMenu();
    this.shareToolbar.hide();
    thiss.verseToolbar.stop().animate({ top: '-88px'}, 400, function(){
      thiss.colorMenu.stop().animate({ top: '0px'}, 400).addClass(this.openFlag);
    });
  },

  openNavMenu : function(){
    this.navItems.stop().animate({ top : '0px'}, 400).addClass(this.openFlag);
  },

  closeNavMenu : function(){
    this.navItems.stop().animate({ top : '-46px'}, 400).removeClass(this.openFlag);
  },

  closeColorMenu : function(){
    this.colorMenu.stop().animate({ top: '-155px'}, 400).removeClass(this.openFlag);
  },

  closeShareMenu : function(){
    var thiss = this;
    if(this.shareToolbar.hasClass('open')){
      this.shareToolbar.stop().animate({ top : '-46px'}, 400, function(){
        // share toolbar animation complete
        this.shareToolbar.removeClass('open');
        this.shareBtn.toggleClass('selected');
        this.verseToolbar.stop().animate({ top : '-88px'}, 400);

      });
    }
  },

  closeVerseMenu : function(){
    if(this.verseToolbar.hasClass('open')){
      this.shareToolbar.hide();
      var thiss = this;
      this.verseToolbar.stop().animate({ top : '-88px'}, 400);
    }
  },

  closeSettingsMenu : function(){
    var thiss = this;
    this.settingsToolbar.stop().animate({ top : -(thiss.settingsH)}, 400, function(){
      thiss.settingsToolbar.hide();
    });

  }

}