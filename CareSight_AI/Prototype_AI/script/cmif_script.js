import { FaceLandmarker, GestureRecognizer, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
const liveSpeechPanel = document.getElementById("liveSpeech");
const historicalSpeakerLabelWithPerson = document.getElementById("historicalSpeakerLabelWithPerson");
const conversationLogPanel = document.getElementById("conversationLog");

// ----------------------
// Configuration
// ----------------------
const TALKING_THRESHOLD = 0.012;
const CORRELATION_WINDOW = 3000; 
const MATCH_DISTANCE = 0.15;
const WORD_LIMIT = 6;         
const SILENCE_GAP = 400;       

// ----------------------
// State Management
// ----------------------
let trackedFaces = {}; 
let faceLandmarker;
let gestureRecognizer; // Added for hands
let lastVideoTime = -1;
let recognizer;

let activeSpeakerId = null;
let lastLoggedText = "";
let lastWordTimestamp = Date.now();

// ----------------------
// Initialization
// ----------------------
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => { video.play(); resolve(); };
  });
}

function resizeCanvas() {
  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;
}

function mouthOpenness(landmarks) {
  return Math.abs(landmarks[13].y - landmarks[14].y);
}

// ----------------------
// Face Tracking
// ----------------------
function updateTrackedFaces(detectedFaces) {
  const now = Date.now();
  const updated = {};

  detectedFaces.forEach(lm => {
    let matchedId = null;
    let minDistance = MATCH_DISTANCE;

    for (const [id, face] of Object.entries(trackedFaces)) {
      const dx = face.landmarks[1].x - lm[1].x;
      const dy = face.landmarks[1].y - lm[1].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < minDistance) {
        minDistance = dist;
        matchedId = id;
      }
    }

    if (matchedId === null) {
      matchedId = 0;
      while (trackedFaces.hasOwnProperty(matchedId) || updated.hasOwnProperty(matchedId)) matchedId++;
    }

    const openness = mouthOpenness(lm);
    const prevTimeline = trackedFaces[matchedId]?.timeline || [];
    const timeline = [...prevTimeline, { t: now, v: openness }]
      .filter(item => now - item.t < CORRELATION_WINDOW);

    const sortedValues = [...timeline].map(i => i.v).sort((a, b) => b - a);
    const topValues = sortedValues.slice(0, Math.max(1, Math.floor(sortedValues.length * 0.2)));
    const peakActivity = topValues.length > 0 ? topValues.reduce((a, b) => a + b, 0) / topValues.length : 0;

    updated[matchedId] = {
      landmarks: lm,
      timeline: timeline,
      activity: peakActivity,
      isCurrentlyTalking: openness > TALKING_THRESHOLD
    };
  });

  return updated;
}

// ----------------------
// Speech Recognition
// ----------------------
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  recognizer = new SpeechRecognition();
  recognizer.continuous = true;
  recognizer.interimResults = true;

  recognizer.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      interimTranscript += event.results[i][0].transcript;
    }

    const now = Date.now();
    const words = interimTranscript.trim().split(/\s+/);
    
    const currentActive = Object.entries(trackedFaces)
      .filter(([id, face]) => face.isCurrentlyTalking)
      .sort((a, b) => b[1].activity - a[1].activity);

    const detectedId = currentActive.length > 0 ? currentActive[0][0] : activeSpeakerId;

    if (detectedId !== activeSpeakerId && activeSpeakerId !== null && interimTranscript.length > 5) {
      finalizeAndReset(`Person ${parseInt(activeSpeakerId) + 1}`, interimTranscript);
      activeSpeakerId = detectedId;
      return;
    }

    if (words.length >= WORD_LIMIT) {
      finalizeAndReset(`Person ${parseInt(activeSpeakerId) + 1}`, interimTranscript);
      return;
    }

    if (now - lastWordTimestamp > SILENCE_GAP && interimTranscript.length > 8) {
      finalizeAndReset(`Person ${parseInt(activeSpeakerId) + 1}`, interimTranscript);
      return;
    }

    if (interimTranscript !== lastLoggedText) {
      lastWordTimestamp = now;
    }

    activeSpeakerId = detectedId;
    liveSpeechPanel.innerText = interimTranscript;

    if (event.results[event.results.length - 1].isFinal) {
      finalizeAndReset(`Person ${parseInt(activeSpeakerId) + 1}`, interimTranscript);
    }
  };

  recognizer.start();
  recognizer.onend = () => recognizer.start();
}

function finalizeAndReset(label, text) {
  if (!text.trim() || text === lastLoggedText) return;
  createEntry(label, text);
  lastLoggedText = text;
  lastWordTimestamp = Date.now();
  recognizer.stop(); 
}

