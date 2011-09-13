Then /^I should see a (.*) dropdown with options (.*)$/ do |select, options| # "
  case select
  when "version"
    el = page.find(:xpath, "//select[@name='version']")
  end

  options.split(", ").each do |opt|
    el.should have_content(opt.gsub(/(^\")|(\"$)/, ""))
  end

end

Then /^([A-Z]*) should be selected in the ([a-z]*) dropdown$/ do |value, dropdown|
  page.should have_selector(:xpath, "//select[@name='#{dropdown}']/option[@value='#{value.downcase}'][@selected]")
end
