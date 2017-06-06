require "spec_helper"

describe "routes for Subscriptions" do
  it "routes /users/USERID/reading-plans to the subscriptions controller" do
    { :get => "/users/billygrahm/reading-plans" }.
      should route_to(:controller => "subscriptions", :action => "index", :user_id => "billygrahm")
  end
end