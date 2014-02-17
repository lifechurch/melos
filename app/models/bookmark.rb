# TODO: 3.1
# - #update API call (when implemented)
# - #labels API call (when implemented)
# - map attributes to new API response
# - rework all create calls to send new references format
# - write any appropriate tests
# - ensure search#notes properly works
# - implement code for translated moment title


class Bookmark < YV::Resource

  include YV::Concerns::Moments

  # :usfm_references
  # Are utilized for form submits. A plus separated list of usfm refs GEN.1.1+GEN.1.2
  attributes [:title,:labels,:references,:color,:version_id,:usfm_references]

  api_response_mapper YV::API::Mapper::Bookmark


  attr_accessor :reference_list

  class << self

    # Override paths to make calls to 3.1 API for Moments
      def list_path
        "moments/items"
      end

      def resource_path
        "moments/view"
      end

      def delete_path
        "moments/delete"
      end

      def update_path
        "moments/update"
      end

      def create_path
        "moments/create"
      end

      def kind
        "bookmark"
      end


    # Override all method to add bookmark kind to options
    def all(opts={})
      raise "Page parameter is required" unless opts[:page]
      super(opts.merge(kind: kind))
    end


    # API Method
    # Lookup all bookmarks with a given label and params
    # Returns a ResourceList of bookmark instances
    def for_label(labels, params = {})
      opts = params.merge({kind: "bookmark", labels: labels, page: params[:page] || 1, auth: params[:auth], user_id: params[:user_id]})
      data, errs = get("search/moments", opts)
      map_all(YV::API::Results.new(data,errs))
    end


    # API Method
    # Lookup all bookmarks for a given user_id and params
    def for_user(user_id = nil, params = {})
      opts = params.merge({user_id: user_id, page: params[:page] || 1})
      return all(opts)
    end


    # API Method
    # Lookup bookmark labels (tags) for user passed via auth option
    # Returns a ResourceList of label Hashie::Mashs
    # TODO: create class for labels

    def labels(opts={})
      data, errs = get( labels_path , opts.slice(:auth))

      data = [] if not_found?(errs)
      return results = YV::API::Results.new(data,errs)
      # [{"count"=>1, "label"=>"hugh"},
      #  {"count"=>1, "label"=>"rocks"},
      #  {"count"=>1, "label"=>"socks"}]
    end

    def labels_path
      "moments/labels"
    end

  end
  # END class methods ----------------------------------------------------------------------------------------------


  def labels=(labes)
    build_labels(labes)
  end


  # Custom persistence for new Moments API
  # Takes care of #create and #update requirements by passing 'kind' option.c
  def persist(path)
    return persist_moment(path,attributes.merge(kind: "bookmark").slice(:id,:auth,:kind,:title,:references,:labels, :created_dt, :color))
  end

  def before_save
    set_created_dt
  end

  # Called after initialization
  def after_build

    build_references
    build_labels(self.labels)

    # self.reference does multiple duty here for the moment. When creating a new object,
    # self.reference may contain whatever the user passed in (usually a String) with the
    # :reference key.  When creating an object from an API call, it will bear whatever
    # string the API returned for the 'reference' key in the response->data section.
    # And it could probably be some other things before we're done.
    # self.version = attributes.try :[], :version_id
    # self.reference_list = ReferenceList.new(self.references, self.version)
    # self.version = self.reference_list.first.try :version
  end

  def build_labels(labes)
    self.attributes["labels"] = case labes
      when nil    then []
      when Array  then labes
      when String then labes.split(",")
    end
  end



  def after_save(results)
    return unless results
    
    #self.version = Version.find(results.version_id)
    # Sometimes references come back as an array, sometimes just one, Hashie::Mash
    #if results.references
    #  self.reference_list = ReferenceList.new(self.references, self.version)
    #end
  end

  def moment_partial_path
    "moments/bookmark"
  end

end
