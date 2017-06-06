class Campaigns::PagesController < ApplicationController

  def hundred_million
    render "100million", layout: false
  end

end