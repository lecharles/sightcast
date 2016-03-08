//Authenticating ALL Sightcast Users (Host & Camera) on Sightcall's Cloud via getToken:

getToken = function(uid, callback) {
  var xhr;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xhr = new XMLHttpRequest();
  }

  else {  // code for IE6, IE5
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      response = xhr.responseText;
      try {
        responseJson = JSON.parse(response);
      }
      catch(e) {
        // ERRORS
        $('#error-content').html(e.message + '<br />' + e.stack + '<br />Response: ' + response);
        $('#error').css('display', 'block');
      }

      if (responseJson.error) {
        // ERRORS
        $('#error-content').html('error code:' + responseJson.error + '<br />Description:' + responseJson.error_description);
        $('#error').css('display', 'block');
      }

      else {
        token = responseJson.data;
        if (typeof callback === "function") {
          callback(token);
        }
        else {
          initializeRtcc(token);
        }
      }
    }

    else if (xhr.readyState === 4 & xhr.status !== 200) {
      response = xhr.responseText;
      console.log(response);
      // JSON
      $('#error-content').html(response);
      $('#error').css('display', 'block');
    }
  };
  xhr.open('GET', AUTH_URL + uid, true);
  xhr.send();
};
