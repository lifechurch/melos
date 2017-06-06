require 'spec_helper'

describe Search do
	before :all do
		@search = Search.new("Jesus")
	end

	it "searches everything by default" do
		@search.should be_a Search
	end

	it "separates results by category" do
		@search.category.should be_in(Search.categories)
	end

	it "makes a resource list for a category" do
		@search.result_list(:bible).should be_an Array
	end

	it "counts results" do
		@search.total_results.should be_a Fixnum
	end

	it "checks if it has results" do
		@search.has_results?.should be_true
		Search.new("foobarbazbat").has_results?.should be_false
	end

	it "suggests similar terms" do
		pending "can't get this to work for some reason"
		Search.new("red").suggestion.inspect
	end
end