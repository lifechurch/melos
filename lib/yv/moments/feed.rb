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

        # TODO: account for @page parameter when determining first/last day.
        first_day     = first_moment.nil? ? Date.today.yday : moment_yday(first_moment)
        last_day      = last_moment.nil? ?  Date.today.yday - per_page : moment_yday(last_moment) #@paginated_end_day = moment_yday(last_moment)
        merged        = []
        vods          = []

        # Zero moments, just generate VOTDs and return those.
        return only_votds() if ms.blank?

        # Merge VOTDs between today and the first moment. 
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
        merged.sort_by! {|obj| obj.created_at}
        # check to see if the csm falls in the current page
        if client_side_moments.present? and client_side_moments.first.created_at > merged.first.created_at and client_side_moments.first.created_at < merged.last.created_at
          merged.concat(client_side_moments)
          merged.sort_by! {|obj| obj.created_at}
        end
        merged.reverse
      end

      def next_page
        paged_moments.next_page
      end

      private

      def only_votds
        vods        = []
        first_date  = (Date.today - daily_offset_by_page.days) # first day for moments is based off today, and current page - 1 * per_page #.
        first_day   = first_date.yday
        last_day    = (first_date - per_page.days).yday

        # we've traveled into another year!
        # Need to make sure that we create an array of days that we can properly
        # get VOTD's for -> [2,1,365,364,363...]

        all_days = if first_day < last_day  # if 2 is less than 365
          prev_year             = Date.today - 1.year
          prev_year_total_days  = prev_year.leap? ? 366 : 365

          # Collect days down to Jan 1
          this_year_days = []
          first_day.downto(1) {|d| this_year_days.push(d) }

          # Collect days 365/6 down to last day
          prev_years_days = []
          prev_year_total_days.downto(last_day) {|d| prev_years_days.push(d)}

          this_year_days.concat(prev_years_days)
        else
          # Range.to_a only works on ascending numbers - (1..10).to_a -> [1,2,3] whereas (10..1).to_a -> []
          (last_day..first_day).to_a.reverse
        end

        all_days.each do |day|
          unless day_tracked?(day)
            vods << verse_for_day(day)
            track_day(day)
          end
        end
        return vods
      end

      def paged_moments
        @paged_moments ||= Moment.all(auth: @auth, page: @page)
      end

      def client_side_moments
        @client_side_moments = Moment.client_side_items(auth: @auth)
        # Trim down the array of CSM to moments with dates that are today or recent 
        @client_side_moments = @client_side_moments.select{|m| m.expanded_dt.any?{|d| d.to_date <= Date.today } } if @client_side_moments.present?
        # Set the created_dt on the moments so the moment merges into the feed
        # Select the most recent one (max date), before or on today
        # Have to convert it back to a string :/ because helper functions..
        @client_side_moments.each { |m| m.created_dt = m.expanded_dt.select{|d| d.to_date <= Date.today }.max.to_s } if @client_side_moments.present?
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


      def track_day(day)
        @tracked_days.unshift(day)
      end


      def day_tracked?(day)
        @tracked_days.include?(day)
      end


      # if current_page - 1 is 0, then 0 * per_page is zero --> No offset for first page
      # every other page (2,3,4,5,..) will then return an offset of num * per page.
      # Should return an integer.
      def daily_offset_by_page
        offset = (current_page - 1) * per_page
        offset += 1 unless first_page?
        offset += 1 if current_page > 2
        offset
      end

      def current_page
        @page
      end

      def per_page
        25
      end

      def first_page?
        current_page == 1
      end

    end
  end
end