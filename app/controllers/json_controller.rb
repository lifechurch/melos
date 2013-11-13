class JsonController < ActionController::Metal
  
  include ActionController::Helpers
  include ActionController::Rendering
  include ActionController::Renderers::All
  include ActionController::Cookies


  # Routes
  # get "/highlights/:version/:reference"
  def reference_highlights
    highlights = current_auth ? Highlight.for_reader(auth: current_auth, user_id: current_auth.user_id, version_id: params[:version], usfm: usfm_param) : []
    render json: highlights.to_json
  end

  include NewRelic::Agent::Instrumentation::ControllerInstrumentation
  add_transaction_tracer :reference_highlights



  private

  # current_auth, ref_from_params - Ripped these from AppController - we need to move these into lib Modules 
  # and include them where needed.

  def current_auth
    return @current_auth if @current_auth
    if cookies.signed[:a] && cookies.signed[:b] && cookies.signed[:c]
      @current_auth ||= Hashie::Mash.new( {'user_id' => cookies.signed[:a], 'username' => cookies.signed[:b], 'password' => cookies.signed[:c]} )
    end
  end



  def usfm_param
    pieces = params[:reference].split(".")
    "#{pieces.first.upcase}.#{pieces.second}" # JHN.1 from jhn.1.kjv
  end

end