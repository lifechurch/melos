class PlansController < ApplicationController

  def index
    @plans = Plan.all(params)
    @categories = CategoryListing.find(params[:category])
    #TODO: We are wasting an API query here, maybe there is an elegant solution?
  end

  def show
    @plan = Plan.find(params[:id])
  end
end
