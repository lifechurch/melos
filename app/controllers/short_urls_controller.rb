# Handles short url patterns that used to be handled via API team & bible.us short domain.
# We can't use Rack::Rewrite here because these redirects need to happen *after*
# we pass through all other valid routes in our application. See last valid route in routes.rb file.

class ShortUrlsController < ActionController::Metal
  include ActionController::Redirecting

  def index
    base_url = "https://www.bible.com"

    case params[:path]

    # /353/GEN1.1.NIV - API 3: bible.us/{version-id}/{book-usfm}{chapter-usfm}.{verse-usfm}.{version-abbreviation}
    when /^(\d+\/.*)/
      redirect_to("#{base_url}/bible/#{$1}") and return

    # Gen1.1.NIV -  Book, chapter, verse and version
    when /^([0-9]?[a-zA-Z]+)(?:([0-9]+)\.([0-9-]+)\.([0-9a-zA-Z-]+))$/
      version = $4.downcase
      book    = $1.downcase
      chapter = $2
      verse   = $3
      redirect_to("#{base_url}/bible/#{version}/#{book}.#{chapter}.#{verse}.#{version}") and return

    # Gen1.1 - Book, chapter and verse
    when /^([0-9]?[a-zA-Z]+)(?:([0-9]+)\.([0-9-]+))$/
      book    = $1.downcase
      chapter = $2
      verse   = $3
      redirect_to("#{base_url}/bible/kjv/#{book}.#{chapter}.#{verse}.kjv") and return

    # Gen1 - Book and chapter
    when /^([0-9]?[a-zA-Z]+)([0-9]+)$/
      book    = $1.downcase
      chapter = $2
      redirect_to("#{base_url}/bible/#{book}.#{chapter}.1") and return

    # Gen  - Book
    when /^([0-9]?[a-zA-Z]+)$/
      book    = $1.downcase
      redirect_to("#{base_url}/bible/#{book}.1.1") and return

    # Gen1.NIV - Book, chapter and version
    when /^([0-9]?[a-zA-Z]+)(?:([0-9]+)\.([0-9a-zA-Z-]+))$/
      version = $3.downcase
      book    = $1.downcase
      chapter = $2
      redirect_to("#{base_url}/bible/#{version}/#{book}.#{chapter}.1.#{version}") and return

    # Gen.NIV - Book and version
    when /^([0-9]?[a-zA-Z]+)\.([0-9a-zA-Z-]+(?![.: ]))$/
      version = $2.downcase
      book    = $1.downcase
      redirect_to("#{base_url}/bible/#{version}/#{book}.1.1.#{version}") and return

    else
      redirect_to("#{base_url}/404")
    end
  end


  include NewRelic::Agent::Instrumentation::ControllerInstrumentation
  add_transaction_tracer :index
end