class AuthError < StandardError; end
class APIError < StandardError; end
class APITimeoutError < APIError; end