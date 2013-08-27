# encoding: UTF-8
require 'spec_helper'
require 'benchmark'

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
    it "should be able to be created from a Reference" do
      Reference.new(@gen_1_2_kjv_ref).should be_valid
      Reference.new(@gen_1_2_kjv_ref).should == @gen_1_2_kjv_ref
    end
    it "should be able to be created from an API string" do
      Reference.new("2CH.33.1+2CH.33.2+2CH.33.3").should == Reference.new("2CH.33.1-3")
    end
    it "should use the options as the overriding property" do
      Reference.new('gen.1.2.kjv', book: "JHN").book.should == "JHN"
      Reference.new('gen.1.2.kjv', chapter: "3").chapter.should == "3"
      Reference.new('gen.1.2.kjv', verses: "4").verses.should == ["4"]
      Reference.new('gen.1.2.kjv', version: "5").version.should == 5
      Reference.new('gen.1.2.kjv', version: nil).version.should == nil
    end

  end

  describe "#valid?" do

    context "with a valid reference string" do
      {
        'Gen.1.kjv' => {def: 'legacy osis version',                       book: 'GEN', chap: '1', verses: [],    version: 1},
        'Gen.1.2.kjv' => {def: 'legacy osis version with verse',          book: 'GEN', chap: '1', verses: ['2'],    version: 1},
        'Gen.1.2-3.kjv' => {def: 'legacy osis version with verse range',  book: 'GEN', chap: '1', verses: ['2', '3'],  version: 1},
        'Gen.1.7,9.kjv' => {def: 'Multi verse',                           book: 'GEN', chap: '1', verses: ['7', '9'],  version: 1},
        'Gen.1.7,9,11-13.kjv' => {def: 'Multi verse with range',          book: 'GEN', chap: '1', verses: ['7','9','11','12','13'],  version: 1},
        'Gen.1.1-kjv' => {def: 'API3 version',                            book: 'GEN', chap: '1', verses: [],    version: 1},
        'Gen.1.2.1-kjv' => {def: 'API3 version with verse',               book: 'GEN', chap: '1', verses: ['2'],    version: 1},
        'Gen.1.2-3.1-kjv' => {def: 'API3 version with verse range',       book: 'GEN', chap: '1', verses: ['2', '3'],  version: 1},
        'ESG.1_1.346-CEVD' => {def: 'Greek Ester, non numerical chapter', book: 'ESG', chap: '1_1', verses: [],  version: 346},
        'esg.intro1.69-GNTD' => {def: 'Greek Ester, intro chapter', book: 'ESG', chap: 'INTRO1', verses: [],  version: 69},
        'S3Y.1.1.416-GNB' => {def: 'GNB, book with # in middle', book: 'S3Y', chap: '1', verses: ['1'],  version: 416}
      }.each do |ref, expect|
        subject = Reference.new(ref)

        it "should hit the API to validate a reference" do
          YV::API::Client.should_receive(:get)
          subject.valid?
        end

        specify "#{ref} should be valid" do
          subject.should be_valid
        end

        specify "#{ref} should parse correctly" do
          subject.book.should == expect[:book]
          subject.chapter.should == expect[:chap]
          subject.verses.should == expect[:verses]
          subject.version.should == expect[:version]
        end
      end

    end

    context "with an invalid reference string" do
      #299-NGBM is nt-only versions
      invalid_refs = %w(gen.100 gen.1.299-NGBM gen.1.invalid gen.1.1.invalid gen.1.1-3.invalid gen.1.1.299-NGBM invalid.1.8-AMP)

      invalid_refs.each do |ref|
        specify "#{ref} should be invalid" do
          Reference.new(ref).should_not be_valid
        end

        specify "#{ref} should not hit the Bible API" do
          YV::API::Client.should_receive(:get).exactly(0).times
          Reference.new(ref).valid?
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
      @gen_1_2_kjv_ref.chapter == "1"
    end
  end

  describe "#verses" do
    it "should be the correct verse" do
      @gen_1_2_kjv_ref.verses == ["2"]
    end
  end

  describe "#version" do
    it "should be the correct version" do
      @gen_1_2_kjv_ref.version == 1
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
      subject[:chapter].should == "1"
      subject[:verses].should == ["1"]
      subject[:version].should == 1
    end

  end

  describe "#hash" do

    it "should give a unique hash for different references" do
      @gen_1_1_kjv_ref.hash.should_not == @gen_1_kjv.hash
    end
    it "should give a unique hash for different versions" do
      @gen_1_1_kjv_ref.hash.should_not == Reference.new('gen.1.1.niv').hash
    end
    it "should give the same hash for the same verse" do
      @gen_1_1_kjv_ref.hash.should == Reference.new("gen.1.1.kjv").hash
    end

  end

  describe "to_param" do

    it "should parameterize itself as a string for a ref with a verse" do
      @gen_1_1_kjv_ref.to_param.should =~ /GEN.1.1.KJV/i
    end
    it "should parameterize itself as a string for a ref without verses" do
      Reference.new("2CH.33", version: 1).to_param.should == '2ch.33.kjv'
    end
    it "should parameterize itself as a string for a ref with a verse range" do
      Reference.new("2CH.33.1-3", version: 1).to_param.should == '2ch.33.1-3.kjv'
    end
    it "should provide a hyphenated param string if created from an API string" do
      Reference.new("2CH.33.1+2CH.33.2+2CH.33.3", version: 1).to_param.should == '2ch.33.1-3.kjv'
    end

  end

  describe "#to_api_string" do

    it "should give a /notes API-frendly string" do
      @gen_1_1_kjv_ref.notes_api_string.should == "GEN.1.1"
      Reference.new("gen.1.1-3.kjv").notes_api_string.should == "GEN.1.1+GEN.1.2+GEN.1.3"
      @gen_1_kjv_ref.notes_api_string.should == "GEN.1.1+GEN.1.2+GEN.1.3+GEN.1.4+GEN.1.5+GEN.1.6+GEN.1.7+GEN.1.8+GEN.1.9+GEN.1.10+GEN.1.11+GEN.1.12+GEN.1.13+GEN.1.14+GEN.1.15+GEN.1.16+GEN.1.17+GEN.1.18+GEN.1.19+GEN.1.20+GEN.1.21+GEN.1.22+GEN.1.23+GEN.1.24+GEN.1.25+GEN.1.26+GEN.1.27+GEN.1.28+GEN.1.29+GEN.1.30+GEN.1.31"
    end
    it "should work with an invalid reference" do
      pending "us needing to support this style of reference creation (not actually a valid reference)"
      Reference.new("gen.1.1-3,6.kjv").notes_api_string.should == "GEN.1.1+GEN.1.2+GEN.1.3+GEN.1.6"
    end

  end

  describe "[]" do

    it "should index the reference like a hash" do
      ref = Reference.new('gen.1.2.kjv')
      ref[:book].should == 'GEN'
      ref[:chapter].should == "1"
      ref[:verses].should == ["2"]
      ref[:version].should == 1
    end

  end

  describe "#content" do

    it "should have only the text of a single verse" do
      @gen_1_1_kjv_ref.content.should include "In the beginning God created the heaven and the earth."
      @gen_1_1_kjv_ref.content.should_not include "And the earth was without form"
    end
    it "should have the text of a chapter" do
      @gen_1_kjv_ref.content.should include "In the beginning God created the heaven and the earth."
      @gen_1_kjv_ref.content.should include "And the earth was without form"
    end
    it "should give the html for a chapter" do
      @gen_1_kjv_ref.content.should =~ /<div class="chapter ch1" data-usfm="GEN.1">/
      @gen_1_kjv_ref.content.should =~ /<span class="content">In the beginning/
    end
    it "should give the html for a verse" do
      @gen_1_1_kjv_ref.content.should include "<span class=\"content\">In the beginning"
      @gen_1_1_kjv_ref.content.should_not include "<div class=\"chapter ch1\" data-usfm=\"GEN.1\">\n            <div class=\"label\">1</div>\n"
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
      Reference.new('Rev.22.kjv').previous_chapter.should == Reference.new('Rev.21.kjv')
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
      Reference.new('Rev.21.kjv').next_chapter.should == Reference.new('Rev.22.kjv')
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
      Reference.new("gen.1.niv").copyright.should =~ /Holy Bible, New International Version/
    end

    it "should be nil for versions with no copyright" do
      pending "API not returning 'crown copyright in UK' for this"
      Reference.new("gen.1.1.kjv").copyright.should be_nil
    end

  end

  describe "#audio" do

    it "should contain a link to an mp3" do
      @gen_1_kjv_ref.audio.url.should =~ /mp3/
    end
    it "should be a secure url or respect protocol with // trick" do
      @gen_1_kjv_ref.audio.url.should =~ /^[https:|\/\/]/
    end

  end

  describe "#timing" do

      it "should initialize without hitting the API" do
        YV::API::Client.should_receive(:get).exactly(0).times
        Reference.new('gen.1.1.kjv')
        #TODO: add more cases (ranges, creation from References, etc to flesh out the supported 'lazy-load' cases)
      end
      it "should give basic properties without hitting the API" do
        YV::API::Client.should_receive(:get).exactly(0).times

        ref = Reference.new('gen.1.1.kjv')
        ref.book
        ref.chapter
        ref.verses
        ref.version
        ref.is_chapter?
      end

  end
end
