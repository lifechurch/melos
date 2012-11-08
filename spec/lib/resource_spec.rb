# encoding: UTF-8
require 'spec_helper'
include YouVersion

describe YouVersion::Resource do
  describe "#Resource.i18nize" do
    before(:each) do
      I18n.locale = I18n.default_locale
    end
    it "should return nil for nil mash" do
      mash = Hashie::Mash.new({html: nil, text: nil})
      Resource.i18nize(mash).should be_nil
    end
    it "should use the default with no l10ns" do
      mash = Hashie::Mash.new({default: "pass"})
      Resource.i18nize(mash).should == "pass"
    end
    it "should use the default if no matching l10ns" do
      mash = Hashie::Mash.new({default: "pass", en:"fail"})
      I18n.locale = :es
      Resource.i18nize(mash).should == "pass"
    end
    it "should use a matching l10n" do
      mash = Hashie::Mash.new({default: "fail", en: "fail", ja: "pass"})
      I18n.locale = :ja
      Resource.i18nize(mash).should == "pass"
    end
    it "should use the matching html l10n" do
      mash = Hashie::Mash.new({
                             html: Hashie::Mash.new({default: "fail", ja: "pass"}),
                             text: Hashie::Mash.new({default: "fail", ja: "fail"})
                             })
      I18n.locale = :ja
      Resource.i18nize(mash).should == "pass"
    end
    it "should use the matching text l10n" do
      mash = Hashie::Mash.new({
                             html: Hashie::Mash.new({default: nil, ja: nil}),
                             text: Hashie::Mash.new({default: "fail", ja: "pass"})
                             })
      I18n.locale = :ja
      Resource.i18nize(mash).should == "pass"
    end
    it "should use the html value without l10n" do
      mash = Hashie::Mash.new({
                               html: Hashie::Mash.new({default: "pass"}),
                               text: Hashie::Mash.new({default: "fail"})
                               })
      Resource.i18nize(mash).should == "pass"
    end
    it "should use the text value without l10n" do
      mash = Hashie::Mash.new({
                               html: Hashie::Mash.new({default: nil}),
                               text: Hashie::Mash.new({default: "pass"})
                               })
      Resource.i18nize(mash).should == "pass"
    end
      it "should use the string html value" do
      mash = Hashie::Mash.new({html: "pass", text: "fail"})
      Resource.i18nize(mash).should == "pass"
    end
    it "should use the string text value" do
      mash = Hashie::Mash.new({html: nil, text: "pass"})
      Resource.i18nize(mash).should == "pass"
    end
  end
end
