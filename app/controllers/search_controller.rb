class SearchController < ApplicationController

  respond_to :html

  def show
    # if no version specified, use the default
    params[:version_id] ||= current_version

    # If user searches for a known reference, just load it for them in reader
    # unless the user is searching from search page itself
    unless request.referer =~ %r{\A#{search_url}}
      ref_str = YV::ReferenceString.new(params[:q], defaults: {version: current_version})

      if ref_str.validate!
        return redirect_to bible_path(Reference.new(ref_str)) if ref_str.chapter !~ /\D/
        # if the 'chapter' isn't numerical, take the extra
        # time to validate the reference before redirecting
        # since only things like INTRO1 and 1_A are valid and only in certain versions
        return redirect_to bible_path(Reference.new(ref_str)) if Reference.new(ref_str).valid?
      end
    end

    @query = Search.new(params[:q],
                        page: params[:page],
                        category: params[:category],
                        version_id: params[:version_id],
                        locale: locale)
    #if no category selected, use the query's selected category
    #(so a path created with param.merge will have the right parameter)
    params[:category] ||= @query.category

    respond_with @query
  end

end