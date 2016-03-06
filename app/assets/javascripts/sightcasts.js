var UID_USER;

$(document).on('ready page:load', function() {
  if (window.location.protocol === 'file:') { alert('your project must be served from a webserver and not from the file system'); }
  AUTH_URL = 'https://young-cove-84257.herokuapp.com/gettoken?uid=',
  meetingPoint,
  options = {
    debugLevel : 1,
    displayName = UID_USER,
    defaultStyle: true,
    legacy: false
  }
});

function sendUserInfo(username) {
  UID_USER = username;
}
