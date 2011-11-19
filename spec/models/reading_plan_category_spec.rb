require 'spec_helper'

describe ReadingPlanCategory do
  # use_vcr_cassette "reading_plan_category"

  describe ".find" do
    it "finds the root category with no argument" do
      category = ReadingPlanCategory.find
      category.id.should == "root"
      category.children.should_not be_empty
      category.children.first.id.should == "devotional"
    end

    it "finds a category with an argument" do
      category = ReadingPlanCategory.find("devotional")
      category.id.should == "devotional"
    end
  end

  describe "#label" do
    it "returns a localized label" do
      category = ReadingPlanCategory.find("devotional")
      I18n.locale = :en
      category.label.should == "Devotional"
      I18n.locale = :de
      category.label.should == "Andacht"
    end
  end
end
