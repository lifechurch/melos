module Licenses
  class Request

    # Returns a SHA1 HMAC signed string
    # params: hash of key/value pairs to sign.
    # secret: secret key for HMAC signing.
    def self.sign( params, secret)
      strings = []
      params.sort.map do |key,value|
        strings << "#{CGI.escape(key.to_s)}=#{CGI.escape(value)}"
      end
      escaped_string = strings.join("&")
      Base64.encode64( OpenSSL::HMAC.digest('sha1', secret, escaped_string)).chomp
    end

  end
end