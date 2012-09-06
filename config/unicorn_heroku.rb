# 2 workers and 1 master
#
# Note: we only use 2, because (presumably) there are a lot of external
#       network calls that are blocking. N > 2 saw performance decay
#       more than the benefit of the added parallelism.
worker_processes 2

# Restart any workers that haven't responded in 30 seconds,
# resulting in a 502 response for the slow request that was killed
timeout 30

# Load rails + app code into the master before forking workers
# for super-fast worker spawn times
preload_app true

# Listen on a Unix data socket instead of a TCP port
# Note: only works if ngnix is on the same machine
# (e.g. has reliable access to the sockeet file)
listen '/tmp/unicorn.sock'#, :backlog => 2048
