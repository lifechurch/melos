class AuthError < StandardError; end
class UnverifiedAccountError < AuthError; end
class APIError < StandardError; end
class APITimeoutError < APIError; end
class InvalidReferenceError < StandardError; end
class NotAVersionError < InvalidReferenceError; end
class NotAChapterError < InvalidReferenceError; end
class BadSecondaryVersionError < NotAChapterError; end
class NoSecondaryVersionError < NotAChapterError; end
class NotABookError < InvalidReferenceError; end

