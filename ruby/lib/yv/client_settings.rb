# Class meant to abstract away cookie related browser(client) settings
module YV
  class ClientSettings

    def initialize( cookies )
      @cookies = cookies
    end

    def viewed_social_intro
      @cookies["viewed-social-intro"]
    end

    def viewed_social_intro!
      @cookies["viewed-social-intro"] = { value: true }
    end

    def time_zone
      @cookies['cs-time-zone']
    end

    def reader_font
      @cookies['data-setting-font']
    end

    def reader_font_size
      @cookies['data-setting-size'] || "user_setting_size_medium"
    end

    def reader_full_screen
      @cookies[:full_screen]
    end

    def reader_full_screen=( value )
      @cookies[:full_screen] = { value: value }
    end

    def reader_parallel_mode
      @cookies[:parallel_mode]
    end

    def reader_parallel_mode=( value )
      @cookies[:parallel_mode] = { value: value }
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

    def recent_versions
      @cookies['recent_versions']
    end

    def version
      @cookies[:version]
    end

    def version=(version)
      @cookies.permanent[:version] = version.to_id
    end

    def last_read
      @cookies[:last_read]
    end

    def last_read=(ref)
      @cookies.permanent[:last_read] = ref.to_usfm if ref.try :valid?
    end

    def video_series
      @cookies[:video_series_id]
    end

    def video_series=( id )
      @cookies[:video_series_id] = { value: id }
    end
  end
end
