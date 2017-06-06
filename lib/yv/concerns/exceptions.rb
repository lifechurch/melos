module YV
  module Concerns
    module Exceptions
    
      def self.included(base)
        unless Rails.application.config.consider_all_requests_local
          base.rescue_from StandardError,   with: :generic_error
          base.rescue_from APIError,        with: :api_error
          base.rescue_from AuthError,       with: :auth_error
          base.rescue_from Timeout::Error,  with: :timeout_error
          base.rescue_from APITimeoutError, with: :api_timeout_error
          base.rescue_from YouVersion::API::RecordNotFound, with: :api_record_not_found
        end
      end


      # Manually throw a 404
      def not_found
        raise ActionController::RoutingError.new('Not Found')
      end

      def render_404
        render "pages/error_404", layout: 'application', status: 404 and return
      end



      protected #----------------------------------------------------------------------


      def track_exception(exception)
        Raven::Rack.capture_exception(exception, request.env)
      end


      private   #----------------------------------------------------------------------

      def generic_error(ex)
        @error = ex
        track_exception(ex) unless ex.is_a?(NotAVersionError)
        render "pages/generic_error", layout: 'application', status: 500
      end

      def api_error(ex)
        @error = ex
        track_exception(ex)
        render "pages/generic_error", layout: 'application', status: 502
      end

      def auth_error(ex)
        sign_out
        track_exception(ex)
        redirect_to(sign_in_path, flash: {error: t('auth error')})
      end

      def timeout_error(ex)
        @error = ex
        render "pages/api_timeout", layout: 'application', status: 408
      end

      def api_timeout_error(ex)
        @error = ex
        render "pages/api_timeout", layout: 'application', status: 408
      end


      def api_record_not_found(ex)
        render_404
      end


    end
  end
end