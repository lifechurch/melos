require File.dirname(__FILE__) + '/../spec_helper'
require 'yv_api'

describe YvApi, "GETting the YV API" do
  use_vcr_cassette "api-get"

  it "gets a KJV booklist" do
    list = YvApi.get("bible/books", version: "kjv")
    list[0].human.should == "Genesis"
  end


  it "raises an informative exception if an API call fails" do
    lambda do
      YvApi.get("bible/books", version: "kjvff")
    end.should raise_error(RuntimeError, "API Error: Version is invalid")
  end

  it "uses a block to recover from an API error if it exists" do
    list = YvApi.get("bible/books", version: "kjvff2") do | e |
      e[0]["error"].should == "Version is invalid"
      YvApi.get("bible/books", version: "kjv")
    end
    list[0].human.should == "Genesis"
  end
end
