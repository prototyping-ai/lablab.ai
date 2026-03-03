let currentVisualContext = "A calm room with dim lighting.";

// DOM elements
const conversationLog = document.getElementById("conversationLog");
const video = document.getElementById("video");
const timestampEl = document.getElementById("timestamp");
const sendBtn = document.getElementById("sendBtn");
const statusEl = document.querySelector(".status");

// --- Camera setup ---
navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 } })
  .then(stream => video.srcObject = stream)
  .catch(err => console.error("Camera error:", err));

// --- Conversation log helper ---
function addLog(text) {
  const p = document.createElement("div");
  p.textContent = text;
  conversationLog.appendChild(p);
  conversationLog.scrollTop = conversationLog.scrollHeight;
}

// --- Timestamp update ---
setInterval(() => {
  timestampEl.innerText = new Date().toLocaleTimeString();
}, 1000);

// --- Poll for D-ID avatar agent ---
function waitForAgent(name, callback) {
  const interval = setInterval(() => {
    const agent = window.didAgents?.find(a => a.name === name);
    if (agent && typeof agent.say === "function") {
      clearInterval(interval);
      callback(agent);
    }
  }, 100); // check every 100ms
}

// --- Initialize button after agent is ready ---
sendBtn.disabled = true;
statusEl.textContent = "LOADING...";

waitForAgent("did-agent", (agent) => {
  sendBtn.disabled = false;
  statusEl.textContent = "ONLINE";
  console.log("Avatar agent is ready!");

  sendBtn.addEventListener("click", () => {
    const mockDescription = `AIYA prompt: here is what you are seeing - tell me what you see. ${currentVisualContext} - What in front is a pool table.`;

    addLog("[Avatar]: " + mockDescription); // log in conversation panel
    agent.say(mockDescription);
    console.log("Sent to avatar:", mockDescription);
  });
});