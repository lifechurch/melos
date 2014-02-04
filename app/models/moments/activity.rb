module Moments
  class Activity

    def initialize(moment)
      @user_activities = {}
      @moment   = moment
      process!
    end

    # Yields a UserActivity instance for each iteration.
    def each
      activities.each {|user_id,user| yield(user)}
    end

    private

    def activities
      @user_activities
    end

    def process!
      collect_likes_and_comments.each {|activity| record_user_activity(activity)}
      activities.sort_by {|user_id, user| user.last_active } 
    end

    # @activity argument can be a like or comment currently
    def record_user_activity(action)
      user = action[:activity].user
      user_id = user.id.to_i

      unless activities.has_key?(user_id)
        activities.store(user_id,UserActivity.new(user))
      end

      activity_user = activities[user_id]
      activity_user.add_activity(action)
    end

    # Collect likes and comments into a single
    # array of hashes sorted by time created descending
    def collect_likes_and_comments
      likes = comments = []

      likes = @moment.likes.collect do |like|
        activity_hash(like)
      end unless @moment.likes.nil?

      comments = @moment.comments.collect do |comment|
        activity_hash(comment)
      end unless @moment.comments.nil?

      combined = likes + comments
      combined.sort_by {|hsh| hsh[:time]}.reverse #Descending 
    end


    # Hash format created for the merged list of likes/comments
    def activity_hash(activity)
      {activity: activity, time: epoch_time(activity.created_dt)}
    end

    def epoch_time(stamp)
      DateTime.parse(stamp).to_i
    end

  end


  # Tracks activity for a single User of a moment.
  class UserActivity

    attr_reader :actions, :user, :recent_comment, :recent_like, :last_active

    def initialize(record)
      @user = record
      @last_active = 0
      @most_recent_like_time = 0
      @most_recent_comment_time = 0
      @actions = []
    end

    def add_activity(act)
      activity = act[:activity]
      @actions << act
      set_most_recent_like(act) if activity.is_a? Like
      set_most_recent_comment(act) if activity.is_a? Comment

      @actions.sort_by {|hsh| hsh[:time]}.reverse
      set_last_active(act[:time])
    end



    private

    def set_most_recent_comment(act)
      @recent_comment = act[:activity] if act[:time] > @most_recent_comment_time
    end

    def set_most_recent_like(act)
      @recent_like = act[:activity] if act[:time] > @most_recent_like_time
    end

    def set_last_active(etime)
      @last_active = etime if etime > @last_active
    end

  end
end