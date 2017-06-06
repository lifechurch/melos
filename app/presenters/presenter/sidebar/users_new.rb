module Presenter
  module Sidebar
    class UsersNew < Presenter::Base

      def initialize( user , params = {} , controller = {} )
        super(params,controller)
        @user = user
      end

      def sidebar_partial
        "/sidebars/users/new"
      end

      def user
        @user
      end

    end
  end
end