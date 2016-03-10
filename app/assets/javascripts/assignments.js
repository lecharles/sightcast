var token;
var UID_USER = "external";
var UID_CASTER;
var CASTER = false;
var APP_ID;
var SC_ID;
var MPID;
var CAMERA;
var CAMERA_ARRAY;

var sightcastCall;

//
AUTH_URL = 'https://salty-brook-83534.herokuapp.com/tokens/get_token?uid=';
// AUTH_URL = 'http://localhost:3000/tokens/get_token?uid='

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
function getMeetingPointId(meeting_point_id) {
    MPID = meeting_point_id;
}
function isCamera(camera) {
  CAMERA = camera;
}
function getCameraArray(cameraArray) {
  CAMERA_ARRAY = cameraArray;
}
