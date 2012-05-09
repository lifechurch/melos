namespace :heroku do
  task :auto_restart do

    @@heroku = Heroku::Client.new(ENV['HEROKU_USER'], ENV['HEROKU_PASS'])

    dynos_restarted = 0
    @@heroku.ps(ENV['HEROKU_APP']).each do |process|
      if dynos_restarted <= 5 && process['elapsed'] > 6 * 60 * 60
        puts "Restarting #{process['process']} (running for #{process['elapsed']} seconds)"
        @@heroku.ps_restart(ENV['HEROKU_APP'], process['process'])
        dynos_restarted += 1
      end
    end
  end
end
