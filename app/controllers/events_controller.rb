class EventsController < ApplicationController
  include ApplicationHelper

  layout 'node_app'

  before_filter :set_locale


  def index
    # /kids
    # tracks requests to /app to GA custom event.
    # then redirects to an store for mobile device if found

    # only allow kids page to localize for the kids whitelist locales
    @locale = :en unless i18n_events_whitelist.include? I18n.locale
  end

  def show
    p = {
        "id" => params[:id],
        "strings" => {}
    }

    fromNode = YV::Nodestack::Fetcher.get('SingleEvent', p, cookies, current_auth, current_user)

    if (fromNode['error'].present?)
      return render_404
    end

    @title = fromNode['head']['title']

    render locals: { html: fromNode['html'], js: fromNode['js'] }
  end




end
