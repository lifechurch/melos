- Create a Plugin
  - Create Route Handling Functions
  - Wire fastify to your routes
  - If replacing exsting pages, make sure canoncial URLs match the old canonicals

- Create UI in Marko
  - Must be valid AMP (Add #development=1 to your URL to have browser auto-validate it)
  - Every page needs a valid canonical URL
  - Anchor tags (<a>) should include target="_self" attribute to work in standalone / Google results frames

- Handle 404s
  - Fail as fast/early as possible
  - Call reply.captureException if an error is thrown
  - Call validateApiResponse on api response and reply.captureException(new Error('something bad')) if validation fails
  - After capturing exception, be sure to reply with a 404 of some type (return reply.send(new httpErrors.NotFound()))

- Strings
  - If this is a new feature in AMP (never been AMP'd before), create a new folder in /ruby/config/locales matching the name of the new feature (using underscore as word delimiter)
  - Create en.yml file inside this folder
  - Create a corresponding en.json file in /elaphros/locales/[new feature] (leave it blank)
  - Copy strings that will be used in this feature from /ruby/config/locales/en.yml into /ruby/config/[new feature]/en.yml (copy, don't alter original file)
  - When all strings are in the new file, modify /elaphros/scripts/get-locale-strings.js to include your new file in the folders array
  - From the elaphros folder, run `npm run getLocaleStrings`
  - Modify /crowdin.yml to add your new source file (the file in /ruby/config/locales) to Crowdin plugin
  - The updated crowdin.yml and the source file in /ruby/config/locales will need to be pushed to master and the crowdin plugin may need to be restarted before strings will show up in Crowdin. Then, they will need to be approved, but should already be in Translation Memory in Crowdin