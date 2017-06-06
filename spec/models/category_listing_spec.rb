require 'spec_helper'
#The CategoryListing examples fully exercise the PlanCategory subject code as well

describe CategoryListing do
  describe "#find" do
    describe "with no arguments" do
      subject { CategoryListing.find }
      it "should get the root categories" do
        should have_at_least(5).items
      end
      it "should have a human readable name" do
        devotional = subject.items.select{|c| c.slug == 'devotional'}.first
        devotional.name.should == "Devotional"
      end

      devotional = CategoryListing.find.items.select{|c| c.slug == 'devotional'}.first
      (Plan.available_locales & I18n.available_locales).each do |loc|
        specify "should have localized name for #{loc}" do
          I18n.locale = loc
          devotional.name.should be_present
          devotional.name.should_not == "Devotional" unless loc == :en
          I18n.locale = :en #to not affect other example states
        end
      end

      it "should have root slugs" do
        slugs = subject.items.map {|c| c.slug}

        slugs.each do |s|
          s.should =~ /^\w+$/
        end
      end
      it "should have no breadcrumbs" do
        subject.breadcrumbs.should be_empty
      end
    end

    describe "with a sub item argument" do
      subject { CategoryListing.find "devotional" }
      it "should have sub_root slugs" do
        slugs = subject.items.map {|c| c.slug}

        slugs.each do |s|
          s.should =~ /^devotional\.\w+$/
        end
      end
      it "should have breadcrumbs" do
        subject.breadcrumbs.should_not be_empty
      end
    end

    describe "with a locale filter" do
      subject { CategoryListing.find(nil, language_tag: :es) }
      it "should not have an english only item" do
        subject.items.map {|c| c.slug}.should_not include 'devotional.joyce_meyer_ministries'
      end
    end

  end

  describe "#breadcrumbs" do
    subject { CategoryListing.find("devotional").breadcrumbs }

    it "should have 1 breadcrumb with 1 sub category" do
      should have(1).item
    end

    it "should have a human readable name" do
      subject.first.name.should == "Devotional"
    end

    it "should have 2 breadcrumbs with a 1 deep category" do
      CategoryListing.find("devotional.joyce_meyer_ministries").breadcrumbs.should have(2).item
    end
  end

  describe "current item" do
    subject { CategoryListing.find("devotional") }

    it "should have a current name" do
      subject.current_name.should == "Devotional"
    end
    it "should have a current slug" do
      subject.current_slug.should == "devotional"
    end
  end
end

