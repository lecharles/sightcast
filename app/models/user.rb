class User < ActiveRecord::Base
  authenticates_with_sorcery!

  has_many :sightcasts_as_host, :class_name => :Sightcast, dependent: :destroy
  has_and_belongs_to_many :sightcasts

  validates :username, length: { minimum: 6 }, if: -> { new_record? || changes["username"] }
  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes["password"] }
  validates :password, confirmation: true, if: -> { new_record? || changes["password"] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes["password"] }

  validates :username, uniqueness: true
  validates :email, uniqueness: true

  has_attached_file :avatar, styles: { medium: "300x300#{}"}
  # :thumb => "100x100>"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\Z/
end
