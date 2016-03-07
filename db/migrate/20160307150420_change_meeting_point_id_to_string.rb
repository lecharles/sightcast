class ChangeMeetingPointIdToString < ActiveRecord::Migration
  def change
    remove_column :sightcasts, :meeting_point_id, :integer
    add_column :sightcasts, :meeting_point_id, :string
  end
end
