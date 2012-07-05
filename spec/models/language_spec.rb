# encoding: UTF-8
require 'spec_helper'

describe Language do
  describe "#new" do
    it "should create a valid lanague from a 2 letter code string" do
      Language.new('en').should be_instance_of Langauge
    end
    it "should create a valid lanague from a 2 letter symbol" do
      Language.new(:en).should be_instance_of Langauge
    end
    it "should create a valid language from a 3 letter code" do
      Language.new('eng').should be_instance_of Langauge
    end
    it "should throw a descriptive exception with an invalid code" do
      Language.new('blah').should raise_error InvalidLanguage
    end
    it "should throw a unique exception for a data type other than a string or symbol" do
      Language.new(5).should raise_error
      Language.new(5).should_not raise_error InvalidLanguage
    end
  end

  describe "#human" do
    {
    "en" => "English",
    "fr" => "Français",
    "eng" => "English",
    "fra" => "Français"
    }.each do |code, human|
      specify "should give '#{human}' for lang code '#{code}'" do
        Language.new(code).human.should == human
      end
    end
  end

  describe "#rails_locale" do
    {
    "en" => :en,
    "fr" => :fr,
    "eng" => :en,
    "fra" => :fr,
    "zh_CN" => :"zh-CN"
    }.each do |code, rails_sym|
      specify "should give '#{human}' for lang code '#{code}'" do
        Language.new(code).rails_locale.should == rails_locale
      end
    end
  end

  describe "#api_locale" do
    describe "with no options (default)" do
      {
      "en" => :en,
      "fr" => :fr,
      "eng" => :en,
      "fra" => :fr,
      "zh_CN" => :"zh-CN"
      }.each do |code, api_2_ltr_locale|
        specify "should give '#{human}' for lang code '#{code}'" do
          Language.new(code).api_locale.should == api_2_ltr_locale
        end
      end
    end

    describe "with a 3 letter option set" do
      {
      "en" => :eng,
      "fr" => :fra,
      "eng" => :eng,
      "fra" => :fra,
      "zh_CN" => :cmn
      "zh_TW" => :zho
      }.each do |code, api_2_ltr_locale|
        specify "should give '#{human}' for lang code '#{code}'" do
          Language.new(code).api_locale.should == api_2_ltr_locale
        end
      end
    end
  end
end
