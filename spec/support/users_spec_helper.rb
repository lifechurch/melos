module UsersSpecHelper
  def ensure_user(opts = {})
    opts[:username] ||= "testuser#{rand(100000)}"
    opts[:password] ||= 'tenders'
    begin
      user = User.authenticate(opts[:username], opts[:password])
      user.destroy
    rescue
    end
    opts = {email: "#{opts[:username]}@youversion.com", agree: true, language_tag: "en", verified: true, locale: "en_US"}.merge opts
    response = User.register(opts)
    begin
      user = User.authenticate(opts[:username], opts[:password])
      unless user
        # ugh
        sleep 10
        user = User.authenticate(opts[:username], opts[:password])
      end
    rescue
    end
    user.should be_a User
    user
  end

  def ensure_users(opts = [])
    opts.each { |u| ensure_user u }
  end

  def destroy_user(opts = {})
    begin
      user = User.authenticate(opts[:username], opts[:password])
      user.destroy
    rescue
    end
  end
end

    #allows cucumber access to these helpers
    World(UsersSpecHelper) if respond_to?(:World)
