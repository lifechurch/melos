class Video < YV::Resource

  api_response_mapper YV::API::Mapper::Video

  attribute :id
  attribute :type
  attribute :title
  attribute :description
  attribute :runtime
  attribute :credits
  attribute :created_dt
  attribute :published_dt
  attribute :references
  attribute :language_tag
  attribute :short_url
  attribute :license_required

  attribute :publisher
  attribute :thumbnails
  attribute :renditions
  attribute :videos



  class << self

    def licensed?(video_id, auth)
      results = find(video_id,{auth: auth, force_auth: true})
      return results.valid? ? results.data : false
    end

    # Parameters:
    # query of what you're wanting to search for
    # page  number of results to return
    def search(query = "*", params = {})
      page   = params[:page] || 1
      language_tag = params[:language_tag] || "en"
      params = {query: query, page: page, language_tag: language_tag}

      data, errs = get(list_path, params)
      results = YV::API::Results.new(data,errs)

      unless results.valid?
        if results.has_error?("not found")
           data = []
        else
           raise_errors(results.errors, "Video#search")
        end
      end

      list = ResourceList.new
        list.total = data.total
        data.videos.each do |d|
          list << Video.new(d)
        end
      return list
    end

    def list_path
      "search/videos"
    end

    def api_path_prefix
      "videos"
    end
  end

  def series?
    videos.present? ? true : false
  end

  def small_image
    image = thumbnails.select {|th| th.width == 320 }.first || thumbnails.select {|th| th.width == 360 }.first
    return image
  end

  def hero_image
    thumbnails.select {|th| th.width == 910 }.first
  end

  def poster_image
    if image = thumbnails.select {|th| th.width == 1280 }.first
       return image
    elsif image = thumbnails.select {|th| th.width == 640 }.first
       return image
    end
  end

  def webm
    rendition("webm","http").first
  end

  def hls
    rendition("mpeg4","hls").first
  end

  def mp4
    rendition("hls","rtsp").first
  end

  def rendition(format, protocol)
    renditions.reject {|rend| rend.format != format && rend.protocol != protocol}
  end

  def to_param
    puts "video #{id} #{title} #{credits}"
    "#{id} #{title.to_url unless title.nil?} #{credits.to_url unless credits.nil?}".parameterize
  end

end
