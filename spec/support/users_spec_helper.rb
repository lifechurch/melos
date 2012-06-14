module UsersSpecHelper
  def ensure_user(opts = {})
    opts[:username] ||= "testuser#{rand(10000)}"
    opts[:password] ||= 'tenders'
    begin
      user = User.authenticate(opts[:username], opts[:password])
      user.destroy
    rescue
    end
    opts = {email: "#{opts[:username]}@youversion.com", agree: true, verified: true, locale: "en_US"}.merge opts
    response = User.register(opts)
    response.should be_true
    user = User.authenticate(opts[:username], opts[:password])
    unless user
      # ugh
      sleep 3
      user = User.authenticate(opts[:username], opts[:password])
    end
    user.should be_a User
    user
  end

  def ensure_users(opts = [])
    opts.each { |u| ensure_user u }
  end
end
