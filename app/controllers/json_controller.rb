class JsonController < ActionController::Metal
  
  include AbstractController::Helpers
  include ActionController::Helpers
  include ActionController::Rendering
  include ActionController::Renderers::All
  include ActionController::Cookies

  include YV::Concerns::UserAuth


  # Routes
  # get "/highlights/:version/:reference"
  def reference_highlights
    highlights = current_auth ? Highlight.for_reader(auth: current_auth, user_id: current_auth.user_id, version_id: params[:version], usfm: usfm_param) : []
    render json: highlights.to_json
  end

  include NewRelic::Agent::Instrumentation::ControllerInstrumentation
  add_transaction_tracer :reference_highlights



  private

  def usfm_param
    pieces = params[:reference].split(".")
    "#{pieces.first.upcase}.#{pieces.second}" # JHN.1 from jhn.1.kjv
  end

end