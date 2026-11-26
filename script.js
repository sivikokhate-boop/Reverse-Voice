
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

// Drawer controls
function openMenu() {
  drawer.classList.add("open");
  drawerOverlay.classList.add("open");
}

function closeMenu() {
  drawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
}

menuBtn.onclick = openMenu;
closeDrawer.onclick = closeMenu;
drawerOverlay.onclick = closeMenu;

// Slow reverse speed options
document.querySelectorAll("[data-speed]").forEach(button => {
  button.onclick = () => {
    slowSpeed = Number(button.dataset.speed);

    document.querySelectorAll("[data-speed]").forEach(b => {
      b.classList.remove("active");
    });

    button.classList.add("active");
  };
});

// Recording timer
function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  timerText.textContent = `${minutes}:${seconds}`;
}

// Start recording
async function startRecording() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Microphone recording is not supported in this browser.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    audioChunks = [];
    audioBlob = null;

    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer = null;
    }

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, {
        type: mediaRecorder.mimeType || "audio/webm"
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
    alert("Microphone error: " + error.name + "\n" + error.message);
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
  if (recording) {
    stopRecording();
  } else {
    startRecording();
  }
};

// Playback placeholders
normalBtn.onclick = () => {
  if (!audioBlob) {
    alert("Please record something first.");
    return;
  }

  alert("Normal playback will be implemented next.");
};

reverseBtn.onclick = () => {
  if (!audioBlob) {
    alert("Please record something first.");
    return;
  }

  alert("Reverse playback will be implemented next.");
};

slowBtn.onclick = () => {
  if (!audioBlob) {
    alert("Please record something first.");
    return;
  }

  alert("Slow reverse playback will be implemented next. Selected speed: " + slowSpeed + "×");
};

stopPlaybackBtn.onclick = () => {
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
};
