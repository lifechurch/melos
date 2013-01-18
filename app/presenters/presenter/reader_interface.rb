# Pseudo interface for Presenters that want to be compatible with our bible reader
# In your presenter, include this module
#
#   include Presenter::ReaderInterface
#
# Then implement all required methods as described in the ReaderInterface module below.
#
# In your controller, create an instance of your presenter
#
#   @presenter = Presenter::Foo.new(some,params)
#
# In your view, call the reader partial and pass it your compatible presenter
#
#   = render partial: '/references/reader', locals: {presenter: @presenter}

module Presenter

  class InterfaceNotImplementedError < NoMethodError
  end

  module ReaderInterface

    # instance of Version for setting up appropriate version data within the Reader
    # return a Version for display/data. Required.
    def version
      raise Presenter::InterfaceNotImplementedError.new("version method not implemented for interface ReaderInterface!")
    end

    # instance of Reference for display within reader and setting up appropriate data
    # Return a Reference for display. Required.
    def reference
      raise Presenter::InterfaceNotImplementedError.new("version method not implemented for interface ReaderInterface!")
    end

    # Sets up appropriate secondary version data for parallel mode feature of reader
    # Return a Version or nil
    def alt_version
      raise Presenter::InterfaceNotImplementedError.new("alt_reference method not implemented for interface ReaderInterface!")
    end

    # Sets up appropriate secondary reference data for parallel mode feature of reader
    # Return a Reference or nil
    def alt_reference
      raise Presenter::InterfaceNotImplementedError.new("alt_version method not implemented for interface ReaderInterface")
    end

    # Array of verse numbers.
    # If you desire to pre-select one or more verses with auto scroll, return the desired verses in an array.
    # If you do not desire any selection or scrolling, return nil.
    def verses
      raise Presenter::InterfaceNotImplementedError.new("verses method not implemented for interface ReaderInterface")
    end

    # Return a single verse Reference to trigger the verse modal on the front end.
    # If you do not desire to trigger the modal, return nil.
    def modal_verse
      raise Presenter::InterfaceNotImplementedError.new("modal_verse method not implemented for interface ReaderInterface")
    end

    # Default implementation on whether the verses should be rendered in focus mode or selected mode
    #
    def focus?
      false
    end

    # Default implementation for note for verse actions menu
    #
    def note
      Note.new()
    end

  end
end