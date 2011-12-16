class UsersController < ApplicationController
  before_filter :force_login, except: [:new, :create, :confirm_email]

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.create
      redirect_to confirm_email_path
    else
      render action: "new"
    end
  end

  def confirm_email
  end

  def show
    @user = User.find(params[:id], auth: current_auth)
    @me = (current_auth && @user.id.to_i == current_auth.user_id.to_i)
  end

  def profile
  end

  def update_profile
    @user.auth = current_auth
    result = @user.update(params[:user]) ? flash.now[:notice]=(t('users.profile.updated')) : flash.now[:error]=(t('users.profile.error'))
    render action: "profile"
  end

  def notifications
  end

  def password
  end

  def update_password
    puts "old one is #{params[:user][:old_password]}"
    puts "current password is #{current_auth.password}"
    if params[:user][:old_password] == current_auth.password
      puts "yay"
      result = @user.update(params[:user]) ? flash.now[:notice]=(t('users.password.updated')) : flash.now[:error]=(t('users.password.error'))
      cookies.signed.permanent[:c] = params[:user][:password] if result
    else
      puts "d'oh"
      flash.now[:error]= t('users.password.old was invalid')
    end
    render action: "password"
  end

  def connections
  end

  def devices
  end

  private

  def force_login
    redirect_to sign_in_path, error: t('users.sign in to access') unless current_auth
    @user = current_user
    @user.auth = current_auth
  end
  
  def index
    if params[:plan_id]
      @plan = Plan.find(params[:plan_id])
      @users = Plan.find(params[:plan_id]).users
    end
  end
end
