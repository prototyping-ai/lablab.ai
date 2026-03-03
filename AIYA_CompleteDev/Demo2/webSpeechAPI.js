var recognizing = false;
var recognition;

if (navigator.userAgent.includes("Firefox")) recognition = new SpeechRecognition();
else recognition = new webkitSpeechRecognition();

recognition.lang = "en-US";
recognition.continuous = true;

recognition.onend = reset;
recognition.onresult = function (event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      textArea.value += event.results[i][0].transcript;
    }
  }
};

function reset() {
  recognizing = false;
  speechButton.style.backgroundColor = "#EFEFEF";
  speechButton.innerHTML = "🎤";
  actionButton.removeAttribute("disabled");
  interruptButton.removeAttribute("disabled");
}

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    reset();
  } else {
    textArea.value = "";
    recognition.start();
    recognizing = true;
    speechButton.style.backgroundColor = "black";
    speechButton.innerHTML = "🎙️";
    actionButton.setAttribute("disabled", true);
    interruptButton.setAttribute("disabled", true);
  }
}

speechButton.addEventListener("click", toggleStartStop);