# Class meant to abstract away cookie related browser(client) settings
module YouVersion
  class ClientSettings

    def initialize( cookies )
      @cookies = cookies
    end

    def reader_font
      @cookies['data-setting-font']
    end

    def reader_font_size
      @cookies['data-setting-size']
    end

    def reader_full_screen
      @cookies[:full_screen]
    end

    def reader_full_screen=( value )
      @cookies[:full_screen] = value
    end

    def reader_parallel_mode
      @cookies[:parallel_mode]
    end

    def reader_parallel_mode=( value )
      @cookies[:parallel_mode] = value
    end

    def reader_trans_notes
      @cookies['data-setting-trans-notes'] || "false"
    end

    def reader_cross_refs
      @cookies['data-setting-cross-refs'] || "false"
    end

    def reader_highlights
      @cookies['data-setting-show-highlights'] || "true"
    end

    def version
      @cookies[:version]
    end

    def version=(version)
      @cookies.permanent[:version] = version.to_param
    end

    def last_read
      @cookies[:last_read]
    end

    def last_read=(ref)
      @cookies.permanent[:last_read] = ref.to_usfm if ref.try :valid?
    end

    SUBSCRIPTION_STATE  = :subscription
    DEFAULT_STATE       = :default

    def app_state
      @cookies[:app_state] ||= DEFAULT_STATE
    end

    def app_state=(state = DEFAULT_STATE)
      @cookies[:app_state] = state
    end

    def subscription_state?
      app_state.to_sym == SUBSCRIPTION_STATE.to_sym
    end

    def subscription_id
      @cookies[:app_state_subscription_id]
    end

    def subscription_id=( id )
      @cookies[:app_state_subscription_id] = id
    end

    def video_series
      @cookies[:video_series_id]
    end

    def video_series=( id )
      @cookies[:video_series_id] = id
    end
  end
end