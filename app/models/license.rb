class License < YV::Resource

  INTERNAL_SECRET_KEY = ENV['LICENSES_INTERNAL_SECRET']

  class << self

    def authorize( opts = {} )
      user_id           = opts[:user_id].to_s || raise("options must contain :user_id")
      item_ids          = opts[:item_ids]     || raise("options must contain :item_ids")
      vendor_id         = opts[:vendor_id]    || raise("options must contain :vendor_id")
      vendor_trans_id   = opts[:vendor_transaction_id] || raise("options must contain :vendor_transaction_id")
      vendor_signature  = opts[:signature] || raise("options must contain :vendor_signature")

      params = {
        user_id: user_id,
        item_ids: item_ids,
        vendor_id: vendor_id,
        vendor_transaction_id: vendor_trans_id,
        vendor_signature: vendor_signature
      }

      internal_signature = Licenses::Request.sign( params , INTERNAL_SECRET_KEY )

      data,errs = YV::Resource.post("licenses/authorize", params.merge(internal_signature: internal_signature))
      results = YV::API::Results.new(data,errs)

      # Bit of a hack here to make returned errs the data returned from our API call
      # look at licenses controller.  #TODO - dehack.
      errs = data unless results.valid?

      return results.valid?, errs
    end

  end

end