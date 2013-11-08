class SystemMoment
  
  attr_accessor :updated_dt,
                :created_dt,
                :comments,
                :commenting,
                :comments_count,
                :kind_id,
                :kind_color,
                :body,
                :icons,
                :avatars,
                :title,
                :extras


  def moment_partial_path
    "moments/system"
  end

end