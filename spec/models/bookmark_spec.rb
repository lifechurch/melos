require 'spec_helper'

describe Bookmark do
  use_vcr_cassette "bookmark"
  before :all do
    @params = { email: "testuser23@youversion.com",
               username: "testuser23",
               password: "tenders",
               agree: TRUE,
               verified: TRUE,
               locale: "en_US" }
  end

  describe ".save" do
    it "returns true for saving valid params" do
      # This is really brittle, because in the initial call (where we create our VCR cassette),
      # this user has to be a valid user on the remote system. So that means we have to create
      # the cassette with a new user, so that the first time, the user we expect is created.
      # We could theoretically have a cassette somewhere with some real, existing users already
      # in it, one that we knew existed on the remote system. But this would likewise be quite
      # brittle. I don't have an answer, just making a note next time I'm through here and
      # wondering why a spec that used to pass has started failing or something.
      user = User.new(@params)
      user.create.should_not be_false
      bookmark = Bookmark.new({auth_username: user.username, auth_password: user.password, version: "esv",
                               reference: "Matt.1", title: "Begettings", username: user.username})
      bookmark.save.should_not be_false
    end

    it "returns false for invalid params" do
      bad_bookmark = Bookmark.new({reference: "Matt.99"})
      bad_bookmark.save.should be_false
      bad_bookmark.errors.count.should == 1
    end
  end
end