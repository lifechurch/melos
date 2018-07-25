class PasswordsController < ApplicationController

  layout "settings"

  before_filter :force_login

  def show
    @user = current_user
  end

  def update
    @user = current_user
    if params[:user][:old_password] == current_auth.password
      @results = @user.update_password(params[:user].except(:old_password))

      if @results.valid?
        flash[:notice]=t('users.password.updated')
        cookies.signed.permanent[:c] = { value: params[:user][:password], domain: cookie_domain }
      else
        flash[:error]= @results.errors[:base].first || t('users.password.error')
      end
    else
      @user.add_error(t('users.password.old was invalid'))
    end
    render action: "show"
  end

end
