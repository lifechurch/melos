namespace :sitemap do
  desc "Generate version sitesmaps"
  task :create_version => :environment do
    # automate creation of sm-version files for all versions in available_locales
    sm_index = []
    locales = I18n.available_locales
    locales.each do |l|
      puts "#{l} versions - building sitemaps..."
      puts " "
      locale = l.to_s.eql?("en") ? "" : "/#{l}"
      versions = Version.all(l)
      versions.each do |v|
        version_id = v.attributes.id
        puts "#{version_id} - #{v}"
        sm_index.push(version_id)
        filename = "public/sitemaps/sm-version-#{version_id}.xml"
        aFile = File.new(filename, 'w+')
        data = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        aFile.syswrite(data)
        if aFile
          v.books.each do |b, book|
            book.chapters.each do |chapter|
              # update changefreq to monthly after single verse is complete and in prod
              data = "\n<url><loc>https://www.bible.com#{locale}/bible/#{version_id}/#{chapter.usfm.downcase}.#{v.abbreviation.downcase}</loc><changefreq>weekly</changefreq></url>"
              aFile.syswrite(data)
            end
          end
        else
          puts "Unable to open file: #{filename}"
        end
        aFile.syswrite("\n</urlset>")
        aFile.close
      end
      puts "========="
    end
    puts "versions without a home locale - building sitemaps..."
    puts "========="
    # automate creation of sm-version files for all versions in WITHOUT a home locale
    # all these versions will be canonical to en locale
    locale = ""
    versions = Version.all()
    versions.each do |v|
      version_id = v.attributes.id
      unless sm_index.include?(version_id)
        puts "#{version_id} - #{v}"
        sm_index.push(version_id)
        filename = "public/sitemaps/sm-version-#{version_id}.xml"
        aFile = File.new(filename, 'w+')
        data = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        aFile.syswrite(data)
        if aFile
          v.books.each do |b, book|
            book.chapters.each do |chapter|
              # update changefreq to monthly after single verse is complete and in prod
              data = "\n<url><loc>https://www.bible.com#{locale}/bible/#{version_id}/#{chapter.usfm.downcase}.#{v.abbreviation.downcase}</loc><changefreq>weekly</changefreq></url>"
              aFile.syswrite(data)
            end
          end
        else
          puts "Unable to open file: #{filename}"
        end
        aFile.syswrite("\n</urlset>")
        aFile.close
      end
    end

    puts "add these nodes to sm-index.xml\n"
    puts "========="
    sm_index.each do |idx|
      puts "<sitemap><loc>https://www.bible.com/sitemaps/sm-version-#{idx.to_s}.xml</loc></sitemap>"
    end
    puts "========="
    puts "^ add these nodes to sm-index.xml in the versions list \n"
    puts "========="
  end
end