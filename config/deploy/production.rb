require 'capistrano/datadog'
set :datadog_api_key, "f0bc018e3f69961214ea44382eb0ad52"

role :web, %w{yvdep@node01.web.dal01.thewardro.be yvdep@node02.web.dal01.thewardro.be}

set :hipchat_token, '7b1159a956abe4c9923b54fa3b5ef6'
set :hipchat_room_name, 'YouVersion Web'
set :hipchat_color, 'yellow'
set :hipchat_success_color, 'green'
set :hipchat_failed_color, 'red'
set :hipchat_announce, true
