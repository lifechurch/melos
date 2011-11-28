class CreateBetaRegistrations < ActiveRecord::Migration
  def change
    create_table :beta_registrations do |t|
      t.string :username

      t.timestamps
    end
  end
end
