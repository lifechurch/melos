class NotificationsController < ApplicationController

  layout 'settings'

  respond_to :html, :json

  before_filter :force_login, only: [:show]
  before_filter :force_notification_token_or_login, only: [:edit, :update]

  def show
    # @user = get_user
    # @notifications = get_notifications
    # if (@user and @notifications)
    #   respond_with @notifications do |format|
    #     format.html { render :layout => 'users' }
    #   end
    # else
    #   render_404
    # end
    #
		p = {
				"strings" => {},
				"languageTag" => I18n.locale.to_s,
				"url" => request.path,
				"cache_for" => YV::Caching::a_very_long_time
		}

		fromNode = YV::Nodestack::Fetcher.get('Notifications', p, cookies, current_auth, current_user, request, cookie_domain)

		if (fromNode['error'].present?)
			return render_404
		end

		@title_tag = fromNode['head']['title']
		@node_meta_tags = fromNode['head']['meta']

		render locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']) }, layout: 'node_app'
  end

  def edit
    @current_user = get_user
    if (!@current_user)
      redirect_to sign_in_path(redirect: notification_settings_path) and return
    end

    @results = NotificationSettings.find(params[:token].present? ? {token: params[:token]} : {auth: current_auth})
    @settings = @results.data
    self.sidebar_presenter = Presenter::Sidebar::User.new(@user,params,self)
  end

  def update
    @settings = NotificationSettings.find(params[:token] ? {token: params[:token]} : {auth: current_auth})
    @results = @settings.update(params[:settings] || {})
    if @results.valid?
       flash[:notice] = t('users.profile.updated notifications')
       redirect_to(edit_notifications_path(token: params[:token]))
    else
      @user = get_user
      flash[:error] = t('users.profile.notification errors')
    end
  end

	def unsubscribe
		p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('Unsubscribe', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'unsubscribe', locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']) }, layout: 'node_only'
	end

	def manage_notifications
		unsubscribe
	end

  def destroy
    # This method is for clearing (marking as read) notifications
    # Rather than shoehorning this into update (messy), or separating controllers (probably the best option, but most complex)
    Notification.read!(auth: current_auth)
    # No error checking client side, so pull a Nike and Just Do It
    render json: true
  end

  private

  def get_user
    if current_auth
      current_user
    elsif settings = NotificationSettings.find({token: params[:token]})
      User.find(settings.user_id)
    else
      force_login
    end
  end


  def get_notifications
    notifications = current_auth.present? ? Notification.all(auth: current_auth) : []
    # Filter on params[:length] if necessary
    notifications = notifications[0...params[:length].to_i] if params[:length]
    notifications
  end

end
