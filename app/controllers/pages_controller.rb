class PagesController < ApplicationController
  def home
  end

  def index
    @sightcasts = Sightcast.all
    @users = User.all
  end
end
