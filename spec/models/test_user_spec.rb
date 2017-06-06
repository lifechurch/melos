require 'spec_helper'

describe User do

  it 'lets create some users, shall we?', :slow do

    1.upto(25) do |n|
      puts n
      user = ensure_user({username: "mattstaging#{n}", password: "staging", email: "matthewrossanderson+yv#{n}@gmail.com"})
      friendship = Friendships.offer({user_id: 7830, auth: {user_id: user.id, username: user.username, password: 'staging'}})
      Friendships.accept({user_id: user.id, auth: {user_id: 7830, username: 'matt', password: 'staging'}})
    end
  end
end