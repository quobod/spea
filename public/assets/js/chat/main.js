// import axios from "./axios";
import * as store from "./store.js";
import * as wss from "./wss.js";
import * as webRTCHandler from "./webrtchandler.js";
import * as constants from "./constants.js";
import * as elements from "./elements.js";
import * as recordingUtils from "./recordingutils.js";
import { addHandler, log } from "../utils.js";
import * as ui from "./ui.js";

// init socket connection
const socket = io("/");
wss.registerSocketEvents(socket);

const getTurnServerCredentials = async () => {
  await fetch(new Request("/api/get-turn-credentials"))
    .then((responseData) => responseData.json())
    .then((data) => {
      console.log(data.iceServers);
      webRTCHandler.setTurnServers(data.iceServers);
      return;
    })
    .catch((err) => {
      console.log(`\n\tfetch error`);
      console.log(err);
      return;
    });
};

getTurnServerCredentials();

// register event listener for personal code button
addHandler(elements.personalCodeCopyButton, "click", () => {
  const personalCode = store.getState().socketId;
  log(`\n\tPersonal Code ${personalCode} copied to clipboard`);
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
});

// register listeners for connetion buttons
addHandler(elements.personalCodeChatButton, "click", () => {
  log("Personal chat button clicked");

  const calleePersonalCode = elements.personalCodeInput.value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;

  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

addHandler(elements.personalCodeVideoButton, "click", () => {
  log("Personal video button clicked");

  const calleePersonalCode = elements.personalCodeInput.value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;

  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

// register listener for mic-button
addHandler(elements.micButton, "click", () => {
  const localStream = store.getState().localStream;
  const micEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnabled;
  elements.micButton.enabled = micEnabled;
  ui.updateMicButton(micEnabled);
});

// register listener for camera-button
addHandler(elements.cameraButton, "click", () => {
  console.log(`\n\tDisabling camera`);
  const localStream = store.getState().localStream;
  const cameraEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraEnabled;
  ui.updateCameraButton(cameraEnabled);
});

// register listener for screen-sharing-button
addHandler(elements.screenSharingButton, "click", () => {
  const screenSharingActive = store.getState().screenSharingActive;

  webRTCHandler.switchBetweenCameraAndScreenSharing(screenSharingActive);
});

// messenger input
addHandler(elements.newMessageInput, "keydown", (event) => {
  log(`Message input activity`);

  const key = event.key;

  if (key === "Enter") {
    webRTCHandler.sendMessageUsingDataChannel(event.target.value);
    ui.appendMessage(event.target.value, true);
    elements.newMessageInput.value = "";
  }
});

// send message button
addHandler(elements.sendMessageButton, "click", () => {
  const message = elements.newMessageInput.value;
  webRTCHandler.sendMessageUsingDataChannel(message);
  ui.appendMessage(message, true);
  elements.newMessageInput.value = "";
});

// recording controls
addHandler(elements.startRecordingButton, "click", () => {
  recordingUtils.startRecording();
  ui.showRecordingPanel();
});

// stop recording
addHandler(elements.stopRecordingButton, "click", () => {
  recordingUtils.stopRecording();
  ui.resetRecordingButtons();
});

// pause recording
addHandler(elements.pauseRecordingButton, "click", () => {
  recordingUtils.pauseRecording();
  ui.pauseRecording();
});

// resume recording
addHandler(elements.resumeRecordingButton, "click", () => {
  recordingUtils.resumeRecording();
  ui.resumeRecording();
});

// hang up
addHandler(elements.hangupButton, "click", () => {
  webRTCHandler.handleHangup();
});

addHandler(elements.finishChatButton, "click", () => {
  webRTCHandler.handleHangup();
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

addHandler(elements.hideMeCheckbox, "click", (e) => {
  const checked = e.target.checked;
  const userId = elements.personalCodeParagraph.innerHTML;

  if (!checked) {
    elements.settingsIcon.classList.remove("fa-eye-slash");
    elements.settingsIcon.classList.add("fa-eye");
  } else {
    elements.settingsIcon.classList.remove("fa-eye");
    elements.settingsIcon.classList.add("fa-eye-slash");
  }

  wss.hideMe({ userId, show: checked });
});

addHandler(elements.personalCodeInput, "click", (e) => {
  e.target.value = "";
});

// Helper functions
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

function preparePeerListPanel() {
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
