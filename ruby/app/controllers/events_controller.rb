class EventsController < ApplicationController
  include ApplicationHelper

  layout 'node_app'

  def show
    p = {
        "id" => params[:id],
        "strings" => {}
    }

    fromNode = YV::Nodestack::Fetcher.get('SingleEvent', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']

    render locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']) }
  end


end
