class AddMeetingPointIdToSightcasts < ActiveRecord::Migration
  def change
    add_column :sightcasts, :meeting_point_id, :integer
  end
end
