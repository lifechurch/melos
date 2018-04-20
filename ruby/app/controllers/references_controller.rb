DEFAULT_VERSIONS = YAML.load_file("#{Rails.root}/config/locale_versions.yml")

class ReferencesController < ApplicationController

  before_filter :mobile_redirect,               only: [:show]
  before_filter :check_site_requirements,       only: [:show]
  before_filter :fix_invalid_reference,         only: [:show]
  before_filter :strip_format,                  only: [:show]
  # before_filter :setup_presenters,              only: [:show]

  rescue_from InvalidReferenceError, with: :ref_not_found

  def show
    now_reading(self.presenter.reference)
    respond_to do |format|
      format.html
      format.xml  { render nothing: true }
      format.json { render "show.json.rabl" }
    end
  end


  def reader

    # if we're trying to just load reference content for moments items then go to show
    # otherwise we're going to render the node reader
    if params[:reference].try(:"end_with?", '.json')
      setup_presenters
      return show
    end

    # if the following hash lookup changes the params, let's redirect with the new params
    # so the node main and load data match up
    redirect = false
    # replace any colon with a .
    reference = params[:reference]
    if !reference.nil? and reference.include?(":")
      redirect = true
    end
    reference.gsub!(/:/, '.') unless reference.nil?
    ref = reference.split('.') unless reference.nil?
    book = ref[0] unless ref.nil?
    version = params[:version]
    url = request.path
    spliturl = url.split('/')

    # HACK (km): sometimes the url can have invalid utf-8 characters
    # /bible/46/rom.8.15.cunp-%E7%A5%EF
    # so strip those out before attempting to parse as a reference
    if reference
      reference = reference.encode('UTF-16le', invalid: :replace, replace: '')
      reference = reference.encode('UTF-8')

      # fix param references where reference only has the book
      # coming in as /bible/nasb/gen or /bible/nkjv/gen etc  - from campus.316networks.com
      if /^[a-zA-Z0-9]{3,}$/.match(reference)
        reference = "#{reference}.1"
      end

      if reference.try(:"end_with?", '.json')
        reference.gsub!('.json', '')
        request.format = :json
      end

      if reference.try(:"end_with?", '.')
        reference.gsub!(/\.$/, '')
      end

      if (reference.include?("+"))
        refs = reference.split("+")
        refNums = []
        refs.each do |ref|
          refNums.push(ref.split(".")[2])
        end

        reference = "#{ref[0]}.#{ref[1]}.#{refNums.join(",")}"
      end
    end

    if book.is_a? String
      # leave it if it's already a USFM code
      _book = Cfg.osis_usfm_hash[:books][book.downcase]
      # try to parse from known values
      # _book ||= Cfg.osis_usfm_hash[:books][@hash[:book].downcase]
      if _book.nil?
        reference = nil
      else
        reference = "#{reference.gsub(book, _book)}"
      end

      redirect = true if reference != params[:reference]
    end

    # if there is a version it needs to be API3 id or match our known versions
    if version.present?
      # leave it if it's already an API3 id (positive #)
      _ver = version if version.is_a?(Fixnum) || (version.match(/\A\d*\z/)&& version.to_i > 0)
      # try to parse from known values
      _ver ||= Cfg.osis_usfm_hash[:versions][version.downcase] if version.is_a? String

      # if the version isn't a positive number, nor a string that matches the lookup,
      # let's render a 404 instead of rendering an error in node
      if _ver.blank?
        return render_404
      end

      version = _ver
      redirect = true if version != params[:version]
    end


    if redirect
      return redirect_to reference_path(version: version, reference: reference)
    end

    if reference
      url = "/#{spliturl[1]}/#{spliturl[2]}/#{reference}"
    end

    if params["parallel"].present?
      url = "#{url}?parallel=#{params['parallel']}"
    end

    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => url,
        "cache_for" => YV::Caching::a_very_long_time,
        "version" => ((version and !version.nil?) ? version : nil),
        "ref" => ((reference and !reference.nil?) ? reference : nil),
        "altVersions" => DEFAULT_VERSIONS,
        "parallelVersion" => params["parallel"]
    }

    fromNode = YV::Nodestack::Fetcher.get('Bible', p, cookies, current_auth, current_user, request)

    if (fromNode['error'].present?)
      # puts "----"*100
      # puts fromNode["stack"]
      # puts "----"*100
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']
    @render_rails_meta = true
    @deeplink_version = version
    @deeplink_reference = reference

    render 'show', layout: "node_app", locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
  end

  # def passage
  #   # now_reading(self.presenter.reference)
  #   # respond_to do |format|
  #   #   format.html
  #   #   format.xml  { render nothing: true }
  #   #   format.json { render "show.json.rabl" }
  #   # end
  #
  #   versions = DEFAULT_VERSIONS.key?(I18n.locale.to_s) ? DEFAULT_VERSIONS[I18n.locale.to_s] : DEFAULT_VERSIONS["en"]
  #
  #   p = {
  #       "strings" => {},
  #       "languageTag" => I18n.locale.to_s,
  #       "url" => request.path,
  #       "cache_for" => YV::Caching::a_very_long_time,
  #       "versions" => versions['text'],
  #       "ref" => params[:reference]
  #   }
  #
  #   fromNode = YV::Nodestack::Fetcher.get('Passage', p, cookies, current_auth, current_user, request)
  #
  #   if (fromNode['error'].present?)
  #     return render_404
  #   end
  #
  #   @title_tag = fromNode['head']['title']
  #   @node_meta_tags = fromNode['head']['meta']
  #
  #   render 'show', locals: { html: fromNode['html'], js: fromNode['js'], css: fromNode['css'] }
  # end

  protected

    def setup_presenters
      ref = params[:reference] || last_read.try(:to_param) || default_reference.try(:to_param)

      # override the version in the reference param with the explicit version in the URL (or current_version in the case of /bible)
      # this is a temporary hack until Version/Reference class clean-up
      ref_string  = YV::ReferenceString.new(ref, overrides: {version: params[:version] || current_version})
      ref_hash    = ref_string.to_hash
      tmp_ref_string  = YV::ReferenceString.new(ref)
      tmp_ref_hash = tmp_ref_string.to_hash

      # If somebody visits just /bible
      if params[:version].blank? && ref_hash[:chapter].present? # url
        ref_hash[:version] ||= current_version
        ref_hash[:chapter] ||= "1"
        flash.keep
        reference = Reference.new(ref_hash)
        return redirect_to reference_path(version: reference.version, reference: reference.to_param)
      elsif !tmp_ref_hash[:version].present?
        ref_hash[:version] ||= current_version
        ref_hash[:chapter] ||= "1"
        flash.keep
        reference = Reference.new(ref_hash)
        return redirect_to reference_path(version: reference.version, reference: reference.to_param)
      end

      self.presenter = Presenter::Reference.new(ref_string, params, self)
      self.sidebar_presenter = Presenter::Sidebar::Reference.new(ref_string, params ,self)

      unless presenter.valid_reference?
        if request.xhr?
          return render json: "error", status: 400
        else
          return render_404
        end
      end

    end

    # HACK (km): sometimes the url can have invalid utf-8 characters
    # /bible/46/rom.8.15.cunp-%E7%A5%EF
    # so strip those out before attempting to parse as a reference
    def fix_invalid_reference
      if params[:reference]
        params[:reference] = params[:reference].encode('UTF-16le', invalid: :replace, replace: '')
        params[:reference] = params[:reference].encode('UTF-8')
        # fix param references where reference only has the book
        # coming in as /bible/nasb/gen or /bible/nkjv/gen etc  - from campus.316networks.com
        if /^[a-zA-Z0-9]{3,}$/.match(params[:reference])
          params[:reference] = "#{params[:reference]}.1"
        end
      end
    end

    # Filter any possible @site requirements here.
    def check_site_requirements
      if @site.versions && params[:version].present? && (not @site.versions.include?(params[:version].to_i))  # some sites don't define a versions array
        render_404
      end
    end

    # we allow . (dots) in our reference constraint, so we pull
    # the format manually in this case
    def strip_format
      if params[:reference].try(:"end_with?", '.json')
        params[:reference].gsub!('.json', '')
        request.format = :json
      end
    end


    def ref_not_found(exception)
      #force to be in non-parallel/fullscreen mode for Ref_not_found
      # client_settings.reader_full_screen = client_settings.reader_parallel_mode = nil
      #
      # if exception.is_a? BadSecondaryVersionError
      #   ref_string  = YV::ReferenceString.new(params[:reference])
      #   self.presenter = Presenter::Reference.new(ref_string, params, self, {
      #     alt_version: Version.find(cookies[:alt_version]),
      #     alt_reference: Hashie::Mash.new({content: "<h1>#{t('ref.invalid chapter title')}</h1> <p>#{t('ref.invalid chapter text')}</p>"})
      #   })
      #   return render :show if self.presenter.reference.valid?
      # end
      #
      # if exception.is_a? NoSecondaryVersionError
      #   ref_string  = YV::ReferenceString.new(params[:reference])
      #   pres = Presenter::Reference.new(ref_string, params, self, {
      #     alt_version: Version.find(1),
      #     alt_reference: Hashie::Mash.new({content: "<h1>#{t('ref.no secondary version title')}</h1> <p>#{t('ref.no secondary version text', language_name: t('language name'))}</p>"})
      #   })
      #   # TODO: temporary hack until we can simply set both version and alt_version
      #   # initially set version above to KJV, which is valid, then reassign to @presenter.version
      #   pres.alt_version = pres.version
      #   self.presenter = pres
      #
      #   return render :show if self.presenter.reference.valid?
      # end
      #
      # # Setup defaults
      # # ------------------------------------------------------------------------------------------------------
      # # try to validate reference against default version to show the reference title as it would be displayed in a valid version
      # # alt_reference = reference = Reference.new( params[:reference], version: Version.default ) rescue nil
      #
      # # completely invalid reference, just fake it
      # alt_reference = reference = default_reference
      #
      # pres = Presenter::InvalidReference.new(params,self)
      #   pres.version        = Version.find(params[:version]) rescue Version.find(Version.default_for(I18n.locale) || Version.default)
      #   pres.alt_version    = cookies[:alt_version].present? ? Version.find(cookies[:alt_version]) : pres.version
      #   pres.reference      = reference
      #   pres.reference_string = YV::ReferenceString.new(reference.to_param)
      #   pres.alt_reference  = alt_reference
      #
      # self.presenter = pres
      #
      # if request.xhr?
      #   return render json: "error", status: 400
      # else
      #   # return render :invalid_ref, status: 404, locals: {presenter: pres}
      # end

      return show

    end
end
