window.Panes ?= {}

class window.Panes.VerseActions

  constructor: ()->
    @el                     = $("#menu_verse_actions")
    @mobile_menu            = $(".verse_toolbar")
    @speed                  = 250;
    @activeClass            = 'active';
    @selected_verse_count   = 0;
    @initPanes()
    @initMobile()

    return

  listener: ()->
    return @el

  setSelectedReferences: (refs) ->
    @highlight_pane.updateForm({references: refs})
    @mobile_highlight_pane.updateForm({references: refs})
    @bookmark_pane.updateForm({references: refs})
    @share_pane.updateForm({references: refs})
    @link_pane.updateForm({references: refs})
    @note_pane.updateForm({references: refs})


  updateLink: (link)->
    @link_pane.setLink(link)


  renderClipboard: ()->
    @link_pane.renderClipboard()


  updateSharing: ( params )->
    @share_pane.updateForm(params)


  open: ()->
    @adjustArticleMargin(@el.height())
    @el.slideDown @speed, ()=>
      @listener().on "pane:open", $.proxy(@openPane,@)
      @listener().on "pane:close", $.proxy(@closePane,@)


  open_mobile: ()->
    $('.reader-nav').stop().animate { 'top' : '-46px'}, 200, ()=>
      @mobile_menu.stop().animate { 'top' : '0px'}, 200, ()=>
        @mobile_menu.addClass("open")
        $('.share_toolbar').show()


  close: ()->
    @adjustArticleMargin()
    @el.slideUp @speed, ()=>
      @pane_list.find("dd").hide()
      @pane_list.find("dt").removeClass(@activeClass)
      @listener().off "pane:open"
      @listener().off "pane:close"


  close_mobile: ()->
    $('.share_toolbar').hide()
    @mobile_menu.stop().animate { 'top' : '-86px'}, 200, ()=>
      @mobile_menu.removeClass("open")
      $('.reader-nav').stop().animate({ 'top' : '0px'}, 200)


  setTotal: (total)->
    @selected_verse_count = total
    if total > 0 then @open() else @close()


  panesClearedHandler: ()->
    @setTotal(0)
    $(@).trigger("verses:clear")


  initPanes: ()->
    return unless @pane_list = @el.find('dl')


    @highlight_pane         = new Panes.Highlight {el:"#highlight-pane"}
    @bookmark_pane          = new Panes.Bookmark {el:"#bookmark-pane"}
    @share_pane             = new Panes.Share {el:"#share-pane"}
    @link_pane              = new Panes.Link {el:"#link-pane"}
    @note_pane              = new Panes.Note {el:"#note-pane"}
    @close_pane             = new Panes.Close({})
    $(@close_pane).bind("panes:cleared", $.proxy(@panesClearedHandler,@))

    @register_pane          = new Panes.Register({el:"#need-account"})
    @mobile_highlight_pane  = new Panes.Highlight {el:"div.color_toolbar"}


    dl = @el.find("dl.verses_selected")
    dl.prepend @register_pane.render()
    dl.prepend @close_pane.render()
    dl.prepend @link_pane.render()
    dl.prepend @share_pane.render()
    dl.prepend @note_pane.render()
    dl.prepend @bookmark_pane.render()
    dl.prepend @highlight_pane.render()

    unless @isLoggedIn()
      @adjustPanesForRegistration()

    return

  adjustPanesForRegistration: ()->
    register = @register_pane.pane()
    @link_pane.setPane(register)
    @share_pane.setPane(register)
    @note_pane.setPane(register)
    @bookmark_pane.setPane(register)
    @highlight_pane.setPane(register)


  adjustArticleMargin: (extra)->
    new_margin = reader.header.outerHeight() + extra || 0
    $('article').stop().animate({marginTop: new_margin}, @speed)

  closePane: (event, args)->
    pane = args.pane
    pane.close()
    delete current_pane
    
    # $(document).off "keydown", (event)=>
    #   if event.keyCode == 27 #escape key
    #     event.preventDefault()
    #     @closePanes    

    return

  openPane: (event, args)->
    pane = args.pane
    if @current_pane?
      @current_pane.close ()=>
        pane.open()
      @current_pane = pane
    else
      pane.open()
      @current_pane = pane
    
    #     $(document).on "keydown", (event)=>
    #       if event.keyCode == 27  #27 === Escape key
    #         event.preventDefault()
    #         @closePanes()

    return


  initMobile: ()->
    console.log("INIT MOBILE")
    jRes.addFunc {
      breakpoint: 'mobile',
      enter: ()=>
        console.log("ENTER BREAK")
        $('#version_primary').bind("verses:first_selected", $.proxy(@open_mobile,@))
        $('#version_primary').bind("verses:all_deselected", $.proxy(@close_mobile,@))
        $('html').removeClass('full_screen')
      ,
      exit: ()=>
        console.log("EXIT BREAK")
        $('#version_primary').unbind("verses:first_selected", $.proxy(@open_mobile,@));
        $('#version_primary').unbind("verses:all_deselected", $.proxy(@close_mobile,@));
    }

  isLoggedIn: ()->
    $("html").data("logged-in")



