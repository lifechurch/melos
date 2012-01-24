class ApiTestController < ApplicationController

  def index
    @results = [{title: "gen.1.asv", data: time_call("bible/chapter", reference: "gen.1", version: "asv")},
                {title: "gen.2.3.niv", data: time_call("bible/verse", reference: "gen.2.3", version: "niv")},
                {title: "gen.5.msg", data: time_call("bible/chapter", reference: "gen.5", version: "msg")},
                {title: "reading plans index", data: time_call("reading_plans/library")},
                {title: "notes for genesis 1:1", data: time_call("notes/index", reference: "gen.1")},
                {title: "404", data: time_call("foo/bar")}
               ]
  end

  private

  def time_call(path, opts = {})
    10.times.map do
      get_start = Time.now.to_f
      YvApi.get(path, opts)
      ((Time.now.to_f - get_start) * 1000).to_i
    end
  end


end
