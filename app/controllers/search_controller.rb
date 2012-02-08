class SearchController < ApplicationController

  def show
    @query = Search.new(params[:q], page: params[:page])
    @category = (params[:category] || @query.recommended_category).to_sym
  end
  
end