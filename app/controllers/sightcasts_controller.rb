class SightcastsController < ApplicationController
  def index
    @sightcasts = Sightcast.all
    # .where(active: true)
  end

  def new
    @sightcast = Sightcast.new
  end

  def show
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end

end
