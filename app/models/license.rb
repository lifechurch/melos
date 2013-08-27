class License < YV::Resource

  INTERNAL_SECRET_KEY = ENV['LICENSES_INTERNAL_SECRET']

  def self.authorize( opts = {} )
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

    errors  = nil
    success = false
    internal_signature = Licenses::Request.sign( params , INTERNAL_SECRET_KEY )

    response = YV::API::Client.post("licenses/authorize", params.merge(internal_signature: internal_signature)) do |errs|
      YV::ResourceError.new(errs)
    end

    success = (response == true)
    errors  = response if success == false
    return success, errors
  end

end