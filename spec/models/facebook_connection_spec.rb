require 'spec_helper'

describe FacebookConnection do

  before :each do
    @user = ensure_user(email: "testuser59@gmail.com", username: "testuser59", password: "tenders")
    visit '/sign-in'
    fill_in "Username (or Email)", with: "testuser59"
    fill_in "Password", with: "tenders"
    click_button "Sign in"
    visit '/settings/connections?show=facebook'
    
    page.should have_content("Connect to your Facebook account")
  end
  it "adds connection info to the API when saved" do


    # stub
  end

  # it "lists a user's Facebook friends on YouVersion" do
  #     # stub
  #   end
  # 
  #   it "deletes a user's connection info" do
  #     # stub
  #   end
  # 
  #   it "updates the expiration date of a user token" do
  # 
  #   end
end