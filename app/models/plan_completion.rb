class PlanCompletion < YV::Resource

  include YV::Concerns::Moments

  attributes [:body_text, :action_url]

  def kind
    "plan_completion"
  end

  def moment_partial_path
    "moments/#{kind}"
  end

  def created_at
    DateTime.parse(self.created_dt)
  end

  def to_path
    "/moments/#{id}"
  end

  def editable?; false; end
  def deletable?; false; end

end