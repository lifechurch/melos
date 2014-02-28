class MomentsController < BaseMomentsController

  # Base moment controller abstractions
    moment_resource "Moment"
    moment_comments_display true



  before_filter :force_login

  # TODO - optimize before filterage, especially for the #show redirect

  respond_to :html, :js

  # A logged in users Moments/Home feed
  def index
    recent_versions = client_settings.recent_versions
    @user    = current_user
    @feed    = YV::Moments::Feed.new(
      prev_end_day: params[:paginated_end_day] || 0,
      auth: current_auth,
      page: @page,
      version: client_settings.version || 1,
      recent_versions: recent_versions.present? ? recent_versions.split("/") : [client_settings.version || Version.default]
    )
    @moments = @feed.moments
  end


  # Action renders cards partial for the returned moments
  def _cards
    recent_versions = client_settings.recent_versions
    # If our user_id param is present, use that to find user, otherwise assume current user
    @user = current_user
    @feed    = YV::Moments::Feed.new(
      auth: current_auth,
      page: @page,
      version: client_settings.version || 1,
      recent_versions: recent_versions.present? ? recent_versions.split("/") : [client_settings.version || Version.default]
    )
    @moments = @feed.moments

    respond_to do |format|
      format.html do
        render partial: "moments/cards", locals: {moments: @moments, comments_displayed: self.class.moment_comments_displayed}, layout: false
      end
      format.json
    end
  end


  def related
    @user    = current_user
    @moments = Moment.all(auth: current_auth, user_id: id_param(current_auth.user_id), usfm: params[:usfm].upcase, version_id: id_param(params[:v]))
    @reference = Reference.new(params[:usfm], version: params[:v].to_i)
  end

  # This is solely to support API action_urls that are formatted /moments/123thisID
  # Lookup the moment and redirect to the appropriate page.
  # TODO - skip any before filters that arent necessary
  def show
    moment = Moment.find(params[:id], auth: current_auth)
    redirect_to moment.to_path
  end

  def introduction

  end

end