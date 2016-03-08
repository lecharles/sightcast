$(document).on('ready page:load', function() {
  if($('div.show_sightcast').length) {
    if (window.location.protocol === 'file:') { alert('your project must be served from a webserver and not from the file system'); }
//IF YOU ARE A HOST:
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
          $('#invite_cameras').css('display', 'block');
          $('#camera_people').css('display', 'block');
          $('#sightcast_meeting_point_id').val(meetingPoint.id);
          $('#edit_sightcast_' + SC_ID).submit();
        });

        rtcc.on('meetingpoint.host.success', function() {
          meetingPoint.autoaccept_mode();
        });
        rtcc.initialize();
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
      initializeRtcc= function() {
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
