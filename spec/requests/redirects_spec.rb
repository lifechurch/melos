require 'spec_helper'

describe "Redirects" do

	let(:app_url) {"/app"}
	let(:locales) {[:en,:af,:es,:de,:fr]} #just a few locales

	def assert_app_for( url = "" )
		locales.each do |locale|
			visit "#{locale.to_s}/#{url}"
			page.current_path.should == app_url
		end
	end

	it "should redirect to /app for /mobile" do
		assert_app_for("mobile")
	end

	it "should redirect to /app for /download" do
		assert_app_for("download")
	end

	it "should redirect to /app for /iphone, /bb, /android " do
		assert_app_for("iphone")
		assert_app_for("bb")
		assert_app_for("android")
	end

	it "should redirect to /es/app for /descargar" do
		visit "/descargar"
		page.current_path.should == "/es" + app_url
	end

end