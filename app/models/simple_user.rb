class SimpleUser
  
  attr_accessor :id
  attr_accessor :name
  attr_accessor :user_name
  attr_accessor :avatars

  def initialize(params)
    params.each do |key,value|
      send("#{key}=",value)
    end
  end

end