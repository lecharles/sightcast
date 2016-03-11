class AddNumViewersToSightcastModel < ActiveRecord::Migration
  def change
    add_column :sightcasts, :num_viewers, :integer
  end
end
