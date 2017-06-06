window.Session ?= {}

class window.Session.User

  @id: ()->
    return $("html").data("user-id")

  @userName: ()->
    return $("html").data("user-name")

  @avatar: ()->
    return $("html").data("user-avatar")

  @toPath: ()->
    return undefined unless Session.User.isLoggedIn()
    return "/users/" + Session.User.userName()

  @isLoggedIn: ()->
    return $("html").data("logged-in")