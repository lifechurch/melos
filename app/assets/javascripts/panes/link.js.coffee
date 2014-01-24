window.Panes ?= {}

class window.Panes.Link extends window.Panes.Base

  constructor: (@params) ->
    super(@params)
    @template = $("#pane-link-tmpl")
    @link = ""
    
  render: ()->
    html = $(super())
    @afterRender(html)
    return html

  afterRender: (html)->
    super(html)
    @copy_button = @el.find("#copy_link")
    @clipper = new ZeroClipboard.Client()
    @initClipper()

  initClipper: ->
    ZeroClipboard.setMoviePath('/assets/lib/ZeroClipboard.swf')
    @clipper.setHandCursor(true)
    
    # Complete event listener
    # First change button text to confirmation text, then 2 seconds later
    # we'll update the button text back to original text.
    @clipper.addEventListener "complete" , (client,text) =>
      html = @copy_button.html()
      @copy_button.html(@copy_button.data("confirm-text"))
      
      set_text = ()=>
        @copy_button.html(html)

      setTimeout(set_text,2000)

      #if (IE8){ copy_button.hide(); } // guessing this is due to a bug?

    # Mouseover event listener
    @clipper.addEventListener "mouseover", (client)=>
      client.setText(@link)


  renderClipboard: ->
    @clipper.glue('copy_link', 'copy_link_container')

  setLink: (link) ->
    @link = link.toLowerCase()
    @el.find("#copy_link_input").val( @link )