class SightcastsController < ApplicationController
  def index
    @sightcasts = Sightcast.all
    # .where(active: true)
  end

  def new
    @sightcast = Sightcast.new
  end

  def show
    @sightcaster = false
    @camera = false
    @sightcast = Sightcast.find(params[:id])
    @caster = @sightcast.host.username
    @cameras = []
    @sightcast.users.each do |camera|
      @cameras << camera.username
    end
    if current_user
      if current_user == @sightcast.host
        @sightcaster = true
      elsif @sightcast.users.where(id: current_user.id).length > 0
        @camera = true
      end
    end
    if params[:username]
      @new_camera = User.where(username: params[:username]).first
      if @new_camera
        if @sightcast.users.exists?(@new_camera.id)
          message = "User is already a cameraperson for this sightcast."
        else
          if @sightcast.users << @new_camera
            message =  "Camera added."
          else
            message = "Error adding camera to database."
          end

        end

      else
        message = "Username not found in database"
      end
    end

    respond_to do |format|
      format.html
      msg = { :cameras => @sightcast.users, :message => message }
      format.json { render :json => msg }
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
    @sightcast = Sightcast.find(params[:id])

    if @sightcast.update_attributes(sightcast_params)
      redirect_to sightcast_path(@sightcast)
    else
      redirect_to sightcast_path(@sightcast)
    end
  end

  def destroy
  end

  private
  def sightcast_params
    params.require(:sightcast).permit(:title, :description, :scheduled_at, :meeting_point_id)
  end

end
