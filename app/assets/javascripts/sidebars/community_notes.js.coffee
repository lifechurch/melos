window.Sidebars ?= {}

class window.Sidebars.CommunityNotes

  constructor: (@params)->
    @el_id = @params.el
    @paginate_selector = if @params.paginate_selector then @params.paginate_selector else "#widget-notes"
    @load($(@el_id).data("reference") + "/notes")

    f_load = ()=>
      url = @articleNotesUrl()
      $(@paginate_selector).data("paginate-link", url)
      @load(url)

    p_load = ()=>
      url = $(@paginate_selector).data("paginate-link")
      current_page = $(@paginate_selector).data("page")
      dir = $(@paginate_selector).data("paginate-direction")
      if dir == "previous"
        page = current_page - 1
      else
        page = current_page + 1
      @load("#{url}?page=#{page}")

    Events.Emitter.addListener "verses:selected", f_load
    Events.Emitter.addListener "verses:deselected", f_load
    Events.Emitter.addListener "community_notes:paginate", p_load


  load: (url)->
    el = $(@el_id)
    $.ajax
      method: "get",
      url: url,
      dataType: "html",
      success: (data)=>
        el.fadeOut 200, ()=>
          new_widget = $(data).hide()
          el.after(new_widget)
          new_widget.fadeIn(200)
          el.remove()

  articleNotesUrl: ()->
    $("article").data("selected-verses-rel-link") + "/notes"
