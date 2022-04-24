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
let localRecorderEnabled = false;

export const muteMicrophone = (connected, local = false) => {
  if (!localMicrophoneMuted) {
    return muteLocalMicrophone(connected);
  } else {
    return unmuteLocalMicrophone(connected);
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

export const recordVideo = () => {
  if (!localRecorderEnabled) {
    localRecorderEnabled = true;
  } else {
    localRecorderEnabled = false;
  }
  return localRecorderEnabled;
};

export const shareScreen = () => {};

export const snapPicture = () => {};

export const disconnect = (connected) => connected.disconnect();

function unmuteLocalMicrophone(connected) {
  localMicrophoneMuted = false;
  log(`\n\tLocal Participant has unmuted microphone`);
  connected.localParticipant.audioTracks.forEach((publication) => {
    publication.track.enable();
  });
  return localMicrophoneMuted;
}

function muteLocalMicrophone(connected) {
  log(`\n\tLocal Participant has muted microphone`);
  localMicrophoneMuted = true;
  connected.localParticipant.audioTracks.forEach((publication) => {
    publication.track.disable();
  });
  return localMicrophoneMuted;
}

function unmuteLocalVideoDevice(connected) {
  localCameraMuted = false;
  log(`\n\tLocal Participant has unmuted video`);
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
