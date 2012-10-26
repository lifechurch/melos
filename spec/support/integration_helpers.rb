module IntegrationHelpers

  def login_test_user( user = "testusercb" , pass = "tenders" )
    visit "/sign-in"
    page.fill_in "username", with: user # or whoever
    page.fill_in "password", with: pass
    page.find("input[name='commit']").click
  end

  def test_user_base_url
    "/users/testusercb"
  end

end