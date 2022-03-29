import {
  log,
  cap,
  cls,
  addAttribute,
  addHandler,
  getAttribute,
  getElement,
  newElement,
  appendChild,
  removeChildren,
  stringify,
  keys,
} from "../utils.js";

import { muteMicrophone, muteCamera, recordVideo } from "./mediacontrols.js";

// Click Handlers

const addClickHandler = (element, handler) => {
  addHandler(element, "click", handler);
};

// Elements
const roomNameInput = document.querySelector("#room-name-input");
const joinRoomInput = document.querySelector("#join-room-input");
const localVideo = document.querySelector("#local-part");
const remoteVideo = document.querySelector("#remote-parts");
let connected,
  mediaTracks = [];

const joinVideoRoom = async (roomName, token) => {
  // join the video room with the Access Token and the given room name
  const room = await Twilio.Video.connect(token, {
    room: roomName,
    audio: true,
    video: { width: 640 },
  });
  return room;
};

const handleTrackPublication = (trackPublication, participant) => {
  function displayTrack(track) {
    // append this track to the participant's div and render it on the page
    const participantDiv = document.getElementById(participant.identity);
    // track.attach creates an HTMLVideoElement or HTMLAudioElement
    // (depending on the type of track) and adds the video or audio stream
    participantDiv.append(track.attach());
  }

  if (trackPublication.track) {
    displayTrack(trackPublication.track);
  }

  // listen for any new subscriptions to this track publication
  trackPublication.on("subscribed", displayTrack);
};

