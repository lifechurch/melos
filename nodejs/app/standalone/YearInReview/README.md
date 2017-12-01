# Year In Review Feature

## Requesting Images from the Image Server

### Generating a URL


#### Format and example:

##### Default Snapshot

This will return a generic image that is not customized for any user.

`http://{host}/snapshot/default/{size}?locale={locale}`  
`http://localhost:3000/snapshot/default/500?locale=en-GB`  

* `host` - proper host name for the requested environment
* `size` - the size of image you want.  The image is square so a `size` of 500 is a 500x500px PNG image.
* `locale` - (Optional) the locale for translations in the image.  Default locale is `en`

##### Snapshot for a User

This will return a customized image for the requested user.

`http://{host}/snapshot/{user-id-sha1-hex-hash}/{user-id}/{size}?locale={locale}`  
`http://localhost:3000/snapshot/b3990f0dc47c81c7c1d5d6edd0b774d21f355991/9417/500?locale=en-GB`  

* `host` - proper host name for the requested environment
* `user-id-sha1-hex-hash` - a hash of the `user-id` using SHA-1 in hexadecimal (see below)
* `user-id` - the user id being requested to generate the image for
* `size` - the size of image you want.  The image is square so a `size` of 500 is a 500x500px PNG image.
* `locale` - (Optional) the locale for translations in the image.  Default locale is `en`


#### SHA-1 Hash of User Id

We are using SHA-1 to secure and obscure the URL from tampering 
returning the hash in hexadecimal for use in the image URL.

Some code examples with expected results below:

```
// Ruby
user_id = "9417"
secret = "SECRET"
algo = "sha1"
hash = OpenSSL::HMAC.hexdigest(algo, secret, user_id) // b3990f0dc47c81c7c1d5d6edd0b774d21f355991

hash == "b3990f0dc47c81c7c1d5d6edd0b774d21f355991" // true


// Node/JS
const crypto = require('crypto');
const secret = 'SECRET';
const algo = 'sha1';
const userId = '9417';
const hmac = crypto.createHmac(algo, secret);

hmac.update(userId);
const hash = hmac.digest('hex') // b3990f0dc47c81c7c1d5d6edd0b774d21f355991

hash === 'b3990f0dc47c81c7c1d5d6edd0b774d21f355991' // true


// Tests

User Id: 9417
Resulting Hash: b3990f0dc47c81c7c1d5d6edd0b774d21f355991


User Id: 9421
Resulting Hash: 50e49b4b9b299e2b2c9bbff8cbf001803b5e8e30

```