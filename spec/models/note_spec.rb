require 'spec_helper'
:A



describe Note do
  # use_vcr_cassette "note"

  before :all do
    @testuser = ensure_user
    @auth = @testuser.auth
    @valid_attributes = {title: "My New Note", content: "Some Content", reference: "gen.2.1-3.kjv,gen.3.1-5.kjv", user_status: "public", auth: @auth }
  end

  
  describe ".save" do
    it 'creates a new note and returns the correct response' do
      @note = Note.new( title: "My New Note", content: "Some Content", reference: "gen.1.1-3.kjv", auth: @auth )
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
      @note.version.should be_a(Version)
      @note.version.id.should == YvApi::get_usfm_version("kjv")
      @note.reference_list.first.should == Reference.new('gen.2.1.kjv')
      @note.user_status.should == 'public'
    end

    it 'returns false if Note was not found' do
      lambda { Note.find('0', @auth) }.should  raise_error(YouVersion::ResourceError)
    end        
  end
  
  describe ".all" do
    it 'returns true after finding all Notes for the user' do
      @note = Note.new( title: "My New Note", content: "Some Content", reference: "gen.1.1-3.kjv", auth: @auth )
      @response = @note.save
      @response.should be_true
      @notes = Note.for_user(@auth.user_id, auth: @auth)
      @notes.length.should > 0
      @notes.should be_a ResourceList
    end

    it 'returns true after finding all Notes' do
      @notes = Note.for_user(@auth.user_id).length.should > 0
    end
  end


  describe ".update" do
    it 'updates a note and returns the correct response' do
      @note = Note.for_user(@auth.user_id, @auth).first()
      @response = @note.update(title: "Updated New Note", content: "Updated Some Content", reference: "gen.1.1.kjv", auth: @auth)
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
      ## HACK HACK HACK
      result = Note.destroy(@note.id, @auth)
      result.should be_true
    end
  end

  describe "avatars" do
    it "should return the user's avatar with the note" do
      @note = Note.new( title: "My New Note", content: "Some Content", reference: "gen.2.1.kjv", auth: @auth )
      @note.save
      @testuser.notes.first.user_avatar_url.should be_a Hashie::Mash
    end
  end

  describe "for reference" do
    it "should return notes for a reference" do
      @note = Note.new( title: "My New Note", content: "Some Content", reference: "gen.2.1.kjv", auth: @auth )
      @note.save
      # FIXME
      # HACK HACK HACK
      # TODO: This shouldn't need a user id!
      notes = Note.for_reference(Reference.new("gen.2.1.kjv"), user_id: @auth.user_id, auth: @auth)
      notes.should be_a ResourceList
      notes.first.should be_a Note
    end
  end
end
