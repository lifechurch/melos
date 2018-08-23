module.exports = function redirectAuthenticated(fastify) {
  fastify.addHook('preHandler', (req, reply, next) => {
    /**
     * AUTH cookies
     * a = user.id
     * b = user.username
     * c = user.password
     *
     * t = user.third party token (Facebook, Google, etc.)
     * ti = user.third party token id
     *
     * To be considered valid, we need either a+b+c or t+ti
     * */
    const urlData = req.urlData()

    if (urlData.host === 'localhost') {
      fastify.log.info('Request made to \'localhost\'. Ignoring redirect behavior.')
      next()
      return
    }

    const WWW_SUBDOMAIN = process.env.WWW_SUBDOMAIN || 'www.'
    const MY_SUBDOMAIN = process.env.MY_SUBDOMAIN || 'my.'
    const signedInWithEmail = !!(req.cookies && req.cookies.aa && req.cookies.bb && req.cookies.cc)
    const signedInWithTP = !!(req.cookies && req.cookies.tt && req.cookies.tti)
    const isSignedIn = signedInWithEmail || signedInWithTP
    const isWwwSubdomain = urlData.host.startsWith(WWW_SUBDOMAIN)
    const isMySubdomain = urlData.host.startsWith(MY_SUBDOMAIN)

    function getUrl(hostName, port, path, query) {
      return `//${hostName}${port ? `:${port}` : ''}${path}${query ? `?${query}` : ''}`
    }

    if (isSignedIn && isWwwSubdomain) {
      const hostName = urlData.host.replace(WWW_SUBDOMAIN, MY_SUBDOMAIN)
      fastify.log.info(`User is signed in. Redirecting from '${WWW_SUBDOMAIN}' to '${MY_SUBDOMAIN}'`)
      reply.redirect(getUrl(hostName, urlData.port, urlData.path, urlData.query))
      return
    }

    if (!isSignedIn && isMySubdomain) {
      const hostName = urlData.host.replace(MY_SUBDOMAIN, WWW_SUBDOMAIN)
      fastify.log.info(`User is not signed in. Redirecting from '${MY_SUBDOMAIN}' to '${WWW_SUBDOMAIN}'`)
      reply.redirect(getUrl(hostName, urlData.port, urlData.path, urlData.query))
      return
    }

    next()
  })
}
