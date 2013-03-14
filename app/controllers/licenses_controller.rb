class LicensesController < ApplicationController

  before_filter :validate_authorize_request, only: [:authorize]

  # GET
  # Authorize get request as defined in our license initiation documentation
  # http://developers.youversion.com/api/docs/3.0/sections/licenses/initiation.html
  def authorize

  end

  # GET
  # endpoint for user login / signup
  def authenticate

  end

private

  def required_params
    [:vendor_id,:item_ids,:vendor_transaction_id,:signature]
  end

  def required_params_present?
    required_params.all? {|param| params.key?(param)}
  end

  def required_cookies_present?
    required_params.all? {|param| cookies[param].present? }
  end

  # add params to cookies for maintaining values across page requests
  # we may have to ask the user to sign up or login.
  def store_params
    required_params.each do |key|
      cookies[key] = params[key]
    end
  end

  # validate we have all necessary parameters for our get request.
  # they can come directly from params[] hash or they can be stored in
  # cookies from previously request(s)
  def validate_authorize_request
    if required_params_present? || required_cookies_present?
       store_params
       unless current_auth
         set_redirect("/licenses/authorize")
         redirect_to("/licenses/authenticate") and return
       end
    else
      render text: "Don't have params or cookies." and return
    end
  end

end