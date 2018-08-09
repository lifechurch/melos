class LicensesController < ApplicationController

  before_filter :validate_authorize_request, only: [:authorize]

  # GET
  # Authorize get request as defined in our license initiation documentation
  # http://developers.youversion.com/api/docs/3.0/sections/licenses/initiation.html
  def authorize
    request_params = params_for_request
    @success, @error = License.authorize(request_params.merge(user_id: current_auth.user_id))
    @vendor = Vendor.find(request_params[:vendor_id])

    if (@error.try(:message) && @error.message.include?("licenses.vendor_transaction_id.duplicate"))
      item_video_ids.each do |vid|
        break if @success = Video.licensed?(vid,current_auth)
      end
    end

    cleanup_params and clear_redirect if @success
  end

private

  def item_video_ids
    video_items = params[:item_ids] || cookies[:item_ids] # "video:1,video:2,video:3"
    video_items.split(",").map {|str| str.split(":").second.to_i}
  end

  # Collect the required parameters + values for the authorize request
  # They can come from either params or cookies depending on whether
  # the user needs to login or signup first
  def params_for_request
    params_for_request = {}
    required_params.each do |key|
      params_for_request[key] = if params[key].present?
        params[key]
      else
        cookies[key]
      end
    end
    return params_for_request
  end

  # Required parameters for a valid authorize request
  def required_params
    [:vendor_id,:item_ids,:vendor_transaction_id,:signature]
  end

  # Check if all required parameters are available
  def required_params_present?
    required_params.all? {|param| params.key?(param)}
  end

  # Check if all parameters are stored in cookies and available
  def required_cookies_present?
    required_params.all? {|param| cookies[param].present? }
  end

  # add params to cookies for maintaining values across page requests
  # we may have to ask the user to sign up or login.
  def store_params
    required_params.each do |key|
      cookies[key] = { value: params[key], domain: cookie_domain }
    end
  end

  def cleanup_params
    required_params.each do |key|
      cookies[key] = { value: nil, domain: cookie_domain }
    end
  end

  # validate we have all necessary parameters for our get request.
  # they can come directly from params[] hash or they can be stored in
  # cookies from previously request(s)
  def validate_authorize_request
    params_present = required_params_present?
    if params_present || required_cookies_present?
       store_params if params_present #store cookies only if params are in the url.
       unless current_auth
         set_redirect(authorize_licenses_path)
         redirect_to(sign_in_path(source:"licenses")) and return
       end
    else
      render text: "Required parameters have not been sent." and return
    end
  end

end
