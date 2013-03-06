# Previously had 2 unicorn workers - with an average of 170mb memory usage per dyno
# Also were seeing times of up to 2 seconds for request queuing
# Heroku allows 512mb per dyno\
worker_processes 2

# Restart any workers that haven't responded in 17 seconds
# This results in a 502 response for the slow request in the worker
# that was killed, and forks a new worker, who will pull the next
# request from the master/port backlog
#
# We want something shorter than the heroku 30 sec so that we know
# when a worker has been restarted, but longer than the rack-timeout
# of 15 seconds, since unicorn timeout as last-resort is preferred
timeout ENV['CFG_UNICORN_TIMEOUT'] || 17

# Load rails + app code into the master before forking workers
# for super-fast worker spawn times
preload_app true

# Listen on the TCP port Heroku has dynamically
# set as $PORT, and will send traffic to as soon as Unicorn
# has bound to it and doesn't refuse the request.
#
# a shorter backlog makes failover more responsive
# a longer backlog allows for deeper queues and higher througput.
#
# We set to 5, if the router has more than 5 (2*W + 1) requests for our
# 2 workers, we want the backlog to show up with heroku and have the
# chance to go to another instance. In case our worker is dead or slow
# we don't want requests sitting in the unicorn backlog timing out.
listen ENV['PORT'] || 3000, :backlog => 4