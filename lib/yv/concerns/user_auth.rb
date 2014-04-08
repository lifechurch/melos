module YV
  module Concerns
    module UserAuth

      def self.included(base)
        base.helper_method :logged_in?, :logged_out?, :force_login, :current_auth, :sign_in, :sign_out, :current_user
      end

      private

      def logged_in?
        current_auth.present?
      end

      def logged_out?
        current_auth.nil?
      end

      def force_login(opts = {})
        if current_auth.nil?
          opts[:redirect] = request.path
          return redirect_to sign_in_path(opts)
        end
        if current_user.invalid?
          sign_out
          return redirect_to (params[:redirect] || bible_path)
        end
      end

      def current_user
        return nil unless current_auth
        @current_user ||= User.find(current_auth.user_id, auth: current_auth)
      end

      def current_auth
        return @current_auth if @current_auth
        if cookies.signed[:a] && cookies.signed[:b] && cookies.signed[:c]
          @current_auth ||= Hashie::Mash.new( {'user_id' => cookies.signed[:a], 'username' => cookies.signed[:b], 'password' => cookies.signed[:c]} )
        end
      end

      def set_auth(user, password)
        cookies.permanent.signed[:a] = user.id
        cookies.permanent.signed[:b] = user.username
        cookies.permanent.signed[:c] = password
        @current_auth = Hashie::Mash.new( {'user_id' => user.id, 'username' => user.username, 'password' => password} )
      end

      def sign_in(user, password = nil)
        set_auth(user, password || params[:password])
      end

      def sign_out
        cookies.delete :a
        cookies.delete :b
        cookies.delete :c
        cookies.delete :f
        clear_redirect
      end

      def authorize
        id_param = params[:user_id] || params[:id]
        unless id_param == current_user.username
          redirect_to(edit_user_path(current_user))
        end
      end


    end
  end
end