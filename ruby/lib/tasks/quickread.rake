require 'io/console'

namespace :subscription do

  desc 'Used to complete multiple days of a reading plan subscription. Useful for testing.'
  task :read => :environment do
    puts 'Enter username:'
    username = STDIN.gets.chomp
    puts 'Enter password (hidden for security):'    
    password = STDIN.noecho(&:gets).chomp

    puts 'Authenticating...'
    user = User.authenticate(username, password)
    if user.username
      puts "Authenticated #{user.username}"
    else 
      return
    end

    puts 'Enter Plan ID (numeric):'
    id = STDIN.gets.chomp
  
    
    plan = Subscription.find(id, auth: user.auth)

    if plan.present? && plan.id
      puts "Subscription Found. ID: #{plan.id}"
    else
      plan_id = Plan.find(id).id
      Subscription.subscribe(plan_id, auth: user.auth, private: false, language_tag: 'en')
      plan = Subscription.find(id, auth: user.auth)
    end

    puts 'Enter start day (1 for first day):'
    start_day = STDIN.gets.chomp.to_i

    puts 'Enter number of days to read:'
    days = STDIN.gets.chomp.to_i

    # Each day along the way,
    start_day.upto(start_day + days) do |d|
      # Each reference for the day,
      puts "---------"
      puts "Day #{d}"
      plan.day(d).api_references.each do |ref|
        # Read away.
        puts "Reference #{ref}"
        unless plan.set_ref_completion(d, ref["reference"], true)
          puts "Error on day #{d}" unless plan.completed?
        else
          puts "Day #{d} complete"
        end
      end
      puts "Completed plan" && break if plan.completed?
    end
      puts
      puts 'Success. You are a speed reader.'
  end
end