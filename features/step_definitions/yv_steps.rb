Then /^I should see a (.*) with contents (.*)$/ do |select, options| # "


  options.split(", ").each do |opt|
    el.should have_content(opt.gsub(/(^\")|(\"$)/, ""))
  end

end



Then /^"(.*)" should be selected$/ do |value|
  with_scope("selected") { page.should have_content value }
end
