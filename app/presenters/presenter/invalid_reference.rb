module Presenter
  class InvalidReference < Presenter::Base

    include Presenter::ReaderInterface

    attr_accessor :version, :reference, :alt_version, :alt_reference

    def initialize(params = {}, controller = nil)
      super params, controller
    end

    def verses
      nil
    end

    def modal_verse
      nil
    end


  end
end