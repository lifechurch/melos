# New API introduced in 3.1 for social
# Implements a subset of Notifications API - (#all, #update)
# http://developers.youversion.com/api/docs/3.1/sections/notifications.html

# - #settings and #update_settings are implemented in NotificationSettings model


class Notification < YV::Resource

  attribute :auth
  attribute :title
  attribute :color
  attribute :action_url
  attribute :type_id
  attribute :created_dt
  attribute :extras
  attribute :avatars
  attribute :icons

  class << self

    # Notification.all
    # --------------------------------------------------------------------
    # returns a Friendship instance with friend_ids, outgoing_ids and incoming_ids populated.
    
    # options
    # * auth: required {auth: auth_hash}

    # example returned data

    # {"response"=>{
    #   "code"=>200,
    #   "data"=>{
    #    "last_viewed_dt"=>"2013-09-18T20:45:45+00:00",
    #    "new_count"=>1,
    #    "items"=>
    #     [
    #      {"base"=>{
    #        "images"=>nil,
    #        "color"=>nil,
    #        "action_url"=>nil,
    #        "title"=>{
    #         "l_str"=>"notifications.system.test",
    #         "l_args"=>{
    #          "from_name"=>"System notification test"}}},
    #       "created_dt"=>"2013-09-03T12:34:37+00:00",
    #       "extras"=>nil,
    #       "id"=>"notifications.system.test.v1"}
    #     ]},
    #   "buildtime"=>"2013-09-18T20:45:45+00:00"}
    # }

    # --------------------------------------------------------------------

    # Override Resource#find so that we don't have to pass an id
    def find(opts={})
      super(nil,opts)
    end


    # Overide lookup key for API collection responses.
    def api_response_all_key
      "items"
    end

    private

    # Overridden method from Resource class to handle #all api calls
    def process_collection_response( data )
      items = data.items
      list  = ResourceList.new
      items.each do |item|

        base = item.base

        # New notification instance
        notification = new(
          type_id:    item.id,
          created_dt: item.created_dt,
          extras:     item.extras,
          color:      base.color,
          action_url: base.action_url,
          title:      base.title        #TODO: API localize
        )

        # Build out avatars for notification
        if base.images && base.images.avatar
          avatar = base.images.avatar
          avatar.renditions.each do |ren|
            notification.avatars << Notifications::Avatar.new(
              action_url: avatar.action_url,
              height:     ren.height,
              width:      ren.width,
              url:        ren.url
            )
          end
        end

        # Build out icons for notification
        if base.images and base.images.icon
          icon = base.images.icon
          icon.renditions.each do |ren|
            notification.icons << Notifications::Icon.new(
              action_url: icon.action_url,
              height:     ren.height,
              width:      ren.width,
              url:        ren.url
            )
          end
        end

        # Append to our list finally.
        list << notification
      end
      return list
    end

    def api_resource_collection_key
      name.tableize
    end

  end

  # Update the last time a user viewed his notifications
  # pings our API to update last_viewed_at
  # ex:
  # @notifications = Notification.find(auth: me.auth)
  # @notifications.read!
  def read!
    update
  end

  # resource#update requires instance to already be persisted so that 
  # 'update' action is called instead of create
  # 
  # TODO: refactor this assumption :[
  # 
  # Overriding instance level persisted? call to not trigger a create, rather an update.
  def persisted?
    true
  end


  def before_update
    raise YV::AuthRequired unless auth.present?
  end



end