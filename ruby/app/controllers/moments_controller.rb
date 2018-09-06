class MomentsController < BaseMomentsController

  include YV::Concerns::Exceptions

  # Base moment controller abstractions
    moment_resource "Moment"
    moment_comments_display true

  prepend_before_filter :mobile_redirect, only: [:index, :show]
  before_filter :force_login
  before_filter :find_moment, :resourceful_redirect, only: [:show]

  # TODO - optimize before filterage, especially for the #show redirect

  respond_to :html, :js

  # A logged in users Moments/Home feed
  def index
  end


  # Action renders cards partial for the returned moments
  def _cards
    recent_versions = client_settings.recent_versions
    # Assumes current user's moments
    @user = current_user
    @feed    = YV::Moments::Feed.new(
      auth: current_auth,
      page: @page,
      version: client_settings.version || Version.default_for(I18n.locale) || Version.default,
      recent_versions: recent_versions.present? ? recent_versions.split("/") : [client_settings.version || Version.default_for(I18n.locale) || Version.default]
    )
    @moments = @feed.moments
    @subscriptions = Subscription.all(@user, auth: current_auth)
    if @subscriptions
      if @subscriptions.reading_plans
        @subscriptions = @subscriptions.reading_plans.map! { |s| s.id }
      else
        @subscriptions = @subscriptions.map! { |s| s.id }
      end
    end

    @saved = Subscription.allSavedIds(current_user) if current_user.present?
    if @saved
      if @saved.reading_plans
        @saved = @saved.reading_plans.map! { |s| s }
      else
        @saved = @saved.map! { |s| s }
      end
    end

    respond_to do |format|
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
  # It supports moments that don't already have a resourceful route, like reading plan completions.
  # Before filter looks up the moment type and redirects to the appropriate resourceful route if present
  # TODO - skip any before filters that arent necessary
  def show
    @user           = current_user
    @subscriptions  = Subscription.all(@user, auth: current_auth)
    if @subscriptions
      if @subscriptions.reading_plans
        @subscriptions = @subscriptions.reading_plans.map! { |s| s.id }
      else
        @subscriptions = @subscriptions.map! { |s| s.id }
      end
    end
    respond_to do |format|
      format.html
      format.json # renders show.json.jbuilder
    end
  end

  def introduction
    client_settings.viewed_social_intro!
  end

end
