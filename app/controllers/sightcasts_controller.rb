class SightcastsController < ApplicationController
  def index
    @sightcasts = Sightcast.all
    # .where(active: true)
  end

  def new
    @sightcast = Sightcast.new
  end

  def show
    @sightcaster = false;
    @sightcast = Sightcast.find(params[:id])
    if params[:mp_id]
      @sightcast.saveMeetingPoint(params[:mp_id])
    end
    @caster = @sightcast.host.username
    puts "CASTER: #{@caster}"
    if current_user
      if current_user == @sightcast.host
        @sightcaster = true
      end
    end
  end

  def create
    @sightcast = Sightcast.new(sightcast_params)
    @sightcast.active = false
    @sightcast.host = current_user
    if @sightcast.save
      redirect_to sightcasts_path, notice: "Sightcast created"
    else
      redirect_to new_sightcast_path(@sightcast), notice: "Error saving new sightcast"
    end
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private
  def sightcast_params
    params.require(:sightcast).permit(:title, :description, :scheduled_at)
  end

end
