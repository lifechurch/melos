class Friendship < YV::Resource

  include YV::Concerns::Moments

  attr_accessor :friend

  def kind
    "friendship"
  end

  def moment_partial_path
    "moments/#{kind}"
  end

  def created_at
    DateTime.parse(self.created_dt)
  end

end