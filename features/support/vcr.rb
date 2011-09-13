VCR.config do |c|
  c.cassette_library_dir = 'fixtures/vcr'
  c.stub_with :webmock # or :fakeweb
  c.default_cassette_options = { record: :new_episodes }
end

Before('@live') do
  VCR.eject_cassette
  VCR.turn_off!
end