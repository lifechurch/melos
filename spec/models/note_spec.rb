require 'spec_helper'

describe Note do
  use_vcr_cassette "note"

  before :all do
    @auth = { id: 4163176,
               username: "testuser2",
               password: "tenders"
            }
  end
  
  describe ".find" do
    it 'returns true after finding a Note' do
      @note = Note.find('935850', @auth) 
      @note.title.should = 'Public Note'
      @note.version.should = 'kjv'
      @note.reference.should = 'Gen.1.1'
      @note.user_status.should = 'public'
    end

    it 'returns false if Note was not found' do
      @note = Note.find('0', @auth) 
      @note.should be_false
    end        
  end
  
  describe ".find_by_search" do
    @notes = Note.find_by_search('Title', @auth)
    
  
  
  end
  
end
