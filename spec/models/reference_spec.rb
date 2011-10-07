require 'spec_helper'

describe Reference do
  use_vcr_cassette "reference"

  before :each do
    @full_ref = Reference.new("gen.1.1.kjv")
  end

  describe "#initialize" do
    it "creates an instance of Reference from a string" do
      Reference.new("gen.1.1.kjv").class.should == Reference
    end

    it "creates an instance from a hash" do
      Reference.new({book: "gen", chapter: 1, version: "kjv"}).class.should == Reference
    end

    it "fails without a book" do
      lambda do
        Reference.new({chapter: 1})
      end.should raise_error

      lambda do
        Reference.new("")
      end.should raise_error
    end
  end

  describe "#merge" do
    it "returns a new reference with the argument merged into the old one" do
      @full_ref.merge(book: "exod").osis.should == "exod.1.1.kjv"
    end
  end

  describe "#merge!" do
    it "merges the arg into the existing reference object" do
      ref = Reference.new("gen.1.1.kjv")
      ref.merge!(book: "exod")
      ref.osis.should == "exod.1.1.kjv"
    end
  end

  describe "#to_s" do
    it "returns a human string" do
      @full_ref.to_s.should == "Genesis 1:1 (KJV)"
    end
  end

  describe "#hash" do
    it "returns an OSIS hash" do
      @full_ref.hash.should == {book: "gen", chapter: 1, verse: 1, version: "kjv"}
    end
  end

  describe "to_param" do
    it "parameterizes itself as a string" do
      @full_ref.to_param.should == "gen.1.1.kjv"
    end
  end

  describe "[]" do
    it "indexes like a hash" do
      @full_ref[:book].should == "gen"
    end
  end

  describe "#contents" do
    it "returns the text of a single verse" do
      @full_ref.contents.first.should == "In the beginning God created the heaven and the earth."
    end

    it "returns an array of plain text verses for a verse range" do
      @array = Reference.new("gen.1.1-3.kjv").contents
      @array.count.should == 3
      @array.first.should == "In the beginning God created the heaven and the earth."
    end

    it "returns the html for a chapter" do
      Reference.new("gen.1.kjv").contents.first.should include '<h1 class="Gen_1">Genesis 1</h1>'
    end
  end

  describe "#human" do
    it "returns a human readable string of gen.1.1.kjv" do
      @full_ref.human.should == "Genesis 1:1 (KJV)"
    end
    it "returns a human readable string of gen.1.kjv" do
      Reference.new("gen.1.kjv").human.should == "Genesis 1 (KJV)"
    end
    it "returns a human readable string of gen.1.2-3.kjv" do
      Reference.new("gen.1.2-3.kjv").human.should == "Genesis 1:2-3 (KJV)"
    end
  end

  describe "#copyright" do
    it "returns the copyright text for the reference's version" do
      Reference.new("gen.1.niv").copyright.should == "Holy Bible, New International Version, NIV. Copyright 1973, 1978, 1984, 2011 by Biblica, Inc. Used by permission. All rights reserved worldwide."
      Reference.new("gen.1.1.niv").copyright.should == "Holy Bible, New International Version, NIV. Copyright 1973, 1978, 1984, 2011 by Biblica, Inc. Used by permission. All rights reserved worldwide."
      Reference.new("gen.1.1-3.niv").copyright.should == "Holy Bible, New International Version, NIV. Copyright 1973, 1978, 1984, 2011 by Biblica, Inc. Used by permission. All rights reserved worldwide."
    end

    it "returns nil for versions with no copyright" do
      Reference.new("gen.1.1.kjv").copyright.should be_nil
    end
  end
end
