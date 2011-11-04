 VCR.config do |c|
  c.cassette_library_dir = 'fixtures/vcr/cuke'
  c.stub_with :webmock # or :fakeweb
  c.default_cassette_options = { record: :new_episodes, match_requests_on: [:method, :uri, :body]}

end

VCR.cucumber_tags { |t| t.tags  '@bible', '@bookmark', '@user', '@no_user', '@versions', '@notes' }


Before('@live') do
  VCR.eject_cassette
  VCR.turn_off!
end
