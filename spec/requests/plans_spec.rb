require 'spec_helper'

describe "Requesting Reading Plans" do

  before do
    @base_url = "http://www.example.com"
  end

  describe "the index page (plans#index)" do

    it "should render corectly" do

      get "/reading-plans"
      response.code.should == "200"
      response.should render_template(:index)

    end

  end


  describe "the show page (plans#show)" do

    it "should render corectly" do

      get "/reading-plans/45-wisdom"
      response.code.should == "200"
      response.should render_template(:show)

    end

  end

end