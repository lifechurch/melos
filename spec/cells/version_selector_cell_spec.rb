require 'spec_helper'

describe VersionSelectorCell do
  use_vcr_cassette("version_selector_cell")
  context "#display" do

      subject { render_cell(:version_selector, :display) }

      it { should have_selector("#version_selector") }
      it { should have_selector("li", content: "King James Version (KJV)") }

      subject { render_cell(:version_selector, :display, :reference => Reference.new("gen.1.1.kjv"))}

      it { should have_selector("li.selected", content: "King James Version (KJV)") }

  end
end
