# YouVersion Web #

Welcome to the YouVersion Web source repository! Here are instructions to get your Ruby/Rails development environment set up to contribute to the application, as well as some best practices, etc.

## Getting Started ##

Before developing for the YouVersion Web project, you'll need to do a few things to set up your environment.

### Installing RVM ###

You'll need to install the [Ruby Version Manager (RVM)](http://beginrescueend.com/rvm/install/), a tool for managing Ruby installations and gemsets. You can follow the instructions there, but here's the short version:

	bash -s stable < <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)

Once you've done that, you need to add a few lines to a `~/.rvmrc` file. Just do this:

	echo -e "rvm_install_on_use_flag=1\nrvm_project_rvmrc=1\n" >> ~/.rvmrc

Now, change into your `youversion-web` directory, and you should notice a shell script that runs to make sure you have the right Ruby and gems installed. This is a superset of what Bundler does, so you'll still want to run that as part of your normal workflow too.

### Installing gems, etc ###

Now that you're in that directory (and in your `yv-web` gemset), you'll have to install the `rails` gem before you can use Bundler. Check the `Gemfile` to get the version of Rails we're locked to; currently, it's **3.1.0**. Run `gem install rails -v 3.1.0` to install the Rails gem; then, run `bundle install` to get everything else.

### Bonus Points: Installing `memcached` ###

The API wrapper makes use of `memcached` to speed up certain repetitive API calls. This isn't necessary, but if you want to fully replicate production when you're developing locally, you'll want to install `memcached` on your system.

If you have a package manager like `homebrew` installed on your system, just run `brew install memcached`. Otherwise, you'll have to build it from source; good luck with that. :)

Once it's installed, you can run it with default settings by just running `memcached`. If you want to run it as a daemon and not keep a terminal window busy, add a `-d`. If you want to run it with 128M of memory, or whatever, run it with `-m 128`.

### Using Guard ###

You can use `guard` to automatically run Cucumber and Rspec tests whenever relevant files change if you want. Just open a terminal window and run `guard`. If you're on a Mac, you can also install a gem called `growl_notify` to get Growl notifications.

For more cool stuff with Guard, check out [Guard on Github](https://github.com/guard/guard).

### VCR ### (not really using this as of 1/1/2012)

To minimize test time, all external API requests are performed once to obtain a response, then cached for future tests. The responses are saved in `fixtures/vcr`. To reset your API cache, simply delete all the files in this folder.