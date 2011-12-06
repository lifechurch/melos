module UsersSpecHelper
  def ensure_user(opts = {})
    unless user = User.authenticate(opts[:username], opts[:password])
      opts = {email: "#{opts[:username]}@youversion.com", password: "tenders", agree: true, verified: true}.merge opts
      new_user = User.new(opts)
      response = new_user.register
      response.should be_true
      user = User.authenticate(opts[:username], opts[:password])
    end
    user.should be_a User
    user
  end

  def ensure_users(opts = [])
    opts.each { |u| ensure_user u }
  end
end
