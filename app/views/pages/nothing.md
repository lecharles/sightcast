<% if current_user == sightcast.host %>
  <p><%= link_to "Start Sightcast", sightcast_path(sightcast) %></p>
<% else %>
  <p><%= link_to "View Sightcast", sightcast_path(sightcast) %></p>
<% end %>

<%= will_paginate @sightcasts, renderer: BootstrapPagination::Rails %>
</div>
.paginate(page: params[:page], per_page: 6)
