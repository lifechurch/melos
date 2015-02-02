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
    @share_link_field   = @el.find("#share_link")
    @textarea_el        = @el.find("textarea")
    @tw_btn             = @el.find(".tw-share-button")
    @fb_btn             = @el.find(".fb-share-button")
    @g_btn              = @el.find(".gplus")

    # @el.find("#tab-side-container").easytabs({'updateHash': false, 'animate': false})

  getSelectedVersesContent: ()->
    return $('#version_primary .verse.selected .content')

  updateForm: (params)->
    super(params)

    $("#checkbox_share_twitter").hide()
    $("#checkbox_share_facebook").hide()
    
    if params.link
      link = params.link.trim().toLowerCase()
      @short_link.html(link)
      @share_link_field.val(link)
      @fb_btn.attr('data-href', link)
      @tw_btn.attr('data-url', link)
      @g_btn.attr('data-href', link)

      @el.find(".character_count").remove()

      # Populate textarea message field
      selected_content = this.getSelectedVersesContent();
      if selected_content.length != 0
        verses_str = $.makeArray(selected_content.map (index,el)->
          return $(el).html()
        )

        verses_str = verses_str.join(" ").trim()
        # @textarea_el.html(verses_str)

        # Populate twitter character count info
        # chars_left = 140 - link.length - 1;
        # @tw_char_count.charCount({
        #   allowed: chars_left,
        #   css: "character_count",
        #   target: @textarea_el
        # });

        # Populate facebook character count info
        # chars_left = 420 - link.length - 1;
        # @fb_char_count.charCount({
        #   allowed: chars_left,
        #   css: "character_count",
        #   target: @textarea_el
        # });