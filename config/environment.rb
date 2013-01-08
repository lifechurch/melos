# Load the rails application
require File.expand_path('../application', __FILE__)

# Disable the default XML params parser - its full of holes
ActionDispatch::ParamsParser::DEFAULT_PARSERS.delete(Mime::XML)

# Initialize the rails application
YouversionWeb::Application.initialize!


