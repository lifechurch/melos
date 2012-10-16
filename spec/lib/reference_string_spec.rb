# encoding: UTF-8
require File.dirname(__FILE__) + '/../spec_helper'
require 'benchmark'

describe YouVersion::ReferenceString do
  before(:each) do
    @str = YouVersion::ReferenceString.new("jhn.1.kjv")
  end

  describe "instantiation" do
    it "should be instantiable" do
      str = YouVersion::ReferenceString.new("jhn.1.kjv")
      str.is_a?(YouVersion::ReferenceString).should be_true
    end
  end

  describe ".raw and .to_s" do
    it "should return the raw initial reference string" do
      ref = "jhn.1.kjv"
      str = YouVersion::ReferenceString.new("jhn.1.kjv")
      str.raw.should == ref
      str.to_s.should == ref
    end
  end

  describe ".[] (hash access)" do
    subject {YouVersion::ReferenceString.new("jhn.1.2-3.kjv")}
    it "should return the hash elements" do
      subject[:book].should == "jhn"
      subject[:chapter].should == "1"
      subject[:version].should == "kjv"
      subject[:verses].should == "2-3"
    end
  end

  describe 'with a valid reference string' do
    describe ".hash" do
      {
        'Gen.1-kjv' => {def: 'book with version',                       book: 'Gen', chap: nil, verses: nil,    version: '1-kjv'},
        'Gen' => {def: 'book only',                                     book: 'Gen', chap: nil, verses: nil,    version: nil},
        'Gen.1' => {def: 'chapter only',                                book: 'Gen', chap: '1', verses: nil,    version: nil},
        'ESG.1_1' => {def: 'greek ester chapters',                      book: 'ESG', chap: '1_1', verses: nil,    version: nil},
        'jhn.1.1-5,7.kjv' => {def: "legacy with range and single verse",book: 'jhn', chap: '1', verses: "1-5,7",version: 'kjv'},
        'Gen.1.kjv' => {def: 'legacy osis version',                     book: 'Gen', chap: '1', verses: nil,    version: 'kjv'},
        'Gen.1.2.kjv' => {def: 'legacy osis version with verse',        book: 'Gen', chap: '1', verses: '2',    version: 'kjv'},
        'Gen.1.2-3.kjv' => {def: 'legacy osis version with verse range',book: 'Gen', chap: '1', verses: '2-3',  version: 'kjv'},
        'Gen.1.1-kjv' => {def: 'API3 version',                          book: 'Gen', chap: '1', verses: nil,    version: '1-kjv'},
        'Gen.1.2.1-kjv' => {def: 'API3 version with verse',             book: 'Gen', chap: '1', verses: '2',    version: '1-kjv'},
        'jhn.1.1-5,7.1-kjv' => {def: "API3 version with range and single verse",book: 'jhn', chap: '1', verses: "1-5,7",version: '1-kjv'},
        'Gen.1.2-3.1-kjv' => {def: 'API3 version with verse range',     book: 'Gen', chap: '1', verses: '2-3',  version: '1-kjv'},
        'esg.intro1.69-gntd' => {def: 'API3 version with verse range',  book: 'esg', chap: 'intro1', verses: nil,  version: '69-gntd'},
        'S3Y.1.1.296-GNB' => {def: 'GNB, book with # in middle',        book: 'S3Y', chap: '1', verses: '1',  version: '296-GNB'},
        'act.1.47-cunpss-上帝' => {def: 'version abbrev w/ utf-8',         book: 'act', chap: '1', verses: nil,  version: '47-cunpss-上帝'}
      }.each do |ref_str, expect|
        specify "should split to hash for '#{ref_str}' (a #{expect[:def]})" do
          string  = YouVersion::ReferenceString.new(ref_str)
          subject = string.hash

          subject[:book].should == expect[:book]
          subject[:chapter].should == expect[:chap]
          subject[:verses].should == expect[:verses]
          subject[:version].should == expect[:version]
        end
      end
    end
    describe ".verses" do
      {
        'Gen.1-kjv' => {def: 'book with version'},
        'Gen' => {def: 'book only'},
        'Gen.1' => {def: 'chapter only'},
        'ESG.1_1' => {def: 'greek ester chapters'},
        'Gen.1.kjv' => {def: 'legacy osis version'},
        'esg.intro1.69-gntd' => {def: 'API3 version with verse range'}
      }.each do |ref_str, expect|
        specify "should return an empty verse array for '#{ref_str}' (a #{expect[:def]})" do
          string  = YouVersion::ReferenceString.new(ref_str)
          verses = string.verses

          verses.is_a?(Array).should be_true
          verses.should be_empty
        end
      end

      {
        'Gen.1.1.kjv'   => {def: 'legacy ref with single verse', verses: [1]},
        'Gen.1.1.1-kjv' => {def: 'API3 ref with single verse', verses: [1]},
        'Gen.1.1-3.kjv'   => {def: 'legacy ref with verse range', verses: [1,2,3]},
        'Gen.1.1-3.1-kjv' => {def: 'API3 ref with verse range', verses: [1,2,3]},
        'Gen.1.1-3,10-12.kjv'   => {def: 'legacy ref with multi verse range', verses: [1,2,3,10,11,12]},
        'Gen.1.1-3,10-12.1-kjv' => {def: 'API3 ref with multi verse range', verses: [1,2,3,10,11,12]},
        'Gen.1.1-3,15.kjv'   => {def: 'legacy ref with verse range and single', verses: [1,2,3,15]},
        'Gen.1.1-3,15.1-kjv' => {def: 'API3 ref with verse range and single', verses: [1,2,3,15]},
        'Gen.1.15,1-3.kjv'   => {def: 'legacy ref with single and range', verses: [15,1,2,3]},
        'Gen.1.15,1-3.1-kjv' => {def: 'API3 ref with single and range', verses: [15,1,2,3]},
        'Gen.1.15,1,8,22.kjv'   => {def: 'legacy ref with comma separated verses', verses: [15,1,8,22]},
        'Gen.1.15,1,8,22.1-kjv' => {def: 'API3 ref with  comma separated verses', verses: [15,1,8,22]}
      }.each do |ref_str, expect|
        specify "should return correct verses in an array for '#{ref_str}' (a #{expect[:def]})" do
          string  = YouVersion::ReferenceString.new(ref_str)
          verses = string.verses
          verses.should == expect[:verses]
        end
      end

    end
  end
end