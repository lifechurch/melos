module YV
  module API
    class Response
      extend Forwardable
      
      attr_reader :body

      def_delegator :@body, :code # httparty response code

      def initialize(response)
        @http_response_or_json = response
        @body = @http_response_or_json["response"]
      end

      # Return the native code response from httparty response object if available
      # otherwise, defer to the code returned from the API json response
      def code
        return @http_response_or_json.code unless @http_response_or_json.code.nil?
        return api_code
      end

      # Response code as provided specifically via the API response
      def api_code
        body["code"] unless body.nil?
      end

      # Data object as returned via API response
      def data
        body["data"] unless body.nil?
      end

      # Errors as returned via API response
      # {"response":{"code":404,"data":{"errors":[{"key":"badges.badges.not_found","error":"Badges not found"}]},"buildtime":"2013-09-04T14:05:20+00:00"}}
      def errors
        return nil if data.nil?
        data["errors"]
      end

      # Specific to Reading Plans / Subscriptions update API calls
      def completed?
        body["complete"] == true
      end

    end
  end
end