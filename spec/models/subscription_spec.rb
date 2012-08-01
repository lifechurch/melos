require 'spec_helper'

describe Subscription do
  before(:all) do

    @user = ensure_user
    @auth = @user.auth

    @user_friend = ensure_user
    @auth_friend = @user_friend.auth

    @plan = Plan.find('1-robert-roberts')
    @esv_id = 59
    @nlt_id = 116
    @niv_id = 111
  end
  after(:each) do
    #clear user of all subscriptions after every example
    @user.subscriptions.each{|s| s.unsubscribe}
    raise "user unexpectedly maintaining state!" if @user.subscriptions.count != 0
  end

  describe "subscribing" do
    describe "when not subscribed" do
      it "should add 1 subscription to the users subscriptions" do
        expect { Plan.subscribe(@plan, @auth) }.to change{ @user.subscriptions.count }.by(1)
      end
      it "should change users's subscription status" do
        expect { Plan.subscribe(@plan, @auth) }.to change{ @user.subscribed_to? @plan }
      end
    end

    describe "when already subscribed" do
      it "should raise an exception" do
        Plan.subscribe(@plan, @auth)
        expect {Plan.subscribe(@plan, @auth)}.to raise_error
      end
    end
  end

  describe "#find" do
    describe "without auth" do
      it "should return all public subscription" do
        Plan.subscribe(@plan, @auth)
        Subscription.find(@plan, @user)
      end
      it "should not return any private subscriptions"
      it "returns nil if no subscription exists" do
        Subscription.find(@plan, @user).should be_nil
      end
    end
    describe "with auth" do
      it "should reuturn all public subscriptions" do
      end
      it "should not return any private subscriptions" do
      end
    end
  end

  describe "#unsubscribe" do
    before(:each) do
      @subscription = Plan.subscribe(@plan, @auth)
    end
    it "should remove 1 subscription from the users subscriptions" do
      expect { @subscription.unsubscribe }.to change{ @user.subscriptions.count }.to(0)
    end
    it "should change users's subscription status" do
      expect { @subscription.unsubscribe }.to change{ @user.subscribed_to? @plan }
    end
  end

  describe "#reading" do
    it "should have no completions upon subscription" do
      Plan.subscribe(@plan, @auth).day(1).references.each do |ref|
        ref.should_not be_completed
      end
    end
  end

  describe "#set_ref_completion" do
    before(:each) do
      @subscription = Plan.subscribe(@plan, @auth)
      @subscription.set_ref_completion(1, 'gen.1.kjv', true)
    end
    it "should complete a reference" do
      @subscription.day(1).references.first.should be_completed
    end
    it "should only complete the specified reference" do
      @subscription.day(1).references.each_with_index do |r,i|
        r.should_not be_completed unless i == 0
      end
    end
    it "should uncomplete a reference" do
      @subscription.set_ref_completion(1, 'gen.1.kjv', false)
      @subscription.day(1).references.first.should_not be_completed
    end
    it "should only uncomplete the specified reference" do
      @subscription.day(1).references.each do |r|
        @subscription.set_ref_completion(1, r.ref.osis, true)
      end
      @subscription.set_ref_completion(1, 'gen.1.kjv', false)

      @subscription.day(1).references.each_with_index do |r,i|
        r.should be_completed unless i == 0
      end
    end
  end

  describe "#last_completed_day" do
    it "should move one day forward if I complete all" do
      @subscription = Plan.subscribe(@plan, @auth)
      expect {
        @subscription.day(1).references.each do |r|
          @subscription.set_ref_completion(1, r.ref.osis, true)
        end
      }.to change{ @subscription.last_completed_day }.from(nil).to(1)
    end
  end

  describe "#catch_up" do
    it "should move one day forward if I'm ahead" do
      @subscription = Plan.subscribe(@plan, @auth)
      @subscription.day(1).references.each do |r|
        @subscription.set_ref_completion(1, r.ref.osis, true)
      end

      expect { @subscription.catch_up }.to change{ @subscription.current_day }.from(1).to(2)
    end
    #This tests my thin abstraction, anything more would be testing API logic
  end

  describe "#restart" do
    it "should erase progress" do
      @subscription = Plan.subscribe(@plan, @auth)
      @subscription.set_ref_completion(1, 'gen.1.kjv', true)

      expect { @subscription.restart }.to change{ @subscription.day(1).references.first.completed? }
    end
    #This tests my thin abstraction, anything more would be testing API logic
  end

  describe "privacy settings" do
    subject { Plan.subscribe(@plan, @auth) }

    it "should be public upon subscription" do
      subject.should be_public
    end
    it "should be able to be made private" do
      expect { subject.make_private }.to change{ subject.private? }.to(true)
    end
    it "should be able to be made public" do
      subject.make_private
      expect { subject.make_public }.to change{ subject.public? }.to(true)
    end
  end

  describe "email delivery settings" do
    subject { Plan.subscribe(@plan, @auth) }

    it "should be off for new subscription" do
      subject.should_not be_delivered_by_email
    end
    it "should be able to be turned on" do
      opts = {time: "morning", picked_version: nil, default_version: @esv_id}
      expect { subject.enable_email_delivery opts }.to change{ subject.delivered_by_email? }.to(true)
    end
    it "should be able to be turned off" do
      subject.enable_email_delivery(time: "morning", picked_version: nil, default_version: @esv_id)
      expect { subject.disable_email_delivery }.to change{ subject.delivered_by_email? }.to(false)
    end
    it "should ignore the users's default version if the plan has one" do
      subscription = Plan.subscribe('59-life-application-study-bible-devotion', @auth)
      subscription.enable_email_delivery(time: "morning", picked_version: nil, default_version: @esv_id)
      subscription.email_delivery_version_id.should == @nlt_id
    end
    it "should use the users's default version if there isn't a plan default" do
      subject.enable_email_delivery(time: "morning", picked_version: nil, default_version: @esv_id)
      subject.email_delivery_version_id.should == @esv_id
    end
    it "should allow the user to select the version for delivery" do
      subscription = Plan.subscribe('59-life-application-study-bible-devotion', @auth)
      subscription.enable_email_delivery(time: "morning", picked_version: @niv_id, default_version: @esv_id)
      subscription.email_delivery_version_id.should == @niv_id
    end
    it "should allow the user to change the delivery time" do
      subject.enable_email_delivery(time: "morning", picked_version: nil, default_version: @esv_id)
      expect {
        subject.enable_email_delivery(time: "afternoon", default_version: @esv_id)
        }.to change{ subject.email_delivery_time_range }.to('afternoon')
    end
  end

  describe "accountability" do
    subject { Plan.subscribe(@plan, @auth) }

    it "should be off for new subscription" do
      subject.should have(0).accountability_partners
    end
    it "should be able to be turned on" do
      expect { subject.add_accountability_user(@user_friend) }.to change{ subject.accountability_partners.count }.from(0).to(1)
    end
    it "should be able to be turned completely off" do
      subject.add_accountability_user(@user_friend)
      expect { subject.remove_all_accountability }.to change{ subject.accountability_partners.count }.to(0)
    end
    it "should be able to remove just one user" do
      subject.add_accountability_user(@user_friend)
      subject.add_accountability_user(@user)
      expect { subject.remove_accountability_user(@user_friend) }.to change{ subject.accountability_partners.count }.to(1)
      subject.accountability_partners.first.id.to_s.should == @user.id.to_s
    end
  end

  describe "making progress", only: true do
    describe "#progress" do
      it "should increase when you complete a day's references" do
        subscription = Plan.subscribe(@plan, @auth)
        original_progress = subscription.progress
        subscription.day(1).references.each do |r|
          subscription.set_ref_completion(1, r.ref, true)
        end
        Subscription.find(@plan, @auth).progress.should_not == original_progress
      end
      #Progress is API logic, nothing more to test here
    end
    describe "#day_statuses" do
      it "should mark a day as complete when a day's refs are completed" do
        subscription = Plan.subscribe(@plan, @auth)
        expect {
          subscription.day(1).references.each do |r|
            subscription.set_ref_completion(1, r.ref, true)
          end
        }.to change{ subscription.day_statuses.first.completed }.to(true)
      end
      it "should add a ref to the completed refs when completed" do
        subscription = Plan.subscribe(@plan, @auth)
        expect {
            subscription.set_ref_completion(1, 'gen.1.kjv', true)
        }.to change{ subscription.day_statuses.first.references_completed }.from([])
        subscription.day_statuses.first.completed.should_not be_true
      end
    end
    describe "#last_completed_date" do
      it "should be nil with no completions" do
        Plan.subscribe(@plan, @auth).last_completed_date.should be_nil
      end
      it "should be today when I complete today" do
        subscription = Plan.subscribe(@plan, @auth)
        expect {
          subscription.day(1).references.each do |r|
            subscription.set_ref_completion(1, r.ref.osis, true)
          end
        }.to change{ subscription.last_completed_date }.from(nil)
      end
    end
    describe "#last_completed_day" do
      it "should be nil with no completions" do
        Plan.subscribe(@plan, @auth).last_completed_day.should be_nil
      end
      it "should be today when I complete today" do
        subscription = Plan.subscribe(@plan, @auth)
        expect {
          subscription.day(1).references.each do |r|
            subscription.set_ref_completion(1, r.ref.osis, true)
          end
        }.to change{ subscription.last_completed_day }.to(1)
      end
    end

  end

  describe "dates" do
    subject{ Plan.subscribe(@plan, @auth) }
    it "should have the start" do
      subject.start.should == Date.today
    end
    it "should have and end date" do
      subject.end.should be > Date.today
    end
    it "should have the number of days" do
      subject.total_days.should == 365
    end
    describe "#current_day" do
      it "should give the current day" do
        subject.current_day.should == 1
      end
      it "should respect the user's UTC offset'" do
        pending "a good way to mock this once we're in API3 and know it's still needed"
      end
    end
  end
end