function createEntry(label, text) {
  const hist = document.createElement("div");
  hist.style.cssText = "padding: 5px; border-bottom: 1px solid #222; font-size: 12px; font-family: monospace;";
  hist.innerHTML = `<span style="color: #0ff;">[${label}]</span> ${text}`;
  historicalSpeakerLabelWithPerson.appendChild(hist);
  historicalSpeakerLabelWithPerson.scrollTop = historicalSpeakerLabelWithPerson.scrollHeight;

  const bubble = document.createElement("div");
  const isP1 = label.includes("1");
  bubble.style.cssText = `
    background: ${isP1 ? "#1a1a1a" : "#222a2a"};
    margin: 10px 0;
    padding: 12px;
    border-radius: 10px;
    border-left: 5px solid ${isP1 ? "lime" : "cyan"};
    text-align: left;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.4);
  `;
  bubble.innerHTML = `<strong style="color: ${isP1 ? "lime" : "cyan"}; font-size: 10px;">${label.toUpperCase()}</strong><br>${text}`;
  conversationLogPanel.appendChild(bubble);
  conversationLogPanel.scrollTop = conversationLogPanel.scrollHeight;
}

// ----------------------
// Drawing Functions
// ----------------------
function drawFaceMesh(landmarks, activity, id) {
  const isActive = activity > TALKING_THRESHOLD;
  const tx = landmarks[10].x * canvas.width;
  const ty = landmarks[10].y * canvas.height;

  const FACE_OUTLINE = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
    397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 
    172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
  ];

  ctx.beginPath();
  ctx.strokeStyle = isActive ? "lime" : "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = isActive ? 3 : 1.5;
  ctx.lineJoin = "round";
  
  FACE_OUTLINE.forEach((idx, i) => {
    const px = landmarks[idx].x * canvas.width;
    const py = landmarks[idx].y * canvas.height;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.stroke();

  const lips = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61];
  ctx.strokeStyle = isActive ? "red" : "orange";
  ctx.lineWidth = isActive ? 3 : 1;
  ctx.beginPath();
  lips.forEach((idx, i) => {
    const px = landmarks[idx].x * canvas.width;
    const py = landmarks[idx].y * canvas.height;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "bold 14px Arial";
  ctx.shadowBlur = 4;
  ctx.shadowColor = "black";
  ctx.fillText(`Person ${parseInt(id) + 1}`, tx - 20, ty - 30);
  ctx.shadowBlur = 0;
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(tx - 20, ty - 25, 40, 4);
  
  ctx.fillStyle = isActive ? (id == 0 ? "lime" : "cyan") : "gray";
  const barWidth = Math.min(activity * 1000, 40);
  ctx.fillRect(tx - 20, ty - 25, barWidth, 4);
}

// NEW: Hand Gesture Drawing Logic
function drawHandGestures(handRes) {
  if (!handRes.landmarks) return;

  handRes.landmarks.forEach((landmarks, index) => {
    const gesture = handRes.gestures[index][0].categoryName;
    const score = (handRes.gestures[index][0].score * 100).toFixed(0);

    // Draw simple hand skeleton
    ctx.strokeStyle = "rgba(0, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    landmarks.forEach((pt, i) => {
      const px = pt.x * canvas.width;
      const py = pt.y * canvas.height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Draw Gesture Label near the wrist
    const wx = landmarks[0].x * canvas.width;
    const wy = landmarks[0].y * canvas.height;
    
    ctx.fillStyle = "cyan";
    ctx.font = "bold 12px monospace";
    ctx.fillText(`${gesture} (${score}%)`, wx, wy + 20);
  });
}

// ----------------------
// Main Loop
// ----------------------
async function detect() {
  if (video.currentTime !== lastVideoTime) {
    const now = performance.now();
    lastVideoTime = video.currentTime;

    // Run both Face and Gesture recognizers
    const faceRes = faceLandmarker.detectForVideo(video, now);
    const handRes = gestureRecognizer.recognizeForVideo(video, now);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Face Logic
    if (faceRes.faceLandmarks) {
      trackedFaces = updateTrackedFaces(faceRes.faceLandmarks);
      Object.entries(trackedFaces).forEach(([id, face]) => {
        drawFaceMesh(face.landmarks, face.activity, id);
      });
    }

    // Draw Hand Logic
    if (handRes) {
      drawHandGestures(handRes);
    }
  }
  requestAnimationFrame(detect);
}

// ----------------------
// Init
// ----------------------
async function init() {
  await setupCamera();
  resizeCanvas();
  
  const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm");
  
  // Face Landmarker
  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task" },
    runningMode: "VIDEO",
    numFaces: 5
  });

  // NEW: Gesture Recognizer
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
    },
    runningMode: "VIDEO",
    numHands: 2
  });

  setupSpeechRecognition();
  window.addEventListener("resize", resizeCanvas);
  detect();
}

init();