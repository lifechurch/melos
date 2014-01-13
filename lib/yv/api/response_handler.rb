module YV
  module API
    class ResponseHandler

      def initialize( response )
        @api_response = response
      end


      # Processes a valid response from the API
      # Handle error condition or build an api object as a response
      # returns an array [results,errors] - either can be nil.

      # If errors are returned, they are an array of YV::API::Error instances.
      def process
        results = errors = nil

        code = response.api_code
        data = response.data

        if code.nil? || code.to_i >= 400
           errors = process_errors(response.errors)
           # Processes errors returned by the API.
           raise UnverifiedAccountError if errors.detect { |e| e.key =~ /users.hash.not_verified/ }
        end

        code = code.to_i

        #TODO Custom results here - refactor this out when fully understood how/where this is being used
        results = true if (code == 201) && (data == "Created")
        results = true if (code == 200) && (data == "OK")
        results = build_data_object(data)

        return [results,errors]
      end

      private # ------------------------------------------------------------------------------------------------

      def response
        @api_response
      end

      def process_errors( response_errors )
        response_errors.map {|err| YV::API::Error.new(err)}
      end

      # Build a Mash object with data returned from the API
      def build_data_object( response_data )

        case response_data
          when Array
            if response_data.first.respond_to?(:each_pair)
               response_data.map {|data| Hashie::Mash.new(data)}
            else
               response_data
            end
          
          when Hash
            Hashie::Mash.new(response_data)
          
          when Fixnum # only for users/user_id
            Hashie::Mash.new({user_id: response_data }) 
        end
      end
    end
  end
end