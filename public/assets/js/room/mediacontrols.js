import {
  log,
  keys,
  stringify,
  getElement,
  getFirstChild,
  removeChildren,
  getLastChild,
  countChildren,
} from "../utils.js";

let localCameraMuted = false;
let localMicrophoneMuted = false;

export const muteMicrophone = (connected, local = false) => {
  if (!localMicrophoneMuted) {
    localMicrophoneMuted = true;
    connected.localParticipant.audioTracks.forEach((publication) => {
      publication.track.disable();
    });
    return localMicrophoneMuted;
  } else {
    localMicrophoneMuted = false;
    connected.localParticipant.audioTracks.forEach((publication) => {
      publication.track.enable();
    });
    return localMicrophoneMuted;
  }
};

export const muteCamera = (connected, local = false) => {
  const createLocalVideoTrack = Twilio.Video.createLocalVideoTrack;

  if (!localCameraMuted) {
    return muteLocalVideoDevice(connected);
  } else {
    return unmuteLocalVideoDevice(connected);
  }
};

function unmuteLocalVideoDevice(connected) {
  localCameraMuted = false;

  connected.localParticipant.videoTracks.forEach((publication) => {
    publication.track.enable();
  });

  return localCameraMuted;
}

function muteLocalVideoDevice(connected) {
  log(`\n\tLocal Participant has muted video`);
  localCameraMuted = true;
  connected.localParticipant.videoTracks.forEach((publication) => {
    publication.track.disable();
  });
  return localCameraMuted;
}
