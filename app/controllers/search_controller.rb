class SearchController < ApplicationController

  def show
    # if no version specified, use the default
    params[:version_id] ||= current_version

    # If user searches for a known reference, just load it for them in reader
    # unless the user is searching from search page itself
    unless request.referer =~ %r{\A#{search_url}}
      # if a reference format, redirect to reader
      ref_str = YouVersion::ReferenceString.new(params[:q])
      return redirect_to bible_path(Reference.new(ref_str)) if ref_str.validate!
    end

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