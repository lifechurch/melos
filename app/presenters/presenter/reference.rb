module Presenter
  class Reference < Presenter::Base

    include Presenter::ReaderInterface

    attr_accessor :reference, :alt_reference, :version, :alt_version


    def initialize( params = {}, controller = nil, opts = {})
      super(params,controller)
      # render last read or default if no reference specified
      # This allows for root to give better meta (SEO)
      # and saves a redirect for a first time visit
      ref_param = params[:reference] || controller.send(:last_read).try(:to_param) || controller.send(:default_reference).try(:to_param)
      @reference_string = YouVersion::ReferenceString.new( ref_param )

      # override the version in the reference param with the explicit version in the URL
      # this is a temporary hack until Version/Reference class clean-up
      reference_hash[:version] = params[:version]


      @reference     = ::Reference.new(reference_hash.except(:verses))
      @version       = Version.find(reference.version)
      @alt_version   = opts[:alt_version]   || Version.find(controller.send(:alt_version,reference))
      @alt_reference = opts[:alt_reference] || ::Reference.new(reference, version: alt_version)
    end

    def reference_string
      @reference_string
    end

    def reference_hash
      @reference_hash ||= @reference_string.to_hash
    end

    def is_chapter?
      @reference_string.verses.blank?
    end

    def note
      # Create an empty note for the note sidebar widget
      @note ||= Note.new(version_id: version.id)
    end

    # implementation for Presenter::ReaderInterface method
    def verses

      ## Comments pulled from controller refactor

      # Hang on to all the verses to select them in the reader
      # This should probably all be done with a ReferenceList
      # with a lot more functionality and smarts
      #
      # Note: InvalidReferenceError used to be raised here if
      # the reference was invalid

      reference_string.verses
    end

    # implementation for Presenter::ReaderInterface method
    def modal_verse
      # If the reference was a single verse, set that up so we can display the modal
      if reference_hash[:verses].present? && (controller.send(:external_request?) || params[:modal] == "true") && params[:modal] != "false"
        @modal_verse = ::Reference.new(reference_hash)
      end
    end

  end

end