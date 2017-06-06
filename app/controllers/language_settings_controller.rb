class LanguageSettingsController < ApplicationController

  skip_before_filter :set_page
  skip_before_filter :set_site
  skip_before_filter :set_locale
  skip_before_filter :set_locale_and_timezone
  skip_before_filter :skip_home
  skip_before_filter :check_facebook_cookie
  skip_before_filter :tend_caches
  skip_before_filter :set_default_sidebar

  def update
    return head 401 unless current_user.present?
    return head 403 unless current_user.first_name.present? && current_user.last_name.present?

    # Attempt to update user language
    current_user.language_tag = params[:language_tag]
    if current_user.update
      return head 200
    else
      return head 500
    end

  end

end