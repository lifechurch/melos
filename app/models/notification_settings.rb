# Implements a subset of the Notifications API (#settings, #update_settings)
# http://developers.youversion.com/api/docs/3.1/sections/notifications.html

class NotificationSettings < YV::Resource

  attribute :token
  attribute :user_id
  attribute :language_tag
  attribute :notification_settings

  attr_accessor :badges
  attr_accessor :follower
  attr_accessor :newsletter
  attr_accessor :note_like
  attr_accessor :reading_plans
  attr_accessor :partners


  class << self

    def resource_path
      "notifications/settings"
    end

    def update_path
      "notifications/update_settings"
    end

    def create_path
      "notifications/update_settings"
    end

    # NotificationSettings#find
    # --------------------------------------------------------------------

    # API Method
    # Retrieve notification settings for a user
    # returns a YV::API::Results decorator forr NotificationSettings instance

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

  def after_build
    notification_settings.each { |k, v| self.send("#{k}=".to_sym, v["email"]) if self.respond_to? "#{k}=".to_sym}
  end
  
  def user
    results = User.find(self.user_id)
    return results.data if results.valid?
  end


  def before_save
    nts = ["badges", "follower", "newsletter", "note_like", "reading_plans", "partners"]
    hash = {}

    nts.each { |a| hash[a] = {"email" => self.send(a.to_sym).to_i == 1} }
    @attributes['notification_settings'] = hash
  end

end
