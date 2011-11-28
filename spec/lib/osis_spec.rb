require File.dirname(__FILE__) + '/../spec_helper'

describe "OSIS Parser" do
  @tests = [
    {string: "gen.1.1.niv", hash: {book: "gen", chapter: 1, verse: 1, version: "niv"}},
    {string: "gen.1.niv", hash: {book: "gen", chapter: 1, version: "niv"}},
    {string: "gen.niv", hash: {book: "gen", version: "niv"}},
    {string: "gen.1", hash: {book: "gen", chapter: 1}},
    {string: "gen.1.1", hash: {book: "gen", chapter: 1, verse: 1}},
    {string: "gen.1.1-3", hash: {book: "gen", chapter: 1, verse: 1..3}},
    {string: "gen", hash: {book: "gen"}},
    {string: "gen.1.2-3.niv", hash: {book: "gen", chapter: 1, verse: 2..3, version: "niv"}},
    {string: "gen.1-2.niv", hash: {book: "gen", chapter: 1..2, version: "niv"}},
  ]

  @human_tests = [
    # Ooh, let's amp it up a bit
    {string: "Gen. 1:2 niv", osis_string: "gen.1.2.niv", hash: {book: "gen", chapter: 1, verse: 2, version: "niv"}},
    {string: "Jas 3 esv", osis_string: "jas.3.esv", hash: {book: "jas", chapter: 3, version: "esv"}},
    {string: "Jas esv", osis_string: "jas.esv", hash: {book: "jas", version: "esv"}},
    {string: "Ex 2", osis_string: "ex.2", hash: {book: "ex", chapter: 2}},
    {string: "Matt 1:1", osis_string: "matt.1.1", hash: {book: "matt", chapter: 1, verse: 1}},
    {string: "1 John. 1:2-3", osis_string: "1john.1.2-3", hash: {book: "1john", chapter: 1, verse: 2..3}},
    {string: "Joshua", osis_string: "joshua", hash: {book: "joshua"}},
    {string: "1 John. 1:2-3 kjv", osis_string: "1john.1.2-3.kjv", hash: {book: "1john", chapter: 1, verse: 2..3, version: "kjv"}},
    {string: "2 Kin 2-4 esv", osis_string: "2kin.2-4.esv", hash: {book: "2kin", chapter: 2..4, version: "esv"}},
  ]

  @tests.each do |test|
    it "parses #{test[:string]} to a hash" do
      test[:string].to_osis_hash.should == test[:hash]
    end

    it "creates #{test[:string]} from a hash" do
      test[:hash].to_osis_string.should == test[:string]
    end
  end

  @human_tests.each do |test|
    it "parses #{test[:string]} to a hash" do
#      test[:string].to_osis_hash.should == test[:hash]
      test[:string].human_to_osis_hash.should == test[:hash]
    end

    it "creates #{test[:osis_string]} via hash from #{test[:string]}" do
#      test[:string].to_osis_hash.to_osis_string.should == test[:osis_string]
      test[:string].human_to_osis_hash.to_osis_string.should == test[:osis_string]
    end
  end
end
