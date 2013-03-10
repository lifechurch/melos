require 'rubygems'
require 'mongo'

module MongoConnector
  extend self

  def connection_string=(string)
    @@connection_string = string
  end

  def connect!
    db         = URI.parse(@@connection_string)
    @@database = db.path.gsub(/^\//, '')
    connection = Mongo::Connection.new(db.host, db.port).db(@@database)
    connection.authenticate(db.user, db.password) unless (db.user.nil? || db.user.nil?)
    connection
  end

  def connection
    @@connection ||= connect!
  end

  def database
    @@database ||= 'test'
  end

  def handle
    connection[self.database]
  end
end