
const recordBtn = document.getElementById("recordBtn");
const statusText = document.getElementById("status");
const timerText = document.getElementById("timer");

const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const closeDrawer = document.getElementById("closeDrawer");

const normalBtn = document.getElementById("normalBtn");
const reverseBtn = document.getElementById("reverseBtn");
const slowBtn = document.getElementById("slowBtn");
const stopPlaybackBtn = document.getElementById("stopPlaybackBtn");

// Settings
let slowSpeed = 1.25;

// Recording
let mediaRecorder = null;
let audioChunks = [];
let audioBlob = null;
let recording = false;
let startTime = 0;
let timerInterval = null;

// Playback
let audioPlayer = null;

// Drawer
menuBtn.onclick = () => {
  drawer.classList.add("open");
  drawerOverlay.classList.add("open");
};

closeDrawer.onclick = drawerOverlay.onclick = () => {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
};

// Speed settings
document.querySelectorAll("[data-speed]").forEach(button => {
  button.onclick = () => {
    slowSpeed = Number(button.dataset.speed);

    document.querySelectorAll("[data-speed]").forEach(b => {
      b.classList.remove("active");
    });

    button.classList.add("active");
  };
});

// Timer
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  timerText.textContent = `${minutes}:${seconds}`;
}

// Start recording
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    audioChunks = [];
    audioBlob = null;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, {
        type: mediaRecorder.mimeType
      });

      stream.getTracks().forEach(track => track.stop());

      statusText.textContent = "Recording complete";
      timerText.textContent = "Ready to play";
    };

    mediaRecorder.start();

    recording = true;
    startTime = Date.now();

    timerInterval = setInterval(updateTimer, 250);

    recordBtn.innerHTML = '<span class="record-dot"></span> Stop';
    statusText.textContent = "Recording...";
  } catch (error) {
    alert("Microphone access failed. Please allow microphone permission.");
    console.error(error);
  }
}

// Stop recording
function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state === "inactive") return;

  mediaRecorder.stop();
  recording = false;

  clearInterval(timerInterval);

  recordBtn.innerHTML = '<span class="record-dot"></span> Record';
  statusText.textContent = "Processing recording...";
}

// Record button
recordBtn.onclick = () => {
  if (!recording) {
    startRecording();
  } else {
    stopRecording();
  }
};

// Placeholder playback controls
normalBtn.onclick = () => {
  if (!audioBlob) {
    alert("Please record something first.");
    return;
  }
  alert("Normal playback will be added in the next step.");
};

reverseBtn.onclick = () => {
  if (!audioBlob) {
    alert("Please record something first.");
    return;
  }
  alert("Reverse playback will be added in the next step.");
};

slowBtn.onclick = () => {
  if (!audioBlob) {
    alert("Please record something first.");
    return;
  }
  alert("Slow reverse playback will be added in the next step.");
};

stopPlaybackBtn.onclick = () => {
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
};

