class CreateSightcasts < ActiveRecord::Migration
  def change
    create_table :sightcasts do |t|
      t.string :title
      t.text :description
      t.boolean :active
      t.datetime :scheduled_at
      t.integer :viewers
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
