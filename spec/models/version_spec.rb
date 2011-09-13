require 'spec_helper'

describe Version do
  use_vcr_cassette "version"

  describe ".all" do
    it "returns a hash of all versions" do
      versions = Version.all
      versions.should be_a Hash
      versions.has_key?("kjv").should be_true
      versions["kjv"].should be_a Version
    end

    it "returns all versions for a language" do
      versions = Version.all("en")
      versions.each do |k, v|
        v.language.should == "en"
      end

    end
  end

  describe ".languages" do
    it "returns an array of languages for which we have versions" do
      langs = Version.languages
      langs.should be_a Hash
      langs["en"].should == "English"
    end
  end

  describe ".all_by_language" do
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

end