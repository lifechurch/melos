require File.dirname(__FILE__) + '/../spec_helper'
require 'benchmark'

describe Cfg do
  describe ".osis_usfm_hash" do
    it "hashes a book quickly" do
      Benchmark::realtime{Cfg.osis_usfm_hash[:books]['genesis']}.should        < 0.0001
      Benchmark::realtime{Cfg.osis_usfm_hash[:books]['titori']}.should        < 0.0001
    end
    it "hashes a version quickly" do
      Benchmark::realtime{Cfg.osis_usfm_hash[:books]['KJV']}.should        < 0.0001
    end
  end
end
