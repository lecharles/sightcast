$(document).on('ready page:load', function() {
  if($('div.show_sightcast').length) {
    if (window.location.protocol === 'file:') { alert('your project must be served from a webserver and not from the file system'); }

//IF YOU ARE A HOST:
    if (CASTER) {
      var participants = [];

      $('#connection_status').html("Step 1.Connecting....");
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
          $('#connection_status').html(' Step 1.Connected as host.');
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
          $('#invite_cameras').css('display', 'block');
          $('#camera_people').css('display', 'block');
          $('#sightcast_meeting_point_id').val(meetingPoint.id);
          $('#edit_sightcast_' + SC_ID).submit();
        });

        rtcc.on('meetingpoint.host.success', function() {
          meetingPoint.autoaccept_mode();
        });
        rtcc.on('call.create', defineCallListenersHost )
        rtcc.initialize();
      },

      function toggleRPiView() {
        //This is where the piStream Goes
      }

      function contains(array, obj) {
         for (var i = 0; i < array.length; i++) {
             if (array[i] === obj) {
                 return true;
             }
         }
         return false;
      }

      function setSightcastControlButtons(participants) {
        $('#sightcast-control').html(""); //clear each time
        buttonString = '<button class=" btn btn-primary control-button" onclick="toggleRPiView()">RPi</button>';
        $('#sightcast-control').append(buttonString);
        for ( var i = 0; i < participants.length; i++ ) {
          if ( participants[i].displayName === UID_CASTER ) {
            buttonString = '<button class=" btn btn-primary control-button" onclick="sightcastCall.lockActiveSpeaker(' + participants[i].id + ')">' + participants[i].displayName + '</button>';
            $('#sightcast-control').append(buttonString);
          } else if ( contains(CAMERA_ARRAY, participants[i].displayName) ) {
            buttonString = '<button class=" btn btn-primary control-button" onclick="sightcastCall.lockActiveSpeaker(' + participants[i].id + ')">' + participants[i].displayName + '</button>';
            $('#sightcast-control').append(buttonString);
          }
        }
      }

      defineCallListenersHost = function(hostCall) {
        sightcastCall = hostCall;
        hostCall.on('active', function() {
          $('#sightcastwaitdiv').fadeOut(0);
          $('#video-container').fadeIn(3000);
          $('#sightcast-control').css('display', 'block');
        });
        hostCall.on('conference.participants', function(allParticipants) {
          participants = allParticipants.participants;
          setSightcastControlButtons(participants);
        });
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

//IF YOU ARE A CAMERA
    else if (CAMERA) {
      $('#connection_status').html("Connecting as CAMERA!!");
      rtcc = {},
      meetingPoint = "",
      options = {
          debugLevel : 1,
          displayName : UID_USER,
          defaultStyle: true,
          legacy: false
      },
      initializeRtcc = function(token) {
        rtcc = new Rtcc(APP_ID, token, 'internal', options);
        rtcc.on('plugin.missing', function(downloadUrl) {
            window.open(downloadUrl);
        });

        rtcc.on('cloud.sip.ok', function() {
          $('#connection_status').html('Connection Status: Connected as Camera!!');
          $('#mobile-camera-id').attr('href', 'sightcall://?mode=joininternal&appid=' + APP_ID + '&token=' + token + '&mpid=' + MPID + '&displayname=' + UID_USER + '&buttons=019&videoout=rear&videofull=out&videosmall=in');
          $('#mobile-camera').css('display', 'block');
        });

        rtcc.on('cloud.loggedastheotheruser', function() {
          getToken(UID_USER, function (token){
              rtcc.setToken(token);
              rtcc.authenticate(1);
          });
        });

        rtcc.initialize();
      },

      initCamera = function() {
        getToken(UID_USER);
      };

      initCamera();
    }

//IF YOU ARE A VIEWER:

    else {
      $('#connection_status').html("Connecting...");

      rtcc = {},

      options = {
        debugLevel : 1,
        displayName : "External Viewer",
        defaultStyle: true,
        container: 'video-container',
        legacy: false
      },

      initializeRtcc = function() {
        rtcc = new Rtcc(APP_ID, UID_CASTER, 'external', options);
        // Call if the RtccDriver is not running on the client computer and if the browser is not WebRTC-capable
        rtcc.onRtccDriverNotStarted = function (downloadUrl) {
            var answer = confirm('Click OK to download and install the Rtcc client.');
            if (answer === true) { window.location = downloadUrl; }
        };
        rtcc.on('plugin.missing', function(downloadUrl) {
           window.open(downloadUrl);
        });

        // development
        rtcc.on('cloud.sip.ok', function() {
          $('#connection_status').html('Connection Status: Connected as viewer!!');
          $('#join_meeting_point').css('display', 'block');
        });
        rtcc.on('cloud.loggedastheotheruser', function() {
          rtcc.authenticate(1);
        });

        rtcc.on('call.create', defineCallListenersViewer);

        rtcc.initialize();
      },

      initViewer = function() {
        initializeRtcc("External Viewer");
      },
      joinViewer = function() {
        var id = $('#meeting_point_id').val();
        rtcc.joinConfCall(id);
      },

      defineCallListenersViewer = function(viewer_call) {
        viewer_call.on('active', function() {
          viewer_call.videoStop();
          viewer_call.audioMute();
          $('#sightcastwaitdiv').fadeOut(0);
          $('#video-container').fadeIn(3000);

        });
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
  $('#add_camera').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      url: $(this).attr('action'),
      type: $(this).attr('method'),
      dataType: 'json',
      data: $(this).serialize()

    }).done(function(data) {
      $('#add_camera_message').html(data.message);
      $('#camera_people_list').html('');
      for (var i = 0; i< data.cameras.length; i++) {
        $('#camera_people_list').append($('<li />').append(data.cameras[i].username));
      }
    });
  });

});
