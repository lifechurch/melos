class Highlight < YV::Resource
  attribute :color
  attribute :reference
  attribute :version

  def self.destroy_id_param
    :id
  end

  # Return color list from configuration call
  # Send in user_id or auth for options and get color list scoped to user.
  def self.colors(opts = {})
    opts = opts.merge({user_id: opts[:auth].user_id}) if (opts[:user_id] == nil && opts[:auth])
    response = self.configuration(opts)
    response.delete(:colors)
  end

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

  def self.for_reference(reference, params = {})
    reference = Reference.new(reference) unless reference.is_a? Reference
    params[:page] ||= 1
    opts = params.merge(reference: reference.chapter_usfm, version_id: reference.version)
    response = YV::API::Client.get("highlights/chapter", opts) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)not_found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      end
    end

    list = ResourceList.new
    list.total = response.total
    response.highlights.each {|h| list << new(h.merge(auth: params[:auth]))}
    list
  end

  def as_json(options = {})
    #API/apps shouldn't support ranged highlights, but some exist, so use only the first verse if range.
    #EVENTUALLY: make this pervasive/complete so anyone using this object only sees the 1st verse and we can just pass raw_hash[:verses]
    {verse: self.reference.verses.first, color: self.color, id: id, version: version}
  end

end
