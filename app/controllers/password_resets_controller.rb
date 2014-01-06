class PasswordResetsController < ApplicationController
  
  def success

  end

  def new
    self.sidebar_presenter = Presenter::Sidebar::Default.new
  end

  def create
    self.sidebar_presenter = Presenter::Sidebar::Default.new
    begin
      @results = User.forgot_password(params[:email])
      if @results.valid?
        sign_out
        render "success"
      else
        render "new"
      end
    rescue UnverifiedAccountError => e
      render "sessions/unverified"
    end
  end


end