const handleRemoteParticipants = (participant) => {
  log(`\n\tRemote Participant joined the room:${participant.identity}`);

  // Select parent element
  const parent = getElement("remote-parts");
  const content = newElement("div");
  const controlsPanel = newElement("div");
  const controls = newElement("div");
  const participantParent = newElement("div");
  const recordIcon = newElement("i");
  const stopIcon = newElement("i");

  // create a div for this participant's tracks
  const participantDiv = newElement("div");

  // Add selection attribute
  addAttribute(participantDiv, "id", participant.identity);

  // Add styling attributes
  addAttribute(participantDiv, "class", "remote-video cell small-12");
  addAttribute(recordIcon, "class", "fa-solid fa-circle fa-2x");
  addAttribute(stopIcon, "class", "fa-solid fa-stop fa-2x");
  addAttribute(content, "class", "grid-x");
  addAttribute(controlsPanel, "class", "cell small-12");
  addAttribute(controlsPanel, "id", "remote-controls-panel");
  addAttribute(controls, "id", "remote-media-controls-parent");

  // Prepare parent for single child
  removeChildren(parent);

  // Add element to it's parent
  // appendChild(parent, participantDiv);
  // appendChild(parent, participantParent);
  appendChild(participantParent, participantDiv);
  appendChild(parent, content);
  appendChild(content, participantParent);
  appendChild(content, controlsPanel);
  appendChild(controlsPanel, controls);
  appendChild(controls, recordIcon);
  appendChild(controls, stopIcon);

  // iterate through the participant's published tracks and
  // call `handleTrackPublication` on them
  log(`\n\tHandling Participant: ${participant.identity} tracks`);

  participant.tracks.forEach((trackPublication) => {
    handleTrackPublication(trackPublication, participant);
  });

  // listen for any new track publications
  participant.on("trackPublished", (trackPublication) => {
    function displayTrack(track) {
      // append this track to the participant's div and render it on the page
      const participantDiv = document.getElementById(participant.identity);
      // track.attach creates an HTMLVideoElement or HTMLAudioElement
      // (depending on the type of track) and adds the video or audio stream
      participantDiv.append(track.attach());
    }

    if (trackPublication.track) {
      displayTrack(trackPublication.track);
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
  });

  addClickHandler(participantDiv, (e) => {
    console.log(`\n\t${e} was clicked\n`);
  });

  addClickHandler(recordIcon, (e) => {
    const recordingEnabled = recordVideo();

    if (recordingEnabled) {
      recordIcon.classList.remove("fa-circle");
      recordIcon.classList.add("fa-pause");
      stopIcon.classList.remove("hide");
    } else {
      recordIcon.classList.remove("fa-pause");
      recordIcon.classList.add("fa-circle");
      stopIcon.classList.add("hide");
    }
  });

  addClickHandler(stopIcon, (e) => {
    if (recordIcon.classList.contains("fa-pause")) {
      recordIcon.classList.remove("fa-pause");
      recordIcon.classList.add("fa-circle");
      stopIcon.classList.add("hide");
    }
  });

  stopIcon.classList.add("hide");
};

const handleLocalParticipant = (participant) => {
  log(`\n\tLocal Participant joined the room:${participant.identity}`);

  // select the parent element
  const parent = getElement("local-part");
  const content = newElement("div");
  const controlsPanel = newElement("div");
  const controls = newElement("div");
  const participantParent = newElement("div");
  const videoIcon = newElement("i");
  const microphoneIcon = newElement("i");
  const recordIcon = newElement("i");
  const stopIcon = newElement("i");
  const disconnectIcon = newElement("i");

  // create a div for this participant's tracks
  const participantDiv = newElement("div");

  // Add selection attribute
  addAttribute(participantDiv, "id", participant.identity);

  // Add styling attributes
  addAttribute(videoIcon, "class", "fa-solid fa-video fa-2x");
  addAttribute(videoIcon, "id", "local-video-camera");
  addAttribute(microphoneIcon, "class", "fa-solid fa-microphone fa-2x");
  addAttribute(microphoneIcon, "id", "local-microphone");
  addAttribute(recordIcon, "class", "fa-solid fa-circle fa-2x");
  addAttribute(stopIcon, "class", "fa-solid fa-stop fa-2x");
  addAttribute(disconnectIcon, "class", "fa-solid fa-square-xmark fa-2x");
  addAttribute(content, "class", "grid-x");
  addAttribute(controlsPanel, "class", "cell small-12");
  addAttribute(controlsPanel, "id", "local-controls-panel");
  addAttribute(participantDiv, "class", "local-video cell small-12");
  addAttribute(controls, "id", "local-media-controls-parent");

  // Prepare parent for single child
  removeChildren(parent);

  // Add element to it's parent
  // appendChild(parent, participantParent);
  appendChild(participantParent, participantDiv);
  appendChild(parent, content);
  appendChild(content, participantParent);
  appendChild(content, controlsPanel);
  appendChild(controlsPanel, controls);
  appendChild(controls, videoIcon);
  appendChild(controls, microphoneIcon);
  appendChild(controls, disconnectIcon);
  appendChild(controls, recordIcon);
  appendChild(controls, stopIcon);

  // iterate through the participant's published tracks and
  // call `handleTrackPublication` on them
  log(`\n\tHandling Participant: ${participant.identity} tracks`);
  participant.tracks.forEach((trackPublication) => {
    handleTrackPublication(trackPublication, participant);
  });

  // listen for any new track publications
  participant.on("trackPublished", (trackPublication) => {
    log(`\n\tLocal participant published a track or more`);
    function displayTrack(track) {
      // append this track to the participant's div and render it on the page
      const participantDiv = document.getElementById(participant.identity);
      // track.attach creates an HTMLVideoElement or HTMLAudioElement
      // (depending on the type of track) and adds the video or audio stream
      participantDiv.append(track.attach());
    }

    if (trackPublication.track) {
      displayTrack(trackPublication.track);

      const newObj = {
        pSID: participant.id,
        ...trackPublication.track,
      };

      if (addTrack(newObj)) {
        log(`\n\tAdded Track: ${stringify(mediaTracks)}`);
      }
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
  });

  participant.on("trackStopped", (track) => {
    log(`${keys(track)}\n\tDamn track was disabled`);

    removeById(track.id);
    removeByName(track.name);
  });

  // listen or unpublish events
  participant.tracks.forEach((publication) => {
    publication.on("unsubscribed", () => {
      log(`\n\tLocal participant unsubscribed`);
    });
  });

  addClickHandler(participantDiv, (e) => {
    const target = e.target;
    console.log(`\n\t${target.id || target} was clicked\n`);
  });

  addClickHandler(microphoneIcon, (e) => {
    const muted = muteMicrophone(connected, true);
    const microphoneElement = getElement("local-microphone");

    if (muted) {
      microphoneElement.classList.remove("fa-microphone");
      microphoneElement.classList.add("fa-microphone-slash");
    } else {
      microphoneElement.classList.remove("fa-microphone-slash");
      microphoneElement.classList.add("fa-microphone");
    }
  });

  addClickHandler(videoIcon, (e) => {
    const muted = muteCamera(connected, true);
    const videoElement = getElement("local-video-camera");

    if (muted) {
      log(videoElement.id);
      videoElement.classList.remove("fa-video");
      videoElement.classList.add("fa-video-slash");
    } else {
      log(videoElement.id);
      videoElement.classList.remove("fa-video-slash");
      videoElement.classList.add("fa-video");
    }
  });

  addClickHandler(recordIcon, (e) => {
    const recordingEnabled = recordVideo();

    if (recordingEnabled) {
      recordIcon.classList.remove("fa-circle");
      recordIcon.classList.add("fa-pause");
      stopIcon.classList.remove("hide");
    } else {
      recordIcon.classList.remove("fa-pause");
      recordIcon.classList.add("fa-circle");
      stopIcon.classList.add("hide");
    }
  });

  addClickHandler(stopIcon, (e) => {
    if (recordIcon.classList.contains("fa-pause")) {
      recordIcon.classList.remove("fa-pause");
      recordIcon.classList.add("fa-circle");
      stopIcon.classList.add("hide");
    }
  });

  stopIcon.classList.add("hide");

  document.title = roomNameInput.value;
};

const handleDisconnectedParticipant = (participant) => {
  // stop listening for this participant
  participant.removeAllListeners();
  // remove this participant's div from the page
  const participantDiv = document.getElementById(participant.identity);
  removeById(participant.id);
  if (participantDiv.parentElement.nextElementSibling) {
    participantDiv.parentElement.nextElementSibling.remove();
  }
  participantDiv.remove();
};

const startRoom = () => {
  if (roomNameInput && joinRoomInput) {
    const roomName = roomNameInput.value;
    const token = joinRoomInput.value;

    // log(twl);
    log(`\n\tWelcome to the video room\n`);
    log(`\n\tJoining room ${cap(roomName)} with token\n`);

    joinVideoRoom(roomName, token)
      .then((room) => {
        connected = room;
        handleLocalParticipant(room.localParticipant);
        room.participants.forEach(handleRemoteParticipants);
        room.on("participantConnected", handleRemoteParticipants);
        room.on("participantDisconnected", handleDisconnectedParticipant);
        window.addEventListener("pagehide", () => room.disconnect());
        window.addEventListener("beforeunload", () => room.disconnect());
      })
      .catch((err) => {
        log(err);
        return;
      });
  }
};

startRoom();

function addTrack(data) {
  const mt = findById(data.id) || findByName(data.name) || null;

  if (null == mt) {
    mediaTracks.push(data);
    return true;
  }

  return false;
}

function findByName(name) {
  const index = mediaTracks.findIndex((m) => m.name === name);

  if (index != -1) {
    return mediaTracks[index];
  }

  return null;
}

function findById(id) {
  const index = mediaTracks.findIndex((m) => m.id === id);

  if (index != -1) {
    return mediaTracks[index];
  }

  return null;
}

function removeById(id) {
  mediaTracks = mediaTracks.filter((m) => m.id !== id || m.pSID == id);
  log(`\n\tRemoved track by ID: ${stringify(mediaTracks)}`);
}

function removeByName(name) {
  mediaTracks = mediaTracks.filter((m) => m.name !== name || m.pSID == name);
  log(`\n\tRemoved track by Name: ${stringify(mediaTracks)}`);
}
