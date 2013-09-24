class JsonController < ActionController::Metal
  
  include ActionController::Helpers
  include ActionController::Rendering
  include ActionController::Renderers::All
  include ActionController::Cookies


  # Routes
  # get "/highlights/:version/:reference"
  def reference_highlights
    highlights = Highlight.for_reference(ref_from_params, auth: current_auth) if current_auth
    highlights ||= []
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

  def ref_from_params
    case
    when params.has_key?(:version)
      Reference.new(params[:reference], version: params[:version])
    else
      Reference.new(params[:reference])
    end
  end

end