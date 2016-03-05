class User < ActiveRecord::Base
  authenticates_with_sorcery!

  has_many :sightcasts_as_host, :class_name => :Sightcast
  has_and_belongs_to_many :sightcasts

  validates :username, length: { minimum: 6 }, if: -> { new_record? || changes["username"] }
  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes["password"] }
  validates :password, confirmation: true, if: -> { new_record? || changes["password"] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes["password"] }

  validates :username, uniqueness: true
  validates :email, uniqueness: true
end
