require File.dirname(__FILE__) + '/../spec_helper'
require 'yv_api'
require 'benchmark'

describe YvApi do
  describe ".get" do
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
      list.first.human.should == "Genesis"
    end
  end

  describe ".post" do
    it "posts to the API" do
      lambda do
        YvApi.post("users/authenticate", auth_username: "asdf", auth_password: "ghjkl")
      end.should raise_error(RuntimeError, "API Error: Username or password is invalid")
    end
  end

  describe '.parse_reference_string', :only => true do
    describe 'with a valid reference string' do
      {
        'Gen.1-kjv' => {def: 'book with version',                       book: 'Gen', chap: nil, verses: nil,    version: '1-kjv'},
        'Gen' => {def: 'book only',                                     book: 'Gen', chap: nil, verses: nil,    version: nil},
        'Gen.1' => {def: 'chapter only',                                book: 'Gen', chap: '1', verses: nil,    version: nil},
        'Gen.1.kjv' => {def: 'legacy osis version',                     book: 'Gen', chap: '1', verses: nil,    version: 'kjv'},
        'Gen.1.2.kjv' => {def: 'legacy osis version with verse',        book: 'Gen', chap: '1', verses: '2',    version: 'kjv'},
        'Gen.1.2-3.kjv' => {def: 'legacy osis version with verse range',book: 'Gen', chap: '1', verses: '2-3',  version: 'kjv'},
        'Gen.1.1-kjv' => {def: 'API3 version',                          book: 'Gen', chap: '1', verses: nil,    version: '1-kjv'},
        'Gen.1.2.1-kjv' => {def: 'API3 version with verse',             book: 'Gen', chap: '1', verses: '2',    version: '1-kjv'},
        'Gen.1.2-3.1-kjv' => {def: 'API3 version with verse range',     book: 'Gen', chap: '1', verses: '2-3',  version: '1-kjv'},
      }.each do |ref_str, expect|
        specify "should split to hash for '#{ref_str}' (a #{expect[:def]})" do
          subject = YvApi.parse_reference_string(ref_str)

          subject[:book].should == expect[:book]
          subject[:chapter].should == expect[:chap]
          subject[:verses].should == expect[:verses]
          subject[:version].should == expect[:version]
        end
      end
    end
    it "should execute in less than 100us" do
      Benchmark::realtime{YvApi.parse_reference_string('gen.1.1.asv')}.should < 0.0001
    end
  end
end
