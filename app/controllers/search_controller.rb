class SearchController < ApplicationController

  respond_to :html

  def category
    @search = get_search_class.new(params[:q],search_params)
    @results = @search.results
    respond_with @results
  end

  private

  def search_params
    # if no version specified, use the default
    params[:version_id] ||= current_version
    {
      page: @page,
      version_id: params[:version_id].to_i,
      locale: locale
    }
  end

  def get_search_class
    case params[:category].to_sym
    when :bible then Search::Bible
    when :users then Search::User
    when :plans then Search::Plan 
    end
  end

end