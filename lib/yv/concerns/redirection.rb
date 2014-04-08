module YV
  module Concerns
    module Redirection
    
      def self.included(base)
        base.helper_method :redirect_path, :clear_redirect,:follow_redirect
      end

    private

      # set redirect for (to) argument
      # otherwise set redirect location to a redirect param if available
      def set_redirect(to = nil)
        clear_redirect if cookies[:auth_redirect] == "" #EVENTUALLY: understand why this cookie is "" instaed of nil/dead, to avoid this workaround
        cookies[:auth_redirect] = to unless to.nil?
        cookies[:auth_redirect] ||= params[:redirect] if params[:redirect]
      end

      def redirect_path
        cookies[:auth_redirect]
      end

      def clear_redirect
        cookies[:auth_redirect] = nil
      end

      def next_redirect?( to )
        redirect_path == to
      end


      def follow_redirect(opts = {})
        cookie_path = cookies[:auth_redirect].to_s == '' ? nil : cookies[:auth_redirect] #EVENTUALLY: understand why this cookie is "" instaed of nil/dead, to avoid this workaround
        clear_redirect
        path = cookie_path || opts[:alt_path] || bible_path
        return redirect_to path, notice: opts[:notice] if opts[:notice]
        return redirect_to path, error: opts[:error] if opts[:error]
        return redirect_to path
      end

      def external_request?
        return true  if request.referer.blank?
        return false if request.host == request.referer.split('/')[2].split(':')[0]
        return true
      end


    end
  end
end