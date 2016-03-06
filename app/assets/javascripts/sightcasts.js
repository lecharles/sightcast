var UID_USER = "external";
var CASTER = false;

$(document).on('ready page:load', function() {
  if($('div.show_sightcast').length) {
    if (window.location.protocol === 'file:') { alert('your project must be served from a webserver and not from the file system'); }

    AUTH_URL = 'http://localhost:3000/tokens/get_token?uid=';
    if (CASTER) {
      // Define the optional parameters
      options = {
          debugLevel : 1,
          displayName : UID_USER,
          defaultStyle: true,
          legacy: false
      },
      initializeRtcc = function(token) {
        rtcc = new Rtcc('5vx1l3kvxfd3', token, 'internal', options);
        // rtcc.onDriverNotStarted = function (downloadUrl) {
        //   var answer = confirm('Click OK to download and install the Rtcc client.');
        //   if (answer === true) { window.location = downloadUrl; }
        // };
        rtcc.on('cloud.sip.ok', function() {
          $('#connection_status').html('Connection Status: Connected as host!!');
          $('#create_meeting_point').css('display', 'block');
        });

        rtcc.on('cloud.loggedastheotheruser', function() {
          getToken(UID_USER, function (token){
              rtcc.setToken(token);
              rtcc.authenticate(1);
          });
        });

        rtcc.on('meetingpoint.create.success', function() {
          $('#meeting_point_id_display').val(meetingPoint.id);
          $('#host_meeting_point').css('display', 'block');
        });

        rtcc.on('meetingpoint.host.success', function() {
          meetingPoint.autoaccept_mode();
        });

        // rtcc.onConnectionHandler = function(message, code) {
        //   if (window.console) { console.log('Connection Handler : ' + message + ' ' + code); }
        //   switch(message) {
        //     case 'connectedRtccDriver':
        //       realTimeClient = 'RtccDriver';
        //       break;
        //     case 'connectedWebRTC':
        //       realTimeClient = 'WebRTC';
        //       break;
        //     case 'sipOK':
        //       // JQUERY TIME
        //       break;
        //
        //     case 'loggedasotheruser':
        //       // force connection, kick other logged users
        //       getToken(UID_USER, function (token){
        //           rtcc.setToken(token);
        //           rtcc.authenticate(1);
        //       });
        //       break;
        //     case 'disconnectedRtccDriver':
        //       getToken(UID_USER, function (token){
        //           rtcc.setToken(token);
        //       });
        //       break;
        //   }
        //
        // };
        // rtcc.onConfCallHandler = function(action, obj) {
        //
        // };
        rtcc.initialize();
      },
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

      },

      init = function() {
        getToken(UID_USER);
      },

      create = function() {
        var options = {
          location : "on the cloud",
          startDate : Math.round(new Date().valueOf()/1000) + 100,
          stopDate  : Math.round(new Date().valueOf()/1000) + 200,
        }
        meetingPoint = rtcc.createMeetingPoint('scheduled', options);
      },

      host = function() {
        if (meetingPoint) {
          meetingPoint.host();
          // JSON
        }
        else {
          alert("Create meeting point first!");
        }
      };

      init();

    }

    else {
      alert(UID_USER);
    }
  }


});


function isCaster(sightcaster) {
  CASTER = sightcaster;
}
function getUsername(username) {
  UID_USER = username;
}
