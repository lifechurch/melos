class Campaigns::KidsController < ApplicationController
  layout 'kids'

  def index
  end

  def create
    @registration = KidsRegistration.new(phone_number: params[:phone_number])
    if @registration.save
      render :create
    else
      render :index
    end
  end

end