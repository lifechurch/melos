window.Sidebars ?= {}

class window.Sidebars.CommunityNotes

  constructor: (@params)->
    @el_id = @params.el
    @load($(@el_id).data("reference") + "/notes")
    $(document).on "verses:selected verses:deselected verses:all_deselected", ()=>
      @load(@articleNotesUrl())


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