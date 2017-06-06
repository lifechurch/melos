module Accounts
  class Confirmation

    attr_accessor :email, :errors

    def resend!
      success = true
      data, errs = YV::Resource.post("users/resend_confirmation", email: email)
      results = YV::API::Results.new(data,errs)

      if results.invalid?
         success = false
         self.errors = results.errors
      end
      return success
    end

    def errors?
      errors.present?
    end

  end
end