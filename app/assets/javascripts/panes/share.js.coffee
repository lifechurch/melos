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
    @textarea_el        = @el.find("textarea")
    @tw_btn             = @el.find(".tw-share-button")
    @fb_btn             = @el.find(".fb-share-button")
    @g_btn              = @el.find(".gplus")

  getSelectedVersesContent: ()->
    return $('#version_primary .verse.selected .content')

  updateForm: (params)->
    super(params)

    if params.link
      link = params.link.trim().toLowerCase()
      @short_link.html(link)
      @fb_btn.attr('data-href', link)
      @tw_btn.attr('data-url', link)
      @g_btn.attr('data-href', link)

      # Populate textarea message field
      selected_content = this.getSelectedVersesContent();
      if selected_content.length != 0
        verses_str = $.makeArray(selected_content.map (index,el)->
          return $(el).html()
        )
        verses_str = verses_str.join(" ").trim()