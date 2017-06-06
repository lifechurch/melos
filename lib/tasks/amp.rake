namespace :amp do
  desc "Generate AMD version landing pages"
  task :versions => :environment do
    puts "Generating AMP version landing pages..."

    # 1. the equivalent non-AMP page needs a meta tag as below:
    #     <link rel="amphtml" href="https://www.bible.com/-amp/versions/1.html">

    locale = "en"
    versions = Version.all()
    versions.each do |v|
      version_id = v.attributes.id
      # if version_id.to_s.eql?("111")
      # if version_id.to_i <= 3
        puts "#{version_id} - #{v}"
        filename = Rails.root.join("public/-amp/versions/#{version_id}.html")
        aFile = File.new(filename, 'w+')

        data = getHead(v, locale)
        aFile.syswrite(data)

        data = getBody(v, locale)
        aFile.syswrite(data)

        data = getCloseHtml
        aFile.syswrite(data)

        aFile.close
      # end
    end
  end

  def getHead(v, locale)
    data = "<!doctype html>\n"
    data += "<html ⚡>\n\n"

    data += "<head>\n"
    data += "<meta charset='utf-8'>\n"
    data += "<title>#{v.to_s} - #{I18n.t('download ad.meta copy title', :locale => locale)}.  #{I18n.t('meta.mobile.download or read', :locale => locale)}</title>\n"
    data += "<link rel='canonical' href='https://www.bible.com/versions/#{v.to_param}'>\n"
    data += "<meta name='viewport' content='width=device-width,minimum-scale=1,initial-scale=1'>\n"
    data += "<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>\n"
    data += "<script async custom-element='amp-analytics' src='https://cdn.ampproject.org/v0/amp-analytics-0.1.js'></script>\n"
    data += "<script async src='https://cdn.ampproject.org/v0.js'></script>\n"
    data += getCss
    data += getJsonLd
    data += "</head>\n\n"
    data += "<body>\n"
    return data
  end

  def getCss
    data = ""
    data += "<style amp-custom>\n"
    data += "     article {\n"
    data += "     width: 92%;\n"
    data += "     margin: 0 auto;\n"
    data += "     position: relative;\n"
    data += "     font-family: 'Helvetica Neue',Arial,'Liberation Sans',sans-serif;\n"
    data += "     }\n"
    data += "     h1 {\n"
    data += "     font-size: 20px;\n"
    data += "     }\n"
    data += "     h2 {\n"
    data += "     font-size: 18px;\n"
    data += "     color: #939393;\n"
    data += "     }\n"
    data += "     .solid-button.blue {\n"
    data += "     background-color: #0084c8;\n"
    data += "     color: #ffffff;\n"
    data += "     }\n"
    data += "     .solid-button.green {\n"
    data += "     background-color: #6ab750;\n"
    data += "     color: #ffffff;\n"
    data += "     }\n"
    data += "     .solid-button {\n"
    data += "     text-align: center;\n"
    data += "     text-decoration: none;\n"
    data += "     display: inline-block;\n"
    data += "     padding: 10px 0;\n"
    data += "     font-size: 16px;\n"
    data += "     border-radius: 4px;\n"
    data += "     border: none;\n"
    data += "     margin-bottom: 20px;\n"
    data += "     }\n"
    data += "     .mobile-full {\n"
    data += "     width: 100%;\n"
    data += "     float: left;\n"
    data += "     }\n"
    data += "     #logo {\n"
    data += "         width: 100%;\n"
    data += "         text-align: center;\n"
    data += "     }\n"
    data += "</style>\n"
    return data
  end

  def getJsonLd
    data = ""
    data += "<script type=\"application/ld+json\">\n"
    data += "{\n"
    data += "\"@context\": \"http://schema.org/\",\n"
    data += "\"@type\": \"MobileApplication\",\n"
    data += "\"name\": \"#{I18n.t('bible')}\",\n"
    # data += "'image': '#{url_for(image_path(localized_bible_icon(120)))}',\n"
    data += "\"description\": \"#{I18n.t("meta.mobile.description")}\",\n"
    data += "\"operatingSystem\": \"Android, iOS, BlackBerry, Windows Phone 8\",\n"
    data += "\"applicationCategory\": \"Reference\",\n"
    data += "\"aggregateRating\":{\n"
    data += "\"@type\": \"AggregateRating\",\n"
    data += "\"ratingValue\": \"4.7\",\n"
    data += "\"ratingCount\": \"1,786,398\"\n"
    data += " },\n"
    data += "\"offers\":{\n"
    data += "\"@type\": \"Offer\",\n"
    data += "\"price\": \"0\"\n"
    data += "}\n"
    data += "}\n"
    data += "</script>\n"
    return data
  end

  def getBody(v, locale)
    data = "<article>\n"
    data += "<h1>#{v}</h1>\n"
    display_language = v.attributes.language.name
    display_language = "#{display_language} - #{v.attributes.language.local_name}" if not display_language.eql?(v.attributes.language.local_name)
    data += "<h2 class='version'>#{display_language}</h2>\n"
    data += "<div class='copyright'>\n"
    copyright = v.info.try :html_safe
    copyright = copyright.gsub('<a ', '<a target="_blank" ') if copyright.present?
    data += "#{copyright}\n"
    data += "</div>\n"

    data += "<a target='_blank' href='https://www.bible.com/app' class='version_download solid-button mobile-full green'>#{I18n.t("mobile page.download now", locale)}</a>\n"
    data += "<a target='_blank' href='https://www.bible.com/bible/#{v.attributes.id}/jhn.1' class='solid-button mobile-full blue'>#{I18n.t('versions.read title', locale)}</a>\n"

    data += "<div id='logo'>\n"
    data += "<amp-img src='http://installs.youversion.com/icons/yv-logo.svg' width='200' height='24'></amp-img><br>\n"
    data += "<a target='_blank' href='https://www.bible.com/'>\n"
    data += "<br><amp-img src='http://installs.youversion.com/icons/en.png' width='72' height='72' alt='#{I18n.t('pages.home.features.read heading', locale)}'></amp-img>\n"
    data += "</div>\n"
    data += "</a>\n"
    data += "</article>\n"
    return data
  end

  def getCloseHtml
    data = "\n\n"

    # google analytics - set UA site-id below:
    data += "<amp-analytics type='googleanalytics' id='analytics1'>\n"
    data += ' <script type="application/json">'
    data += '  {'
    data += '  "vars": {'
    data += '    "account": "UA-3571547-121"'
    data += '  }, '
    data += '  "triggers": {'
    data += '    "trackPageview": {'
    data += '      "on": "visible",'
    data += '      "request": "pageview"'
    data += '     }'
    data += '  }'
    data += '  }'
    data += '  </script>'
    data += "\n</amp-analytics>\n"

    data += "<br><br></body>\n\n"
    data += "</html>\n"
    return data
  end

end