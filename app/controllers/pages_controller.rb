class PagesController < ApplicationController
  def home
  end

  def index
    @sightcasts = Sightcast.all.paginate(page: params[:page], per_page: 6)
    @users = User.all
  end

  def team
  end
end
