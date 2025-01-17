document.addEventListener("DOMContentLoaded", function () {
  let playSoundOption = document.getElementById("playSound");
  let startRecordingOption = document.getElementById("startRecording");
  let hideDistractingInfoCheckBox = document.getElementById("hideDistractingInfo");
  let shortcutText = document.getElementById('shortcut-link');
  let startRecordingAfterAudioCheckbox = document.getElementById("startRecordingAfterAudio");
  let startRecordingAfterAudioContainer = document.getElementById("startRecordingAfterAudioContainer");

  function updateStartRecordingAfterAudioContainerVisibility() {
    if (playSoundOption.checked) {
      startRecordingAfterAudioContainer.style.display = 'block';
    } else {
      startRecordingAfterAudioContainer.style.display = 'none';
    }
  }

  chrome.storage.local.get("IS_PLAY_SOUND_ON_POPUP", function (data) {
    if (data.IS_PLAY_SOUND_ON_POPUP === undefined) {
        chrome.storage.local.set({ IS_PLAY_SOUND_ON_POPUP: true}); 
        data.IS_PLAY_SOUND_ON_POPUP = true;
    }
    if (data.IS_PLAY_SOUND_ON_POPUP === false) {
      startRecordingOption.checked = true;
    } else {
      playSoundOption.checked = true;
    }
    updateStartRecordingAfterAudioContainerVisibility();
    playSoundOption.addEventListener("change", function () {
      chrome.storage.local.set({ IS_PLAY_SOUND_ON_POPUP: this.checked });
      updateStartRecordingAfterAudioContainerVisibility();
    });
    startRecordingOption.addEventListener("change", function () {
      chrome.storage.local.set({ IS_PLAY_SOUND_ON_POPUP: !this.checked });
      updateStartRecordingAfterAudioContainerVisibility();
    });
  });
  chrome.storage.local.get("HIDE_DISTRACTING_INFO", function (data) {
    if (data.HIDE_DISTRACTING_INFO === undefined) {
        chrome.storage.local.set({ HIDE_DISTRACTING_INFO: true}); 
        data.HIDE_DISTRACTING_INFO = true;
    }
    hideDistractingInfoCheckBox.checked = data.HIDE_DISTRACTING_INFO === true;
    hideDistractingInfoCheckBox.addEventListener("change", function () {
      chrome.storage.local.set({ HIDE_DISTRACTING_INFO: this.checked });
    });
  });
  chrome.storage.local.get("START_RECORDING_AFTER_AUDIO", function (data) {
    if (data.START_RECORDING_AFTER_AUDIO === undefined) {
        chrome.storage.local.set({ START_RECORDING_AFTER_AUDIO: true}); 
        data.START_RECORDING_AFTER_AUDIO = true;
    }
    startRecordingAfterAudioCheckbox.checked = data.START_RECORDING_AFTER_AUDIO === true;
    startRecordingAfterAudioCheckbox.addEventListener("change", function () {
      chrome.storage.local.set({ START_RECORDING_AFTER_AUDIO: this.checked });
    });
  });
  shortcutText.addEventListener('click', function(e) {
    e.preventDefault();
    displayShortcutPopup();
  });
});

function getExtensionShortcutUrl() {
  // Detect browser
  var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  var isEdge = !isChrome && !!window.StyleMedia;
  var isBrave = isChrome && !!window.navigator.brave;
  if (isBrave) {
    return 'brave://extensions/shortcuts';
  } else if (isChrome) {
    return 'chrome://extensions/shortcuts';
  } else if (isEdge) {
    return 'edge://extensions/shortcuts';
  } else {
    return '#';
  }
}

function displayShortcutPopup() {
  var customAlert = document.getElementById('custom-alert');
  var shortcutUrlText = document.getElementById('shortcut-url-text');
  shortcutUrlText.innerText = getExtensionShortcutUrl();
  customAlert.style.display = 'flex';
  shortcutUrlText.addEventListener('click', function() {
    var textArea = document.createElement('textarea');
    textArea.value = shortcutUrlText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Shortcut copied to clipboard');
    customAlert.style.display = 'none';
  });
}