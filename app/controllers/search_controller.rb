class SearchController < ApplicationController

  def show
    #if no version specified, use the default
    params[:version_id] ||= current_version
    @query = Search.new(params[:q],
                        page: params[:page],
                        category: params[:category],
                        version_id: params[:version_id],
                        locale: locale)
    #if no category selected, use the query's selected category
    #(so a path created with param.merge will have the right parameter)
    params[:category] ||= @query.category
  end

end