require 'cgi'

class License < YouVersion::Resource

  INTERNAL_SECRET_KEY = "vqc1U3nsjZzlhJqCG0aL5jmmzZ1gRMYWx42l66UbysAiqN1shAZ77DVAJloMPPo"

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

    internal_signature = Licenses::Request.sign( params , INTERNAL_SECRET_KEY )

    response = YvApi.post("licenses/authorize", params.merge(internal_signature: internal_signature)) do |errors|
      raise YouVersion::ResourceError.new(errors)
    end
    return response
  end

end