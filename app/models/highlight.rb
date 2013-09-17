class Highlight < YV::Resource

  attribute :color
  attribute :reference
  attribute :version

  class << self

    def destroy_id_param
      :id
    end

    # API Method (hits configuration call on YV::Resource)
    # Returns an array of HEX colors
    # ex: ["f3f315", "67c8ff", "83f52c", "ff6ec7"]
    # valid options
    # - user_id               will scope colors to specified user
    # - auth (with user_id)   will scope colors to specified user

    def colors(opts = {})
      opts = opts.merge({user_id: opts[:auth].user_id}) if (opts[:user_id] == nil && opts[:auth])
      response = self.configuration(opts)
      response.delete(:colors)
    end

    # API Method
    # Returns a ResourceList of Highlight instances with a given reference
    # Returns nil if no :auth option is given
    # valid options
    # - auth            scopes API call to find hilights for auth user & reference
    def for_reference(reference, params = {})
      reference = Reference.new(reference) unless reference.is_a? Reference
      params[:page] ||= 1
      opts = params.merge(reference: reference.chapter_usfm, version_id: reference.version)

      data, errs = get("highlights/chapter", opts)
      results = YV::API::Results.new(data,errs)
      
      unless results.valid?
        data = [] if results.has_error?("note found")
      else
        list = ResourceList.new
        list.total = data.total
          data.highlights.each do |h|
            list << new(h)
          end
        return list
      end

    end
  end
  # End class methods ----------------------------------------------------------------------------------------------


  

  def after_build
      usfm_ref = case reference
      when String       #usfm style string coming from user creation
        attributes.reference
      when Hashie::Mash #Mash coming back from existing highlight in API
        attributes.reference.usfm
      end

      # if the versid_id isn't passed, then the reference
      # string will (should) have it
      self.version = attributes.try :version_id

      # if a version ID is specified, use it as the overriding version
      forced_opts = self.version.nil? ? {} : {version: self.version}

      # note: it is possible we're creating a highlight from an id alone
      # so it's not necessarrily an error if we don't have a usfm_ref
      self.reference = Reference.new(usfm_ref, forced_opts) if usfm_ref

      # in case the version_id wasn't available above
      # and was passed in the ref string
      self.version ||= self.reference.try :version
  end

  def before_save
    ref = self.reference.is_a?(Reference) ? self.reference : Reference.new(self.reference) # self.reference could be a string
    self.attributes.version_id = self.reference.version
    self.reference = ref.to_usfm
  end


  def as_json(options = {})
    #API/apps shouldn't support ranged highlights, but some exist, so use only the first verse if range.
    #EVENTUALLY: make this pervasive/complete so anyone using this object only sees the 1st verse and we can just pass raw_hash[:verses]
    {verse: self.reference.verses.first, color: self.color, id: id, version: version}
  end

end
