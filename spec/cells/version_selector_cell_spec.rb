require 'spec_helper'

describe VersionSelectorCell do
  use_vcr_cassette("version_selector_cell")
  context "#display" do

      subject { render_cell(:version_selector, :display) }

      it { should have_selector("#menu_version") }
      it { should have_selector("td", content: "King James Version") }

      subject { render_cell(:version_selector, :display, :reference => Reference.new("gen.1.1.niv"))}

      it { should have_selector("td", content: "NIV") }

  end
end
