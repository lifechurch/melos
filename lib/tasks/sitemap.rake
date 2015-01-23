namespace :sitemap do
  desc "Generate version sitesmaps"
  task :create_version => :environment do
    # automate creation of sm-version files for all versions in available_locales
    sm_index = []
    locales = I18n.available_locales
    locstring = "222,28,411,52,1076,89,753,103,127,128,197,146,147,149,150,176,178,210,214,53,442,"
    locales.each do |l|
      if l.to_s.eql?("de")
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
                data = "\n<url><loc>https://www.bible.com#{locale}/bible/#{version_id}/#{chapter.usfm.downcase}.#{v.abbreviation.downcase}</loc></url>"
                aFile.syswrite(data)
              end
              # output verses for this book
              if version_id.to_s.eql?("73")
                filename = Rails.root.join("config/sitemap/#{b.downcase}.txt")
                if File.exists?(filename)
                  File.open(filename).each do |ref|
                    data = "\n<url><loc>https://www.bible.com#{locale}/bible/#{version_id}/#{ref.strip}.#{v.abbreviation.downcase}</loc></url>"
                    aFile.syswrite(data)
                  end
                end
              end
            end
          else
            puts "Unable to open file: #{filename}"
          end
          aFile.syswrite("\n</urlset>")
          aFile.close
        end
      end
      puts "========="
    end
    puts "add these nodes to sm-index.xml\n"
    puts "========="
    sm_index.each do |idx|
      puts "<sitemap><loc>https://www.bible.com/sitemaps/sm-version-#{idx.to_s}.xml</loc></sitemap>"
    end
    puts "========="
    puts "^ add these nodes to sm-index.xml in the versions list \n"
    puts "========="

    puts "versions without a home locale - building sitemaps..."
    puts "========="
    # automate creation of sm-version files for all versions
    # locale = ""
    # versions = Version.all()
    # versions.each do |v|
    #   version_id = v.attributes.id
    #   # we will do all except the en
    #   unless sm_index.include?(version_id)
    #     if ",809,95,155,".include?(",#{version_id},")
    #       puts "#{version_id} - #{v}"
    #       sm_index.push(version_id)
    #       filename = "public/sitemaps/sm-en-version-#{version_id}.xml"
    #       aFile = File.new(filename, 'w+')
    #       data = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    #       aFile.syswrite(data)
    #       if aFile
    #         v.books.each do |b, book|
    #           book.chapters.each do |chapter|
    #             data = "\n<url><loc>https://www.bible.com#{locale}/bible/#{version_id}/#{chapter.usfm.downcase}.#{v.abbreviation.downcase}</loc></url>"
    #             aFile.syswrite(data)
    #           end
    #           # output verses for this book/version
    #           filename = Rails.root.join("config/sitemap/#{b.downcase}.txt")
    #           if File.exists?(filename)
    #             File.open(filename).each do |ref|
    #               data = "\n<url><loc>https://www.bible.com#{locale}/bible/#{version_id}/#{ref.strip}.#{v.abbreviation.downcase}</loc></url>"
    #               aFile.syswrite(data)
    #             end
    #           end
    #         end
    #       else
    #         puts "Unable to open file: #{filename}"
    #       end
    #       aFile.syswrite("\n</urlset>")
    #       aFile.close
    #     end
    #   end
    # end
    # puts "add these nodes to sm-index.xml\n"
    # puts "========="
    # sm_index.each do |idx|
    #   puts "<sitemap><loc>https://www.bible.com/sitemaps/sm-en-version-#{idx.to_s}.xml</loc></sitemap>"
    # end
    # puts "========="
    # puts "^ add these nodes to sm-index.xml in the versions list \n"
    # puts "========="
  end
  desc "Generate reading-plans sitesmap"
  task :create_reading_plan_maps => :environment do
    puts "reading plans - building sitemaps..."
    #currently requires _config.yml development param manually set to:
    #api_root: youversionapi.com to generate from production api

    locales = I18n.available_locales
    locales.each do |l|
      data = ''
      if l.to_s.eql?("en-GB")
        puts "### locale: #{l} no maps created\n\n"
        next
      end
      puts "### locale #{l}\n\n"
      locale = l.to_s.eql?("en") ? "" : "/#{l}"
      plans_exist = true
      page = 1
      plan_count = 0
      rp_file_count = 1

      while plans_exist do
        plans = Plan.all(page: page, language_tag: l)
        if plans.to_s.eql?('[]')
          break
        end
        plans.each do |p|
          # puts p.id
          plan_count+=1
          if p.type.eql?("common")
            # puts "common"
            # common - title page and day 1 sample 78 joy
            data << "\n<url><loc>https://www.bible.com#{locale}/reading-plans/#{p.id}-#{p.slug}</loc></url>"
            data << "\n<url><loc>https://www.bible.com#{locale}/reading-plans/#{p.id}-#{p.slug}/day/1</loc></url>"
          else
            # puts "devo"
            # devotional - title page and all days  65 love and marriage
            data << "\n<url><loc>https://www.bible.com#{locale}/reading-plans/#{p.id}-#{p.slug}</loc></url>"
            day_count = p.total_days.to_i
            (1..day_count).each do |d|
              data << "\n<url><loc>https://www.bible.com#{locale}/reading-plans/#{p.id}-#{p.slug}/day/#{d}</loc></url>"
            end
          end
        end
        page += 1
      end
      unless data.empty?
        filename = "public/sitemaps/plans/plans-#{l}.xml"
        aFile = File.new(filename, 'w+')
        if aFile
          # puts data
          aFile.syswrite('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
          aFile.syswrite data
          aFile.syswrite('\n</urlset>')
          aFile.close
        else
          puts "Unable to open file: #{filename}"
        end
      end

      puts "#{plan_count} #{l} plans"
      puts "================================="
    end
  end
end