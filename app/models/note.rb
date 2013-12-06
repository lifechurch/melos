# TODO: 3.1
# - #update API call (when implemented)
# - map attributes to new API response
# - rework all create calls to send new references format
# - write any appropriate tests
# - ensure search#notes properly works
# - implement code for translated moment title
 


class Note < YV::Resource

  api_response_mapper YV::API::Mapper::Note

  include YV::Concerns::Icons
  include YV::Concerns::Avatars
  include YV::Concerns::Actionable
  include YV::Concerns::Commentable
  include YV::Concerns::Identifiable

  attr_accessor :reference_list

  attribute :moment_title

  attribute :id
  attribute :user_id
  attribute :kind_id
  attribute :kind_color
  attribute :color
  attribute :title
  attribute :content
  attribute :user_status
  attribute :references
  attribute :avatars
  attribute :icons
  attribute :created_dt
  attribute :updated_dt


  attribute :comments
  attribute :commenting
  attribute :comments_count
  
  attribute :content_text
  attribute :content_html
  attribute :published
  
  attribute :system_status
  attribute :share_connections
  
  attribute :user_avatar_url
  attribute :username
  attribute :highlight_color
  
  attribute :reference_list

  # Virtual attributes used for form submissions
  attribute :version_id
  attribute :usfm_references


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

      def create_path
        "moments/create"
      end

      def update_path
        "moments/update"
      end

      def kind
        "note"
      end

    # Override all method to add note kind to options
    def all(opts={})
      raise "Page parameter is required" unless opts[:page]
      opts[:kind] = kind
      super(opts)
    end


    # API Method
    # Returns ResourceList of Note instances

    # Constrained to only work for <= 10 verses or a chapter
    # API doesn't want more than 10 verses or returns the following error:
    # YV::ResourceError: search.references.exceeded_10_verse_references
    
    # reference.to_usfm 
    # => "GEN.2.5+GEN.2.6+GEN.2.7+GEN.2.8+GEN.2.9+GEN.2.10+GEN.2.11+GEN.2.12+GEN.2.13+GEN.2.14+GEN.2.15"
    # lets take the output and truncate it to 10 or less.

    def for_reference(ref, params = {})
      only_10_refs = ref.to_usfm.split("+")[0...10].join("+")
      params.merge!({references: only_10_refs, query: '*'})
      return search(params)
    end



    # API Method
    # return all notes for a given search via query: param
    # ex: Note.search(query: "love")
    # returns ResourceList of Note instances

    def search(params = {})
      _auth = params[:auth]
      params[:query] ||= '*'

      data, errs = get("search/notes", params)
      results = YV::API::Results.new(data,errs)

      unless results.valid?
        if results.has_error?("not found") or 
           results.has_error?("Search did not match any documents")
           
           data = Hashie::Mash.new(notes: [])
        else raise_errors(results.errors,"Note#search") end
      else
        #
      end

      notes = ResourceList.new
      data.notes.each do |d|
        notes << new(d)
      end
      notes.total = data.total || 0
      return notes
    end

    def for_user(user_id, params = {})
      params.merge!({user_id: user_id})
      return all(params)
    end

  end
  # END Class method definitions ------------------------------------------------------------------------


  # Custom persistence using Moments#create API.
  # Example response data:

  #  {"commenting"=>{"enabled"=>true, "comments"=>nil},
  #     "kind_id"=>"note.v1",
  #     "base"=>
  #      {"body"=>nil,
  #       "images"=>
  #        {"body"=>nil,
  #         "avatar"=>
  #          {"renditions"=>
  #            [{"url"=>
  #               "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_24x24.png",
  #              "width"=>24,
  #              "height"=>24},
  #             {"url"=>
  #               "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_48x48.png",
  #              "width"=>48,
  #              "height"=>48},
  #             {"url"=>
  #               "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_128x128.png",
  #              "width"=>128,
  #              "height"=>128},
  #             {"url"=>
  #               "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_512x512.png",
  #              "width"=>512,
  #              "height"=>512}],
  #           "action_url"=>"//www.bible.com/users/BrittTheStager",
  #           "style"=>"circle"},
  #         "icon"=>
  #          {"renditions"=>
  #            [{"url"=>
  #               "//commondatastorage.googleapis.com/static-youversionapi-com/moments/icons/note-white-24.png",
  #              "width"=>24,
  #              "height"=>24},
  #             {"url"=>
  #               "//commondatastorage.googleapis.com/static-youversionapi-com/moments/icons/note-white-48.png",
  #              "width"=>48,
  #              "height"=>48}],
  #           "action_url"=>nil}},
  #       "action_url"=>nil,
  #       "title"=>
  #        {"l_str"=>"moment.note.title",
  #         "l_args"=>{"name"=>"Britt Miles", "title"=>"A SUB YO!"}}},
  #     "created_dt"=>"2013-10-03T11:14:23+00:00",
  #     "kind_color"=>"824f2b",
  #     "id"=>5699636350156800,
  #     "extras"=>
  #      {"user_status"=>"private",
  #       "title"=>"A SUB YO!",
  #       "color"=>"000000",
  #       "content"=>"My new note!",
  #       "system_status"=>"approved",
  #       "references"=>[{"human"=>nil, "version_id"=>1, "usfm"=>"GEN.1.1"}],
  #       "user"=>{"username"=>"BrittTheStager", "id"=>7440, "name"=>"Britt Miles"}}}

  # TODO: API should not REQUIRE color, references.

  def kind
    self.class.kind
  end

  def path
    "/notes/#{id}"
  end

  # Custom persistence for Moments API 3.1
  def persist(path)
    return persist_moment(path, attributes.merge(kind: "note").slice(:id,:auth,:kind,:title,:content,:references,:user_status,:created_dt))
  end

  def before_save
    set_created_dt
  end

  def build_references
    return unless usfm_references and version_id
    usfms = usfm_references.split("+")
    self.references = usfms.collect {|usfm| {usfm: [usfm], version_id: version_id } }
    
    #refererences = [
    #  {usfm:["GEN.1.1","GEN.1.2"], version_id: 1}
    #]
  end

  def build_content
    # self.content = self.content_text unless self.content_text.blank?
    self.content = self.content_html if self.content_html

    # To map to API 2.x style to minimize changes
    unless self.content.is_a? String
      self.content_html = self.content.try :html
      self.content = self.content.try :text
    end
  end

  def user
    User.find( self.user_id )
  end

  def after_build
    build_content
    build_references
  end

  def can_share?
    return (self.system_status == "new" || self.system_status == "approved") && self.user_status == "public"
  end


  def moment_partial_path
    "moments/note"
  end

  def to_path
    "/notes/#{id}"
  end
end
