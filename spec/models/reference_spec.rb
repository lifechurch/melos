require 'spec_helper'

describe Reference do

  before :each do
    @gen_1_1_kjv_ref = Reference.new("gen.1.1.kjv")
    @gen_1_2_kjv_ref = Reference.new("gen.1.2.kjv")
    @gen_1_kjv_ref = Reference.new("gen.1.kjv")
    @gen_1_1_ref = Reference.new("gen.1.1")
  end

  describe "#initialize" do
    it "should be able to be created from a string" do
      Reference.new("gen.1.1.kjv").should be_valid
    end
    it "should be able to be created from a hash" do
      Reference.new({book: "gen", chapter: 1, version: "kjv"}).should be_valid
    end
    it "should be able to be created from a Mash" do
      pending "us actually needing this -- removed for now to test that theory"
      Reference.new(Hashie::Mash.new({osis: "gen.1.1.kjv", human: "Genesis 1:1"})).should be_valid
    end
  end

  describe "#valid?" do
    describe "with a valid reference string" do
      valid_refs = %w(gen.1 gen.1.1 gen.1.1-3 gen.1.kjv gen.1.1.kjv gen.1.1-3.kjv john.1.1.books-eng)
      valid_refs.each do |ref|
        specify "#{ref} should be valid" do
          Reference.new(ref).should be_valid
        end
      end
    end
    describe "with an invalid reference string" do
      invalid_refs = %w(gen.100 gen.1.books-eng gen.1.invalid gen.1.1.invalid gen.1.1-3.invalid gen.1.1.books-eng)
      invalid_refs.each do |ref|
        specify "#{ref} should be invalid" do
          Reference.new(ref).should_not be_valid
        end
      end

      it "gen.1.1-100 should be invalid" do
        pending "reference rewrite to pull verses and ranges from chapters"
        Reference.new('gen.1.1-100').should_not be_valid
      end

      it "gen should be invalid" do
        pending "reference rewrite to pull verses and ranges from chapters"
        Reference.new('gen').should_not be_valid
      end
    end
  end

  describe "#book" do
    it "should be the correct book" do
      @gen_1_2_kjv_ref.book == 'Genesis'
    end
  end

  describe "#chapter" do
    it "should be the correct chapter" do
      @gen_1_2_kjv_ref.chapter == 1
    end
  end

  describe "#verse" do
    it "should be the correct verse" do
      @gen_1_2_kjv_ref.verses == 2
    end
  end

  describe "#version" do
    it "should be the correct version" do
      @gen_1_2_kjv_ref.version == 'KJV'
    end
  end


  describe "#merge" do
    it "should give a new reference with the argument merged into the old one" do
      @gen_1_1_kjv_ref.merge(book: "exod").should == Reference.new("exod.1.1.kjv")
    end
  end

  describe "#to_s" do
    it "should give a human readable string of a versionless reference" do
      @gen_1_1_ref.to_s.should include 'Genesis'
      @gen_1_1_ref.to_s.should include '1:1'
    end
    it "should give a human readable string for a versioned verse" do
      @gen_1_1_kjv_ref.to_s.should include 'Genesis'
      @gen_1_1_kjv_ref.to_s.should include '1:1'
      @gen_1_1_kjv_ref.to_s.should include 'KJV'
    end
    it "should give a human readable string for a versioned verse range" do
      ref = Reference.new("gen.1.2-3.kjv").to_s
      ref.should include 'Genesis'
      ref.should include '1:2-3'
      ref.should include 'KJV'
    end
    describe "with version: false option" do
      it "should give the chapter" do
        @gen_1_kjv_ref.to_s(version: false).should =~ /^Genesis/
      end
      it "should give the book" do
        @gen_1_kjv_ref.to_s(version: false).should =~ / 1$/
      end
      it "should give the verse" do
        @gen_1_1_kjv_ref.to_s(version: false).should =~ /:1$/
      end
      it "should not give the version" do
        @gen_1_1_kjv_ref.to_s(version: false).should_not =~ /(KJV|King)/i
        @gen_1_kjv_ref.to_s(version: false).should_not =~ /(KJV|King)/i
      end
    end

  end

  describe "#version_string" do
    it "should give the abbreviation for the reference version" do
      @gen_1_1_kjv_ref.version_string.should == "KJV"
    end
  end

  describe "#to_hash" do
    subject {@gen_1_1_kjv_ref.to_hash}
    it "should give a hash of book, chapter, verse, version" do
      should have_key :book
      should have_key :chapter
      should have_key :verses
      should have_key :version
    end
    it "should match the values" do
      subject[:book].should == 'GEN'
      subject[:chapter].should == 1
      subject[:verses].should == 1
      subject[:version].should == 1
    end
  end

  describe "#hash" do
    it "should give a unique hash" do
      @gen_1_1_kjv_ref.hash.should_not == @gen_1_kjv.hash
    end
    it "should give the same hash for the same verse" do
      @gen_1_1_kjv_ref.hash.should == Reference.new("gen.1.1.kjv").hash
    end

  end

  describe "to_param" do
    it "should parameterize itself as a string" do
      @gen_1_1_kjv_ref.to_param.should =~ /GEN.1.1.1-KJV/i
    end
  end

  describe "#to_api_string" do
    it "should give a /notes API-frendly string" do
      @gen_1_1_kjv_ref.notes_api_string.should == "GEN.1.1"
      Reference.new("gen.1.1-3.kjv").notes_api_string.should == "GEN.1.1+GEN.1.2+GEN.1.3"
      @gen_1_kjv_ref.notes_api_string.should == "GEN.1.1+GEN.1.2+GEN.1.3+GEN.1.4+GEN.1.5+GEN.1.6+GEN.1.7+GEN.1.8+GEN.1.9+GEN.1.10+GEN.1.11+GEN.1.12+GEN.1.13+GEN.1.14+GEN.1.15+GEN.1.16+GEN.1.17+GEN.1.18+GEN.1.19+GEN.1.20+GEN.1.21+GEN.1.22+GEN.1.23+GEN.1.24+GEN.1.25+GEN.1.26+GEN.1.27+GEN.1.28+GEN.1.29+GEN.1.30+GEN.1.31"
    end
    it "should work with an invalid reference" do
      Reference.new("gen.1.1-3,6.kjv").notes_api_string.should == "GEN.1.1+GEN.1.2+GEN.1.3+GEN.1.6"
    end
  end

  describe "[]" do
    it "should index the reference like a hash" do
      ref = Reference.new('gen.1.2.kjv')
      ref[:book].should == 'GEN'
      ref[:chapter].should == 1
      ref[:verses].should == 2
      ref[:version].should == 1
    end
  end

  describe "#content" do
    it "should have only the text of a single verse" do
      @gen_1_1_kjv_ref.content.should include "In the beginning God created the heaven and the earth."
      pending "verse parinig"
      @gen_1_1_kjv_ref.content.should_not include "And the earth was without form"
    end
    it "should have the text of a chapter" do
      @gen_1_kjv_ref.content.should include "In the beginning God created the heaven and the earth."
      @gen_1_kjv_ref.content.should include "And the earth was without form"
    end
    it "should give the html for a chapter" do
      @gen_1_kjv_ref.content.should include "<div class=\" chapter_heading"
      @gen_1_kjv_ref.content.should include "class=\" verse_content"
    end
    it "should give the html for a verse" do
      @gen_1_1_kjv_ref.content.should include "class=\" verse_content"
      pending "verse parinig"
      @gen_1_1_kjv_ref.content.should_not include "<div class=\" chapter_heading"
    end
    it "should have particular html classes" do
      pending "reference rewrite will show how to fully test this"
    end
  end

  describe "#previous_chapter" do
    it "should give nil for the first chatper" do
      @gen_1_kjv_ref.previous_chapter.should be_nil
    end
    it "should span books properly" do
      Reference.new('EXO.1.kjv').previous_chapter.should == Reference.new('Gen.50.kjv')
    end
    it "should span canons properly" do
      Reference.new('MAT.1.kjv').previous_chapter.should == Reference.new('MAL.4.kjv')
    end
    it "should be the previous chapter reference" do
      Reference.new("gen.2.kjv").previous_chapter.should == @gen_1_kjv_ref
    end
    it "should work for last book" do
      Reference.new('Rev.22').previous_chapter.should == Reference.new('Rev.21.kjv')
    end
  end

  describe "#next_chapter" do
    it "should give nil for the last chatper" do
      Reference.new('Rev.22').next_chapter.should be_nil
    end
    it "should span to books properly" do
      Reference.new('GEN.50.kjv').next_chapter.should == Reference.new('EXO.1.kjv')
    end
    it "should span canon's properly" do
      Reference.new('MAL.4.kjv').next_chapter.should == Reference.new('MAT.1.kjv')
    end
    it "should return the next book" do
      Reference.new('Rev.21').next_chapter.should == Reference.new('Rev.22.kjv')
    end
  end

  describe "#verses_in_chapter" do

  end

  describe "#short_link" do
    it "should be a link to bible.us" do
      @gen_1_kjv_ref.short_link.should =~ %r(^http://bible.us/)
    end
    it "should have the format that our old facebook and g+ counts use"
  end

  describe "#human" do
    it "should give the chapter" do
      @gen_1_kjv_ref.human.should =~ /^Genesis/
    end
    it "should give the book" do
      @gen_1_kjv_ref.human.should =~ / 1$/
    end
    it "should give the verse" do
      @gen_1_1_kjv_ref.human.should =~ /:1$/
    end
    it "should not give the version" do
      @gen_1_1_kjv_ref.human.should_not =~ /(KJV|King)/i
      @gen_1_kjv_ref.human.should_not =~ /(KJV|King)/i
    end
  end

  describe "#is_chapter" do
    it "should be true for a chapter ref" do
      @gen_1_kjv_ref.is_chapter?.should be_true
      #TODO: make this predicate .chapter? instead
    end
    it "should be false for a full ref" do
      @gen_1_1_kjv_ref.is_chapter?.should_not be_true
    end
  end

  describe "#copyright" do
    it "should be the copyright text for the reference's version" do
      [Reference.new("gen.1.niv"), Reference.new("gen.1.1.niv"), Reference.new("gen.1.1-3.niv")].each do |ref|
        ref.copyright.should == "Holy Bible, New International Version, NIV. Copyright 1973, 1978, 1984, 2011 by Biblica, Inc. Used by permission. All rights reserved worldwide."
      end
    end

    it "should be nil for versions with no copyright" do
      Reference.new("gen.1.1.kjv").copyright.should be_nil
    end
  end

  describe "#{}verses_string" do
    it "should give a csv of the verses in a ranged reference" do
      Reference.new('gen.1.1-5').verses_string.should == '1,2,3,4,5'
    end
    it "should give a csv of the verses in a comma separated reference" do
      Reference.new('gen.1.1,3-5').verses_string.should == '1,3,4,5'
    end

  end

  describe "#audio" do
    it "should contain a link to an mp3" do
      @gen_1_kjv_ref.audio.url.should =~ /mp3/
    end
    it "should be a secure url" do
      @gen_1_kjv_ref.audio.url.should =~ /^https:/
    end
  end
end
