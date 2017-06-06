module YV
  module Connection
    class Base < YV::Resource

      def delete
        data, errs = YV::Resource.post(self.delete_path, {auth: auth})
        return YV::API::Results.new(data,errs)
      end

      def default_params; end

      # these should return URLs for respective actions
      def share_path; end
      def find_friends_path; end
      def user_info_path; end
      def username; end

      # Actual code
      def user_info
        get(user_info_path)
      end

      private

      def fetch_friends(friend_ids_array, opts)
        return  [] if friend_ids_array.blank?

        users = []
        slices = friend_ids_array.each_slice(25).to_a
        
        slices.each do |sl|
          opts[:connection_user_ids] = sl
          data, errs = YV::Resource.post("users/find_connection_friends", opts)
          if errs.blank?
            data.each { |u| users << User.new(u) }
          end
        end
        return users
      end


    end
  end
end
