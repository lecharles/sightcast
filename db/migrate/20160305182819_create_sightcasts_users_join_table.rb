class CreateSightcastsUsersJoinTable < ActiveRecord::Migration
  def change
    create_table :sightcasts_users, id: false do |t|
      t.integer :user_id
      t.integer :sightcast_id
    end
    
    add_index :sightcasts_users, :user_id
    add_index :sightcasts_users, :sightcast_id

    drop_table :users_sightcasts
  end
end
