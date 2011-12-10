class BetaRegistrationsController < ApplicationController
  layout "beta"
  # GET /beta_registrations/new
  def new
    if File.new(Rails.root.join("beta.txt")).gets.chomp == "open"
      render "new"
    else
      render "closed"
    end
  end
  
  # POST /beta_registrations
  def create
    if @user = User.authenticate(params[:username], params[:password])
      cookies.permanent.signed[:a] = @user.id
      cookies.permanent.signed[:b] = params[:username]
      cookies.permanent.signed[:c] = params[:password]
      cookies.permanent.signed[:d] = "yes"
      redirect_to :root, notice: t('welcome to the beta')
    else
      flash.now[:error]= t('invalid username or password')
      render action: "new"
    end
  end
end
