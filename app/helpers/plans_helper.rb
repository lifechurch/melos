module PlansHelper
  
  def progress_bar()
    # @engine ||= Haml::Engine.new("%{
    # .progress_wrap
    #   .progress_counter
    #     =t("plans.current progress html", day: plan.current_day, total_days: plan.total_days).html_safe
    #   .progress_bar_outer
    #     .progress_bar{:style => "width:#{plan.progress}%"}
    #       &nbsp;
    #   .progress_bar_cap
    #     &nbsp;
    #   .progress_bar_shadow
    #     .progress_percent_complete{style: "left:#{plan.progress}%"}
    #       %b= t("percentage display", number: plan.progress)
    #       .small= t("plans.completion status (below percentage)")
    # }")
  end
end