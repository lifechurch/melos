class TrackingsController < ApplicationController

  def app
    db = MongoConnector.connection
    collection = db.collection("app")

    datetime    = DateTime.now.change(sec:0).utc  # time object with minute resolution
    seconds     = datetime.to_i                   # changes to epoch

    resolution  = {'sec' => seconds}
    insert      = {'$inc' => {"cnt" => 1 }}

    collection.update(resolution, insert, {:upsert  => true}) # fire and forget


    tracker = Gabba::Gabba.new(@site.ga_code, @site.ga_domain)
    tracker.identify_user(cookies[:__utma], cookies[:__utmz])
    tracker.event("App", "Download", "url", "#{request.host_with_port}#{request.fullpath}", true)

    redirect_to("/download", status: 302)
  end

end