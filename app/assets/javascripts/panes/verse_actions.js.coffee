window.Panes ?= {}

class window.Panes.VerseActions

  constructor: ()->
    @el             = $("#menu_verse_actions")
    @mobile_menu    = $("#m-toolbar .verse_toolbar")
    @speed          = 250
    @is_open        = false
    @activeClass    = 'active'

    @f_open_pane    = $.proxy(@openPane,@)
    @f_close_pane   = $.proxy(@closePane,@)

    @pane_list = @el.find('dl')

    @initMobile()
    @initPanes()
    return

  listener: ()->
    return @el

  setSelectedReferences: (refs) ->

    if refs.length == 0 && @is_open then @close()
    if refs.length > 0 && !@is_open then @open()

    @highlight_pane.updateForm({references: refs})
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
    #@initPanes() unless @isPanesLoaded()
    return if @is_open

    @el.slideDown @speed, ()=>
      Events.Emitter.addListener "pane:open", @f_open_pane
      Events.Emitter.addListener "pane:close", @f_close_pane
    @is_open = true


  open_mobile: ()->
    #$('.reader-nav').stop().animate { 'top' : '-46px'}, 200, ()=>
    #  @mobile_menu.stop().animate { 'top' : '0px'}, 200, ()=>
    #    @mobile_menu.addClass("open")
    #    $('.share_toolbar').show()


  close: ()->
    @current_pane.close() if @current_pane?
    return unless @is_open

    @el.slideUp @speed, ()=>
      @pane_list.find("dd").hide()
      @pane_list.find("dt").removeClass(@activeClass)
      Events.Emitter.removeListener "pane:open", @f_open_pane
      Events.Emitter.removeListener "pane:close", @f_close_pane
      Events.Emitter.emit("verses:clear") #If we're closing the panel, then no verses should be selected.  Fire off this event now.

    @is_open = false



  close_mobile: ()->
    $('.share_toolbar').hide()
    @mobile_menu.stop().animate { 'top' : '-86px'}, 200, ()=>
      @mobile_menu.removeClass("open")
      $('.reader-nav').stop().animate({ 'top' : '0px'}, 200)
  
  isPanesLoaded: ()->
    @el.find(".panels").children().length == 0

  initPanes: ()->
    return unless @pane_list?

    # Upon successful form submit or the X button is clicked, we should reset all panes
    f_close = $.proxy(@close,@)

    Events.Emitter.addListener "form:submit:success", f_close
    Events.Emitter.addListener "panes:cleared", f_close

    @highlight_pane    = new Panes.Highlight({trigger: ".highlight.tab-trigger"})
    @bookmark_pane     = new Panes.Bookmark({trigger: ".bookmark.tab-trigger"})
    @share_pane        = new Panes.Share({trigger: ".share.tab-trigger" })
    @link_pane         = new Panes.Link({trigger: ".link.tab-trigger" })
    @related_pane      = new Panes.Related({trigger: ".related.tab-trigger" })
    @note_pane         = new Panes.Note({trigger: ".note.tab-trigger" })
    @close_pane        = new Panes.Close({trigger: ".clear-selected.tab-trigger" })
    @register_pane     = new Panes.Register({trigger: "" })

    wrap = @el.find(".panels")
    wrap.prepend @register_pane.render()
    wrap.prepend @close_pane.render()
    wrap.prepend @related_pane.render()
    wrap.prepend @share_pane.render()
    wrap.prepend @link_pane.render()
    wrap.prepend @note_pane.render()
    wrap.prepend @bookmark_pane.render()
    wrap.prepend @highlight_pane.render()

    unless Session.User.isLoggedIn()
      @adjustPanesForRegistration()

    return

  adjustPanesForRegistration: ()->
    register = @register_pane.pane()
    @link_pane.setPane(register)
    @related_pane.setPane(register)
    @share_pane.setPane(register)
    @note_pane.setPane(register)
    @bookmark_pane.setPane(register)
    @highlight_pane.setPane(register)

  closePane: (args)->
    pane = args.pane
    pane.close()
    delete @current_pane
    return

  openPane: (args)->
    pane = args.pane
    if @current_pane?
      @current_pane.close ()=>
        pane.open()
      @current_pane = pane
    else
      pane.open()
      @current_pane = pane
    return


  initMobile: ()->
    f_open  = $.proxy(@open_mobile,@)
    f_close = $.proxy(@close_mobile,@)

    jRes.addFunc {
      breakpoint: 'mobile',
      enter: ()=>
        Events.Emitter.addListener "verses:first_selected", f_open
        Events.Emitter.addListener "verses:all_deselected", f_close
        $('html').removeClass('full_screen')
      ,
      exit: ()=>
        Events.Emitter.removeListener "verses:first_selected", f_open
        Events.Emitter.removeListener "verses:all_deselected", f_close
    }