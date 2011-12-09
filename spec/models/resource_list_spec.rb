require 'spec_helper'

describe ResourceList do
  before :all do
    @short_array = %w{foo bar baz}
  end

  describe "#total_pages" do
    it "returns the number of pages for a list" do
      list = ResourceList.new
      list << @short_array
      list.total = 30
      list.total_pages.should == 2
      
    end
  end

  describe "#has_pages" do
    it "returns true if a list has more than one page" do
      list = ResourceList.new
      list << @short_array
      list.total = 30
      list.has_pages.should be_true
    end
  end
end
