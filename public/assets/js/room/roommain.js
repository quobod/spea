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
  addClickHandler,
  keys,
} from "../utils.js";
import {
  updateSocketUser,
  registerSocketEvents,
  hideMe,
  participantDisconnected,
} from "./wss.js";
import * as elements from "./roomelements.js";
import { muteMicrophone, muteCamera, recordVideo } from "./mediacontrols.js";

// init socket connection
const socket = io("/");

const start = () => {
  console.log(`\n\t\tLanded on the room view\n`);
  registerSocketEvents(socket);
};

start();

// Elements
const roomNameInput = document.querySelector("#room-name-input");
const joinRoomInput = document.querySelector("#join-room-input");
const rmtIdInput = document.querySelector("#rmtid-input");
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

const handleDisconnection = (participant) => {
  log(`\n\t${participant.identity} disconnected`);
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

  participant.on("disconnected", handleDisconnection);

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

      /*  TODO:
            Check if participant ID is already added to the mediaTracks array
      */

      const newObj = {
        participantID: participant.id,
        track: {
          kind: trackPublication.track.kind,
          id: trackPublication.track.id,
          sid: trackPublication.track.sid,
          trackPublicationName: trackPublication.trackName,
          trackPublicationID: trackPublication.trackSid,
        },
      };

      if (addTrack(newObj)) {
        log(`\n\tAdded Published Track: ${stringify(newObj)}`);
      }
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
  });

  participant.on("trackDisabled", (track) => {
    log(
      `${keys(track)}\n\tParticipant ${participant.id} disabled track ${
        track.kind
      }:\tSID: ${track.sid}`
    );
  });

  participant.on("disconnected", (p) => {
    log(`\n\t${p.identity} disconnected`);
    participantDisconnected({ rmtUser: rmtIdInput.value });
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

        log(`\n\tRMT User ID: ${rmtIdInput.value}`);

        updateSocketUser({
          rmtId: rmtIdInput.value,
          participantIdentity: room.localParticipant.identity,
          type: "local",
        });
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

// Click Handlers

addHandler(elements.hideCheckbox, "click", (e) => {
  const target = e.target;
  const socketId = elements.personalCode.value;
  if (target.checked) {
    log(`\n\tHide checkbox is checked`);
  } else {
    log(`\n\tHide checkbox is unchecked`);
  }
  wss.hideMe({ userId: socketId, show: target.checked });
});

addHandler(elements.hideMeCheckbox, "click", (e) => {
  const checked = e.target.checked;
  const userId = elements.personalCode.value;

  if (!checked) {
    elements.settingsIcon.classList.remove("fa-eye-slash");
    elements.settingsIcon.classList.add("fa-eye");
  } else {
    elements.settingsIcon.classList.remove("fa-eye");
    elements.settingsIcon.classList.add("fa-eye-slash");
  }

  hideMe({ userId, show: checked });
});

addHandler(elements.peersLink, "click", () => {
  log(`\n\tPeers link clicked\n`);
  preparePeerListPanel();
  elements.peersList.classList.toggle("show");
  setTimeout(() => {
    elements.peersLink.innerHTML = elements.peersList.classList.contains("show")
      ? "Hide Peers"
      : "Show Peers";
  }, 450);
});

addHandler(elements.showPresenceInput, "click", (e) => {
  const target = e.target;
  elements.showPresence.innerHTML = target.checked ? "Hidden" : "Visible";

  socket.emit("changevisibility", {
    userId: socket.id,
    show: target.checked,
  });
});

addHandler(elements.controlPanelLink, "click", () => {
  prepareControlPanelLink();

  elements.controlPanel.classList.toggle("show");
  setTimeout(() => {
    elements.controlPanelLink.innerHTML =
      elements.controlPanel.classList.contains("show")
        ? "Hide Search"
        : "Show Search";
  }, 450);
});

addHandler(elements.settingsLink, "click", () => {
  log(`\n\tSettings link clicked\n`);
  prepareSettingsPanel();
  elements.settings.classList.toggle("show");
  setTimeout(() => {
    elements.settingsLink.innerHTML = elements.settings.classList.contains(
      "show"
    )
      ? "Hide Settings"
      : "Show Settings";
  }, [400]);
});

// Helpers

function prepareControlPanelLink() {
  if (elements.peersList.classList.contains("show")) {
    elements.peersList.classList.remove("show");
    setTimeout(() => {
      elements.peersLink.innerHTML = elements.peersList.classList.contains(
        "show"
      )
        ? "Hide Peers"
        : "Show Peers";
    }, 450);
  }
}

function preparePeerListPanel() {
  log(`\n\tDone\n`);

  if (elements.settings.classList.contains("show")) {
    elements.settings.classList.remove("show");
    setTimeout(() => {
      elements.settingsLink.innerHTML = elements.settings.classList.contains(
        "show"
      )
        ? "Hide Settings"
        : "Show Settings";
    }, 450);
  }
}

function prepareSettingsPanel() {
  if (elements.peersList.classList.contains("show")) {
    elements.peersList.classList.remove("show");
    setTimeout(() => {
      elements.peersLink.innerHTML = elements.peersList.classList.contains(
        "show"
      )
        ? "Hide Peers"
        : "Show Peers";
    }, 450);
  }
}
