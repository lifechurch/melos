namespace :sitemap do
  desc "Generate version sitesmaps"
  task :create_version => :environment do

    # manual process for now
    versions = Version.find(186)
    version_id = versions.attributes.id
    locale = "/uk"
    # locale = ""

    filename = "public/sitemaps/sm-version-#{version_id}.xml"
    aFile = File.new(filename, 'w+')
    data = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    aFile.syswrite(data)
    if aFile
      versions.books.each do |b, book|
        book.chapters.each do |chapter|
          data = "\n<url><loc>https://www.bible.com#{locale}/bible/#{version_id}/#{chapter.usfm.downcase}</loc><changefreq>weekly</changefreq></url>"
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