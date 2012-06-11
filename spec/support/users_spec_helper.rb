module UsersSpecHelper
  def ensure_user(opts = {})
    begin
      user = User.authenticate(opts[:username], opts[:password])
      user.destroy
    rescue
    end
    opts = {email: "#{opts[:username]}@youversion.com", password: "tenders", agree: true, verified: true}.merge opts
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
