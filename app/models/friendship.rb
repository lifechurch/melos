class Friendship

  attr_accessor :id
  attr_accessor :user
  attr_accessor :friend
  attr_accessor :kind_id
  attr_accessor :kind_color
  attr_accessor :comments
  attr_accessor :commenting
  attr_accessor :comments_count
  attr_accessor :created_dt
  attr_accessor :updated_dt
  attr_accessor :avatars
  attr_accessor :icons

  attr_accessor :moment_title


  def moment_partial_path
    "moments/friendship"
  end

end