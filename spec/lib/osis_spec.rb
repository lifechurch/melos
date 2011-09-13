require File.dirname(__FILE__) + '/../spec_helper'

describe "OSIS Parser" do
  @tests = [{string: "gen.1.1.niv", hash: {book: "gen", chapter: 1, verse: 1, version: "niv"}},
           {string: "gen.1.niv", hash: {book: "gen", chapter: 1, version: "niv"}},
           {string: "gen.niv", hash: {book: "gen", version: "niv"}},
           {string: "gen.1", hash: {book: "gen", chapter: 1}},
           {string: "gen", hash: {book: "gen"}},
           {string: "gen.1.2-3.niv", hash: {book: "gen", chapter: 1, verse: 2..3, version: "niv"}},
           {string: "gen.1-2.niv", hash: {book: "gen", chapter: 1..2, version: "niv"}}]

    @tests.each do |test|
      it "parses #{test[:string]} to a hash" do
        test[:string].to_osis_hash.should == test[:hash]
      end

      it "creates #{test[:string]} from a hash" do
        test[:hash].to_osis_string.should == test[:string]
      end
    end
end