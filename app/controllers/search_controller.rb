class SearchController < ApplicationController

  def show
    #if no version specified, use the default
    params[:version] ||= current_version
    @query = Search.new(params[:q], page: params[:page], category: params[:category], version: params[:version], locale: locale)
  end
  
end