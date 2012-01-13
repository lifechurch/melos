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
  
  def cal_table_header(statuses)
    sunday = Date.new(1984,12,9)#sunday
    days = []
    7.times {|i| days << sunday.next_day(i).strftime('%^a')[0]}

    haml_str = <<-HAML_STR
%caption
  =Date.parse(statuses.first.date).strftime('%B %Y')
%thead
  %tr
    -days.each do |abbrev|
      %th= abbrev
    HAML_STR

    Haml::Engine.new(haml_str).render(Object.new, {statuses: statuses, days: days}).html_safe
  end
  
  def cal_table_body(statuses, subscription, plan_path)
    date = Date.parse(statuses.first.date)
    day = date - (date.day - 1) - (date - (date.day - 1)).cwday               #first calendar day (given tabular calendar starting on Sun)
    day = day.next_day(7) if date.prev_day(date.day - 1) - day == 7           # if first day of month is a sunday (more clear than doing on the previous line)

    haml_str = <<-HAML_STR
- last_month_day = date.next_month - 1
- full_month = false
- # while there are remaining items that are in this current month  -OR-  we haven't listed a full month
- while ((!statuses.empty? && (Date.parse((status_day = statuses.first).date).month) == date.month)) || !full_month
  %tr
    - # List out a week's worth of days'
    - 7.times do
      - # if not in current month  -OR-  not a day on the paln
      - if day.month != date.month || day < date || statuses.empty?
        -if day.month != date.month
          %td.disabled{class: day == Date.today ? "today" : ""}
        -else
          %td.inactive-day{class: day == Date.today ? "today" : ""}= day.day.to_s
      - else
        - status_day = statuses.delete_at(0)
        - class_str = status_day.completed ? 'read' : !status_day.references_completed.empty? ? 'inactive-day partial' : 'inactive-day'
        - class_str << ((day == Date.today) ? ' today' : '')
        %td{class: class_str}
          = link_to(day.day.to_s, ( day: day.day))
      - day = day.next
    - #it's been a full month if the last day we addressed was the last day of the month
    - full_month = day > last_month_day
  HAML_STR

    Haml::Engine.new(haml_str).render(Object.new, {date: date, day: day, statuses: statuses, subscription: subscription, plan_path: plan_path}).html_safe
  end

end