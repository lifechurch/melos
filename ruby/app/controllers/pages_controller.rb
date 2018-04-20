require 'openssl'

class PagesController < ApplicationController

  before_filter :force_login, only: [:donate]
  before_filter -> { set_cache_headers 'long' }, only: [:about, :press, :privacy, :terms]

  def about;        end
  def press;        end
  def mobile;       end
  def status;       end
  def api_timeout;  end
  def generic_error;end

  def feed;end
  def notifications;end
  def requests;end
  def intro;end

  def press
    if I18n.locale == :en
      redirect_to('https://www.youversion.com/press')
    end
  end

  def home
    @current_user = User.find(current_auth.user_id, auth: current_auth) if current_auth.present?

    # Get Featured Plans for Locale
    available_locales = Plan.available_locales.map {|loc| loc.to_s}
    @locale = I18n.locale

    langs = [ @locale.to_s, I18n.default_locale.to_s ].compact

    langs.each do |l|
      if available_locales.include?(l)
        @plan_lang = l
        break
      end
    end

    @featured_plans = Plan.all(category: "featured_plans", language_tag: @plan_lang)
    if @featured_plans.valid?
      @featured_plans = @featured_plans.slice(0,9)
      if (@featured_plans.length >= 3)
        @block_grid_size = 'medium-block-grid-3'
      else
        @block_grid_size = 'medium-block-grid-'.concat(@featured_plans.length.to_s)
      end
    end

    get_votd()
  end

  def get_votd
    # Get VOD for Locale
    @showVerseImage = I18n.locale == :en

    day = params[:day] && params[:day].to_i

    if (!day || (day > 366 || day < 1) )
      @vodImage = VOD.image_for_day(Date.today.yday(), 640)
    else
      @vodImage = VOD.image_for_day(day, 640)
    end

    if (@showVerseImage)
      version_id = @vodImage.version
    else
      version_id = Version.default_for(I18n.locale) || Version.default
    end

    @vodRef = Reference.new(@vodImage.usfm, version: version_id)

    begin
      @vodContent = @vodRef.content(as: :plaintext)
    rescue NotAChapterError
      @vodRef = Reference.new(VOD.alternate_votd(Date.today.mday), version: version_id)
      @vodContent = @vodRef.content(as: :plaintext)
    end
  end


  def snapshot
    user_id, user_id_hash = params[:user_id], params[:user_id_hash]

    # /snapshot and attempted to be logged in but
    # invalid auth (gwt expires, etc)
    if ((user_id.nil? && user_id_hash.nil?) && ((!current_user && cookies['YouVersionToken']) || (current_user && current_user.invalid?)))
      redirect_to sign_in_path(redirect: snapshot_path) and return
    end

    if current_user && (user_id.nil? && user_id_hash.nil?)
      # on /snapshot and logged in, redirect to proper snapshot url
      current_user_hash = build_snapshot_sha1_hash(current_user.id)
      return redirect_to("/snapshot/#{current_user_hash}/#{current_user.id}?year=2017")
    end

    if user_id && user_id_hash
      # we're on /snapshot/:user_id_hash/:user_id?year=2017
      unless validate_snapshot_sha1_hash(user_id,user_id_hash)
        return render_404
      end

      p = {
        "viewing_mine" => (current_user && current_user.id.to_s == user_id) ? true : false,
        "user_id" => user_id,
        "user_id_hash" => user_id_hash,
        "languageTag" => I18n.locale.to_s,
        "strings" => {}
      }

    else
      # we're on /snapshot and not logged in.
      p = {
        "viewing_mine" => false,
        "user_id" => nil,
        "languageTag" => I18n.locale.to_s,
        "strings" => {}
      }

    end

    results = YV::Nodestack::Fetcher.get('Snapshot', p, cookies, current_auth, current_user, request)

    if results['error'].present?
      return render_404
    end

    @title_tag = results['head']['title']
    @node_meta_tags = results['head']['meta']

    render locals: {
      html: results['html'],
      js: add_node_assets(results['js']),
      css: add_node_assets(results['css'])
    }

  end



  def votd
		url = request.query_string.present? ? request.path + '?' + request.query_string : request.path
		p = {
				"strings" => {},
				"languageTag" => I18n.locale.to_s,
				"url" => url,
				"day" => params[:day],
				"cache_for" => YV::Caching::a_very_long_time,
        "usfm" => params[:usfm],
        "image_id" => params[:image_id],
        "version_id" => params[:version]
		}

		day = params[:day] && params[:day].to_i
    if (day && (day > 366 || day < 1) )
      return render_404
    end

		fromNode = YV::Nodestack::Fetcher.get('VOTD', p, cookies, current_auth, current_user, request)

		if (fromNode['error'].present?)
      # puts "****"*100
      # puts fromNode["stack"]
      # puts "****"*100
			return render_404
		end

		@title_tag = fromNode['head']['title']
		@node_meta_tags = fromNode['head']['meta']

		render 'votd', layout: "node_app", locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
  end

  # /app url - redirects to an store for mobile device if found
  # tracks requests to /app to GA custom event.
  def app
    tracker = Gabba::Gabba.new(@site.ga_code, @site.ga_domain)
    tracker.identify_user(cookies[:__utma], cookies[:__utmz])
    tracker.event("App Download", "#{request.host_with_port}#{request.fullpath}")
    return redirect_store! unless request.env["X_MOBILE_DEVICE"].nil?
  end

  def privacy
    @locale = :en unless i18n_terms_whitelist.include? I18n.locale
  end

  def terms
    @locale = :en unless i18n_terms_whitelist.include? I18n.locale
  end

  def routing_error
    page = bdc_user? ? 'pages/bdc_home' : 'pages/error_404'
    render page, status: 404
  end

  # Partial Header Template Loaded via AJAX
  def header
    render "shared/header/_header_auth", layout: false
  end

  def error_404
    render "pages/error_404", status: 404 and return
  end

  def i18n_terms_whitelist
    # the following localizations have the legal terms reviewed in a way that is
    # legally appropriate to show in a localized state
    [ :da, :en, :ja, :lv, :sv, :vi, :nl, :"pt", :"no", :"zh-CN",
      :"zh-TW", :ms, :ru, :ro, :"es-ES", :uk, :ko, :af, :ca, :fr, :el, :it, :es, :tl, :th, :tr, :cy, :de, :fa,
      :sq, :bg, :hr, :cs, :fi, :id, :ko, :mn, :my, :sw, :"pt-PT", :"en-GB"
    ]
  end

  def donate
    if params[:err].present?
      begin
        raise TreadstoneAuthenticationError, "Treadstone Authentication Error: (Message: #{params[:err]}) "
      rescue TreadstoneAuthenticationError => e
        Raven.capture_exception(e)
      end
      return render :generic_error
    else
      user = current_user

      # language tags do not always match the list of available locales we are passing locale
      # so that the donate site can match the language the user was in on bible.com when they clicked 'donate'
      ts_payload = {
          created: Time.now.to_i.to_s,
          email: user.email,
          first_name: user.first_name.blank? ? "" : user.first_name,
          id: user.id.to_s,
          language_tag: I18n.locale.to_s,
          last_name: user.last_name.blank? ? "" : user.last_name,
          source: 'youversion'
      }

      if params[:campaign].present?
        ts_payload[:campaign] = params[:campaign]
      end

      ts_signature = Licenses::Request.sign( ts_payload , ENV["TREADSTONE_SECRET"] ) unless ENV["TREADSTONE_SECRET"].nil?
      ts_payload[:signature] = ts_signature
      @ts_url = Cfg.treadstone_base_url + "?" + ts_payload.to_query
      return redirect_to @ts_url
    end
  end

  def trending
    @trending_verses = Trending.all()
  end

  def apple_app_site_association
    if Rails.env.downcase == 'production'
      send_file 'apple-app-site-association-prod', :filename => 'apple-app-site-association', :type => 'application/pkcs7-mime'
    else
      send_file 'apple-app-site-association-staging', :filename => 'apple-app-site-association', :type => :json
    end
  end



  private def build_snapshot_sha1_hash(user_id)
    OpenSSL::HMAC.hexdigest('sha1', ENV['YIR_SHA1_SECRET_KEY'], user_id.to_s)
  end

  private def validate_snapshot_sha1_hash(user_id,hash)
    hash === OpenSSL::HMAC.hexdigest('sha1', ENV['YIR_SHA1_SECRET_KEY'], user_id.to_s)
  end

end
