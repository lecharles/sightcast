class CreateUsersSightcastsJoinTable < ActiveRecord::Migration
  def change
    create_table :users_sightcasts, id: false do |t|
      t.integer :user_id
      t.integer :sightcast_id
    end
    add_index :users_sightcasts, :user_id
    add_index :users_sightcasts, :sightcast_id
  end

end
