require 'spec_helper'

describe "Requesting a Search (Search#show)" do

  before do
    @base_url = "http://www.example.com"
  end

  describe "with a bible search" do
    {
      'Exodus 1 AMP' => 'EXOD.1.AMP',
      'Exodus 9' => 'EXOD.9.KJV',
    }.each do |query, ref_str|
      specify "should redirect to reader for '#{query}' search" do
        url = search_path(q: query)
        get(url)
        response.should redirect_to(bible_path(Reference.new(ref_str)))
      end
    end
  end

  describe "with an intentional search" do
    [
      'Exodus Abraham',
      'John Tyler',
      'John'
    ].each do |query, ref_str|
      specify "should not redirect to reader for '#{query}' search" do
        url = search_path(q: query)
        get(url)
        response.should render_template('search/show')
      end
    end
  end
end
