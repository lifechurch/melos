class SearchController < ApplicationController

  def show
    # if no version specified, use the default
    params[:version_id] ||= current_version

    # if a reference format, redirect to reader
    ref_str = ReferenceString.new(params[:q])
    return redirect_to bible_path(Reference.new(ref_hash))

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