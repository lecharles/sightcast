class SightcastsController < ApplicationController
  def index


    @active_sightcasts = Sightcast.where(active: true)
    @scheduled_sightcasts = Sightcast.where("scheduled_at > ?", Time.now - 1.hours).order(:scheduled_at)


    # .paginate for per page views
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
          message = "User is already a SightCam for this Sightcast."
        else
          if @sightcast.users << @new_camera
            message =  "SightCam added."
          else
            message = "Error adding SightCam to database."
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
    puts "PARAMS: #{sightcast_params}"
    @sightcast = Sightcast.new(sightcast_params)
    @sightcast.active = false
    @sightcast.host = current_user
    if @sightcast.save
      redirect_to sightcasts_path, notice: "Sightcast created"
    else
      redirect_to new_sightcast_path(@sightcast), notice: "Error saving new Sightcast"
    end
  end

  def edit
  end

  def update
    @sightcast = Sightcast.find(params[:id])
    if (params[:sightcast][:meeting_point_id] != @sightcast.meeting_point_id)
      @sightcast.users.delete(@sightcast.users.all)
      @sightcast.viewers = 0
    end

    if @sightcast.update_attributes(sightcast_params)
      message = "Sightcast updated."
    else
      message = "Problem updating Sightcast."
    end

    respond_to do |format|
      format.html
      msg = { :num_viewers => params[:sightcast][:viewers], :message => message }
      format.json { render :json => msg }
    end
  end

  def destroy
    @sightcast = Sightcast.find(params[:id])
    if @sightcast.destroy
      redirect_to sightcasts_path, notice: "Sightcast deleted"
    else
      redirect_to sightcasts_path, notice: "Problem deleting Sightcast."
    end
  end

  private
  def sightcast_params
    params.require(:sightcast).permit(:title, :description, :scheduled_at, :meeting_point_id, :viewers, :active)
  end

end
