class FriendshipsController < ApplicationController

  respond_to :html, :json

  def requests
    @friendships = Friendships.incoming(auth: current_auth, page: @page)
    respond_with(@friendships)
  end


  # Accept
  def create
    id = params[:user_id]
    @friendship = Friendships.accept(user_id: id, auth: current_auth)
    if @friendship.valid?
       redirect_to(:back, notice: "You're now friends")
    else
       redirect_to(:back, notice: "Error creating friendship")
    end
    # eventually support json/ajax submission.
    #respond_with(@friendship)
  end

  # Decline
  def destroy

  end

end