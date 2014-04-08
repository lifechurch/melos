module Subscriptions
  class Partner < YV::Resource

    api_response_mapper YV::API::Mapper::SubscriptionsPartner

    attribute :user_id
    attribute :user_name
    attribute :user_avatar_url
    attribute :created_dt

    class << self


      def all(opts={})
        validate_opts(opts)
        super(opts)
      end

      def list_path
        "reading-plans/accountability"
      end

      def add(opts={})
        validate_opts(opts)
        post_request(add_accountability_path,opts)
      end
      
      def add_accountability_path
        "reading-plans/add_accountability"
      end      



      def delete(opts={})
        validate_opts(opts)
        post_request(delete_accountability_path,opts)
      end

      def delete_accountability_path
        "reading-plans/delete_accountability"
      end


      private

      def post_request(api_path, opts)
        data, errs = post( api_path , opts)
        results = YV::API::Results.new(data,errs)
          raise_errors(results.errors, "subscription#update_accountability") unless results.valid?

        results
      end

      def validate_opts(opts)
        raise "Auth required."                      unless opts[:auth]
        raise "User id required."                   unless opts[:user_id]
        raise "Id option required for subscription" unless opts[:id]
      end


    end

  end
end