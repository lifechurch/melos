class DonationsController < ApplicationController

  helper :authorize_net
  protect_from_forgery :except => :relay_response

  # GET
  # Displays a payment form.
  def us
    
  end

  def confirm
    @tr = params[:tr]
    @tr[:x_first_name], @tr[:x_last_name] = @tr[:x_name].split(" ", 2)
    @month = (params[:date][:month].length < 2) ? "0#{params[:date][:month]}" : "#{params[:date][:month]}"
    @year = params[:date][:year].gsub(/^20/, "")
    @tr[:x_exp_date] = "#{@month}#{@year}"
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
    sim_response = AuthorizeNet::SIM::Response.new(params)
    if sim_response.success?(AUTHORIZE_NET_CONFIG['api_login_id'], AUTHORIZE_NET_CONFIG['merchant_hash_value'])
      render :text => sim_response.direct_post_reply(donations_receipt_url(:only_path => false), :include => true)
    else
      render
    end
  end
  
  # GET
  # Displays a receipt.
  def receipt
    @auth_code = params[:x_auth_code]
  end

end
