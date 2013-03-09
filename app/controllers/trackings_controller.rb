class TrackingsController < ApplicationController

  def app
    db = MongoConnector.connection
    collection = db.collection("app")

    resolution  = {'res' => minute_resolution_string}
    insert      = {'$inc' => {"cnt" => 1 }}
    collection.update(resolution, insert, {:upsert  => true})
    redirect_to("/download", status: 302)
  end

  private

  def minute_resolution_string
    dt = DateTime.now.utc
    "#{dt.year}:#{dt.month}:#{dt.day}:#{dt.hour}:#{dt.minute}"
  end

end