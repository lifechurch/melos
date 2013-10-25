class Campaigns::KidsController < ApplicationController
  
  layout 'kids'

  # I'm sure there's a better way to do this, this works for now.
  skip_before_filter :set_page
  skip_before_filter :skip_home
  skip_before_filter :check_facebook_cookie
  skip_before_filter :tend_caches
  skip_before_filter :set_default_sidebar


  caches_action :index


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