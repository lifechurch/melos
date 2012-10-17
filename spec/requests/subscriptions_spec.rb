require 'spec_helper'

describe "A users reading plans (subscriptions)" do

  describe "Getting the list (index)" do

    it "should deliver the goods for /users/BrittTheIsh/reading-plans" do
      get "/users/BrittTheIsh/reading-plans"
      response.code.should == "200"
      response.should render_template(:index)
    end

  end

end