class Campaigns::ChristmasController < ApplicationController
  include ApplicationHelper

  layout 'christmas'

  skip_before_filter :set_page
  skip_before_filter :set_locale
  skip_before_filter :skip_home
  skip_before_filter :check_facebook_cookie
  skip_before_filter :tend_caches
  skip_before_filter :set_default_sidebar

  def index

  end

end