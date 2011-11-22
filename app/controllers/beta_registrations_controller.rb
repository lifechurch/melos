class BetaRegistrationsController < ApplicationController
  layout "beta"
  # GET /beta_registrations/new
  def new
    if File.new(Rails.root.join("beta.txt")).gets.chomp == "open"
      @beta_registration = BetaRegistration.new

      respond_to do |format|
        format.html # new.html.erb
        format.json { render json: @beta_registration }
      end
    else
      render "closed"
    end
  end
  
  # POST /beta_registrations
  def create
    @beta_registration = BetaRegistration.new(username: params[:username], password: params[:password])

    if @beta_registration.save
      cookies.permanent.signed[:a] = User.authenticate(params[:username], params[:password]).id
      cookies.permanent.signed[:b] = params[:username]
      cookies.permanent.signed[:c] = params[:password]
      cookies.permanent.signed[:d] = "yes"
      redirect_to :root, notice: t('welcome to the beta')
    else
      render action: "new"
    end
  end
end
