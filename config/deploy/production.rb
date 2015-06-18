role :web, %w{yvdep@web01-dfw.youversion.com yvdep@web02-dfw.youversion.com}

set :hipchat_token, '7b1159a956abe4c9923b54fa3b5ef6'
set :hipchat_room_name, 'YouVersion Web'
set :hipchat_color, 'yellow'
set :hipchat_success_color, 'green'
set :hipchat_failed_color, 'red'
set :hipchat_announce, true

# Clear existing task so we can replace it rather than "add" to it.
#Rake::Task["deploy:compile_assets"].clear


#namespace :deploy do
#  desc 'Compile assets'
#  task :compile_assets => [:set_rails_env] do
#    invoke 'deploy:assets:precompile_local'
#    invoke 'deploy:assets:backup_manifest'
#  end

#  namespace :assets do
#    task :precompile_local do
#      # compile assets locally
#      run_locally do
#        execute "source compilevars && RAILS_ENV=#{fetch(:stage)} ~/.rvm/bin/rvm ruby-1.9.3-p551@youversion-web do bundle exec rake assets:precompile"
#      end
#     end
#  end
#end
