role :web, %w{yvdep@web01-dfw.youversion.com yvdep@web02-dfw.youversion.com}

# Clear existing task so we can replace it rather than "add" to it.
Rake::Task["deploy:compile_assets"].clear 
 
namespace :deploy do
  
  desc 'Compile assets'
  task :compile_assets => [:set_rails_env] do
    # invoke 'deploy:assets:precompile'
    invoke 'deploy:assets:precompile_local'
    invoke 'deploy:assets:backup_manifest'
  end
   
  namespace :assets do
    
    task :precompile_local do 
      # compile assets locally
      run_locally do
        execute "source compilevars && RAILS_ENV=#{fetch(:stage)} ~/.rvm/bin/rvm ruby-1.9.3-p551@youversion-web do bundle exec rake assets:precompile"
      end
     end
    
  end
 
end
