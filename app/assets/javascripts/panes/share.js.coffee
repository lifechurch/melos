window.Panes ?= {}

class window.Panes.Share extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-share-tmpl")

  render: ()->
    # get our template rendered
    html = $(super())
    @afterRender(html)
    return html

  afterRender: (html)->
    super(html)
    @setupPane()
    return

  setupPane: ()->
    @short_link         = @el.find("#short_link")
    @sharethis_btn      = @el.find(".addthis_sharing_toolbox")

  getSelectedVersesContent: ()->
    return $('#version_primary .verse.selected .content')

  updateForm: (params)->
    super(params)

    if params.link
      link = params.link.trim().toLowerCase()
      @short_link.html(link)
      verses_str = ''

      # Populate textarea message field
      selected_content = this.getSelectedVersesContent();
      if selected_content.length != 0
        verses_str = $.makeArray(selected_content.map (index,el)->
          return $(el).html()
        )
        verses_str = verses_str.join(" ").trim()

      if (verses_str.length > 102)
        verses_str = verses_str.substring(0,100)
        lastIndex = verses_str.lastIndexOf(" ")
        verses_str = verses_str.substring(0,lastIndex).trim() + "..."

      window.addthis_share =
      {
        title : verses_str,
        url : link
      }