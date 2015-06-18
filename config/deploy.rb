set :application, 'youversion-web'
set :repo_url, 'git@github.com:lifechurch/youversion-web.git'
set :deploy_to, '/var/www/youversion-web'
set :scm, :git
#set :format, :pretty
#set :log_level, :debug
set :pty, true
set :keep_releases, 5
set :rvm_type, :user
set :rvm_ruby_version, 'ruby-1.9.3-p551@youversion-web'

set :branch, ENV.fetch('BRANCH', 'master')

set :passenger_roles, :web
set :passenger_restart_with_sudo, true

set :datadog_api_key, "f0bc018e3f69961214ea44382eb0ad52"

set :default_env, {
  'SECURE_TRAFFIC' => true
}

namespace :deploy do
  before :starting, :highstate do
    on roles(:web) do
      #execute "sudo salt-call state.highstate"
    end
  end

  Rake::Task["deploy:symlink:release"].clear_actions
    namespace :symlink do
      desc 'OVERRIIIIIIDE'
      task :release do
        on roles(:web), in: :sequence do
          execute "ln -s #{release_path} #{deploy_to}/releases/current"
          execute "sudo ln -nfs #{release_path}/nginx.conf-#{fetch(:stage)} /etc/nginx/nginx.conf"
          execute "sudo service nginx reload"
        end
      end
    end


end
