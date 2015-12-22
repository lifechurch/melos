class window.AudioPlayer

  constructor: ()->
    @player = $('#audio_player')
    @menu   = $('#menu_audio_player')

    return unless @player?

    adjustBarWidth = ()->
      $('.mejs-time-rail').css('width', 191)
      $('.mejs-time-total').css('width', 190)
    
    @menu.show()
    @player.mediaelementplayer
      pluginPath:   "https://web-production.s3.amazonaws.com/assets/",
      features:     ['playpause', 'current', 'progress', 'duration'],
      audioWidth:   '100%',
      success:      (mediaElement, domObject)->
        # KM: using the timeupdate event for this which gets fired quite a bit.
        # There might be a less frequent event we can use but this work for now.
        mediaElement.addEventListener 'timeupdate', (e)->
          adjustBarWidth()
        , false

    @menu.hide()

    # KM: the player sets the width in JS sometime after loading but I don't
    # see an event to hook into. This timer seems to do the trick.
    setTimeout( adjustBarWidth, 100)
