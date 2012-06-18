require 'spec_helper'

describe Plan do
  describe "#find" do
    describe "with a valid numeric ID" do
      subject {Plan.find('1-robert-roberts')}
      it "should have a title" do
        subject.title.should =~ /^Robert Roberts/
      end
      it "sould have a description" do
        subject.about.should =~ /daily systematic reading of the Scriptures/
      end
      it "should have copyright info" do
        subject.copyright.should =~ /was created by Robert Roberts over 100 years ago/
      end
      it "should have a length" do
        subject.length.should == '1 Year'
      end
      it "should have a publisher URL" do
      end
      it "should have a subscribed users count" do
        subject.users.total.should be > 10000
        #can't use should have_at_least(10000).users since count differents from length
        #for pagination classes
      end
      it "should have a current_day for previews" do
        subject.current_day.should be > 0
        subject.current_day.should be < subject.days
      end
      it "should parameterize to id-slug" do
        subject.to_param.should == '1-robert-roberts'
      end
    end
    describe "without a valid ID" do
      it "should throw an exception for now" do
        invalid_keys = %w(-1, bob_lablahs_law_blog)
        invalid_keys.each do |key|
          Plan.find(key).should raise_error
        end
      end
      it "should return nil" do
        pending "TODO: return nil for plan#find with invalid key"
        invalid_keys = %w(-1, bob_lablahs_law_blog)
      end
    end
  end

  describe "#all" do
    describe "with no parameters" do
      it "should give 25 unique plans" do
        Plan.all.map{|p| p.title}.uniq.should have(25).titles
      end
    end
    describe "with a language filter" do
      it "should have all plans supported in that language" do\
        loc = Plan.available_locales.last
        Plan.all(language_tag: loc).each do |p|
          p.should be_available_in loc
        end
      end
    end
    describe "with a valid pagination paramater" do
      it "should yield 25 different plans" do
         page_1 = Plan.all page: 1
         page_2 = Plan.all page: 2

         page_2.each do |a_page_2_plan|
           page_1.should_not include a_page_2_plan
         end
      end
    end
    describe "with valid query parameters" do
      it "should yield a related plan" do
        Plan.all(query:'Robert Roberts').should include Plan.find('1-robert-roberts')
      end
      it "should yeild multiple plans" do
        hits = Plan.all(query: "bible")
        hits.should have(25).plans
        hits.map{|p| p.title}.uniq.should have(25).plans
      end
    end
    describe "with an invalid query parameter" do
      it "should yield no plans" do
        Plan.all(query: "bob lablah's law blog").should have(0).plans
      end
    end
  end

  describe "#avialable_locales" do
    it "isn't empty" do
      Plan.available_locales.should_not be_empty
    end
  end

  describe "#==" do
    it "should compare to true for the same plan" do
      Plan.find('1-robert-roberts').should == Plan.find('1-robert-roberts')
      Plan.find('1-robert-roberts').should == Plan.find('robert-roberts')
    end

    it "should compare to false for different plans" do
      Plan.find('1-robert-roberts').should_not == Plan.find('100-hebrews')
    end
  end

  describe "#reading" do
    before(:all) do
      @with_no_devotional = @with_chapters = Plan.find('83-lent-for-everyone').day(1)
      @with_devotional = @with_verses = Plan.find('199-promises-for-your-everyday-life').day(1)
      @with_video_devo = Plan.find('250-the-artist-bible-easter').day(1)
      @with_no_references = Plan.find('11-project-345').day(9)
    end
    describe "with references" do
      it "should have at least one reference" do
        @with_chapters.references.should_not be_empty
      end
      describe "with a full chapter reference" do
        it "should contain a full chapter reference" do
          @with_chapters.references.first.ref.should == Reference.new('matt.1')
        end
        it "should have html contents" do
          @with_chapters.references.first.ref.content.first.should =~ /^<div><h1 class=/
        end
      end
      describe "with a partial chapter reference" do
        it "should contain the partial chapter reference" do
          @with_verses.references.first.ref.should == Reference.new('john.14.23')
        end
        it "should have html contents" do
          @with_verses.references.first.ref.content(format: 'html').first.should =~ /^<span class=\"verse\"/
        end
        it "should pull html contents without any config" do
          pending "TODO: reference rewrite to pull verses and ranges from chapters"
        end
      end
    end
    describe "without references" do
      it "should be empty" do
        @with_no_references.references.should be_empty
      end
    end
    describe "with plain devotional content" do
      it "should have no CRLFs" do
         @with_devotional.devotional.should_not =~ /\r\n/
      end
      it "should have no newlines" do
         @with_devotional.devotional.should_not =~ /\n/
      end
    end
    describe "with rich devotional content" do
      it "should have the rich content" do
        @with_video_devo.devotional.should =~ /<iframe/
      end
    end
  end

  describe "#version" do
    it "should change the version of text returned" do
      plan = Plan.find('1-robert-roberts')
      plan.version = 'amp'
      amp_ref = plan.day(1).references.first.ref
      plan.version = 'niv'
      plan.day(1).references.first.ref.should_not == amp_ref
    end
  end

  describe "localization" do
    subject {Plan.find('1-robert-roberts')}
    properties = [:title, :length, :description, :copyright]
    properties.each do |property|
      specify "#{property} should be localized" do
        I18n.locale = :de
        german_value = subject.send(property)
        I18n.locale = :en
        english_value = subject.send(property)

        german_value.should_not == english_value
      end
    end
  end
end
