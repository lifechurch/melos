require 'spec_helper'

describe VersionSelectCell do
  use_vcr_cassette("version_select")
  context "#display" do

      subject { render_cell(:version_select, :display) }

      it { should have_selector("select") }
      it { should have_selector("option", :content => "King James Version (KJV)") }

      subject { render_cell(:version_select, :display, :selected => Version.new("kjv"))}

      it { should have_selector(:xpath, "//option[@selected][@value='kjv']")}

  end
end
