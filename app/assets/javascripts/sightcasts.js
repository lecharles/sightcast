var UID_USER = "external";
var UID_CASTER;
var CASTER = false;
var APP_ID;
var SC_ID;

$(document).on('ready page:load', function() {
  if($('div.show_sightcast').length) {
    if (window.location.protocol === 'file:') { alert('your project must be served from a webserver and not from the file system'); }

    AUTH_URL = 'http://localhost:3000/tokens/get_token?uid=';
    if (CASTER) {
      $('#connection_status').html("Connecting as host!!");
      // Define the optional parameters
      rtcc = {},
      meetingPoint = "",
      options = {
          debugLevel : 1,
          displayName : UID_USER,
          defaultStyle: true,
          container : 'video-container',
          legacy: false
      },
      initializeRtcc = function(token) {
        rtcc = new Rtcc(APP_ID, token, 'internal', options);


  rtcc.on('plugin.missing', function(downloadUrl) {
             window.open(downloadUrl);
         });

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
          $('#sightcast_meeting_point_id').val(meetingPoint.id);
          $('#edit_sightcast_' + SC_ID).submit();
        });

        rtcc.on('meetingpoint.host.success', function() {
          meetingPoint.autoaccept_mode();
        });
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
      $('#connection_status').html("Connecting as viewer!!");
      rtcc = {},
      meetingPointAttendee = "",
      options = {
        debugLevel : 1,
        displayName : "External Viewer",
        defaultStyle: true,
        container : 'video-container',
        legacy: false
      }
      initializeRtccViewer = function() {
        rtcc = new Rtcc(APP_ID, UID_CASTER, 'external', options);

        rtcc.on('plugin.missing', function(downloadUrl) {
           window.open(downloadUrl);
       });
        rtcc.on('cloud.sip.ok', function() {
          $('#connection_status').html('Connection Status: Connected as viewer!!');
          $('#join_meeting_point').css('display', 'block');
        });
        rtcc.on('cloud.loggedastheotheruser', function() {
          getToken(UID_USER, function (token){
            rtcc.authenticate(1);
          });
        });

        rtcc.on('call.create', defineCallListenersViewer);

        rtcc.initialize();
      },
      defineCallListenersViewer = function(viewer_call) {
        viewer_call.on('active', function() {
          viewer_call.videoStop();
          viewer_call.audioMute();
        });
      },
      initViewer = function() {
        initializeRtccViewer();
      },
      joinViewer = function() {
        var id = $('#meeting_point_id').val();
        rtcc.joinConfCall(id);
      };
      initViewer();
    }
  }
  $('#edit_sightcast_' + SC_ID).on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      url: $(this).attr('action'),
      type: $(this).attr('method'),
      dataType: 'html',
      data: $(this).serialize()

    });
  });

});


function isCaster(sightcaster) {
  CASTER = sightcaster;
}
function getUsername(username) {
  UID_USER = username;
}
function getCasterName(castername) {
  UID_CASTER = castername;
}
function getAppId(appId) {
  APP_ID = appId;
}
function getSightCastId(sightCastId) {
  SC_ID = sightCastId;
}
