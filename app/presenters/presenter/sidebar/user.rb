module Presenter
  module Sidebar
    class User < Presenter::Base

      def initialize( user , params = {} , controller = {} )
        super(params,controller)
        @user = user
      end

      def sidebar_partial
        "/sidebars/users/default"
      end

      def user
        @user
      end

      def for_me?
        auth = controller.send(:current_auth)
        @for_me ||= ( auth && user.id.to_i == auth.user_id.to_i)
      end

    end
  end
end