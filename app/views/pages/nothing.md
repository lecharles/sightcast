<% if current_user == sightcast.host %>
  <p><%= link_to "Start Sightcast", sightcast_path(sightcast) %></p>
<% else %>
  <p><%= link_to "View Sightcast", sightcast_path(sightcast) %></p>
<% end %>
