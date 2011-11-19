require 'spec_helper'

describe BookSelectorCell do
#  use_vcr_cassette("book_selector_cell")
  context "rendering display" do
    subject { render_cell(:book_selector, :display) }

    it { should have_selector("#book_selector") }
    it { should have_selector("#chapter_selector") }

    subject { render_cell(:book_selector, :display, :reference => Reference.new("gen.1.1.kjv"))}

    it {should have_selector("#book_selector li.selected", :content => "Genesis")}
    it {should have_selector("#chapter_selector li.selected", :content => "1")}
  end
end
