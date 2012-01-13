require 'spec_helper'

describe NotificationSettings do
  describe ".find" do
    it "returns a user's notification settings" do
      @default_user = ensure_user({username: "default_user", password: "tenders"})
      auth = Hashie::Mash.new(user_id: @default_user.id, username: @default_user.username, password: "tenders")
      ns = NotificationSettings.find(auth: auth)
      ns.should be_a NotificationSettings
      ns.badges.should == true
    end
  end

  describe "#update" do
    it "sets a user's notification settings" do
      @paranoid_user = ensure_user({username: "paranoid_user", password: "tenders"})
      auth = Hashie::Mash.new(user_id: @paranoid_user.id, username: @paranoid_user.username, password: "tenders")
      ns = NotificationSettings.find(auth: auth)
      ns.update({badges: "0", follower: "0", newsletter: "0", note_like: "0", reading_plans: "0"})
      ns = NotificationSettings.find(auth: auth)
      ns.badges.should be_false
      ns.update({badges: "1", follower: "1", newsletter: "1", note_like: "1", reading_plans: "1"})
      ns = NotificationSettings.find(auth: auth)
      ns.badges.should == true

    end
  end

end
