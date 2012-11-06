AssetSync.configure do |config|
  if ENV['FOG_DIRECTORY']
    config.fog_provider = 'AWS'
    config.aws_access_key_id = ENV['AWS_ACCESS_KEY_ID']
    config.aws_secret_access_key = ENV['AWS_SECRET_ACCESS_KEY']
    config.fog_directory = ENV['FOG_DIRECTORY']
    puts "AssetSync Enabled: Syncing to #{config.fog_provider}: #{config.fog_directory}."
  else
    #Disable if there is no asset host specific (useful for alternate staging configuration)
    config.enabled = false
    puts "AssetSync Disabled: no FOG_DIRECTORY ENV var specified."
  end

  # Increase upload performance by configuring your region
  # config.fog_region = 'eu-west-1'
  #
  # keep files from the store, since they are needed for rollback
  # and preboot heroku magig. ('keep' or 'delete')
  config.existing_remote_files = "keep"
  #
  # Automatically replace files with their equivalent gzip compressed version
  config.gzip_compression = true
  #
  # Use the Rails generated 'manifest.yml' file to produce the list of files to
  # upload instead of searching the assets directory.
  # config.manifest = true
  #
  # Fail silently.  Useful for environments such as Heroku
  #config.fail_silently = true
end