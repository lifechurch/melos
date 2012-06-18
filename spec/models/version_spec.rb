require 'spec_helper'

describe Version do
  before(:all) do
    @kjv = Version.find(1)
    @kjv.title.should == "King James Version"
    @cevuk = Version.find(294)
    #@books_eng = Version.find[x]
    #@msg = Version.find[x]
  end

  describe "#all" do
    it "returns a hash of all versions" do
      versions = Version.all
      versions.should be_a Hash
      versions[@kjv.id].should be_a Version
      versions[@kjv.id].title.should == "King James Version"
    end

    it "returns all versions for a language" do
      versions = Version.all(@kjv.language)
      versions.should have_at_least(1).item
      versions.each do |k, v|
        v.language.should == @kjv.language
      end
    end
  end

  describe "#languages" do
    it "returns a hash of languages for which we have versions" do
      langs = Version.languages
      langs.should have_key @kjv.language.iso
      langs[@kjv.language.iso].should == "English"
    end
  end

  describe "#all_by_language" do
    it "returns a hash of hashes of versions, grouped by language" do
      langs = Version.all_by_language
      langs.should have_at_least(2).items
      langs[@kjv.language].should have_at_least(1).items
      langs[@kjv.language][@kjv.id].class.should == Version
    end
  end

  describe "#title" do
    it "returns the version's name" do
      Version.find(@kjv.id).title.should == "King James Version"
    end
  end

  describe "#abbreviation" do
    it "returns a lowercase version abbreviation" do
      Version.find(@kjv.id).abbreviation.should == "kjv"
    end
  end

  describe "#osis" do
    it "returns a lowercase osis abbreviation" do
      pending "this being replaced by abbreviation"
      Version.find("kjv").osis.should == "kjv"
    end
  end

  describe "#books" do
    it "returns a hash of books with chapter and verse counts" do
      @kjv.books.count.should == 66
      @kjv.books["gen"].chapters.should == 50
      pending "API supporting verses?"
      @kjv.books["gen"].chapter[1].verses.should == 31
    end
  end

  describe "#to_s" do
    it "returns the version name and abbreviation" do
      Version.find(@kjv.id).to_s.should =~ /King James Version.*(KJV)/i
    end
  end

  describe "#to_param" do
    it "params itself with a uuid" do
      Version.find(@kjv.id).to_param.should =~ /^1-/
    end
  end

  describe "#copyright" do
    before(:all) do
    end
    it "should return the short copyright" do
      pending "the API supporting msg"
      @msg.copyright.should include "Eugene H. Peterson by NavPress Publishing"
    end
    it "should return the short copyright by default" do
      @cevuk.copyright.should include "British & Foreign Bible Society"
    end
  end

  describe "#info" do
    it "should return the version info" do
      pending "the API supporting msg"
      @msg.info.should include "Language changes. New words are formed."
    end
    it "should return the info and copyright" do
      pending "an example with a long copyright in the DB"
      @cevuk.copyright(:long).should =~ "British & Foreign Bible Society"
      @cevuk.copyright(:long).should =~ "Copyright Information"
    end
  end

  describe "#audio_version?" do
    it "should be true for a version with audio support" do
      @kjv.should be_audio_version
    end
    it "should false for a version without audio support" do
      pending "the API having a non-audio version"
      @msg.should_not be_audio_version
    end
  end

  describe "#include?" do
    it "should be true for an OT ref in a full Bible" do
      @kjv.should include Reference.new("gen.1.kjv")
    end
    it "should be false for an OT ref in a NT only bible" do
      pending "the API getting books_eng in"
      @books_eng.should_not include Reference.new("gen.1.1")
    end
  end

  describe "#default_for" do
    it "should return the default osis for english" do
      Version.default_for("en").should == 1
    end
    it "should not return nil for any supported language" do
      pending "The API adding support for en-GB"
      I18n.available_locales.each do |loc|
        Version.default_for(loc).should_not be_nil
      end
    end
  end

  describe "#sample_for" do
    it "should return a version for each language" do
      pending "The API adding support for en-GB"
      I18n.available_locales.each do |loc|
        Version.sample_for(loc).should_not be_nil
      end
    end
    describe "when excepting a version" do
      before(:each) do
        ntv_rvc_only = filtered_all_by_language languages: ['es'], versions: %w(ntv rvc)
        Version.stub(:all_by_language).and_return(ntv_rvc_only)
      end
      it "should not return the excepted version" do
        Version.sample_for('es', except: 'ntv').should_not == "ntv"
      end
      it "should return another version" do
        Version.sample_for('es', except: 'ntv').should == 'rvc'
      end
      it "should return nil if the excepted version was the only one" do
        rvc_only = filtered_all_by_language languages: ['es'], versions: %w(rvc)
        Version.stub(:all_by_language).and_return(rvc_only)
        Version.sample_for('es', except: 'rvc').should be_nil
      end
    end
    describe "when ensureing sample has a reference" do
      before(:each) do
        books_niv_only = filtered_all_by_language languages: ['en'], versions: %w(books-eng niv)
        @gen_1 = Reference.new('gen.1')
        Version.stub(:all_by_language).and_return(books_niv_only)
      end
      it "should return a version with the reference" do
        10.times do  #.0001% chance at missing books-eng
          Version.sample_for('en', has_ref: @gen_1).should == 'niv'
        end
      end
      it "should return nil if there isn't a version with the reference" do
        books_only = filtered_all_by_language languages: ['en'], versions: %w(books-eng)
        Version.stub(:all_by_language).and_return(books_only)

        Version.sample_for('en', has_ref: @gen_1).should be_nil
      end
      it "should return nil if the only version with the reference is excepted" do
        Version.sample_for('en', has_ref: @gen_1, except: 'niv').should be_nil
      end
    end
  end
end
