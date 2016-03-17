role :web, %w{yvdep@review01.web.nyc03.thewardro.be}
set :bundle_flags, "--deployment"
set :bundle_without, nil
set :passenger_roles, :dummy

Rake::Task["deploy:curl"].clear_actions

set :hipchat_token, '7b1159a956abe4c9923b54fa3b5ef6'
set :hipchat_room_name, 'YouVersion Web'
set :hipchat_color, 'yellow'
set :hipchat_success_color, 'green'
set :hipchat_failed_color, 'red'
set :hipchat_announce, true
