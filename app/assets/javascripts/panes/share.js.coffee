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
    @tw_share_msg_field = @el.find(".share_verse_twitter")
    @fb_share_msg_field = @el.find(".share_verse_facebook")
    @textarea_el        = @el.find("textarea")

    @form_el.submit (e)=>
      tw = $("#checkbox_share_twitter")
      fb = $("#checkbox_share_facebook")

      if !tw.is(":checked") && !fb.is(":checked")
        # Eventually make this more user friendly / I18n'd. Quick fix to mitigate the issue.
        alert("Twitter? Facebook?")
        e.preventDefault()


  getSelectedVersesContent: ()->
    return $('#version_primary .verse.selected .content')


  updateForm: (params)->
    super(params)
    
    if params.link
      link = params.link.trim().toLowerCase()
      @short_link.html(link)
      @share_link_field.val(link)

      @el.find(".character_count").remove()

      # Populate textarea message field
      selected_content = this.getSelectedVersesContent();
      if selected_content.length != 0
        verses_str = $.makeArray(selected_content.map (index,el)->
          return $(el).html()
        )

        verses_str = verses_str.join(" ").trim()
        @textarea_el.html(verses_str)

        # Populate twitter character count info
        chars_left = 140 - link.length - 1;
        @tw_share_msg_field.charCount({
          allowed: chars_left,
          css: "character_count",
          target: @textarea_el
        });

        # Populate facebook character count info
        chars_left = 420 - link.length - 1;
        @fb_share_msg_field.charCount({
          allowed: chars_left,
          css: "character_count",
          target: @textarea_el
        });