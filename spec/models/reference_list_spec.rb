require 'spec_helper'

describe ReferenceList do
  describe "#Initialize" do
    #ultimately, testing the different types doesn't mean anything since what matters
    #is that the list is created from the API response
    it "should be created from API objects reference" do
      pending "user and bookmark test helpers being written"
    end
    it "should be created from a known osis string" do
      ReferenceList.new('gen.1.1.kjv,gen.2.kjv').should be_valid
    end
    it "should have the right number of items" do
      ReferenceList.new('gen.1.1.kjv,gen.2.kjv').should have(2).items
    end     
  end
  
  describe "#<<" do
    it "should add a reference to the list" do
      list = ReferenceList.new
      expect { list << Reference.new('gen.1.kjv') }.to change{ list.count }.by(1)
    end
  end

  describe "#delete" do
    it "should remove the Reference from the list" do
      list = ReferenceList.new('gen.1.kjv')
      list.delete Reference.new('gen.1.kjv')
      list.should be_empty
      list.should_not include Reference.new('gen.1.kjv')
    end
  end
  
  describe "#uniq!" do
    it "should remove a duplicate reference" do
      list = ReferenceList.new('gen.1.kjv, gen.1.kjv')
      expect { list.uniq! }.to change{ list.count }.from(2).to(1)
    end
    it "should not remove another reference" do
      list = ReferenceList.new('gen.1.kjv, gen.1.kjv, gen.2.kjv')
      list.uniq!
      list.should include Reference.new('gen.2.kjv')
    end
  end
  
  
  describe "#to_api_string" do
    subject{ @list = ReferenceList.new('gen.1.2.kjv, 1sam.8.amp').to_api_string }

    it "should . separate books and chapters" do
      should =~ /gen.1/i
    end
    it "should . separate chapters and verses" do
      should =~ /1\.2/i
    end
    it "should be + separated" do
      should =~ /.*\+1sam/i
    end
    it "should not contain the version" do
      should_not =~ /(kjv|amp)/i
    end
    it "should have an upper case first letter" do
      should =~ /^G/
    end
    it "should have an upper case first alpha letter for a numbered book" do
      should =~ /1Sam/
    end
  end
  
  describe "#to_osis_references" do
    subject{ @list = ReferenceList.new('gen.1.2.kjv, 1sam.8.amp').to_osis_references }
    
    it "should be + separated" do
      should =~ /.*\+1sam/i
    end
    it "should contain the version" do
      should =~ /\.kjv.*\.amp/i
    end
  end
end
