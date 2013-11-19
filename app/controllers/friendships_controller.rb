class FriendshipsController < ApplicationController

  respond_to :html, :json

  def requests
    @friendships = Friendships.incoming(auth: current_auth, page: @page)
    respond_with(@friendships)
  end


  # Accept
  def create
    @friendship = Friendships.accept(user_id: params[:user_id].to_i, auth: current_auth)
    notice = @friendship.valid? ? "You're now friends" : "Error creating friendship"
    redirect_to(:back, notice: notice)
    # eventually support json/ajax submission.
    #respond_with(@friendship)
  end

  # Decline
  def destroy
    @friendship = Friendships.decline(user_id: params[:id].to_i, auth: current_auth)
    notice = @friendship.valid? ? "Declined" : "Error"
    redirect_to(:back, notice: notice)
  end

end