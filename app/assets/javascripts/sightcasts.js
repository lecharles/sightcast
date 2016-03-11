$(document).on('ready page:load', function() {
  if($('div.show_sightcast').length) {
    setTimeout(initRPi, 100);

    if (window.location.protocol === 'file:') { alert('your project must be served from a webserver and not from the file system'); }
//IF YOU ARE A HOST:

    $('#video-container').css('opacity', '0.0');
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
          $('#sightcast_meeting_point_id').val(meetingPoint.id);
          $('#edit_sightcast_' + SC_ID).submit();
        });

        rtcc.on('meetingpoint.host.success', function() {
          meetingPoint.autoaccept_mode();
        });
        rtcc.on('call.create', defineCallListenersHost )
        rtcc.initialize();
      },



      defineCallListenersHost = function(hostCall) {
        sightcastCall = hostCall;
        hostCall.on('active', function() {
          $('#sightcastwaitdiv').fadeOut(0);
          $('#video-container').css('opacity', '1.0');
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
      },
      toggleView = function(whichView, speakerId) {
        if (whichView === 'RPi') {
          $('#video-container').css('opacity', '0.0')
          $('#vmjpeg_dest').css('display', 'block');
          sightcastCall.sendInbandMessage("RPi");
        }
        else if (whichView === 'SightCall') {
          $('#vmjpeg_dest').css('display', 'none');
          $('#video-container').css('opacity', '1.0');
          sightcastCall.sendInbandMessage("SightCall");
          sightcastCall.lockActiveSpeaker(speakerId);

        }
      },

      contains = function(array, obj) {
         for (var i = 0; i < array.length; i++) {
             if (array[i] === obj) {
                 return true;
             }
         }
         return false;
      },

      setSightcastControlButtons = function(participants) {

        $('#sightcast-control').html(""); //clear each time
        buttonString = '<button class=" btn btn-primary control-button" onclick="toggleView(' + "'RPi'" + ', 0, 0)">RPi</button>';
        $('#sightcast-control').append(buttonString);
        for ( var i = 0; i < participants.length; i++ ) {

          displayName = participants[i].displayName.replace(/['"]+/g, '');
          console.log("CAMERAS: " + CAMERA_ARRAY);
          console.log("PARTICIPANT: " + participants[i].displayName)
          console.log("UID CASTER: " + UID_CASTER);
          if ( displayName === UID_CASTER ) {
            buttonString = '<button class=" btn btn-primary control-button" onclick="toggleView(' + "'SightCall'" + ', ' + participants[i].id + ')">' + displayName + '</button>';
            $('#sightcast-control').append(buttonString);
          } else if ( contains(CAMERA_ARRAY, displayName) ) {
            buttonString = '<button class=" btn btn-primary control-button" onclick="toggleView(' + "'SightCall'" + ', ' + participants[i].id + ')">' + displayName + '</button>';
            $('#sightcast-control').append(buttonString);
          }
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
        displayName : "External Viewer " + 1000000 * Math.random(),
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

      defineCallListenersViewer = function(viewer_call) {
        sightcastCall = viewer_call
        viewer_call.on('active', function() {
          viewer_call.videoStop();
          viewer_call.audioMute();
          $('#sightcastwaitdiv').fadeOut(0);
          $('#video-container').css('opacity', '1.0');


        });
        viewer_call.on('call.create', function() {
          viewer_call.videoStop();
          viewer_call.audioMute();

        });
        viewer_call.on('inband.message.receive', function(theMessage) {
          toggleViewer(theMessage)
        });

      },
      initViewer = function() {
        initializeRtcc();
      },
      toggleViewer = function(message) {
        if (message === 'RPi') {
          $('#video-container').css('opacity', '0.0');
          $('#vmjpeg_dest').css('display', 'block');
        }
        else if (message === 'SightCall') {
          $('#vmjpeg_dest').css('display', 'none');
          $('#video-container').css('opacity', '1.0');

        }

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
      CAMERA_ARRAY = []
      for (var i = 0; i< data.cameras.length; i++) {
        CAMERA_ARRAY.push(data.cameras[i].username);

        $('#camera_people_list').append($('<li />').append(data.cameras[i].username));
      }
      $('#camera_people').css('display', 'block');
    });
  });

});
