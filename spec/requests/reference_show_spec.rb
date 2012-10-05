require 'spec_helper'

describe "Requesting the Reader" do

  before(:each) do
    @base_url = "http://www.example.com"
  end

  describe "with an invalid reference" do

    it "should 404" do
      get "/bible/RSV/Ezekiel-8"
      response.code.should == "404"
      response.should render_template(:invalid_ref)
    end

    it "should redirect without a chapter" do
      get "/bible/1/jhn"
      response.code.should == "302"
      response.location.should == "#{@base_url}/bible/1/jhn.1.kjv"
    end

  end

end
