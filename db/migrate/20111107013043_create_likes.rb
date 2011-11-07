class CreateLikes < ActiveRecord::Migration
  def change
    create_table :likes do |t|

      t.timestamps
    end
  end
end
