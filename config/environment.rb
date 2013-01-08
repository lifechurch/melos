# Disable the default XML params parser - its full of holes
ActionDispatch::ParamsParser::DEFAULT_PARSERS.delete(Mime::XML)

# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
YouversionWeb::Application.initialize!


