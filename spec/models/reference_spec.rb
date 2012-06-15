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
      invalid_refs = %w(gen.100 gen.1.100 gen.1.books-eng gen.1.invalid gen.1.1.invalid gen.1.1-3.invalid gen.1.1.books-eng)
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
      @gen_1_2_kjv_ref.verse == 2
    end
  end

  describe "#version" do
    it "should be the correct version" do
      @gen_1_2_kjv_ref.version == 'KJV'
    end
  end


  describe "#merge" do
    it "should give a new reference with the argument merged into the old one" do
      @gen_1_1_kjv_ref.merge(book: "exod").osis.should == "exod.1.1.kjv"
    end
  end

  describe "#merge!" do
    it "should merge the arg into the existing reference object" do
      ref = Reference.new("gen.1.1.kjv")
      ref.merge!(book: "exod")
      ref.osis.should == "exod.1.1.kjv"
    end
  end

  describe "#to_s" do
    it "should give a human readable string of a versionless reference" do
      @gen_1_1_ref.to_s.should == "Genesis 1:1"
    end
    it "should give a human readable string for a chapter" do
      @gen_1_kjv_ref.to_s.should == "Genesis 1 (KJV)"
    end
    it "should give a human readable string for a versioned verse" do
      @gen_1_1_kjv_ref.to_s.should == "Genesis 1:1 (KJV)"
    end
    it "should give a human readable string for a versioned verse range" do
      Reference.new("gen.1.2-3.kjv").to_s.should == "Genesis 1:2-3 (KJV)"
    end
  end

  shared_examples_for "#ref_string" do
    it "should give the chapter" do
      @gen_1_kjv_ref.ref_string.should =~ /^Genesis/
    end
    it "should give the book" do
      @gen_1_kjv_ref.ref_string.should =~ / 1$/
    end
    it "should give the verse" do
      @gen_1_1_kjv_ref.ref_string.should =~ /:1$/
    end
    it "should not give the version" do
      @gen_1_1_kjv_ref.ref_string.should_not =~ /(KJV|King)/i
      @gen_1_kjv_ref.ref_string.should_not =~ /(KJV|King)/i
    end
  end

  describe "#version_string" do
    it "should give the abbreviation for the reference version" do
      @gen_1_1_kjv_ref.version_string.should == "KJV"
    end
  end

  describe "#raw_hash" do
    it "should give an OSIS hash" do
      @gen_1_1_kjv_ref.raw_hash.should == {book: "gen", chapter: 1, verse: 1, version: "kjv"}
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
      @gen_1_1_kjv_ref.to_param.should == "gen.1.1.kjv"
    end
  end

  describe "#to_api_string" do
    it "should give a /notes API-frendly string" do
      Reference.new("gen.1.1.asv").notes_api_string.should == "gen.1.1"
      Reference.new("gen.1.1-3.asv").notes_api_string.should == "gen.1.1+gen.1.2+gen.1.3"
      Reference.new("gen.1.asv").notes_api_string.should == "gen.1.1+gen.1.2+gen.1.3+gen.1.4+gen.1.5+gen.1.6+gen.1.7+gen.1.8+gen.1.9+gen.1.10+gen.1.11+gen.1.12+gen.1.13+gen.1.14+gen.1.15+gen.1.16+gen.1.17+gen.1.18+gen.1.19+gen.1.20+gen.1.21+gen.1.22+gen.1.23+gen.1.24+gen.1.25+gen.1.26+gen.1.27+gen.1.28+gen.1.29+gen.1.30+gen.1.31"
    end
  end

  describe "[]" do
    it "should index the reference like a hash" do
      ref = Reference.new('gen.1.2.kjv')
      ref[:book].should == 'gen'
      ref[:chapter].should == 1
      ref[:verse].should == 2
      ref[:version].should == 'kjv'
    end
  end

  describe "#contents" do
    it "should have the text of a single verse" do
      @gen_1_1_kjv_ref.contents.first.should == "In the beginning God created the heaven and the earth."
    end
    it "should have an array of plain text verses for a verse range" do
      array = Reference.new("gen.1.1-3.kjv").contents
      array.count.should == 3
      array.first.should == "In the beginning God created the heaven and the earth."
    end
    it "should give the html for a chapter" do
      @gen_1_kjv_ref.contents.first.should =~ %r(<.*h1.*class.*=.Gen_1.>Genesis 1</h1>)
    end
    it "should give the html for a verse" do
      pending "reference rewrite to pull verses and ranges from chapters"
    end
    it "should have particular html classes" do
      pending "reference rewrite will show how to fully test this"
    end
  end

  describe "#previous" do
    it "should be the previous chapter reference" do
      Reference.new("gen.2.kjv").previous.should == @gen_1_kjv_ref
    end
    it "should be nil if there isn't one" do
      @gen_1_kjv_ref.previous.should be_nil
    end
  end

  describe "#next" do
    it "should be the next chapter reference" do
      @gen_1_kjv_ref.next.should == Reference.new("gen.2.kjv")
    end
    it "should be nil if there isn't one" do
      Reference.new("rev.22.kjv").next.should be_nil
    end
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

  describe "osis representations" do
    it "should give an osis string" do
      @gen_1_1_kjv_ref.osis.should == "gen.1.1.kjv"
    end
    it "should give an ossis string without a version" do
      @gen_1_1_kjv_ref.osis_noversion.should == "gen.1.1"
    end
    it "should give an osis string with only the chapter" do
      @gen_1_1_kjv_ref.osis_book_chapter.should == "gen.1"
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
