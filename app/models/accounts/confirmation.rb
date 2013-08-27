module Accounts
  class Confirmation

    extend  ActiveModel::Naming
    include ActiveModel::Validations

    attr_accessor :email

    def resend!
      success = true
      YV::API::Client.post("users/resend_confirmation", email: email) do |errors|
        errors.each {|err| self.errors.add :base, err["error"]}
        success = false
      end
      return success
    end

    def errors?
      errors.present?
    end

  end
end