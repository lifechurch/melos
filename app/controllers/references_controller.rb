class ReferencesController < ApplicationController
  before_filter :set_nav
  before_filter :strip_format, only: [:show]
  before_filter :redirect_incorrect_reference, only: [:show]
  rescue_from InvalidReferenceError, with: :ref_not_found

  def show
    # Set HTML classes for full screen/parallel

    client_settings.reader_full_screen = 1 if params[:full_screen]
    @presenter = Presenter::Reference.new(params,self)
    set_sidebar_for_state(default_to: Presenter::Sidebar::Reference.new(params,self))
    now_reading(@presenter.reference)
  end

  def highlights
    @highlights = Highlight.for_ref(ref_from_params, auth: current_auth) if current_auth
    @highlights ||= []
    render json: @highlights
  end

  def notes
    #API Constraint to be put in model eventually
    @ref = ref_from_params rescue not_found
    #@ref = @ref.merge(verses: "1-10") if @ref.is_chapter?
    @notes = Note.for_reference(@ref, language_iso: I18n.locale, cache_for: a_short_time)
    @notes = Note.for_reference(@ref, cache_for: a_short_time) if @notes.empty?
    render layout: false
  end

  def bookmarks
    @bookmarks = Bookmark.for_user(current_auth.user_id)
    render '/shared/_widget_bookmarks', layout: false
  end


  private

  def redirect_incorrect_reference

    ref = params[:reference] || last_read.try(:to_param) || default_reference.try(:to_param)
    ref_hash = YouVersion::ReferenceString.new(ref).to_hash
    ref_hash[:version] = params[:version]

    unless params[:version] && ref_hash[:chapter]
      ref_hash[:version] ||= current_version
      ref_hash[:chapter] ||= "1"
      flash.keep
      return redirect_to bible_path(Reference.new(ref_hash))
    end
  end

  def set_nav
    @nav = :bible
  end

  def strip_format
    # we allow .s in our reference constraint, so we pull
    # the format manually in this case
    if params[:reference].try(:"end_with?", '.json')
      params[:reference].gsub!('.json', '')
      request.format = :json
    end
  end

  protected
    def ref_not_found(exception)

      if exception.is_a? BadSecondaryVersionError
        @presenter = Presenter::Reference.new(params,self, {
          alt_version: Version.find(cookies[:alt_version]),
          alt_reference: Hashie::Mash.new({content: "<h1>#{t('ref.invalid chapter title')}</h1> <p>#{t('ref.invalid chapter text')}</p>"})
        })
        return render :show if @presenter.reference.valid?
      end

      if exception.is_a? NoSecondaryVersionError
        @presenter = Presenter::Reference.new(params,self, {
          alt_version: Version.find(1),
          alt_reference: Hashie::Mash.new({content: "<h1>#{t('ref.no secondary version title')}</h1> <p>#{t('ref.no secondary version text', language_name: t('language name'))}</p>"})
        })
        # TODO: temporary hack until we can simply set both version and alt_version
        # initially set version above to KJV, which is valid, then reassign to @presenter.version
        @presenter.alt_version = @presenter.version

        return render :show if @presenter.reference.valid?
      end

      #force to be in non-parallel/fullscreen mode for Ref_not_found
      client_settings.reader_full_screen = nil
      client_settings.reader_parallel_mode = nil

      # Setup defaults
      # ------------------------------------------------------------------------------------------------------
      # try to validate reference against default version to show the reference title as it would be displayed in a valid version
        alt_reference = reference = Reference.new( params[:reference], version: Version.default ) rescue nil

      # completely invalid reference, just fake it
        alt_reference = reference = default_reference unless reference.try :valid?

      @presenter = Presenter::InvalidReference.new(params,self)
        @presenter.version        = Version.find(params[:version]) rescue Version.find(Version.default_for(I18n.locale) || Version.default)
        @presenter.alt_version    = cookies[:alt_version].present? ? Version.find(cookies[:alt_version]) : @presenter.version
        @presenter.reference      = reference
        @presenter.alt_reference  = alt_reference

      render :invalid_ref, status: 404, locals: {presenter: @presenter}
    end
end
