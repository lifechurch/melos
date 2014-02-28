module YV
  module Moments
    class Feed

      attr_reader :paginated_end_day

      def initialize(opts={})
        @auth = opts[:auth]
        @page = opts[:page]
        @prev_end_day      = opts[:prev_end_day].to_i
        @primary_version   = opts[:version]
        @recent_versions   = opts[:recent_versions]
        @merged_moments    = []
        @tracked_days      = []
      end


      def moments
        ms            = paged_moments
        first_moment  = ms.first
        last_moment   = ms.last
        first_day     = moment_yday(first_moment)
        last_day      = @paginated_end_day = moment_yday(last_moment)
        merged        = []
        vods          = []

        if first_page?
          today = Date.today.yday
          today.downto(first_day).each do |day|
            unless day_tracked?(day)
              vods << verse_for_day(day)
              track_day(day)
            end
          end
        end

        if @prev_end_day != 0 and @prev_end_day != first_day
          vods << verse_for_day(@prev_end_day)
          track_day(@prev_end_day)
        end

        first_day.downto(last_day + 1).each do |day|
          unless day_tracked?(day)
            vods << verse_for_day(day)
            track_day(day)
          end
        end

        merged.concat(ms)
        merged.concat(vods)
        merged.sort_by {|obj| obj.created_at}.reverse
      end

      def next_page
        paged_moments.next_page
      end

      private

      def paged_moments
        @paged_moments ||= Moment.all(auth: @auth, page: @page)
      end

      def merge_for(current_day, next_day)
        vods = []

        current_day.downto(next_day).each do |day|
          unless day_tracked?(day)
            vods << verse_for_day(day)
            track_day(day)
          end
        end
        vods
      end

      def verse_for_day(day)
        VOD.day(day,version_id: @primary_version.to_i, recent_versions: @recent_versions)
      end


      def moment_yday(moment)
        Date.parse(moment.created_dt).yday
      end

      def first_page?
        @page == 1
      end

      def track_day(day)
        @tracked_days.unshift(day)
      end

      def day_tracked?(day)
        @tracked_days.include?(day)
      end

    end
  end
end