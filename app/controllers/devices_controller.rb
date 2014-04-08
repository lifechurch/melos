class DevicesController < ApplicationController

  layout "settings"

  before_filter :force_login

  def index
    @devices = Device.all(id: current_auth.user_id, auth: current_auth)
  end

  def destroy
    @user = current_user
    @device = Device.find(params[:id], auth: current_auth)
    @device.auth = current_auth
    @results = @device.destroy
    if @results.valid?
      redirect_to user_devices_path(current_user), notice: "Device removed." # TODO: localize
    else
      @devices = @user.devices
      flash[:error] = "Could not delete device."   # TODO: localize
      render :devices
    end
  end

end