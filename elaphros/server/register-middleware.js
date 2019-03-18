/* eslint-disable global-require,import/no-dynamic-require */
const Raven = require('raven')

module.exports = function registerMiddleware(fastify, middlewares) {
  function moduleRegisterErrorHanlder(err) {
    Raven.captureException(err)
    if (err) {
      console.log(err)
      fastify.log.error(`Error loading middleware: ${err.toString()}`)
      throw err
    }
  }

  middlewares.forEach((module) => {
    let fnArgs

    if (Array.isArray(module)) {
      const [ moduleName, moduleOpts ] = module
      fnArgs = [ require(moduleName), moduleOpts ]
    } else {
      fnArgs = [ require(module) ]
    }

    // fnArgs.push(moduleRegisterErrorHanlder)

    fastify.register.apply(this, fnArgs)
  })
}
