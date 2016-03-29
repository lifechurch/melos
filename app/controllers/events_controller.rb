class EventsController < ApplicationController
  layout 'node_app'

  def show
    p = {
        "id" => params[:id],
        "strings" => {}
    }

    fromNode = YV::Nodestack::Fetcher.get('EventView', p, cookies, current_auth, current_user)

    if (fromNode['error'].present?)
      return render_404
    end

    @title = fromNode['head']['title']

    render locals: { html: fromNode['html'], js: fromNode['js'] }
  end
end
