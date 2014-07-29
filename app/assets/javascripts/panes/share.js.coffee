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
    @tw_btn             = @el.find(".twitter")
    @fb_btn             = @el.find(".facebook")
    @tw_char_count      = @el.find(".share_character_count .tw")
    @fb_char_count      = @el.find(".share_character_count .fb")
    @char_count         = @el.find(".share_character_count")
    @share_errors       = @el.find(".share_errors")
    @submit             = @el.find("#share_action_submit")
    @tw_checkbox        = @el.find("#checkbox_share_twitter")
    @fb_checkbox        = @el.find("#checkbox_share_facebook")

    @share_errors.html("")

    @tw_btn.click ()=>
      @toggleShareButton(@tw_btn)
    @fb_btn.click ()=> 
      @toggleShareButton(@fb_btn)

    @form_el.submit (e)=>

      # validations
      @share_errors.html("")

      # none checked
      if !@tw_checkbox.is(":checked") && !@fb_checkbox.is(":checked")
        @share_errors.append(@share_errors.data("error-none-checked"))
        e.preventDefault()

      # too many characters
      if (@tw_checkbox.prop("checked") && @tw_char_count.next().hasClass("exceeded")) || (@fb_checkbox.prop("checked") && @fb_char_count.next().hasClass("exceeded"))
        @share_errors.append(@share_errors.data("error-character-limit"))
        e.preventDefault()

  toggleShareButton: (btn)=>

    @share_errors.html("")

    if btn.hasClass('twitter')
      if @tw_char_count.next().hasClass("exceeded")
        @share_errors.append(@share_errors.data("error-character-limit"))
        @disableNetworkButton(btn)
      else
        @toggleNetworkButton(btn)
    else if btn.hasClass('facebook')
      if @fb_char_count.next().hasClass("exceeded")
        @share_errors.append(@share_errors.data("error-character-limit"))
        @disableNetworkButton(btn)
      else
        @toggleNetworkButton(btn)

    # enable the submit button when we have at least one selected valid network
    if ( @tw_checkbox.prop("checked") && !@tw_char_count.next().hasClass("exceeded")) || ( @fb_checkbox.prop("checked") && !@fb_char_count.next().hasClass("exceeded"))
      @submit.addClass("action_button_green")
      @submit.removeClass("action_button_blue")
    else
      @submit.removeClass("action_button_green")
      @submit.addClass("action_button_blue")


  disableNetworkButton: (btn) ->
    btn.removeClass('network_active')
    checkBox = btn.parent().find("[type=checkbox]")
    checkBox.prop("checked", false)

  toggleNetworkButton: (btn) ->
    # update css and toggle the checkbox
    btn.toggleClass('network_active')
    checkBox = btn.parent().find("[type=checkbox]")
    checkBox.prop("checked", !checkBox.prop("checked"))


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
        @tw_char_count.charCount({
          allowed: chars_left,
          css: "character_count",
          target: @textarea_el
        });

        # Populate facebook character count info
        chars_left = 420 - link.length - 1;
        @fb_char_count.charCount({
          allowed: chars_left,
          css: "character_count",
          target: @textarea_el
        });