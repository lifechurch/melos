require 'spec_helper'

describe ReferencesController do
  it "raises a 404 if the user is not found" do
    expect{visit bible_path(reference: "")}.to raise_error ActionController::RoutingError
  end
end
