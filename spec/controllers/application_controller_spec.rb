require 'spec_helper'

describe ApplicationController do
  controller do
    def index
      render text: "foo"
    end
  end

  describe "#set_locale" do
    it "sets locale to en for www" do
      request.host = "www.youversion.com"
      get :index
      I18n.locale.should == :en
      response.cookies["locale"].should == "en"
    end

    it "sets locale to fr for fr" do
      request.host = "fr.youversion.com"
      get :index
      I18n.locale.should == :fr
      response.cookies["locale"].should == "fr"
    end
  end
end