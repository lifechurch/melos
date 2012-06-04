require 'spec_helper'

describe Version do

  describe "#all" do
    it "returns a hash of all versions" do
      versions = Version.all
      versions.should be_a Hash
      versions.has_key?("kjv").should be_true
      versions["kjv"].should be_a Version
    end

    it "returns all versions for a language" do
      versions = Version.all("en")
      versions.each do |k, v|
        v.language.iso.should == "en"
      end

    end
  end
  
  describe "#languages" do
    it "returns an array of languages for which we have versions" do
      langs = Version.languages
      langs.should be_a Hash
      langs["en"].should == "English"
    end
  end

  describe "#all_by_language" do
    it "returns a hash of hashes of versions, grouped by language" do
      langs = Version.all_by_language
      langs["en"]["kjv"].class.should == Version
    end
  end

  describe "#title" do
    it "returns the version's name" do
      Version.find("kjv").title.should == "King James Version"
    end
  end

  describe "#osis" do
    it "returns a lowercase osis abbreviation" do
      Version.find("kjv").osis.should == "kjv"
    end
  end

  describe "#books" do
    it "returns a hash of books with chapter and verse counts" do
      kjv = Version.find("kjv")
      kjv.books.count.should == 66
      kjv.books["gen"].chapters.should == 50
      kjv.books["gen"].chapter[1].verses.should == 31
    end
  end

  describe "#to_s" do
    it "returns the version name and abbreviation" do
      Version.find("kjv").to_s.should == "King James Version (KJV)"
    end
  end

  describe "#to_param" do
    it "params itself with a lowercase abbreviation" do
      Version.find("msg").to_param.should == "msg"
    end
  end

  describe "#copyright" do
    it "should return the short copyright" do
      Version.find("msg").copyright.should include "Eugene H. Peterson by NavPress Publishing"
    end
  end

  describe "#info" do
    it "should return the version info" do
      Version.find("msg").info.should include "Language changes. New words are formed."
    end
  end
  
  describe "#audio_version?" do 
    it "should be true for a version with audio support" do
      Version.find("kjv").should be_audio_version
    end
    it "should false for a version without audio support" do
      Version.find("msg").should_not be_audio_version
    end
  end
  
  describe "#include?" do
    it "should be true for an OT ref in a full Bible" do
      Version.find("kjv").should include Reference.new("gen.1.1")
    end
    it "should be false for an OT ref in a NT only bible" do
      Version.find("books-eng").should_not include Reference.new("gen.1.1")
    end
  end

  describe "#default_for" do
    it "should return the default osis for english" do
      Version.default_for("en").should == "kjv"
    end
    it "should not return nil for any supported language" do
      I18n.available_locales.each do |loc|
        Version.default_for(loc).should_not be_nil
      end
    end
  end
  
  describe "#sample_for" do
    it "should return a version for a language"
    it "should return a different version in that language than the excepted version"
    it "should return a version that contains a reference, if specified"
  end
end
