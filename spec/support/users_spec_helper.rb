module UsersSpecHelper
  def ensure_user(opts = {})
    unless user = User.authenticate(opts[:username], opts[:password])
      opts = {agree: true, verified: true}.merge opts
      user = User.authenticate(opts[:username], opts[:password]) if User.create(opts)
    end
    user.should be_a User
    user
  end

  def ensure_users(opts = [])
    opts.each { |u| ensure_user u }
  end
end
