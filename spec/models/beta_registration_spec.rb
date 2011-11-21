require 'spec_helper'

describe BetaRegistration do
  before :all do
    @testuser = ensure_user username: "testuser", password: "tenders", email: "testuser@youversion.com"
    @testuser2 = ensure_user username: "testuser2", password: "tenders", email: "testuser2@youversion.com"
  end

  describe "#create" do
    it "creates a new instance with a valid username" do
      beta = BetaRegistration.create(username: @testuser.username, password: @testuser.password)
      beta.should be_valid
    end

    it "bombs with invalid credentials" do
      bad_beta = BetaRegistration.create(username: @testuser.username, password: "foo")
      bad_beta.should have(1).error_on :username
    end
  end
end
