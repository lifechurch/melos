## Dev setup


### Prerequisites:

* Install Lerna:
    * `npm install --global lerna`
* Use latest stable node? In my case I use `nvm`, and ran `nvm use 9.4.0`.


### Install + Dev:

First time, and updating to latest:
* Get the code via `git clone git@in.thewardro.be:web/bible.com.git bible.com`
* `cd bible.com/nodejs`
* Do initial install via running `npm`.
* Use Lerna for some more intitial dependencies setup:
  * `lerna bootstrap`
* Must do a prod build before dev, to produce some untracked assets that we'll need:
    * `npm run build:production`


Before dev:

* Set up necessary environment variables. This is much easier if you use something locally like https://direnv.net/ or https://github.com/kennethreitz/autoenv.
  * Set `NPM_TOKEN` environment variable so that npm will be able to download some private repos. NOTE: Even if you've successfully auth'd with NPM, the `/nodejs/.npmrc` file (used by our CI builds) expects that variable to contain the valid token.
  * `export NODE_ENV=staging`
  * `export YOUVERSION_TOKEN_PHRASE='bob the builder builds some cool things'`
  * `export NEW_RELIC_LICENSE_KEY=148b7b0a47e0219bd1117c19b692c94c779cdf33`
  * export `OAUTH_CLIENT_SECRET` and `OAUTH_CLIENT_ID` for staging env (ask repo maintainer for secrets)
  * `export SENTRY_DSN="https://fdfd6b3fe3de43068889a9bda0967748:2ff3bb6b405d4a59a9637232043acf29@sentry.io/305353"`. This is the default Sentry NodeJS Web Dev project value.
* You should now have all the necessities.



**macOS**: You should be able to run `npm run start`. This will run an applescript that opens and runs *All The Things* for you. (It opens ~6 iTerm tabs).

You should now be able to access the site at [http://localhost:8001](http://localhost:8001).

**Note**: I deleted the `/nodejs/.npmrc` file after cloning the repo, so that npm would use my global/user details for registry auth (e.g., `npm login`). If you run into issues installing packages, it might be due to the non-token set in the `/nodejs/.npmrc` file. See `NPM_TOKEN` note in "Prerequisites" section.
