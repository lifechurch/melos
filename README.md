## Dev setup

### Prerequisites:

* Install Lerna:
    * `npm install --global lerna`
* Set `NPM_TOKEN` environment variable so that npm/yarn will be able to download some private repos. NOTE: Even if you've successfully auth'd with NPM, the `/nodejs/.npmrc` file (used by our CI builds) expects that variable to contain the valid token.
* Use latest stable node? In my case I use `nvm`, and ran `nvm use 9.4.0`.


### Install + Dev:

* `git clone git@in.thewardro.be:web/bible.com.git bible.com`
* `cd bible.com/nodejs`
* Do initial install via running `yarn`.
* Use Lerna for some more intitial setup:
    * `lerna bootstrap`
* Must do a prod build first, to produce some untracked assets that we'll need:
    * `yarn run build:production`
* You should now have all the necessities.

**macOS**: You should be able to run `yarn run start`. This will run an applescript that opens and runs *All The Things* for you. (It opens ~6 iTerm tabs).

You should now be able to access the site at [http://localhost:8001](http://localhost:8001).

**Note**: I deleted the `/nodejs/.npmrc` file after cloning the repo, so that npm would use my global/user details for registry auth (e.g., `npm login`). If you run into issues installing packages, it might be due to the non-token set in the `/nodejs/.npmrc` file. See `NPM_TOKEN` note in "Prerequisites" section.
