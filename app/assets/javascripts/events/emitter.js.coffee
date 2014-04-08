# Uses: https://github.com/Wolfy87/EventEmitter

window.Events ?= {}

class window.Events.Emitter

  @_emitter = undefined

  @emitterUndefined: ()->
    @_emitter == undefined

  @addListener: (name,funcs)->
    @createEmitter() if @emitterUndefined()
    @_emitter.addListener(name,funcs)
    return

  @removeListener: (name,funcs)->
    @createEmitter() if @emitterUndefined()
    @_emitter.removeListener(name,funcs)


  @emit: ()->
    return if @emitterUndefined()
    name  = arguments[0]
    funcs = arguments[1]
    if arguments.length == 1 then @_emitter.emitEvent(name) else @_emitter.emitEvent(name,funcs)
    return

  @createEmitter: ()->
    @_emitter = new EventEmitter()
    return