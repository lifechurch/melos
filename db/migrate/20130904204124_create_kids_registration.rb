class CreateKidsRegistration < ActiveRecord::Migration
  def change
    create_table :kids_registrations do |t|
      t.string :phone_number, limit: 15 
      t.timestamps
    end
  end
end