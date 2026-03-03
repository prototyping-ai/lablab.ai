import { createAgentManager, StreamType } from '@d-id/client-sdk';

let auth = { 
    type: 'key', 
    clientKey: "Z29vZ2xlLW9hdXRoMnwxMDcyMDgyMTI2MDEwNTk4MzQ2NDQ6UDVJYUtPQXhNaXdDMFQ1RDhGRmds" 
};

let agentId = "v2_agt_usa6DLuf";
let streamVideoElement = document.getElementById("streamVideoElement");
let idleVideoElement = document.getElementById("idleVideoElement");
let textArea = document.getElementById("textArea");
let speechButton = document.getElementById("speechButton");
let actionButton = document.getElementById("actionButton");
let interruptButton = document.getElementById("interruptButton");
let connectionLabel = document.getElementById("connectionLabel");
let answersContent = document.getElementById("answersContent");
let videoWrapper = document.getElementById("video-wrapper");

let renderedMessageIds = new Set();
let srcObject;
let streamType;

const callbacks = {
    onSrcObjectReady(value) {
        streamVideoElement.srcObject = value;
        streamVideoElement.volume = 1;
        srcObject = value;
    },
    onConnectionStateChange(state) {
        if (state === "connecting") {
            connectionLabel.textContent = "Connecting...";
            idleVideoElement.src = agentManager.agent.presenter.idle_video;
            idleVideoElement.play();
            videoWrapper.style.filter = "blur(5px)";
        } else if (state === "connected") {
            connectionLabel.textContent = "Connected";
            videoWrapper.style.filter = "blur(0px)";
            actionButton.removeAttribute("disabled");
            speechButton.removeAttribute("disabled");
        } else if (state === "disconnected" || state === "closed") {
            connectionLabel.textContent = "Disconnected";
            actionButton.setAttribute("disabled", true);
            speechButton.setAttribute("disabled", true);
        }
    },
    onVideoStateChange(state) {
        if (streamType === StreamType.Fluent) {
            if (state === "START") {
                streamVideoElement.style.opacity = 1;
                idleVideoElement.style.opacity = 0;
            }
        } else {
            if (state === "START") {
                streamVideoElement.srcObject = srcObject;
                streamVideoElement.style.opacity = 1;
                idleVideoElement.style.opacity = 0;
            } else {
                streamVideoElement.style.opacity = 0;
                idleVideoElement.style.opacity = 1;
            }
        }
    },
    onNewMessage(messages, type) {
        let msg = messages[messages.length - 1];
        if (!msg) return;
        if (msg.role === "assistant" && msg.id && !renderedMessageIds.has(msg.id)) {
            renderedMessageIds.add(msg.id);
            const div = document.createElement("div");
            div.textContent = msg.content;
            div.className = "agentMessage";
            answersContent.appendChild(div);
            answersContent.scrollTop = answersContent.scrollHeight;
        }
    },
    onAgentActivityStateChange(state) {
        if (state === "TALKING") {
            interruptButton.style.display = "inline-block";
            speechButton.style.display = "none";
            actionButton.style.display = "none";
        } else {
            interruptButton.style.display = "none";
            speechButton.style.display = "inline-block";
            actionButton.style.display = "inline-block";
        }
    },
    onError(error) {
        console.error("Agent error:", error);
        connectionLabel.innerHTML = "<span style='color:red'>Error</span>";
    }
};

let streamOptions = { 
    compatibilityMode: "on", 
    streamWarmup: true, 
    fluent: true 
};

async function initAgent() {
    if (!agentId || !auth.clientKey) {
        console.error("Missing agentId or clientKey!");
        return;
    }
    window.agentManager = await createAgentManager(agentId, { auth, callbacks, streamOptions });
    streamType = agentManager.getStreamType();
    console.log("Stream type:", streamType);
    await agentManager.connect();
}

function handleAction() {
    const mode = document.querySelector('input[name="option"]:checked').value;
    const val = textArea.value;
    if (!val) return;
    if (mode === "chat") agentManager.chat(val);
    else agentManager.speak({ type: "text", input: val });
    textArea.value = "";
}

function interrupt() {
    agentManager.interrupt({ type: "click" });
}

actionButton.addEventListener("click", handleAction);
interruptButton.addEventListener("click", interrupt);

window.addEventListener("load", () => {
  // Force buttons to be enabled for testing
  actionButton.removeAttribute("disabled");
  speechButton.removeAttribute("disabled");
  
  initAgent();
});

/*
window.addEventListener("load", () => {
    actionButton.setAttribute("disabled", true);
    speechButton.setAttribute("disabled", true);
    initAgent();
}); */