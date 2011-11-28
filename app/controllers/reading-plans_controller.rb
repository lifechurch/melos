class ReadingPlansController < ApplicationController

  def index
    @plans = ReadingPlan.all
  end

  def show
    @plan = ReadingPlan.find(params[:id])
  end
end
