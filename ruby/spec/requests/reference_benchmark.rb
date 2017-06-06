Benchmark.benchmark(CAPTION, 7, FORMAT, ">diff:", ">improvement:")  { |x|  
  tf = x.report(:ref) { 1.upto(1000) { Reference.new('JHN'); } }
  tfc = x.report(:ref_with_cache_clear) { 1.upto(1000) { Reference.new('JHN'); Rails.cache.clear } }
  [tfc-tf, (tf/tfc)]
}