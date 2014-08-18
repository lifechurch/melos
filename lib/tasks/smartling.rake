require 'smartling'

namespace :smartling do

  desc "Convenience method to download from Smartling, then export JS strings"
  task :pull => ['download', 'i18n:js:export']

  desc "Download Translations from Smartling"
  task :download => :environment do
    puts 'Smartling Ruby client ' + Smartling::VERSION
    sl = Smartling::File.new(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)

    # To download another translation, use smartling:add_language['lang']
    # Future todo: Implement project/locale/list 
    # https://docs.smartling.com/display/docs/Projects+API

    # these locales are not live yet
    exclude_locales = [ 'hr', 'lt', 'my', 'sn' ]

    mappings = YAML::load_file(File.expand_path(Rails.root.join('config/smartling_mapping.yml'), __FILE__))
    mappings.each do |filename,locale|
      if not exclude_locales.include? filename
        aFile = File.new('config/locales/' + filename.to_s + '.yml', 'w+')
        if aFile
          puts "retrieving locale: #{locale} filename: #{filename}" 
          data = sl.download("/files/en.yml", :locale => locale)
          data.sub!(/no:/, "\"no\":")      if locale == "no-NO" # fix to remove falsy 'no' key
          data.sub!(/xc:/, "mn:")          if locale == "xc-MN" # fix for incorrect key
          data.sub!(/#{locale[0..1]}/, filename) if filename.to_s.match /-/ # fix to rename language key in file
          aFile.syswrite(data)
        else
          puts "Unable to open file: #{filename}"
        end
        aFile.close
      end
    end
  end

  desc "Delete Translations from Smartling"
  task :delete => :environment do
    puts 'Smartling Ruby client ' + Smartling::VERSION
    # sl = Smartling::File.new(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)
    # Dir['../config/locales/*.yml'].each do |file|
    #   begin
    #   fname = File.basename(file)
    #   # Download
    #   data = sl.delete("#{fname}.yml") unless fname == "en"
    #   # File.rename(f, folder_path + "/" + filename.capitalize + File.extname(f))
    #   puts "Deleted #{fname}" unless fname == "en"
    #   rescue
    #     puts "error with #{fname}"
    #   end
    # end

  end


  desc "Import Existing Translations to Smartling"
  task :import => :environment do
    # To enable this method, change the gemfile
    # gem 'smartling', :git => 'https://github.com/matthewrossanderson/api-sdk-ruby.git'

    # puts 'Smartling Ruby client ' + Smartling::VERSION
    # sl = Smartling::File.new(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)
    # errors = []
    # mappings = YAML::load_file(File.expand_path('../../../config/smartling_mapping.yml', __FILE__))
    # mappings.each do |filename,locale|
    #   begin
    #   response = sl.import("../config/locales/#{filename}.yml", locale, '/files/en.yml', 'YAML', {translationState: 'PUBLISHED', overwrite: true})
    #   puts "#{filename}: #{response}"
    #   rescue
    #     errors << filename
    #     puts "Error with #{filename}"
    #   end
    # end
    # puts "Errors:"
    # puts errors
  end

  desc "Push App Strings to Smartling"
  task :push => :environment do
    puts 'Smartling Ruby client ' + Smartling::VERSION
    sl = Smartling::File.new(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)
    response = sl.upload(Rails.root.join('config/locales/en.yml').to_s, '/files/en.yml', 'YAML')
    puts "en: #{response}"

    # List recently uploaded files
    res = sl.list()
    puts "Uploaded Successfully."
    puts res
  end

  desc "Add a language - Usage: rake smartling:add_language['en-OK']"
  task :add_language, [:lang] => :environment do |t, args|
    # next if args[:lang] == nil
    # puts 'Smartling Ruby client ' + Smartling::VERSION
    # puts "Downloading Language: #{args[:lang]}"
    # data = sl.download("#{args[:lang]}.yml", :locale => args[:lang], size: 1)
    # puts JSON.parse(data)
  end


  desc "Push Rails I18n Strings to Smartling"
  task :push_i18n => :environment do
    # puts 'Smartling Ruby client ' + Smartling::VERSION
    # # sl = Smartling::File.new(:apiKey => Cfg.smartling_api_key, :projectId => Cfg.smartling_project_id)
    # # Upload all the files
    # puts "Uploading rails-i18n strings"
    # response = sl.upload('../config/locales/_rails-18n.yml', 'core/en.yml', 'YAML')
    # puts "en: #{response}"  


    # # List recently uploaded files
    # res = sl.list()
    # puts res
  end

    


end