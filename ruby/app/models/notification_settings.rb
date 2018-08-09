# Implements a subset of the Notifications API (#settings, #update_settings)
# http://developers.youversion.com/api/docs/3.1/sections/notifications.html

class NotificationSettings < YV::Resource


  api_response_mapper YV::API::Mapper::NotificationSettings

  attribute :token
  attribute :user_id
  attribute :notification_settings
  attribute :language_tag

  attr_accessor :badges
  attr_accessor :newsletter
  attr_accessor :reading_plans
  attr_accessor :partners
  attr_accessor :moments
  attr_accessor :comments
  attr_accessor :friendships
  attr_accessor :likes
  attr_accessor :contact_joins
  attr_accessor :pwf_accepts
  attr_accessor :pwf_invites
  attr_accessor :pwf_comments
  attr_accessor :pwf_reminders

  class << self

    def resource_path
      "notifications/settings"
    end

    def update_path
      "notifications/update_settings"
    end

    def create_path
      update_path
    end



    # NotificationSettings#find
    # --------------------------------------------------------------------

    # API Method
    # Retrieve notification settings for a user
    # returns a YV::API::Results decorator for NotificationSettings instance

    # valid options
    # - auth: user.auth to scope call to authed user
    # - token: custom token to allow viewing settings without a 'session'

    # example returned data:
    # [{"notification_settings"=>
    #    {"partners"=>{"push"=>true, "email"=>true},
    #     "friendships.accept"=>{"push"=>true, "email"=>true},
    #     "newsletter"=>{"push"=>true, "email"=>true},
    #     "friendships.create"=>{"push"=>true, "email"=>true},
    #     "note_like"=>{"email"=>true, "push"=>true},
    #     "reading_plans"=>{"push"=>true, "email"=>true},
    #     "follower"=>{"email"=>true, "push"=>true},
    #     "friendships.suggestion"=>{"push"=>true, "email"=>true},
    #     "badges"=>{"push"=>true, "email"=>true}},
    #   "language_tag"=>"en",
    #   "user_id"=>7440,
    #   "token"=>"3f610fb438b0e2eac49b35f8ea018148370b0339"},
    #  nil]

    def find(opts = {})
      super(nil, opts)
    end

  end


  def auth_present?
    !(auth || token).nil?
  end

  def persist_token
    nil
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

  def before_save
    hash = {}
    settings = ["badges","newsletter","contact_joins","reading_plans","moments","comments","likes","friendships", "pwf_accepts", "pwf_invites", "pwf_comments", "pwf_reminders"]

    settings.each do |n|
      setting = self.send(n.to_sym)

      hash[n] = if setting.present?
        email = (setting["email"]) ? setting["email"].to_bool : false
        push  = (setting["push"])  ? setting["push"].to_bool : false
        {"email" => email,"push" => push }
      else
        {"email" => false,"push" => false }
      end
    end

    @attributes['notification_settings'] = hash
  end

end
