class TrackingsController < ApplicationController

  def app
    db = MongoConnector.connection
    collection = db.collection("app")

    datetime    = DateTime.now.change(sec:0).utc  # time object with minute resolution
    seconds     = datetime.to_i                   # changes to epoch

    resolution  = {'sec' => seconds}
    insert      = {'$inc' => {"cnt" => 1 }}

    collection.update(resolution, insert, {:upsert  => true}) # fire and forget
    redirect_to("/download", status: 302)
  end

end