class MomentsController < BaseMomentsController

  include YV::Concerns::Exceptions

  # Base moment controller abstractions
    moment_resource "Moment"
    moment_comments_display true



  before_filter :force_login
  before_filter :redirect_moment, only: [:show]

  # TODO - optimize before filterage, especially for the #show redirect

  respond_to :html, :js

  # A logged in users Moments/Home feed
  def index
    return redirect_to("/moments/introduction") unless client_settings.viewed_social_intro
    # recent_versions = client_settings.recent_versions
    # @user    = current_user
    # @feed    = YV::Moments::Feed.new(
    #   prev_end_day: params[:paginated_end_day] || 0,
    #   auth: current_auth,
    #   page: @page,
    #   version: client_settings.version || 1,
    #   recent_versions: recent_versions.present? ? recent_versions.split("/") : [client_settings.version || Version.default]
    # )
    # @moments = @feed.moments
  end


  # Action renders cards partial for the returned moments
  def _cards
    recent_versions = client_settings.recent_versions
    # If our user_id param is present, use that to find user, otherwise assume current user
    @user = current_user
    @feed    = YV::Moments::Feed.new(
      auth: current_auth,
      page: @page,
      version: client_settings.version || Version.default_for(I18n.locale) || Version.default,
      recent_versions: recent_versions.present? ? recent_versions.split("/") : [client_settings.version || Version.default_for(I18n.locale) || Version.default]
    )
    @moments = @feed.moments

    respond_to do |format|
      format.html do
        render partial: "moments/cards", locals: {moments: @moments, comments_displayed: self.class.moment_comments_displayed}, layout: false
      end
      format.json # renders _cards.json.jbuilder
    end
  end


  def related
    @user       = current_user
    @moments    = Moment.all(auth: current_auth, page: @page, user_id: id_param(current_auth.user_id), usfm: params[:usfm].upcase, version_id: id_param(params[:v]))
    @reference  = Reference.new(params[:usfm], version: params[:v].to_i)

    respond_to do |format|
      format.html
      format.json # renders _cards.json.jbuilder
    end
  end

  # This supports API action_urls that are formatted /moments/123thisID
  # It also supports moments that don't already have a resourceful route, like reading plan completions.
  # Before filter looks up the moment and redirects to the appropriate page if necessary
  # Otherwise, show will render the appropriate partial
  # TODO - skip any before filters that arent necessary
  def show
  end

  def introduction
    client_settings.viewed_social_intro!
  end

  def redirect_moment
    @moment = Moment.find(params[:id], auth: current_auth)
    render_404 if @moment.nil? || @moment.errors.present?
    #redirect_to @moment.to_path
  end
end