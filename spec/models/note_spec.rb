require 'spec_helper'

describe Note do
  # use_vcr_cassette "note"

  before :all do
    @auth = Hashie::Mash.new( { user_id: 4163177,
               username: "testuser",
               password: "tenders"
            } )
  end

  describe "#initialize" do
    it "creates an instance of Note with a Title" do
      @note = Note.new({ title: "Tester" })
      @note.class.should == Note
      @note.title.should == "Tester"
    end    
  end
  
  describe "to_param" do
    it "returns the Note ID" do
      @note = Note.find('935835', @auth) 
      @note.to_param.should == '935835'
    end
  end
  
  describe ".find" do
    it 'returns true after finding a Note' do
      @note = Note.find('935835', @auth) 
      @note.title.should == 'Note Title'
      @note.content.should == 'Note Content'
      @note.version.osis.should == 'kjv'
      @note.references.first.osis.should == 'gen.1.1.kjv'
      @note.user_status.should == 'public'
    end

    it 'returns false if Note was not found' do
      @note = Note.find('0', @auth) 
      @note.should be_false
    end        
  end
  
  describe ".all" do
    it 'returns true after finding all Notes for the user' do
      @notes = Note.for_user(@auth.user_id, @auth).count.should > 0
    end

    it 'returns true after finding all Notes' do
      @notes = Note.for_user(@auth.user_id, nil).count.should > 0
    end
  end

  describe ".create" do
    it 'creates a note and returns the correct response' do
      @note = Note.new( title: "My New Note", content: "Some Content", references: [Reference.new("gen.1.1.kjv")], version: Version.find("kjv"), auth: @auth )
      # @note.auth = @auth
      @response = @note.create

      @note.id.to_i.should > 0
      @note.version.class.should == Version
      @note.references.first.class.should == Reference

      Note.find(@note.id, @auth).should be_true
    end
  end

  describe ".update" do
    it 'updates a note and returns the correct response' do
      @note = Note.for_user(@auth.user_id, @auth).first()
      @response = @note.update(title: "Updated New Note", content: "Updated Some Content", references: [Reference.new("gen.1.1")], version: Version.find("kjv"))

      @response.should be_true
      @note.id.to_i.should > 0
      @note.version.class.should == Version
      @note.references.first.class.should == Reference
    end
  end

  describe ".destroy" do
    it 'deletes a note and returns the correct response' do
      @note = Note.for_user(@auth.user_id, @auth).first()
      @note.destroy.should be_true
    end
  end

  describe ".build_object" do
    it 'build a Note object from a passed response' do
      @note_id = Note.for_user(@auth.user_id, @auth).last.id
      response = YvApi.get('notes/view', {:id => @note_id, :auth => @auth} ) do |errors|
        @errors = errors.map { |e| e["error"] }
      end
      @errors.should be_nil
      Note.build_object(response, @auth).class.should == Note
    end
  end

  describe ".build_objects" do
    it 'build an array of Note objects from a passed response' do
      response = YvApi.get('notes/items', {:user_id => @auth.user_id, :auth => @auth} ) do |errors|
        @errors = errors.map { |e| e["error"] }
      end
      @errors.should be_nil
      Note.build_objects(response.notes, @auth).each do |note|
        note.class.should == Note
      end
    end
  end

end
