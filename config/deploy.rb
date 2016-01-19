set :application, 'youversion-events'
set :repo_url, 'git@in.thewardro.be:web/youversion-events.git'
set :deploy_to, '/var/www/youversion-events'
set :scm, :git
#set :format, :pretty
#set :log_level, :debug
set :pty, true
set :keep_releases, 5

set :branch, ENV.fetch('BRANCH', 'master')

set :passenger_roles, :web
set :passenger_restart_with_sudo, true

set :npm_flags, ''
set :gulp_tasks, 'javascript css'
set :gulp_file, -> { release_path.join('gulpfile.js') }

before 'deploy:updated', 'gulp'

namespace :deploy do

  Rake::Task["deploy:symlink:release"].clear_actions
    namespace :symlink do
      desc 'OVERRIIIIIIDE'
      task :release do
        on roles(:web), in: :sequence do
          execute "touch /tmp/disable.txt"
          execute "sleep 10"
          execute "ln -s #{release_path} #{deploy_to}/releases/current"
          execute "mv #{deploy_to}/releases/current #{deploy_to}"
          execute "sudo ln -nfs #{deploy_to}/current/config/nginx/nginx.conf-#{fetch(:stage)} /etc/nginx/nginx.conf"
          execute "sudo service nginx restart"
          execute "curl http://events.bible.com -k || true"
          execute "rm /tmp/disable.txt"
        end
      end
    end

end
