class ReferencesController < ApplicationController
  before_filter :set_nav
  before_filter :strip_format, only: [:show]
  before_filter :redirect_incorrect_reference, only: [:show]
  rescue_from InvalidReferenceError, with: :ref_not_found

  def show
    # Set HTML classes for full screen/parallel

    client_settings.reader_full_screen = 1 if params[:full_screen]
    @presenter          = Presenter::Reference.new(params,self)
    set_sidebar_for_state(default_to: Presenter::Sidebar::Reference.new(params,self))
  end

  def highlights
    @highlights = Highlight.for_reference(ref_from_params, auth: current_auth) if current_auth
    @highlights ||= []
    render json: @highlights
  end

  def notes
    #API Constraint to be put in model eventually
    ref = ref_from_params rescue not_found
    ref = ref.merge(verses: "1-10") if ref.is_chapter?
    @notes = Note.for_reference(ref, language_iso: I18n.locale, cache_for: a_short_time)
    @notes = Note.for_reference(ref, cache_for: a_short_time) if @notes.empty?
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
    def ref_not_found(ex)
      @highlight_colors = User.highlight_colors rescue []
      @note = Note.new

      if ex.is_a? BadSecondaryVersionError
        @alt_version = Version.find(cookies[:alt_version])
        @alt_reference = Hashie::Mash.new({content: "<h1>#{t('ref.invalid chapter title')}</h1> <p>#{t('ref.invalid chapter text')}</p>"})
        return render :show if @reference.valid?
      end

      if ex.is_a? NoSecondaryVersionError
        @alt_version = @version
        @alt_reference = Hashie::Mash.new({content: "<h1>#{t('ref.no secondary version title')}</h1> <p>#{t('ref.no secondary version text', language_name: t('language name'))}</p>"})
        return render :show if @reference.valid?
      end

      #we don't need to report these types of 404's as long as we have the right redirects.
      #report_exception(ex, self, request)

      #force to be in non-parallel/fullscreen mode for Ref_not_found
      client_settings.reader_full_screen = nil
      client_settings.reader_parallel_mode = nil

      @version = Version.find(params[:version]) rescue Version.find(Version.default_for(I18n.locale) || Version.default)
      @alt_version ||= @version

      # try to validate reference against default version
      # to show the reference title as it would be displayed in a valid version
      @alt_reference = @reference = Reference.new( params[:reference], version: Version.default ) rescue nil

      unless @reference.try :valid?
        # completely invalid reference, just fake it
        @alt_reference = @reference = default_reference
      end

      render :invalid_ref, status: 404
    end
end
