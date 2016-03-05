class Sightcast < ActiveRecord::Base
  belongs_to :host, :class_name => :User, :foreign_key => 'user_id'
  has_and_belongs_to_many :users
end
