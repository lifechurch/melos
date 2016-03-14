class EventsController < ApplicationController
  layout 'node_app'
  CookieName = 'YouVersionToken'

  def show
    if cookies.has_key?(CookieName)
      auth = auth_from_cookie
    elsif current_user && current_auth && current_auth.has_key?(:user_id) && current_user.present?
      auth = auth_from_credentials
    else
      auth = {}
    end

    fromNode = YV::Nodestack::Fetcher.get(params[:id], { auth: auth })

    # Must Have Had Invalid or Expired Token
    if (fromNode['error'] == 1)
      # Try again with credentials instead of token
      auth = auth_from_credentials
      fromNode = YV::Nodestack::Fetcher.get(params[:id], { auth: auth })
    elsif (fromNode['error'].present?)
      #Some other error occurred
      return render_404
    end

    if (!cookies.has_key?(CookieName) || cookies[CookieName] != fromNode['token']) && fromNode['token']
      cookies[CookieName] = { value: fromNode['token'], expires: 24.hour.from_now }
    end

    @title = fromNode['head']['title']

    render locals: { html: fromNode['html'], js: fromNode['js'] }
  end

  private

  def auth_from_cookie()
    return { token: cookies[CookieName] }
  end

  def auth_from_credentials()
    return { userid: current_auth.user_id, email: current_user.email, password: current_auth.password, first_name: current_user.first_name, last_name: current_user.last_name, language_tag: current_user.language_tag, timezone: current_user.timezone }
  end

end
