# YouVersion Web #

Welcome to the YouVersion Web source repository! Here are instructions to get your Ruby/Rails development environment set up to contribute to the application, as well as some best practices, etc.

## Getting Started ##

Before developing for the YouVersion Web project, you'll need to do a few things to set up your environment.

### Installing RVM ###

You'll need to install the [Ruby Version Manager (RVM)](http://beginrescueend.com/rvm/install/), a tool for managing Ruby installations and gemsets. You can follow the instructions there, but here's the short command to run:

	bash -s stable < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)

Once you've done that, you need to add a few lines to a `~/.rvmrc` file. Just do this:

	echo -e "rvm_install_on_use_flag=1\nrvm_project_rvmrc=1\n" >> ~/.rvmrc

Now, `cd` into your `youversion-web` directory, and you should notice a green printout:

	Using /Users/eprothro/.rvm/gems/ruby-1.9.2-p180 with gemset youversion-web
	
This is the output of a shell script that runs to make sure you have the right Ruby and gems installed. This is a superset of what Bundler does, so you'll still want to use that as part of your normal workflow too.

If you see red errors switching into the directory, the most likely cause is not having a C compiler. Install [Command Line Tools for Xcode](https://developer.apple.com/downloads/index.action), or [install them from within Xcode](https://developer.apple.com/library/ios/#documentation/DeveloperTools/Conceptual/WhatsNewXcode/Articles/xcode_4_3.html#Command-Line Tools Are Optional) if you already have XCcode installed. Finally, `cd` out and back into the `youversion-web` directory to ensure you see the green printout above.

### Installing gems, etc ###

Now that you're in that directory (and in your `yv-web` gemset), you'll have to install the `rails` gem before you can use Bundler. Check the `Gemfile` to get the version of Rails we're locked to; currently, it's **3.1.2**. Run `gem install rails -v 3.1.2` to install the Rails gem; then, run `bundle install` to get everything else.

### Running the app ###

Now you should be able to start up the app by running `rails s` from your `youversion-web` directory and get the following output:

	=> Booting WEBrick
	=> Rails 3.1.2 application starting in development on http://0.0.0.0:3000
	=> Call with -d to detach
	=> Ctrl-C to shutdown server
	.../youversion-web/config/environments/development.rb:31: warning: already initialized constant VERIFY_PEER
	[timestamp] INFO  WEBrick 1.3.1
	[timestamp] INFO  ruby 1.9.2 (2011-02-18) [x86_64-darwin11.2.0]
	[timestamp] INFO  WEBrick::HTTPServer#start: pid=5310 port=3000

This means the app is accepting requests on localhost, port 3000. Navigate to [localhost:3000](http://localhost:3000) in a web browser and you should see the site load.

Changes made in development don't usually require restarting the server, so feel free to start poking around -- your changes should be applied the next time you reload the page.

### Optional: Use `memcached` ###

The API wrapper makes use of `memcached` to speed up certain repetitive API calls. This isn't necessary, but if you want to fully replicate production when you're developing locally, you'll want to install `memcached` on your system.

Install the `homebrew` package manager on your system (if you don't already have it):

	/usr/bin/ruby -e "$(/usr/bin/curl -fsSL https://raw.github.com/mxcl/homebrew/master/Library/Contributions/install_homebrew.rb)"

Then run `brew install memcached`. Otherwise, you'll have to build it from source; have fun with that. :)

Once it's installed, you can run `memcached` with default settings by just running `memcached`. If you want to run it in the background as a daemon (and not keep a terminal window busy), add a `-d`. If you want to run it with 128M of memory, for example, run it with `-m 128`.