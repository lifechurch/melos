module YV
  module Concerns
    module SocialNetworks

      private

      def set_facebook_cookie(user)
        begin
          if user.connections["facebook"]
            facebook_data = user.connections["facebook"].data
            # if the FB cookie doesn't exist, update the potentially outdated token
            # to be safe
            current_user.connections["facebook"].update_token unless cookies.signed[:f].present?
            facebook_data[:valid_date] = Time.zone.now
            cookies.permanent.signed[:f] = { value: facebook_data.to_json, domain: cookie_domain }
          else
            cookies.permanent.signed[:f] = { value: "none", domain: cookie_domain }
          end
        rescue
          # if an error occurs with FB weirness, we don't want
          # that stopping all site access
        end
      end

      def check_facebook_cookie
        if current_auth
          if cookies.signed[:f].present?
            if cookies.signed[:f] == "none"
            else
              begin
                cookie_data = ActiveSupport::JSON.decode(cookies.signed[:f])
                if Time.zone.parse(cookie_data["valid_date"]) < 1.week.ago
                  current_user.connections["facebook"].update_token
                  set_facebook_cookie current_user
                else
                end
              rescue
                # if an error occurs with FB weirness, we don't want
                # that stopping all site access
              end
            end
          #else
            #set_facebook_cookie current_user
          end
        end
      end

    end
  end
end
