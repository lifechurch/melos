# 2 workers and 1 master
#
# Note: we only use 2, because (presumably) there are a lot of external
#       network calls that are blocking. N > 2 saw performance decay
#       more than the benefit of the added parallelism.
worker_processes 2

# Restart any workers that haven't responded in 25 seconds,
# resulting in a 502 response for the slow request that was killed
# we want something shorter than the heroku 30 sec so that we know
# when a worker has been restarted
timeout 25

# Load rails + app code into the master before forking workers
# for super-fast worker spawn times
preload_app true

# Listen on the TCP port Heroku has dynamically
# set as $PORT, and will send traffic to as soon as Unicorn
# has bound to it and doesn't refuse the request.
#
# a shorter backlog makes failover more responsive
# a longer backlog allows for deeper queues and higher througput
# we set to 10, if the master has more than 10 requests for our
# 2 workers, we want the backlog to show up with heroku and have the
# chance to go to another instance, since our worker is likely dead
listen ENV['PORT'] || 3000, :backlog => 10
