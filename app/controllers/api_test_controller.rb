class ApiTestController < ApplicationController

  def index
    if params[:p] == 'yv123'
      @results = [{title: "versions all", times: time_call("bible/versions", type: 'all')},
                  {title: "bible chapter", times: time_call("bible/chapter", reference: "GEN.1", id: 59)},
                  {title: "reading plans index", times: time_call("search/reading_plans", query: '*')},
                  {title: "notes for genesis 1", times: time_call("search/notes", reference: "GEN.1", query: "*")},
                  {title: "highlights for gen.1", times: time_call("highlights/chapter", reference: "JHN.1", version_id: 1, auth: current_auth)}]
    end
  end

  private

  def time_call(path, opts = {})


    (params[:i] || 3).to_i.times.map do
      get_start = Time.now.to_f
      # cache for 1 min: don't just **allow** a DDOS attack :D
      YvApi.get(path, opts) do
        -1 #error
      end
      ((Time.now.to_f - get_start) * 1000).to_i
    end
  end
end
