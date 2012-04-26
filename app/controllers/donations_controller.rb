class DonationsController < ApplicationController

  helper :authorize_net
  protect_from_forgery :except => :relay_response

  # GET
  # Displays a payment form.
  def us
    #if user is logged in we can pre-fill some info
    @name = current_auth ? current_user.name : nil
    @email = current_auth ? current_user.email : nil
    @zip = current_auth ? current_user.zip : nil
    loc = Geokit::Geocoders::GoogleGeocoder.geocode(@zip.to_s) rescue nil if @zip
    @city = loc ? loc.city : nil
    @state = loc ? loc.state : nil
  end

  def confirm
    @tr = params[:tr]
    @tr[:x_first_name], @tr[:x_last_name] = @tr[:x_name].split(" ", 2)
    @amount = @tr[:x_amount]
    @sim_transaction = AuthorizeNet::SIM::Transaction.new(
          AUTHORIZE_NET_CONFIG['api_login_id'],
          AUTHORIZE_NET_CONFIG['api_transaction_key'],
          @amount,
          :relay_url => donations_relay_response_url(:only_path => false))
  end

  # POST
  # Returns relay response when Authorize.Net POSTs to us.
  def relay_response
    if params[:x_response_code].to_i == 1
      redirect_to donations_receipt_url(:only_path => false)
    else
      @error_text = params[:x_response_reason_text]
      render
    end
  end
  
  # GET
  # Displays a receipt.
  def receipt
    @auth_code = params[:x_auth_code]
  end

end
