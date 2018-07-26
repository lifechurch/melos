module YV
  module Concerns
    module UserAuth

      def self.included(base)
        base.helper_method :logged_in?, :logged_out?, :force_login, :current_auth, :sign_in, :sign_out, :current_user, :cookie_domain
      end

      private

      def cookie_domain
        domain = '.bible.com'
        begin
          domain = (request.host == 'localhost') ? 'localhost' : request.host.split('.').last(2).unshift('').join('.')
        rescue
          domain = '.bible.com'
        end
        return domain
      end

      def logged_in?
        current_auth.present?
      end

      def logged_out?
        current_auth.nil?
      end

      def force_login(opts = {})
        if current_auth.nil?
          opts[:redirect] = request.fullpath
          return redirect_to sign_in_path(opts)
        end
        if current_user.invalid?
          sign_out
          return redirect_to (params[:redirect] || bible_path)
        end
      end

      def force_redirect_no_auth
        if request.host == 'localhost' or request.host == '127.0.0.1'
          return
        end

        www_subdomain = ENV['WWW_SUBDOMAIN'].nil? ? 'www.' : ENV['WWW_SUBDOMAIN']
        my_subdomain = ENV['MY_SUBDOMAIN'].nil? ? 'my.' : ENV['MY_SUBDOMAIN']

        logged_in = !current_auth.nil? && !current_auth.invalid?
        is_my_subdomain = "#{request.subdomain}." == my_subdomain
        is_www_subdomain = "#{request.subdomain}." == www_subdomain

        if logged_in && is_www_subdomain
          redirect_to "//#{request.host_with_port.sub!(www_subdomain, my_subdomain)}#{request.fullpath}"
        end

        if !logged_in && is_my_subdomain
          redirect_to "//#{request.host_with_port.sub!(my_subdomain, www_subdomain)}#{request.fullpath}"
        end
      end

      def force_notification_token_or_login
        force_login unless logged_in? or params[:token].present?

        if params[:token]
          if logged_in? && current_user.notifications_token != params[:token]
            redirect_to sign_out_path(redirect: edit_notifications_url) and return
          end
        end
      end

      def current_user
        return nil unless current_auth
        @current_user ||= User.find(current_auth.user_id, auth: current_auth)
      end

      def current_auth
        return @current_auth if @current_auth
        if cookies.signed[:a] && cookies.signed[:b] && (cookies.signed[:c] || (cookies.signed[:t] && cookies.signed[:ti]))
          @current_auth ||= Hashie::Mash.new( { 'user_id' => cookies.signed[:a], 'username' => cookies.signed[:b], 'password' => cookies.signed[:c] ? cookies.signed[:c] : nil, 'tp_token' => cookies.signed[:t] ? cookies.signed[:t] : nil, 'tp_id' => cookies.signed[:ti] ? cookies.signed[:ti] : nil } )
        end
      end

      def set_auth(user, password, tp_token, tp_id)
        cookies.permanent.signed[:a] = { value: user.id, domain: cookie_domain }
        cookies.permanent.signed[:b] = { value: user.username, domain: cookie_domain }

        if password.present?
          cookies.permanent.signed[:c] = { value: password, domain: cookie_domain }
        end

        if tp_token.present?
          cookies.permanent.signed[:t] = { value: tp_token, domain: cookie_domain }
        else
          # set auth type to email
          # google and facebook are set in tp_sign_in
          cookies[:auth_type] = { value: 'email', domain: cookie_domain }
        end

        if tp_id.present?
          cookies.permanent.signed[:ti] = { value: tp_id, domain: cookie_domain }
        end

        cookies.delete 'YouVersionToken'
        cookies.delete 'YouVersionToken', domain: cookie_domain
        cookies.delete 'OAUTH'
				cookies.delete 'OAUTH', domain: cookie_domain
        @current_auth = Hashie::Mash.new( { 'user_id' => user.id, 'username' => user.username, 'password' => password, 'tp_token' => tp_token, 'tp_id' => tp_id } )
      end

      def sign_in(user, password = nil, tp_token = nil, tp_id = nil)
        set_auth(user, password || params[:password], tp_token, tp_id)
      end

      def sign_out
        cookies.delete :a
        cookies.delete :b
        cookies.delete :c
        cookies.delete :f
        cookies.delete :t
        cookies.delete :ti
        cookies.delete 'YouVersionToken'
        cookies.delete 'OAUTH'
        cookies.delete :a, domain: cookie_domain
        cookies.delete :b, domain: cookie_domain
        cookies.delete :c, domain: cookie_domain
        cookies.delete :f, domain: cookie_domain
        cookies.delete :t, domain: cookie_domain
        cookies.delete :ti, domain: cookie_domain
        cookies.delete 'YouVersionToken', domain: cookie_domain
        cookies.delete 'OAUTH', domain: cookie_domain
        puts cookies[:a]
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
