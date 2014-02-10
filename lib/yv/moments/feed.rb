module YV
  module Moments
    class Feed

      def initialize(opts={})
        @auth = opts[:auth]
        @page = opts[:page]
        @primary_version = opts[:version]
        @recent_versions = opts[:recent_versions]
        @merged_moments  = []
        @tracked_days    = []
      end


      def moments
        return @merged_moments if @merged_moments.present?
        
        @merged_moments << votd_today if first_page?


        @moments ||= Moment.all(auth: @auth, page: @page)

        @moments.each_index do |idx|
          current_moment = @moments.fetch(idx)
          next_idx       = idx + 1
          next_moment    = @moments.fetch(next_idx) unless next_idx >= @moments.size

          current_yday = moment_yday(current_moment)
          next_yday    = moment_yday(next_moment) if next_moment.present?


          @merged_moments << current_moment
          if next_moment.present? and current_yday != next_yday
            @merged_moments.concat merge_for(current_yday, next_yday)
          end
        end

        @merged_moments
      end

      def next_page
        @moments.next_page
      end

      private

      def merge_for(current_day, next_day)
        vods = []

        current_day.downto(next_day).each do |day|
          unless @tracked_days.include?(day)
            vods << VOD.day(day,version_id: @primary_version.to_i, recent_versions: @recent_versions)
            track_day(day)
          end
        end
        vods
      end

      def votd_today
        return @vod_today if @vod_today.present?
        day = Date.today.yday
        track_day(day)
        @vod_today ||= VOD.day(day,version_id: @primary_version.to_i, recent_versions: @recent_versions)
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

    end
  end
end