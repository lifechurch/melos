namespace :localizations do
  desc "Pull down API localizations"
  task :pull => :environment do

    languages     = Localization.language_tags.moments
    total_written = 0

    puts "Total possible languages: #{languages.size}"

    languages.each do |lang|
      directory = "#{Rails.root}/config/locales/po/#{lang}"
      unless Dir.exist? directory
        puts "Creating directory: #{directory}"
        Dir.mkdir directory
      end
      po_request = Localization.po(lang.to_s)

      if po_request.code == 200
        output = "#{directory}/api.po"
        puts "#{lang} - Writing file: #{output}"
        File.open(output,"w:UTF-8") {|file| file.write po_request.force_encoding("UTF-8") }
        total_written += 1
      end
    end

    puts "Total files written: #{total_written} of total possible languages: #{languages.size}"
  end
end