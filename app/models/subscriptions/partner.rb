module Subscriptions
  class Partner < YV::Resource

    api_response_mapper YV::API::Mapper::SubscriptionsPartner

    attribute :user_id
    attribute :user_name
    attribute :user_avatar_url
    attribute :created_dt

    class << self


      def all(opts={})
        raise "Auth required."                      unless opts[:auth]
        raise "User id required."                   unless opts[:user_id]
        raise "Id option required for subscription" unless opts[:id]

        super(opts)
      end

      def list_path
        "reading-plans/accountability"
      end



      def add(opts={})
        raise "Auth required."                      unless opts[:auth]
        raise "User id required."                   unless opts[:user_id]
        raise "Id option required for subscription" unless opts[:id]

        data, errs = post( add_accountability_path , opts)
        results = YV::API::Results.new(data,errs)
          raise_errors(results.errors, "subscription#update_accountability") unless results.valid?

        results
      end
      
      def add_accountability_path
        "reading-plans/add_accountability"
      end      



      def delete(opts={})
        raise "Auth required."                      unless opts[:auth]
        raise "User id required."                   unless opts[:user_id]
        raise "Id option required for subscription" unless opts[:id]

        data, errs = post( delete_accountability_path , opts)
        results = YV::API::Results.new(data,errs)
          raise_errors(results.errors, "subscription#update_accountability") unless results.valid?

        results
      end

      def delete_accountability_path
        "reading-plans/delete_accountability"
      end


    end

  end
end