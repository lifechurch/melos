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
    @me = (current_auth && @user.id == current_auth.user_id)
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
end
