# Wrapper/Decorator class for results returned from a ResponseHandler instance.process call.
# This class keeps track of returned data as well as any errors that are reported
# via an API call.
#
# Most important use case for this class is that an API call can return data and/or errors.
# That data can be a single object, a list of objects, free form data, etc.  This class
# makes it easy to track errors and data from a call.
#
# Essentially gives you an instance to determine if an API call was indeed valid? or not.
# Data results from the call can be retrieved via the #data attr_reader method.

module YV
  module API
    class Results

      # Undefine all methods, except for the ones we define on this class
      # All method calls are proxied to @data via method missing.
      instance_methods.each do |m|
        undef_method(m) unless (m.match(/^__|^object_id/))
      end

      # For error tracking
      include ActiveModel::Validations

      # Read data initially stored for this instance
      attr_accessor :data

      def initialize( data , errors )
        @data = data
        capture_errors(errors) unless errors.blank?
        return self
      end

      def valid?
        errors.blank?
      end

      def invalid?
        not valid?
      end

      # Proxy all missing method calls to the underlying data object.
      # This allows us to treat an instance of Results class as though it
      # is the wrapped data object.
      def method_missing( name, *args, &block )
        @data.__send__( name, *args, &block )
      end

      def has_error?( msg )
        errors.full_messages.join(" ").include?(msg)
      end

      def add_error(message)
        errors.add(:base, message)
      end

      private

      def capture_errors( api_errors_array )
        api_errors_array.each do |error|
          errors.add(:base, error.i18nize)
        end
      end

    end
  end
end