require File.dirname(__FILE__) + '/../spec_helper'
require 'benchmark'

describe YV::API::Client do
  describe ".get" do
    it "gets from the API successfully" do
      response = YV::API::Client.get("bible/configuration")
      response.body["code"].should == 200
    end

    it "raises an informative exception if an API call fails" do
      response = YV::API::Client.get("bible/publisher")
      response.body["data"]["errors"].should_not be_nil
    end

  end

  describe ".post" do
    it "posts to the API and receives an error" do
      response = YV::API::Client.post("users/authenticate", auth: {username: "asdf", password: "ghjkl"}, debug: true)
      response.body["data"]["errors"].should_not be_nil
    end

    it "posts to the API successfully" do
      response = YV::API::Client.post("users/authenticate", auth: {username: "matt", password: "staging"}, debug: true)
      response.should_not be_nil
    end
  end
end
