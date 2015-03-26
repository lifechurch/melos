# config valid only for current version of Capistrano
lock '3.4.0'

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


namespace :deploy do

  before :starting, :highstate do
    on roles(:app) do
      #execute "cd /srv ; git pull"
      #execute "sudo salt-call state.highstate --local"
    end
  end

end