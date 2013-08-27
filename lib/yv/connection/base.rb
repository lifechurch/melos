module YV
  module Connection
    class Base < YV::Resource
      def get(path, params = {})
        HTTParty.get(path, query: self.default_params.merge(params))
      end

      def post(path, params = {})
        HTTParty.post(path, body: self.default_params.merge(params))
      end

      def default_params; end
      def self.create_path
        "users/create_connection"
      end

      def self.delete_path
        "users/delete_connection"
      end

      # these should return URLs for respective actions
      def share_path; end
      def find_friends_path; end
      def user_info_path; end
      def username; end

      # Actual code
      def user_info
        get(user_info_path)
      end
    end
  end
end
