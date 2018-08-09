class ExploreController < ApplicationController

  # def index
  #   p = {
  #       "strings" => {},
  #       "languageTag" => I18n.locale.to_s,
  #       "url" => request.fullpath,
  #       "cache_for" => YV::Caching::a_very_long_time,
  #       "topic" => params && params[:topic],
  #       "version_id" => params && params[:version]
  #   }
  #
  #   fromNode = YV::Nodestack::Fetcher.get('Explore', p, cookies, current_auth, current_user, request, cookie_domain)
  #
  #   if (fromNode['error'].present?)
  #     puts "-"*100
  #     puts fromNode["stack"]
  #     puts "-"*100
  #     return render_404
  #   end
  #
  #   @title_tag = fromNode['head']['title']
  #   @node_meta_tags = fromNode['head']['meta']
  #
  #   render 'index', locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
  # end
end
