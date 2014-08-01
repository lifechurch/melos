require 'smartling'

namespace :smartling do
  desc "Pull Smartling Translations"
  task :pull => :environment do
    puts 'Smartling Ruby client ' + Smartling::VERSION
    sl = Smartling::File.sandbox(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)
    # Smartling::File.new(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)
    
    # Download
    data = sl.download(name, :locale => lang)
    puts data
  end

  desc "Push Smartling Translations"
  task :push => :environment do
    puts 'Smartling Ruby client ' + Smartling::VERSION
    sl = Smartling::File.sandbox(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)
    # Smartling::File.new(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)

    # Upload all the files
    response = sl.upload('source_file.yaml', 'name.yaml', 'YAML')
    puts response

    # List recently uploaded files
    res = sl.list()
    p res
  end

  desc "Add a language"
  task :add_language, [:lang] => :environment do |t, args|
    next if args[:lang] == nil
    puts 'Smartling Ruby client ' + Smartling::VERSION
    puts "Adding Language: #{args[:lang]}"
  end
end