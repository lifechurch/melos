role :web, %w{yvdep@webreview02-ny.youversion.com}
set :bundle_flags, "--deployment"
set :bundle_without, nil
set :passenger_roles, :dummy

Rake::Task["deploy:curl"].clear_actions
