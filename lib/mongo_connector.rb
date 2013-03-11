require 'rubygems'
require 'mongo'

module MongoConnector
  extend self

  def connection_info=(info_hsh)
    @@connection_info = info_hsh
  end

  def connect!
    replicas = @@connection_info[:replicas]
    dbname   = @@connection_info[:database]
    user     = @@connection_info[:user]
    pass     = @@connection_info[:password]
    connection = Mongo::ReplSetConnection.new(replicas).db(dbname)
    connection.authenticate(user, pass)
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