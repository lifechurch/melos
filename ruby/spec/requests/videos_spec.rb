require 'spec_helper'

describe "Videos" do
	
	# TODO: resolve discrepancies in staging vs production locales for videos.
	# Production locales 
	# locales =  [:de, :en, :es, :fr, :ko, :nl, :"pt-BR", :ru, :"zh-CN", :"zh-TW"]
	let(:available_locales) {[:en, :es, :ko, :"pt-BR", :"zh-CN", :"zh-TW"]}

	it "should be available for all appropriate locales" do

		available_locales.each do |locale|
			visit("/#{locale.to_s}/videos")
			page.should have_css("ul.resource_list")
		end
	end
end