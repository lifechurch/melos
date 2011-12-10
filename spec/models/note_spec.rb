require 'spec_helper'

describe Note do
  # use_vcr_cassette "note"

  before :all do
    @testuser = ensure_user({ email: "testuser@youversion.com", username: "testuser", password: "tenders", agree: true, verified: true, locale: "en_US" })
    @auth = Hashie::Mash.new({user_id: @testuser.id, username: "testuser", password: "tenders"})
    @valid_attributes = {title: "My New Note", content: "Some Content", reference: "gen.2.1.kjv", user_status: "public", auth: @auth }
  end

  
  describe ".save" do
    it 'creates a new note and returns the correct response' do
      @note = Note.new( title: "My New Note", content: "Some Content", reference: "gen.1.1.kjv", auth: @auth )
      @response = @note.save
      @response.should be_true
      @note.version.should be_a Version
      @note.reference_list.should be_a ReferenceList
      @note.reference_list.first.should be_a Reference
    end
  end

  describe ".find" do
    it 'returns true after finding a Note' do
      @valid_note = Note.new(@valid_attributes)
      result = @valid_note.save
      result.should be_true
      @note = Note.find(@valid_note.id, @auth) 
      @note.title.should == 'My New Note'
      @note.content.should == 'Some Content'
      @note.version.osis.should == 'kjv'
      @note.reference_list.first.osis.should == 'gen.2.1.kjv'
      @note.user_status.should == 'public'
    end

    it 'returns false if Note was not found' do
      lambda { Note.find('0', @auth) }.should  raise_error(YouVersion::ResourceError)
    end        
  end
  
  describe ".all" do
    it 'returns true after finding all Notes for the user' do
      @notes = Note.for_user(@auth.user_id, @auth)
      @notes.count.should > 0
      @notes.should be_a ResourceList
    end

    it 'returns true after finding all Notes' do
      @notes = Note.for_user(@auth.user_id).count.should > 0
    end
  end


  describe ".update" do
    it 'updates a note and returns the correct response' do
      @note = Note.for_user(@auth.user_id, @auth).first()
      @response = @note.update(title: "Updated New Note", content: "Updated Some Content", reference: "gen.1.1.asv", auth: @auth)
      @response.should be_true
      @note.id.to_i.should > 0
      @note.version.class.should == Version
      @note.reference_list.first.class.should == Reference
    end
  end

  describe ".destroy" do
    it 'deletes a note and returns the correct response' do
      @note = Note.new( title: "My New Note", content: "Some Content", reference: "gen.2.1.kjv", auth: @auth )
      @note.save.should be_true
      result = Note.destroy(@note.id, @auth)
      result.should be_true
    end
  end

#   describe ".build_object" do
#     it 'build a Note object from a passed response' do
#       @note_id = Note.for_user(@auth.user_id, @auth).last.id
#       response = YvApi.get('notes/view', {:id => @note_id, :auth => @auth} ) do |errors|
#         @errors = errors.map { |e| e["error"] }
#       end
#       @errors.should be_nil
#       Note.build_object(response, @auth).class.should == Note
#     end
#   end
# 
#   describe ".build_objects" do
#     it 'build an array of Note objects from a passed response' do
#       response = YvApi.get('notes/items', {:user_id => @auth.user_id, :auth => @auth} ) do |errors|
#         @errors = errors.map { |e| e["error"] }
#       end
#       @errors.should be_nil
#       Note.build_objects(response.notes, @auth).each do |note|
#         note.class.should == Note
#       end
#     end
#   end

end
