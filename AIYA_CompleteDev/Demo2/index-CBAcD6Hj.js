// 2.0.12
var go = Object.defineProperty;
var po = (t, e, n) => e in t ? go(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var De = (t, e, n) => po(t, typeof e != "symbol" ? e + "" : e, n);
var mo = Object.defineProperty, _o = (t, e, n) => e in t ? mo(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, cn = (t, e, n) => _o(t, typeof e != "symbol" ? e + "" : e, n);
class wn extends Error {
  constructor({ kind: e, description: n, error: r }) {
    super(JSON.stringify({ kind: e, description: n })), cn(this, "kind"), cn(this, "description"), cn(this, "error"), this.kind = e, this.description = n, this.error = r;
  }
}
class vo extends wn {
  constructor(e, n) {
    super({
      kind: "ChatCreationFailed",
      description: `Failed to create ${n ? "persistent" : ""} chat, mode: ${e}`
    });
  }
}
class yo extends wn {
  constructor(e) {
    super({ kind: "ChatModeDowngraded", description: `Chat mode downgraded to ${e}` });
  }
}
class It extends wn {
  constructor(e, n) {
    super({ kind: "ValidationError", description: e }), cn(this, "key"), this.key = n;
  }
}
class wo extends wn {
  constructor(e) {
    super({ kind: "WSError", description: e });
  }
}
var Xe = /* @__PURE__ */ ((t) => (t.Unrated = "Unrated", t.Positive = "Positive", t.Negative = "Negative", t))(Xe || {}), R = /* @__PURE__ */ ((t) => (t.Functional = "Functional", t.TextOnly = "TextOnly", t.Maintenance = "Maintenance", t.Playground = "Playground", t.DirectPlayback = "DirectPlayback", t.Off = "Off", t))(R || {}), Ge = /* @__PURE__ */ ((t) => (t.Embed = "embed", t.Query = "query", t.Partial = "partial", t.Answer = "answer", t.Transcribe = "transcribe", t.Complete = "done", t))(Ge || {}), Ei = /* @__PURE__ */ ((t) => (t.Clip = "clip", t.Talk = "talk", t.Expressive = "expressive", t))(Ei || {}), ae = /* @__PURE__ */ ((t) => (t.Start = "START", t.Stop = "STOP", t))(ae || {}), et = /* @__PURE__ */ ((t) => (t.Strong = "STRONG", t.Weak = "WEAK", t.Unknown = "UNKNOWN", t))(et || {}), je = /* @__PURE__ */ ((t) => (t.Idle = "IDLE", t.Loading = "LOADING", t.Talking = "TALKING", t))(je || {}), be = /* @__PURE__ */ ((t) => (t.ChatAnswer = "chat/answer", t.ChatPartial = "chat/partial", t.ChatAudioTranscribed = "chat/audio-transcribed", t.StreamDone = "stream/done", t.StreamStarted = "stream/started", t.StreamFailed = "stream/error", t.StreamReady = "stream/ready", t.StreamCreated = "stream/created", t.StreamInterrupt = "stream/interrupt", t.StreamVideoCreated = "stream-video/started", t.StreamVideoDone = "stream-video/done", t.StreamVideoError = "stream-video/error", t.StreamVideoRejected = "stream-video/rejected", t))(be || {}), B = /* @__PURE__ */ ((t) => (t.New = "new", t.Fail = "fail", t.Connected = "connected", t.Connecting = "connecting", t.Closed = "closed", t.Completed = "completed", t.Disconnecting = "disconnecting", t.Disconnected = "disconnected", t))(B || {}), ze = /* @__PURE__ */ ((t) => (t.Legacy = "legacy", t.Fluent = "fluent", t))(ze || {}), Cn = /* @__PURE__ */ ((t) => (t.Livekit = "livekit", t))(Cn || {});
const Co = 45 * 1e3, bo = "X-Playground-Chat", Xt = "https://api.d-id.com", So = "wss://notifications.d-id.com", Mo = "79f81a83a67430be2bc0fd61042b8faa", ko = (...t) => {
}, Ai = (t) => new Promise((e) => setTimeout(e, t)), Tt = (t = 16) => {
  const e = new Uint8Array(t);
  return window.crypto.getRandomValues(e), Array.from(e, (n) => n.toString(16).padStart(2, "0")).join("").slice(0, 13);
}, Ti = (t) => t.type === "clip" && t.presenter_id.startsWith("v2_") ? "clip_v2" : t.type, tr = (t) => t === Ei.Expressive, Lo = (t) => [R.TextOnly, R.Playground, R.Maintenance].includes(t), Di = (t) => t && [R.DirectPlayback, R.Off].includes(t);
function xo(t, e) {
  let n;
  return {
    promise: new Promise((r, i) => {
      n = setTimeout(() => i(new Error(e)), t);
    }),
    clear: () => clearTimeout(n)
  };
}
async function Pn(t, e) {
  const n = {
    limit: (e == null ? void 0 : e.limit) ?? 3,
    delayMs: (e == null ? void 0 : e.delayMs) ?? 0,
    timeout: (e == null ? void 0 : e.timeout) ?? 3e4,
    timeoutErrorMessage: (e == null ? void 0 : e.timeoutErrorMessage) || "Timeout error",
    shouldRetryFn: (e == null ? void 0 : e.shouldRetryFn) ?? (() => !0),
    onRetry: (e == null ? void 0 : e.onRetry) ?? (() => {
    })
  };
  let r;
  for (let i = 1; i <= n.limit; i++)
    try {
      if (!n.timeout)
        return await t();
      const { promise: a, clear: o } = xo(n.timeout, n.timeoutErrorMessage), s = t().finally(o);
      return await Promise.race([s, a]);
    } catch (a) {
      if (r = a, !n.shouldRetryFn(a) || i >= n.limit)
        throw a;
      await Ai(n.delayMs), n.onRetry(a);
    }
  throw r;
}
function Rn(t) {
  if (t !== void 0)
    return window.localStorage.setItem("did_external_key_id", t), t;
  let e = window.localStorage.getItem("did_external_key_id");
  if (!e) {
    let n = Tt();
    window.localStorage.setItem("did_external_key_id", n), e = n;
  }
  return e;
}
let Io = Tt();
function Oi(t, e) {
  if (t.type === "bearer")
    return `Bearer ${t.token}`;
  if (t.type === "basic")
    return `Basic ${btoa(`${t.username}:${t.password}`)}`;
  if (t.type === "key")
    return `Client-Key ${t.clientKey}.${Rn(e)}_${Io}`;
  throw new Error(`Unknown auth type: ${t}`);
}
const No = (t) => Pn(t, {
  limit: 3,
  delayMs: 1e3,
  timeout: 0,
  shouldRetryFn: (e) => e.status === 429
});
function nr(t, e = Xt, n, r) {
  const i = async (a, o) => {
    const { skipErrorHandler: s, ...l } = o || {}, c = await No(
      () => fetch(e + (a != null && a.startsWith("/") ? a : `/${a}`), {
        ...l,
        headers: {
          ...l.headers,
          Authorization: Oi(t, r),
          "Content-Type": "application/json"
        }
      })
    );
    if (!c.ok) {
      let g = await c.text().catch(() => `Failed to fetch with status ${c.status}`);
      const d = new Error(g);
      throw n && !s && n(d, { url: a, options: l, headers: c.headers }), d;
    }
    return c.json();
  };
  return {
    get(a, o) {
      return i(a, { ...o, method: "GET" });
    },
    post(a, o, s) {
      return i(a, { ...s, body: JSON.stringify(o), method: "POST" });
    },
    delete(a, o, s) {
      return i(a, { ...s, body: JSON.stringify(o), method: "DELETE" });
    },
    patch(a, o, s) {
      return i(a, { ...s, body: JSON.stringify(o), method: "PATCH" });
    }
  };
}
function Eo(t, e = Xt, n, r) {
  const i = nr(t, `${e}/agents`, n, r);
  return {
    create(a, o) {
      return i.post("/", a, o);
    },
    getAgents(a, o) {
      return i.get(`/${a ? `?tag=${a}` : ""}`, o).then((s) => s ?? []);
    },
    getById(a, o) {
      return i.get(`/${a}`, o);
    },
    delete(a, o) {
      return i.delete(`/${a}`, void 0, o);
    },
    update(a, o, s) {
      return i.patch(`/${a}`, o, s);
    },
    newChat(a, o, s) {
      return i.post(`/${a}/chat`, o, s);
    },
    chat(a, o, s, l) {
      return i.post(`/${a}/chat/${o}`, s, l);
    },
    createRating(a, o, s, l) {
      return i.post(`/${a}/chat/${o}/ratings`, s, l);
    },
    updateRating(a, o, s, l, c) {
      return i.patch(`/${a}/chat/${o}/ratings/${s}`, l, c);
    },
    deleteRating(a, o, s, l) {
      return i.delete(`/${a}/chat/${o}/ratings/${s}`, l);
    },
    getSTTToken(a, o) {
      return i.get(`/${a}/stt-token`, o);
    }
  };
}
function Ao(t) {
  var e, n, r, i;
  const a = () => /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop", o = () => {
    const l = navigator.platform;
    return l.toLowerCase().includes("win") ? "Windows" : l.toLowerCase().includes("mac") ? "Mac OS X" : l.toLowerCase().includes("linux") ? "Linux" : "Unknown";
  }, s = t.presenter;
  return {
    $os: `${o()}`,
    isMobile: `${a() == "Mobile"}`,
    browser: navigator.userAgent,
    origin: window.location.origin,
    agentType: Ti(s),
    agentVoice: {
      voiceId: (n = (e = t.presenter) == null ? void 0 : e.voice) == null ? void 0 : n.voice_id,
      provider: (i = (r = t.presenter) == null ? void 0 : r.voice) == null ? void 0 : i.type
    }
  };
}
function To(t) {
  var e, n, r, i, a, o;
  const s = (e = t.llm) == null ? void 0 : e.prompt_customization;
  return {
    agentType: Ti(t.presenter),
    owner_id: t.owner_id ?? "",
    promptVersion: (n = t.llm) == null ? void 0 : n.prompt_version,
    behavior: {
      role: s == null ? void 0 : s.role,
      personality: s == null ? void 0 : s.personality,
      instructions: (r = t.llm) == null ? void 0 : r.instructions
    },
    temperature: (i = t.llm) == null ? void 0 : i.temperature,
    knowledgeSource: s == null ? void 0 : s.knowledge_source,
    starterQuestionsCount: (o = (a = t.knowledge) == null ? void 0 : a.starter_message) == null ? void 0 : o.length,
    topicsToAvoid: s == null ? void 0 : s.topics_to_avoid,
    maxResponseLength: s == null ? void 0 : s.max_response_length,
    agentId: t.id,
    access: t.access,
    name: t.preview_name,
    ...t.access === "public" ? { from: "agent-template" } : {}
  };
}
const Do = (t) => t.reduce((e, n) => e + n, 0), Ar = (t) => Do(t) / t.length;
function Oo(t, e, n) {
  var r, i, a;
  const { event: o, ...s } = t, { template: l } = (e == null ? void 0 : e.llm) || {}, { language: c } = ((r = e == null ? void 0 : e.presenter) == null ? void 0 : r.voice) || {};
  return {
    ...s,
    llm: { ...s.llm, template: l },
    script: { ...s.script, provider: { ...(i = s == null ? void 0 : s.script) == null ? void 0 : i.provider, language: c } },
    stitch: (e == null ? void 0 : e.presenter.type) === "talk" ? (a = e == null ? void 0 : e.presenter) == null ? void 0 : a.stitch : void 0,
    ...n
  };
}
function Tr(t) {
  "requestIdleCallback" in window ? requestIdleCallback(t, { timeout: 2e3 }) : setTimeout(t, 0);
}
const Po = "https://api-js.mixpanel.com/track/?verbose=1&ip=1";
function Ro(t) {
  const e = window != null && window.hasOwnProperty("DID_AGENTS_API") ? "agents-ui" : "agents-sdk", n = {};
  return {
    token: t.token || "testKey",
    distinct_id: Rn(t.externalId),
    agentId: t.agentId,
    additionalProperties: {
      id: Rn(t.externalId),
      ...t.mixpanelAdditionalProperties || {}
    },
    isEnabled: t.isEnabled ?? !0,
    getRandom: Tt,
    enrich(r) {
      this.additionalProperties = { ...this.additionalProperties, ...r };
    },
    async track(r, i, a) {
      if (!this.isEnabled)
        return Promise.resolve();
      const { audioPath: o, ...s } = i || {}, l = a || Date.now(), c = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          data: JSON.stringify([
            {
              event: r,
              properties: {
                ...this.additionalProperties,
                ...s,
                agentId: this.agentId,
                source: e,
                token: this.token,
                time: l,
                $insert_id: this.getRandom(),
                origin: window.location.href,
                "Screen Height": window.screen.height || window.innerWidth,
                "Screen Width": window.screen.width || window.innerHeight,
                "User Agent": navigator.userAgent
              }
            }
          ])
        })
      };
      return fetch(Po, c).catch((g) => console.error("Analytics tracking error:", g)), Promise.resolve();
    },
    linkTrack(r, i, a, o) {
      n[r] || (n[r] = { events: {}, resolvedDependencies: [] }), o.includes(a) || o.push(a);
      const s = n[r];
      if (s.events[a] = { props: i }, s.resolvedDependencies.push(a), o.every(
        (l) => s.resolvedDependencies.includes(l)
      )) {
        const l = o.reduce((c, g) => s.events[g] ? { ...c, ...s.events[g].props } : c, {});
        this.track(r, l), s.resolvedDependencies = s.resolvedDependencies.filter(
          (c) => !o.includes(c)
        ), o.forEach((c) => {
          delete s.events[c];
        });
      }
    }
  };
}
function rr() {
  let t = 0;
  return {
    reset: () => t = 0,
    update: () => t = Date.now(),
    get: (e = !1) => e ? Date.now() - t : t
  };
}
const tt = rr(), jn = rr(), Dr = rr();
function Pi(t) {
  return t === R.Playground ? { headers: { [bo]: "true" } } : {};
}
async function Ri(t, e, n, r, i = !1, a) {
  try {
    return !a && !Di(r) && (a = await e.newChat(t.id, { persist: i }, Pi(r)), n.track("agent-chat", {
      event: "created",
      chatId: a.id,
      mode: r
    })), { chat: a, chatMode: (a == null ? void 0 : a.chat_mode) ?? r };
  } catch (o) {
    throw jo(o) === "InsufficientCreditsError" ? new Error("InsufficientCreditsError") : new Error("Cannot create new chat");
  }
}
const jo = (t) => {
  try {
    const e = JSON.parse(t.message);
    return e == null ? void 0 : e.kind;
  } catch {
    return "UnknownError";
  }
};
function zo(t) {
  return t && t.length > 0 ? t : [];
}
function $o(t, e, n, r) {
  const i = nr(t, `${e}/v2/agents/${n}`, r);
  return {
    async createStream(a) {
      return i.post("/sessions", a);
    }
  };
}
const ji = (t, e) => (n, r) => t && console.log(`[${e}] ${n}`, r ?? "");
function Fo(t, e, n) {
  const r = (e.timestamp - t.timestamp) / 1e3;
  return {
    duration: r,
    bytesReceived: e.bytesReceived - t.bytesReceived,
    bitrate: Math.round((e.bytesReceived - t.bytesReceived) * 8 / r),
    packetsReceived: e.packetsReceived - t.packetsReceived,
    packetsLost: e.packetsLost - t.packetsLost,
    framesDropped: e.framesDropped - t.framesDropped,
    framesDecoded: e.framesDecoded - t.framesDecoded,
    jitter: e.jitter,
    avgJitterDelayInInterval: (e.jitterBufferDelay - t.jitterBufferDelay) / (e.jitterBufferEmittedCount - t.jitterBufferEmittedCount),
    jitterBufferEmittedCount: e.jitterBufferEmittedCount - t.jitterBufferEmittedCount,
    jitterBufferDelay: (e.jitterBufferDelay - t.jitterBufferDelay) / r,
    framesPerSecond: e.framesPerSecond,
    freezeCount: e.freezeCount - t.freezeCount,
    freezeDuration: e.freezeDuration - t.freezeDuration,
    lowFpsCount: n
  };
}
function Bo(t) {
  return t.filter(
    (e) => e.freezeCount > 0 || e.framesPerSecond < 21 || e.framesDropped > 0 || e.packetsLost > 0
  ).map((e) => {
    const { timestamp: n, ...r } = e, i = [];
    return e.freezeCount > 0 && i.push("freeze"), e.framesPerSecond < 21 && i.push("low fps"), e.framesDropped > 0 && i.push("frames dropped"), e.packetsLost > 0 && i.push("packet loss"), {
      ...r,
      causes: i
    };
  });
}
function Vo(t) {
  let e = "", n = 0;
  for (const r of t.values()) {
    if (r && r.type === "codec" && r.mimeType.startsWith("video") && (e = r.mimeType.split("/")[1]), r && r.type === "candidate-pair") {
      const i = r.currentRoundTripTime, a = r.nominated === !0;
      i > 0 && (a || n === 0) && (n = i);
    }
    if (r && r.type === "inbound-rtp" && r.kind === "video")
      return {
        codec: e,
        rtt: n,
        timestamp: r.timestamp,
        bytesReceived: r.bytesReceived,
        packetsReceived: r.packetsReceived,
        packetsLost: r.packetsLost,
        framesDropped: r.framesDropped,
        framesDecoded: r.framesDecoded,
        jitter: r.jitter,
        jitterBufferDelay: r.jitterBufferDelay,
        jitterBufferEmittedCount: r.jitterBufferEmittedCount,
        avgJitterDelayInInterval: r.jitterBufferDelay / r.jitterBufferEmittedCount,
        frameWidth: r.frameWidth,
        frameHeight: r.frameHeight,
        framesPerSecond: r.framesPerSecond,
        freezeCount: r.freezeCount,
        freezeDuration: r.totalFreezesDuration
      };
  }
  return {};
}
function Or(t, e, n) {
  const r = t.map((l, c) => c === 0 ? n ? {
    timestamp: l.timestamp,
    duration: 0,
    rtt: l.rtt,
    bytesReceived: l.bytesReceived - n.bytesReceived,
    bitrate: (l.bytesReceived - n.bytesReceived) * 8 / (e / 1e3),
    packetsReceived: l.packetsReceived - n.packetsReceived,
    packetsLost: l.packetsLost - n.packetsLost,
    framesDropped: l.framesDropped - n.framesDropped,
    framesDecoded: l.framesDecoded - n.framesDecoded,
    jitter: l.jitter,
    jitterBufferDelay: l.jitterBufferDelay - n.jitterBufferDelay,
    jitterBufferEmittedCount: l.jitterBufferEmittedCount - n.jitterBufferEmittedCount,
    avgJitterDelayInInterval: (l.jitterBufferDelay - n.jitterBufferDelay) / (l.jitterBufferEmittedCount - n.jitterBufferEmittedCount),
    framesPerSecond: l.framesPerSecond,
    freezeCount: l.freezeCount - n.freezeCount,
    freezeDuration: l.freezeDuration - n.freezeDuration
  } : {
    timestamp: l.timestamp,
    rtt: l.rtt,
    duration: 0,
    bytesReceived: l.bytesReceived,
    bitrate: l.bytesReceived * 8 / (e / 1e3),
    packetsReceived: l.packetsReceived,
    packetsLost: l.packetsLost,
    framesDropped: l.framesDropped,
    framesDecoded: l.framesDecoded,
    jitter: l.jitter,
    jitterBufferDelay: l.jitterBufferDelay,
    jitterBufferEmittedCount: l.jitterBufferEmittedCount,
    avgJitterDelayInInterval: l.jitterBufferDelay / l.jitterBufferEmittedCount,
    framesPerSecond: l.framesPerSecond,
    freezeCount: l.freezeCount,
    freezeDuration: l.freezeDuration
  } : {
    timestamp: l.timestamp,
    duration: e * c / 1e3,
    rtt: l.rtt,
    bytesReceived: l.bytesReceived - t[c - 1].bytesReceived,
    bitrate: (l.bytesReceived - t[c - 1].bytesReceived) * 8 / (e / 1e3),
    packetsReceived: l.packetsReceived - t[c - 1].packetsReceived,
    packetsLost: l.packetsLost - t[c - 1].packetsLost,
    framesDropped: l.framesDropped - t[c - 1].framesDropped,
    framesDecoded: l.framesDecoded - t[c - 1].framesDecoded,
    jitter: l.jitter,
    jitterBufferDelay: l.jitterBufferDelay - t[c - 1].jitterBufferDelay,
    jitterBufferEmittedCount: l.jitterBufferEmittedCount - t[c - 1].jitterBufferEmittedCount,
    avgJitterDelayInInterval: (l.jitterBufferDelay - t[c - 1].jitterBufferDelay) / (l.jitterBufferEmittedCount - t[c - 1].jitterBufferEmittedCount),
    framesPerSecond: l.framesPerSecond,
    freezeCount: l.freezeCount - t[c - 1].freezeCount,
    freezeDuration: l.freezeDuration - t[c - 1].freezeDuration
  }), i = Bo(r), a = i.reduce((l, c) => l + (c.causes.includes("low fps") ? 1 : 0), 0), o = r.filter((l) => !!l.avgJitterDelayInInterval).map((l) => l.avgJitterDelayInInterval), s = r.filter((l) => !!l.rtt).map((l) => l.rtt);
  return {
    webRTCStats: {
      anomalies: i,
      minRtt: Math.min(...s),
      avgRtt: Ar(s),
      maxRtt: Math.max(...s),
      aggregateReport: Fo(t[0], t[t.length - 1], a),
      minJitterDelayInInterval: Math.min(...o),
      maxJitterDelayInInterval: Math.max(...o),
      avgJitterDelayInInterval: Ar(o)
    },
    codec: t[0].codec,
    resolution: `${t[0].frameWidth}x${t[0].frameHeight}`
  };
}
const ln = 100, Uo = Math.max(Math.ceil(400 / ln), 1), Ho = 0.25, Zo = 0.28;
function Ko() {
  let t = 0, e, n, r = 0;
  return (i) => {
    for (const a of i.values())
      if (a && a.type === "inbound-rtp" && a.kind === "video") {
        const o = a.jitterBufferDelay, s = a.jitterBufferEmittedCount;
        if (n && s > n) {
          const g = o - e, d = s - n;
          r = g / d;
        }
        e = o, n = s;
        const l = a.framesDecoded, c = l - t > 0;
        return t = l, { isReceiving: c, avgJitterDelayInInterval: r, freezeCount: a.freezeCount };
      }
    return { isReceiving: !1, avgJitterDelayInInterval: r };
  };
}
function zi(t, e, n, r, i) {
  let a = null, o = [], s, l = 0, c = !1, g = et.Unknown, d = et.Unknown, h = 0, p = 0;
  const f = Ko();
  async function _() {
    const v = await t();
    if (!v)
      return;
    const { isReceiving: y, avgJitterDelayInInterval: C, freezeCount: b } = f(v), w = Vo(v);
    if (y)
      l = 0, h = b - p, d = C < Ho ? et.Strong : C > Zo && h > 1 ? et.Weak : g, d !== g && (i == null || i(d), g = d, p += h, h = 0), c || (r == null || r(ae.Start), s = o[o.length - 1], o = [], c = !0), o.push(w);
    else if (c && (l++, l >= Uo)) {
      const N = Or(o, ln, s);
      r == null || r(ae.Stop, N), e() || n(), p = b, c = !1;
    }
  }
  return {
    start: () => {
      a || (a = setInterval(_, ln));
    },
    stop: () => {
      a && (clearInterval(a), a = null);
    },
    getReport: () => Or(o, ln, s)
  };
}
const Pr = 2e4;
async function Wo() {
  try {
    return await import("./livekit-client.esm-C1GRQdZY-Bo6p8cUq.js");
  } catch {
    throw new Error(
      "LiveKit client is required for this streaming manager. Please install it using: npm install livekit-client"
    );
  }
}
const Go = {
  excellent: et.Strong,
  good: et.Strong,
  poor: et.Weak,
  lost: et.Unknown,
  unknown: et.Unknown
}, Vt = JSON.stringify({
  kind: "InternalServerError",
  description: "Stream Error"
});
var ir = /* @__PURE__ */ ((t) => (t.Chat = "lk.chat", t.Speak = "did.speak", t.Interrupt = "did.interrupt", t))(ir || {});
function zn(t, e, n) {
  var r, i;
  throw e("Failed to connect to LiveKit room:", t), (r = n.onConnectionStateChange) == null || r.call(n, B.Fail, "internal:init-error"), (i = n.onError) == null || i.call(n, t, { sessionId: "" }), t;
}
async function qo(t, e, n) {
  var r;
  const i = ji(n.debug || !1, "LiveKitStreamingManager"), { Room: a, RoomEvent: o, ConnectionState: s, Track: l } = await Wo(), { callbacks: c, auth: g, baseURL: d, analytics: h } = n;
  let p = null, f = !1;
  const _ = ze.Fluent;
  let v = null, y = null, C = null, b = null, w = !1;
  p = new a({
    adaptiveStream: !1,
    // Must be false to use mediaStreamTrack directly
    dynacast: !0
  });
  let N = null, j = je.Idle;
  const z = $o(g, d || Xt, t, c.onError);
  let I, x, m;
  try {
    const O = await z.createStream({
      transport_provider: Cn.Livekit,
      chat_persist: e.chat_persist ?? !0
    }), { id: H, session_token: W, session_url: le } = O;
    (r = c.onStreamCreated) == null || r.call(c, { session_id: H, stream_id: H, agent_id: t }), I = H, x = W, m = le, await p.prepareConnection(m, x);
  } catch (O) {
    zn(O, i, c);
  }
  if (!m || !x || !I)
    return Promise.reject(new Error("Failed to initialize LiveKit stream"));
  p.on(o.ConnectionStateChanged, M).on(o.ConnectionQualityChanged, k).on(o.ParticipantConnected, T).on(o.ParticipantDisconnected, D).on(o.TrackSubscribed, ee).on(o.TrackUnsubscribed, re).on(o.DataReceived, Y).on(o.MediaDevicesError, Q).on(o.TranscriptionReceived, S).on(o.EncryptionError, V).on(o.TrackSubscriptionFailed, L);
  function S(O, H) {
    var W;
    H != null && H.isLocal && (tt.update(), j === je.Talking && ((W = c.onInterruptDetected) == null || W.call(c, { type: "audio" }), j = je.Idle));
  }
  try {
    await p.connect(m, x), i("LiveKit room joined successfully"), N = setTimeout(() => {
      var O;
      i(
        `Track subscription timeout - no track subscribed within ${Pr / 1e3} seconds after connect`
      ), N = null, h.track("connectivity-error", {
        error: "Track subscription timeout",
        sessionId: I
      }), (O = c.onError) == null || O.call(c, new Error("Track subscription timeout"), { sessionId: I }), Ze("internal:track-subscription-timeout");
    }, Pr);
  } catch (O) {
    zn(O, i, c);
  }
  h.enrich({
    "stream-type": _
  });
  function M(O) {
    var H, W, le, de;
    switch (i("Connection state changed:", O), O) {
      case s.Connecting:
        i("CALLBACK: onConnectionStateChange(Connecting)"), (H = c.onConnectionStateChange) == null || H.call(c, B.Connecting, "livekit:connecting");
        break;
      case s.Connected:
        i("LiveKit room connected successfully"), f = !0;
        break;
      case s.Disconnected:
        i("LiveKit room disconnected"), f = !1, w = !1, (W = c.onConnectionStateChange) == null || W.call(c, B.Disconnected, "livekit:disconnected");
        break;
      case s.Reconnecting:
        i("LiveKit room reconnecting..."), (le = c.onConnectionStateChange) == null || le.call(c, B.Connecting, "livekit:reconnecting");
        break;
      case s.SignalReconnecting:
        i("LiveKit room signal reconnecting..."), (de = c.onConnectionStateChange) == null || de.call(c, B.Connecting, "livekit:signal-reconnecting");
        break;
    }
  }
  function k(O, H) {
    var W;
    i("Connection quality:", O), H != null && H.isLocal && ((W = c.onConnectivityStateChange) == null || W.call(c, Go[O]));
  }
  function T(O) {
    i("Participant connected:", O.identity);
  }
  function D(O) {
    i("Participant disconnected:", O.identity), Ze("livekit:participant-disconnected");
  }
  function F() {
    var O;
    b !== ae.Start && (i("CALLBACK: onVideoStateChange(Start)"), b = ae.Start, (O = c.onVideoStateChange) == null || O.call(c, ae.Start));
  }
  function K(O) {
    var H;
    b !== ae.Stop && (i("CALLBACK: onVideoStateChange(Stop)"), b = ae.Stop, (H = c.onVideoStateChange) == null || H.call(c, ae.Stop, O));
  }
  function ee(O, H, W) {
    var le, de, Te;
    i(`Track subscribed: ${O.kind} from ${W.identity}`);
    const _e = O.mediaStreamTrack;
    if (!_e) {
      i(`No mediaStreamTrack available for ${O.kind}`);
      return;
    }
    v ? (v.addTrack(_e), i(`Added ${O.kind} track to shared MediaStream`)) : (v = new MediaStream([_e]), i(`Created shared MediaStream with ${O.kind} track`)), O.kind === "video" && ((le = c.onStreamReady) == null || le.call(c), i("CALLBACK: onSrcObjectReady"), (de = c.onSrcObjectReady) == null || de.call(c, v), w || (w = !0, i("CALLBACK: onConnectionStateChange(Connected)"), (Te = c.onConnectionStateChange) == null || Te.call(c, B.Connected, "livekit:track-subscribed")), C = zi(
      () => O.getRTCStatsReport(),
      () => f,
      ko,
      (Oe, Ue) => {
        i(`Video state change: ${Oe}`), Oe === ae.Start ? (N && (clearTimeout(N), N = null, i("Track subscription timeout cleared")), F()) : Oe === ae.Stop && K(Ue);
      }
    ), C.start());
  }
  function re(O, H, W) {
    i(`Track unsubscribed: ${O.kind} from ${W.identity}`), O.kind === "video" && (K(C == null ? void 0 : C.getReport()), C == null || C.stop(), C = null);
  }
  function Y(O, H, W, le) {
    var de, Te, _e, Oe, Ue, at, ve, ot;
    const Je = new TextDecoder().decode(O);
    try {
      const U = JSON.parse(Je), te = le || U.subject;
      if (i("Data received:", { subject: te, data: U }), te === be.ChatAnswer) {
        const se = Ge.Answer;
        (de = c.onMessage) == null || de.call(c, se, {
          event: se,
          ...U
        });
      } else if (te === be.ChatPartial) {
        const se = Ge.Partial;
        (Te = c.onMessage) == null || Te.call(c, se, {
          event: se,
          ...U
        });
      } else if ([
        be.StreamVideoCreated,
        be.StreamVideoDone,
        be.StreamVideoError,
        be.StreamVideoRejected
      ].includes(te)) {
        j = te === be.StreamVideoCreated ? je.Talking : je.Idle, (_e = c.onAgentActivityStateChange) == null || _e.call(c, j);
        const se = ((Ue = (Oe = C == null ? void 0 : C.getReport()) == null ? void 0 : Oe.webRTCStats) == null ? void 0 : Ue.avgRtt) ?? 0, Se = se > 0 ? Math.round(se / 2 * 1e3) : 0, Le = { ...U, downstreamNetworkLatency: Se };
        n.debug && (at = U == null ? void 0 : U.metadata) != null && at.sentiment && (Le.sentiment = {
          id: U.metadata.sentiment.id,
          name: U.metadata.sentiment.sentiment
        }), (ve = c.onMessage) == null || ve.call(c, te, Le);
      } else if (te === be.ChatAudioTranscribed) {
        const se = Ge.Transcribe;
        (ot = c.onMessage) == null || ot.call(c, se, {
          event: se,
          ...U
        }), queueMicrotask(() => {
          var Se;
          (Se = c.onAgentActivityStateChange) == null || Se.call(c, je.Loading);
        });
      }
    } catch (U) {
      i("Failed to parse data channel message:", U);
    }
  }
  function Q(O) {
    var H;
    i("Media devices error:", O), (H = c.onError) == null || H.call(c, new Error(Vt), { sessionId: I });
  }
  function V(O) {
    var H;
    i("Encryption error:", O), (H = c.onError) == null || H.call(c, new Error(Vt), { sessionId: I });
  }
  function L(O, H, W) {
    i("Track subscription failed:", { trackSid: O, participant: H, reason: W });
  }
  function $(O) {
    if (!p) return null;
    const H = p.localParticipant.audioTrackPublications;
    if (H) {
      for (const [W, le] of H)
        if (le.source === l.Source.Microphone && le.track) {
          const de = le.track.mediaStreamTrack;
          if (de === O || de && de.id === O.id)
            return le;
        }
    }
    return null;
  }
  function X(O) {
    if (!y || !y.track)
      return !1;
    const H = y.track.mediaStreamTrack;
    return H !== O && (H == null ? void 0 : H.id) !== O.id;
  }
  async function oe(O) {
    var H, W;
    if (!f || !p)
      throw i("Room is not connected, cannot publish microphone stream"), new Error("Room is not connected");
    const le = O.getAudioTracks();
    if (le.length === 0) {
      i("No audio track found in the provided MediaStream");
      return;
    }
    const de = le[0], Te = $(de);
    if (Te) {
      i("Microphone track is already published, skipping", {
        trackId: de.id,
        publishedTrackId: (W = (H = Te.track) == null ? void 0 : H.mediaStreamTrack) == null ? void 0 : W.id
      }), y = Te;
      return;
    }
    X(de) && (i("Unpublishing existing microphone track before publishing new one"), await Ie()), i("Publishing microphone track from provided MediaStream", { trackId: de.id });
    try {
      y = await p.localParticipant.publishTrack(de, {
        source: l.Source.Microphone
      }), i("Microphone track published successfully", { trackSid: y.trackSid });
    } catch (_e) {
      throw i("Failed to publish microphone track:", _e), _e;
    }
  }
  async function Ie() {
    if (!(!y || !y.track))
      try {
        p && (await p.localParticipant.unpublishTrack(y.track), i("Microphone track unpublished"));
      } catch (O) {
        i("Error unpublishing microphone track:", O);
      } finally {
        y = null;
      }
  }
  function qe() {
    v && (v.getTracks().forEach((O) => O.stop()), v = null);
  }
  async function Ne(O, H) {
    var W, le;
    if (!f || !p) {
      i("Room is not connected for sending messages"), (W = c.onError) == null || W.call(c, new Error(Vt), {
        sessionId: I
      });
      return;
    }
    try {
      await p.localParticipant.sendText(O, { topic: H }), i("Message sent successfully:", O);
    } catch (de) {
      i("Failed to send message:", de), (le = c.onError) == null || le.call(c, new Error(Vt), { sessionId: I });
    }
  }
  async function Ve(O) {
    var H;
    try {
      const W = JSON.parse(O).topic;
      return Ne("", W);
    } catch (W) {
      i("Failed to send data channel message:", W), (H = c.onError) == null || H.call(c, new Error(Vt), { sessionId: I });
    }
  }
  function $e(O) {
    return Ne(
      O,
      "lk.chat"
      /* Chat */
    );
  }
  async function Ze(O) {
    var H, W;
    N && (clearTimeout(N), N = null), p && (await Ie(), (H = c.onConnectionStateChange) == null || H.call(c, B.Disconnecting, O), await p.disconnect()), qe(), f = !1, w = !1, (W = c.onAgentActivityStateChange) == null || W.call(c, je.Idle), j = je.Idle;
  }
  return {
    speak(O) {
      const H = typeof O == "string" ? O : JSON.stringify(O);
      return Ne(
        H,
        "did.speak"
        /* Speak */
      );
    },
    disconnect: () => Ze("user:disconnect"),
    async reconnect() {
      var O, H;
      if ((p == null ? void 0 : p.state) === s.Connected) {
        i("Room is already connected");
        return;
      }
      if (!p || !m || !x)
        throw i("Cannot reconnect: missing room, URL or token"), new Error("Cannot reconnect: session not available");
      i("Reconnecting to LiveKit room, state:", p.state), w = !1, (O = c.onConnectionStateChange) == null || O.call(c, B.Connecting, "user:reconnect");
      try {
        if (await p.connect(m, x), i("Room reconnected"), f = !0, p.remoteParticipants.size === 0) {
          if (i("Waiting for agent to join..."), !await new Promise((W) => {
            const le = setTimeout(() => {
              p == null || p.off(o.ParticipantConnected, de), W(!1);
            }, 5e3), de = () => {
              clearTimeout(le), p == null || p.off(o.ParticipantConnected, de), W(!0);
            };
            p == null || p.on(o.ParticipantConnected, de);
          }))
            throw i("Agent did not join within timeout"), await p.disconnect(), new Error("Agent did not rejoin the room");
          i("Agent joined, reconnection successful");
        }
      } catch (W) {
        throw i("Failed to reconnect:", W), (H = c.onConnectionStateChange) == null || H.call(c, B.Fail, "user:reconnect-failed"), W;
      }
    },
    sendDataChannelMessage: Ve,
    sendTextMessage: $e,
    publishMicrophoneStream: oe,
    unpublishMicrophoneStream: Ie,
    sessionId: I,
    streamId: I,
    streamType: _,
    interruptAvailable: !0,
    triggersAvailable: !1
  };
}
const Yo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DataChannelTopic: ir,
  createLiveKitStreamingManager: qo,
  handleInitError: zn
}, Symbol.toStringTag, { value: "Module" }));
function Jo(t, e, n) {
  if (!t)
    throw new Error("Please connect to the agent first");
  if (!t.interruptAvailable)
    throw new Error("Interrupt is not enabled for this stream");
  if (e !== ze.Fluent)
    throw new Error("Interrupt only available for Fluent streams");
  if (!n)
    throw new Error("No active video to interrupt");
}
async function Qo(t, e) {
  const n = {
    type: be.StreamInterrupt,
    videoId: e,
    timestamp: Date.now()
  };
  t.sendDataChannelMessage(JSON.stringify(n));
}
async function Xo(t) {
  const e = {
    topic: ir.Interrupt
  };
  t.sendDataChannelMessage(JSON.stringify(e));
}
function es(t) {
  return new Promise((e, n) => {
    const { callbacks: r, host: i, auth: a, externalId: o } = t, { onMessage: s = null, onOpen: l = null, onClose: c = null, onError: g = null } = r || {}, d = new WebSocket(`${i}?authorization=${encodeURIComponent(Oi(a, o))}`);
    d.onmessage = s, d.onclose = c, d.onerror = (h) => {
      console.error(h), g == null || g("Websocket failed to connect", h), n(h);
    }, d.onopen = (h) => {
      l == null || l(h), e(d);
    };
  });
}
async function ts(t) {
  const { retries: e = 1 } = t;
  let n = null;
  for (let r = 0; (n == null ? void 0 : n.readyState) !== WebSocket.OPEN; r++)
    try {
      n = await es(t);
    } catch (i) {
      if (r === e)
        throw i;
      await Ai(r * 500);
    }
  return n;
}
async function ns(t, e, n, r) {
  const i = n != null && n.onMessage ? [n.onMessage] : [], a = await ts({
    auth: t,
    host: e,
    externalId: r,
    callbacks: {
      onError: (o) => {
        var s;
        return (s = n.onError) == null ? void 0 : s.call(n, new wo(o));
      },
      onMessage(o) {
        const s = JSON.parse(o.data);
        i.forEach((l) => l(s.event, s));
      }
    }
  });
  return {
    socket: a,
    disconnect: () => a.close(),
    subscribeToEvents: (o) => i.push(o)
  };
}
function rs(t) {
  if (t.answer !== void 0)
    return t.answer;
  let e = 0, n = "";
  for (; e in t; )
    n += t[e++];
  return n;
}
function is(t, e, n) {
  if (!t.content)
    return;
  const r = e.messages[e.messages.length - 1];
  (r == null ? void 0 : r.role) === "assistant" && !r.interrupted && (r.interrupted = !0);
  const i = {
    id: t.id || `user-${Date.now()}`,
    role: t.role,
    content: t.content,
    created_at: t.created_at || (/* @__PURE__ */ new Date()).toISOString(),
    transcribed: !0
  };
  e.messages.push(i), n == null || n([...e.messages], "user");
}
function as(t, e, n, r, i) {
  if (t === Ge.Transcribe && e.content) {
    is(e, r, i);
    return;
  }
  if (!(t === Ge.Partial || t === Ge.Answer))
    return;
  const a = r.messages[r.messages.length - 1];
  let o;
  if (a != null && a.transcribed && a.role === "user")
    t === Ge.Answer && e.content, o = {
      id: e.id || `assistant-${Date.now()}`,
      role: e.role || "assistant",
      content: e.content || "",
      created_at: e.created_at || (/* @__PURE__ */ new Date()).toISOString()
    }, r.messages.push(o);
  else if ((a == null ? void 0 : a.role) === "assistant")
    o = a;
  else
    return;
  const { content: s, sequence: l } = e;
  t === Ge.Partial ? n[l] = s : n.answer = s;
  const c = rs(n);
  (o.content !== c || t === Ge.Answer) && (o.content = c, i == null || i([...r.messages], t));
}
function os(t, e, n, r, i) {
  let a = {};
  const o = () => a = {};
  let s = "answer";
  const l = (c, g) => {
    var d, h;
    g === "user" && o(), s = g, (h = (d = n.callbacks).onNewMessage) == null || h.call(d, c, g);
  };
  return {
    clearQueue: o,
    onMessage: (c, g) => {
      var d, h;
      if ("content" in g) {
        const p = c === be.ChatAnswer ? Ge.Answer : c === be.ChatAudioTranscribed ? Ge.Transcribe : c;
        as(p, g, a, e, l), p === Ge.Answer && t.track("agent-message-received", {
          content: g.content,
          messages: e.messages.length,
          mode: e.chatMode
        });
      } else {
        const p = be, f = [p.StreamVideoDone, p.StreamVideoError, p.StreamVideoRejected], _ = [p.StreamFailed, p.StreamVideoError, p.StreamVideoRejected], v = Oo(g, r, { mode: e.chatMode });
        if (c = c, c === p.StreamVideoCreated && (t.linkTrack("agent-video", v, p.StreamVideoCreated, ["start"]), g.sentiment)) {
          const y = e.messages[e.messages.length - 1];
          if ((y == null ? void 0 : y.role) === "assistant") {
            const C = { ...y, sentiment: g.sentiment };
            e.messages[e.messages.length - 1] = C, l == null || l([...e.messages], s);
          }
        }
        if (f.includes(c)) {
          const y = c.split("/")[1];
          _.includes(c) ? t.track("agent-video", { ...v, event: y }) : t.linkTrack("agent-video", { ...v, event: y }, c, ["done"]);
        }
        _.includes(c) && ((h = (d = n.callbacks).onError) == null || h.call(d, new Error(`Stream failed with event ${c}`), { data: g })), g.event === p.StreamDone && i();
      }
    }
  };
}
function ss(t, e, n, r) {
  const i = nr(t, `${e}/agents/${n}`, r);
  return {
    createStream(a, o) {
      return i.post("/streams", a, { signal: o });
    },
    startConnection(a, o, s, l) {
      return i.post(
        `/streams/${a}/sdp`,
        {
          session_id: s,
          answer: o
        },
        { signal: l }
      );
    },
    addIceCandidate(a, o, s, l) {
      return i.post(
        `/streams/${a}/ice`,
        {
          session_id: s,
          ...o
        },
        { signal: l }
      );
    },
    sendStreamRequest(a, o, s) {
      return i.post(`/streams/${a}`, {
        session_id: o,
        ...s
      });
    },
    close(a, o) {
      return i.delete(`/streams/${a}`, { session_id: o });
    }
  };
}
const cs = (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection).bind(window);
function Rr(t) {
  switch (t) {
    case "connected":
      return B.Connected;
    case "checking":
      return B.Connecting;
    case "failed":
      return B.Fail;
    case "new":
      return B.New;
    case "closed":
      return B.Closed;
    case "disconnected":
      return B.Disconnected;
    case "completed":
      return B.Completed;
    default:
      return B.New;
  }
}
const ls = (t) => (e) => {
  const [n, r = ""] = e.split(/:(.+)/);
  try {
    const i = JSON.parse(r);
    return t("parsed data channel message", { subject: n, data: i }), { subject: n, data: i };
  } catch (i) {
    return t("Failed to parse data channel message, returning data as string", { subject: n, rawData: r, error: i }), { subject: n, data: r };
  }
};
function ds({
  statsSignal: t,
  dataChannelSignal: e,
  onVideoStateChange: n,
  report: r,
  log: i
}) {
  t === ae.Start && e === ae.Start ? (i("CALLBACK: onVideoStateChange(Start)"), n == null || n(ae.Start)) : t === ae.Stop && e === ae.Stop && (i("CALLBACK: onVideoStateChange(Stop)"), n == null || n(ae.Stop, r));
}
function us({
  statsSignal: t,
  dataChannelSignal: e,
  onVideoStateChange: n,
  onAgentActivityStateChange: r,
  report: i,
  log: a
}) {
  t === ae.Start ? (a("CALLBACK: onVideoStateChange(Start)"), n == null || n(ae.Start)) : t === ae.Stop && (a("CALLBACK: onVideoStateChange(Stop)"), n == null || n(ae.Stop, i)), e === ae.Start ? r == null || r(je.Talking) : e === ae.Stop && (r == null || r(je.Idle));
}
function jr({
  statsSignal: t,
  dataChannelSignal: e,
  onVideoStateChange: n,
  onAgentActivityStateChange: r,
  streamType: i,
  report: a,
  log: o
}) {
  i === ze.Legacy ? ds({ statsSignal: t, dataChannelSignal: e, onVideoStateChange: n, report: a, log: o }) : i === ze.Fluent && us({
    statsSignal: t,
    dataChannelSignal: e,
    onVideoStateChange: n,
    onAgentActivityStateChange: r,
    report: a,
    log: o
  });
}
async function hs(t, e, { debug: n = !1, callbacks: r, auth: i, baseURL: a = Xt, analytics: o }, s) {
  var l;
  const c = ji(n, "WebRTCStreamingManager"), g = ls(c);
  let d = !1, h = !1, p = ae.Stop, f = ae.Stop;
  const { startConnection: _, sendStreamRequest: v, close: y, createStream: C, addIceCandidate: b } = ss(
    i,
    a,
    t,
    r.onError
  ), {
    id: w,
    offer: N,
    ice_servers: j,
    session_id: z,
    fluent: I,
    interrupt_enabled: x,
    triggers_enabled: m
  } = await C(e, s);
  (l = r.onStreamCreated) == null || l.call(r, { stream_id: w, session_id: z, agent_id: t });
  const S = new cs({ iceServers: j }), M = S.createDataChannel("JanusDataChannel");
  if (!z)
    throw new Error("Could not create session_id");
  const k = I ? ze.Fluent : ze.Legacy;
  o.enrich({
    "stream-type": k
  });
  const T = e.stream_warmup && !I, D = () => d, F = () => {
    var L;
    d = !0, h && (c("CALLBACK: onConnectionStateChange(Connected)"), (L = r.onConnectionStateChange) == null || L.call(r, B.Connected));
  }, K = zi(
    () => S.getStats(),
    D,
    F,
    (L, $) => jr({
      statsSignal: f = L,
      dataChannelSignal: k === ze.Legacy ? p : void 0,
      onVideoStateChange: r.onVideoStateChange,
      onAgentActivityStateChange: r.onAgentActivityStateChange,
      report: $,
      streamType: k,
      log: c
    }),
    (L) => {
      var $;
      return ($ = r.onConnectivityStateChange) == null ? void 0 : $.call(r, L);
    }
  );
  K.start(), S.onicecandidate = (L) => {
    var $;
    c("peerConnection.onicecandidate", L);
    try {
      L.candidate && L.candidate.sdpMid && L.candidate.sdpMLineIndex !== null ? b(
        w,
        {
          candidate: L.candidate.candidate,
          sdpMid: L.candidate.sdpMid,
          sdpMLineIndex: L.candidate.sdpMLineIndex
        },
        z,
        s
      ) : b(w, { candidate: null }, z, s);
    } catch (X) {
      ($ = r.onError) == null || $.call(r, X, { streamId: w });
    }
  }, M.onopen = () => {
    h = !0, (!T || d) && F();
  };
  const ee = (L) => {
    var $;
    ($ = r.onVideoIdChange) == null || $.call(r, L);
  };
  function re(L, $) {
    if (L === be.StreamStarted && typeof $ == "object" && "metadata" in $) {
      const X = $.metadata;
      ee(X.videoId);
    }
    L === be.StreamDone && ee(null), p = L === be.StreamStarted ? ae.Start : ae.Stop, jr({
      statsSignal: k === ze.Legacy ? f : void 0,
      dataChannelSignal: p,
      onVideoStateChange: r.onVideoStateChange,
      onAgentActivityStateChange: r.onAgentActivityStateChange,
      streamType: k,
      log: c
    });
  }
  function Y(L, $) {
    var X;
    const oe = typeof $ == "string" ? $ : $ == null ? void 0 : $.metadata;
    oe && o.enrich({ streamMetadata: oe }), (X = r.onStreamReady) == null || X.call(r);
  }
  const Q = {
    [be.StreamStarted]: re,
    [be.StreamDone]: re,
    [be.StreamReady]: Y
  };
  M.onmessage = (L) => {
    var $;
    const { subject: X, data: oe } = g(L.data);
    ($ = Q[X]) == null || $.call(Q, X, oe);
  }, S.oniceconnectionstatechange = () => {
    var L;
    c("peerConnection.oniceconnectionstatechange => " + S.iceConnectionState);
    const $ = Rr(S.iceConnectionState);
    $ !== B.Connected && ((L = r.onConnectionStateChange) == null || L.call(r, $));
  }, S.ontrack = (L) => {
    var $;
    c("peerConnection.ontrack", L), c("CALLBACK: onSrcObjectReady"), ($ = r.onSrcObjectReady) == null || $.call(r, L.streams[0]);
  }, await S.setRemoteDescription(N), c("set remote description OK");
  const V = await S.createAnswer();
  return c("create answer OK"), await S.setLocalDescription(V), c("set local description OK"), await _(w, V, z, s), c("start connection OK"), {
    /**
     * Method to send request to server to get clip or talk depend on you payload
     * @param payload
     */
    speak(L) {
      return v(w, z, L);
    },
    /**
     * Method to close RTC connection
     */
    async disconnect() {
      var L;
      if (w) {
        const $ = Rr(S.iceConnectionState);
        if (S) {
          if ($ === B.New) {
            K.stop();
            return;
          }
          S.close(), S.oniceconnectionstatechange = null, S.onnegotiationneeded = null, S.onicecandidate = null, S.ontrack = null;
        }
        try {
          $ === B.Connected && await y(w, z).catch((X) => {
          });
        } catch (X) {
          c("Error on close stream connection", X);
        }
        (L = r.onAgentActivityStateChange) == null || L.call(r, je.Idle), K.stop();
      }
    },
    /**
     * Method to send data channel messages to the server
     */
    sendDataChannelMessage(L) {
      var $, X;
      if (!d || M.readyState !== "open") {
        c("Data channel is not ready for sending messages"), ($ = r.onError) == null || $.call(r, new Error("Data channel is not ready for sending messages"), {
          streamId: w
        });
        return;
      }
      try {
        M.send(L);
      } catch (oe) {
        c("Error sending data channel message", oe), (X = r.onError) == null || X.call(r, oe, { streamId: w });
      }
    },
    /**
     * Session identifier information, should be returned in the body of all streaming requests
     */
    sessionId: z,
    /**
     * Id of current RTC stream
     */
    streamId: w,
    streamType: k,
    interruptAvailable: x ?? !1,
    triggersAvailable: m ?? !1
  };
}
var $n = /* @__PURE__ */ ((t) => (t.V1 = "v1", t.V2 = "v2", t))($n || {});
async function fs(t, e, n, r) {
  const i = t.id;
  switch (e.version) {
    case "v1": {
      const { version: a, ...o } = e;
      return hs(i, o, n, r);
    }
    case "v2": {
      const { version: a, ...o } = e;
      switch (o.transport_provider) {
        case Cn.Livekit:
          const { createLiveKitStreamingManager: s } = await Promise.resolve().then(() => Yo);
          return s(i, o, n);
        default:
          throw new Error(`Unsupported transport provider: ${o.transport_provider}`);
      }
    }
    default:
      throw new Error(`Invalid stream version: ${e.version}`);
  }
}
const gs = "cht";
function ps() {
  return {
    transport_provider: Cn.Livekit
  };
}
function ms(t) {
  var e, n;
  const { streamOptions: r } = t ?? {}, i = ((e = t == null ? void 0 : t.mixpanelAdditionalProperties) == null ? void 0 : e.plan) !== void 0 ? {
    plan: (n = t.mixpanelAdditionalProperties) == null ? void 0 : n.plan
  } : void 0;
  return { output_resolution: r == null ? void 0 : r.outputResolution, session_timeout: r == null ? void 0 : r.sessionTimeout, stream_warmup: r == null ? void 0 : r.streamWarmup, compatibility_mode: r == null ? void 0 : r.compatibilityMode, fluent: r == null ? void 0 : r.fluent, ...i && { end_user_data: i } };
}
function _s(t, e) {
  return tr(t.presenter.type) ? { version: $n.V2, ...ps() } : { version: $n.V1, ...ms(e) };
}
function vs(t, e, n) {
  n.track("agent-connection-state-change", { state: t, ...e && { reason: e } });
}
function ys(t, e, n, r, i) {
  i === ze.Fluent ? ws(t, e, n, r, i) : bs(t, e, n, r, i);
}
function ws(t, e, n, r, i) {
  t === ae.Start ? r.track("stream-session", { event: "start", "stream-type": i }) : t === ae.Stop && r.track("stream-session", {
    event: "stop",
    is_greenscreen: e.presenter.type === "clip" && e.presenter.is_greenscreen,
    background: e.presenter.type === "clip" && e.presenter.background,
    "stream-type": i,
    ...n
  });
}
function Cs(t, e, n, r) {
  tt.get() <= 0 || (t === ae.Start ? n.linkTrack(
    "agent-video",
    { event: "start", latency: tt.get(!0), "stream-type": r },
    "start",
    [be.StreamVideoCreated]
  ) : t === ae.Stop && n.linkTrack(
    "agent-video",
    {
      event: "stop",
      is_greenscreen: e.presenter.type === "clip" && e.presenter.is_greenscreen,
      background: e.presenter.type === "clip" && e.presenter.background,
      "stream-type": r
    },
    "done",
    [be.StreamVideoDone]
  ));
}
function bs(t, e, n, r, i) {
  tt.get() <= 0 || (t === ae.Start ? r.linkTrack(
    "agent-video",
    { event: "start", latency: tt.get(!0), "stream-type": i },
    "start",
    [be.StreamVideoCreated]
  ) : t === ae.Stop && r.linkTrack(
    "agent-video",
    {
      event: "stop",
      is_greenscreen: e.presenter.type === "clip" && e.presenter.is_greenscreen,
      background: e.presenter.type === "clip" && e.presenter.background,
      "stream-type": i,
      ...n
    },
    "done",
    [be.StreamVideoDone]
  ));
}
function zr(t, e, n, r) {
  return tt.reset(), Dr.update(), new Promise(async (i, a) => {
    try {
      let o, s = !1;
      const l = _s(t, e);
      n.enrich({
        "stream-version": l.version.toString()
      }), o = await fs(
        t,
        l,
        {
          ...e,
          analytics: n,
          callbacks: {
            ...e.callbacks,
            onConnectionStateChange: (c, g) => {
              var d, h;
              (h = (d = e.callbacks).onConnectionStateChange) == null || h.call(d, c), vs(c, g, n), c === B.Connected && (o ? i(o) : s = !0);
            },
            onVideoStateChange: (c, g) => {
              var d, h;
              (h = (d = e.callbacks).onVideoStateChange) == null || h.call(d, c), ys(
                c,
                t,
                g,
                n,
                o.streamType
              );
            },
            onAgentActivityStateChange: (c) => {
              var g, d;
              (d = (g = e.callbacks).onAgentActivityStateChange) == null || d.call(g, c), c === je.Talking ? jn.update() : jn.reset(), Cs(
                c === je.Talking ? ae.Start : ae.Stop,
                t,
                n,
                o.streamType
              );
            },
            onStreamReady: () => {
              const c = Dr.get(!0);
              n.track("agent-chat", { event: "ready", latency: c });
            }
          }
        },
        r
      ), s && i(o);
    } catch (o) {
      a(o);
    }
  });
}
async function Ss(t, e, n, r, i) {
  var a, o, s, l;
  const c = async () => {
    if (tr(t.presenter.type)) {
      const f = await zr(t, e, r), _ = `${gs}_${f.sessionId}`, v = (/* @__PURE__ */ new Date()).toISOString();
      return { chatResult: {
        chatMode: R.Functional,
        chat: {
          id: _,
          agent_id: t.id,
          owner_id: t.owner_id ?? "",
          created: v,
          modified: v,
          agent_id__created_at: v,
          agent_id__modified_at: v,
          chat_mode: R.Functional,
          messages: []
        }
      }, streamingManager: f };
    } else {
      const f = new AbortController(), _ = f.signal;
      let v;
      try {
        const y = Ri(
          t,
          n,
          r,
          e.mode,
          e.persistentChat,
          i
        ), C = zr(t, e, r, _).then((N) => (v = N, N)), [b, w] = await Promise.all([y, C]);
        return { chatResult: b, streamingManager: w };
      } catch (y) {
        throw f.abort(), v && await v.disconnect().catch(() => {
        }), y;
      }
    }
  }, { chatResult: g, streamingManager: d } = await c(), { chat: h, chatMode: p } = g;
  return p && e.mode !== void 0 && p !== e.mode && (e.mode = p, (o = (a = e.callbacks).onModeChange) == null || o.call(a, p), p !== R.Functional) ? ((l = (s = e.callbacks).onError) == null || l.call(s, new yo(p)), d == null || d.disconnect(), { chat: h }) : { chat: h, streamingManager: d };
}
async function Ms(t, e) {
  var n, r, i, a;
  let o = !0, s = null;
  const l = e.mixpanelKey || Mo, c = e.wsURL || So, g = e.baseURL || Xt, d = e.mode || R.Functional, h = {
    messages: [],
    chatMode: d
  }, p = Ro({
    token: l,
    agentId: t,
    isEnabled: e.enableAnalitics,
    externalId: e.externalId,
    mixpanelAdditionalProperties: e.mixpanelAdditionalProperties
  }), f = Date.now();
  Tr(() => {
    p.track("agent-sdk", { event: "init" }, f);
  });
  const _ = Eo(e.auth, g, e.callbacks.onError, e.externalId), v = await _.getById(t);
  e.debug = e.debug || ((n = v == null ? void 0 : v.advanced_settings) == null ? void 0 : n.ui_debug_mode);
  const y = tr(v.presenter.type);
  p.enrich(To(v));
  const { onMessage: C, clearQueue: b } = os(
    p,
    h,
    e,
    v,
    () => {
      var m;
      return (m = h.socketManager) == null ? void 0 : m.disconnect();
    }
  );
  h.messages = zo(e.initialMessages), (i = (r = e.callbacks).onNewMessage) == null || i.call(r, [...h.messages], "answer");
  const w = (m) => {
    s = m;
  }, N = ({ type: m }) => {
    var S, M, k;
    const T = h.messages[h.messages.length - 1];
    p.track("agent-video-interrupt", {
      type: m || "click",
      video_duration_to_interrupt: jn.get(!0),
      message_duration_to_interrupt: tt.get(!0)
    }), T.interrupted = !0, (M = (S = e.callbacks).onNewMessage) == null || M.call(S, [...h.messages], "answer"), y ? Xo(h.streamingManager) : (Jo(h.streamingManager, (k = h.streamingManager) == null ? void 0 : k.streamType, s), Qo(h.streamingManager, s));
  }, j = Date.now();
  Tr(() => {
    p.track("agent-sdk", { event: "loaded", ...Ao(v) }, j);
  });
  async function z(m) {
    var S, M, k, T, D, F, K;
    (M = (S = e.callbacks).onConnectionStateChange) == null || M.call(S, B.Connecting), tt.reset(), m && !o && (delete h.chat, (T = (k = e.callbacks).onNewMessage) == null || T.call(k, [...h.messages], "answer"));
    const ee = d === R.DirectPlayback || y ? Promise.resolve(void 0) : ns(
      e.auth,
      c,
      { onMessage: C, onError: e.callbacks.onError },
      e.externalId
    ), re = Pn(
      () => Ss(
        v,
        {
          ...e,
          mode: d,
          callbacks: {
            ...e.callbacks,
            onVideoIdChange: w,
            onMessage: C,
            onInterruptDetected: N
          }
        },
        _,
        p,
        h.chat
      ),
      {
        limit: 3,
        timeout: Co,
        timeoutErrorMessage: "Timeout initializing the stream",
        shouldRetryFn: (L) => (L == null ? void 0 : L.message) !== "Could not connect" && L.status !== 429 && (L == null ? void 0 : L.message) !== "InsufficientCreditsError",
        delayMs: 1e3
      }
    ).catch((L) => {
      var $, X;
      throw x(R.Maintenance), (X = ($ = e.callbacks).onConnectionStateChange) == null || X.call($, B.Fail), L;
    }), [Y, { streamingManager: Q, chat: V }] = await Promise.all([ee, re]);
    V && V.id !== ((D = h.chat) == null ? void 0 : D.id) && ((K = (F = e.callbacks).onNewChat) == null || K.call(F, V.id)), h.streamingManager = Q, h.socketManager = Y, h.chat = V, o = !1, p.enrich({
      chatId: V == null ? void 0 : V.id,
      streamId: Q == null ? void 0 : Q.streamId,
      mode: h.chatMode
    }), x((V == null ? void 0 : V.chat_mode) ?? d);
  }
  async function I() {
    var m, S, M, k;
    (m = h.socketManager) == null || m.disconnect(), await ((S = h.streamingManager) == null ? void 0 : S.disconnect()), delete h.streamingManager, delete h.socketManager, (k = (M = e.callbacks).onConnectionStateChange) == null || k.call(M, B.Disconnected);
  }
  async function x(m) {
    var S, M;
    m !== h.chatMode && (p.track("agent-mode-change", { mode: m }), h.chatMode = m, h.chatMode !== R.Functional && await I(), (M = (S = e.callbacks).onModeChange) == null || M.call(S, m));
  }
  return {
    agent: v,
    getStreamType: () => {
      var m;
      return (m = h.streamingManager) == null ? void 0 : m.streamType;
    },
    getIsInterruptAvailable: () => {
      var m;
      return ((m = h.streamingManager) == null ? void 0 : m.interruptAvailable) ?? !1;
    },
    getIsTriggersAvailable: () => {
      var m;
      return ((m = h.streamingManager) == null ? void 0 : m.triggersAvailable) ?? !1;
    },
    starterMessages: ((a = v.knowledge) == null ? void 0 : a.starter_message) || [],
    getSTTToken: () => _.getSTTToken(v.id),
    changeMode: x,
    enrichAnalytics: p.enrich,
    async connect() {
      await z(!0), p.track("agent-chat", {
        event: "connect",
        mode: h.chatMode
      });
    },
    async reconnect() {
      const m = h.streamingManager;
      if (y && m != null && m.reconnect) {
        try {
          await m.reconnect(), p.track("agent-chat", {
            event: "reconnect",
            mode: h.chatMode
          });
        } catch {
          await I(), await z(!1);
        }
        return;
      }
      await I(), await z(!1), p.track("agent-chat", {
        event: "reconnect",
        mode: h.chatMode
      });
    },
    async disconnect() {
      await I(), p.track("agent-chat", {
        event: "disconnect",
        mode: h.chatMode
      });
    },
    async publishMicrophoneStream(m) {
      var S;
      if (!((S = h.streamingManager) != null && S.publishMicrophoneStream))
        throw new Error("publishMicrophoneStream is not available for this streaming manager");
      return h.streamingManager.publishMicrophoneStream(m);
    },
    async unpublishMicrophoneStream() {
      var m;
      if (!((m = h.streamingManager) != null && m.unpublishMicrophoneStream))
        throw new Error("unpublishMicrophoneStream is not available for this streaming manager");
      return h.streamingManager.unpublishMicrophoneStream();
    },
    async chat(m) {
      var S, M, k, T, D;
      const F = () => {
        if (Di(d))
          throw new It(`${d} is enabled, chat is disabled`);
        if (m.length >= 800)
          throw new It("Message cannot be more than 800 characters");
        if (m.length === 0)
          throw new It("Message cannot be empty");
        if (h.chatMode === R.Maintenance)
          throw new It("Chat is in maintenance mode");
        if (![R.TextOnly, R.Playground].includes(h.chatMode)) {
          if (!h.streamingManager)
            throw new It("Streaming manager is not initialized");
          if (!h.chat)
            throw new It("Chat is not initialized");
        }
      }, K = async () => {
        var re, Y;
        if (!h.chat) {
          const Q = await Ri(
            v,
            _,
            p,
            h.chatMode,
            e.persistentChat
          );
          if (!Q.chat)
            throw new vo(h.chatMode, !!e.persistentChat);
          h.chat = Q.chat, (Y = (re = e.callbacks).onNewChat) == null || Y.call(re, h.chat.id);
        }
        return h.chat.id;
      }, ee = async (re, Y) => {
        const Q = h.chatMode === R.Playground;
        return Pn(y && !Q ? async () => {
          var V, L;
          return await ((L = (V = h.streamingManager) == null ? void 0 : V.sendTextMessage) == null ? void 0 : L.call(V, m)), Promise.resolve({});
        } : async () => {
          var V, L;
          return _.chat(
            v.id,
            Y,
            {
              chatMode: h.chatMode,
              streamId: (V = h.streamingManager) == null ? void 0 : V.streamId,
              sessionId: (L = h.streamingManager) == null ? void 0 : L.sessionId,
              messages: re.map(({ matches: $, ...X }) => X)
            },
            {
              ...Pi(h.chatMode),
              skipErrorHandler: !0
            }
          );
        }, {
          limit: 2,
          shouldRetryFn: (V) => {
            var L, $, X, oe;
            const Ie = (L = V == null ? void 0 : V.message) == null ? void 0 : L.includes("missing or invalid session_id");
            return !(($ = V == null ? void 0 : V.message) != null && $.includes("Stream Error")) && !Ie ? ((oe = (X = e.callbacks).onError) == null || oe.call(X, V), !1) : !0;
          },
          onRetry: async () => {
            await I(), await z(!1);
          }
        });
      };
      try {
        b(), F(), h.messages.push({
          id: Tt(),
          role: "user",
          content: m,
          created_at: new Date(tt.update()).toISOString()
        }), (M = (S = e.callbacks).onNewMessage) == null || M.call(S, [...h.messages], "user");
        const re = await K(), Y = await ee([...h.messages], re);
        return h.messages.push({
          id: Tt(),
          role: "assistant",
          content: Y.result || "",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          context: Y.context,
          matches: Y.matches
        }), p.track("agent-message-send", {
          event: "success",
          messages: h.messages.length + 1
        }), Y.result && ((T = (k = e.callbacks).onNewMessage) == null || T.call(k, [...h.messages], "answer"), p.track("agent-message-received", {
          latency: tt.get(!0),
          messages: h.messages.length
        })), Y;
      } catch (re) {
        throw ((D = h.messages[h.messages.length - 1]) == null ? void 0 : D.role) === "assistant" && h.messages.pop(), p.track("agent-message-send", {
          event: "error",
          messages: h.messages.length
        }), re;
      }
    },
    rate(m, S, M) {
      var k, T, D, F;
      const K = h.messages.find((re) => re.id === m);
      if (h.chat) {
        if (!K)
          throw new Error("Message not found");
      } else throw new Error("Chat is not initialized");
      const ee = ((k = K.matches) == null ? void 0 : k.map((re) => [re.document_id, re.id])) ?? [];
      return p.track("agent-rate", {
        event: M ? "update" : "create",
        thumb: S === 1 ? "up" : "down",
        knowledge_id: ((T = v.knowledge) == null ? void 0 : T.id) ?? "",
        matches: ee,
        score: S
      }), M ? _.updateRating(v.id, h.chat.id, M, {
        knowledge_id: ((D = v.knowledge) == null ? void 0 : D.id) ?? "",
        message_id: m,
        matches: ee,
        score: S
      }) : _.createRating(v.id, h.chat.id, {
        knowledge_id: ((F = v.knowledge) == null ? void 0 : F.id) ?? "",
        message_id: m,
        matches: ee,
        score: S
      });
    },
    deleteRate(m) {
      if (!h.chat)
        throw new Error("Chat is not initialized");
      return p.track("agent-rate-delete", { type: "text" }), _.deleteRating(v.id, h.chat.id, m);
    },
    async speak(m) {
      var S, M, k;
      function T() {
        if (typeof m == "string") {
          if (!v.presenter.voice)
            throw new Error("Presenter voice is not initialized");
          return {
            type: "text",
            provider: v.presenter.voice,
            input: m,
            ssml: !1
          };
        }
        if (m.type === "text" && !m.provider) {
          if (!v.presenter.voice)
            throw new Error("Presenter voice is not initialized");
          return {
            type: "text",
            provider: v.presenter.voice,
            input: m.input,
            ssml: m.ssml
          };
        }
        return m;
      }
      const D = T();
      if (p.track("agent-speak", D), tt.update(), h.messages && D.type === "text" && (h.messages.push({
        id: Tt(),
        role: "assistant",
        content: D.input,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }), (M = (S = e.callbacks).onNewMessage) == null || M.call(S, [...h.messages], "answer")), Lo(h.chatMode))
        return {
          duration: 0,
          video_id: "",
          status: "success"
        };
      if (!h.streamingManager)
        throw new Error("Please connect to the agent first");
      return h.streamingManager.speak({
        script: D,
        metadata: { chat_id: (k = h.chat) == null ? void 0 : k.id, agent_id: v.id }
      });
    },
    interrupt: N
  };
}
const id = "false", ks = "prod", Ls = "https://api.d-id.com", xs = "wss://notifications.d-id.com", $i = "2.0.12", Is = "62d004045797ac11b0801d86", Fn = {
  mixpanelKey: "1a34d015dabbfa3d87482f1a647861fd"
}, J = (t) => typeof t == "string", Ut = () => {
  let t, e;
  const n = new Promise((r, i) => {
    t = r, e = i;
  });
  return n.resolve = t, n.reject = e, n;
}, $r = (t) => t == null ? "" : "" + t, Ns = (t, e, n) => {
  t.forEach((r) => {
    e[r] && (n[r] = e[r]);
  });
}, Es = /###/g, Fr = (t) => t && t.indexOf("###") > -1 ? t.replace(Es, ".") : t, Br = (t) => !t || J(t), Kt = (t, e, n) => {
  const r = J(e) ? e.split(".") : e;
  let i = 0;
  for (; i < r.length - 1; ) {
    if (Br(t)) return {};
    const a = Fr(r[i]);
    !t[a] && n && (t[a] = new n()), Object.prototype.hasOwnProperty.call(t, a) ? t = t[a] : t = {}, ++i;
  }
  return Br(t) ? {} : {
    obj: t,
    k: Fr(r[i])
  };
}, Vr = (t, e, n) => {
  const {
    obj: r,
    k: i
  } = Kt(t, e, Object);
  if (r !== void 0 || e.length === 1) {
    r[i] = n;
    return;
  }
  let a = e[e.length - 1], o = e.slice(0, e.length - 1), s = Kt(t, o, Object);
  for (; s.obj === void 0 && o.length; )
    a = `${o[o.length - 1]}.${a}`, o = o.slice(0, o.length - 1), s = Kt(t, o, Object), s != null && s.obj && typeof s.obj[`${s.k}.${a}`] < "u" && (s.obj = void 0);
  s.obj[`${s.k}.${a}`] = n;
}, As = (t, e, n, r) => {
  const {
    obj: i,
    k: a
  } = Kt(t, e, Object);
  i[a] = i[a] || [], i[a].push(n);
}, un = (t, e) => {
  const {
    obj: n,
    k: r
  } = Kt(t, e);
  if (n && Object.prototype.hasOwnProperty.call(n, r))
    return n[r];
}, Ts = (t, e, n) => {
  const r = un(t, n);
  return r !== void 0 ? r : un(e, n);
}, Fi = (t, e, n) => {
  for (const r in e)
    r !== "__proto__" && r !== "constructor" && (r in t ? J(t[r]) || t[r] instanceof String || J(e[r]) || e[r] instanceof String ? n && (t[r] = e[r]) : Fi(t[r], e[r], n) : t[r] = e[r]);
  return t;
}, Nt = (t) => t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var Ds = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const Os = (t) => J(t) ? t.replace(/[&<>"'\/]/g, (e) => Ds[e]) : t;
class Ps {
  constructor(e) {
    this.capacity = e, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(e) {
    const n = this.regExpMap.get(e);
    if (n !== void 0)
      return n;
    const r = new RegExp(e);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, r), this.regExpQueue.push(e), r;
  }
}
const Rs = [" ", ",", "?", "!", ";"], js = new Ps(20), zs = (t, e, n) => {
  e = e || "", n = n || "";
  const r = Rs.filter((o) => e.indexOf(o) < 0 && n.indexOf(o) < 0);
  if (r.length === 0) return !0;
  const i = js.getRegExp(`(${r.map((o) => o === "?" ? "\\?" : o).join("|")})`);
  let a = !i.test(t);
  if (!a) {
    const o = t.indexOf(n);
    o > 0 && !i.test(t.substring(0, o)) && (a = !0);
  }
  return a;
}, Bn = (t, e, n = ".") => {
  if (!t) return;
  if (t[e])
    return Object.prototype.hasOwnProperty.call(t, e) ? t[e] : void 0;
  const r = e.split(n);
  let i = t;
  for (let a = 0; a < r.length; ) {
    if (!i || typeof i != "object")
      return;
    let o, s = "";
    for (let l = a; l < r.length; ++l)
      if (l !== a && (s += n), s += r[l], o = i[s], o !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof o) > -1 && l < r.length - 1)
          continue;
        a += l - a + 1;
        break;
      }
    i = o;
  }
  return i;
}, Jt = (t) => t == null ? void 0 : t.replace("_", "-"), $s = {
  type: "logger",
  log(t) {
    this.output("log", t);
  },
  warn(t) {
    this.output("warn", t);
  },
  error(t) {
    this.output("error", t);
  },
  output(t, e) {
    var n, r;
    (r = (n = console == null ? void 0 : console[t]) == null ? void 0 : n.apply) == null || r.call(n, console, e);
  }
};
class hn {
  constructor(e, n = {}) {
    this.init(e, n);
  }
  init(e, n = {}) {
    this.prefix = n.prefix || "i18next:", this.logger = e || $s, this.options = n, this.debug = n.debug;
  }
  log(...e) {
    return this.forward(e, "log", "", !0);
  }
  warn(...e) {
    return this.forward(e, "warn", "", !0);
  }
  error(...e) {
    return this.forward(e, "error", "");
  }
  deprecate(...e) {
    return this.forward(e, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(e, n, r, i) {
    return i && !this.debug ? null : (J(e[0]) && (e[0] = `${r}${this.prefix} ${e[0]}`), this.logger[n](e));
  }
  create(e) {
    return new hn(this.logger, {
      prefix: `${this.prefix}:${e}:`,
      ...this.options
    });
  }
  clone(e) {
    return e = e || this.options, e.prefix = e.prefix || this.prefix, new hn(this.logger, e);
  }
}
var st = new hn();
class bn {
  constructor() {
    this.observers = {};
  }
  on(e, n) {
    return e.split(" ").forEach((r) => {
      this.observers[r] || (this.observers[r] = /* @__PURE__ */ new Map());
      const i = this.observers[r].get(n) || 0;
      this.observers[r].set(n, i + 1);
    }), this;
  }
  off(e, n) {
    if (this.observers[e]) {
      if (!n) {
        delete this.observers[e];
        return;
      }
      this.observers[e].delete(n);
    }
  }
  emit(e, ...n) {
    this.observers[e] && Array.from(this.observers[e].entries()).forEach(([i, a]) => {
      for (let o = 0; o < a; o++)
        i(...n);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach(([i, a]) => {
      for (let o = 0; o < a; o++)
        i.apply(i, [e, ...n]);
    });
  }
}
class Ur extends bn {
  constructor(e, n = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super(), this.data = e || {}, this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(e) {
    this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
  }
  removeNamespaces(e) {
    const n = this.options.ns.indexOf(e);
    n > -1 && this.options.ns.splice(n, 1);
  }
  getResource(e, n, r, i = {}) {
    var c, g;
    const a = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator, o = i.ignoreJSONStructure !== void 0 ? i.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let s;
    e.indexOf(".") > -1 ? s = e.split(".") : (s = [e, n], r && (Array.isArray(r) ? s.push(...r) : J(r) && a ? s.push(...r.split(a)) : s.push(r)));
    const l = un(this.data, s);
    return !l && !n && !r && e.indexOf(".") > -1 && (e = s[0], n = s[1], r = s.slice(2).join(".")), l || !o || !J(r) ? l : Bn((g = (c = this.data) == null ? void 0 : c[e]) == null ? void 0 : g[n], r, a);
  }
  addResource(e, n, r, i, a = {
    silent: !1
  }) {
    const o = a.keySeparator !== void 0 ? a.keySeparator : this.options.keySeparator;
    let s = [e, n];
    r && (s = s.concat(o ? r.split(o) : r)), e.indexOf(".") > -1 && (s = e.split("."), i = n, n = s[1]), this.addNamespaces(n), Vr(this.data, s, i), a.silent || this.emit("added", e, n, r, i);
  }
  addResources(e, n, r, i = {
    silent: !1
  }) {
    for (const a in r)
      (J(r[a]) || Array.isArray(r[a])) && this.addResource(e, n, a, r[a], {
        silent: !0
      });
    i.silent || this.emit("added", e, n, r);
  }
  addResourceBundle(e, n, r, i, a, o = {
    silent: !1,
    skipCopy: !1
  }) {
    let s = [e, n];
    e.indexOf(".") > -1 && (s = e.split("."), i = r, r = n, n = s[1]), this.addNamespaces(n);
    let l = un(this.data, s) || {};
    o.skipCopy || (r = JSON.parse(JSON.stringify(r))), i ? Fi(l, r, a) : l = {
      ...l,
      ...r
    }, Vr(this.data, s, l), o.silent || this.emit("added", e, n, r);
  }
  removeResourceBundle(e, n) {
    this.hasResourceBundle(e, n) && delete this.data[e][n], this.removeNamespaces(n), this.emit("removed", e, n);
  }
  hasResourceBundle(e, n) {
    return this.getResource(e, n) !== void 0;
  }
  getResourceBundle(e, n) {
    return n || (n = this.options.defaultNS), this.getResource(e, n);
  }
  getDataByLanguage(e) {
    return this.data[e];
  }
  hasLanguageSomeTranslations(e) {
    const n = this.getDataByLanguage(e);
    return !!(n && Object.keys(n) || []).find((i) => n[i] && Object.keys(n[i]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var Bi = {
  processors: {},
  addPostProcessor(t) {
    this.processors[t.name] = t;
  },
  handle(t, e, n, r, i) {
    return t.forEach((a) => {
      var o;
      e = ((o = this.processors[a]) == null ? void 0 : o.process(e, n, r, i)) ?? e;
    }), e;
  }
};
const Vi = Symbol("i18next/PATH_KEY");
function Fs() {
  const t = [], e = /* @__PURE__ */ Object.create(null);
  let n;
  return e.get = (r, i) => {
    var a;
    return (a = n == null ? void 0 : n.revoke) == null || a.call(n), i === Vi ? t : (t.push(i), n = Proxy.revocable(r, e), n.proxy);
  }, Proxy.revocable(/* @__PURE__ */ Object.create(null), e).proxy;
}
function Vn(t, e) {
  const {
    [Vi]: n
  } = t(Fs());
  return n.join((e == null ? void 0 : e.keySeparator) ?? ".");
}
const Hr = {}, xn = (t) => !J(t) && typeof t != "boolean" && typeof t != "number";
class fn extends bn {
  constructor(e, n = {}) {
    super(), Ns(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], e, this), this.options = n, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = st.create("translator");
  }
  changeLanguage(e) {
    e && (this.language = e);
  }
  exists(e, n = {
    interpolation: {}
  }) {
    const r = {
      ...n
    };
    if (e == null) return !1;
    const i = this.resolve(e, r);
    if ((i == null ? void 0 : i.res) === void 0) return !1;
    const a = xn(i.res);
    return !(r.returnObjects === !1 && a);
  }
  extractFromKey(e, n) {
    let r = n.nsSeparator !== void 0 ? n.nsSeparator : this.options.nsSeparator;
    r === void 0 && (r = ":");
    const i = n.keySeparator !== void 0 ? n.keySeparator : this.options.keySeparator;
    let a = n.ns || this.options.defaultNS || [];
    const o = r && e.indexOf(r) > -1, s = !this.options.userDefinedKeySeparator && !n.keySeparator && !this.options.userDefinedNsSeparator && !n.nsSeparator && !zs(e, r, i);
    if (o && !s) {
      const l = e.match(this.interpolator.nestingRegexp);
      if (l && l.length > 0)
        return {
          key: e,
          namespaces: J(a) ? [a] : a
        };
      const c = e.split(r);
      (r !== i || r === i && this.options.ns.indexOf(c[0]) > -1) && (a = c.shift()), e = c.join(i);
    }
    return {
      key: e,
      namespaces: J(a) ? [a] : a
    };
  }
  translate(e, n, r) {
    let i = typeof n == "object" ? {
      ...n
    } : n;
    if (typeof i != "object" && this.options.overloadTranslationOptionHandler && (i = this.options.overloadTranslationOptionHandler(arguments)), typeof i == "object" && (i = {
      ...i
    }), i || (i = {}), e == null) return "";
    typeof e == "function" && (e = Vn(e, {
      ...this.options,
      ...i
    })), Array.isArray(e) || (e = [String(e)]);
    const a = i.returnDetails !== void 0 ? i.returnDetails : this.options.returnDetails, o = i.keySeparator !== void 0 ? i.keySeparator : this.options.keySeparator, {
      key: s,
      namespaces: l
    } = this.extractFromKey(e[e.length - 1], i), c = l[l.length - 1];
    let g = i.nsSeparator !== void 0 ? i.nsSeparator : this.options.nsSeparator;
    g === void 0 && (g = ":");
    const d = i.lng || this.language, h = i.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if ((d == null ? void 0 : d.toLowerCase()) === "cimode")
      return h ? a ? {
        res: `${c}${g}${s}`,
        usedKey: s,
        exactUsedKey: s,
        usedLng: d,
        usedNS: c,
        usedParams: this.getUsedParamsDetails(i)
      } : `${c}${g}${s}` : a ? {
        res: s,
        usedKey: s,
        exactUsedKey: s,
        usedLng: d,
        usedNS: c,
        usedParams: this.getUsedParamsDetails(i)
      } : s;
    const p = this.resolve(e, i);
    let f = p == null ? void 0 : p.res;
    const _ = (p == null ? void 0 : p.usedKey) || s, v = (p == null ? void 0 : p.exactUsedKey) || s, y = ["[object Number]", "[object Function]", "[object RegExp]"], C = i.joinArrays !== void 0 ? i.joinArrays : this.options.joinArrays, b = !this.i18nFormat || this.i18nFormat.handleAsObject, w = i.count !== void 0 && !J(i.count), N = fn.hasDefaultValue(i), j = w ? this.pluralResolver.getSuffix(d, i.count, i) : "", z = i.ordinal && w ? this.pluralResolver.getSuffix(d, i.count, {
      ordinal: !1
    }) : "", I = w && !i.ordinal && i.count === 0, x = I && i[`defaultValue${this.options.pluralSeparator}zero`] || i[`defaultValue${j}`] || i[`defaultValue${z}`] || i.defaultValue;
    let m = f;
    b && !f && N && (m = x);
    const S = xn(m), M = Object.prototype.toString.apply(m);
    if (b && m && S && y.indexOf(M) < 0 && !(J(C) && Array.isArray(m))) {
      if (!i.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const k = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(_, m, {
          ...i,
          ns: l
        }) : `key '${s} (${this.language})' returned an object instead of string.`;
        return a ? (p.res = k, p.usedParams = this.getUsedParamsDetails(i), p) : k;
      }
      if (o) {
        const k = Array.isArray(m), T = k ? [] : {}, D = k ? v : _;
        for (const F in m)
          if (Object.prototype.hasOwnProperty.call(m, F)) {
            const K = `${D}${o}${F}`;
            N && !f ? T[F] = this.translate(K, {
              ...i,
              defaultValue: xn(x) ? x[F] : void 0,
              joinArrays: !1,
              ns: l
            }) : T[F] = this.translate(K, {
              ...i,
              joinArrays: !1,
              ns: l
            }), T[F] === K && (T[F] = m[F]);
          }
        f = T;
      }
    } else if (b && J(C) && Array.isArray(f))
      f = f.join(C), f && (f = this.extendTranslation(f, e, i, r));
    else {
      let k = !1, T = !1;
      !this.isValidLookup(f) && N && (k = !0, f = x), this.isValidLookup(f) || (T = !0, f = s);
      const F = (i.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && T ? void 0 : f, K = N && x !== f && this.options.updateMissing;
      if (T || k || K) {
        if (this.logger.log(K ? "updateKey" : "missingKey", d, c, s, K ? x : f), o) {
          const Q = this.resolve(s, {
            ...i,
            keySeparator: !1
          });
          Q && Q.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let ee = [];
        const re = this.languageUtils.getFallbackCodes(this.options.fallbackLng, i.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && re && re[0])
          for (let Q = 0; Q < re.length; Q++)
            ee.push(re[Q]);
        else this.options.saveMissingTo === "all" ? ee = this.languageUtils.toResolveHierarchy(i.lng || this.language) : ee.push(i.lng || this.language);
        const Y = (Q, V, L) => {
          var X;
          const $ = N && L !== f ? L : F;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(Q, c, V, $, K, i) : (X = this.backendConnector) != null && X.saveMissing && this.backendConnector.saveMissing(Q, c, V, $, K, i), this.emit("missingKey", Q, c, V, f);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && w ? ee.forEach((Q) => {
          const V = this.pluralResolver.getSuffixes(Q, i);
          I && i[`defaultValue${this.options.pluralSeparator}zero`] && V.indexOf(`${this.options.pluralSeparator}zero`) < 0 && V.push(`${this.options.pluralSeparator}zero`), V.forEach((L) => {
            Y([Q], s + L, i[`defaultValue${L}`] || x);
          });
        }) : Y(ee, s, x));
      }
      f = this.extendTranslation(f, e, i, p, r), T && f === s && this.options.appendNamespaceToMissingKey && (f = `${c}${g}${s}`), (T || k) && this.options.parseMissingKeyHandler && (f = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${c}${g}${s}` : s, k ? f : void 0, i));
    }
    return a ? (p.res = f, p.usedParams = this.getUsedParamsDetails(i), p) : f;
  }
  extendTranslation(e, n, r, i, a) {
    var l, c;
    if ((l = this.i18nFormat) != null && l.parse)
      e = this.i18nFormat.parse(e, {
        ...this.options.interpolation.defaultVariables,
        ...r
      }, r.lng || this.language || i.usedLng, i.usedNS, i.usedKey, {
        resolved: i
      });
    else if (!r.skipInterpolation) {
      r.interpolation && this.interpolator.init({
        ...r,
        interpolation: {
          ...this.options.interpolation,
          ...r.interpolation
        }
      });
      const g = J(e) && (((c = r == null ? void 0 : r.interpolation) == null ? void 0 : c.skipOnVariables) !== void 0 ? r.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let d;
      if (g) {
        const p = e.match(this.interpolator.nestingRegexp);
        d = p && p.length;
      }
      let h = r.replace && !J(r.replace) ? r.replace : r;
      if (this.options.interpolation.defaultVariables && (h = {
        ...this.options.interpolation.defaultVariables,
        ...h
      }), e = this.interpolator.interpolate(e, h, r.lng || this.language || i.usedLng, r), g) {
        const p = e.match(this.interpolator.nestingRegexp), f = p && p.length;
        d < f && (r.nest = !1);
      }
      !r.lng && i && i.res && (r.lng = this.language || i.usedLng), r.nest !== !1 && (e = this.interpolator.nest(e, (...p) => (a == null ? void 0 : a[0]) === p[0] && !r.context ? (this.logger.warn(`It seems you are nesting recursively key: ${p[0]} in key: ${n[0]}`), null) : this.translate(...p, n), r)), r.interpolation && this.interpolator.reset();
    }
    const o = r.postProcess || this.options.postProcess, s = J(o) ? [o] : o;
    return e != null && (s != null && s.length) && r.applyPostProcessor !== !1 && (e = Bi.handle(s, e, n, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...i,
        usedParams: this.getUsedParamsDetails(r)
      },
      ...r
    } : r, this)), e;
  }
  resolve(e, n = {}) {
    let r, i, a, o, s;
    return J(e) && (e = [e]), e.forEach((l) => {
      if (this.isValidLookup(r)) return;
      const c = this.extractFromKey(l, n), g = c.key;
      i = g;
      let d = c.namespaces;
      this.options.fallbackNS && (d = d.concat(this.options.fallbackNS));
      const h = n.count !== void 0 && !J(n.count), p = h && !n.ordinal && n.count === 0, f = n.context !== void 0 && (J(n.context) || typeof n.context == "number") && n.context !== "", _ = n.lngs ? n.lngs : this.languageUtils.toResolveHierarchy(n.lng || this.language, n.fallbackLng);
      d.forEach((v) => {
        var y, C;
        this.isValidLookup(r) || (s = v, !Hr[`${_[0]}-${v}`] && ((y = this.utils) != null && y.hasLoadedNamespace) && !((C = this.utils) != null && C.hasLoadedNamespace(s)) && (Hr[`${_[0]}-${v}`] = !0, this.logger.warn(`key "${i}" for languages "${_.join(", ")}" won't get resolved as namespace "${s}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), _.forEach((b) => {
          var j;
          if (this.isValidLookup(r)) return;
          o = b;
          const w = [g];
          if ((j = this.i18nFormat) != null && j.addLookupKeys)
            this.i18nFormat.addLookupKeys(w, g, b, v, n);
          else {
            let z;
            h && (z = this.pluralResolver.getSuffix(b, n.count, n));
            const I = `${this.options.pluralSeparator}zero`, x = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (h && (n.ordinal && z.indexOf(x) === 0 && w.push(g + z.replace(x, this.options.pluralSeparator)), w.push(g + z), p && w.push(g + I)), f) {
              const m = `${g}${this.options.contextSeparator || "_"}${n.context}`;
              w.push(m), h && (n.ordinal && z.indexOf(x) === 0 && w.push(m + z.replace(x, this.options.pluralSeparator)), w.push(m + z), p && w.push(m + I));
            }
          }
          let N;
          for (; N = w.pop(); )
            this.isValidLookup(r) || (a = N, r = this.getResource(b, v, N, n));
        }));
      });
    }), {
      res: r,
      usedKey: i,
      exactUsedKey: a,
      usedLng: o,
      usedNS: s
    };
  }
  isValidLookup(e) {
    return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === "");
  }
  getResource(e, n, r, i = {}) {
    var a;
    return (a = this.i18nFormat) != null && a.getResource ? this.i18nFormat.getResource(e, n, r, i) : this.resourceStore.getResource(e, n, r, i);
  }
  getUsedParamsDetails(e = {}) {
    const n = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], r = e.replace && !J(e.replace);
    let i = r ? e.replace : e;
    if (r && typeof e.count < "u" && (i.count = e.count), this.options.interpolation.defaultVariables && (i = {
      ...this.options.interpolation.defaultVariables,
      ...i
    }), !r) {
      i = {
        ...i
      };
      for (const a of n)
        delete i[a];
    }
    return i;
  }
  static hasDefaultValue(e) {
    const n = "defaultValue";
    for (const r in e)
      if (Object.prototype.hasOwnProperty.call(e, r) && n === r.substring(0, n.length) && e[r] !== void 0)
        return !0;
    return !1;
  }
}
class Zr {
  constructor(e) {
    this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = st.create("languageUtils");
  }
  getScriptPartFromCode(e) {
    if (e = Jt(e), !e || e.indexOf("-") < 0) return null;
    const n = e.split("-");
    return n.length === 2 || (n.pop(), n[n.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(n.join("-"));
  }
  getLanguagePartFromCode(e) {
    if (e = Jt(e), !e || e.indexOf("-") < 0) return e;
    const n = e.split("-");
    return this.formatLanguageCode(n[0]);
  }
  formatLanguageCode(e) {
    if (J(e) && e.indexOf("-") > -1) {
      let n;
      try {
        n = Intl.getCanonicalLocales(e)[0];
      } catch {
      }
      return n && this.options.lowerCaseLng && (n = n.toLowerCase()), n || (this.options.lowerCaseLng ? e.toLowerCase() : e);
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
  }
  isSupportedCode(e) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1;
  }
  getBestMatchFromCodes(e) {
    if (!e) return null;
    let n;
    return e.forEach((r) => {
      if (n) return;
      const i = this.formatLanguageCode(r);
      (!this.options.supportedLngs || this.isSupportedCode(i)) && (n = i);
    }), !n && this.options.supportedLngs && e.forEach((r) => {
      if (n) return;
      const i = this.getScriptPartFromCode(r);
      if (this.isSupportedCode(i)) return n = i;
      const a = this.getLanguagePartFromCode(r);
      if (this.isSupportedCode(a)) return n = a;
      n = this.options.supportedLngs.find((o) => {
        if (o === a) return o;
        if (!(o.indexOf("-") < 0 && a.indexOf("-") < 0) && (o.indexOf("-") > 0 && a.indexOf("-") < 0 && o.substring(0, o.indexOf("-")) === a || o.indexOf(a) === 0 && a.length > 1))
          return o;
      });
    }), n || (n = this.getFallbackCodes(this.options.fallbackLng)[0]), n;
  }
  getFallbackCodes(e, n) {
    if (!e) return [];
    if (typeof e == "function" && (e = e(n)), J(e) && (e = [e]), Array.isArray(e)) return e;
    if (!n) return e.default || [];
    let r = e[n];
    return r || (r = e[this.getScriptPartFromCode(n)]), r || (r = e[this.formatLanguageCode(n)]), r || (r = e[this.getLanguagePartFromCode(n)]), r || (r = e.default), r || [];
  }
  toResolveHierarchy(e, n) {
    const r = this.getFallbackCodes((n === !1 ? [] : n) || this.options.fallbackLng || [], e), i = [], a = (o) => {
      o && (this.isSupportedCode(o) ? i.push(o) : this.logger.warn(`rejecting language code not found in supportedLngs: ${o}`));
    };
    return J(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && a(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && a(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && a(this.getLanguagePartFromCode(e))) : J(e) && a(this.formatLanguageCode(e)), r.forEach((o) => {
      i.indexOf(o) < 0 && a(this.formatLanguageCode(o));
    }), i;
  }
}
const Kr = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, Wr = {
  select: (t) => t === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class Bs {
  constructor(e, n = {}) {
    this.languageUtils = e, this.options = n, this.logger = st.create("pluralResolver"), this.pluralRulesCache = {};
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(e, n = {}) {
    const r = Jt(e === "dev" ? "en" : e), i = n.ordinal ? "ordinal" : "cardinal", a = JSON.stringify({
      cleanedCode: r,
      type: i
    });
    if (a in this.pluralRulesCache)
      return this.pluralRulesCache[a];
    let o;
    try {
      o = new Intl.PluralRules(r, {
        type: i
      });
    } catch {
      if (!Intl)
        return this.logger.error("No Intl support, please use an Intl polyfill!"), Wr;
      if (!e.match(/-|_/)) return Wr;
      const l = this.languageUtils.getLanguagePartFromCode(e);
      o = this.getRule(l, n);
    }
    return this.pluralRulesCache[a] = o, o;
  }
  needsPlural(e, n = {}) {
    let r = this.getRule(e, n);
    return r || (r = this.getRule("dev", n)), (r == null ? void 0 : r.resolvedOptions().pluralCategories.length) > 1;
  }
  getPluralFormsOfKey(e, n, r = {}) {
    return this.getSuffixes(e, r).map((i) => `${n}${i}`);
  }
  getSuffixes(e, n = {}) {
    let r = this.getRule(e, n);
    return r || (r = this.getRule("dev", n)), r ? r.resolvedOptions().pluralCategories.sort((i, a) => Kr[i] - Kr[a]).map((i) => `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ""}${i}`) : [];
  }
  getSuffix(e, n, r = {}) {
    const i = this.getRule(e, r);
    return i ? `${this.options.prepend}${r.ordinal ? `ordinal${this.options.prepend}` : ""}${i.select(n)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix("dev", n, r));
  }
}
const Gr = (t, e, n, r = ".", i = !0) => {
  let a = Ts(t, e, n);
  return !a && i && J(n) && (a = Bn(t, n, r), a === void 0 && (a = Bn(e, n, r))), a;
}, In = (t) => t.replace(/\$/g, "$$$$");
class qr {
  constructor(e = {}) {
    var n;
    this.logger = st.create("interpolator"), this.options = e, this.format = ((n = e == null ? void 0 : e.interpolation) == null ? void 0 : n.format) || ((r) => r), this.init(e);
  }
  init(e = {}) {
    e.interpolation || (e.interpolation = {
      escapeValue: !0
    });
    const {
      escape: n,
      escapeValue: r,
      useRawValueToEscape: i,
      prefix: a,
      prefixEscaped: o,
      suffix: s,
      suffixEscaped: l,
      formatSeparator: c,
      unescapeSuffix: g,
      unescapePrefix: d,
      nestingPrefix: h,
      nestingPrefixEscaped: p,
      nestingSuffix: f,
      nestingSuffixEscaped: _,
      nestingOptionsSeparator: v,
      maxReplaces: y,
      alwaysFormat: C
    } = e.interpolation;
    this.escape = n !== void 0 ? n : Os, this.escapeValue = r !== void 0 ? r : !0, this.useRawValueToEscape = i !== void 0 ? i : !1, this.prefix = a ? Nt(a) : o || "{{", this.suffix = s ? Nt(s) : l || "}}", this.formatSeparator = c || ",", this.unescapePrefix = g ? "" : d || "-", this.unescapeSuffix = this.unescapePrefix ? "" : g || "", this.nestingPrefix = h ? Nt(h) : p || Nt("$t("), this.nestingSuffix = f ? Nt(f) : _ || Nt(")"), this.nestingOptionsSeparator = v || ",", this.maxReplaces = y || 1e3, this.alwaysFormat = C !== void 0 ? C : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const e = (n, r) => (n == null ? void 0 : n.source) === r ? (n.lastIndex = 0, n) : new RegExp(r, "g");
    this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(e, n, r, i) {
    var p;
    let a, o, s;
    const l = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, c = (f) => {
      if (f.indexOf(this.formatSeparator) < 0) {
        const C = Gr(n, l, f, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(C, void 0, r, {
          ...i,
          ...n,
          interpolationkey: f
        }) : C;
      }
      const _ = f.split(this.formatSeparator), v = _.shift().trim(), y = _.join(this.formatSeparator).trim();
      return this.format(Gr(n, l, v, this.options.keySeparator, this.options.ignoreJSONStructure), y, r, {
        ...i,
        ...n,
        interpolationkey: v
      });
    };
    this.resetRegExp();
    const g = (i == null ? void 0 : i.missingInterpolationHandler) || this.options.missingInterpolationHandler, d = ((p = i == null ? void 0 : i.interpolation) == null ? void 0 : p.skipOnVariables) !== void 0 ? i.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (f) => In(f)
    }, {
      regex: this.regexp,
      safeValue: (f) => this.escapeValue ? In(this.escape(f)) : In(f)
    }].forEach((f) => {
      for (s = 0; a = f.regex.exec(e); ) {
        const _ = a[1].trim();
        if (o = c(_), o === void 0)
          if (typeof g == "function") {
            const y = g(e, a, i);
            o = J(y) ? y : "";
          } else if (i && Object.prototype.hasOwnProperty.call(i, _))
            o = "";
          else if (d) {
            o = a[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${_} for interpolating ${e}`), o = "";
        else !J(o) && !this.useRawValueToEscape && (o = $r(o));
        const v = f.safeValue(o);
        if (e = e.replace(a[0], v), d ? (f.regex.lastIndex += o.length, f.regex.lastIndex -= a[0].length) : f.regex.lastIndex = 0, s++, s >= this.maxReplaces)
          break;
      }
    }), e;
  }
  nest(e, n, r = {}) {
    let i, a, o;
    const s = (l, c) => {
      const g = this.nestingOptionsSeparator;
      if (l.indexOf(g) < 0) return l;
      const d = l.split(new RegExp(`${g}[ ]*{`));
      let h = `{${d[1]}`;
      l = d[0], h = this.interpolate(h, o);
      const p = h.match(/'/g), f = h.match(/"/g);
      (((p == null ? void 0 : p.length) ?? 0) % 2 === 0 && !f || f.length % 2 !== 0) && (h = h.replace(/'/g, '"'));
      try {
        o = JSON.parse(h), c && (o = {
          ...c,
          ...o
        });
      } catch (_) {
        return this.logger.warn(`failed parsing options string in nesting for key ${l}`, _), `${l}${g}${h}`;
      }
      return o.defaultValue && o.defaultValue.indexOf(this.prefix) > -1 && delete o.defaultValue, l;
    };
    for (; i = this.nestingRegexp.exec(e); ) {
      let l = [];
      o = {
        ...r
      }, o = o.replace && !J(o.replace) ? o.replace : o, o.applyPostProcessor = !1, delete o.defaultValue;
      const c = /{.*}/.test(i[1]) ? i[1].lastIndexOf("}") + 1 : i[1].indexOf(this.formatSeparator);
      if (c !== -1 && (l = i[1].slice(c).split(this.formatSeparator).map((g) => g.trim()).filter(Boolean), i[1] = i[1].slice(0, c)), a = n(s.call(this, i[1].trim(), o), o), a && i[0] === e && !J(a)) return a;
      J(a) || (a = $r(a)), a || (this.logger.warn(`missed to resolve ${i[1]} for nesting ${e}`), a = ""), l.length && (a = l.reduce((g, d) => this.format(g, d, r.lng, {
        ...r,
        interpolationkey: i[1].trim()
      }), a.trim())), e = e.replace(i[0], a), this.regexp.lastIndex = 0;
    }
    return e;
  }
}
const Vs = (t) => {
  let e = t.toLowerCase().trim();
  const n = {};
  if (t.indexOf("(") > -1) {
    const r = t.split("(");
    e = r[0].toLowerCase().trim();
    const i = r[1].substring(0, r[1].length - 1);
    e === "currency" && i.indexOf(":") < 0 ? n.currency || (n.currency = i.trim()) : e === "relativetime" && i.indexOf(":") < 0 ? n.range || (n.range = i.trim()) : i.split(";").forEach((o) => {
      if (o) {
        const [s, ...l] = o.split(":"), c = l.join(":").trim().replace(/^'+|'+$/g, ""), g = s.trim();
        n[g] || (n[g] = c), c === "false" && (n[g] = !1), c === "true" && (n[g] = !0), isNaN(c) || (n[g] = parseInt(c, 10));
      }
    });
  }
  return {
    formatName: e,
    formatOptions: n
  };
}, Yr = (t) => {
  const e = {};
  return (n, r, i) => {
    let a = i;
    i && i.interpolationkey && i.formatParams && i.formatParams[i.interpolationkey] && i[i.interpolationkey] && (a = {
      ...a,
      [i.interpolationkey]: void 0
    });
    const o = r + JSON.stringify(a);
    let s = e[o];
    return s || (s = t(Jt(r), i), e[o] = s), s(n);
  };
}, Us = (t) => (e, n, r) => t(Jt(n), r)(e);
class Hs {
  constructor(e = {}) {
    this.logger = st.create("formatter"), this.options = e, this.init(e);
  }
  init(e, n = {
    interpolation: {}
  }) {
    this.formatSeparator = n.interpolation.formatSeparator || ",";
    const r = n.cacheInBuiltFormats ? Yr : Us;
    this.formats = {
      number: r((i, a) => {
        const o = new Intl.NumberFormat(i, {
          ...a
        });
        return (s) => o.format(s);
      }),
      currency: r((i, a) => {
        const o = new Intl.NumberFormat(i, {
          ...a,
          style: "currency"
        });
        return (s) => o.format(s);
      }),
      datetime: r((i, a) => {
        const o = new Intl.DateTimeFormat(i, {
          ...a
        });
        return (s) => o.format(s);
      }),
      relativetime: r((i, a) => {
        const o = new Intl.RelativeTimeFormat(i, {
          ...a
        });
        return (s) => o.format(s, a.range || "day");
      }),
      list: r((i, a) => {
        const o = new Intl.ListFormat(i, {
          ...a
        });
        return (s) => o.format(s);
      })
    };
  }
  add(e, n) {
    this.formats[e.toLowerCase().trim()] = n;
  }
  addCached(e, n) {
    this.formats[e.toLowerCase().trim()] = Yr(n);
  }
  format(e, n, r, i = {}) {
    const a = n.split(this.formatSeparator);
    if (a.length > 1 && a[0].indexOf("(") > 1 && a[0].indexOf(")") < 0 && a.find((s) => s.indexOf(")") > -1)) {
      const s = a.findIndex((l) => l.indexOf(")") > -1);
      a[0] = [a[0], ...a.splice(1, s)].join(this.formatSeparator);
    }
    return a.reduce((s, l) => {
      var d;
      const {
        formatName: c,
        formatOptions: g
      } = Vs(l);
      if (this.formats[c]) {
        let h = s;
        try {
          const p = ((d = i == null ? void 0 : i.formatParams) == null ? void 0 : d[i.interpolationkey]) || {}, f = p.locale || p.lng || i.locale || i.lng || r;
          h = this.formats[c](s, f, {
            ...g,
            ...i,
            ...p
          });
        } catch (p) {
          this.logger.warn(p);
        }
        return h;
      } else
        this.logger.warn(`there was no format function for ${c}`);
      return s;
    }, e);
  }
}
const Zs = (t, e) => {
  t.pending[e] !== void 0 && (delete t.pending[e], t.pendingCount--);
};
class Ks extends bn {
  constructor(e, n, r, i = {}) {
    var a, o;
    super(), this.backend = e, this.store = n, this.services = r, this.languageUtils = r.languageUtils, this.options = i, this.logger = st.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = i.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = i.maxRetries >= 0 ? i.maxRetries : 5, this.retryTimeout = i.retryTimeout >= 1 ? i.retryTimeout : 350, this.state = {}, this.queue = [], (o = (a = this.backend) == null ? void 0 : a.init) == null || o.call(a, r, i.backend, i);
  }
  queueLoad(e, n, r, i) {
    const a = {}, o = {}, s = {}, l = {};
    return e.forEach((c) => {
      let g = !0;
      n.forEach((d) => {
        const h = `${c}|${d}`;
        !r.reload && this.store.hasResourceBundle(c, d) ? this.state[h] = 2 : this.state[h] < 0 || (this.state[h] === 1 ? o[h] === void 0 && (o[h] = !0) : (this.state[h] = 1, g = !1, o[h] === void 0 && (o[h] = !0), a[h] === void 0 && (a[h] = !0), l[d] === void 0 && (l[d] = !0)));
      }), g || (s[c] = !0);
    }), (Object.keys(a).length || Object.keys(o).length) && this.queue.push({
      pending: o,
      pendingCount: Object.keys(o).length,
      loaded: {},
      errors: [],
      callback: i
    }), {
      toLoad: Object.keys(a),
      pending: Object.keys(o),
      toLoadLanguages: Object.keys(s),
      toLoadNamespaces: Object.keys(l)
    };
  }
  loaded(e, n, r) {
    const i = e.split("|"), a = i[0], o = i[1];
    n && this.emit("failedLoading", a, o, n), !n && r && this.store.addResourceBundle(a, o, r, void 0, void 0, {
      skipCopy: !0
    }), this.state[e] = n ? -1 : 2, n && r && (this.state[e] = 0);
    const s = {};
    this.queue.forEach((l) => {
      As(l.loaded, [a], o), Zs(l, e), n && l.errors.push(n), l.pendingCount === 0 && !l.done && (Object.keys(l.loaded).forEach((c) => {
        s[c] || (s[c] = {});
        const g = l.loaded[c];
        g.length && g.forEach((d) => {
          s[c][d] === void 0 && (s[c][d] = !0);
        });
      }), l.done = !0, l.errors.length ? l.callback(l.errors) : l.callback());
    }), this.emit("loaded", s), this.queue = this.queue.filter((l) => !l.done);
  }
  read(e, n, r, i = 0, a = this.retryTimeout, o) {
    if (!e.length) return o(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e,
        ns: n,
        fcName: r,
        tried: i,
        wait: a,
        callback: o
      });
      return;
    }
    this.readingCalls++;
    const s = (c, g) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const d = this.waitingReads.shift();
        this.read(d.lng, d.ns, d.fcName, d.tried, d.wait, d.callback);
      }
      if (c && g && i < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, e, n, r, i + 1, a * 2, o);
        }, a);
        return;
      }
      o(c, g);
    }, l = this.backend[r].bind(this.backend);
    if (l.length === 2) {
      try {
        const c = l(e, n);
        c && typeof c.then == "function" ? c.then((g) => s(null, g)).catch(s) : s(null, c);
      } catch (c) {
        s(c);
      }
      return;
    }
    return l(e, n, s);
  }
  prepareLoading(e, n, r = {}, i) {
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), i && i();
    J(e) && (e = this.languageUtils.toResolveHierarchy(e)), J(n) && (n = [n]);
    const a = this.queueLoad(e, n, r, i);
    if (!a.toLoad.length)
      return a.pending.length || i(), null;
    a.toLoad.forEach((o) => {
      this.loadOne(o);
    });
  }
  load(e, n, r) {
    this.prepareLoading(e, n, {}, r);
  }
  reload(e, n, r) {
    this.prepareLoading(e, n, {
      reload: !0
    }, r);
  }
  loadOne(e, n = "") {
    const r = e.split("|"), i = r[0], a = r[1];
    this.read(i, a, "read", void 0, void 0, (o, s) => {
      o && this.logger.warn(`${n}loading namespace ${a} for language ${i} failed`, o), !o && s && this.logger.log(`${n}loaded namespace ${a} for language ${i}`, s), this.loaded(e, o, s);
    });
  }
  saveMissing(e, n, r, i, a, o = {}, s = () => {
  }) {
    var l, c, g, d, h;
    if ((c = (l = this.services) == null ? void 0 : l.utils) != null && c.hasLoadedNamespace && !((d = (g = this.services) == null ? void 0 : g.utils) != null && d.hasLoadedNamespace(n))) {
      this.logger.warn(`did not save key "${r}" as the namespace "${n}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(r == null || r === "")) {
      if ((h = this.backend) != null && h.create) {
        const p = {
          ...o,
          isUpdate: a
        }, f = this.backend.create.bind(this.backend);
        if (f.length < 6)
          try {
            let _;
            f.length === 5 ? _ = f(e, n, r, i, p) : _ = f(e, n, r, i), _ && typeof _.then == "function" ? _.then((v) => s(null, v)).catch(s) : s(null, _);
          } catch (_) {
            s(_);
          }
        else
          f(e, n, r, i, s, p);
      }
      !e || !e[0] || this.store.addResource(e[0], n, r, i);
    }
  }
}
const Nn = () => ({
  debug: !1,
  initAsync: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  simplifyPluralSuffix: !0,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (t) => {
    let e = {};
    if (typeof t[1] == "object" && (e = t[1]), J(t[1]) && (e.defaultValue = t[1]), J(t[2]) && (e.tDescription = t[2]), typeof t[2] == "object" || typeof t[3] == "object") {
      const n = t[3] || t[2];
      Object.keys(n).forEach((r) => {
        e[r] = n[r];
      });
    }
    return e;
  },
  interpolation: {
    escapeValue: !0,
    format: (t) => t,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  },
  cacheInBuiltFormats: !0
}), Jr = (t) => {
  var e, n;
  return J(t.ns) && (t.ns = [t.ns]), J(t.fallbackLng) && (t.fallbackLng = [t.fallbackLng]), J(t.fallbackNS) && (t.fallbackNS = [t.fallbackNS]), ((n = (e = t.supportedLngs) == null ? void 0 : e.indexOf) == null ? void 0 : n.call(e, "cimode")) < 0 && (t.supportedLngs = t.supportedLngs.concat(["cimode"])), typeof t.initImmediate == "boolean" && (t.initAsync = t.initImmediate), t;
}, an = () => {
}, Ws = (t) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(t)).forEach((n) => {
    typeof t[n] == "function" && (t[n] = t[n].bind(t));
  });
};
class Wt extends bn {
  constructor(e = {}, n) {
    if (super(), this.options = Jr(e), this.services = {}, this.logger = st, this.modules = {
      external: []
    }, Ws(this), n && !this.isInitialized && !e.isClone) {
      if (!this.options.initAsync)
        return this.init(e, n), this;
      setTimeout(() => {
        this.init(e, n);
      }, 0);
    }
  }
  init(e = {}, n) {
    this.isInitializing = !0, typeof e == "function" && (n = e, e = {}), e.defaultNS == null && e.ns && (J(e.ns) ? e.defaultNS = e.ns : e.ns.indexOf("translation") < 0 && (e.defaultNS = e.ns[0]));
    const r = Nn();
    this.options = {
      ...r,
      ...this.options,
      ...Jr(e)
    }, this.options.interpolation = {
      ...r.interpolation,
      ...this.options.interpolation
    }, e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator), e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator), typeof this.options.overloadTranslationOptionHandler != "function" && (this.options.overloadTranslationOptionHandler = r.overloadTranslationOptionHandler), this.options.debug === !0 && typeof console < "u" && console.warn("i18next is maintained with support from locize.com â€” consider powering your project with managed localization (AI, CDN, integrations): https://locize.com");
    const i = (c) => c ? typeof c == "function" ? new c() : c : null;
    if (!this.options.isClone) {
      this.modules.logger ? st.init(i(this.modules.logger), this.options) : st.init(null, this.options);
      let c;
      this.modules.formatter ? c = this.modules.formatter : c = Hs;
      const g = new Zr(this.options);
      this.store = new Ur(this.options.resources, this.options);
      const d = this.services;
      d.logger = st, d.resourceStore = this.store, d.languageUtils = g, d.pluralResolver = new Bs(g, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      }), this.options.interpolation.format && this.options.interpolation.format !== r.interpolation.format && this.logger.deprecate("init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting"), c && (!this.options.interpolation.format || this.options.interpolation.format === r.interpolation.format) && (d.formatter = i(c), d.formatter.init && d.formatter.init(d, this.options), this.options.interpolation.format = d.formatter.format.bind(d.formatter)), d.interpolator = new qr(this.options), d.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, d.backendConnector = new Ks(i(this.modules.backend), d.resourceStore, d, this.options), d.backendConnector.on("*", (p, ...f) => {
        this.emit(p, ...f);
      }), this.modules.languageDetector && (d.languageDetector = i(this.modules.languageDetector), d.languageDetector.init && d.languageDetector.init(d, this.options.detection, this.options)), this.modules.i18nFormat && (d.i18nFormat = i(this.modules.i18nFormat), d.i18nFormat.init && d.i18nFormat.init(this)), this.translator = new fn(this.services, this.options), this.translator.on("*", (p, ...f) => {
        this.emit(p, ...f);
      }), this.modules.external.forEach((p) => {
        p.init && p.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, n || (n = an), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const c = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      c.length > 0 && c[0] !== "dev" && (this.options.lng = c[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((c) => {
      this[c] = (...g) => this.store[c](...g);
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((c) => {
      this[c] = (...g) => (this.store[c](...g), this);
    });
    const s = Ut(), l = () => {
      const c = (g, d) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), s.resolve(d), n(g, d);
      };
      if (this.languages && !this.isInitialized) return c(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, c);
    };
    return this.options.resources || !this.options.initAsync ? l() : setTimeout(l, 0), s;
  }
  loadResources(e, n = an) {
    var a, o;
    let r = n;
    const i = J(e) ? e : this.language;
    if (typeof e == "function" && (r = e), !this.options.resources || this.options.partialBundledLanguages) {
      if ((i == null ? void 0 : i.toLowerCase()) === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return r();
      const s = [], l = (c) => {
        if (!c || c === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(c).forEach((d) => {
          d !== "cimode" && s.indexOf(d) < 0 && s.push(d);
        });
      };
      i ? l(i) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((g) => l(g)), (o = (a = this.options.preload) == null ? void 0 : a.forEach) == null || o.call(a, (c) => l(c)), this.services.backendConnector.load(s, this.options.ns, (c) => {
        !c && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), r(c);
      });
    } else
      r(null);
  }
  reloadResources(e, n, r) {
    const i = Ut();
    return typeof e == "function" && (r = e, e = void 0), typeof n == "function" && (r = n, n = void 0), e || (e = this.languages), n || (n = this.options.ns), r || (r = an), this.services.backendConnector.reload(e, n, (a) => {
      i.resolve(), r(a);
    }), i;
  }
  use(e) {
    if (!e) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!e.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return e.type === "backend" && (this.modules.backend = e), (e.type === "logger" || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === "languageDetector" && (this.modules.languageDetector = e), e.type === "i18nFormat" && (this.modules.i18nFormat = e), e.type === "postProcessor" && Bi.addPostProcessor(e), e.type === "formatter" && (this.modules.formatter = e), e.type === "3rdParty" && this.modules.external.push(e), this;
  }
  setResolvedLanguage(e) {
    if (!(!e || !this.languages) && !(["cimode", "dev"].indexOf(e) > -1)) {
      for (let n = 0; n < this.languages.length; n++) {
        const r = this.languages[n];
        if (!(["cimode", "dev"].indexOf(r) > -1) && this.store.hasLanguageSomeTranslations(r)) {
          this.resolvedLanguage = r;
          break;
        }
      }
      !this.resolvedLanguage && this.languages.indexOf(e) < 0 && this.store.hasLanguageSomeTranslations(e) && (this.resolvedLanguage = e, this.languages.unshift(e));
    }
  }
  changeLanguage(e, n) {
    this.isLanguageChangingTo = e;
    const r = Ut();
    this.emit("languageChanging", e);
    const i = (s) => {
      this.language = s, this.languages = this.services.languageUtils.toResolveHierarchy(s), this.resolvedLanguage = void 0, this.setResolvedLanguage(s);
    }, a = (s, l) => {
      l ? this.isLanguageChangingTo === e && (i(l), this.translator.changeLanguage(l), this.isLanguageChangingTo = void 0, this.emit("languageChanged", l), this.logger.log("languageChanged", l)) : this.isLanguageChangingTo = void 0, r.resolve((...c) => this.t(...c)), n && n(s, (...c) => this.t(...c));
    }, o = (s) => {
      var g, d;
      !e && !s && this.services.languageDetector && (s = []);
      const l = J(s) ? s : s && s[0], c = this.store.hasLanguageSomeTranslations(l) ? l : this.services.languageUtils.getBestMatchFromCodes(J(s) ? [s] : s);
      c && (this.language || i(c), this.translator.language || this.translator.changeLanguage(c), (d = (g = this.services.languageDetector) == null ? void 0 : g.cacheUserLanguage) == null || d.call(g, c)), this.loadResources(c, (h) => {
        a(h, c);
      });
    };
    return !e && this.services.languageDetector && !this.services.languageDetector.async ? o(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(o) : this.services.languageDetector.detect(o) : o(e), r;
  }
  getFixedT(e, n, r) {
    const i = (a, o, ...s) => {
      let l;
      typeof o != "object" ? l = this.options.overloadTranslationOptionHandler([a, o].concat(s)) : l = {
        ...o
      }, l.lng = l.lng || i.lng, l.lngs = l.lngs || i.lngs, l.ns = l.ns || i.ns, l.keyPrefix !== "" && (l.keyPrefix = l.keyPrefix || r || i.keyPrefix);
      const c = this.options.keySeparator || ".";
      let g;
      return l.keyPrefix && Array.isArray(a) ? g = a.map((d) => (typeof d == "function" && (d = Vn(d, {
        ...this.options,
        ...o
      })), `${l.keyPrefix}${c}${d}`)) : (typeof a == "function" && (a = Vn(a, {
        ...this.options,
        ...o
      })), g = l.keyPrefix ? `${l.keyPrefix}${c}${a}` : a), this.t(g, l);
    };
    return J(e) ? i.lng = e : i.lngs = e, i.ns = n, i.keyPrefix = r, i;
  }
  t(...e) {
    var n;
    return (n = this.translator) == null ? void 0 : n.translate(...e);
  }
  exists(...e) {
    var n;
    return (n = this.translator) == null ? void 0 : n.exists(...e);
  }
  setDefaultNamespace(e) {
    this.options.defaultNS = e;
  }
  hasLoadedNamespace(e, n = {}) {
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const r = n.lng || this.resolvedLanguage || this.languages[0], i = this.options ? this.options.fallbackLng : !1, a = this.languages[this.languages.length - 1];
    if (r.toLowerCase() === "cimode") return !0;
    const o = (s, l) => {
      const c = this.services.backendConnector.state[`${s}|${l}`];
      return c === -1 || c === 0 || c === 2;
    };
    if (n.precheck) {
      const s = n.precheck(this, o);
      if (s !== void 0) return s;
    }
    return !!(this.hasResourceBundle(r, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || o(r, e) && (!i || o(a, e)));
  }
  loadNamespaces(e, n) {
    const r = Ut();
    return this.options.ns ? (J(e) && (e = [e]), e.forEach((i) => {
      this.options.ns.indexOf(i) < 0 && this.options.ns.push(i);
    }), this.loadResources((i) => {
      r.resolve(), n && n(i);
    }), r) : (n && n(), Promise.resolve());
  }
  loadLanguages(e, n) {
    const r = Ut();
    J(e) && (e = [e]);
    const i = this.options.preload || [], a = e.filter((o) => i.indexOf(o) < 0 && this.services.languageUtils.isSupportedCode(o));
    return a.length ? (this.options.preload = i.concat(a), this.loadResources((o) => {
      r.resolve(), n && n(o);
    }), r) : (n && n(), Promise.resolve());
  }
  dir(e) {
    var i, a;
    if (e || (e = this.resolvedLanguage || (((i = this.languages) == null ? void 0 : i.length) > 0 ? this.languages[0] : this.language)), !e) return "rtl";
    try {
      const o = new Intl.Locale(e);
      if (o && o.getTextInfo) {
        const s = o.getTextInfo();
        if (s && s.direction) return s.direction;
      }
    } catch {
    }
    const n = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], r = ((a = this.services) == null ? void 0 : a.languageUtils) || new Zr(Nn());
    return e.toLowerCase().indexOf("-latn") > 1 ? "ltr" : n.indexOf(r.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(e = {}, n) {
    const r = new Wt(e, n);
    return r.createInstance = Wt.createInstance, r;
  }
  cloneInstance(e = {}, n = an) {
    const r = e.forkResourceStore;
    r && delete e.forkResourceStore;
    const i = {
      ...this.options,
      ...e,
      isClone: !0
    }, a = new Wt(i);
    if ((e.debug !== void 0 || e.prefix !== void 0) && (a.logger = a.logger.clone(e)), ["store", "services", "language"].forEach((s) => {
      a[s] = this[s];
    }), a.services = {
      ...this.services
    }, a.services.utils = {
      hasLoadedNamespace: a.hasLoadedNamespace.bind(a)
    }, r) {
      const s = Object.keys(this.store.data).reduce((l, c) => (l[c] = {
        ...this.store.data[c]
      }, l[c] = Object.keys(l[c]).reduce((g, d) => (g[d] = {
        ...l[c][d]
      }, g), l[c]), l), {});
      a.store = new Ur(s, i), a.services.resourceStore = a.store;
    }
    if (e.interpolation) {
      const l = {
        ...Nn().interpolation,
        ...this.options.interpolation,
        ...e.interpolation
      }, c = {
        ...i,
        interpolation: l
      };
      a.services.interpolator = new qr(c);
    }
    return a.translator = new fn(a.services, i), a.translator.on("*", (s, ...l) => {
      a.emit(s, ...l);
    }), a.init(i, n), a.translator.options = i, a.translator.backendConnector.services.utils = {
      hasLoadedNamespace: a.hasLoadedNamespace.bind(a)
    }, a;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const Be = Wt.createInstance();
Be.createInstance;
Be.dir;
Be.init;
Be.loadResources;
Be.reloadResources;
Be.use;
Be.changeLanguage;
Be.getFixedT;
Be.t;
Be.exists;
Be.setDefaultNamespace;
Be.hasLoadedNamespace;
Be.loadNamespaces;
Be.loadLanguages;
var en, ne, Ui, yt, Qr, Hi, Zi, Ki, ar, Un, Hn, Wi, Qt = {}, Gi = [], Gs = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, tn = Array.isArray;
function ct(t, e) {
  for (var n in e) t[n] = e[n];
  return t;
}
function or(t) {
  t && t.parentNode && t.parentNode.removeChild(t);
}
function lt(t, e, n) {
  var r, i, a, o = {};
  for (a in e) a == "key" ? r = e[a] : a == "ref" ? i = e[a] : o[a] = e[a];
  if (arguments.length > 2 && (o.children = arguments.length > 3 ? en.call(arguments, 2) : n), typeof t == "function" && t.defaultProps != null) for (a in t.defaultProps) o[a] === void 0 && (o[a] = t.defaultProps[a]);
  return Gt(t, o, r, i, null);
}
function Gt(t, e, n, r, i) {
  var a = { type: t, props: e, key: n, ref: r, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: i ?? ++Ui, __i: -1, __u: 0 };
  return i == null && ne.vnode != null && ne.vnode(a), a;
}
function qi() {
  return { current: null };
}
function xe(t) {
  return t.children;
}
function Ye(t, e) {
  this.props = t, this.context = e;
}
function Ot(t, e) {
  if (e == null) return t.__ ? Ot(t.__, t.__i + 1) : null;
  for (var n; e < t.__k.length; e++) if ((n = t.__k[e]) != null && n.__e != null) return n.__e;
  return typeof t.type == "function" ? Ot(t) : null;
}
function Yi(t) {
  var e, n;
  if ((t = t.__) != null && t.__c != null) {
    for (t.__e = t.__c.base = null, e = 0; e < t.__k.length; e++) if ((n = t.__k[e]) != null && n.__e != null) {
      t.__e = t.__c.base = n.__e;
      break;
    }
    return Yi(t);
  }
}
function Zn(t) {
  (!t.__d && (t.__d = !0) && yt.push(t) && !gn.__r++ || Qr != ne.debounceRendering) && ((Qr = ne.debounceRendering) || Hi)(gn);
}
function gn() {
  for (var t, e, n, r, i, a, o, s = 1; yt.length; ) yt.length > s && yt.sort(Zi), t = yt.shift(), s = yt.length, t.__d && (n = void 0, r = void 0, i = (r = (e = t).__v).__e, a = [], o = [], e.__P && ((n = ct({}, r)).__v = r.__v + 1, ne.vnode && ne.vnode(n), sr(e.__P, n, r, e.__n, e.__P.namespaceURI, 32 & r.__u ? [i] : null, a, i ?? Ot(r), !!(32 & r.__u), o), n.__v = r.__v, n.__.__k[n.__i] = n, Xi(a, n, o), r.__e = r.__ = null, n.__e != i && Yi(n)));
  gn.__r = 0;
}
function Ji(t, e, n, r, i, a, o, s, l, c, g) {
  var d, h, p, f, _, v, y, C = r && r.__k || Gi, b = e.length;
  for (l = qs(n, e, C, l, b), d = 0; d < b; d++) (p = n.__k[d]) != null && (h = p.__i == -1 ? Qt : C[p.__i] || Qt, p.__i = d, v = sr(t, p, h, i, a, o, s, l, c, g), f = p.__e, p.ref && h.ref != p.ref && (h.ref && cr(h.ref, null, p), g.push(p.ref, p.__c || f, p)), _ == null && f != null && (_ = f), (y = !!(4 & p.__u)) || h.__k === p.__k ? l = Qi(p, l, t, y) : typeof p.type == "function" && v !== void 0 ? l = v : f && (l = f.nextSibling), p.__u &= -7);
  return n.__e = _, l;
}
function qs(t, e, n, r, i) {
  var a, o, s, l, c, g = n.length, d = g, h = 0;
  for (t.__k = new Array(i), a = 0; a < i; a++) (o = e[a]) != null && typeof o != "boolean" && typeof o != "function" ? (typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? o = t.__k[a] = Gt(null, o, null, null, null) : tn(o) ? o = t.__k[a] = Gt(xe, { children: o }, null, null, null) : o.constructor === void 0 && o.__b > 0 ? o = t.__k[a] = Gt(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : t.__k[a] = o, l = a + h, o.__ = t, o.__b = t.__b + 1, s = null, (c = o.__i = Ys(o, n, l, d)) != -1 && (d--, (s = n[c]) && (s.__u |= 2)), s == null || s.__v == null ? (c == -1 && (i > g ? h-- : i < g && h++), typeof o.type != "function" && (o.__u |= 4)) : c != l && (c == l - 1 ? h-- : c == l + 1 ? h++ : (c > l ? h-- : h++, o.__u |= 4))) : t.__k[a] = null;
  if (d) for (a = 0; a < g; a++) (s = n[a]) != null && !(2 & s.__u) && (s.__e == r && (r = Ot(s)), ta(s, s));
  return r;
}
function Qi(t, e, n, r) {
  var i, a;
  if (typeof t.type == "function") {
    for (i = t.__k, a = 0; i && a < i.length; a++) i[a] && (i[a].__ = t, e = Qi(i[a], e, n, r));
    return e;
  }
  t.__e != e && (r && (e && t.type && !e.parentNode && (e = Ot(t)), n.insertBefore(t.__e, e || null)), e = t.__e);
  do
    e = e && e.nextSibling;
  while (e != null && e.nodeType == 8);
  return e;
}
function ht(t, e) {
  return e = e || [], t == null || typeof t == "boolean" || (tn(t) ? t.some(function(n) {
    ht(n, e);
  }) : e.push(t)), e;
}
function Ys(t, e, n, r) {
  var i, a, o, s = t.key, l = t.type, c = e[n], g = c != null && (2 & c.__u) == 0;
  if (c === null && s == null || g && s == c.key && l == c.type) return n;
  if (r > (g ? 1 : 0)) {
    for (i = n - 1, a = n + 1; i >= 0 || a < e.length; ) if ((c = e[o = i >= 0 ? i-- : a++]) != null && !(2 & c.__u) && s == c.key && l == c.type) return o;
  }
  return -1;
}
function Xr(t, e, n) {
  e[0] == "-" ? t.setProperty(e, n ?? "") : t[e] = n == null ? "" : typeof n != "number" || Gs.test(e) ? n : n + "px";
}
function on(t, e, n, r, i) {
  var a, o;
  e: if (e == "style") if (typeof n == "string") t.style.cssText = n;
  else {
    if (typeof r == "string" && (t.style.cssText = r = ""), r) for (e in r) n && e in n || Xr(t.style, e, "");
    if (n) for (e in n) r && n[e] == r[e] || Xr(t.style, e, n[e]);
  }
  else if (e[0] == "o" && e[1] == "n") a = e != (e = e.replace(Ki, "$1")), o = e.toLowerCase(), e = o in t || e == "onFocusOut" || e == "onFocusIn" ? o.slice(2) : e.slice(2), t.l || (t.l = {}), t.l[e + a] = n, n ? r ? n.u = r.u : (n.u = ar, t.addEventListener(e, a ? Hn : Un, a)) : t.removeEventListener(e, a ? Hn : Un, a);
  else {
    if (i == "http://www.w3.org/2000/svg") e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (e != "width" && e != "height" && e != "href" && e != "list" && e != "form" && e != "tabIndex" && e != "download" && e != "rowSpan" && e != "colSpan" && e != "role" && e != "popover" && e in t) try {
      t[e] = n ?? "";
      break e;
    } catch {
    }
    typeof n == "function" || (n == null || n === !1 && e[4] != "-" ? t.removeAttribute(e) : t.setAttribute(e, e == "popover" && n == 1 ? "" : n));
  }
}
function ei(t) {
  return function(e) {
    if (this.l) {
      var n = this.l[e.type + t];
      if (e.t == null) e.t = ar++;
      else if (e.t < n.u) return;
      return n(ne.event ? ne.event(e) : e);
    }
  };
}
function sr(t, e, n, r, i, a, o, s, l, c) {
  var g, d, h, p, f, _, v, y, C, b, w, N, j, z, I, x, m, S = e.type;
  if (e.constructor !== void 0) return null;
  128 & n.__u && (l = !!(32 & n.__u), a = [s = e.__e = n.__e]), (g = ne.__b) && g(e);
  e: if (typeof S == "function") try {
    if (y = e.props, C = "prototype" in S && S.prototype.render, b = (g = S.contextType) && r[g.__c], w = g ? b ? b.props.value : g.__ : r, n.__c ? v = (d = e.__c = n.__c).__ = d.__E : (C ? e.__c = d = new S(y, w) : (e.__c = d = new Ye(y, w), d.constructor = S, d.render = Qs), b && b.sub(d), d.state || (d.state = {}), d.__n = r, h = d.__d = !0, d.__h = [], d._sb = []), C && d.__s == null && (d.__s = d.state), C && S.getDerivedStateFromProps != null && (d.__s == d.state && (d.__s = ct({}, d.__s)), ct(d.__s, S.getDerivedStateFromProps(y, d.__s))), p = d.props, f = d.state, d.__v = e, h) C && S.getDerivedStateFromProps == null && d.componentWillMount != null && d.componentWillMount(), C && d.componentDidMount != null && d.__h.push(d.componentDidMount);
    else {
      if (C && S.getDerivedStateFromProps == null && y !== p && d.componentWillReceiveProps != null && d.componentWillReceiveProps(y, w), e.__v == n.__v || !d.__e && d.shouldComponentUpdate != null && d.shouldComponentUpdate(y, d.__s, w) === !1) {
        for (e.__v != n.__v && (d.props = y, d.state = d.__s, d.__d = !1), e.__e = n.__e, e.__k = n.__k, e.__k.some(function(M) {
          M && (M.__ = e);
        }), N = 0; N < d._sb.length; N++) d.__h.push(d._sb[N]);
        d._sb = [], d.__h.length && o.push(d);
        break e;
      }
      d.componentWillUpdate != null && d.componentWillUpdate(y, d.__s, w), C && d.componentDidUpdate != null && d.__h.push(function() {
        d.componentDidUpdate(p, f, _);
      });
    }
    if (d.context = w, d.props = y, d.__P = t, d.__e = !1, j = ne.__r, z = 0, C) {
      for (d.state = d.__s, d.__d = !1, j && j(e), g = d.render(d.props, d.state, d.context), I = 0; I < d._sb.length; I++) d.__h.push(d._sb[I]);
      d._sb = [];
    } else do
      d.__d = !1, j && j(e), g = d.render(d.props, d.state, d.context), d.state = d.__s;
    while (d.__d && ++z < 25);
    d.state = d.__s, d.getChildContext != null && (r = ct(ct({}, r), d.getChildContext())), C && !h && d.getSnapshotBeforeUpdate != null && (_ = d.getSnapshotBeforeUpdate(p, f)), x = g, g != null && g.type === xe && g.key == null && (x = ea(g.props.children)), s = Ji(t, tn(x) ? x : [x], e, n, r, i, a, o, s, l, c), d.base = e.__e, e.__u &= -161, d.__h.length && o.push(d), v && (d.__E = d.__ = null);
  } catch (M) {
    if (e.__v = null, l || a != null) if (M.then) {
      for (e.__u |= l ? 160 : 128; s && s.nodeType == 8 && s.nextSibling; ) s = s.nextSibling;
      a[a.indexOf(s)] = null, e.__e = s;
    } else {
      for (m = a.length; m--; ) or(a[m]);
      Kn(e);
    }
    else e.__e = n.__e, e.__k = n.__k, M.then || Kn(e);
    ne.__e(M, e, n);
  }
  else a == null && e.__v == n.__v ? (e.__k = n.__k, e.__e = n.__e) : s = e.__e = Js(n.__e, e, n, r, i, a, o, l, c);
  return (g = ne.diffed) && g(e), 128 & e.__u ? void 0 : s;
}
function Kn(t) {
  t && t.__c && (t.__c.__e = !0), t && t.__k && t.__k.forEach(Kn);
}
function Xi(t, e, n) {
  for (var r = 0; r < n.length; r++) cr(n[r], n[++r], n[++r]);
  ne.__c && ne.__c(e, t), t.some(function(i) {
    try {
      t = i.__h, i.__h = [], t.some(function(a) {
        a.call(i);
      });
    } catch (a) {
      ne.__e(a, i.__v);
    }
  });
}
function ea(t) {
  return typeof t != "object" || t == null || t.__b && t.__b > 0 ? t : tn(t) ? t.map(ea) : ct({}, t);
}
function Js(t, e, n, r, i, a, o, s, l) {
  var c, g, d, h, p, f, _, v = n.props || Qt, y = e.props, C = e.type;
  if (C == "svg" ? i = "http://www.w3.org/2000/svg" : C == "math" ? i = "http://www.w3.org/1998/Math/MathML" : i || (i = "http://www.w3.org/1999/xhtml"), a != null) {
    for (c = 0; c < a.length; c++) if ((p = a[c]) && "setAttribute" in p == !!C && (C ? p.localName == C : p.nodeType == 3)) {
      t = p, a[c] = null;
      break;
    }
  }
  if (t == null) {
    if (C == null) return document.createTextNode(y);
    t = document.createElementNS(i, C, y.is && y), s && (ne.__m && ne.__m(e, a), s = !1), a = null;
  }
  if (C == null) v === y || s && t.data == y || (t.data = y);
  else {
    if (a = a && en.call(t.childNodes), !s && a != null) for (v = {}, c = 0; c < t.attributes.length; c++) v[(p = t.attributes[c]).name] = p.value;
    for (c in v) if (p = v[c], c != "children") {
      if (c == "dangerouslySetInnerHTML") d = p;
      else if (!(c in y)) {
        if (c == "value" && "defaultValue" in y || c == "checked" && "defaultChecked" in y) continue;
        on(t, c, null, p, i);
      }
    }
    for (c in y) p = y[c], c == "children" ? h = p : c == "dangerouslySetInnerHTML" ? g = p : c == "value" ? f = p : c == "checked" ? _ = p : s && typeof p != "function" || v[c] === p || on(t, c, p, v[c], i);
    if (g) s || d && (g.__html == d.__html || g.__html == t.innerHTML) || (t.innerHTML = g.__html), e.__k = [];
    else if (d && (t.innerHTML = ""), Ji(e.type == "template" ? t.content : t, tn(h) ? h : [h], e, n, r, C == "foreignObject" ? "http://www.w3.org/1999/xhtml" : i, a, o, a ? a[0] : n.__k && Ot(n, 0), s, l), a != null) for (c = a.length; c--; ) or(a[c]);
    s || (c = "value", C == "progress" && f == null ? t.removeAttribute("value") : f != null && (f !== t[c] || C == "progress" && !f || C == "option" && f != v[c]) && on(t, c, f, v[c], i), c = "checked", _ != null && _ != t[c] && on(t, c, _, v[c], i));
  }
  return t;
}
function cr(t, e, n) {
  try {
    if (typeof t == "function") {
      var r = typeof t.__u == "function";
      r && t.__u(), r && e == null || (t.__u = t(e));
    } else t.current = e;
  } catch (i) {
    ne.__e(i, n);
  }
}
function ta(t, e, n) {
  var r, i;
  if (ne.unmount && ne.unmount(t), (r = t.ref) && (r.current && r.current != t.__e || cr(r, null, e)), (r = t.__c) != null) {
    if (r.componentWillUnmount) try {
      r.componentWillUnmount();
    } catch (a) {
      ne.__e(a, e);
    }
    r.base = r.__P = null;
  }
  if (r = t.__k) for (i = 0; i < r.length; i++) r[i] && ta(r[i], e, n || typeof t.type != "function");
  n || or(t.__e), t.__c = t.__ = t.__e = void 0;
}
function Qs(t, e, n) {
  return this.constructor(t, n);
}
function pt(t, e, n) {
  var r, i, a, o;
  e == document && (e = document.documentElement), ne.__ && ne.__(t, e), i = (r = typeof n == "function") ? null : n && n.__k || e.__k, a = [], o = [], sr(e, t = (!r && n || e).__k = lt(xe, null, [t]), i || Qt, Qt, e.namespaceURI, !r && n ? [n] : i ? null : e.firstChild ? en.call(e.childNodes) : null, a, !r && n ? n : i ? i.__e : e.firstChild, r, o), Xi(a, t, o);
}
function na(t, e) {
  pt(t, e, na);
}
function Xs(t, e, n) {
  var r, i, a, o, s = ct({}, t.props);
  for (a in t.type && t.type.defaultProps && (o = t.type.defaultProps), e) a == "key" ? r = e[a] : a == "ref" ? i = e[a] : s[a] = e[a] === void 0 && o != null ? o[a] : e[a];
  return arguments.length > 2 && (s.children = arguments.length > 3 ? en.call(arguments, 2) : n), Gt(t.type, s, r || t.key, i || t.ref, null);
}
function nt(t) {
  function e(n) {
    var r, i;
    return this.getChildContext || (r = /* @__PURE__ */ new Set(), (i = {})[e.__c] = this, this.getChildContext = function() {
      return i;
    }, this.componentWillUnmount = function() {
      r = null;
    }, this.shouldComponentUpdate = function(a) {
      this.props.value != a.value && r.forEach(function(o) {
        o.__e = !0, Zn(o);
      });
    }, this.sub = function(a) {
      r.add(a);
      var o = a.componentWillUnmount;
      a.componentWillUnmount = function() {
        r && r.delete(a), o && o.call(a);
      };
    }), n.children;
  }
  return e.__c = "__cC" + Wi++, e.__ = t, e.Provider = e.__l = (e.Consumer = function(n, r) {
    return n.children(r);
  }).contextType = e, e;
}
en = Gi.slice, ne = { __e: function(t, e, n, r) {
  for (var i, a, o; e = e.__; ) if ((i = e.__c) && !i.__) try {
    if ((a = i.constructor) && a.getDerivedStateFromError != null && (i.setState(a.getDerivedStateFromError(t)), o = i.__d), i.componentDidCatch != null && (i.componentDidCatch(t, r || {}), o = i.__d), o) return i.__E = i;
  } catch (s) {
    t = s;
  }
  throw t;
} }, Ui = 0, Ye.prototype.setState = function(t, e) {
  var n;
  n = this.__s != null && this.__s != this.state ? this.__s : this.__s = ct({}, this.state), typeof t == "function" && (t = t(ct({}, n), this.props)), t && ct(n, t), t != null && this.__v && (e && this._sb.push(e), Zn(this));
}, Ye.prototype.forceUpdate = function(t) {
  this.__v && (this.__e = !0, t && this.__h.push(t), Zn(this));
}, Ye.prototype.render = xe, yt = [], Hi = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Zi = function(t, e) {
  return t.__v.__b - e.__v.__b;
}, gn.__r = 0, Ki = /(PointerCapture)$|Capture$/i, ar = 0, Un = ei(!1), Hn = ei(!0), Wi = 0;
var ft, pe, En, ti, Pt = 0, ra = [], Ce = ne, ni = Ce.__b, ri = Ce.__r, ii = Ce.diffed, ai = Ce.__c, oi = Ce.unmount, si = Ce.__;
function St(t, e) {
  Ce.__h && Ce.__h(pe, t, Pt || e), Pt = 0;
  var n = pe.__H || (pe.__H = { __: [], __h: [] });
  return t >= n.__.length && n.__.push({}), n.__[t];
}
function A(t) {
  return Pt = 1, Sn(aa, t);
}
function Sn(t, e, n) {
  var r = St(ft++, 2);
  if (r.t = t, !r.__c && (r.__ = [n ? n(e) : aa(void 0, e), function(s) {
    var l = r.__N ? r.__N[0] : r.__[0], c = r.t(l, s);
    l !== c && (r.__N = [c, r.__[1]], r.__c.setState({}));
  }], r.__c = pe, !pe.__f)) {
    var i = function(s, l, c) {
      if (!r.__c.__H) return !0;
      var g = r.__c.__H.__.filter(function(h) {
        return !!h.__c;
      });
      if (g.every(function(h) {
        return !h.__N;
      })) return !a || a.call(this, s, l, c);
      var d = r.__c.props !== s;
      return g.forEach(function(h) {
        if (h.__N) {
          var p = h.__[0];
          h.__ = h.__N, h.__N = void 0, p !== h.__[0] && (d = !0);
        }
      }), a && a.call(this, s, l, c) || d;
    };
    pe.__f = !0;
    var a = pe.shouldComponentUpdate, o = pe.componentWillUpdate;
    pe.componentWillUpdate = function(s, l, c) {
      if (this.__e) {
        var g = a;
        a = void 0, i(s, l, c), a = g;
      }
      o && o.call(this, s, l, c);
    }, pe.shouldComponentUpdate = i;
  }
  return r.__N || r.__;
}
function E(t, e) {
  var n = St(ft++, 3);
  !Ce.__s && hr(n.__H, e) && (n.__ = t, n.u = e, pe.__H.__h.push(n));
}
function mt(t, e) {
  var n = St(ft++, 4);
  !Ce.__s && hr(n.__H, e) && (n.__ = t, n.u = e, pe.__h.push(n));
}
function q(t) {
  return Pt = 5, Me(function() {
    return { current: t };
  }, []);
}
function lr(t, e, n) {
  Pt = 6, mt(function() {
    if (typeof t == "function") {
      var r = t(e());
      return function() {
        t(null), r && typeof r == "function" && r();
      };
    }
    if (t) return t.current = e(), function() {
      return t.current = null;
    };
  }, n == null ? n : n.concat(t));
}
function Me(t, e) {
  var n = St(ft++, 7);
  return hr(n.__H, e) && (n.__ = t(), n.__H = e, n.__h = t), n.__;
}
function Z(t, e) {
  return Pt = 8, Me(function() {
    return t;
  }, e);
}
function ce(t) {
  var e = pe.context[t.__c], n = St(ft++, 9);
  return n.c = t, e ? (n.__ == null && (n.__ = !0, e.sub(pe)), e.props.value) : t.__;
}
function dr(t, e) {
  Ce.useDebugValue && Ce.useDebugValue(e ? e(t) : t);
}
function ia(t) {
  var e = St(ft++, 10), n = A();
  return e.__ = t, pe.componentDidCatch || (pe.componentDidCatch = function(r, i) {
    e.__ && e.__(r, i), n[1](r);
  }), [n[0], function() {
    n[1](void 0);
  }];
}
function ur() {
  var t = St(ft++, 11);
  if (!t.__) {
    for (var e = pe.__v; e !== null && !e.__m && e.__ !== null; ) e = e.__;
    var n = e.__m || (e.__m = [0, 0]);
    t.__ = "P" + n[0] + "-" + n[1]++;
  }
  return t.__;
}
function ec() {
  for (var t; t = ra.shift(); ) if (t.__P && t.__H) try {
    t.__H.__h.forEach(dn), t.__H.__h.forEach(Wn), t.__H.__h = [];
  } catch (e) {
    t.__H.__h = [], Ce.__e(e, t.__v);
  }
}
Ce.__b = function(t) {
  pe = null, ni && ni(t);
}, Ce.__ = function(t, e) {
  t && e.__k && e.__k.__m && (t.__m = e.__k.__m), si && si(t, e);
}, Ce.__r = function(t) {
  ri && ri(t), ft = 0;
  var e = (pe = t.__c).__H;
  e && (En === pe ? (e.__h = [], pe.__h = [], e.__.forEach(function(n) {
    n.__N && (n.__ = n.__N), n.u = n.__N = void 0;
  })) : (e.__h.forEach(dn), e.__h.forEach(Wn), e.__h = [], ft = 0)), En = pe;
}, Ce.diffed = function(t) {
  ii && ii(t);
  var e = t.__c;
  e && e.__H && (e.__H.__h.length && (ra.push(e) !== 1 && ti === Ce.requestAnimationFrame || ((ti = Ce.requestAnimationFrame) || tc)(ec)), e.__H.__.forEach(function(n) {
    n.u && (n.__H = n.u), n.u = void 0;
  })), En = pe = null;
}, Ce.__c = function(t, e) {
  e.some(function(n) {
    try {
      n.__h.forEach(dn), n.__h = n.__h.filter(function(r) {
        return !r.__ || Wn(r);
      });
    } catch (r) {
      e.some(function(i) {
        i.__h && (i.__h = []);
      }), e = [], Ce.__e(r, n.__v);
    }
  }), ai && ai(t, e);
}, Ce.unmount = function(t) {
  oi && oi(t);
  var e, n = t.__c;
  n && n.__H && (n.__H.__.forEach(function(r) {
    try {
      dn(r);
    } catch (i) {
      e = i;
    }
  }), n.__H = void 0, e && Ce.__e(e, n.__v));
};
var ci = typeof requestAnimationFrame == "function";
function tc(t) {
  var e, n = function() {
    clearTimeout(r), ci && cancelAnimationFrame(e), setTimeout(t);
  }, r = setTimeout(n, 35);
  ci && (e = requestAnimationFrame(n));
}
function dn(t) {
  var e = pe, n = t.__c;
  typeof n == "function" && (t.__c = void 0, n()), pe = e;
}
function Wn(t) {
  var e = pe;
  t.__c = t.__(), pe = e;
}
function hr(t, e) {
  return !t || t.length !== e.length || e.some(function(n, r) {
    return n !== t[r];
  });
}
function aa(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function oa(t, e) {
  for (var n in e) t[n] = e[n];
  return t;
}
function Gn(t, e) {
  for (var n in t) if (n !== "__source" && !(n in e)) return !0;
  for (var r in e) if (r !== "__source" && t[r] !== e[r]) return !0;
  return !1;
}
function fr(t, e) {
  var n = e(), r = A({ t: { __: n, u: e } }), i = r[0].t, a = r[1];
  return mt(function() {
    i.__ = n, i.u = e, An(i) && a({ t: i });
  }, [t, n, e]), E(function() {
    return An(i) && a({ t: i }), t(function() {
      An(i) && a({ t: i });
    });
  }, [t]), n;
}
function An(t) {
  var e, n, r = t.u, i = t.__;
  try {
    var a = r();
    return !((e = i) === (n = a) && (e !== 0 || 1 / e == 1 / n) || e != e && n != n);
  } catch {
    return !0;
  }
}
function gr(t) {
  t();
}
function pr(t) {
  return t;
}
function mr() {
  return [!1, gr];
}
var _r = mt;
function pn(t, e) {
  this.props = t, this.context = e;
}
function sa(t, e) {
  function n(i) {
    var a = this.props.ref, o = a == i.ref;
    return !o && a && (a.call ? a(null) : a.current = null), e ? !e(this.props, i) || !o : Gn(this.props, i);
  }
  function r(i) {
    return this.shouldComponentUpdate = n, lt(t, i);
  }
  return r.displayName = "Memo(" + (t.displayName || t.name) + ")", r.prototype.isReactComponent = !0, r.__f = !0, r.type = t, r;
}
(pn.prototype = new Ye()).isPureReactComponent = !0, pn.prototype.shouldComponentUpdate = function(t, e) {
  return Gn(this.props, t) || Gn(this.state, e);
};
var li = ne.__b;
ne.__b = function(t) {
  t.type && t.type.__f && t.ref && (t.props.ref = t.ref, t.ref = null), li && li(t);
};
var nc = typeof Symbol < "u" && Symbol.for && Symbol.for("react.forward_ref") || 3911;
function vr(t) {
  function e(n) {
    var r = oa({}, n);
    return delete r.ref, t(r, n.ref || null);
  }
  return e.$$typeof = nc, e.render = t, e.prototype.isReactComponent = e.__f = !0, e.displayName = "ForwardRef(" + (t.displayName || t.name) + ")", e;
}
var di = function(t, e) {
  return t == null ? null : ht(ht(t).map(e));
}, ca = { map: di, forEach: di, count: function(t) {
  return t ? ht(t).length : 0;
}, only: function(t) {
  var e = ht(t);
  if (e.length !== 1) throw "Children.only";
  return e[0];
}, toArray: ht }, rc = ne.__e;
ne.__e = function(t, e, n, r) {
  if (t.then) {
    for (var i, a = e; a = a.__; ) if ((i = a.__c) && i.__c) return e.__e == null && (e.__e = n.__e, e.__k = n.__k), i.__c(t, e);
  }
  rc(t, e, n, r);
};
var ui = ne.unmount;
function la(t, e, n) {
  return t && (t.__c && t.__c.__H && (t.__c.__H.__.forEach(function(r) {
    typeof r.__c == "function" && r.__c();
  }), t.__c.__H = null), (t = oa({}, t)).__c != null && (t.__c.__P === n && (t.__c.__P = e), t.__c.__e = !0, t.__c = null), t.__k = t.__k && t.__k.map(function(r) {
    return la(r, e, n);
  })), t;
}
function da(t, e, n) {
  return t && n && (t.__v = null, t.__k = t.__k && t.__k.map(function(r) {
    return da(r, e, n);
  }), t.__c && t.__c.__P === e && (t.__e && n.appendChild(t.__e), t.__c.__e = !0, t.__c.__P = n)), t;
}
function Dt() {
  this.__u = 0, this.o = null, this.__b = null;
}
function ua(t) {
  var e = t.__.__c;
  return e && e.__a && e.__a(t);
}
function ha(t) {
  var e, n, r, i = null;
  function a(o) {
    if (e || (e = t()).then(function(s) {
      s && (i = s.default || s), r = !0;
    }, function(s) {
      n = s, r = !0;
    }), n) throw n;
    if (!r) throw e;
    return i ? lt(i, o) : null;
  }
  return a.displayName = "Lazy", a.__f = !0, a;
}
function At() {
  this.i = null, this.l = null;
}
ne.unmount = function(t) {
  var e = t.__c;
  e && e.__R && e.__R(), e && 32 & t.__u && (t.type = null), ui && ui(t);
}, (Dt.prototype = new Ye()).__c = function(t, e) {
  var n = e.__c, r = this;
  r.o == null && (r.o = []), r.o.push(n);
  var i = ua(r.__v), a = !1, o = function() {
    a || (a = !0, n.__R = null, i ? i(s) : s());
  };
  n.__R = o;
  var s = function() {
    if (!--r.__u) {
      if (r.state.__a) {
        var l = r.state.__a;
        r.__v.__k[0] = da(l, l.__c.__P, l.__c.__O);
      }
      var c;
      for (r.setState({ __a: r.__b = null }); c = r.o.pop(); ) c.forceUpdate();
    }
  };
  r.__u++ || 32 & e.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), t.then(o, o);
}, Dt.prototype.componentWillUnmount = function() {
  this.o = [];
}, Dt.prototype.render = function(t, e) {
  if (this.__b) {
    if (this.__v.__k) {
      var n = document.createElement("div"), r = this.__v.__k[0].__c;
      this.__v.__k[0] = la(this.__b, n, r.__O = r.__P);
    }
    this.__b = null;
  }
  var i = e.__a && lt(xe, null, t.fallback);
  return i && (i.__u &= -33), [lt(xe, null, e.__a ? null : t.children), i];
};
var hi = function(t, e, n) {
  if (++n[1] === n[0] && t.l.delete(e), t.props.revealOrder && (t.props.revealOrder[0] !== "t" || !t.l.size)) for (n = t.i; n; ) {
    for (; n.length > 3; ) n.pop()();
    if (n[1] < n[0]) break;
    t.i = n = n[2];
  }
};
function ic(t) {
  return this.getChildContext = function() {
    return t.context;
  }, t.children;
}
function ac(t) {
  var e = this, n = t.h;
  if (e.componentWillUnmount = function() {
    pt(null, e.v), e.v = null, e.h = null;
  }, e.h && e.h !== n && e.componentWillUnmount(), !e.v) {
    for (var r = e.__v; r !== null && !r.__m && r.__ !== null; ) r = r.__;
    e.h = n, e.v = { nodeType: 1, parentNode: n, childNodes: [], __k: { __m: r.__m }, contains: function() {
      return !0;
    }, insertBefore: function(i, a) {
      this.childNodes.push(i), e.h.insertBefore(i, a);
    }, removeChild: function(i) {
      this.childNodes.splice(this.childNodes.indexOf(i) >>> 1, 1), e.h.removeChild(i);
    } };
  }
  pt(lt(ic, { context: e.context }, t.__v), e.v);
}
function mn(t, e) {
  var n = lt(ac, { __v: t, h: e });
  return n.containerInfo = e, n;
}
(At.prototype = new Ye()).__a = function(t) {
  var e = this, n = ua(e.__v), r = e.l.get(t);
  return r[0]++, function(i) {
    var a = function() {
      e.props.revealOrder ? (r.push(i), hi(e, t, r)) : i();
    };
    n ? n(a) : a();
  };
}, At.prototype.render = function(t) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var e = ht(t.children);
  t.revealOrder && t.revealOrder[0] === "b" && e.reverse();
  for (var n = e.length; n--; ) this.l.set(e[n], this.i = [1, 0, this.i]);
  return t.children;
}, At.prototype.componentDidUpdate = At.prototype.componentDidMount = function() {
  var t = this;
  this.l.forEach(function(e, n) {
    hi(t, n, e);
  });
};
var fa = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, oc = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, sc = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, cc = /[A-Z0-9]/g, lc = typeof document < "u", dc = function(t) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(t);
};
function ga(t, e, n) {
  return e.__k == null && (e.textContent = ""), pt(t, e), typeof n == "function" && n(), t ? t.__c : null;
}
function pa(t, e, n) {
  return na(t, e), typeof n == "function" && n(), t ? t.__c : null;
}
Ye.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t) {
  Object.defineProperty(Ye.prototype, t, { configurable: !0, get: function() {
    return this["UNSAFE_" + t];
  }, set: function(e) {
    Object.defineProperty(this, t, { configurable: !0, writable: !0, value: e });
  } });
});
var fi = ne.event;
function uc() {
}
function hc() {
  return this.cancelBubble;
}
function fc() {
  return this.defaultPrevented;
}
ne.event = function(t) {
  return fi && (t = fi(t)), t.persist = uc, t.isPropagationStopped = hc, t.isDefaultPrevented = fc, t.nativeEvent = t;
};
var yr, gc = { enumerable: !1, configurable: !0, get: function() {
  return this.class;
} }, gi = ne.vnode;
ne.vnode = function(t) {
  typeof t.type == "string" && function(e) {
    var n = e.props, r = e.type, i = {}, a = r.indexOf("-") === -1;
    for (var o in n) {
      var s = n[o];
      if (!(o === "value" && "defaultValue" in n && s == null || lc && o === "children" && r === "noscript" || o === "class" || o === "className")) {
        var l = o.toLowerCase();
        o === "defaultValue" && "value" in n && n.value == null ? o = "value" : o === "download" && s === !0 ? s = "" : l === "translate" && s === "no" ? s = !1 : l[0] === "o" && l[1] === "n" ? l === "ondoubleclick" ? o = "ondblclick" : l !== "onchange" || r !== "input" && r !== "textarea" || dc(n.type) ? l === "onfocus" ? o = "onfocusin" : l === "onblur" ? o = "onfocusout" : sc.test(o) && (o = l) : l = o = "oninput" : a && oc.test(o) ? o = o.replace(cc, "-$&").toLowerCase() : s === null && (s = void 0), l === "oninput" && i[o = l] && (o = "oninputCapture"), i[o] = s;
      }
    }
    r == "select" && i.multiple && Array.isArray(i.value) && (i.value = ht(n.children).forEach(function(c) {
      c.props.selected = i.value.indexOf(c.props.value) != -1;
    })), r == "select" && i.defaultValue != null && (i.value = ht(n.children).forEach(function(c) {
      c.props.selected = i.multiple ? i.defaultValue.indexOf(c.props.value) != -1 : i.defaultValue == c.props.value;
    })), n.class && !n.className ? (i.class = n.class, Object.defineProperty(i, "className", gc)) : (n.className && !n.class || n.class && n.className) && (i.class = i.className = n.className), e.props = i;
  }(t), t.$$typeof = fa, gi && gi(t);
};
var pi = ne.__r;
ne.__r = function(t) {
  pi && pi(t), yr = t.__c;
};
var mi = ne.diffed;
ne.diffed = function(t) {
  mi && mi(t);
  var e = t.props, n = t.__e;
  n != null && t.type === "textarea" && "value" in e && e.value !== n.value && (n.value = e.value == null ? "" : e.value), yr = null;
};
var ma = { ReactCurrentDispatcher: { current: { readContext: function(t) {
  return yr.__n[t.__c].props.value;
}, useCallback: Z, useContext: ce, useDebugValue: dr, useDeferredValue: pr, useEffect: E, useId: ur, useImperativeHandle: lr, useInsertionEffect: _r, useLayoutEffect: mt, useMemo: Me, useReducer: Sn, useRef: q, useState: A, useSyncExternalStore: fr, useTransition: mr } } }, pc = "18.3.1";
function _a(t) {
  return lt.bind(null, t);
}
function nn(t) {
  return !!t && t.$$typeof === fa;
}
function va(t) {
  return nn(t) && t.type === xe;
}
function ya(t) {
  return !!t && !!t.displayName && (typeof t.displayName == "string" || t.displayName instanceof String) && t.displayName.startsWith("Memo(");
}
function wa(t) {
  return nn(t) ? Xs.apply(null, arguments) : t;
}
function Ca(t) {
  return !!t.__k && (pt(null, t), !0);
}
function ba(t) {
  return t && (t.base || t.nodeType === 1 && t) || null;
}
var qt = function(t, e) {
  return t(e);
}, Sa = function(t, e) {
  return t(e);
}, Ma = xe, ka = nn, mc = { useState: A, useId: ur, useReducer: Sn, useEffect: E, useLayoutEffect: mt, useInsertionEffect: _r, useTransition: mr, useDeferredValue: pr, useSyncExternalStore: fr, startTransition: gr, useRef: q, useImperativeHandle: lr, useMemo: Me, useCallback: Z, useContext: ce, useDebugValue: dr, version: "18.3.1", Children: ca, render: ga, hydrate: pa, unmountComponentAtNode: Ca, createPortal: mn, createElement: lt, createContext: nt, createFactory: _a, cloneElement: wa, createRef: qi, Fragment: xe, isValidElement: nn, isElement: ka, isFragment: va, isMemo: ya, findDOMNode: ba, Component: Ye, PureComponent: pn, memo: sa, forwardRef: vr, flushSync: Sa, unstable_batchedUpdates: qt, StrictMode: Ma, Suspense: Dt, SuspenseList: At, lazy: ha, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ma };
const _c = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: ca,
  Component: Ye,
  Fragment: xe,
  PureComponent: pn,
  StrictMode: Ma,
  Suspense: Dt,
  SuspenseList: At,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ma,
  cloneElement: wa,
  createContext: nt,
  createElement: lt,
  createFactory: _a,
  createPortal: mn,
  createRef: qi,
  default: mc,
  findDOMNode: ba,
  flushSync: Sa,
  forwardRef: vr,
  hydrate: pa,
  isElement: ka,
  isFragment: va,
  isMemo: ya,
  isValidElement: nn,
  lazy: ha,
  memo: sa,
  render: ga,
  startTransition: gr,
  unmountComponentAtNode: Ca,
  unstable_batchedUpdates: qt,
  useCallback: Z,
  useContext: ce,
  useDebugValue: dr,
  useDeferredValue: pr,
  useEffect: E,
  useErrorBoundary: ia,
  useId: ur,
  useImperativeHandle: lr,
  useInsertionEffect: _r,
  useLayoutEffect: mt,
  useMemo: Me,
  useReducer: Sn,
  useRef: q,
  useState: A,
  useSyncExternalStore: fr,
  useTransition: mr,
  version: pc
}, Symbol.toStringTag, { value: "Module" }));
var ad = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function od(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function vc(t) {
  if (t.__esModule) return t;
  var e = t.default;
  if (typeof e == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    n.prototype = e.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(t).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(t, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return t[r];
      }
    });
  }), n;
}
const yc = (t, e, n, r) => {
  var a, o, s, l;
  const i = [n, {
    code: e,
    ...r || {}
  }];
  if ((o = (a = t == null ? void 0 : t.services) == null ? void 0 : a.logger) != null && o.forward)
    return t.services.logger.forward(i, "warn", "react-i18next::", !0);
  bt(i[0]) && (i[0] = `react-i18next:: ${i[0]}`), (l = (s = t == null ? void 0 : t.services) == null ? void 0 : s.logger) != null && l.warn ? t.services.logger.warn(...i) : console != null && console.warn && console.warn(...i);
}, _i = {}, La = (t, e, n, r) => {
  bt(n) && _i[n] || (bt(n) && (_i[n] = /* @__PURE__ */ new Date()), yc(t, e, n, r));
}, xa = (t, e) => () => {
  if (t.isInitialized)
    e();
  else {
    const n = () => {
      setTimeout(() => {
        t.off("initialized", n);
      }, 0), e();
    };
    t.on("initialized", n);
  }
}, qn = (t, e, n) => {
  t.loadNamespaces(e, xa(t, n));
}, vi = (t, e, n, r) => {
  if (bt(n) && (n = [n]), t.options.preload && t.options.preload.indexOf(e) > -1) return qn(t, n, r);
  n.forEach((i) => {
    t.options.ns.indexOf(i) < 0 && t.options.ns.push(i);
  }), t.loadLanguages(e, xa(t, r));
}, wc = (t, e, n = {}) => !e.languages || !e.languages.length ? (La(e, "NO_LANGUAGES", "i18n.languages were undefined or empty", {
  languages: e.languages
}), !0) : e.hasLoadedNamespace(t, {
  lng: n.lng,
  precheck: (r, i) => {
    if (n.bindI18n && n.bindI18n.indexOf("languageChanging") > -1 && r.services.backendConnector.backend && r.isLanguageChangingTo && !i(r.isLanguageChangingTo, t)) return !1;
  }
}), bt = (t) => typeof t == "string", Cc = (t) => typeof t == "object" && t !== null, bc = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g, Sc = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "Â©",
  "&#169;": "Â©",
  "&reg;": "Â®",
  "&#174;": "Â®",
  "&hellip;": "â€¦",
  "&#8230;": "â€¦",
  "&#x2F;": "/",
  "&#47;": "/"
}, Mc = (t) => Sc[t], kc = (t) => t.replace(bc, Mc);
let Yn = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: !0,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: !0,
  unescape: kc,
  transDefaultProps: void 0
};
const Lc = (t = {}) => {
  Yn = {
    ...Yn,
    ...t
  };
}, xc = () => Yn;
let Ia;
const Ic = (t) => {
  Ia = t;
}, Nc = () => Ia, Ec = {
  type: "3rdParty",
  init(t) {
    Lc(t.options.react), Ic(t);
  }
}, Ac = nt();
class Tc {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(e) {
    e.forEach((n) => {
      this.usedNamespaces[n] || (this.usedNamespaces[n] = !0);
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
var Na = { exports: {} }, Ea = {};
const Dc = /* @__PURE__ */ vc(_c);
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rt = Dc;
function Oc(t, e) {
  return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
}
var Pc = typeof Object.is == "function" ? Object.is : Oc, Rc = Rt.useState, jc = Rt.useEffect, zc = Rt.useLayoutEffect, $c = Rt.useDebugValue;
function Fc(t, e) {
  var n = e(), r = Rc({ inst: { value: n, getSnapshot: e } }), i = r[0].inst, a = r[1];
  return zc(
    function() {
      i.value = n, i.getSnapshot = e, Tn(i) && a({ inst: i });
    },
    [t, n, e]
  ), jc(
    function() {
      return Tn(i) && a({ inst: i }), t(function() {
        Tn(i) && a({ inst: i });
      });
    },
    [t]
  ), $c(n), n;
}
function Tn(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var n = e();
    return !Pc(t, n);
  } catch {
    return !0;
  }
}
function Bc(t, e) {
  return e();
}
var Vc = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? Bc : Fc;
Ea.useSyncExternalStore = Rt.useSyncExternalStore !== void 0 ? Rt.useSyncExternalStore : Vc;
Na.exports = Ea;
var Uc = Na.exports;
const Hc = (t, e) => bt(e) ? e : Cc(e) && bt(e.defaultValue) ? e.defaultValue : Array.isArray(t) ? t[t.length - 1] : t, Zc = {
  t: Hc,
  ready: !1
}, Kc = () => () => {
}, rt = (t, e = {}) => {
  var x, m, S;
  const {
    i18n: n
  } = e, {
    i18n: r,
    defaultNS: i
  } = ce(Ac) || {}, a = n || r || Nc();
  a && !a.reportNamespaces && (a.reportNamespaces = new Tc()), a || La(a, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
  const o = Me(() => {
    var M;
    return {
      ...xc(),
      ...(M = a == null ? void 0 : a.options) == null ? void 0 : M.react,
      ...e
    };
  }, [a, e]), {
    useSuspense: s,
    keyPrefix: l
  } = o, c = i || ((x = a == null ? void 0 : a.options) == null ? void 0 : x.defaultNS), g = bt(c) ? [c] : c || ["translation"], d = Me(() => g, g);
  (S = (m = a == null ? void 0 : a.reportNamespaces) == null ? void 0 : m.addUsedNamespaces) == null || S.call(m, d);
  const h = q(0), p = Z((M) => {
    if (!a) return Kc;
    const {
      bindI18n: k,
      bindI18nStore: T
    } = o, D = () => {
      h.current += 1, M();
    };
    return k && a.on(k, D), T && a.store.on(T, D), () => {
      k && k.split(" ").forEach((F) => a.off(F, D)), T && T.split(" ").forEach((F) => a.store.off(F, D));
    };
  }, [a, o]), f = q(), _ = Z(() => {
    if (!a)
      return Zc;
    const M = !!(a.isInitialized || a.initializedStoreOnce) && d.every((ee) => wc(ee, a, o)), k = e.lng || a.language, T = h.current, D = f.current;
    if (D && D.ready === M && D.lng === k && D.keyPrefix === l && D.revision === T)
      return D;
    const K = {
      t: a.getFixedT(k, o.nsMode === "fallback" ? d : d[0], l),
      ready: M,
      lng: k,
      keyPrefix: l,
      revision: T
    };
    return f.current = K, K;
  }, [a, d, l, o, e.lng]), [v, y] = A(0), {
    t: C,
    ready: b
  } = Uc.useSyncExternalStore(p, _, _);
  E(() => {
    if (a && !b && !s) {
      const M = () => y((k) => k + 1);
      e.lng ? vi(a, e.lng, d, M) : qn(a, d, M);
    }
  }, [a, e.lng, d, b, s, v]);
  const w = a || {}, N = q(null), j = q(), z = (M) => {
    const k = Object.getOwnPropertyDescriptors(M);
    k.__original && delete k.__original;
    const T = Object.create(Object.getPrototypeOf(M), k);
    if (!Object.prototype.hasOwnProperty.call(T, "__original"))
      try {
        Object.defineProperty(T, "__original", {
          value: M,
          writable: !1,
          enumerable: !1,
          configurable: !1
        });
      } catch {
      }
    return T;
  }, I = Me(() => {
    const M = w, k = M == null ? void 0 : M.language;
    let T = M;
    M && (N.current && N.current.__original === M ? j.current !== k ? (T = z(M), N.current = T, j.current = k) : T = N.current : (T = z(M), N.current = T, j.current = k));
    const D = [C, T, b];
    return D.t = C, D.i18n = T, D.ready = b, D;
  }, [C, w, b, w.resolvedLanguage, w.language, w.languages]);
  if (a && s && !b)
    throw new Promise((M) => {
      const k = () => M();
      e.lng ? vi(a, e.lng, d, k) : qn(a, d, k);
    });
  return I;
}, Aa = {
  "en-US": [
    "en",
    "en-AU",
    "en-CA",
    "en-GB",
    "en-GH",
    "en-HK",
    "en-IE",
    "en-IN",
    "en-KE",
    "en-NG",
    "en-NZ",
    "en-PH",
    "en-SG",
    "en-TZ",
    "en-US",
    "en-ZA",
    "English",
    "English (AU)",
    "English (Australia)",
    "English (Canada)",
    "English (FI)",
    "English (FR)",
    "English (GB)",
    "English (Hong Kong SAR)",
    "English (IE)",
    "English (IN)",
    "English (IT)",
    "English (India)",
    "English (Ireland)",
    "English (Kenya)",
    "English (MX)",
    "English (NZ)",
    "English (New Zealand)",
    "English (Nigeria)",
    "English (Philippines)",
    "English (Singapore)",
    "English (South Africa)",
    "English (Tanzania)",
    "English (US)",
    "English (United Kingdom)",
    "English (United States)",
    "English (ZA)"
  ],
  "de-DE": [
    "de",
    "de-AT",
    "de-CH",
    "de-DE",
    "de-LI",
    "de-LU",
    "German",
    "German (Austria)",
    "German (Germany)",
    "German (Switzerland)"
  ]
}, Dn = (t) => {
  var n;
  return (n = Object.entries(Aa).find(
    ([r, i]) => i.includes(t ?? "")
  )) == null ? void 0 : n[0];
}, Wc = {
  wait: "Gleich gehtâ€™s weiter",
  starting: "Starten...",
  connecting: "Verbinden..."
}, Gc = {
  start: "GesprÃ¤ch starten",
  continue: "Weiter gehtâ€™s",
  resume: "GesprÃ¤ch fortsetzen...",
  newConversation: "Beginne ein neues GesprÃ¤ch",
  reconnect: "Erneut verbinden",
  turnMicrophoneOn: "Mikrofon einschalten"
}, qc = {
  resumeQ: "MÃ¶chtest du dort weitermachen, wo wir aufgehÃ¶rt haben?",
  stillHere: "Noch da?"
}, Yc = {
  msgPh: "Gib hier deine Nachricht ein..."
}, Jc = {
  interrupt: "Sag etwas, um zu unterbrechen",
  wait: "Bitte warten Sie, bis die Antwort fertig ist"
}, Qc = {
  mic: "Mikrofon",
  spk: "Lautsprecher"
}, Xc = {
  chat: "Chat",
  chatHistory: "Chat-Verlauf"
}, el = {
  permission: {
    title: "Lass uns deine Berechtigung erhalten",
    description: "Dein Browser benÃ¶tigt die Berechtigung, dein Mikrofon zu verwenden.",
    vmQuestion: "Hast du eine Frage?",
    vmDescription: "Spreche live mit einem Agenten, schalte einfach dein Mikrofon ein um das GesprÃ¤ch zu beginnen."
  }
}, tl = {
  lowConnectivity: {
    endUser: "Ihre Netzwerkverbindung ist schwach. Dies kann Ihr Erlebnis beeintrÃ¤chtigen.",
    ownerChat: "Ihre Netzwerkverbindung ist schwach. Dies kann Ihr Erlebnis beeintrÃ¤chtigen."
  },
  noError: {
    endUser: "",
    ownerChat: ""
  },
  insufficientCredits: {
    endUser: "Sprach- und Gesichtsanimationen sind vorÃ¼bergehend nicht verfÃ¼gbar. Sie kÃ¶nnen den Chat weiterhin nutzen.",
    ownerChat: "Ihr Guthaben ist aufgebraucht. Sprach- und Gesichtsanimationen sind vorÃ¼bergehend nicht verfÃ¼gbar. Bitte kaufen Sie zusÃ¤tzliches Guthaben."
  },
  trialInsufficientCredits: {
    endUser: "Der Agent ist vorÃ¼bergehend nicht verfÃ¼gbar. Bitte versuchen Sie es spÃ¤ter erneut.",
    ownerChat: "Ihr Guthaben ist aufgebraucht. Sprach- und Gesichtsanimationen sind vorÃ¼bergehend nicht verfÃ¼gbar. Bitte kaufen Sie zusÃ¤tzliches Guthaben."
  },
  deletedVoice: {
    endUser: "Sprach- und Gesichtsanimationen sind vorÃ¼bergehend nicht verfÃ¼gbar. Sie kÃ¶nnen den Chat weiterhin nutzen.",
    ownerChat: "Die zuvor fÃ¼r Ihren Agenten verwendete Sprachdatei wurde gelÃ¶scht und ist nicht mehr verfÃ¼gbar. Sprach- und Gesichtsanimationen sind vorÃ¼bergehend nicht verfÃ¼gbar. Bitte wÃ¤hlen Sie eine neue Stimme fÃ¼r Ihren Agenten."
  },
  deletedAvatar: {
    endUser: "Sprach- und Gesichtsanimationen sind vorÃ¼bergehend nicht verfÃ¼gbar. Sie kÃ¶nnen den Chat weiterhin nutzen.",
    ownerChat: "Die zuvor verwendete Avatar-Datei wurde gelÃ¶scht und ist nicht mehr verfÃ¼gbar. Sprach- und Gesichtsanimationen sind vorÃ¼bergehend nicht verfÃ¼gbar. Bitte wÃ¤hlen Sie einen neuen Avatar fÃ¼r diesen Agenten."
  },
  systemOverload: {
    endUser: "Dieser Agent hat die maximale Anzahl aktiver Sitzungen erreicht. Bitte versuchen Sie es in KÃ¼rze erneut.",
    ownerChat: "Ihr Agent hat das Limit fÃ¼r parallele Sitzungen erreicht. Bitte upgraden Sie Ihren Tarif oder reduzieren Sie die Nutzung, um zusÃ¤tzliche Sitzungen zu ermÃ¶glichen."
  },
  fallbackError: {
    endUser: "Der Agent ist vorÃ¼bergehend nicht verfÃ¼gbar. Bitte versuchen Sie es spÃ¤ter erneut.",
    ownerChat: "Der Agent ist vorÃ¼bergehend nicht verfÃ¼gbar. Bitte versuchen Sie es spÃ¤ter erneut."
  },
  templateLimitReached: {
    endUser: "Chat-Limit erreicht. Bitte erstellen Sie einen Agenten, um das GesprÃ¤ch fortzusetzen.",
    ownerChat: "Chat-Limit erreicht. Bitte erstellen Sie einen Agenten, um das GesprÃ¤ch fortzusetzen."
  }
}, nl = {
  connectionStatus: Wc,
  actions: Gc,
  prompts: qc,
  inputs: Yc,
  hints: Jc,
  devices: Qc,
  navigation: Xc,
  mic: el,
  errors: tl
}, rl = {
  wait: "Hang tight",
  starting: "Starting...",
  connecting: "Connecting..."
}, il = {
  start: "Start conversation",
  continue: "Let's continue",
  resume: "Continue conversation...",
  newConversation: "Create new conversation",
  reconnect: "Reconnect",
  turnMicrophoneOn: "Turn microphone on"
}, al = {
  resumeQ: "Want to continue where we left off?",
  stillHere: "Are you still here?"
}, ol = {
  msgPh: "Type your message here..."
}, sl = {
  interrupt: "Talk to interrupt",
  wait: "Please wait until the response is complete"
}, cl = {
  mic: "Microphone",
  spk: "Speakers"
}, ll = {
  chat: "Chat",
  chatHistory: "Chat history"
}, dl = {
  permission: {
    title: "Let's get your permission",
    description: "Your browser needs permission to use your microphone.",
    vmQuestion: "Got a question?",
    vmDescription: "Talk to a live interactive Agent, just turn on your mic to start the conversation."
  }
}, ul = {
  lowConnectivity: {
    endUser: "Your network quality is low. This may affect your experience.",
    ownerChat: "Your network quality is low. This may affect your experience."
  },
  noError: {
    endUser: "",
    ownerChat: ""
  },
  insufficientCredits: {
    endUser: "Voice and face animations are temporarily unavailable. You can still use the chat.",
    ownerChat: "Your account has run out of credits. Voice and face animations are temporarily unavailable. Please purchase additional credits."
  },
  trialInsufficientCredits: {
    endUser: "The agent is temporarily unavailable. Please try again later.",
    ownerChat: "Your account has run out of credits. Voice and face animations are temporarily unavailable. Please purchase additional credits."
  },
  deletedVoice: {
    endUser: "Voice and face animations are temporarily unavailable. You can still use the chat.",
    ownerChat: "The voice file previously used for your agent has been deleted and is no longer available. Voice and face animations are temporarily unavailable. Please select a new voice for your agent."
  },
  deletedAvatar: {
    endUser: "Voice and face animations are temporarily unavailable. You can still use the chat.",
    ownerChat: "The avatar file previously used for your agent has been deleted and is no longer available. Voice and face animations are temporarily unavailable. Please select a new Avatar for this agent."
  },
  systemOverload: {
    endUser: "This agent has reached its maximum number of active sessions. Please try again shortly.",
    ownerChat: "Your agent has reached its concurrent session limit. Upgrade your plan or adjust usage to allow more sessions."
  },
  fallbackError: {
    endUser: "The agent is temporarily unavailable. Please try again later.",
    ownerChat: "The agent is temporarily unavailable. Please try again later."
  },
  templateLimitReached: {
    endUser: "Chat limit reached. Please create an Agent to continue the conversation.",
    ownerChat: "Chat limit reached. Please create an Agent to continue the conversation."
  }
}, hl = {
  connectionStatus: rl,
  actions: il,
  prompts: al,
  inputs: ol,
  hints: sl,
  devices: cl,
  navigation: ll,
  mic: dl,
  errors: ul
}, fl = ks === "local";
Be.use(Ec).init({
  lng: "en-US",
  fallbackLng: "en-US",
  supportedLngs: Object.keys(Aa),
  load: "currentOnly",
  resources: {
    "en-US": {
      translation: hl
    },
    "de-DE": {
      translation: nl
    }
  },
  debug: fl,
  interpolation: {
    escapeValue: !1
  }
});
var gl = 0;
function u(t, e, n, r, i, a) {
  e || (e = {});
  var o, s, l = e;
  if ("ref" in l) for (s in l = {}, e) s == "ref" ? o = e[s] : l[s] = e[s];
  var c = { type: t, props: l, key: n, ref: o, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --gl, __i: -1, __u: 0, __source: i, __self: a };
  if (typeof t == "function" && (o = t.defaultProps)) for (s in o) l[s] === void 0 && (l[s] = o[s]);
  return ne.vnode && ne.vnode(c), c;
}
class pl extends Ye {
  componentDidCatch(e, n) {
    var r;
    (r = window.DD_RUM) == null || r.addError(e, n);
  }
  render() {
    return this.props.children;
  }
}
var Ct = /* @__PURE__ */ ((t) => (t.Audio = "audio", t.Text = "text", t.Click = "click", t))(Ct || {}), Re = /* @__PURE__ */ ((t) => (t[t.New = 0] = "New", t[t.Streaming = 1] = "Streaming", t[t.Fail = 2] = "Fail", t))(Re || {}), he = /* @__PURE__ */ ((t) => (t.Idle = "IDLE", t.Talking = "TALKING", t.Loading = "LOADING", t.Buffering = "BUFFERING", t))(he || {});
const Ta = {
  mode: "fabio",
  visible: !0,
  agentId: "",
  track: !0,
  chatMode: R.Functional,
  loaderConfig: { show: !0, style: "opaque", text: "Loading..." },
  orientation: "vertical",
  position: "right",
  openMode: "compact",
  posterSrc: void 0,
  auth: null,
  showChatToggle: !0,
  showMicToggle: !0,
  showRestartButton: !0,
  showAgentName: !0,
  enableInterruptOption: [Ct.Audio, Ct.Text, Ct.Click]
}, ke = nt({
  configure: () => {
  },
  configurations: Ta
}), ml = ({ children: t, initialConfigurations: e }) => {
  const [n, r] = A({
    ...Ta,
    ...e
  }), i = Z(
    (a) => r((o) => ({ ...o, ...a })),
    [r]
  );
  return E(() => {
    window.DID_AGENTS_API.configure = i;
  }, [i]), E(() => {
    window.DID_AGENTS_API.showLoader = (a, o) => {
      const s = { ...n.loaderConfig, show: !0 };
      o && (s.style = o), a !== void 0 && (s.text = a), i({ loaderConfig: s });
    }, window.DID_AGENTS_API.hideLoader = () => {
      i({ loaderConfig: { ...n.loaderConfig, show: !1 } });
    };
  }, [i, n.loaderConfig]), /* @__PURE__ */ u(ke.Provider, { value: { configurations: n, configure: i }, children: t });
};
function Da() {
  return Math.random().toString(16).slice(2);
}
function _l() {
  const t = localStorage.getItem("tracking_id") ?? Da();
  return localStorage.setItem("tracking_id", t), t;
}
const Oa = {
  token: Fn.mixpanelKey,
  $insert_id: Da(),
  origin: window.location.href,
  "Screen Height": window.screen.height || window.innerWidth,
  "Screen Width": window.screen.width || window.innerHeight,
  "User Agent": navigator.userAgent
};
function yi(t) {
  Object.assign(Oa, t);
}
const Mt = () => {
  const { configurations: t } = ce(ke);
  return {
    trackUi: (n, r) => {
      if (window.localStorage.getItem("track_enabled") === "false")
        return;
      const i = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          data: JSON.stringify([
            {
              event: n,
              properties: {
                ...r,
                time: Date.now(),
                distinct_id: t.externalId || _l(),
                id: t.externalId,
                ...t.mixpanelAdditionalProperties,
                ...Oa,
                agent_ui_version: $i
              }
            }
          ])
        })
      };
      fetch("https://api-js.mixpanel.com/track/?verbose=1&ip=1", i).catch(
        (a) => console.error("Analytics tracking error:", a)
      );
    }
  };
};
function wi(t, e) {
  let n;
  return function(...r) {
    n && clearTimeout(n), n = setTimeout(() => t(...r), e);
  };
}
const jt = (t, e) => {
  var n, r;
  (r = (n = window.DID_AGENTS_API ?? (window.DID_AGENTS_API = {})).functions ?? (n.functions = {}))[t] ?? (r[t] = e);
};
function Pa() {
  if (typeof window > "u" || typeof navigator > "u")
    return !1;
  const t = navigator.userAgent || navigator.vendor || window.opera;
  return /android|avantgo|blackberry|bada\/|bb10|blazer|compal|elaine|fennec|hiptop|iemobile|iphone|ipod|ipad|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm(os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series40|series60|symbian|treo|up\.browser|up\.link|vodafone|wap|windows ce|windows phone|xda|xiino/i.test(
    t
  );
}
var fe = /* @__PURE__ */ ((t) => (t[t.NoError = 0] = "NoError", t[t.InsufficientCredits = 1] = "InsufficientCredits", t[t.TrialInsufficientCredits = 2] = "TrialInsufficientCredits", t[t.DeletedVoice = 3] = "DeletedVoice", t[t.DeletedAvatar = 4] = "DeletedAvatar", t[t.SystemOverload = 5] = "SystemOverload", t[t.FallbackError = 6] = "FallbackError", t[t.LowConnectivity = 7] = "LowConnectivity", t[t.TemplateLimitReached = 8] = "TemplateLimitReached", t))(fe || {}), Jn = /* @__PURE__ */ ((t) => (t[t.EndUser = 0] = "EndUser", t[t.OwnerChat = 1] = "OwnerChat", t))(Jn || {});
const vl = {
  7: {
    0: "errors.lowConnectivity.endUser",
    1: "errors.lowConnectivity.ownerChat"
  },
  0: {
    0: "errors.noError.endUser",
    1: "errors.noError.ownerChat"
  },
  1: {
    0: "errors.insufficientCredits.endUser",
    1: "errors.insufficientCredits.ownerChat"
  },
  2: {
    0: "errors.trialInsufficientCredits.endUser",
    1: "errors.trialInsufficientCredits.ownerChat"
  },
  3: {
    0: "errors.deletedVoice.endUser",
    1: "errors.deletedVoice.ownerChat"
  },
  4: {
    0: "errors.deletedAvatar.endUser",
    1: "errors.deletedAvatar.ownerChat"
  },
  5: {
    0: "errors.systemOverload.endUser",
    1: "errors.systemOverload.ownerChat"
  },
  6: {
    0: "errors.fallbackError.endUser",
    1: "errors.fallbackError.ownerChat"
  },
  8: {
    0: "errors.templateLimitReached.endUser",
    1: "errors.templateLimitReached.ownerChat"
  }
};
function yl() {
  const t = /* @__PURE__ */ new Map(), e = (i, a) => {
    const o = t.get(i);
    o && o.splice(o.indexOf(a) >>> 0, 1);
  };
  return { on: (i, a) => {
    const o = t.get(i);
    return o ? o.push(a) : t.set(i, [a]), () => e(i, a);
  }, off: e, emit: (i, a) => {
    var o;
    (o = t.get(i)) == null || o.slice().forEach((s) => {
      try {
        s(a);
      } catch (l) {
        console.error(`[DID Agent] Error in "${String(i)}" handler:`, l);
      }
    });
  } };
}
const wt = yl(), _n = (t) => (t == null ? void 0 : t.toLowerCase()) === "multilingual", vn = [
  {
    label: "Arabic",
    value: "ar-SA",
    equivalentValues: [
      "ar-AE",
      "ar-BH",
      "ar-DZ",
      "ar-EG",
      "ar-IL",
      "ar-IQ",
      "ar-JO",
      "ar-KW",
      "ar-LB",
      "ar-LY",
      "ar-MA",
      "ar-OM",
      "ar-PS",
      "ar-QA",
      "ar-SA",
      "ar-SY",
      "ar-TN",
      "ar-YE"
    ]
  },
  { label: "Bulgarian", value: "bg-BG", equivalentValues: ["bg-BG"] },
  {
    label: "Chinese",
    value: "zh-CN",
    equivalentValues: ["wuu-CN", "yue-CN", "zh-CN", "zh-CN-shandong", "zh-CN-sichuan", "zh-HK", "zh-TW"]
  },
  { label: "Croatian", value: "hr-HR", equivalentValues: ["hr-HR"] },
  { label: "Czech", value: "cs-CZ", equivalentValues: ["cs-CZ"] },
  { label: "Danish", value: "da-DK", equivalentValues: ["da-DK"] },
  { label: "Dutch", value: "nl-NL", equivalentValues: ["nl-NL", "nl-BE"] },
  {
    label: "English",
    value: "en-US",
    equivalentValues: [
      "en-AU",
      "en-CA",
      "en-GB",
      "en-GH",
      "en-HK",
      "en-IE",
      "en-IN",
      "en-KE",
      "en-NG",
      "en-NZ",
      "en-PH",
      "en-SG",
      "en-TZ",
      "en-US",
      "en-ZA"
    ]
  },
  { label: "Filipino", value: "fil-PH", equivalentValues: ["fil-PH"] },
  { label: "Finnish", value: "fi-FI", equivalentValues: ["fi-FI"] },
  {
    label: "French",
    value: "fr-FR",
    equivalentValues: ["fr-BE", "fr-CA", "fr-CH", "fr-FR"]
  },
  {
    label: "German",
    value: "de-DE",
    equivalentValues: ["de-AT", "de-CH", "de-DE"]
  },
  { label: "Greek", value: "el-GR", equivalentValues: ["el-GR"] },
  { label: "Hebrew", value: "he-IL", equivalentValues: ["he-IL"] },
  { label: "Hindi", value: "hi-IN", equivalentValues: ["hi-IN"] },
  { label: "Hungarian", value: "hu-HU", equivalentValues: ["hu-HU"] },
  { label: "Indonesian", value: "id-ID", equivalentValues: ["id-ID"] },
  { label: "Italian", value: "it-IT", equivalentValues: ["it-IT", "it-CH"] },
  { label: "Japanese", value: "ja-JP", equivalentValues: ["ja-JP"] },
  { label: "Korean", value: "ko-KR", equivalentValues: ["ko-KR"] },
  { label: "Malay", value: "ms-MY", equivalentValues: ["ms-MY"] },
  { label: "Malayalam", value: "ml-IN", equivalentValues: ["ml-IN"] },
  { label: "Norwegian", value: "no-NO", equivalentValues: ["no-NO"] },
  { label: "Polish", value: "pl-PL", equivalentValues: ["pl-PL"] },
  { label: "Portuguese", value: "pt-PT", equivalentValues: ["pt-PT", "pt-BR"] },
  { label: "Romanian", value: "ro-RO", equivalentValues: ["ro-RO"] },
  { label: "Russian", value: "ru-RU", equivalentValues: ["ru-RU"] },
  { label: "Slovak", value: "sk-SK", equivalentValues: ["sk-SK"] },
  {
    label: "Spanish",
    value: "es-ES",
    equivalentValues: [
      "es-AR",
      "es-BO",
      "es-CL",
      "es-CO",
      "es-CR",
      "es-CU",
      "es-DO",
      "es-EC",
      "es-ES",
      "es-GQ",
      "es-GT",
      "es-HN",
      "es-MX",
      "es-NI",
      "es-PA",
      "es-PE",
      "es-PR",
      "es-PY",
      "es-SV",
      "es-US",
      "es-UY",
      "es-VE"
    ]
  },
  { label: "Swedish", value: "sv-SE", equivalentValues: ["sv-SE"] },
  { label: "Tamil", value: "ta-IN", equivalentValues: ["ta-IN"] },
  { label: "Turkish", value: "tr-TR", equivalentValues: ["tr-TR"] },
  { label: "Ukrainian", value: "uk-UA", equivalentValues: ["uk-UA"] },
  { label: "Vietnamese", value: "vi-VN", equivalentValues: ["vi-VN"] },
  { label: "Catalan", value: "ca-ES", equivalentValues: ["ca-ES"] },
  { label: "Estonian", value: "et-EE", equivalentValues: ["et-EE"] },
  { label: "Amharic", value: "am-ET", equivalentValues: ["am-ET"] },
  { label: "Basque", value: "eu-ES", equivalentValues: ["eu-ES"] },
  { label: "Irish", value: "ga-IE", equivalentValues: ["ga-IE"] },
  { label: "Armenian", value: "hy-AM", equivalentValues: ["hy-AM"] },
  { label: "Icelandic", value: "is-IS", equivalentValues: ["is-IS"] },
  { label: "Georgian", value: "ka-GE", equivalentValues: ["ka-GE"] },
  { label: "Slovenian", value: "sl-SI", equivalentValues: ["sl-SI"] },
  { label: "Thai", value: "th-TH", equivalentValues: ["th-TH"] }
], wl = ({
  connectionState: t,
  streamIsConnected: e,
  agentActivityState: n,
  setGreeted: r,
  greeted: i,
  greet: a,
  chatMode: o,
  agent: s
}) => {
  const l = q(!1);
  E(() => {
    t === B.Disconnected && o === R.Playground && !i && !l.current && s && (l.current = !0, a().catch(() => {
      r(!0), l.current = !1;
    }));
  }, [t, i, o, s]), E(() => {
    e && !i && !l.current && (l.current = !0, a().catch(() => {
      r(!0), l.current = !1;
    }));
  }, [e, i]), E(() => {
    !i && t === B.Connected && n === he.Talking && (r(!0), l.current = !1);
  }, [t, n, i]);
};
function Cl(t) {
  return {
    kind: "user",
    key: t.owner_id,
    anonymous: !1
  };
}
const Mn = nt({
  client: null,
  initializeWithContext: () => {
  }
});
Mn.displayName = "feature flags store";
const bl = ({ children: t, enableFeatureFlags: e = !0 }) => {
  const [n, r] = A(null), i = q(null), a = Z(
    async (o) => {
      if (!(!e || n || i.current))
        try {
          const { initialize: s } = await import("./ldclient.es-DWuXufEz.js"), l = s(Is, o, {
            bootstrap: "localStorage",
            evaluationReasons: !0,
            sendEvents: !1
          });
          i.current = l;
          try {
            await l.waitUntilReady();
          } catch (c) {
            console.warn("failed to wait for launch darkly ready:", c);
          }
          r(l);
        } catch (s) {
          console.warn("failed to initialize launch darkly:", s), i.current = null, r(null);
        }
    },
    [e, n]
  );
  return E(() => () => {
    i.current && (i.current.close(), i.current = null);
  }, []), /* @__PURE__ */ u(Mn.Provider, { value: { client: n, initializeWithContext: a }, children: t });
};
function Sl() {
  return ce(Mn).client;
}
function Ml(t, e) {
  var n, r;
  return ((r = (n = Sl()) == null ? void 0 : n.variation) == null ? void 0 : r.call(n, t, e)) ?? e;
}
function kl() {
  return ce(Mn);
}
const Ll = (t) => {
  const e = "presenter_id" in t ? t.presenter_id : void 0;
  return t.type === "clip" && (e != null && e.startsWith("v2_")) ? "clip_v2" : t.type;
}, rn = nt({
  authenticate: () => {
  },
  auth: {},
  host: "",
  wsHost: "",
  isAuthenticated: !1
});
rn.displayName = "DidFetch";
function xl({ children: t, auth: e, didApiUrl: n, didSocketApiUrl: r }) {
  const [i, a] = A(e), o = async (s) => {
    a((l) => JSON.stringify(s) === JSON.stringify(l) ? l : s);
  };
  return /* @__PURE__ */ u(
    rn.Provider,
    {
      value: { auth: i, host: n, wsHost: r, authenticate: o, isAuthenticated: !!i },
      children: t
    }
  );
}
function Il(t, e) {
  var n;
  return t === "SessionError" && typeof (e == null ? void 0 : e.url) == "string" && e.url.includes("/streams") && ((n = e.options) == null ? void 0 : n.method) === "DELETE";
}
function Nl(t, e, n, r) {
  const { onError: i, updateErrorState: a, changeMode: o } = n;
  if (i == null || i(t, e), r !== R.Maintenance)
    try {
      const { kind: s, description: l } = JSON.parse(t.message);
      if (Il(s, e))
        return;
      switch (s) {
        case "PermissionError": {
          a(fe.FallbackError), o(R.Maintenance);
          break;
        }
        case "ChatModeDowngraded": {
          a(fe.InsufficientCredits);
          break;
        }
        case "InsufficientCreditsError": {
          a(fe.TrialInsufficientCredits);
          break;
        }
        case "Forbidden": {
          a(fe.SystemOverload), o(R.Maintenance);
          break;
        }
        case "TooManyRequestsError": {
          a(fe.SystemOverload), o(R.Maintenance);
          break;
        }
        case "DriverNotValidError": {
          a(fe.DeletedAvatar), o(R.TextOnly);
          break;
        }
        default:
          s === "InternalServerError" && l === "Stream Error" ? a(fe.FallbackError) : l === "Agent presenter voice not found" ? a(fe.DeletedVoice) : l === "Agent presenter not found" || l.includes("may be corrupted or does not exist") ? a(fe.DeletedAvatar) : a(fe.FallbackError), o(R.TextOnly);
      }
    } catch {
      a(fe.FallbackError), o(R.Maintenance);
    }
}
const wr = nt({
  connectionState: B.New,
  streamState: Re.New,
  connect: async () => {
  },
  reconnect: async () => {
  },
  disconnect: async () => {
  },
  restart: async () => {
  },
  setStreamState: () => {
  },
  streamedMessage: "",
  messages: [],
  sentimentData: null,
  error: "",
  setError: () => {
  },
  terminating: !1,
  language: "en",
  starterMessages: [],
  chatId: void 0,
  setLanguage: () => {
  },
  setTranslationLanguage: () => {
  },
  enabled: !1,
  errorState: fe.NoError,
  setErrorState: () => {
  },
  changeMode: () => {
  },
  getSTTToken: async () => {
  },
  sendChatMessage: async () => ({}),
  rate: async () => ({}),
  enrichSdkAnalytics: () => {
  },
  greeted: !1,
  agentActivityState: he.Idle,
  setAgentActivityState: () => {
  },
  streamType: void 0,
  interruptAvailable: !1,
  interrupt: () => {
  },
  interruptLoading: !1,
  triggersAvailable: !1,
  fluentStarted: !1,
  legacyStarted: !1,
  isRestarting: !1,
  supportsMicrophoneStream: !1,
  isVMAgent: !1
});
wr.displayName = "Streaming Manager";
const ye = () => ce(wr), sn = "en-US";
function El(t, e) {
  return t !== R.TextOnly && e === R.TextOnly;
}
function Al(t) {
  var n;
  const e = ((n = t.greetings) == null ? void 0 : n.filter((r) => r.length > 0)) ?? [];
  if (e.length)
    return e[Math.floor(Math.random() * e.length)];
}
function Tl({ agentId: t, children: e, enabled: n, onAgentReady: r, onError: i }) {
  var br, Sr;
  const [a, o] = A(), { configurations: s, configure: l } = ce(ke), { trackUi: c } = Mt(), { initializeWithContext: g } = kl(), d = Me(() => s.chatMode, []), h = q(), p = q({}), f = q(), [_, v] = A([]), [y, C] = A(B.New), [b, w] = A(Re.New), [N, j] = A(he.Idle), [z, I] = A(void 0), [x, m] = A(!1), [S, M] = A(!1), [k, T] = A(), [D, F] = A(""), [K, ee] = A(""), [re, Y] = A(void 0), [Q, V] = A(!1), [L, $] = A([]), [X, oe] = A(null), [Ie, qe] = A(fe.NoError), { auth: Ne, host: Ve, wsHost: $e } = ce(rn), Ze = q("idle"), [O, H] = A(!1), [W, le] = A(!1), [de, Te] = A(!1), [_e, Oe] = A(() => {
    const P = navigator == null ? void 0 : navigator.language;
    if (!P) return sn;
    if (!!vn.find(
      ({ equivalentValues: xt }) => xt.includes(P)
    )) return P;
    const ue = Dn(P);
    return !!ue && !!vn.find(({ equivalentValues: xt }) => xt.includes(ue)) ? ue : sn;
  }), { i18n: Ue } = rt(), at = async () => {
    var P, G, ue;
    if ((P = f.current) != null && P.greeting)
      await ((ue = f.current) == null ? void 0 : ue.speak((G = f.current) == null ? void 0 : G.greeting));
    else
      throw new Error("Greeting is not found");
  }, ve = Z(
    (P) => {
      j(P), f.current && (f.current.agentActivityState = P), wt.emit("agentActivity", { state: P });
    },
    [j]
  ), ot = Z(
    async (P) => {
      if (!f.current)
        throw new Error("Agent is not initialized");
      let G = P;
      if (typeof P == "string") {
        const ue = P.trim();
        if (!ue)
          throw new Error("Can't speak empty text");
        G = ue;
      }
      ve(he.Loading);
      try {
        const ue = await f.current.speak(G), We = [R.TextOnly, R.Playground].includes(f.current.chatMode);
        return ve(We ? he.Idle : he.Buffering), ue;
      } catch (ue) {
        throw ve(he.Idle), ue;
      }
    },
    [ve]
  ), Je = Me(
    () => z === ze.Fluent && b === Re.Streaming,
    [z, b]
  ), U = Me(
    () => z === ze.Legacy && y === B.Connected,
    [z, y]
  ), te = Me(() => Je || U, [Je, U]);
  E(() => {
    te && wt.emit("connection", { state: B.Connected });
  }, [te]), wl({
    connectionState: y,
    streamIsConnected: te,
    agentActivityState: N,
    setGreeted: le,
    greeted: W,
    greet: at,
    chatMode: s.chatMode,
    agent: a
  });
  const se = s.chatMode === R.Playground, Se = s.chatMode === R.TextOnly, Le = se || Se, we = Z(
    (P) => {
      var G;
      ((G = f.current) == null ? void 0 : G.errorState) !== fe.TemplateLimitReached && (f.current && (f.current.errorState = P), qe(P));
    },
    [qe]
  ), Fe = Z(() => {
    ee(""), we(fe.NoError), f.current && (f.current.errorState = fe.NoError);
  }, [ee, we]), Ee = Z(async () => {
    f.current && (V(!0), await f.current.disconnect().catch(), V(!1));
  }, [f]), _t = Z(
    (P, G) => {
      if (wt.emit("error", { error: P }), !f.current) {
        i == null || i(P, G);
        return;
      }
      Nl(
        P,
        G,
        {
          onError: i,
          updateErrorState: (ue) => {
            we(ue), f.current && (f.current.errorState = ue);
          },
          changeMode: (ue) => {
            var We;
            (We = f.current) != null && We.changeMode && f.current.changeMode(ue);
          }
        },
        f.current.chatMode
      );
    },
    [i, we, l]
  );
  E(() => {
    if (y === B.Connected && f.current) {
      const P = f.current.getStreamType(), G = f.current.getIsInterruptAvailable(), ue = f.current.getIsTriggersAvailable();
      qt(() => {
        I(P), m(G), M(ue);
      });
    }
  }, [y, f.current]);
  function gt() {
    f.current && (f.current.disconnect().catch((P) => console.error(P)), qt(() => {
      o(void 0), v([]), C(B.New), w(Re.New), I(void 0), m(!1), M(!1), T(void 0), F(""), $([]), ee(""), we(fe.NoError), V(!1), ve(he.Idle), Oe(sn), le(!1);
    }));
  }
  function Lt() {
    return new Promise((P, G) => {
      var xt, Mr;
      if (h.current && !Le)
        return h.current;
      const ue = d;
      Fe(), gt(), l({ chatMode: ue });
      const We = {
        onVideoStateChange(ie) {
          var vt;
          const me = ie === ae.Start ? Re.Streaming : Re.New, Pe = ((vt = f.current) == null ? void 0 : vt.getStreamType()) === ze.Legacy;
          f.current && me !== f.current.streamState && (f.current.streamState = me, w(me), Pe && (me === Re.New ? ve(he.Idle) : me === Re.Streaming && ve(he.Talking)));
        },
        onAgentActivityStateChange: (ie) => {
          var me;
          ie === he.Idle && [he.Loading, he.Buffering].includes(
            ((me = f.current) == null ? void 0 : me.agentActivityState) ?? he.Idle
          ) || ve(ie);
        },
        onConnectionStateChange: (ie) => {
          var Pe, vt;
          const me = (Pe = f.current) == null ? void 0 : Pe.connectionState;
          Ze.current === "disconnecting" && ie === B.Disconnected || !f.current || me === ie || (ie === B.Connected && ((vt = f == null ? void 0 : f.current) == null ? void 0 : vt.errorState) === fe.SystemOverload && Fe(), ie === B.Disconnected && ve(he.Idle), f.current.connectionState = ie, C(ie), ie !== B.Connected && wt.emit("connection", { state: ie }));
        },
        onNewMessage: (ie) => {
          $(ie);
          const me = ie[ie.length - 1];
          me && "sentiment" in me && oe(me.sentiment || null);
        },
        onSrcObjectReady: T,
        onModeChange: (ie) => {
          f.current && (f.current.chatMode = ie), l({ chatMode: ie }), wt.emit("chatMode", { state: ie });
        },
        onNewChat: (ie) => {
          Y(ie), yi({ chat_id: ie });
        },
        onConnectivityStateChange: (ie) => {
          var me, Pe;
          c("agent-connectivity", { event: "view", agentId: (Pe = (me = f.current) == null ? void 0 : me.agent) == null ? void 0 : Pe.id, state: ie }), ie === et.Weak ? we(fe.LowConnectivity) : Fe();
        },
        onError: _t,
        onStreamCreated: (Mr = (xt = window == null ? void 0 : window.DID_AGENTS_API) == null ? void 0 : xt.callbacks) == null ? void 0 : Mr.onStreamCreated
      };
      Ms(t, {
        mode: ue,
        auth: Ne,
        baseURL: Ve,
        wsURL: $e,
        streamOptions: { streamWarmup: !0, compatibilityMode: "on", fluent: !0 },
        callbacks: We,
        initialMessages: s.chatMode === R.Playground ? [] : L,
        persistentChat: !0,
        enableAnalitics: s.track,
        externalId: s.externalId,
        mixpanelKey: s.customMixpanelKey,
        mixpanelAdditionalProperties: {
          owner_id: a == null ? void 0 : a.owner_id,
          ...s == null ? void 0 : s.mixpanelAdditionalProperties
        }
      }).then((ie) => {
        var kr, Lr, xr, Ir, Nr, Er;
        const me = ie == null ? void 0 : ie.agent, Pe = me == null ? void 0 : me.presenter, vt = Al(me);
        yi({ agentId: me.id, agentType: Ll(Pe) });
        const Ft = {
          ...ie,
          chatMode: ue,
          errorState: fe.NoError,
          streamState: Re.New,
          connectionState: B.New,
          agentActivityState: he.Idle,
          greeting: vt,
          chat: async function(Bt) {
            if (window.dataLayer.push({
              event: "agent_interaction",
              message: Bt
            }), !ie)
              throw new Error("Manager is not initialized");
            if (!Le && !(Pe != null && Pe.voice))
              throw new Error(JSON.stringify({ description: "Agent presenter voice not found" }));
            return F(""), await ie.chat(Bt);
          }
        };
        Ft.enrichAnalytics({
          ...p.current,
          version: $i,
          presenterId: Pe == null ? void 0 : Pe.id,
          presenterType: Pe.type
        }), p.current = {}, f.current = Ft, f.current && !((Lr = (kr = Ft == null ? void 0 : Ft.agent) == null ? void 0 : kr.presenter) != null && Lr.idle_video) && ue !== R.Playground && (f.current.chatMode = R.TextOnly, f.current.changeMode(R.TextOnly)), jt("speak", ot), jt("interrupt", () => {
          var Bt;
          (Bt = f.current) == null || Bt.interrupt({ type: "manual" });
        }), qt(() => {
          f.current && (o(f.current.agent), v(f.current.starterMessages || []), I(f.current.getStreamType()), r == null || r(f.current.agent));
        }), zt((Er = (Nr = (Ir = (xr = f.current) == null ? void 0 : xr.agent) == null ? void 0 : Ir.presenter) == null ? void 0 : Nr.voice) == null ? void 0 : Er.language), P();
      }).catch((ie) => {
        var me;
        console.error(ie), ie instanceof TypeError && w(Re.Fail), (me = f.current) == null || me.changeMode(R.Maintenance), ee("Agent is unavailable at the moment"), G(ie);
      });
    });
  }
  const zt = Z(
    (P) => {
      const G = _n(P) ? _e : P, We = Dn(G) || sn;
      We !== Ue.language && Ue.changeLanguage(We);
    },
    [Ue, _n, _e, Dn]
  );
  async function He(P = !1, G = !1) {
    var ue, We;
    if (!(!Ne || !Ve || !$e) && (h.current && (await h.current, h.current = void 0), f.current || (h.current = Lt(), await h.current, h.current = void 0), f.current)) {
      if (f.current.chatMode !== d && (P || G) && (f.current.chatMode = d, f.current.changeMode(d)), [R.Playground, R.TextOnly, R.Maintenance].includes(f.current.chatMode))
        return;
      if (P)
        return f.current.reconnect();
      if ([B.Connecting, B.Connected].includes(y)) {
        if (!G)
          return;
        V(!0), await f.current.disconnect(), V(!1), c("agent-new-chat", { event: "click", agentId: (We = (ue = f.current) == null ? void 0 : ue.agent) == null ? void 0 : We.id });
      }
      return f.current.connect();
    }
  }
  const dt = Z(async () => {
    h.current && (await h.current, h.current = void 0), h.current = Lt(), await h.current, h.current = void 0, window.DID_AGENTS_API.updateAgent = () => {
      [R.TextOnly, R.Playground].includes(s.chatMode) && (h.current = Lt().then(() => {
        h.current = void 0;
      }).catch((P) => {
        console.error(P), h.current = void 0;
      }));
    };
  }, [Ne, Ve, $e]), Qe = Z(async () => {
    var P;
    if (!((P = f.current) != null && P.disconnect))
      throw new Error("Agent is not initialized");
    try {
      H(!0), Ze.current = "disconnecting", await (f == null ? void 0 : f.current.disconnect()), f.current = void 0, Ze.current = "connecting", await He(!1, !0), le(!1), Ze.current = "idle", H(!1);
    } catch (G) {
      throw Ze.current = "idle", H(!1), G;
    }
  }, [f, _e]);
  E(() => {
    n && [R.Functional, R.Maintenance].includes(s.chatMode) && f.current && f.current.connectionState === B.Fail && (Fe(), He(!0));
  }, [n]), E(() => {
    !Ne || !Ve || !$e || dt().catch((P) => console.error(P));
  }, [dt]), E(() => {
    function P() {
      Ee();
    }
    return window.addEventListener("beforeunload", P), () => {
      Ee(), window.removeEventListener("beforeunload", P);
    };
  }, []), E(() => {
    var P;
    (P = f.current) != null && P.chatMode && [R.TextOnly, R.Maintenance].includes(f.current.chatMode) && (a == null ? void 0 : a.access) === "public" && (we(fe.TemplateLimitReached), f.current.errorState = fe.TemplateLimitReached);
  }, [(br = f.current) == null ? void 0 : br.chatMode, a]), E(() => {
    if (!(a != null && a.owner_id))
      return;
    const P = Cl(a);
    g(P);
  }, [a == null ? void 0 : a.owner_id, g]);
  const Ke = Z(
    async (P) => {
      var G;
      if ((G = f.current) != null && G.chat) {
        const ue = await f.current.chat(P);
        return El(f.current.chatMode, ue.chatMode) && we(fe.InsufficientCredits), ue;
      } else
        throw new Error("Agent is not initialized");
    },
    [f]
  ), ut = Z(
    (P) => {
      var G;
      if ((G = f.current) != null && G.changeMode)
        f.current.changeMode(P);
      else
        throw new Error("Agent is not initialized");
    },
    [f]
  ), $t = Z(
    (...P) => {
      var G;
      if ((G = f.current) != null && G.rate)
        return f.current.rate(...P);
      throw new Error("Agent is not initialized");
    },
    [f]
  ), oo = Z(
    (...P) => {
      var G;
      if ((G = f.current) != null && G.getSTTToken)
        return f.current.getSTTToken(...P);
      throw new Error("Agent is not initialized");
    },
    [f]
  ), so = Z(
    (...P) => {
      var G;
      if ((G = f.current) != null && G.enrichAnalytics)
        return f.current.enrichAnalytics(...P);
      p.current = { ...p.current, ...P };
    },
    [f]
  ), co = Z(({ type: P }) => {
    var G;
    if ((G = f.current) != null && G.interrupt)
      Te(!0), f.current.interrupt({ type: P }), setTimeout(() => {
        Te(!1);
      }, 500);
    else
      throw new Error("Agent is not initialized");
  }, []), lo = Z(
    async (P) => {
      var G;
      if ((G = f.current) != null && G.publishMicrophoneStream)
        return f.current.publishMicrophoneStream(P);
      throw new Error("Agent manager is not initialized");
    },
    [f]
  ), uo = Z(async () => {
    var P;
    if ((P = f.current) != null && P.unpublishMicrophoneStream)
      return f.current.unpublishMicrophoneStream();
    throw new Error("Agent manager is not initialized");
  }, [f]), ho = Me(() => {
    var G;
    const P = f.current;
    return ((G = a == null ? void 0 : a.presenter) == null ? void 0 : G.type) === "expressive" && s.chatMode !== R.Playground && P !== null && P !== void 0 && typeof P.publishMicrophoneStream == "function";
  }, [(Sr = a == null ? void 0 : a.presenter) == null ? void 0 : Sr.type, s.chatMode]), fo = Me(() => {
    var P;
    return !!((P = a == null ? void 0 : a.advanced_settings) != null && P.vm_account_id);
  }, [a]);
  return /* @__PURE__ */ u(
    wr.Provider,
    {
      value: {
        agent: a,
        changeMode: ut,
        connect: () => He(!1),
        connectionState: y,
        chatId: re,
        disconnect: Ee,
        enabled: n,
        error: K,
        errorState: Ie,
        getSTTToken: oo,
        language: _e,
        messages: L,
        sentimentData: X,
        rate: $t,
        reconnect: () => He(!0),
        restart: Qe,
        sendChatMessage: Ke,
        setError: ee,
        setErrorState: we,
        setLanguage: Oe,
        setTranslationLanguage: zt,
        setStreamState: w,
        srcObject: k,
        starterMessages: _,
        streamedMessage: D,
        streamState: b,
        terminating: Q,
        enrichSdkAnalytics: so,
        greeted: W,
        agentActivityState: N,
        setAgentActivityState: ve,
        streamType: z,
        interruptAvailable: x,
        interrupt: co,
        interruptLoading: de,
        triggersAvailable: S,
        fluentStarted: Je,
        legacyStarted: U,
        isRestarting: O,
        publishMicrophoneStream: lo,
        unpublishMicrophoneStream: uo,
        supportsMicrophoneStream: ho,
        isVMAgent: fo
      },
      children: e
    }
  );
}
const Et = 768, Ra = nt({
  opened: !1,
  setOpened: () => {
  },
  isChatOpen: !1,
  setIsChatOpen: () => {
  },
  expanded: !1,
  setExpanded: () => {
  },
  isBrowserFullscreen: !1,
  handleBrowserFullscreen: () => {
  },
  updateLayout: () => {
  },
  chatPosition: window.screen.width < Et ? "closed-bottom" : "closed-side",
  wrapperRef: null,
  isSmallScreen: !1,
  isHorizontal: !1,
  isMobileOrientationBlocked: !1
}), Ci = () => {
  var e, n;
  return (n = (e = window.screen) == null ? void 0 : e.orientation) != null && n.type ? window.screen.orientation.type.startsWith("landscape") : !1;
}, Dl = ({ children: t }) => {
  const { configurations: e } = ce(ke), [n, r] = A(!!e.open), { enrichSdkAnalytics: i } = ye(), [a, o] = A(e.chatMode === R.Playground), [s, l] = A(!1), [c, g] = A(!1), d = q(null);
  E(() => {
    const I = () => {
      const x = !!document.fullscreenElement;
      g(x), !x && c && l(!1);
    };
    return document.addEventListener("fullscreenchange", I), g(!!document.fullscreenElement), () => {
      document.removeEventListener("fullscreenchange", I);
    };
  }, [c]), E(() => {
    jt("requestFullscreen", async (x) => {
      if (!d.current) {
        console.warn("Cannot toggle fullscreen: wrapper element not found");
        return;
      }
      const m = !!document.fullscreenElement;
      x === !1 ? m && await document.exitFullscreen() : x === !0 ? m || (l(!1), await d.current.requestFullscreen().catch((S) => {
        console.warn("Failed to enter fullscreen:", S);
      })) : m ? await document.exitFullscreen() : (l(!1), await d.current.requestFullscreen().catch((S) => {
        console.warn("Failed to enter fullscreen:", S);
      }));
    });
  }, []), E(() => {
    jt("setWidgetOpen", (x) => {
      r(x), x && e.openMode === "expanded" && l(!0);
    });
  }, [e.openMode]);
  const h = Me(() => Pa(), []), [p, f] = A(() => h ? Ci() && (e.mode === "fabio" && n || s) : !1), [_, v] = A({
    chatBottom: window.screen.width < Et,
    isSmallScreen: h || window.innerWidth < Et,
    isHorizontal: !h && e.orientation === "horizontal"
  }), y = e.chatMode === R.Playground, C = e.mode === "fabio", b = Z(() => {
    const I = h || window.innerWidth <= Et;
    if (I)
      return v(() => ({
        chatBottom: !0,
        isHorizontal: !1,
        isSmallScreen: !0
      }));
    if (s)
      return v(() => ({
        chatBottom: I,
        isHorizontal: !I,
        isSmallScreen: I
      }));
    if (C) {
      const x = e.orientation === "vertical" || I, m = e.orientation === "horizontal" && !I;
      return v(() => ({
        isSmallScreen: I,
        isHorizontal: m,
        chatBottom: x
      }));
    }
    if (!C && e.targetElement) {
      let x = null;
      if (typeof e.targetElement == "string" ? x = document.getElementById(e.targetElement) : x = e.targetElement, x) {
        const m = x.getBoundingClientRect(), S = m.width, M = m.height, k = S >= 656;
        return i({
          agents_component_size: `${S}x${M}`,
          window_size: `${window.innerWidth}x${window.innerHeight}`
        }), y && document.documentElement.style.setProperty("--didWidth", `${S}px`), v(() => ({
          chatBottom: y ? !0 : !k,
          isSmallScreen: h || S < Et,
          isHorizontal: y ? !1 : S > M
        }));
      }
    }
    return v(() => ({
      chatBottom: window.innerWidth < Et,
      isSmallScreen: I,
      isHorizontal: e.orientation === "horizontal"
    }));
  }, [e, s, a]), w = q(null);
  E(() => {
    if (b(), e.mode === "fabio" || !e.targetElement || !ResizeObserver)
      return w.current = wi(b, 100), window.addEventListener("resize", w.current), () => {
        window.removeEventListener("resize", w.current ?? (() => {
        })), w.current = null;
      };
    {
      const I = e.targetElement, x = wi(() => {
        requestAnimationFrame(() => {
          b();
        });
      }, 100), m = new ResizeObserver(x);
      return m.observe(I), () => {
        m.disconnect();
      };
    }
  }, [b, s, e.mode, _.isHorizontal]), E(() => {
    const I = new CustomEvent("didagent_chat_toggled", {
      detail: a
    });
    window.dispatchEvent(I), i({
      is_chat_open: a
    }), b();
  }, [a]), E(() => {
    if (!h) return;
    const I = () => {
      const m = Ci() && (C && n || s);
      f(m);
    };
    return window.addEventListener("orientationchange", I), I(), () => {
      window.removeEventListener("orientationchange", I);
    };
  }, [h, C, n, s]);
  const N = Z(
    (I) => {
      c ? (document.exitFullscreen().catch((x) => {
        console.warn("Failed to exit fullscreen:", x);
      }), l(!1)) : l((x) => I ?? !x);
    },
    [c, l]
  ), j = () => window.DID_AGENTS_API.functions.requestFullscreen(), z = a ? _.chatBottom ? "bottom" : "side" : _.chatBottom ? "closed-bottom" : "closed-side";
  return /* @__PURE__ */ u(
    Ra.Provider,
    {
      value: {
        opened: n,
        isChatOpen: a,
        expanded: s,
        isBrowserFullscreen: c,
        handleBrowserFullscreen: j,
        isSmallScreen: _.isSmallScreen,
        isHorizontal: _.isHorizontal,
        isMobileOrientationBlocked: p,
        chatPosition: z,
        wrapperRef: d,
        setOpened: r,
        setIsChatOpen: o,
        setExpanded: N,
        updateLayout: b
      },
      children: t
    }
  );
}, Ae = () => ce(Ra), ja = nt([]), za = nt(() => {
});
function Ol({ children: t }) {
  const [e, n] = A(Array(12).fill(2));
  return /* @__PURE__ */ u(ja.Provider, { value: e, children: /* @__PURE__ */ u(za.Provider, { value: n, children: t }) });
}
const Pl = () => ce(za), Rl = () => ce(ja), jl = (t, e) => Array.from({ length: 12 }, (n, r) => {
  const i = r < 6 ? 11 - r : r, a = i % 3, o = Math.floor(i / 3) * 3 + a;
  let c = t[o * Math.floor(e / 12)] / 256 * 100;
  return a === 0 ? c *= 0.5 : a === 1 ? c *= 0.8 : c *= 1.2, Math.max(2, Math.min(23, c));
});
function zl({
  publishMicrophoneStream: t,
  unpublishMicrophoneStream: e,
  supportsMicrophoneStream: n,
  connectionState: r,
  micStream: i,
  enforcedMicMuted: a
}) {
  const [o, s] = A(!1), l = q(!1), c = q(null), g = Z(
    async (h) => {
      var f;
      if (!n || !t)
        return;
      const p = (f = h.getAudioTracks()[0]) == null ? void 0 : f.id;
      if (!(l.current || c.current === p))
        try {
          l.current = !0, await t(h), s(!0), c.current = p;
        } catch (_) {
          console.error("Failed to publish microphone stream:", _);
        } finally {
          l.current = !1;
        }
    },
    [n, t]
  ), d = Z(async () => {
    if (!(!n || !e || !o))
      try {
        await e(), s(!1), c.current = null;
      } catch (h) {
        console.error("Failed to unpublish microphone stream:", h);
      }
  }, [n, e, o]);
  return E(() => {
    n && r === B.Connected && !a && i && !o && !l.current && g(i);
  }, [
    n,
    r,
    a,
    i,
    o,
    g
  ]), E(() => {
    (r === B.Disconnected || r === B.Connecting) && o && (s(!1), c.current = null);
  }, [r, o]), {
    publishMicrophoneStreamToSDK: g,
    unpublishMicrophoneStreamFromSDK: d,
    isMicrophonePublished: o
  };
}
const bi = "DID_AGENT_STT_TOKEN", $a = 1e3 * 60 * 9, $l = () => {
  const { getSTTToken: t } = ye();
  return Z(async () => {
    const e = JSON.parse(
      localStorage.getItem(bi) ?? "null"
    ), n = (/* @__PURE__ */ new Date()).getTime();
    if (e && n < e.expiry) return e;
    const r = await t(), i = { token: r, expiry: n + $a };
    return r && localStorage.setItem(bi, JSON.stringify(i)), i;
  }, [t]);
}, Fl = "en-US";
class Bl {
  constructor({ events: e, getSTTToken: n, trackUi: r }) {
    De(this, "events");
    De(this, "getSTTToken");
    De(this, "recognizer");
    De(this, "speechSDK");
    De(this, "intervalId");
    De(this, "status", "ready");
    De(this, "trackUi");
    De(this, "abortPromise", null);
    De(this, "initEvents", () => {
      if (!this.recognizer || !this.speechSDK) return;
      const e = this.speechSDK;
      this.recognizer.recognized = (n, r) => {
        this.events.onresult(r);
      }, this.recognizer.canceled = (n, r) => {
        var i, a;
        (a = (i = this.events).onerror) == null || a.call(i, r);
      }, this.recognizer.recognizing = (n, r) => {
        var i, a;
        r.result.reason === e.ResultReason.RecognizingSpeech && ((a = (i = this.events).onrecognizing) == null || a.call(i, r));
      }, this.recognizer.sessionStopped = () => {
        var n, r;
        (r = (n = this.events).onend) == null || r.call(n);
      };
    });
    De(this, "refreshToken", async () => {
      var n, r;
      if (this.status === "destroyed" || !this.speechSDK) return;
      const e = await this.getSTTToken();
      if (!e.token)
        throw new Error("No STT token found in refreshToken");
      (n = this.recognizer) == null || n.properties.setProperty(
        this.speechSDK.PropertyId.SpeechServiceConnection_Region,
        e.token.region
      ), (r = this.recognizer) == null || r.properties.setProperty(
        this.speechSDK.PropertyId.SpeechServiceAuthorization_Token,
        e.token.token
      );
    });
    De(this, "initTokenRefreshInterval", (e) => {
      const n = (/* @__PURE__ */ new Date()).getTime();
      window.setTimeout(
        () => {
          this.status !== "destroyed" && (this.refreshToken(), this.intervalId = window.setInterval(this.refreshToken, $a));
        },
        e - n + 1
      );
    });
    De(this, "init", async (e, n, r) => {
      if (this.status === "destroying" || this.status === "destroyed")
        return;
      this.speechSDK || (this.speechSDK = await import("./microsoft.cognitiveservices.speech.sdk-DsKt2trO.js").then((d) => d.m));
      const { AudioConfig: i, SpeechRecognizer: a, PropertyId: o, SpeechConfig: s } = this.speechSDK, l = await this.getSTTToken();
      if (!l.token)
        throw new Error("No STT token found");
      const c = i.fromStreamInput(n), g = s.fromAuthorizationToken(
        l.token.token,
        l.token.region
      );
      r && g.setProperty(o.Speech_SegmentationSilenceTimeoutMs, r), g.speechRecognitionLanguage = e, this.recognizer = new a(g, c), this.initEvents(), this.initTokenRefreshInterval(l.expiry), this.status = "ready";
    });
    /**
     * Update event handlers after initialization.
     */
    De(this, "updateEvents", (e) => {
      this.events = e;
    });
    De(this, "start", () => this.status !== "ready" && this.status !== "muted" ? Promise.resolve() : this.recognizer ? (this.status = "starting", new Promise((e, n) => {
      this.recognizer.startContinuousRecognitionAsync(
        () => {
          var r, i;
          this.status = "listening", (i = (r = this.events).onstart) == null || i.call(r), e();
        },
        (r) => {
          this.status = "ready", this.trackUi("stt-error", {
            operation: "start",
            error: r
          }), n(new Error(r));
        }
      );
    })) : Promise.reject(new Error("Recognizer not initialized")));
    De(this, "stopRecognition", (e) => this.recognizer ? new Promise((n, r) => {
      this.recognizer.stopContinuousRecognitionAsync(
        () => {
          n();
        },
        (i) => {
          this.trackUi("stt-error", {
            operation: e,
            error: i
          }), r(new Error(i));
        }
      );
    }) : Promise.resolve());
    De(this, "abort", async () => {
      if (this.status === "listening")
        return this.abortPromise ? this.abortPromise : (this.abortPromise = (async () => {
          this.status = "muting";
          try {
            await this.stopRecognition("abort"), this.status = "muted";
          } catch (e) {
            throw this.status = "listening", e;
          } finally {
            this.abortPromise = null;
          }
        })(), this.abortPromise);
    });
    /**
     * Destroy the recognizer. This is needed to avoid memory leaks.
     * If you need to use the recognizer again, you need to create a new instance.
     */
    De(this, "destroy", async () => {
      if (!(this.status === "destroying" || this.status === "destroyed")) {
        this.abortPromise && await this.abortPromise, this.status === "listening" && await this.abort(), this.status = "destroying";
        try {
          await this.closeRecognizer();
        } catch (e) {
          throw this.status = "listening", e;
        } finally {
          this.recognizer = void 0, window.clearInterval(this.intervalId), this.status = "destroyed";
        }
      }
    });
    this.events = e, this.getSTTToken = n, this.status = "ready", this.trackUi = r;
  }
  /**
   * Private method to wrap the recognizer.close() in a Promise
   */
  closeRecognizer() {
    return new Promise((e, n) => {
      if (!this.recognizer) {
        e();
        return;
      }
      this.recognizer.close(
        () => {
          e();
        },
        (r) => {
          n(new Error(`Failed to close recognizer: ${r}`));
        }
      );
    });
  }
}
const Vl = ({
  enabled: t,
  selectedInputDevice: e,
  permissionGranted: n,
  language: r,
  speechSilenceTimeoutMs: i,
  micStream: a
}) => {
  const o = $l(), { trackUi: s } = Mt(), { agent: l } = ye(), [c, g] = A(null), d = q(null), h = q(o), p = q(s);
  return E(() => {
    h.current = o, p.current = s;
  }, [o, s]), E(() => {
    var N, j;
    const f = a, _ = !!f, v = (j = (N = f == null ? void 0 : f.getAudioTracks()[0]) == null ? void 0 : N.getSettings()) == null ? void 0 : j.deviceId;
    if (!(t && n && _ && !!r && (!!!e || v === e) && !!l)) {
      d.current && (d.current.destroy().catch((z) => {
        console.error("Failed to destroy recognizer:", z);
      }), d.current = null, g(null));
      return;
    }
    const w = new Bl({
      getSTTToken: h.current,
      events: {
        onresult: () => {
        },
        onstart: () => {
        },
        onend: () => {
        },
        onerror: () => {
        },
        onrecognizing: () => {
        }
      },
      trackUi: p.current
    });
    return d.current = w, w.init(r, f, i).then(() => {
      g(w);
    }).catch((z) => {
      console.error("Failed to initialize STT recognizer:", z), d.current = null, g(null);
    }), () => {
      d.current = null, w.destroy().catch((z) => {
        console.error("Failed to destroy recognizer:", z);
      }), g(null);
    };
  }, [t, e, n, r, i, a, l]), c;
}, Fa = nt({
  permissionAsked: !1,
  permissionGranted: !1,
  conversationStarted: !1,
  micMuted: !1,
  inputDevices: [],
  outputDevices: [],
  selectedInputDevice: "",
  selectedOutputDevice: "",
  micStreamRef: { current: null },
  speakerMuted: !1,
  handleMicMute: () => {
  },
  handleSpeakerMute: () => {
  },
  setSpeakerMuted: () => {
  },
  startConversation: () => {
  },
  setSelectedInputDevice: () => {
  },
  requestMicrophoneAccess: () => {
  },
  setSelectedOutputDevice: () => {
  },
  sttRecognizer: null
}), Ht = (t) => t.replace(/^Default - /, "");
function Ul({ children: t }) {
  var ot, Je;
  const {
    connect: e,
    enrichSdkAnalytics: n,
    agent: r,
    enabled: i,
    language: a,
    connectionState: o,
    publishMicrophoneStream: s,
    unpublishMicrophoneStream: l,
    supportsMicrophoneStream: c
  } = ye(), { configurations: g } = ce(ke), [d, h] = A(!1), [p, f] = A(!1), [_, v] = A(null), [y, C] = A(g.chatMode === R.Playground), [b, w] = A(!1), [N, j] = A([]), [z, I] = A([]), [x, m] = A(""), [S, M] = A(""), k = q(null), [T, D] = A(null), F = Pl(), K = q(null), { opened: ee } = Ae(), re = o === B.Disconnected, Y = g.mode === "fabio", Q = g.chatMode === R.Playground, V = g.chatMode === R.TextOnly, L = Q || V, $ = !ee && Y || re && !L, X = $ ? !0 : y, oe = $ ? !0 : b, Ie = q(null), qe = q(null), Ne = q(null), {
    publishMicrophoneStreamToSDK: Ve,
    unpublishMicrophoneStreamFromSDK: $e
  } = zl({
    publishMicrophoneStream: s,
    unpublishMicrophoneStream: l,
    supportsMicrophoneStream: c,
    connectionState: o,
    micStream: T,
    enforcedMicMuted: X
  }), Ze = Me(() => {
    var se, Se, Le;
    const U = ((Se = (se = r == null ? void 0 : r.presenter) == null ? void 0 : se.voice) == null ? void 0 : Se.language) || "English";
    return _n(U) ? a : ((Le = vn.find(({ label: we }) => U.includes(we))) == null ? void 0 : Le.value) || Fl;
  }, [(Je = (ot = r == null ? void 0 : r.presenter) == null ? void 0 : ot.voice) == null ? void 0 : Je.language, a]), O = Vl({
    enabled: i && !c,
    selectedInputDevice: x,
    permissionGranted: _,
    language: Ze,
    speechSilenceTimeoutMs: g.speechSilenceTimeoutMs,
    micStream: c ? null : T
  }), H = Z(() => {
    K.current !== null && (cancelAnimationFrame(K.current), K.current = null);
  }, []), W = Z(
    (U = !1) => {
      H(), U || $e(), k.current && (k.current.getTracks().forEach((te) => {
        te.stop(), te.enabled = !1;
      }), k.current = null, D(null)), qe.current && (qe.current.disconnect(), qe.current = null), Ne.current && (Ne.current.disconnect(), Ne.current = null), Ie.current && (Ie.current.close(), Ie.current = null);
    },
    [H, $e]
  ), le = Z(
    async (U = !1) => {
      var _t, gt, Lt, zt;
      const te = await navigator.mediaDevices.enumerateDevices(), se = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map();
      te.forEach((He) => {
        const dt = Ht(He.label);
        He.kind === "audioinput" ? (!se.has(dt) || He.deviceId !== "default") && se.set(dt, He) : He.kind === "audiooutput" && (!Se.has(dt) || He.deviceId !== "default") && Se.set(dt, He);
      });
      const Le = Array.from(se.values()), we = Array.from(Se.values());
      j(Le), I(we);
      const Fe = localStorage.getItem("didagent__selected_input_device"), Ee = localStorage.getItem("didagent__selected_output_device");
      if (U) {
        const He = Le.find((Qe) => Qe.deviceId === Fe);
        if (Fe && He)
          m(Fe);
        else {
          const Qe = te.filter((Ke) => Ke.kind === "audioinput").find((Ke) => Ke.deviceId === "default");
          if (Qe) {
            const Ke = Ht(Qe.label), ut = Le.find(($t) => Ht($t.label) === Ke);
            m((ut == null ? void 0 : ut.deviceId) || ((_t = Le[0]) == null ? void 0 : _t.deviceId) || "");
          } else
            m(((gt = Le[0]) == null ? void 0 : gt.deviceId) || "");
        }
        const dt = we.find((Qe) => Qe.deviceId === Ee);
        if (Ee && dt)
          M(Ee);
        else {
          const Qe = te.filter((Ke) => Ke.kind === "audiooutput").find((Ke) => Ke.deviceId === "default");
          if (Qe) {
            const Ke = Ht(Qe.label), ut = we.find(
              ($t) => Ht($t.label) === Ke
            );
            M((ut == null ? void 0 : ut.deviceId) || ((Lt = we[0]) == null ? void 0 : Lt.deviceId) || "");
          } else
            M(((zt = we[0]) == null ? void 0 : zt.deviceId) || "");
        }
      }
    },
    [m, M, j, I]
  ), de = Z(() => {
    if (!Ne.current) return;
    const U = Ne.current, te = U.frequencyBinCount, se = new Uint8Array(te), Se = () => {
      if (!Ne.current) return;
      U.getByteFrequencyData(se);
      const Le = jl(se, te);
      F(Le), K.current = requestAnimationFrame(Se);
    };
    K.current = requestAnimationFrame(Se);
  }, [F]);
  E(() => {
    var U;
    x && !N.find((te) => te.deviceId === x) && m(((U = N[0]) == null ? void 0 : U.deviceId) || "");
  }, [x, N]), E(() => {
    var U;
    S && !z.find((te) => te.deviceId === S) && M(((U = z[0]) == null ? void 0 : U.deviceId) || "");
  }, [S, z]), E(() => {
    x ? localStorage.setItem("didagent__selected_input_device", x) : localStorage.removeItem("didagent__selected_input_device");
  }, [x]), E(() => {
    S ? localStorage.setItem("didagent__selected_output_device", S) : localStorage.removeItem("didagent__selected_output_device");
  }, [S]);
  const Te = Z(
    async (U) => {
      var Le, we;
      const te = (Le = U.getAudioTracks()[0]) == null ? void 0 : Le.id, se = k.current, Se = (we = se == null ? void 0 : se.getAudioTracks()[0]) == null ? void 0 : we.id;
      se && Se !== te && await $e(), W(!0);
      try {
        k.current = U, D(U);
        const Fe = window.AudioContext || (window == null ? void 0 : window.webkitAudioContext), Ee = new Fe();
        Ie.current = Ee, Ee.state === "suspended" && await Ee.resume();
        const _t = Ee.createMediaStreamSource(U);
        qe.current = _t;
        const gt = Ee.createAnalyser();
        Ne.current = gt, gt.fftSize = 64, _t.connect(gt), v(!0), de(), o === B.Connected && await Ve(U);
      } catch (Fe) {
        console.error("Error in handleMicStream:", Fe), W();
      }
    },
    [
      W,
      de,
      o,
      $e,
      Ve
    ]
  ), _e = Z(() => {
    var we, Fe;
    const U = k.current, se = ((Fe = (we = U == null ? void 0 : U.getAudioTracks()[0]) == null ? void 0 : we.getSettings()) == null ? void 0 : Fe.deviceId) === x;
    if ((() => {
      if (!U || !se)
        return !1;
      const Ee = U.getAudioTracks()[0];
      return (Ee == null ? void 0 : Ee.readyState) === "live";
    })())
      return;
    p || f(!0);
    const Le = (x == null ? void 0 : x.length) > 0 ? { deviceId: { exact: x } } : !0;
    navigator.mediaDevices.getUserMedia({
      audio: Le
    }).then(Te).catch((Ee) => {
      console.error("Error accessing microphone: ", Ee), v(!1);
    });
  }, [Te, x, p]), Oe = Z(() => {
    d || (h(!0), L || e(), _e());
  }, [d, _e, e]);
  E(() => {
    d || (Y && ee || !Y && Q) && Oe();
  }, [ee, d, Y]), E(() => {
    !r || d || g.autoConnect && g.mode === "full" && g.targetElement && Oe();
  }, [g.autoConnect, g.mode, g.targetElement, d, Oe, r]);
  const Ue = Z(
    async (U) => {
      let te;
      U !== void 0 ? (te = U, C(U)) : C((se) => (te = !se, te)), c && o === B.Connected && (te ? await $e() : k.current && await Ve(k.current));
    },
    [
      c,
      o,
      $e,
      Ve
    ]
  );
  jt("toggleMicState", Ue);
  const at = Z(
    (U) => {
      w(U !== void 0 ? U : (te) => !te);
    },
    [w]
  );
  jt("toggleSpeakerState", at);
  const ve = d && (Y ? ee : !0) && !X;
  return E(() => {
    var te, se;
    const U = k.current;
    if (!ve)
      W(), F(Array(12).fill(2));
    else if (!U)
      _e();
    else {
      const Se = (se = (te = U.getAudioTracks()[0]) == null ? void 0 : te.getSettings()) == null ? void 0 : se.deviceId;
      x && Se && Se !== x && _e();
    }
  }, [ve, W, _e, F, x]), E(() => () => {
    W();
  }, [W]), E(() => {
    if (!_) return;
    const U = () => {
      le(!1);
    };
    return navigator.mediaDevices.addEventListener("devicechange", U), le(!0), () => {
      navigator.mediaDevices.removeEventListener("devicechange", U);
    };
  }, [le, _]), E(() => {
    n({
      microphone_status: X ? "muted" : "unmuted",
      speaker_status: oe ? "muted" : "unmuted"
    });
  }, [X, oe]), /* @__PURE__ */ u(
    Fa.Provider,
    {
      value: {
        conversationStarted: d,
        permissionAsked: p,
        permissionGranted: _,
        inputDevices: N,
        outputDevices: z,
        selectedInputDevice: x,
        selectedOutputDevice: S,
        micStreamRef: k,
        micMuted: X,
        speakerMuted: oe,
        handleMicMute: Ue,
        handleSpeakerMute: at,
        setSpeakerMuted: w,
        startConversation: Oe,
        setSelectedInputDevice: m,
        requestMicrophoneAccess: _e,
        setSelectedOutputDevice: M,
        sttRecognizer: O
      },
      children: t
    }
  );
}
const it = () => ce(Fa), Ba = (t) => {
  const [e, n] = A(
    0
    /* Idle */
  ), r = [he.Buffering, he.Loading].includes(
    t
  );
  return E(() => {
    r ? (n(
      1
      /* Delayed */
    ), setTimeout(() => {
      n((s) => s === 1 ? 2 : s);
    }, 1200)) : n(
      0
      /* Idle */
    );
  }, [r]), {
    isResponseLoading: e === 2,
    isResponseDelayed: e === 1,
    isResponseIdle: e === 0
  };
};
function Hl(t) {
  const e = t.style.height;
  t.style.height = "0";
  const n = t.scrollHeight / parseInt(getComputedStyle(t).lineHeight);
  return t.style.height = e, parseInt(n + "");
}
const Zl = ["studio-dev.d-id.com", "studio-staging.d-id.com", "studio.d-id.com"], Va = Zl.some((t) => window.location.hostname === t), Kl = Va && window.location.pathname === "/agents/share";
function Wl() {
  try {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  } catch (t) {
    console.error("Error occurred while detecting iOS:", t);
  }
  return !1;
}
function Gl() {
  const t = navigator.userAgent.match(/OS (\d+)_\d+(_\d+)? like Mac OS X/i);
  return t ? parseInt(t[1], 10) === 17 : !1;
}
function ql(t) {
  const { t: e } = rt(), [n, r] = A("");
  return E(() => {
    r(e(vl[t][Kl ? Jn.OwnerChat : Jn.EndUser]));
  }, [t, e]), n;
}
function Yl({
  showReconnect: t,
  isChatClosed: e,
  connectionState: n,
  textRef: r,
  chatPosition: i
}) {
  const { setIsChatOpen: a } = Ae();
  E(() => {
    t && !e && a(!1);
  }, [t, e, a]), E(() => {
    n === B.Closed && a(!1);
  }, [n, a]), E(() => {
    var o;
    e || (o = r == null ? void 0 : r.current) == null || o.focus();
  }, [i, e, r]);
}
function Jl(t) {
  const { agent: e, setError: n, disconnect: r } = ye();
  E(() => {
    t && (n(`${(e == null ? void 0 : e.preview_name) || "Agent"} is not available at the moment`), r());
  }, [e, t, n, r]);
}
const Cr = [B.Fail, B.Disconnected, B.Completed];
function Ql({
  textRef: t,
  isTextual: e,
  offline: n,
  text: r,
  setText: i,
  onError: a
}) {
  const { trackUi: o } = Mt(), {
    connectionState: s,
    starterMessages: l,
    reconnect: c,
    disconnect: g,
    setStreamState: d,
    changeMode: h,
    sendChatMessage: p,
    setAgentActivityState: f
  } = ye(), { configurations: _ } = ce(ke), { isAuthenticated: v } = ce(rn);
  async function y(C) {
    var b;
    if (Pa() && ((b = t.current) == null || b.blur()), _.chatMode !== R.Off && (C = C.trim(), C !== "")) {
      if (!e && Cr.includes(s) && await c(), !v)
        return o("agent-offline-onsend", { event: "click" }), n == null ? void 0 : n.onSend(r);
      l && l.indexOf(C) > -1 && o("agent-starter-question", { event: "click", question: C }), i(""), f(he.Loading);
      try {
        const w = await p(C).catch(async (N) => {
          var j;
          if ((j = N == null ? void 0 : N.message) != null && j.includes("Playground chat limit exceeded"))
            throw new Error("Playground chat limit exceeded");
          return console.error("Error in sending message ", N), {
            chatMode: R.Maintenance,
            result: "Sorry, I am not available right now",
            matches: []
          };
        });
        if (w.chatMode && (h(w.chatMode), w.chatMode === R.Maintenance))
          return a == null || a(new Error("Agent is in maintenance mode"), w), g();
        [R.TextOnly, R.Playground].includes(w.chatMode) ? (d(Re.New), f(he.Idle)) : f(he.Buffering);
      } catch (w) {
        throw d(Re.New), f(he.Idle), w;
      }
    }
  }
  return { onSend: y };
}
const Xl = "#e6e6e6", e2 = (t, e) => new Promise((n) => {
  const r = document.createElement("canvas"), i = r.getContext("2d");
  if (!r || !i) {
    console.error("Failed adding background to presenter poster - could not create canvas or context"), n(t);
    return;
  }
  const a = new Image();
  a.crossOrigin = "anonymous", a.src = t, a.onload = () => {
    r.width = a.width, r.height = a.height, r.style.width = a.width + "px", r.style.height = a.height + "px", i.fillStyle = e, i.fillRect(0, 0, r.width, r.height), i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "high", i.drawImage(a, 0, 0), n(r.toDataURL("image/jpeg", 0.95));
  }, a.onerror = () => {
    console.error("Failed adding background to presenter poster - could not load image"), n(t);
  };
});
function t2() {
  const { configurations: t, configure: e } = ce(ke), { agent: n, changeMode: r } = ye();
  E(() => {
    if (t.posterSrc || Va && t.chatMode === R.Playground)
      return;
    (async () => {
      const a = n == null ? void 0 : n.presenter;
      if (!a) return;
      const { type: o, poster: s, source_url: l, thumbnail: c } = a;
      let g;
      if (o === "clip" || o === "expressive")
        g = s || c;
      else if (o === "talk")
        g = l || s || c;
      else {
        r(R.Maintenance);
        return;
      }
      const d = await e2(g, Xl);
      e({ posterSrc: d });
    })();
  }, [n == null ? void 0 : n.id]);
}
const Ua = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='iso-8859-1'?%3e%3c!--%20Uploaded%20to:%20SVG%20Repo,%20www.svgrepo.com,%20Generator:%20SVG%20Repo%20Mixer%20Tools%20--%3e%3csvg%20height='800px'%20width='800px'%20version='1.1'%20id='Capa_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%20199.943%20199.943'%20xml:space='preserve'%3e%3cg%3e%3cg%3e%3cpath%20style='fill:%23010002;'%20d='M99.972,0.004C44.85,0.004,0,44.847,0,99.968c0,55.125,44.847,99.972,99.972,99.972%20s99.972-44.847,99.972-99.972C199.943,44.847,155.093,0.004,99.972,0.004z%20M99.972,190.957c-50.168,0-90.996-40.813-90.996-90.989%20c0-50.172,40.828-90.992,90.996-90.992c50.175,0,91.003,40.817,91.003,90.992S150.147,190.957,99.972,190.957z'/%3e%3cpath%20style='fill:%23010002;'%20d='M99.324,67.354c-3.708,0-6.725,3.01-6.725,6.728v75.979c0,3.722,3.017,6.739,6.725,6.739%20c3.722,0,6.739-3.017,6.739-6.739V74.082C106.063,70.364,103.042,67.354,99.324,67.354z'/%3e%3ccircle%20style='fill:%23010002;'%20cx='99.746'%20cy='48.697'%20r='8.178'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";
function ge({
  src: t,
  size: e,
  color: n = "currentcolor",
  padding: r = "0",
  rotated: i,
  margin: a = "0",
  width: o,
  className: s = ""
}) {
  return /* @__PURE__ */ u(
    "svg",
    {
      className: "didagent__maskedicon " + s,
      style: {
        "--mask-url": `url("${t}")`,
        "--color": n,
        "--width": o,
        "--size": e,
        "--padding": r,
        "--margin": a,
        "--rotation": i ? "180deg" : "0deg"
      },
      "aria-hidden": "true",
      focusable: "false"
    }
  );
}
function n2({ content: t, display: e }) {
  const [n, r] = A(!1), [i, a] = A("");
  return E(() => {
    if (!e)
      r(!1);
    else {
      r(!0), a("fade-in");
      const o = setTimeout(() => {
        a("fade-out");
        const s = setTimeout(() => r(!1), 500);
        return () => clearTimeout(s);
      }, 3e3);
      return () => clearTimeout(o);
    }
  }, [e]), n ? /* @__PURE__ */ u("div", { className: `didagent__info_message_indication ${i}`, children: [
    /* @__PURE__ */ u(ge, { src: Ua, size: "16px" }),
    /* @__PURE__ */ u("pre", { className: "didagent__info_message_agent_unavailable_message", children: t })
  ] }) : null;
}
const Qn = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M5.37568%205.46967C5.66857%205.17678%206.14344%205.17678%206.43634%205.46967L11.906%2010.9394L17.3757%205.46972C17.6686%205.17683%2018.1434%205.17683%2018.4363%205.46972C18.7292%205.76261%2018.7292%206.23749%2018.4363%206.53038L12.9667%2012L18.4363%2017.4696C18.7292%2017.7625%2018.7292%2018.2374%2018.4363%2018.5303C18.1434%2018.8232%2017.6685%2018.8232%2017.3756%2018.5303L11.906%2013.0607L6.43639%2018.5303C6.14349%2018.8232%205.66862%2018.8232%205.37573%2018.5303C5.08283%2018.2374%205.08283%2017.7626%205.37573%2017.4697L10.8454%2012L5.37568%206.53033C5.08278%206.23744%205.08278%205.76256%205.37568%205.46967Z'%20fill='white'%20/%3e%3c/svg%3e";
function r2({ onClick: t }) {
  return /* @__PURE__ */ u("button", { onClick: t, role: "button", "aria-label": "Close chat", className: "didagent__chat__button", children: /* @__PURE__ */ u(ge, { src: Qn, size: "16px", color: "#090604" }) });
}
const i2 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPScyNCcgaGVpZ2h0PScyNCcgZmlsbD0ibm9uZSIgdmlldy1ib3g9IjAgMCAyNCAyNCI+CiAgICA8cGF0aCBzdHJva2U9J2N1cnJlbnRjb2xvcicgc3Ryb2tlLXdpZHRoPScxLjUnIGQ9Ik03IDhhNSA1IDAgMCAxIDEwIDB2M2E1IDUgMCAwIDEtMTAgMFY4WiIgLz4KICAgIDxwYXRoCiAgICAgICAgc3Ryb2tlPSdjdXJyZW50Y29sb3InCiAgICAgICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogICAgICAgIHN0cm9rZS13aWR0aD0nMS41JwogICAgICAgIGQ9Ik0xMSA4aDJNMTAgMTFoNE0yMCAxMHYxYTggOCAwIDEgMS0xNiAwdi0xTTEyIDE5djMiCiAgICAvPgogICAgPHBhdGggc3Ryb2tlPSdjdXJyZW50Y29sb3InIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPScxLjUnIGQ9Ik0yMiAyIDIgMjIiIC8+Cjwvc3ZnPg==", a2 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlldy1ib3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aCBzdHJva2U9ImN1cnJlbnRjb2xvciIgc3Ryb2tlLXdpZHRoPScxLjUnIGQ9Ik03IDhhNSA1IDAgMCAxIDEwIDB2M2E1IDUgMCAwIDEtMTAgMFY4WiIgLz4KICAgIDxwYXRoCiAgICAgICAgc3Ryb2tlPSJjdXJyZW50Y29sb3IiCiAgICAgICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogICAgICAgIHN0cm9rZS13aWR0aD0nMS41JwogICAgICAgIGQ9Ik0xMSA4aDJNMTAgMTFoNE0yMCAxMHYxYTggOCAwIDEgMS0xNiAwdi0xTTEyIDE5djMiCiAgICAvPgo8L3N2Zz4=";
function Ha({ children: t, enabled: e, content: n, persist: r = !1, className: i = "" }) {
  if (!e)
    return t;
  const a = `didagent__tooltip ${r ? "didagent__tooltip__persistent" : "didagent__tooltip__hover"} ${i}`;
  return /* @__PURE__ */ u("div", { className: a, children: [
    t,
    /* @__PURE__ */ u("span", { className: "didagent__tooltip__content", children: n })
  ] });
}
const kn = (t, e) => {
  const n = q(null), r = Z(
    (i) => {
      if (!n.current) return;
      i.composedPath().includes(n.current) || (t(i), i.stopPropagation());
    },
    [t]
  );
  return E(() => (e ? window.addEventListener("click", r, { capture: !0 }) : window.removeEventListener("click", r, { capture: !0 }), () => {
    window.removeEventListener("click", r, { capture: !0 });
  }), [e, r]), n;
}, o2 = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7%2012.9L10.1429%2016.5L18%207.5'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3c/svg%3e", s2 = () => /* @__PURE__ */ u(ge, { size: "24px", src: o2 }), c2 = () => /* @__PURE__ */ u("span", { style: "width:24px;height:24px;" }), l2 = ({ label: t, value: e, selected: n, onClick: r }) => {
  const i = Z(() => {
    r(e);
  }, [r, e]);
  return /* @__PURE__ */ u(
    "li",
    {
      className: "didagent__audio__dropdown__item",
      role: "option",
      "aria-selected": n,
      tabIndex: 0,
      onClick: i,
      onKeyDown: (a) => {
        (a.key === "Enter" || a.key === " ") && (a.preventDefault(), i());
      },
      title: t,
      children: [
        n ? /* @__PURE__ */ u(s2, {}) : /* @__PURE__ */ u(c2, {}),
        /* @__PURE__ */ u("span", { children: t })
      ]
    }
  );
};
function Za({ devices: t, selectedDevice: e, setSelectedDevice: n, header: r }) {
  const i = `${r.toLowerCase()}-list`;
  return /* @__PURE__ */ u("div", { className: "didagent__dropdown__list", role: "group", "aria-labelledby": i, children: [
    /* @__PURE__ */ u("div", { id: i, className: "didagent__audio__dropdown__header", children: r }),
    /* @__PURE__ */ u("ul", { role: "listbox", "aria-labelledby": i, children: t.map(({ label: a, deviceId: o }) => /* @__PURE__ */ u(
      l2,
      {
        label: a,
        value: o,
        selected: e === o,
        onClick: () => n(o)
      },
      o
    )) })
  ] });
}
function Ka() {
  const { inputDevices: t, selectedInputDevice: e, setSelectedInputDevice: n } = it(), { t: r } = rt();
  return /* @__PURE__ */ u(
    Za,
    {
      devices: t,
      selectedDevice: e,
      setSelectedDevice: n,
      header: r("devices.mic")
    }
  );
}
const d2 = "data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%20%3e%3cpath%20d='M3.33335%206L8.00002%2010L12.6667%206'%20stroke='white'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3c/svg%3e", u2 = ({ down: t = !1, onClick: e }) => /* @__PURE__ */ u(
  "button",
  {
    className: "didagent__chevron__button",
    onClick: e,
    role: "button",
    "aria-label": t ? "Collapse menu" : "Expand menu",
    "aria-expanded": t,
    children: /* @__PURE__ */ u(
      ge,
      {
        size: "24px",
        className: "didagent__light__opacity__hover " + (t ? "didagent__transform__180 " : ""),
        src: d2
      }
    )
  }
), Wa = ({
  down: t = !1,
  open: e = !1,
  onChevronClick: n,
  controller: r,
  children: i,
  className: a = ""
}) => /* @__PURE__ */ u(
  "div",
  {
    className: "didagent__button didagent__button__dark didagent__audio__selector__container didagent__audio__controller__wrapper " + a,
    children: [
      r,
      /* @__PURE__ */ u("div", { className: "didagent__buttton__vertical__divider" }),
      /* @__PURE__ */ u(u2, { down: t, onClick: n }),
      e && i
    ]
  }
), h2 = ({ children: t }) => {
  const [e, n] = A(!1), r = kn(() => n(!1), e), i = Z(() => n(!e), [e]);
  return /* @__PURE__ */ u(
    Wa,
    {
      className: "didagent__button__extended__controller didagent__mic__selector__container didagent__button__dark",
      controller: t,
      down: e,
      open: e,
      onChevronClick: i,
      children: /* @__PURE__ */ u(
        "div",
        {
          className: "didagent__audio__dropdown__container didagent__audio__mic__dropdown__wrapper",
          role: "listbox",
          "aria-label": "Select microphone",
          ref: r,
          children: /* @__PURE__ */ u("div", { className: "didagent__audio__list__wrapper", children: /* @__PURE__ */ u(Ka, {}) })
        }
      )
    }
  );
}, f2 = ({ size: t = "24px", color: e = "#010101" }) => /* @__PURE__ */ u(ge, { size: t, color: e, src: i2 }), Ln = ({ size: t = "24px", color: e = "#fff" }) => /* @__PURE__ */ u(ge, { size: t, color: e, src: a2 }), Si = ({ warning: t, isController: e, classNames: n, muted: r, Icon: i, onClick: a, testId: o = "" }) => /* @__PURE__ */ u(
  Ha,
  {
    enabled: !!(e && t),
    content: "Microphone access is blocked. Please enable microphone permissions in your browser settings",
    children: /* @__PURE__ */ u(
      "button",
      {
        className: n,
        role: "button",
        "data-active": r,
        onClick: a,
        "data-testid": o,
        "aria-label": r || t ? "Unmute microphone" : "Mute microphone",
        "aria-pressed": r,
        children: [
          t && e && /* @__PURE__ */ u("span", { className: "didagent__button__badge", children: "!" }),
          /* @__PURE__ */ u(i, { color: e ? r ? "#010101" : "#fff" : "#5C5C5C" })
        ]
      }
    )
  }
);
function Ga({ isController: t, setPermissionHelper: e, testId: n = "" }) {
  const { isSmallScreen: r } = Ae(), { handleMicMute: i, micMuted: a, permissionGranted: o, permissionAsked: s, inputDevices: l } = it(), c = !o && s, d = a || c ? f2 : Ln, h = Z(() => {
    !o && t ? e(!0) : i();
  }, [o, e, i, t]), p = (l == null ? void 0 : l.length) > 1, f = !(r || !t || c || !p), _ = [
    t ? "didagent__button " + (f ? "didagent__button__nested__controller didagent__button__nested__big" : "didagent__button__controller") : "didagent__chat__button",
    c && t ? "didagent__button__warning" : ""
  ].filter(Boolean).join(" ");
  return f ? /* @__PURE__ */ u(h2, { children: /* @__PURE__ */ u(
    Si,
    {
      warning: c,
      Icon: d,
      isController: t,
      onClick: h,
      classNames: _,
      muted: a,
      testId: n
    }
  ) }) : /* @__PURE__ */ u(
    Si,
    {
      warning: c,
      Icon: d,
      isController: t,
      onClick: h,
      classNames: (!a && !c && t ? "didagent__button__dark " : "") + _,
      muted: a || c,
      testId: n
    }
  );
}
const qa = "data:image/svg+xml,%3csvg%20version='1.1'%20id='L9'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20viewBox='0%200%20100%20100'%20enable-background='new%200%200%200%200'%20xml:space='preserve'%3e%3cpath%20fill='%23fff'%20d='M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50%20M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50'%3e%3c/path%3e%3c/svg%3e", g2 = "data:image/svg+xml,%3csvg%20viewBox='0%200%2032%2032'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16%2024L16%208M16%208L22%2014M16%208L10%2014'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e", p2 = "data:image/svg+xml,%3csvg%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M13.3333%2019.9997C13.3333%2016.857%2013.3333%2015.2856%2014.3096%2014.3093C15.2859%2013.333%2016.8572%2013.333%2019.9999%2013.333C23.1426%2013.333%2024.714%2013.333%2025.6903%2014.3093C26.6666%2015.2856%2026.6666%2016.857%2026.6666%2019.9997C26.6666%2023.1424%2026.6666%2024.7137%2025.6903%2025.69C24.714%2026.6663%2023.1426%2026.6663%2019.9999%2026.6663C16.8572%2026.6663%2015.2859%2026.6663%2014.3096%2025.69C13.3333%2024.7137%2013.3333%2023.1424%2013.3333%2019.9997Z'%20fill='white'/%3e%3c/svg%3e", m2 = () => /* @__PURE__ */ u(ge, { src: g2, size: "32px", color: "white" }), _2 = () => /* @__PURE__ */ u(ge, { src: p2, size: "32px", color: "white" });
function v2({ onSend: t, disabled: e, className: n, connectionState: r, canInterrupt: i }) {
  const { isAuthenticated: a } = ce(rn), { agentActivityState: o, interrupt: s, interruptLoading: l } = ye(), { configurations: c } = ce(ke), g = i && c.enableInterruptOption.includes(Ct.Click);
  return a && r === B.Connecting || l ? /* @__PURE__ */ u(
    "button",
    {
      className: "didagaent__send__button didagaent__send__button__loader " + n,
      role: "button",
      disabled: !0,
      "data-testid": "send_loader",
      "aria-label": "Sending message",
      children: /* @__PURE__ */ u(ge, { src: qa, size: "24px", color: "white" })
    }
  ) : g && o !== je.Idle ? /* @__PURE__ */ u(
    "button",
    {
      className: ["didagaent__send__button", n].filter(Boolean).join(" "),
      role: "button",
      onClick: () => s({ type: "click" }),
      "data-testid": "stop_text",
      "aria-label": "Stop message",
      children: /* @__PURE__ */ u(_2, {})
    }
  ) : /* @__PURE__ */ u(
    "button",
    {
      className: ["didagaent__send__button", n].filter(Boolean).join(" "),
      role: "button",
      onClick: t,
      disabled: e,
      "data-testid": "send_text",
      "aria-label": "Send message",
      children: /* @__PURE__ */ u(m2, {})
    }
  );
}
const Ya = "data:image/svg+xml,%3csvg%20version='1.1'%20id='L5'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20viewBox='0%200%2052%2042'%20enable-background='new%200%200%200%200'%20xml:space='preserve'%3e%3ccircle%20fill='%23fff'%20stroke='none'%20cx='6'%20cy='21'%20r='6'%3e%3canimateTransform%20attributeName='transform'%20dur='1s'%20type='translate'%20values='0%2015%20;%200%20-15;%200%2015'%20repeatCount='indefinite'%20begin='0.1'/%3e%3c/circle%3e%3ccircle%20fill='%23fff'%20stroke='none'%20cx='25'%20cy='21'%20r='6'%3e%3canimateTransform%20attributeName='transform'%20dur='1s'%20type='translate'%20values='0%2010%20;%200%20-10;%200%2010'%20repeatCount='indefinite'%20begin='0.2'/%3e%3c/circle%3e%3ccircle%20fill='%23fff'%20stroke='none'%20cx='44'%20cy='21'%20r='6'%3e%3canimateTransform%20attributeName='transform'%20dur='1s'%20type='translate'%20values='0%205%20;%200%20-5;%200%205'%20repeatCount='indefinite'%20begin='0.3'/%3e%3c/circle%3e%3c/svg%3e", y2 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgZmlsbD0ibm9uZSI+CiAgICA8cGF0aAogICAgICAgIGZpbGw9J2N1cnJlbnRjb2xvcicKICAgICAgICBkPSJtMTEuOTg2IDcuMS0uNDEtLjA3MS40MS4wN1ptLS4zOTIgMi4yNjYtLjQxLS4wNy40MS4wN1ptLTcuNDA2IDIuMzQtLjQxNS4wMzYuNDE1LS4wMzZabS0uNDUyLTUuMjE4LjQxNi0uMDM2LS40MTYuMDM2Wm00LjM3Mi0zLjI1Ny40MTEuMDY3LS40MS0uMDY3Wk03Ljc0IDUuNDc4bC40MTEuMDY3LS40MS0uMDY3Wm0tMy42ODUuMjI5LS4yNzItLjMxNi4yNzIuMzE2Wm0uNzk5LS42OS4yNzIuMzE3LS4yNzItLjMxNlptMS4zMjMtMi4wMy0uNDA0LS4xMDQuNDA0LjEwNVpNNi40NCAxLjk3bC40MDMuMTA1LS40MDMtLjEwNVptLjkzLS40OTItLjEyOC4zOTcuMTI4LS4zOTdabS4wOC4wMjYuMTI4LS4zOTctLjEyOC4zOTdaTTUuODEyIDMuOTIxbC4zNjguMTk2LS4zNjgtLjE5NlptMi4yNDYtMS43ODctLjQwMy4xMDUuNDAzLS4xMDVaTTYuODIgMS41MTVsLS4xOC0uMzc1LjE4LjM3NVptLTQuMjggMTAuNzQzLS40MTQuMDM2LjQxNS0uMDM2Wk0yIDYuMDE2bC40MTUtLjAzNmEuNDE3LjQxNyAwIDAgMC0uODMyLjAzNkgyWm05LjU3NiAxLjAxMy0uMzkyIDIuMjY2LjgyLjE0Mi4zOTMtMi4yNjYtLjgyMS0uMTQyWm0tMy44ODQgNS4xMDdINS4xMDl2LjgzM2gyLjU4M3YtLjgzM1ptLTMuMDktLjQ2NS0uNDUtNS4yMTktLjgzLjA3Mi40NSA1LjIxOC44My0uMDcxWm02LjU4Mi0yLjM3NmMtLjI4MiAxLjYyOS0xLjc1IDIuODQtMy40OTIgMi44NHYuODM0YzIuMTI1IDAgMy45NTgtMS40ODMgNC4zMTMtMy41MzJsLS44MjEtLjE0MlpNNy42OTcgMy4xNjQgNy4zMyA1LjQxbC44MjIuMTM0LjM2OC0yLjI0Ny0uODIyLS4xMzRabS0zLjM3IDIuODU4Ljc5OS0uNjg4LS41NDQtLjYzMi0uOC42ODkuNTQ1LjYzMVptMi4yNTMtMi45My4yNjQtMS4wMTgtLjgwNi0uMjEtLjI2NSAxLjAyLjgwNy4yMDlabS42NjMtMS4yMTguMDgxLjAyNi4yNTUtLjc5NC0uMDgtLjAyNi0uMjU2Ljc5NFpNNi4xOCA0LjExN2MuMTczLS4zMjUuMzA4LS42NjguNC0xLjAyNGwtLjgwNy0uMjFhMy44MjEgMy44MjEgMCAwIDEtLjMyOC44NDFsLjczNS4zOTNaTTcuMzI0IDEuOWMuMTcuMDU0LjI5MS4xODYuMzMuMzRsLjgwNy0uMjFhMS4zMjUgMS4zMjUgMCAwIDAtLjg4Mi0uOTI0bC0uMjU1Ljc5NFptLS40OC4xNzRBLjI4Ni4yODYgMCAwIDEgNyAxLjg5bC0uMzYyLS43NWExLjExOSAxLjExOSAwIDAgMC0uNi43MjVsLjgwNi4yMDlaTTcgMS44OWEuMzMxLjMzMSAwIDAgMSAuMjQzLS4wMTZsLjI1NS0uNzk0YTEuMTY0IDEuMTY0IDAgMCAwLS44Ni4wNkw3IDEuODlabTEuMTk2IDQuNTQzaDIuODc5di0uODM0SDguMTk2di44MzRabS01LjI0MSA1Ljc5LS41NC02LjI0My0uODMuMDcyLjU0IDYuMjQyLjgzLS4wNzFabS0uNTM4LjA1OVY2LjAxNmgtLjgzNHY2LjI2NmguODM0Wm0tLjI5Mi4wMTJhLjE0Ni4xNDYgMCAwIDEgLjE0NS0uMTU4di44MzNjLjQwNCAwIC43Mi0uMzQ1LjY4NS0uNzQ2bC0uODMuMDcxWm02LjM5NC04Ljk5NmMuMDctLjQyMi4wNS0uODU0LS4wNTgtMS4yNjhsLS44MDYuMjFjLjA3OC4zMDEuMDkzLjYxNi4wNDIuOTI0bC44MjIuMTM0Wm0tMy40MSA4LjgzOGEuNTA5LjUwOSAwIDAgMS0uNTA2LS40NjVsLS44My4wNzFjLjA2LjY5NC42NCAxLjIyNyAxLjMzNiAxLjIyN3YtLjgzM1ptLjAxNy02LjgwMmMuMzc4LS4zMjYuNzg1LS43MTMgMS4wNTQtMS4yMTdsLS43MzUtLjM5M2MtLjE5My4zNi0uNS42NjUtLjg2My45NzhsLjU0NC42MzJabTcuMjcgMS44MzdhMS4zNDIgMS4zNDIgMCAwIDAtMS4zMjEtMS41NzJ2LjgzNGMuMzE1IDAgLjU1NS4yODQuNS41OTZsLjgyMi4xNDJaTTIuMjcgMTIuMTM2Yy4wODIgMCAuMTQ3LjA2Ni4xNDcuMTQ2aC0uODM0YzAgLjM3OS4zMDcuNjg3LjY4Ny42ODd2LS44MzNaTTcuMzMgNS40MWEuODguODggMCAwIDAgLjg2NyAxLjAyMnYtLjgzNGEuMDQ2LjA0NiAwIDAgMS0uMDQ1LS4wNTRsLS44MjItLjEzNFpNNC4xNTIgNi40NTJhLjUxLjUxIDAgMCAxIC4xNzUtLjQzbC0uNTQ0LS42MzFhMS4zNDMgMS4zNDMgMCAwIDAtLjQ2MiAxLjEzM2wuODMtLjA3MloiCiAgICAvPgo8L3N2Zz4=";
function w2(t, e, n) {
  return t ? e ? "#CC0037" : "#0D7656" : n ? "#B8B8B8" : "#707070";
}
function Mi({ negative: t, toggled: e, onClick: n, disabled: r, ariaHidden: i }) {
  const a = t === !0, o = w2(e, a, r === !0);
  return /* @__PURE__ */ u(
    "button",
    {
      className: "didagent__thumb__container",
      role: "button",
      "data-active": e,
      style: {
        cursor: r === !0 ? "default" : "pointer",
        transform: a ? "rotate(180deg)" : void 0
      },
      onClick: () => !r && (n == null ? void 0 : n(!e)),
      "aria-label": a ? "Rate negatively" : "Rate positively",
      "aria-pressed": e,
      "aria-hidden": i,
      tabIndex: i ? -1 : 0,
      disabled: r,
      children: /* @__PURE__ */ u(ge, { src: y2, size: "14px", color: o })
    }
  );
}
const C2 = (t, e) => t === "up" ? e === Xe.Positive ? Xe.Unrated : Xe.Positive : e === Xe.Negative ? Xe.Unrated : Xe.Negative;
function b2({ className: t, show: e, onRate: n, message: r, style: i, ariaHidden: a }) {
  const [o, s] = A(Xe.Unrated), [l, c] = A(), [g, d] = A(!1);
  if (!e)
    return null;
  function h(p) {
    return async () => {
      var v;
      const f = C2(p, o);
      s(f), d(!0);
      const _ = await (n == null ? void 0 : n(f, r, l));
      c(_), (v = window.dataLayer) == null || v.push({
        event: "rated_reply",
        rating: f,
        message: r
      });
    };
  }
  return /* @__PURE__ */ u("div", { className: `${t} didagent__rating`, style: i, children: [
    /* @__PURE__ */ u(
      Mi,
      {
        disabled: g,
        toggled: o === Xe.Positive,
        onClick: h("up"),
        ariaHidden: a
      }
    ),
    /* @__PURE__ */ u(
      Mi,
      {
        disabled: g,
        negative: !0,
        toggled: o === Xe.Negative,
        onClick: h("down"),
        ariaHidden: a
      }
    )
  ] });
}
const Yt = /<a\s+href="([^"]*)"[^>]*>([^<]*)<\/a>/g, Ja = /^(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/, S2 = {
  "#general#": 280,
  ".": 620,
  ",": 500,
  "?": 500,
  "!": 500
}, M2 = {
  "#general#": 160,
  ".": 620,
  ",": 500,
  "?": 500,
  "!": 500
};
function Qa(t) {
  const e = t.replace(/["'<>]+/g, "").replace(/[.,!?]+$/, "").replace(/\.$/, "");
  return /^www\./i.test(e) ? "https://" + e : /^https?:\/\//i.test(e) ? e : "https://" + e;
}
function k2(t) {
  return typeof t == "string" ? Ja.test(t) ? /* @__PURE__ */ u("a", { href: Qa(t), target: "_blank", rel: "noreferrer", className: "didagent__message__url", children: t }) : /* @__PURE__ */ u("span", { children: t }) : /* @__PURE__ */ u("a", { href: t.href, target: "_blank", rel: "noreferrer", className: "didagent__message__url", children: t.label });
}
function L2(t, e = !1) {
  const n = e ? M2 : S2;
  return typeof t == "string" && n[t.split("").pop() ?? ""] || n["#general#"];
}
function x2(t) {
  Yt.lastIndex = 0;
  const e = Yt.exec(t);
  if (e)
    return e[1];
  const n = t.split(/\s+/);
  for (const r of n)
    if (Ja.test(r))
      return Qa(r);
  return null;
}
function I2(t) {
  const e = [];
  let n = 0;
  Yt.lastIndex = 0;
  let r;
  for (; (r = Yt.exec(t)) !== null; ) {
    if (r.index > n) {
      const i = t.slice(n, r.index);
      e.push(...i.split(" ").filter((a) => a.length > 0));
    }
    e.push({
      type: "link",
      href: r[1],
      label: r[2]
    }), n = Yt.lastIndex;
  }
  if (n < t.length) {
    const i = t.slice(n);
    e.push(...i.split(" ").filter((a) => a.length > 0));
  }
  return e;
}
function N2({
  text: t,
  role: e,
  onTypingStatusChange: n,
  scrollToBottom: r,
  canFeedback: i,
  interrupted: a,
  shouldWaitForAvatar: o,
  isExpressive: s
}) {
  const [l, c] = A([]), [g, d] = A(0), [h, p] = A([]), f = q(null);
  return E(() => {
    const _ = I2(t);
    p(_.length > 0 ? _ : t.split(" "));
  }, [t]), E(() => {
    a && f.current && (clearTimeout(f.current), n("done", e));
  }, [a, n, e]), E(() => {
    const _ = g > 0;
    if (g < h.length && !a && (!o || _)) {
      const v = h[g], y = L2(v, s), C = k2(v);
      return f.current = setTimeout(() => {
        c((b) => [...b, b.length ? " " : "", C]), d((b) => b + 1), r();
      }, y), () => {
        f.current && clearTimeout(f.current);
      };
    }
  }, [g, h, a, o]), E(() => {
    g === 0 ? n("start", e) : g >= h.length && n("done", e);
  }, [g, h]), e === "user" ? /* @__PURE__ */ u("span", { children: t }) : l.length > 0 ? /* @__PURE__ */ u("span", { className: "appear-animation", children: [
    l,
    a && /* @__PURE__ */ u("span", { children: "..." }),
    i ? "           " : ""
  ] }) : /* @__PURE__ */ u("span", { className: "didagent__empty__message" });
}
const E2 = "#b8b8b8", A2 = vr(
  ({ messages: t, isLoading: e, onRate: n, scrollToBottom: r, onScroll: i, isTextual: a }, o) => {
    var f;
    const [s, l] = A(!1), { isChatOpen: c } = Ae(), { agentActivityState: g, agent: d } = ye(), h = ((f = d == null ? void 0 : d.presenter) == null ? void 0 : f.type) === "expressive";
    E(() => {
      c && r();
    }, [c]);
    const p = Z(
      (_, v) => {
        l(_ === "start" ? !1 : v === "assistant");
      },
      [l]
    );
    return /* @__PURE__ */ u("div", { className: "didagent__messages__wrapper", ref: o, "data-testid": "didagent_messages", onScroll: i, children: [
      t.filter(({ content: _ }) => !!_).map((_, v) => {
        const y = _.role === "user" && new Date(_.created_at || /* @__PURE__ */ new Date()).getTime() > Date.now() - 750, C = [
          "didagent__message__container",
          `didagent__message__container__${_.role}`,
          y ? "didagent__delayed__fade" : ""
        ].join(" "), b = v === t.length - 1, w = _.role === "assistant" && b, N = w && g !== je.Talking && !a;
        return e && w ? null : /* @__PURE__ */ u(
          "div",
          {
            className: C,
            role: "article",
            "aria-label": `${_.role === "user" ? "Your message" : "Agent response"}`,
            children: /* @__PURE__ */ u("pre", { className: `didagent__message didagent__message__${_.role}`, children: [
              /* @__PURE__ */ u(
                N2,
                {
                  text: _.content,
                  role: _.role,
                  onTypingStatusChange: p,
                  scrollToBottom: r,
                  canFeedback: b,
                  interrupted: _.interrupted,
                  shouldWaitForAvatar: N,
                  isExpressive: h
                },
                _.id
              ),
              v > 0 && _.role === "assistant" && /* @__PURE__ */ u(
                b2,
                {
                  className: "didagent__message__rating",
                  message: _,
                  show: s,
                  onRate: n,
                  style: { display: b ? "flex" : void 0 },
                  ariaHidden: !c
                }
              )
            ] })
          },
          _.id
        );
      }),
      /* @__PURE__ */ u(
        "div",
        {
          className: [
            "didagent__message__container",
            "didagent__message__container__assistant",
            "didagent__message__container_loader",
            e ? "didagent__message__container__assistant__loading" : ""
          ].join(" "),
          "data-testid": e ? "didagent_message_loader_loading" : "didagent_message_loader_done",
          role: "article",
          "aria-label": "Agent is thinking",
          children: /* @__PURE__ */ u("pre", { className: "didagent__message didagent__message__assistant didagent__message__assistant__loader", children: /* @__PURE__ */ u(ge, { src: Ya, color: E2, size: "22px" }) })
        }
      )
    ] });
  }
), ki = ({
  enabled: t,
  text: e,
  setText: n,
  onSend: r,
  messageRef: i,
  textRef: a,
  isTextual: o,
  isActualLoading: s,
  scrollToBottom: l,
  setPermissionHelper: c,
  disableSend: g,
  canInterrupt: d,
  isHistoryMode: h
}) => {
  var Q, V;
  const [p, f] = A(!1), [_, v] = A(0), y = q(!0), { configurations: C } = ce(ke), { connectionState: b, agent: w, messages: N, rate: j, reconnect: z, agentActivityState: I, interrupt: x } = ye(), { chatPosition: m, isHorizontal: S, isChatOpen: M, setIsChatOpen: k, isSmallScreen: T } = Ae(), { t: D } = rt(), F = d && C.enableInterruptOption.includes(Ct.Text), K = (g || e.trim().length === 0) && !h;
  async function ee(L, $, X) {
    if (!w)
      throw new Error("AgentManager is not available");
    return j($.id, L === Xe.Positive ? 1 : -1, X).then((oe) => oe.id).catch((oe) => {
      throw console.error("Error in rating", oe), new Error("Error in rating " + oe.message);
    });
  }
  const re = Me(
    () => {
      var L, $;
      return t && !!(($ = (L = w == null ? void 0 : w.knowledge) == null ? void 0 : L.embedder) != null && $.is_limited_language);
    },
    [t, w]
  ), Y = D(h ? "actions.resume" : "inputs.msgPh");
  return /* @__PURE__ */ u(
    "div",
    {
      className: "didagent__messages__container",
      role: "region",
      "aria-label": "Chat conversation",
      "data-chat": m,
      "data-chatmode": C.chatMode,
      "data-orientation": S ? "horizontal" : "vertical",
      children: [
        m !== "closed-bottom" && m !== "closed-side" && /* @__PURE__ */ u("div", { className: "didagent__messages__header", children: [
          m === "bottom" && /* @__PURE__ */ u(Ga, { setPermissionHelper: c, testId: "mic_on_off" }),
          /* @__PURE__ */ u("span", { className: "didagent__messages__header__title", children: D("navigation.chat") }),
          (T || !S) && /* @__PURE__ */ u(r2, { onClick: () => k(!1) })
        ] }),
        /* @__PURE__ */ u(
          "div",
          {
            className: "didagent__messages__scrollable",
            role: "log",
            "aria-label": "Chat messages",
            "aria-hidden": !M,
            tabIndex: M ? 0 : -1,
            "aria-live": "polite",
            onMouseDown: (L) => L.stopPropagation(),
            onTouchStart: (L) => L.stopPropagation(),
            ref: i,
            onScroll: () => {
              i != null && i.current && (y.current = i.current.scrollHeight - i.current.scrollTop <= i.current.clientHeight + 20);
            },
            children: [
              /* @__PURE__ */ u(
                A2,
                {
                  messages: N,
                  isLoading: s,
                  onRate: ee,
                  scrollToBottom: l,
                  isTextual: o
                }
              ),
              /* @__PURE__ */ u(
                n2,
                {
                  display: re,
                  content: `This agent only interacts in ${(V = (Q = w == null ? void 0 : w.presenter) == null ? void 0 : Q.voice) == null ? void 0 : V.language}`
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ u("div", { className: "didagent__messages__footer", children: M && /* @__PURE__ */ u(
          "div",
          {
            className: "didagent__main__input",
            style: {
              height: _ > 1 ? "44px" : "26px",
              "--focus": p ? "white" : void 0
            },
            children: [
              /* @__PURE__ */ u(
                "textarea",
                {
                  autoFocus: !0,
                  onMouseDown: (L) => L.stopPropagation(),
                  onTouchStart: (L) => L.stopPropagation(),
                  disabled: [R.Maintenance, R.DirectPlayback].includes(C.chatMode) || C.loaderConfig.show,
                  ref: a,
                  placeholder: Y,
                  value: e,
                  maxLength: 790,
                  "aria-label": Y,
                  "data-testid": "message_input",
                  onFocus: () => f(!0),
                  onBlur: () => f(!1),
                  onInput: (L) => {
                    v(Hl(L.currentTarget)), n(L.currentTarget.value), !h && !o && Cr.includes(b) && z();
                  },
                  onKeyPress: async (L) => {
                    if (!L.shiftKey && L.key === "Enter") {
                      if (L.preventDefault(), K)
                        return;
                      F && I === je.Talking && x({ type: "text" }), r(e);
                    }
                  }
                }
              ),
              /* @__PURE__ */ u(
                v2,
                {
                  connectionState: b,
                  onSend: () => r(e),
                  disabled: K,
                  className: "didagent__main__input-send",
                  canInterrupt: d
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}, T2 = (t) => {
  t.style.display = "none", t.offsetHeight, t.offsetWidth, t.style.display = "";
};
function D2({ idleVideo: t, isBlur: e, muted: n, onIdleLoad: r, isStreamConnecting: i, enabled: a = !0 }) {
  const { configurations: o } = ce(ke), { connectionState: s, streamState: l, streamType: c, srcObject: g } = ye(), { trackUi: d } = Mt(), h = q(null), p = q(null), { selectedOutputDevice: f } = it(), { chatPosition: _, isHorizontal: v } = Ae(), [y, C] = A(!1), b = Wl(), w = c !== ze.Legacy || y, N = (c === ze.Fluent ? !i : l === Re.Streaming) && w && s === B.Connected;
  return E(() => {
    g && p.current && (C(!1), p.current.srcObject = g);
  }, [g, p.current]), E(() => {
    var j;
    p.current && (d("agent-stream-state-change", {
      streamState: Re[l],
      connectionState: s,
      muted: n,
      "stream-type": c
    }), N ? (b && Gl() && (p.current.volume = 1), (j = p.current) != null && j.paused && p.current.play()) : (h.current && (h.current.currentTime = 0), setTimeout(() => {
      p.current && T2(p.current);
    }, 500)));
  }, [N]), E(() => {
    s === B.Connected && C(!0);
  }, [s]), E(() => {
    var j, z;
    p.current && f && "setSinkId" in p.current && typeof p.current.setSinkId == "function" && ((z = (j = p == null ? void 0 : p.current) == null ? void 0 : j.setSinkId) == null || z.call(j, f).catch((I) => {
      console.error("Error setting audio output device:", f, I);
    }));
  }, [f, l]), /* @__PURE__ */ u(
    "div",
    {
      className: "didagent__embedded__video__container",
      "data-orientation": v ? "horizontal" : "vertical",
      "data-chatmode": o.chatMode,
      "data-chat": _,
      "data-blur": e,
      children: [
        /* @__PURE__ */ u(
          "video",
          {
            className: "didagent__embedded__video__idle",
            "data-testid": "didagent__video_idle",
            "aria-label": "Agent idle video",
            onLoadedData: r,
            poster: a ? o.posterSrc : void 0,
            src: t,
            playsInline: !0,
            autoPlay: !0,
            muted: !0,
            ref: h,
            loop: !0
          }
        ),
        /* @__PURE__ */ u(
          "video",
          {
            className: "didagent__embedded__video__stream",
            "data-testid": "didagent__video_stream",
            "aria-label": "Agent video stream",
            "data-active": N,
            muted: n || !w,
            onPause: (j) => {
              j.currentTarget.play();
            },
            ref: p,
            autoPlay: !0,
            playsInline: !0
          }
        )
      ]
    }
  );
}
function Xa(t, e, n) {
  const [r, i] = A(!1);
  return E(() => {
    t === B.Connecting ? i(!0) : e || n ? i(!1) : [B.Connected, B.Connecting].includes(t) || i(!1);
  }, [t, e, n]), {
    isStreamConnecting: r,
    setIsStreamConnecting: i
  };
}
function O2({
  loaderStyle: t,
  idleVideo: e,
  isMaintenanceMode: n,
  onIdleLoad: r
}) {
  const { speakerMuted: i } = it(), { configurations: a } = ce(ke), { connectionState: o, fluentStarted: s, legacyStarted: l } = ye(), { isStreamConnecting: c } = Xa(o, s, l);
  return /* @__PURE__ */ u(xe, { children: [
    /* @__PURE__ */ u("div", { className: "didagent__embedded__container__loading", style: t, children: [
      /* @__PURE__ */ u(
        ge,
        {
          src: qa,
          size: "64px",
          color: "var(--did-secondary-60)",
          className: "didagent__embedded__loader"
        }
      ),
      /* @__PURE__ */ u("span", { children: a.loaderConfig.text || "" })
    ] }),
    a.posterSrc && /* @__PURE__ */ u("img", { className: "didagent__background", src: a.posterSrc, alt: "" }),
    /* @__PURE__ */ u(
      D2,
      {
        idleVideo: e,
        muted: i,
        isBlur: n,
        onIdleLoad: r,
        isStreamConnecting: c
      }
    )
  ] });
}
const P2 = ({ hideAgentTitle: t, agentIcon: e, agentName: n }) => {
  const { configurations: r } = ce(ke), { chatPosition: i } = Ae();
  return t || !r.showAgentName || i === "bottom" ? null : /* @__PURE__ */ u(
    "div",
    {
      "data-testid": "didagent__header__name",
      className: `didagent__header__name ${e ? "" : "didagent__header-bg"}`,
      children: e ? /* @__PURE__ */ u("img", { src: e, alt: "Agent Logo" }) : n
    }
  );
}, eo = ({ size: t = "80px", color: e = "#fff" }) => /* @__PURE__ */ u("div", { className: "didagent__loader", style: { "--loader-size": t, "--loader-color": e }, children: /* @__PURE__ */ u("svg", { viewBox: "0 0 100 100", className: "didagent__svg", children: /* @__PURE__ */ u("circle", { className: "didagent__arc", cx: "50", cy: "50", r: "40" }) }) }), kt = ({
  children: t,
  backdrop: e = !1,
  delayed: n = !1,
  bgBlur: r = !1,
  blur: i = !1,
  ariaLabel: a,
  className: o = ""
}) => {
  const s = [
    "didagent__intro",
    e ? "didagent__intro__backdrop" : "",
    r ? "didagent__intro__bgblur" : "",
    n ? "didagent__delayed__fade" : "",
    i ? "didagent__intro__blur" : "",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ u("div", { "aria-label": a, className: s, role: "dialog", "aria-modal": "true", children: t });
}, R2 = () => {
  const { configurations: t } = ce(ke), e = t.mode === "fabio", { t: n } = rt();
  return /* @__PURE__ */ u(
    kt,
    {
      bgBlur: !0,
      ariaLabel: "Connecting overlay",
      className: e ? "" : "didagent__connecting__overlay",
      children: /* @__PURE__ */ u("div", { className: "didagent__intro__content", children: [
        /* @__PURE__ */ u(eo, { size: "60px", color: "#fff" }),
        /* @__PURE__ */ u("span", { className: "didagent__connecting__text", "data-testid": "didagent__connecting__text", children: n("connectionStatus.connecting") })
      ] })
    }
  );
}, j2 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%3e%3cpath%20d='M13.0867%2021.3877L13.7321%2021.7697L13.0867%2021.3877ZM13.6288%2020.4718L12.9833%2020.0898L13.6288%2020.4718ZM10.3712%2020.4718L9.72579%2020.8539H9.72579L10.3712%2020.4718ZM10.9133%2021.3877L11.5587%2021.0057L10.9133%2021.3877ZM2.3806%2015.9134L3.07351%2015.6264V15.6264L2.3806%2015.9134ZM7.78958%2018.9915L7.77666%2019.7413L7.78958%2018.9915ZM5.08658%2018.6194L4.79957%2019.3123H4.79957L5.08658%2018.6194ZM21.6194%2015.9134L22.3123%2016.2004V16.2004L21.6194%2015.9134ZM16.2104%2018.9915L16.1975%2018.2416L16.2104%2018.9915ZM18.9134%2018.6194L19.2004%2019.3123H19.2004L18.9134%2018.6194ZM19.6125%202.7368L19.2206%203.37628L19.6125%202.7368ZM21.2632%204.38751L21.9027%203.99563V3.99563L21.2632%204.38751ZM4.38751%202.7368L3.99563%202.09732V2.09732L4.38751%202.7368ZM2.7368%204.38751L2.09732%203.99563H2.09732L2.7368%204.38751ZM9.40279%2019.2098L9.77986%2018.5615L9.77986%2018.5615L9.40279%2019.2098ZM13.7321%2021.7697L14.2742%2020.8539L12.9833%2020.0898L12.4412%2021.0057L13.7321%2021.7697ZM9.72579%2020.8539L10.2679%2021.7697L11.5587%2021.0057L11.0166%2020.0898L9.72579%2020.8539ZM12.4412%2021.0057C12.2485%2021.3313%2011.7515%2021.3313%2011.5587%2021.0057L10.2679%2021.7697C11.0415%2023.0767%2012.9585%2023.0767%2013.7321%2021.7697L12.4412%2021.0057ZM10.5%202.75L13.5%202.75V1.25L10.5%201.25V2.75ZM21.25%2010.5V11.5H22.75V10.5H21.25ZM2.75%2011.5V10.5H1.25L1.25%2011.5H2.75ZM1.25%2011.5C1.25%2012.6546%201.24959%2013.5581%201.29931%2014.2868C1.3495%2015.0223%201.45323%2015.6344%201.68769%2016.2004L3.07351%2015.6264C2.92737%2015.2736%202.84081%2014.8438%202.79584%2014.1847C2.75041%2013.5189%202.75%2012.6751%202.75%2011.5H1.25ZM7.8025%2018.2416C6.54706%2018.2199%205.88923%2018.1401%205.37359%2017.9265L4.79957%2019.3123C5.60454%2019.6457%206.52138%2019.7197%207.77666%2019.7413L7.8025%2018.2416ZM1.68769%2016.2004C2.27128%2017.6093%203.39066%2018.7287%204.79957%2019.3123L5.3736%2017.9265C4.33223%2017.4951%203.50486%2016.6678%203.07351%2015.6264L1.68769%2016.2004ZM21.25%2011.5C21.25%2012.6751%2021.2496%2013.5189%2021.2042%2014.1847C21.1592%2014.8438%2021.0726%2015.2736%2020.9265%2015.6264L22.3123%2016.2004C22.5468%2015.6344%2022.6505%2015.0223%2022.7007%2014.2868C22.7504%2013.5581%2022.75%2012.6546%2022.75%2011.5H21.25ZM16.2233%2019.7413C17.4786%2019.7197%2018.3955%2019.6457%2019.2004%2019.3123L18.6264%2017.9265C18.1108%2018.1401%2017.4529%2018.2199%2016.1975%2018.2416L16.2233%2019.7413ZM20.9265%2015.6264C20.4951%2016.6678%2019.6678%2017.4951%2018.6264%2017.9265L19.2004%2019.3123C20.6093%2018.7287%2021.7287%2017.6093%2022.3123%2016.2004L20.9265%2015.6264ZM13.5%202.75C15.1512%202.75%2016.337%202.75079%2017.2619%202.83873C18.1757%202.92561%2018.7571%203.09223%2019.2206%203.37628L20.0044%202.09732C19.2655%201.64457%2018.4274%201.44279%2017.4039%201.34547C16.3915%201.24921%2015.1222%201.25%2013.5%201.25V2.75ZM22.75%2010.5C22.75%208.87781%2022.7508%207.6085%2022.6545%206.59611C22.5572%205.57256%2022.3554%204.73445%2021.9027%203.99563L20.6237%204.77938C20.9078%205.24291%2021.0744%205.82434%2021.1613%206.73809C21.2492%207.663%2021.25%208.84876%2021.25%2010.5H22.75ZM19.2206%203.37628C19.7925%203.72672%2020.2733%204.20752%2020.6237%204.77938L21.9027%203.99563C21.4286%203.22194%2020.7781%202.57144%2020.0044%202.09732L19.2206%203.37628ZM10.5%201.25C8.87781%201.25%207.6085%201.24921%206.59611%201.34547C5.57256%201.44279%204.73445%201.64457%203.99563%202.09732L4.77938%203.37628C5.24291%203.09223%205.82434%202.92561%206.73809%202.83873C7.663%202.75079%208.84876%202.75%2010.5%202.75V1.25ZM2.75%2010.5C2.75%208.84876%202.75079%207.663%202.83873%206.73809C2.92561%205.82434%203.09223%205.24291%203.37628%204.77938L2.09732%203.99563C1.64457%204.73445%201.44279%205.57256%201.34547%206.59611C1.24921%207.6085%201.25%208.87781%201.25%2010.5H2.75ZM3.99563%202.09732C3.22194%202.57144%202.57144%203.22194%202.09732%203.99563L3.37628%204.77938C3.72672%204.20752%204.20752%203.72672%204.77938%203.37628L3.99563%202.09732ZM11.0166%2020.0898C10.8136%2019.7468%2010.6354%2019.4441%2010.4621%2019.2063C10.2795%2018.9559%2010.0702%2018.7304%209.77986%2018.5615L9.02572%2019.8582C9.07313%2019.8857%209.13772%2019.936%209.24985%2020.0898C9.37122%2020.2564%209.50835%2020.4865%209.72579%2020.8539L11.0166%2020.0898ZM7.77666%2019.7413C8.21575%2019.7489%208.49387%2019.7545%208.70588%2019.7779C8.90399%2019.7999%208.98078%2019.832%209.02572%2019.8582L9.77986%2018.5615C9.4871%2018.3912%209.18246%2018.3215%208.87097%2018.287C8.57339%2018.2541%208.21375%2018.2487%207.8025%2018.2416L7.77666%2019.7413ZM14.2742%2020.8539C14.4916%2020.4865%2014.6287%2020.2564%2014.7501%2020.0898C14.8622%2019.936%2014.9268%2019.8857%2014.9742%2019.8582L14.2201%2018.5615C13.9298%2018.7304%2013.7204%2018.9559%2013.5379%2019.2063C13.3646%2019.4441%2013.1864%2019.7468%2012.9833%2020.0898L14.2742%2020.8539ZM16.1975%2018.2416C15.7862%2018.2487%2015.4266%2018.2541%2015.129%2018.287C14.8175%2018.3215%2014.5129%2018.3912%2014.2201%2018.5615L14.9742%2019.8582C15.0192%2019.832%2015.096%2019.7999%2015.2941%2019.7779C15.5061%2019.7545%2015.7842%2019.7489%2016.2233%2019.7413L16.1975%2018.2416Z'%20fill='white'/%3e%3cpath%20d='M8%209L16%209'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3cpath%20d='M8%2012.5H13.5'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3c/svg%3e", to = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M18.1967%203C18.6%203%2018.927%203.32696%2018.927%203.73029V7.86141C18.927%208.26474%2018.6%208.5917%2018.1967%208.5917H14.0656C13.6622%208.5917%2013.3353%208.26474%2013.3353%207.86141C13.3353%207.45809%2013.6622%207.13113%2014.0656%207.13113H16.3639C13.5933%204.94701%209.56445%205.13306%207.00822%207.68928C4.25133%2010.4462%204.25133%2014.916%207.00822%2017.6728C9.7651%2020.4297%2014.2349%2020.4297%2016.9918%2017.6728C18.5947%2016.0699%2019.2661%2013.8886%2019.0044%2011.7986C18.9543%2011.3984%2019.2381%2011.0333%2019.6383%2010.9832C20.0385%2010.9331%2020.4036%2011.2169%2020.4537%2011.6171C20.769%2014.1352%2019.9598%2016.7704%2018.0246%2018.7056C14.6973%2022.0329%209.30271%2022.0329%205.97544%2018.7056C2.64816%2015.3783%202.64816%209.98378%205.97544%206.6565C9.1225%203.50944%2014.119%203.33899%2017.4664%206.14516V3.73029C17.4664%203.32696%2017.7934%203%2018.1967%203Z'%20fill='white'%20/%3e%3c/svg%3e", z2 = ({ reconnect: t }) => {
  const { isSmallScreen: e, isChatOpen: n, setIsChatOpen: r } = Ae(), { triggersAvailable: i, restart: a } = ye(), { trackUi: o } = Mt(), { t: s } = rt();
  E(() => {
    i && n && r(!1);
  }, [i, n, r]);
  const l = () => {
    o("agent-reconnect", {
      event: "click",
      action: i ? "new-chat" : "reconnect"
    }), i ? a() : t();
  }, c = s(i ? "actions.newConversation" : "actions.reconnect");
  return /* @__PURE__ */ u(kt, { backdrop: !0, bgBlur: !0, delayed: !0, ariaLabel: "Reconnect overlay", children: /* @__PURE__ */ u("div", { className: `didagent__intro__content didagent__intro__content__reconnect ${e ? "didagent__intro__content__reconnect__mobile" : ""}`, children: [
    /* @__PURE__ */ u("h2", { children: s("prompts.stillHere") }),
    /* @__PURE__ */ u(
      "button",
      {
        onClick: l,
        className: "didagent__intro__button didagent__intro__button__primary",
        children: [
          /* @__PURE__ */ u(ge, { size: "25px", color: "#010101", src: to }),
          /* @__PURE__ */ u("span", { children: c })
        ]
      }
    ),
    !i && /* @__PURE__ */ u(
      "button",
      {
        onClick: () => r((g) => !g),
        className: `didagent__intro__button didagent__intro__button__secondary didagent__intro__button__chat__history ${n ? "didagent__intro__button__chat__history__active" : ""}`,
        children: [
          /* @__PURE__ */ u(ge, { size: "25px", src: j2 }),
          /* @__PURE__ */ u("span", { children: s("navigation.chatHistory") })
        ]
      }
    )
  ] }) });
}, $2 = (t = "25px") => /* @__PURE__ */ u(Ln, { size: t, color: "#010101" }), F2 = ({ startConversation: t, loading: e }) => {
  const { t: n } = rt(), r = q(null), i = () => /* @__PURE__ */ u(eo, { size: "20px", color: "#000" }), a = 130, o = 190;
  return E(() => {
    r.current && r.current.style.setProperty("--button-width", `${e ? a : o}px`);
  }, [e]), /* @__PURE__ */ u(kt, { ariaLabel: "Welcome message", children: [
    /* @__PURE__ */ u("div", { className: "didagent__intro__content" }),
    /* @__PURE__ */ u("div", { className: "didagent__intro__footer", children: /* @__PURE__ */ u(
      "button",
      {
        ref: r,
        onClick: t,
        className: "didagent__intro__button didagent__intro__button__primary didagent__start__conversation__button",
        role: "button",
        "data-testid": "send_record",
        disabled: e,
        children: [
          e ? /* @__PURE__ */ u(i, {}) : $2("20px"),
          /* @__PURE__ */ u("span", { children: n(e ? "connectionStatus.starting" : "actions.start") })
        ]
      }
    ) })
  ] });
}, B2 = "data:image/svg+xml,%3csvg%20width='28'%20height='52'%20viewBox='0%200%2028%2052'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20x='1'%20y='1'%20width='26'%20height='50'%20rx='3'%20stroke='white'%20stroke-width='2'%20/%3e%3cpath%20d='M19.5%2019.9969V22.9969C19.5%2023.1295%2019.4473%2023.2567%2019.3536%2023.3504C19.2598%2023.4442%2019.1326%2023.4969%2019%2023.4969H16C15.8674%2023.4969%2015.7402%2023.4442%2015.6464%2023.3504C15.5527%2023.2567%2015.5%2023.1295%2015.5%2022.9969C15.5%2022.8643%2015.5527%2022.7371%2015.6464%2022.6433C15.7402%2022.5496%2015.8674%2022.4969%2016%2022.4969H17.7931L16.8788%2021.5825C15.9495%2020.649%2014.6878%2020.1223%2013.3706%2020.1181H13.3425C12.0364%2020.1151%2010.7815%2020.6263%209.84938%2021.5412C9.75389%2021.6304%209.62731%2021.6786%209.49672%2021.6756C9.36612%2021.6726%209.24189%2021.6186%209.15059%2021.5252C9.05929%2021.4318%209.00817%2021.3064%209.00818%2021.1757C9.00819%2021.0451%209.05932%2020.9197%209.15063%2020.8262C10.2803%2019.7221%2011.7999%2019.108%2013.3795%2019.1173C14.9592%2019.1265%2016.4714%2019.7583%2017.5881%2020.8756L18.5%2021.79V19.9969C18.5%2019.8643%2018.5527%2019.7371%2018.6464%2019.6433C18.7402%2019.5496%2018.8674%2019.4969%2019%2019.4969C19.1326%2019.4969%2019.2598%2019.5496%2019.3536%2019.6433C19.4473%2019.7371%2019.5%2019.8643%2019.5%2019.9969ZM17.1506%2028.4525C16.2093%2029.372%2014.9434%2029.8834%2013.6275%2029.8756C12.3116%2029.8679%2011.0517%2029.3418%2010.1213%2028.4112L9.20688%2027.4969H11C11.1326%2027.4969%2011.2598%2027.4442%2011.3536%2027.3504C11.4473%2027.2567%2011.5%2027.1295%2011.5%2026.9969C11.5%2026.8643%2011.4473%2026.7371%2011.3536%2026.6433C11.2598%2026.5496%2011.1326%2026.4969%2011%2026.4969H8C7.86739%2026.4969%207.74021%2026.5496%207.64645%2026.6433C7.55268%2026.7371%207.5%2026.8643%207.5%2026.9969L7.5%2029.9969C7.5%2030.1295%207.55268%2030.2567%207.64645%2030.3504C7.74021%2030.4442%207.86739%2030.4969%208%2030.4969C8.13261%2030.4969%208.25979%2030.4442%208.35355%2030.3504C8.44732%2030.2567%208.5%2030.1295%208.5%2029.9969V28.2037L9.41438%2029.1181C10.5295%2030.2389%2012.044%2030.871%2013.625%2030.8756H13.6581C15.2257%2030.8797%2016.7317%2030.266%2017.85%2029.1675C17.9413%2029.0741%2017.9924%2028.9486%2017.9924%2028.818C17.9925%2028.6874%2017.9413%2028.5619%2017.85%2028.4685C17.7587%2028.3751%2017.6345%2028.3211%2017.5039%2028.3181C17.3733%2028.3151%2017.2467%2028.3634%2017.1513%2028.4525H17.1506Z'%20fill='white'%20/%3e%3c/svg%3e", V2 = () => /* @__PURE__ */ u(kt, { backdrop: !0, bgBlur: !0, ariaLabel: "Mobile Landscape Blocked", children: /* @__PURE__ */ u("div", { className: "didagent__intro__content", children: /* @__PURE__ */ u("div", { className: "didagent__mobile__rotate", children: [
  /* @__PURE__ */ u(ge, { src: B2, size: "44px" }),
  /* @__PURE__ */ u("div", { className: "didagent__mobile__rotate__content", children: [
    /* @__PURE__ */ u("div", { className: "didagent__mobile__rotate__title", children: "Rotate your phone" }),
    /* @__PURE__ */ u("div", { className: "didagent__mobile__rotate__description", children: "Switch to portrait mode for an optimal experience" })
  ] })
] }) }) }), U2 = (t = "25px") => /* @__PURE__ */ u(Ln, { size: t, color: "#010101" }), H2 = ({ requestMicrophoneAccess: t }) => {
  const { t: e } = rt();
  return /* @__PURE__ */ u(kt, { backdrop: !0, delayed: !0, ariaLabel: "Permission request", children: [
    /* @__PURE__ */ u("div", { className: "didagent__intro__content didagent__intro__content__top", children: [
      /* @__PURE__ */ u("h2", { children: e("mic.permission.title") }),
      /* @__PURE__ */ u("p", { children: e("mic.permission.description") })
    ] }),
    /* @__PURE__ */ u("div", { className: "didagent__intro__footer", children: /* @__PURE__ */ u(
      "button",
      {
        onClick: t,
        className: "didagent__intro__button didagent__intro__button__primary",
        role: "button",
        children: [
          U2("25px"),
          /* @__PURE__ */ u("span", { children: e("actions.turnMicrophoneOn") })
        ]
      }
    ) })
  ] });
}, Z2 = (t = "25px") => /* @__PURE__ */ u(Ln, { size: t, color: "#010101" }), K2 = ({ requestMicrophoneAccess: t }) => {
  const { t: e } = rt();
  return /* @__PURE__ */ u(kt, { backdrop: !0, delayed: !0, ariaLabel: "Permission request", className: "didagent__vm__permission", children: [
    /* @__PURE__ */ u("h2", { children: e("mic.permission.vmQuestion") }),
    /* @__PURE__ */ u("p", { children: e("mic.permission.vmDescription") }),
    /* @__PURE__ */ u(
      "button",
      {
        onClick: t,
        className: "didagent__intro__button didagent__intro__button__primary didagent__vm__permission__button",
        role: "button",
        children: [
          Z2("25px"),
          /* @__PURE__ */ u("span", { children: e("actions.turnMicrophoneOn") })
        ]
      }
    )
  ] });
}, W2 = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M20%2012H4M4%2012L10%206M4%2012L10%2018'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3c/svg%3e", G2 = "data:image/svg+xml,%3csvg%20width='272'%20height='288'%20viewBox='0%200%20272%20288'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_53680_9844)'%3e%3cmask%20id='path-1-outside-1_53680_9844'%20maskUnits='userSpaceOnUse'%20x='0'%20y='0'%20width='272'%20height='288'%20fill='black'%3e%3crect%20fill='white'%20width='272'%20height='288'%20/%3e%3cpath%20d='M1%2013C1%206.37258%206.37258%201%2013%201H272V288H1V13Z'%20/%3e%3c/mask%3e%3cpath%20d='M1%2013C1%206.37258%206.37258%201%2013%201H272V288H1V13Z'%20fill='%23EBEBEB'%20/%3e%3ccircle%20cx='27'%20cy='21'%20r='6'%20fill='%23FF5E5D'%20/%3e%3ccircle%20cx='27'%20cy='21'%20r='5.75'%20stroke='black'%20stroke-opacity='0.56'%20stroke-width='0.5'%20/%3e%3ccircle%20cx='47'%20cy='21'%20r='6'%20fill='%23FFBC4F'%20/%3e%3ccircle%20cx='47'%20cy='21'%20r='5.75'%20stroke='black'%20stroke-opacity='0.56'%20stroke-width='0.5'%20/%3e%3ccircle%20cx='67'%20cy='21'%20r='6'%20fill='%2322CB58'%20/%3e%3ccircle%20cx='67'%20cy='21'%20r='5.75'%20stroke='black'%20stroke-opacity='0.56'%20stroke-width='0.5'%20/%3e%3crect%20x='1.25'%20y='37.25'%20width='270.5'%20height='0.5'%20stroke='black'%20stroke-width='0.5'%20/%3e%3crect%20x='1.25'%20y='82.25'%20width='270.5'%20height='0.5'%20stroke='black'%20stroke-width='0.5'%20/%3e%3cpath%20d='M41%2060L25%2060M25%2060L31%2054M25%2060L31%2066'%20stroke='%23090604'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3cpath%20d='M57%2060L73%2060M73%2060L67%2066M73%2060L67%2054'%20stroke='%23090604'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3cpath%20d='M109.364%2056.0512L108.657%2055.3441C105.533%2052.2199%20100.467%2052.2199%2097.3431%2055.3441C94.219%2058.4683%2094.219%2063.5336%2097.3431%2066.6578C100.467%2069.782%20105.533%2069.782%20108.657%2066.6578C110.474%2064.841%20111.234%2062.3677%20110.938%2060.0015M109.364%2056.0512H105.121M109.364%2056.0512V51.8086'%20stroke='%23090604'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3crect%20x='126'%20y='48'%20width='187'%20height='27'%20rx='13.5'%20fill='%23CAE6FC'%20/%3e%3cpath%20d='M149.493%2067.204C148.794%2067.204%20148.203%2066.9626%20147.72%2066.4797C147.237%2065.9969%20146.996%2065.4058%20146.996%2064.7065C146.996%2064.0072%20147.237%2063.4161%20147.72%2062.9332C148.203%2062.4504%20148.794%2062.2089%20149.493%2062.2089C150.192%2062.2089%20150.783%2062.4504%20151.266%2062.9332C151.749%2063.4161%20151.991%2064.0072%20151.991%2064.7065C151.991%2065.4058%20151.749%2065.9969%20151.266%2066.4797C150.783%2066.9626%20150.192%2067.204%20149.493%2067.204ZM149.493%2065.872C149.815%2065.872%20150.09%2065.7582%20150.317%2065.5306C150.545%2065.3031%20150.659%2065.0284%20150.659%2064.7065C150.659%2064.3846%20150.545%2064.1098%20150.317%2063.8823C150.09%2063.6547%20149.815%2063.5409%20149.493%2063.5409C149.171%2063.5409%20148.896%2063.6547%20148.669%2063.8823C148.441%2064.1098%20148.328%2064.3846%20148.328%2064.7065C148.328%2065.0284%20148.441%2065.3031%20148.669%2065.5306C148.896%2065.7582%20149.171%2065.872%20149.493%2065.872ZM140.335%2065.3725V64.0405H145.664V65.3725H140.335ZM141.834%2061.2099C141.135%2061.2099%20140.544%2060.9685%20140.061%2060.4856C139.578%2060.0028%20139.336%2059.4117%20139.336%2058.7124C139.336%2058.0131%20139.578%2057.422%20140.061%2056.9391C140.544%2056.4563%20141.135%2056.2148%20141.834%2056.2148C142.533%2056.2148%20143.124%2056.4563%20143.607%2056.9391C144.09%2057.422%20144.331%2058.0131%20144.331%2058.7124C144.331%2059.4117%20144.09%2060.0028%20143.607%2060.4856C143.124%2060.9685%20142.533%2061.2099%20141.834%2061.2099ZM141.834%2059.8779C142.156%2059.8779%20142.431%2059.7641%20142.658%2059.5366C142.886%2059.309%20142.999%2059.0343%20142.999%2058.7124C142.999%2058.3905%20142.886%2058.1157%20142.658%2057.8882C142.431%2057.6606%20142.156%2057.5469%20141.834%2057.5469C141.512%2057.5469%20141.237%2057.6606%20141.01%2057.8882C140.782%2058.1157%20140.668%2058.3905%20140.668%2058.7124C140.668%2059.0343%20140.782%2059.309%20141.01%2059.5366C141.237%2059.7641%20141.512%2059.8779%20141.834%2059.8779ZM145.664%2059.3784V58.0464H150.992V59.3784H145.664Z'%20fill='%23010101'%20/%3e%3cg%20clip-path='url(%23clip1_53680_9844)'%3e%3crect%20x='126'%20y='41'%20width='55'%20height='39'%20rx='19.5'%20fill='%23CAE6FC'%20/%3e%3cpath%20d='M161.325%2071.0558C159.982%2071.0558%20158.847%2070.5921%20157.92%2069.6649C156.992%2068.7377%20156.529%2067.6026%20156.529%2066.2597C156.529%2064.9168%20156.992%2063.7817%20157.92%2062.8545C158.847%2061.9273%20159.982%2061.4637%20161.325%2061.4637C162.668%2061.4637%20163.803%2061.9273%20164.73%2062.8545C165.657%2063.7817%20166.121%2064.9168%20166.121%2066.2597C166.121%2067.6026%20165.657%2068.7377%20164.73%2069.6649C163.803%2070.5921%20162.668%2071.0558%20161.325%2071.0558ZM161.325%2068.4979C161.943%2068.4979%20162.47%2068.2794%20162.907%2067.8424C163.344%2067.4054%20163.563%2066.8779%20163.563%2066.2597C163.563%2065.6415%20163.344%2065.114%20162.907%2064.677C162.47%2064.24%20161.943%2064.0215%20161.325%2064.0215C160.707%2064.0215%20160.179%2064.24%20159.742%2064.677C159.305%2065.114%20159.087%2065.6415%20159.087%2066.2597C159.087%2066.8779%20159.305%2067.4054%20159.742%2067.8424C160.179%2068.2794%20160.707%2068.4979%20161.325%2068.4979ZM143.739%2067.5387V64.9808H153.971V67.5387H143.739ZM146.617%2059.5452C145.274%2059.5452%20144.139%2059.0816%20143.212%2058.1544C142.284%2057.2271%20141.821%2056.0921%20141.821%2054.7492C141.821%2053.4063%20142.284%2052.2712%20143.212%2051.344C144.139%2050.4167%20145.274%2049.9531%20146.617%2049.9531C147.96%2049.9531%20149.095%2050.4167%20150.022%2051.344C150.949%2052.2712%20151.413%2053.4063%20151.413%2054.7492C151.413%2056.0921%20150.949%2057.2271%20150.022%2058.1544C149.095%2059.0816%20147.96%2059.5452%20146.617%2059.5452ZM146.617%2056.9873C147.235%2056.9873%20147.763%2056.7688%20148.2%2056.3319C148.637%2055.8949%20148.855%2055.3673%20148.855%2054.7492C148.855%2054.131%20148.637%2053.6035%20148.2%2053.1665C147.763%2052.7295%20147.235%2052.511%20146.617%2052.511C145.999%2052.511%20145.471%2052.7295%20145.034%2053.1665C144.597%2053.6035%20144.379%2054.131%20144.379%2054.7492C144.379%2055.3673%20144.597%2055.8949%20145.034%2056.3319C145.471%2056.7688%20145.999%2056.9873%20146.617%2056.9873ZM153.971%2056.0281V53.4702H164.202V56.0281H153.971Z'%20fill='%23010101'%20/%3e%3c/g%3e%3cpath%20d='M37.958%20123.457C37.958%20116.741%2044.0208%20111.297%2051.4997%20111.297C58.9785%20111.297%2065.0413%20116.741%2065.0413%20123.457V130.753C65.0413%20137.468%2058.9785%20142.913%2051.4997%20142.913C44.0208%20142.913%2037.958%20137.468%2037.958%20130.753V123.457Z'%20fill='%23FFB074'%20stroke='%23FFB074'%20stroke-width='1.9898'%20/%3e%3cpath%20d='M54.2087%20123.457L65.042%20123.457'%20stroke='%23FFB074'%20stroke-width='1.9898'%20stroke-linecap='round'%20/%3e%3cpath%20d='M54.2087%20130.754L65.042%20130.754'%20stroke='%23FFB074'%20stroke-width='1.9898'%20stroke-linecap='round'%20/%3e%3cpath%20d='M73.1663%20128.316V130.748C73.1663%20141.494%2063.4658%20150.204%2051.4997%20150.204C39.5335%20150.204%2029.833%20141.494%2029.833%20130.748V128.316'%20stroke='%23FFB074'%20stroke-width='1.9898'%20stroke-linecap='round'%20/%3e%3cpath%20d='M51.5%20150.207V157.503'%20stroke='%23FFB074'%20stroke-width='1.9898'%20stroke-linecap='round'%20/%3e%3crect%20x='100'%20y='123.184'%20width='89'%20height='20'%20rx='10'%20fill='white'%20/%3e%3ccircle%20cx='114.75'%20cy='133.551'%20r='17.625'%20fill='%23FFB074'%20stroke='%23010101'%20stroke-width='1.5'%20/%3e%3crect%20x='33'%20y='179.5'%20width='30'%20height='30'%20rx='15'%20fill='%23DBDBDB'%20/%3e%3crect%20x='100'%20y='188.5'%20width='40'%20height='12'%20rx='6'%20fill='%23DBDBDB'%20/%3e%3cg%20opacity='0.3'%3e%3crect%20x='33'%20y='236.5'%20width='30'%20height='30'%20rx='15'%20fill='%23DBDBDB'%20/%3e%3crect%20x='100'%20y='245.5'%20width='40'%20height='12'%20rx='6'%20fill='%23DBDBDB'%20/%3e%3c/g%3e%3crect%20x='120.5'%20y='29.5'%20width='63'%20height='63'%20rx='31.5'%20stroke='black'%20/%3e%3cpath%20d='M180.112%20155.397L200.633%20129.385L232.094%20118.998L161.991%2074.1994L180.112%20155.397Z'%20fill='white'%20stroke='black'%20stroke-width='1.30784'%20/%3e%3c/g%3e%3cpath%20d='M0%2013C0%205.8203%205.8203%200%2013%200H272V2H13C6.92487%202%202%206.92487%202%2013H0ZM272%20288H1H272ZM0%20288V13C0%205.8203%205.8203%200%2013%200V2C6.92487%202%202%206.92487%202%2013V288H0ZM272%201V288V1Z'%20fill='%23010101'%20mask='url(%23path-1-outside-1_53680_9844)'%20/%3e%3cdefs%3e%3cclipPath%20id='clip0_53680_9844'%3e%3cpath%20d='M1%2013C1%206.37258%206.37258%201%2013%201H272V288H1V13Z'%20fill='white'%20/%3e%3c/clipPath%3e%3cclipPath%20id='clip1_53680_9844'%3e%3crect%20width='51'%20height='39'%20fill='white'%20transform='translate(126%2041)'%20/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", q2 = ({ setModalOpen: t }) => {
  const { isChatOpen: e } = Ae();
  return /* @__PURE__ */ u("div", { className: "didagent__mic__permission__container", "data-chat": e, children: [
    /* @__PURE__ */ u(
      "button",
      {
        onClick: () => t(!1),
        className: "didagent__mic__permission__container__close",
        "aria-label": "Close microphone permission help",
        children: /* @__PURE__ */ u(ge, { src: W2, size: "24px", color: "#fff" })
      }
    ),
    /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("img", { src: G2, alt: "Microphone permission instructions" }),
      /* @__PURE__ */ u("h3", { children: "We are blocked from using your microphone" }),
      /* @__PURE__ */ u("ol", { children: [
        /* @__PURE__ */ u("li", { children: "Click the page info icon in your browser's address bar" }),
        /* @__PURE__ */ u("li", { children: "Turn on microphone access" })
      ] }),
      /* @__PURE__ */ u("button", { onClick: () => t(!1), children: "Understood" })
    ] })
  ] });
};
function Y2({
  showWelcomeScreen: t,
  isFabio: e,
  showConnecting: n,
  showPermissionMessage: r,
  showReconnect: i,
  showMobileBlocked: a
}) {
  const { startConversation: o, requestMicrophoneAccess: s } = it(), { reconnect: l, isVMAgent: c } = ye();
  return /* @__PURE__ */ u(xe, { children: [
    t && !e && /* @__PURE__ */ u(F2, { startConversation: o, loading: n }),
    n && /* @__PURE__ */ u(R2, {}),
    r && (c ? /* @__PURE__ */ u(K2, { requestMicrophoneAccess: s }) : /* @__PURE__ */ u(H2, { requestMicrophoneAccess: s })),
    i && /* @__PURE__ */ u(z2, { reconnect: l }),
    a && /* @__PURE__ */ u(V2, {})
  ] });
}
const J2 = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Q2 = J2 ? mt : E;
function X2(t, e) {
  const n = q(t);
  Q2(() => {
    n.current = t;
  }, [t]), E(() => {
    function r() {
      n.current();
    }
    if (e !== null) {
      const i = setInterval(r, e);
      return () => clearInterval(i);
    }
  }, [e]);
}
const e0 = (t) => {
  const r = t % 2e3 / 2e3;
  return Array(12).fill(2).map((a, o) => {
    const s = o > 6 ? o : 11 - o, l = (r + s / 12) * Math.PI * 2;
    let g = (Math.sin(l) + 1) / 2 * 12;
    return g = Math.max(2, Math.min(g, 23)), g;
  });
}, t0 = 36, n0 = 500, r0 = ({ isPlaying: t, isDelayed: e, canInterrupt: n }) => {
  const r = Rl(), i = q(null), [a, o] = A(!1), [s, l] = A([]), { interruptAvailable: c, greeted: g } = ye(), { micMuted: d } = it(), { t: h } = rt(), p = q(0), f = Me(() => {
    const y = r.reduce((b, w) => b + w, 0), C = Date.now();
    return y > t0 ? (p.current = C, !0) : C - p.current < n0;
  }, [r]);
  return E(() => {
    c || (t && f && (i.current = Date.now(), o(!0)), t && !f && i.current && Date.now() - i.current > 2e3 && (i.current = null, o(!1)));
  }, [c, f]), X2(
    () => {
      const y = Date.now(), C = e0(y);
      l(C);
    },
    e ? 73 : null
  ), t && (a || !g && n) ? /* @__PURE__ */ u("div", { className: "didagent__button didagaent__wave__container", children: /* @__PURE__ */ u("span", { className: "didagent__button__response__active", children: h("hints.wait") }) }) : n && !d && g && !f ? /* @__PURE__ */ u("div", { className: "didagent__button didagaent__wave__container", children: /* @__PURE__ */ u("span", { className: "didagent__button__response__active", children: h("hints.interrupt") }) }) : /* @__PURE__ */ u("div", { className: "didagent__button didagaent__wave__container", children: /* @__PURE__ */ u("div", { className: "didagent__wave__container", children: /* @__PURE__ */ u("div", { className: "wave", children: (e ? s : r).map((y, C) => /* @__PURE__ */ u(
    "div",
    {
      className: "bar",
      style: { height: `${Math.round(Math.max(y / 23 * 100, 10))}%` }
    },
    C
  )) }) }) });
}, i0 = 1e3, a0 = 2;
function o0({
  isTextual: t,
  onSend: e,
  disableSend: n
}) {
  const { connectionState: r, reconnect: i, language: a, interruptAvailable: o, interrupt: s, agentActivityState: l } = ye(), { micMuted: c, sttRecognizer: g } = it(), { trackUi: d } = Mt(), { configurations: h } = ce(ke), { isResponseDelayed: p, isResponseLoading: f } = Ba(l), _ = l === he.Talking, v = l === he.Idle, y = f, C = p, b = q(!1), w = q(!1), N = q(!1);
  w.current = _ && o && h.enableInterruptOption.includes(Ct.Audio), b.current = !n && (v || w.current);
  const j = Z(
    async (I) => {
      if (!g) return;
      !t && Cr.includes(r) && await i();
      const x = I ? "start" : "abort";
      await (g == null ? void 0 : g[x]());
    },
    [g, r, i, t]
  );
  E(() => {
    o || j(!_ && !c && !y && !n);
  }, [j, _, c, y, o, n]), E(() => {
    o && j(!c && !n);
  }, [j, o, c, n]);
  const z = Me(() => ({
    onresult(I) {
      var x, m, S;
      b.current && (w.current && !N.current && ((x = I.result.text) == null ? void 0 : x.trim()) !== "" && (N.current = !0, s({ type: "audio" })), e(I.result.text), (S = (m = window.DID_AGENTS_API.callbacks) == null ? void 0 : m.onSttEnd) == null || S.call(m, I));
    },
    onstart: () => {
      N.current = !1, d("agent-stt", { event: "start", engine: "azure" });
    },
    onend: () => {
      d("agent-stt", { event: "end", engine: "azure" });
    },
    onerror: async (I) => {
      const { CancellationReason: x } = await import("./microsoft.cognitiveservices.speech.sdk-DsKt2trO.js").then((m) => m.m);
      I.reason === x.Error && (b.current && j(!0), d("agent-stt", {
        event: "error",
        error: I.errorDetails,
        errorCode: I.errorCode,
        engine: "azure",
        language: a
      }));
    },
    onrecognizing: (I) => {
      if (!w.current || !b.current || N.current)
        return;
      (I.result.duration > i0 || I.result.text.split(" ").length > a0) && (N.current = !0, s({ type: "audio" }));
    }
  }), [s, e, a, j]);
  return E(() => {
    g && g.updateEvents(z);
  }, [g, z]), y ? /* @__PURE__ */ u("div", { className: "didagent__button didagaent__wave__container", children: /* @__PURE__ */ u(ge, { src: Ya, color: "orange", size: "22px" }) }) : /* @__PURE__ */ u(r0, { isPlaying: _, isDelayed: C, canInterrupt: w.current });
}
const s0 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='none'%3e%3cpath%20fill='currentcolor'%20d='m13.087%2021.388.645.382-.645-.382Zm.542-.916-.646-.382.646.382Zm-3.258%200-.645.382.645-.382Zm.542.916.646-.382-.646.382Zm-8.532-5.475.693-.287-.693.287Zm5.409%203.078-.013.75.013-.75Zm-2.703-.372-.287.693.287-.693Zm16.532-2.706.693.287-.693-.287Zm-5.409%203.078-.012-.75.012.75Zm2.703-.372.287.693-.287-.693Zm.7-15.882-.392.64.392-.64Zm1.65%201.65.64-.391-.64.392ZM4.388%202.738l-.392-.64.392.64Zm-1.651%201.65-.64-.391.64.392ZM9.403%2019.21l.377-.649-.377.649Zm4.33%202.56.541-.916-1.29-.764-.543.916%201.291.764Zm-4.007-.916.542.916%201.29-.764-.541-.916-1.291.764Zm2.715.152a.52.52%200%200%201-.882%200l-1.291.764c.773%201.307%202.69%201.307%203.464%200l-1.29-.764ZM10.5%202.75h3v-1.5h-3v1.5Zm10.75%207.75v1h1.5v-1h-1.5Zm-18.5%201v-1h-1.5v1h1.5Zm-1.5%200c0%201.155%200%202.058.05%202.787.05.735.153%201.347.388%201.913l1.386-.574c-.147-.352-.233-.782-.278-1.441-.046-.666-.046-1.51-.046-2.685h-1.5Zm6.553%206.742c-1.256-.022-1.914-.102-2.43-.316L4.8%2019.313c.805.334%201.721.408%202.977.43l.026-1.5ZM1.688%2016.2A5.75%205.75%200%200%200%204.8%2019.312l.574-1.386a4.25%204.25%200%200%201-2.3-2.3l-1.386.574Zm19.562-4.7c0%201.175%200%202.019-.046%202.685-.045.659-.131%201.089-.277%201.441l1.385.574c.235-.566.338-1.178.389-1.913.05-.729.049-1.632.049-2.787h-1.5Zm-5.027%208.241c1.256-.021%202.172-.095%202.977-.429l-.574-1.386c-.515.214-1.173.294-2.428.316l.025%201.5Zm4.704-4.115a4.25%204.25%200%200%201-2.3%202.3l.573%201.386a5.75%205.75%200%200%200%203.112-3.112l-1.386-.574ZM13.5%202.75c1.651%200%202.837%200%203.762.089.914.087%201.495.253%201.959.537l.783-1.279c-.739-.452-1.577-.654-2.6-.752-1.012-.096-2.282-.095-3.904-.095v1.5Zm9.25%207.75c0-1.622%200-2.891-.096-3.904-.097-1.023-.299-1.862-.751-2.6l-1.28.783c.285.464.451%201.045.538%201.96.088.924.089%202.11.089%203.761h1.5Zm-3.53-7.124a4.25%204.25%200%200%201%201.404%201.403l1.279-.783a5.75%205.75%200%200%200-1.899-1.899l-.783%201.28ZM10.5%201.25c-1.622%200-2.891%200-3.904.095-1.023.098-1.862.3-2.6.752l.783%201.28c.464-.285%201.045-.451%201.96-.538.924-.088%202.11-.089%203.761-.089v-1.5ZM2.75%2010.5c0-1.651%200-2.837.089-3.762.087-.914.253-1.495.537-1.959l-1.279-.783c-.452.738-.654%201.577-.752%202.6C1.25%207.61%201.25%208.878%201.25%2010.5h1.5Zm1.246-8.403a5.75%205.75%200%200%200-1.899%201.899l1.28.783a4.25%204.25%200%200%201%201.402-1.403l-.783-1.279Zm7.02%2017.993c-.202-.343-.38-.646-.554-.884a2.229%202.229%200%200%200-.682-.645l-.754%201.297c.047.028.112.078.224.232.121.166.258.396.476.764l1.29-.764Zm-3.24-.349c.44.008.718.014.93.037.198.022.275.054.32.08l.754-1.297c-.293-.17-.598-.24-.909-.274-.298-.033-.657-.038-1.069-.045l-.025%201.5Zm6.498%201.113c.218-.367.355-.598.476-.764.112-.154.177-.204.224-.232l-.754-1.297c-.29.17-.5.395-.682.645-.173.238-.352.54-.555.884l1.291.764Zm1.924-2.612c-.412.007-.771.012-1.069.045-.311.035-.616.104-.909.274l.754%201.297c.045-.026.122-.058.32-.08.212-.023.49-.03.93-.037l-.026-1.5Z'%20/%3e%3cpath%20stroke='currentcolor'%20stroke-linecap='round'%20stroke-width='1.5'%20d='M8%209h8M8%2012.5h5.5'%20/%3e%3c/svg%3e";
function c0() {
  const { messages: t } = ye(), { isChatOpen: e } = Ae(), [n, r] = A(null), i = q(0);
  E(() => {
    if (e) {
      r(null), i.current = t.length;
      return;
    }
    const o = i.current > 0 ? t.slice(i.current) : t;
    for (let s = o.length - 1; s >= 0; s--) {
      const l = o[s];
      if (l.role === "assistant") {
        const c = x2(l.content);
        if (c) {
          r(c), i.current = t.length;
          return;
        }
      }
    }
  }, [t, e]);
  const a = Z(() => {
    r(null), i.current = t.length;
  }, [t.length]);
  return {
    url: n,
    clear: a
  };
}
const l0 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='7'%20height='6'%20viewBox='0%200%207%206'%20fill='none'%3e%3ccircle%20cx='3.19211'%20cy='2.99997'%20r='2.88889'%20fill='%23497CFF'/%3e%3c/svg%3e";
function d0({ className: t = "" }) {
  return /* @__PURE__ */ u("div", { className: `didagent__link__notification__badge ${t}`, children: /* @__PURE__ */ u(ge, { src: l0, size: "7px", color: "#497CFF" }) });
}
const u0 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='12'%20viewBox='0%200%2012%2012'%20fill='none'%3e%3cg%20clip-path='url(%23clip0_63315_41)'%3e%3cpath%20d='M5.0232%207C4.27022%206.24409%204.33804%204.95044%205.17469%204.11054L7.59852%201.67731C8.43517%200.837414%209.72382%200.769326%2010.4768%201.52523C11.2298%202.28114%2011.162%203.57478%2010.3253%204.41468L9.11339%205.6313'%20stroke='%23090604'%20stroke-linecap='round'/%3e%3cpath%20d='M6.9768%205C7.72978%205.75591%207.66196%207.04954%206.82531%207.88944L5.6134%209.10606L4.4015%2010.3227C3.56484%2011.1626%202.27619%2011.2307%201.5232%2010.4748C0.770217%209.71886%200.838043%208.4252%201.67469%207.5853L2.88662%206.36867'%20stroke='%23090604'%20stroke-linecap='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_63315_41'%3e%3crect%20width='12'%20height='12'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e", h0 = 5e3;
function f0({ children: t, url: e, onLinkClick: n }) {
  const [r, i] = A(!1), a = q(null);
  return E(() => (e ? (i(!0), a.current && clearTimeout(a.current), a.current = setTimeout(() => {
    i(!1);
  }, h0)) : i(!1), () => {
    a.current && clearTimeout(a.current);
  }), [e]), /* @__PURE__ */ u(Ha, { enabled: r, content: e ? /* @__PURE__ */ u("div", { onClick: (l) => {
    l.preventDefault(), l.stopPropagation(), e && (window.open(e, "_blank", "noopener,noreferrer"), i(!1), n == null || n());
  }, children: [
    /* @__PURE__ */ u(ge, { src: u0, size: "12px", color: "#090604", className: "didagent__tooltip__link__icon" }),
    /* @__PURE__ */ u("span", { children: e })
  ] }) : "", persist: !0, className: "didagent__tooltip__link", children: t });
}
function g0({ withLabel: t }) {
  const { isChatOpen: e, setIsChatOpen: n } = Ae(), { url: r, clear: i } = c0(), a = e ? "Close chat" : "Open chat", o = !!r;
  return /* @__PURE__ */ u(f0, { url: r, onLinkClick: i, children: /* @__PURE__ */ u(
    "button",
    {
      className: "didagent__chat__toggle didagent__button " + (t ? "didagent__button__controller__with__label" : "didagent__button__controller") + (e ? "" : " didagent__button__dark"),
      role: "button",
      "data-active": e,
      onClick: () => {
        n((s) => !s);
      },
      "data-testid": "chat_toggle",
      "aria-label": a,
      "aria-pressed": e,
      children: [
        /* @__PURE__ */ u(ge, { src: s0, size: "24px" }),
        t && /* @__PURE__ */ u("span", { children: "History" }),
        o && /* @__PURE__ */ u(d0, {})
      ]
    }
  ) });
}
function p0(t) {
  return t ? {
    maxHeight: "180px",
    paddingbottom: "8px",
    marginBottom: "-8px"
  } : {
    opacity: "0",
    maxHeight: "0",
    paddingBottom: "0",
    marginBottom: "0",
    pointerEvents: "none"
  };
}
function m0({ messages: t, onClick: e, show: n, enabled: r }) {
  const i = (a) => {
    var o;
    r && e(a), (o = window.dataLayer) == null || o.push({
      event: "clicked_starter_message",
      message: a
    });
  };
  return /* @__PURE__ */ u("div", { className: "didagent__starter_messages__container", style: p0(n), children: t.map(
    (a, o) => o > 4 ? null : /* @__PURE__ */ u(
      "button",
      {
        title: (a == null ? void 0 : a.length) > 25 ? a : void 0,
        className: "didagent__starter_message__container",
        role: "button",
        disabled: !r,
        onClick: () => i(a),
        children: /* @__PURE__ */ u("div", { className: "didagent__starter_message__container_text", children: a })
      },
      o
    )
  ) });
}
function _0({
  hasMultipleMessages: t,
  loaderShow: e,
  disableSend: n,
  onSend: r,
  setPermissionHelper: i,
  isTextual: a
}) {
  const { starterMessages: o } = ye(), { isHorizontal: s, chatPosition: l } = Ae(), { configurations: c } = ce(ke);
  return /* @__PURE__ */ u(xe, { children: [
    /* @__PURE__ */ u(
      m0,
      {
        show: !t && !e,
        enabled: !n,
        messages: o ?? [],
        onClick: r
      }
    ),
    /* @__PURE__ */ u(
      "div",
      {
        className: "didagent__main__container",
        role: "navigation",
        "aria-label": "Main controls",
        "data-orientation": s ? "horizontal" : "vertical",
        "data-chat": l,
        children: [
          c.showMicToggle && /* @__PURE__ */ u(
            Ga,
            {
              isController: !0,
              setPermissionHelper: i,
              testId: "mic_on_off"
            }
          ),
          /* @__PURE__ */ u(o0, { isTextual: a, onSend: r, disableSend: n }),
          c.showChatToggle && /* @__PURE__ */ u(g0, {})
        ]
      }
    )
  ] });
}
function v0({ content: t }) {
  return t ? /* @__PURE__ */ u("div", { className: "didagent__banner", role: "banner", children: [
    /* @__PURE__ */ u("div", { className: "didagent__banner__icon__container", children: /* @__PURE__ */ u(ge, { size: "16px", src: Ua }) }),
    /* @__PURE__ */ u("div", { className: "didagent__banner__text__container", children: t })
  ] }) : null;
}
const y0 = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3ccircle%20cx='12'%20cy='12'%20r='3'%20stroke='white'%20stroke-width='1.5'%20/%3e%3cpath%20d='M13.7654%202.15224C13.3978%202%2012.9319%202%2012%202C11.0681%202%2010.6022%202%2010.2346%202.15224C9.74457%202.35523%209.35522%202.74458%209.15223%203.23463C9.05957%203.45834%209.0233%203.7185%209.00911%204.09799C8.98826%204.65568%208.70226%205.17189%208.21894%205.45093C7.73564%205.72996%207.14559%205.71954%206.65219%205.45876C6.31645%205.2813%206.07301%205.18262%205.83294%205.15102C5.30704%205.08178%204.77518%205.22429%204.35436%205.5472C4.03874%205.78938%203.80577%206.1929%203.33983%206.99993C2.87389%207.80697%202.64092%208.21048%202.58899%208.60491C2.51976%209.1308%202.66227%209.66266%202.98518%2010.0835C3.13256%2010.2756%203.3397%2010.437%203.66119%2010.639C4.1338%2010.936%204.43789%2011.4419%204.43786%2012C4.43783%2012.5581%204.13375%2013.0639%203.66118%2013.3608C3.33965%2013.5629%203.13248%2013.7244%202.98508%2013.9165C2.66217%2014.3373%202.51966%2014.8691%202.5889%2015.395C2.64082%2015.7894%202.87379%2016.193%203.33973%2017C3.80568%2017.807%204.03865%2018.2106%204.35426%2018.4527C4.77508%2018.7756%205.30694%2018.9181%205.83284%2018.8489C6.07289%2018.8173%206.31632%2018.7186%206.65204%2018.5412C7.14547%2018.2804%207.73556%2018.27%208.2189%2018.549C8.70224%2018.8281%208.98826%2019.3443%209.00911%2019.9021C9.02331%2020.2815%209.05957%2020.5417%209.15223%2020.7654C9.35522%2021.2554%209.74457%2021.6448%2010.2346%2021.8478C10.6022%2022%2011.0681%2022%2012%2022C12.9319%2022%2013.3978%2022%2013.7654%2021.8478C14.2554%2021.6448%2014.6448%2021.2554%2014.8477%2020.7654C14.9404%2020.5417%2014.9767%2020.2815%2014.9909%2019.902C15.0117%2019.3443%2015.2977%2018.8281%2015.781%2018.549C16.2643%2018.2699%2016.8544%2018.2804%2017.3479%2018.5412C17.6836%2018.7186%2017.927%2018.8172%2018.167%2018.8488C18.6929%2018.9181%2019.2248%2018.7756%2019.6456%2018.4527C19.9612%2018.2105%2020.1942%2017.807%2020.6601%2016.9999C21.1261%2016.1929%2021.3591%2015.7894%2021.411%2015.395C21.4802%2014.8691%2021.3377%2014.3372%2021.0148%2013.9164C20.8674%2013.7243%2020.6602%2013.5628%2020.3387%2013.3608C19.8662%2013.0639%2019.5621%2012.558%2019.5621%2011.9999C19.5621%2011.4418%2019.8662%2010.9361%2020.3387%2010.6392C20.6603%2010.4371%2020.8675%2010.2757%2021.0149%2010.0835C21.3378%209.66273%2021.4803%209.13087%2021.4111%208.60497C21.3592%208.21055%2021.1262%207.80703%2020.6602%207C20.1943%206.19297%2019.9613%205.78945%2019.6457%205.54727C19.2249%205.22436%2018.693%205.08185%2018.1671%205.15109C17.9271%205.18269%2017.6837%205.28136%2017.3479%205.4588C16.8545%205.71959%2016.2644%205.73002%2015.7811%205.45096C15.2977%205.17191%2015.0117%204.65566%2014.9909%204.09794C14.9767%203.71848%2014.9404%203.45833%2014.8477%203.23463C14.6448%202.74458%2014.2554%202.35523%2013.7654%202.15224Z'%20stroke='white'%20stroke-width='1.5'%20/%3e%3c/svg%3e";
function no() {
  const { outputDevices: t, selectedOutputDevice: e, setSelectedOutputDevice: n } = it(), { t: r } = rt();
  return /* @__PURE__ */ u(
    Za,
    {
      devices: t,
      selectedDevice: e,
      setSelectedDevice: n,
      header: r("devices.spk")
    }
  );
}
const w0 = () => /* @__PURE__ */ u(ge, { size: "24px", src: y0 });
function C0() {
  const [t, e] = A(!1), n = kn(() => e(!1), t), r = Z(() => e(!t), [t]), { inputDevices: i, outputDevices: a } = it(), o = i.length > 1, s = a.length > 1;
  return E(() => {
    const l = (c) => {
      c.key === "Escape" && t && e(!1);
    };
    if (t)
      return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  }, [t]), !o && !s ? null : /* @__PURE__ */ u(xe, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        onClick: r,
        title: "Audio Settings",
        "aria-label": "Audio Settings",
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": t,
        className: "didagent__button didagent__button__header",
        children: /* @__PURE__ */ u(w0, {})
      }
    ),
    t && /* @__PURE__ */ u("div", { className: "didagent__audio__mobile__dropdown__wrapper", children: /* @__PURE__ */ u(kt, { backdrop: !0, ariaLabel: "Audio Settings", children: /* @__PURE__ */ u(
      "div",
      {
        className: "didagent__audio__mobile__dropdown__container didagent__audio__dropdown__container",
        role: "dialog",
        "aria-labelledby": "audio-settings-title",
        ref: n,
        children: [
          /* @__PURE__ */ u("div", { id: "audio-settings-title", className: "didagent__audio__list__title", children: "Audio Settings" }),
          o && /* @__PURE__ */ u(
            "div",
            {
              className: "didagent__audio__list__wrapper " + (s ? "didagent__audio__dropdown__bottom__spacer" : ""),
              children: /* @__PURE__ */ u(Ka, {})
            }
          ),
          s && /* @__PURE__ */ u("div", { className: "didagent__audio__list__wrapper", children: /* @__PURE__ */ u(no, {}) })
        ]
      }
    ) }) })
  ] });
}
const b0 = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M20.3334%2012.917C20.7476%2012.917%2021.0834%2013.2528%2021.0834%2013.667V13.7225C21.0834%2015.2467%2021.0834%2016.4668%2020.9547%2017.4245C20.8215%2018.4154%2020.5382%2019.2369%2019.8874%2019.8877C19.2367%2020.5384%2018.4151%2020.8217%2017.4243%2020.9549C16.4665%2021.0837%2015.2465%2021.0837%2013.7222%2021.0837H13.6667C13.2525%2021.0837%2012.9167%2020.7479%2012.9167%2020.3337C12.9167%2019.9194%2013.2525%2019.5837%2013.6667%2019.5837C15.2593%2019.5837%2016.3783%2019.5821%2017.2244%2019.4683C18.0489%2019.3575%2018.5012%2019.1526%2018.8268%2018.827C19.1524%2018.5014%2019.3572%2018.0492%2019.4681%2017.2246C19.5818%2016.3785%2019.5834%2015.2595%2019.5834%2013.667C19.5834%2013.2528%2019.9192%2012.917%2020.3334%2012.917Z'%20fill='white'%20/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M3.66675%2012.917C4.08096%2012.917%204.41675%2013.2528%204.41675%2013.667C4.41675%2015.2595%204.41834%2016.3785%204.5321%2017.2246C4.64296%2018.0492%204.84781%2018.5014%205.17339%2018.827C5.49897%2019.1526%205.95123%2019.3575%206.77578%2019.4683C7.6219%2019.5821%208.74086%2019.5837%2010.3334%2019.5837C10.7476%2019.5837%2011.0834%2019.9194%2011.0834%2020.3337C11.0834%2020.7479%2010.7476%2021.0837%2010.3334%2021.0837H10.2779C8.7537%2021.0837%207.53362%2021.0837%206.57591%2020.9549C5.58503%2020.8217%204.76346%2020.5384%204.11273%2019.8877C3.462%2019.2369%203.1787%2018.4154%203.04548%2017.4245C2.91671%2016.4668%202.91673%2015.2467%202.91675%2013.7225C2.91675%2013.704%202.91675%2013.6855%202.91675%2013.667C2.91675%2013.2528%203.25254%2012.917%203.66675%2012.917Z'%20fill='white'%20/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M10.2779%202.91699L10.3334%202.91699C10.7476%202.91699%2011.0834%203.25278%2011.0834%203.66699C11.0834%204.08121%2010.7476%204.41699%2010.3334%204.41699C8.74086%204.41699%207.6219%204.41859%206.77578%204.53234C5.95123%204.6432%205.49897%204.84806%205.17339%205.17363C4.84781%205.49921%204.64296%205.95148%204.5321%206.77602C4.41834%207.62214%204.41675%208.74111%204.41675%2010.3337C4.41675%2010.7479%204.08096%2011.0837%203.66675%2011.0837C3.25254%2011.0837%202.91675%2010.7479%202.91675%2010.3337L2.91675%2010.2782C2.91673%208.75394%202.91671%207.53386%203.04548%206.57615C3.1787%205.58527%203.462%204.76371%204.11273%204.11297C4.76346%203.46224%205.58503%203.17894%206.57591%203.04572C7.53362%202.91696%208.75369%202.91697%2010.2779%202.91699Z'%20fill='white'%20/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M17.2244%204.53234C16.3783%204.41859%2015.2593%204.41699%2013.6667%204.41699C13.2525%204.41699%2012.9167%204.08121%2012.9167%203.66699C12.9167%203.25278%2013.2525%202.91699%2013.6667%202.91699C13.6853%202.91699%2013.7038%202.91699%2013.7222%202.91699C15.2465%202.91697%2016.4665%202.91696%2017.4243%203.04572C18.4151%203.17894%2019.2367%203.46224%2019.8874%204.11297C20.5382%204.76371%2020.8215%205.58527%2020.9547%206.57615C21.0834%207.53386%2021.0834%208.75394%2021.0834%2010.2782V10.3337C21.0834%2010.7479%2020.7476%2011.0837%2020.3334%2011.0837C19.9192%2011.0837%2019.5834%2010.7479%2019.5834%2010.3337C19.5834%208.74111%2019.5818%207.62214%2019.4681%206.77602C19.3572%205.95148%2019.1524%205.49921%2018.8268%205.17363C18.5012%204.84806%2018.0489%204.6432%2017.2244%204.53234Z'%20fill='white'%20/%3e%3c/svg%3e", S0 = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M9%2015L2%2022M2%2022H7.85714M2%2022V16.1429'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M15%209L22%202M22%202H16.1429M22%202V7.85714'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e", M0 = "data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M2%2022L9%2015M9%2015H3.14286M9%2015V20.8571'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3cpath%20d='M22%202L15%209M15%209H20.8571M15%209V3.14286'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3c/svg%3e", k0 = () => /* @__PURE__ */ u(ge, { src: b0, size: "24px", color: "#fff" }), L0 = () => /* @__PURE__ */ u(ge, { src: S0, size: "24px", color: "#fff" }), x0 = () => /* @__PURE__ */ u(ge, { src: M0, size: "24px", color: "#fff" });
function Li({ value: t, onClick: e, blurred: n = !1, mode: r = "theater" }) {
  const a = t ? x0 : r === "browser" ? L0 : k0, o = t ? "Exit fullscreen" : "Enter fullscreen";
  return /* @__PURE__ */ u(
    "button",
    {
      className: "didagent__button didagent__button__header didagent__hide__sm didagent__button__dark " + (n ? "didagent__button__blurred" : ""),
      role: "button",
      onClick: () => e(!t),
      "aria-label": o,
      "aria-pressed": t,
      children: /* @__PURE__ */ u(a, {})
    }
  );
}
const I0 = ({ label: t, value: e, onClick: n }) => {
  const r = Z(() => {
    n(e);
  }, [n, e]), i = Z(
    (a) => {
      (a.key === "Enter" || a.key === " ") && (a.preventDefault(), n(e));
    },
    [n, e]
  );
  return /* @__PURE__ */ u(
    "div",
    {
      className: "didagent__dropdown__item",
      onClick: r,
      onKeyDown: i,
      title: t,
      role: "menuitem",
      tabIndex: 0,
      children: t
    }
  );
};
function N0() {
  var p, f;
  const [t, e] = A(!1), { agent: n, language: r, setLanguage: i, enrichSdkAnalytics: a, setTranslationLanguage: o } = ye(), s = (f = (p = n == null ? void 0 : n.presenter) == null ? void 0 : p.voice) == null ? void 0 : f.language, l = kn(() => e(!1), t), c = Z(() => e(!t), [t]), g = Z(
    (_) => {
      i(_), e(!1), o(_);
    },
    [i, o]
  ), d = _n(s), h = Me(() => d ? r.split("-")[0] : null, [d, r]);
  return E(() => {
    a({ language: h });
  }, [h]), d ? /* @__PURE__ */ u(xe, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        onClick: c,
        title: "Select Language",
        className: "didagent__button didagent__button__header didagent__language__button didagent__button__dark",
        role: "button",
        "aria-label": "Select language",
        "aria-haspopup": "true",
        "aria-expanded": t,
        children: h
      }
    ),
    t && /* @__PURE__ */ u("div", { className: "didagent__dropdown__container", ref: l, role: "menu", children: /* @__PURE__ */ u("div", { className: "didagent__dropdown__list", children: [
      /* @__PURE__ */ u("div", { className: "didagent__dropdown__header", children: "Language" }),
      vn.map(({ label: _, value: v }) => /* @__PURE__ */ u(I0, { label: _, value: v, onClick: g }, v))
    ] }) })
  ] }) : null;
}
const E0 = ({ children: t }) => {
  const [e, n] = A(!1), r = Z(() => {
    n((a) => !a);
  }, [n]), i = kn(() => n(!1), e);
  return /* @__PURE__ */ u(
    Wa,
    {
      className: "didagent__speaker__selector__container",
      controller: t,
      down: e,
      open: e,
      onChevronClick: r,
      children: /* @__PURE__ */ u(
        "div",
        {
          className: "didagent__audio__dropdown__container didagent__audio__speaker__dropdown__wrapper",
          role: "listbox",
          "aria-label": "Select speaker",
          ref: i,
          children: /* @__PURE__ */ u("div", { className: "didagent__audio__list__wrapper", children: /* @__PURE__ */ u(no, {}) })
        }
      )
    }
  );
}, A0 = "data:image/svg+xml,%3csvg%20width='20'%20height='21'%20viewBox='0%200%2020%2021'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M13.5417%2010.2484C13.5417%209.90318%2013.2618%209.62336%2012.9167%209.62336C12.5715%209.62336%2012.2917%209.90318%2012.2917%2010.2484H13.5417ZM5.84683%206.04679L5.9509%206.66307L5.84683%206.04679ZM7.1661%205.43188L6.82206%204.91009L6.82206%204.91009L7.1661%205.43188ZM6.43996%205.86885L6.69231%206.44064L6.43996%205.86885ZM2.78323%2014.184L2.5208%2014.7512L2.78323%2014.184ZM1.27899%2011.1054L0.655149%2011.1434L1.27899%2011.1054ZM1.63212%2013.1009L2.18233%2012.8044L1.63212%2013.1009ZM11.4167%2016.9775L11.2149%2016.3859L11.4167%2016.9775ZM12.8439%2012.4195L13.4683%2012.4485L12.8439%2012.4195ZM11.8997%2016.7317L12.2591%2017.243L11.8997%2016.7317ZM7.34855%205.31159L7.69258%205.83338L7.69258%205.83338L7.34855%205.31159ZM11.4167%203.51926L11.2149%204.11077L11.4167%203.51926ZM11.8997%203.76506L12.2591%203.25371L11.8997%203.76506ZM2.78323%206.31276L2.5208%205.74553L2.78323%206.31276ZM1.27899%209.39136L0.655149%209.35333L1.27899%209.39136ZM1.63212%207.39586L2.18233%207.69232L1.63212%207.39586ZM8.25923%2015.0362C7.97052%2014.847%207.5831%2014.9277%207.39391%2015.2164C7.20472%2015.5051%207.28539%2015.8926%207.57411%2016.0817L8.25923%2015.0362ZM7.51013%205.95367L7.69258%205.83338L7.00451%204.7898L6.82206%204.91009L7.51013%205.95367ZM1.90283%2011.0673C1.88521%2010.7782%201.875%2010.501%201.875%2010.2484H0.625C0.625%2010.533%200.636444%2010.8365%200.655149%2011.1434L1.90283%2011.0673ZM1.875%2010.2484C1.875%209.99567%201.88521%209.71852%201.90283%209.42938L0.655149%209.35333C0.636444%209.66022%200.625%209.96371%200.625%2010.2484H1.875ZM12.2917%2010.2484C12.2917%2010.6748%2012.263%2011.4575%2012.2196%2012.3905L13.4683%2012.4485C13.5114%2011.5194%2013.5417%2010.7084%2013.5417%2010.2484H12.2917ZM5.00007%206.70669C5.40642%206.70669%205.68068%206.7087%205.9509%206.66307L5.74276%205.43052C5.59964%205.45469%205.44717%205.45669%205.00007%205.45669V6.70669ZM6.82206%204.91009C6.4488%205.1562%206.3204%205.23846%206.18761%205.29706L6.69231%206.44064C6.94302%206.32999%207.17089%206.17735%207.51014%205.95367L6.82206%204.91009ZM5.9509%206.66307C6.2063%206.61994%206.45534%206.54522%206.69231%206.44064L6.18761%205.29706C6.04543%205.35981%205.896%205.40464%205.74276%205.43052L5.9509%206.66307ZM5.00007%2015.04C5.44717%2015.04%205.59964%2015.042%205.74276%2015.0662L5.9509%2013.8337C5.68068%2013.788%205.40642%2013.79%205.00007%2013.79V15.04ZM5.00007%2013.79C3.79701%2013.79%203.39093%2013.7765%203.04567%2013.6167L2.5208%2014.7512C3.17442%2015.0536%203.91327%2015.04%205.00007%2015.04V13.79ZM0.655149%2011.1434C0.713737%2012.1046%200.741742%2012.766%201.0819%2013.3973L2.18233%2012.8044C2.00044%2012.4668%201.96704%2012.1208%201.90283%2011.0673L0.655149%2011.1434ZM3.04567%2013.6167C2.71204%2013.4624%202.3567%2013.128%202.18233%2012.8044L1.0819%2013.3973C1.38451%2013.959%201.9418%2014.4833%202.5208%2014.7512L3.04567%2013.6167ZM12.2196%2012.3905C12.1603%2013.6661%2012.1175%2014.5594%2012.0013%2015.2051C11.8855%2015.848%2011.7209%2016.0934%2011.5404%2016.2203L12.2591%2017.243C12.8475%2016.8295%2013.0965%2016.1762%2013.2315%2015.4266C13.3659%2014.68%2013.4107%2013.6874%2013.4683%2012.4485L12.2196%2012.3905ZM11.6186%2017.569C11.8451%2017.4916%2012.0632%2017.3807%2012.2591%2017.243L11.5404%2016.2203C11.4414%2016.2899%2011.3294%2016.3469%2011.2149%2016.3859L11.6186%2017.569ZM7.69258%205.83338C8.76742%205.1247%209.52165%204.62895%2010.1169%204.33981C10.7104%204.05147%2011.0072%204.03991%2011.2149%204.11077L11.6186%202.92775C10.9368%202.69508%2010.259%202.88107%209.57067%203.21546C8.88394%203.54906%208.04882%204.10124%207.00451%204.7898L7.69258%205.83338ZM11.2149%204.11077C11.3294%204.14984%2011.4414%204.20686%2011.5404%204.27642L12.2591%203.25371C12.0632%203.11606%2011.8451%203.00507%2011.6186%202.92775L11.2149%204.11077ZM5.00007%205.45669C3.91327%205.45669%203.17442%205.44313%202.5208%205.74553L3.04567%206.88C3.39093%206.72026%203.79701%206.70669%205.00007%206.70669V5.45669ZM1.90283%209.42938C1.96704%208.37591%202.00044%208.02991%202.18233%207.69232L1.0819%207.0994C0.741742%207.73072%200.713737%208.39208%200.655149%209.35333L1.90283%209.42938ZM2.5208%205.74553C1.9418%206.01341%201.38451%206.53777%201.0819%207.0994L2.18233%207.69232C2.3567%207.36869%202.71204%207.03435%203.04567%206.88L2.5208%205.74553ZM7.57411%2016.0817C8.43976%2016.649%209.15622%2017.1023%209.76703%2017.3725C10.3856%2017.6461%2011.0002%2017.78%2011.6186%2017.569L11.2149%2016.3859C11.027%2016.45%2010.7656%2016.4474%2010.2727%2016.2293C9.77201%2016.0079%209.14153%2015.6144%208.25923%2015.0362L7.57411%2016.0817ZM13.4359%207.36502C13.3854%206.3424%2013.3303%205.50424%2013.1891%204.85648C13.046%204.19945%2012.792%203.62818%2012.2591%203.25371L11.5404%204.27642C11.7036%204.39113%2011.8545%204.60276%2011.9678%205.1226C12.0831%205.65169%2012.1359%206.38434%2012.1874%207.42669L13.4359%207.36502Z'%20fill='%23090604'/%3e%3cpath%20d='M16.6665%2015.2487C16.6665%2015.2487%2017.9165%2013.7487%2017.9165%2010.2487C17.9165%208.22085%2017.4969%206.86438%2017.1439%206.08203'%20stroke='%23090604'%20stroke-width='1.25'%20stroke-linecap='round'/%3e%3cpath%20d='M15%2012.7487C15%2012.7487%2015.4167%2011.9987%2015.4167%2010.2487C15.4167%209.53046%2015.3465%208.98066%2015.2637%208.58203'%20stroke='%23090604'%20stroke-width='1.25'%20stroke-linecap='round'/%3e%3cpath%20d='M18.3332%201.91797L1.6665%2018.5846'%20stroke='%23090604'%20stroke-width='1.25'%20stroke-linecap='round'/%3e%3c/svg%3e", T0 = "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='-2%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M1.27899%209.14136C1.34039%208.134%201.37109%207.63031%201.63212%207.14586C1.87061%206.70323%202.32692%206.27388%202.78323%206.06276C3.28268%205.83169%203.85514%205.83169%205.00007%205.83169C5.4268%205.83169%205.64016%205.83169%205.84683%205.79679C6.05115%205.76229%206.25039%205.70252%206.43996%205.61885C6.63171%205.53423%206.80984%205.41678%207.1661%205.18188L7.34855%205.06159C9.46769%203.66435%2010.5273%202.96573%2011.4167%203.26926C11.5872%203.32746%2011.7523%203.41146%2011.8997%203.51506C12.6687%204.05544%2012.7271%205.3127%2012.8439%207.8272C12.8872%208.75826%2012.9167%209.55512%2012.9167%209.99836C12.9167%2010.4416%2012.8872%2011.2385%2012.8439%2012.1695C12.7271%2014.684%2012.6687%2015.9413%2011.8997%2016.4817C11.7523%2016.5853%2011.5872%2016.6693%2011.4167%2016.7275C10.5273%2017.031%209.46769%2016.3324%207.34854%2014.9351L7.1661%2014.8148C6.80984%2014.5799%206.63171%2014.4625%206.43996%2014.3779C6.25039%2014.2942%206.05115%2014.2344%205.84683%2014.1999C5.64016%2014.165%205.4268%2014.165%205.00007%2014.165C3.85514%2014.165%203.28268%2014.165%202.78323%2013.934C2.32692%2013.7228%201.87061%2013.2935%201.63212%2012.8509C1.37109%2012.3664%201.34039%2011.8627%201.27899%2010.8554C1.26083%2010.5573%201.25%2010.267%201.25%209.99836C1.25%209.72969%201.26083%209.43937%201.27899%209.14136Z'%20stroke='white'%20stroke-width='1.5'/%3e%3cpath%20d='M15%207.5C15%207.5%2015.4167%208.25%2015.4167%2010C15.4167%2011.75%2015%2012.5%2015%2012.5'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'/%3e%3c/svg%3e", xi = ({ onClick: t, className: e, muted: n, title: r }) => /* @__PURE__ */ u("button", { onClick: t, title: r || "Mute Sound", className: e, "data-active": n, children: /* @__PURE__ */ u(ge, { src: n ? A0 : T0, color: n ? "#090604" : "#fff", size: "24px" }) });
function D0({ show: t }) {
  const { isSmallScreen: e } = Ae(), { speakerMuted: n, outputDevices: r, setSpeakerMuted: i } = it();
  if (!t)
    return null;
  const a = (r == null ? void 0 : r.length) > 1, o = () => i((c) => !c), s = a && !e, l = [
    "didagent__button",
    s && "didagent__button__nested__controller",
    !s && !n && "didagent__button__dark"
  ].filter(Boolean).join(" ");
  return s ? /* @__PURE__ */ u(E0, { children: /* @__PURE__ */ u(xi, { onClick: o, className: l, muted: n }) }) : /* @__PURE__ */ u(xi, { onClick: o, className: l, muted: n });
}
function O0({
  displayRestart: t,
  restartDisabled: e,
  isRestarting: n,
  isFullScreen: r,
  showControllers: i,
  blurControllers: a,
  setExpanded: o,
  onClose: s
}) {
  const { restart: l } = ye(), { configurations: c } = ce(ke), { isSmallScreen: g, isBrowserFullscreen: d, expanded: h, handleBrowserFullscreen: p } = Ae(), f = Ml("full_screen_enabled", !1), _ = c.chatMode === R.Playground, v = [R.Playground, R.TextOnly].includes(c.chatMode), y = !f || !d, C = f && !h;
  return /* @__PURE__ */ u("div", { className: "didagent__header", role: "toolbar", "aria-label": "Control header", children: [
    /* @__PURE__ */ u("div", { className: "didagent__header-left", children: i && t && c.showRestartButton && /* @__PURE__ */ u(
      "button",
      {
        onClick: l,
        disabled: e,
        title: "Restart conversation",
        "aria-label": "Restart conversation",
        role: "button",
        className: "didagent__button didagent__button__dark " + (a ? "didagent__button__blurred" : ""),
        children: /* @__PURE__ */ u(
          ge,
          {
            src: to,
            size: "24px",
            className: n ? "didagent__header__menu__item-rotate" : ""
          }
        )
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "didagent__header-right", children: [
      i && !a && /* @__PURE__ */ u(xe, { children: [
        g && !_ && /* @__PURE__ */ u(C0, {}),
        /* @__PURE__ */ u(N0, {}),
        !v && /* @__PURE__ */ u(D0, { show: i }),
        c.mode !== "full" && y && /* @__PURE__ */ u(Li, { value: r, onClick: o, blurred: a }),
        C && /* @__PURE__ */ u(
          Li,
          {
            value: d,
            onClick: p,
            blurred: a,
            mode: "browser"
          }
        ),
        !!s && !g && /* @__PURE__ */ u(
          "button",
          {
            onClick: s,
            title: "Close",
            "aria-label": "Close",
            role: "button",
            className: "didagent__button didagent__button__dark",
            children: /* @__PURE__ */ u(ge, { src: Qn, size: "1.5rem", width: "24px" })
          }
        )
      ] }),
      g && !!s && /* @__PURE__ */ u(
        "button",
        {
          onClick: s,
          title: "Close",
          "aria-label": "Close",
          role: "button",
          className: "didagent__button didagent__button__dark",
          children: /* @__PURE__ */ u(ge, { src: Qn, size: "1.5rem", width: "24px" })
        }
      )
    ] })
  ] });
}
const P0 = {
  Friendly: "ðŸ˜Š",
  Professional: "ðŸ’¼",
  Empathetic: "ðŸ’™",
  Frustrated: "ðŸ˜¤",
  Excited: "ðŸŽ‰"
};
function R0({ sentimentName: t }) {
  if (!t)
    return null;
  const e = P0[t];
  return /* @__PURE__ */ u("div", { className: "didagent__sentiment-badge", role: "status", "aria-live": "polite", children: [
    e && /* @__PURE__ */ u("span", { className: "didagent__sentiment-badge__emoji", children: e }),
    /* @__PURE__ */ u("span", { className: "didagent__sentiment-badge__text", children: t }),
    /* @__PURE__ */ u("span", { className: "didagent__sentiment-badge__pulse" })
  ] });
}
function j0({
  hasMultipleMessages: t,
  isMaintenanceMode: e,
  showReconnect: n,
  anyInterstitial: r,
  onClose: i,
  debugMode: a,
  bannerText: o
}) {
  const { expanded: s, isBrowserFullscreen: l, setExpanded: c } = Ae(), { connectionState: g, terminating: d, agentActivityState: h, sentimentData: p, agent: f } = ye();
  return /* @__PURE__ */ u(xe, { children: [
    /* @__PURE__ */ u(
      O0,
      {
        isFullScreen: s || l,
        setExpanded: c,
        displayRestart: t || e,
        restartDisabled: ![
          B.Connected,
          B.New,
          B.Disconnected,
          B.Fail
        ].includes(g),
        isRestarting: d,
        showControllers: n || !r,
        blurControllers: n,
        onClose: i
      }
    ),
    a && h === he.Talking && /* @__PURE__ */ u(R0, { sentimentName: p == null ? void 0 : p.name }),
    /* @__PURE__ */ u(v0, { content: o }),
    /* @__PURE__ */ u("div", { className: "didagent__filler" }),
    /* @__PURE__ */ u(P2, { hideAgentTitle: e, agentIcon: f == null ? void 0 : f.logo, agentName: (f == null ? void 0 : f.preview_name) ?? "Agent" })
  ] });
}
function z0(t) {
  const { isFabio: e, isStreamConnecting: n, isTextual: r, isResponseIdle: i } = t, { isMobileOrientationBlocked: a } = Ae(), { conversationStarted: o, micMuted: s, permissionAsked: l, permissionGranted: c } = it(), {
    connectionState: g,
    isRestarting: d,
    errorState: h,
    greeted: p,
    interruptAvailable: f,
    agentActivityState: _,
    streamState: v,
    streamType: y
  } = ye(), { configurations: C } = ce(ke), b = C.chatMode, w = a ?? !1, N = !w && !e && !o, j = !s && !w && !N && l && c === null, z = !w && !N && !j && n, I = [fe.TrialInsufficientCredits, fe.InsufficientCredits].includes(
    h
  ), x = !w && !N && !j && g === B.Disconnected && !r && R.Maintenance !== b && !d && !I, m = !p && ![R.Playground, R.TextOnly].includes(b), S = f && !m && _ === he.Talking, M = w || z || N || j || x, k = [
    fe.InsufficientCredits,
    fe.DeletedVoice,
    fe.DeletedAvatar
  ].includes(h), T = f && ![he.Idle, he.Talking].includes(_) || !r && !k && !i && !f || m || _ !== he.Idle && !f || (y !== void 0 && y === ze.Fluent ? v === Re.Fail : v !== Re.New);
  return {
    showMobileBlocked: w,
    showWelcomeMessage: N,
    showPermissionMessage: j,
    showConnecting: z,
    showReconnect: x,
    waitForGreeting: m,
    canInterrupt: S,
    anyInterstitial: M,
    hasBlockingErrors: k,
    disableSend: T
  };
}
function $0({ enabled: t, offline: e, onError: n, onClose: r }) {
  var Ue, at;
  const {
    streamedMessage: i,
    connectionState: a,
    agent: o,
    messages: s,
    errorState: l,
    agentActivityState: c,
    fluentStarted: g,
    legacyStarted: d
  } = ye(), {
    expanded: h,
    isBrowserFullscreen: p,
    wrapperRef: f,
    chatPosition: _,
    isHorizontal: v
  } = Ae(), { configurations: y, configure: C } = ce(ke), b = (Ue = o == null ? void 0 : o.advanced_settings) == null ? void 0 : Ue.ui_debug_mode, w = q(null), N = q(null), [j, z] = A(""), [I, x] = A(!1), [m, S] = A(!1), M = y.chatMode === R.Playground, k = y.chatMode === R.TextOnly || M, T = y.chatMode === R.Maintenance, D = ql(l), { onSend: F } = Ql({
    textRef: N,
    isTextual: k,
    offline: e,
    text: j,
    setText: z,
    onError: n
  });
  Jl(T);
  const { isResponseIdle: K, isResponseDelayed: ee, isResponseLoading: re } = Ba(c), { isStreamConnecting: Y } = Xa(a, g, d), Q = ee || re, V = y.mode === "fabio", {
    showMobileBlocked: L,
    showPermissionMessage: $,
    showConnecting: X,
    showReconnect: oe,
    canInterrupt: Ie,
    anyInterstitial: qe,
    disableSend: Ne
  } = z0({
    isFabio: V,
    isStreamConnecting: Y,
    isTextual: k,
    isResponseIdle: K
  });
  mt(Ve, [c]), t2();
  function Ve() {
    w.current && w.current.scrollTo({ top: w.current.scrollHeight, behavior: "smooth" });
  }
  E(() => {
    var ve;
    c === he.Idle && ((ve = N.current) == null || ve.focus());
  }, [c, i]), E(() => {
    (I || T || M) && C({ loaderConfig: { ...y.loaderConfig, show: !1 } });
  }, [C, I, y.chatMode]);
  const $e = () => {
    var ot, Je;
    const ve = { opacity: +!!((ot = y.loaderConfig) != null && ot.show) };
    if (M && _ === "bottom") {
      const U = (Je = w.current) == null ? void 0 : Je.parentElement, te = (U == null ? void 0 : U.getBoundingClientRect().height) ?? 0;
      ve.paddingBottom = `${te}px`;
    }
    return y.loaderConfig.style === "opaque" ? {
      ...ve,
      "--background-color": "var(--did-primary-black-90)"
    } : {
      ...ve,
      "--background-color": "var(--did-primary-black-00030)",
      "--backdrop-filter": "blur(4px)"
    };
  }, Ze = a !== B.Connected && a !== B.Disconnected || X, O = M || (at = o == null ? void 0 : o.presenter) == null ? void 0 : at.idle_video, H = _.includes("side"), W = _.includes("bottom"), le = _ === "closed-bottom" || _ === "closed-side", de = h && !p, Te = v ? "horizontal" : "vertical", _e = s.length > 1, Oe = {
    enabled: t,
    text: j,
    setText: z,
    onSend: F,
    messageRef: w,
    textRef: N,
    isTextual: k,
    isActualLoading: Q,
    scrollToBottom: Ve,
    setPermissionHelper: S,
    disableSend: Ne,
    canInterrupt: Ie,
    isHistoryMode: oe
  };
  return Yl({
    showReconnect: oe,
    isChatClosed: le,
    connectionState: a,
    textRef: N,
    chatPosition: _
  }), /* @__PURE__ */ u(xe, { children: [
    de && /* @__PURE__ */ u("div", { className: "didagent__backdrop" }),
    /* @__PURE__ */ u(
      "div",
      {
        className: "didagent__main__wrapper",
        role: "application",
        "aria-label": "AI Agent Video Chat",
        "data-expanded": de,
        "data-chatmode": y.chatMode,
        "data-orientation": Te,
        ref: f,
        children: [
          H && /* @__PURE__ */ u(ki, { ...Oe }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "didagent__embedded__container",
              "data-chat": _,
              "data-orientation": Te,
              children: [
                /* @__PURE__ */ u(
                  O2,
                  {
                    loaderStyle: $e(),
                    idleVideo: O,
                    isMaintenanceMode: T,
                    onIdleLoad: () => x(!0)
                  }
                ),
                /* @__PURE__ */ u(
                  j0,
                  {
                    hasMultipleMessages: _e,
                    isMaintenanceMode: T,
                    showReconnect: oe,
                    anyInterstitial: qe,
                    onClose: r,
                    debugMode: b,
                    bannerText: D
                  }
                ),
                m && /* @__PURE__ */ u(q2, { setModalOpen: S }),
                /* @__PURE__ */ u(
                  Y2,
                  {
                    showWelcomeScreen: Ze,
                    isFabio: V,
                    showConnecting: X,
                    showPermissionMessage: $,
                    showReconnect: oe,
                    showMobileBlocked: L
                  }
                ),
                !qe && !T && /* @__PURE__ */ u(
                  _0,
                  {
                    hasMultipleMessages: _e,
                    loaderShow: y.loaderConfig.show,
                    disableSend: Ne,
                    onSend: F,
                    setPermissionHelper: S,
                    isTextual: k
                  }
                ),
                W && /* @__PURE__ */ u(ki, { ...Oe })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function ro({
  offline: t,
  isOwner: e,
  didApiUrl: n,
  didSocketApiUrl: r,
  customMixpanelKey: i,
  enabled: a = !0,
  onAgentReady: o,
  onError: s,
  onClose: l
}) {
  const { configurations: c } = ce(ke);
  return window.localStorage.setItem("track_enabled", (c.track ?? !0).toString()), Fn.mixpanelKey = i || Fn.mixpanelKey, ia((g) => s == null ? void 0 : s(g, {})), /* @__PURE__ */ u(Dt, { fallback: null, children: /* @__PURE__ */ u(
    xl,
    {
      auth: c.auth,
      didApiUrl: n ?? Ls,
      didSocketApiUrl: r ?? xs,
      children: /* @__PURE__ */ u(
        Tl,
        {
          agentId: c.agentId,
          enabled: a,
          onAgentReady: o,
          onError: s,
          children: /* @__PURE__ */ u(Ol, { children: /* @__PURE__ */ u(Ul, { children: /* @__PURE__ */ u(
            $0,
            {
              enabled: a,
              offline: t,
              isOwner: e,
              onError: s,
              onClose: l
            }
          ) }) })
        }
      )
    }
  ) });
}
const F0 = 400, Xn = 330, io = 640, yn = 2, ao = (t) => t ? 16 / 9 : 2 / 3.3, er = (t, e) => e ? t >= 1440 ? 984 : t >= 1280 ? 752 : 656 : io, B0 = (t, e) => {
  const n = ao(t);
  let r;
  t ? r = er(window.innerWidth, e) : r = Xn;
  const i = t ? r / n : Xn / n;
  return { width: r, height: i };
}, V0 = (t, e, n) => {
  if (t.useTargetElementPosition) {
    const o = t.targetElement.getBoundingClientRect();
    return {
      x: t.position === "left" ? o.x - e : o.x,
      y: o.y - n
    };
  }
  const r = window.innerHeight * yn / 100, i = window.innerHeight * yn / 100;
  return {
    x: t.position === "right" ? window.innerWidth - e - i : i,
    y: window.innerHeight - n - r
  };
}, Zt = (t, e, n) => {
  const r = B0(e, n);
  return { position: V0(t, r.width, r.height), size: r };
}, U0 = (t, e) => {
  if (t.useTargetElementPosition) {
    const r = t.targetElement.getBoundingClientRect(), i = e.getBoundingClientRect();
    return {
      left: t.position === "left" ? r.x - i.width : r.x,
      top: r.top - i.height
    };
  }
  return null;
}, H0 = ({ children: t, show: e }) => {
  const n = q(!1), { configurations: r } = ce(ke), { expanded: i, wrapperRef: a, chatPosition: o, isSmallScreen: s, updateLayout: l, isChatOpen: c } = Ae(), g = Me(() => !i && !s, [i, s]), d = r.orientation === "horizontal" && g, h = ao(d), p = q(c), { enrichSdkAnalytics: f } = ye();
  E(() => {
    p.current = c;
  }, [c]);
  const [_, v] = A(Zt(r, d, c).position), [y, C] = A(Zt(r, d, c).size), b = q(_), w = q(y);
  E(() => {
    b.current = _;
  }, [_]), E(() => {
    w.current = y;
  }, [y]);
  const N = (m, S, M = window.innerWidth) => {
    let k;
    const T = M;
    return r.orientation === "vertical" ? k = Xn : k = er(M, p.current), m = Math.max(m, k), m = Math.min(m, T), d ? S = m / h : S = Math.max(S, F0), { width: m, height: S };
  };
  E(() => (n.current = !0, () => {
    n.current = !1;
  }), []);
  const j = (m, S, M, k, T = !1) => {
    let D = 0, F = 0, K = Math.max(window.innerWidth - M, 0), ee = Math.max(window.innerHeight - k, 0);
    if (T) {
      const re = window.innerHeight * yn / 100, Y = window.innerHeight * yn / 100;
      D = re, K = Math.max(window.innerWidth - M - re, D), F = Y, ee = Math.max(window.innerHeight - k - Y, F);
    }
    return {
      x: Math.min(Math.max(0, m), K),
      y: Math.min(Math.max(0, S), ee)
    };
  }, z = Z(() => {
    const m = Zt(r, d, c);
    v(m.position), C(m.size);
  }, [Zt]);
  E(() => {
    e && !i && !s && z();
  }, [r.position, e, i, s, z]), E(() => {
    const m = () => {
      var D, F;
      const S = (F = (D = a == null ? void 0 : a.current) == null ? void 0 : D.getBoundingClientRect) == null ? void 0 : F.call(D);
      if (!S) return;
      const { width: M, height: k } = N(S.width, S.height, window.innerWidth), T = j(b.current.x, b.current.y, M, k);
      C({ width: M, height: k }), w.current = { width: M, height: k }, v(T), b.current = T;
    };
    return window.addEventListener("resize", m), () => window.removeEventListener("resize", m);
  }, [a, r.orientation, c]);
  const I = Z(
    (m) => {
      const S = m.target;
      if (!(a != null && a.current)) return;
      const M = S.classList.contains("didagent__resize__handle"), k = m.clientX, T = m.clientY, D = { x: b.current.x, y: b.current.y }, F = { width: w.current.width, height: w.current.height }, K = (re) => {
        const Y = re.clientX - k, Q = re.clientY - T;
        let V = F.width, L = F.height;
        const $ = { ...D };
        if (M) {
          switch (S.dataset.edge || "bottom-right") {
            case "right":
              V = F.width + Y, L = V / h;
              break;
            case "left":
              V = F.width - Y, $.x = D.x + Y, L = V / h;
              break;
            case "bottom":
              L = F.height + Q, V = L * h;
              break;
            case "top":
              L = F.height - Q, $.y = D.y + Q, V = L * h;
              break;
            case "bottom-right":
              V = F.width + Y, L = V / h;
              break;
            case "bottom-left":
              V = F.width - Y, $.x = D.x + Y, L = V / h;
              break;
            case "top-right":
              V = F.width + Y, L = V / h, $.y = D.y + Q;
              break;
            case "top-left":
              V = F.width - Y, $.x = D.x + Y, $.y = D.y + Q, L = V / h;
              break;
          }
          const oe = N(V, L), Ie = j(
            $.x,
            $.y,
            oe.width,
            oe.height
          );
          C(oe), w.current = oe, v(Ie), b.current = Ie;
        } else {
          const X = D.x + Y, oe = D.y + Q, Ie = j(X, oe, F.width, F.height);
          v(Ie), b.current = Ie;
        }
      }, ee = () => {
        l(), window.removeEventListener("mousemove", K), window.removeEventListener("mouseup", ee), f({
          agents_component_size: `${w.current.width}x${w.current.height}`,
          window_size: `${window.innerWidth}x${window.innerHeight}`
        });
      };
      window.addEventListener("mousemove", K), window.addEventListener("mouseup", ee);
    },
    [a, r.orientation, l]
  );
  E(() => {
    if (g && (a != null && a.current))
      return a.current.addEventListener("mousedown", I), () => a.current.removeEventListener("mousedown", I);
  }, [g, I, a]);
  const x = Me(() => {
    const m = {};
    return g && (m.position = "fixed", m.left = `${_.x}px`, m.top = `${_.y}px`, m.zIndex = 999999, m.width = `${y.width}px`, m.height = `${y.height}px`), m;
  }, [g, _, y]);
  return E(() => {
    if (r.orientation === "horizontal") {
      const m = w.current.width || io, S = window.innerWidth, M = er(S, c);
      if (m !== M) {
        const k = M, T = k / h, D = { width: k, height: T };
        let F = b.current.x;
        k > m && (F = b.current.x + m / 2 - k / 2);
        const K = j(F, b.current.y, k, T, !0);
        C(D), w.current = D, v(K), b.current = K;
      }
      l();
    }
  }, [c, r.orientation, h, l]), E(() => {
    const m = () => {
      var k, T;
      if (!(a != null && a.current)) return;
      const M = (T = (k = a.current).getBoundingClientRect) == null ? void 0 : T.call(k);
      if (M)
        if (c) {
          const { width: D, height: F } = N(M.width, M.height), K = j(b.current.x, b.current.y, D, F);
          C({ width: D, height: F }), w.current = { width: D, height: F }, v(K), b.current = K;
        } else {
          const D = Zt(r, d, c);
          C(D.size), w.current = D.size, v(D.position), b.current = D.position;
        }
    }, S = () => {
      m();
    };
    return window.addEventListener("resize", S), m(), () => {
      window.removeEventListener("resize", S);
    };
  }, [c, r.orientation]), E(() => {
    e || setTimeout(() => {
      n.current && z();
    }, 500);
  }, [e, z]), E(() => {
    s || z();
  }, [s]), /* @__PURE__ */ u(
    "div",
    {
      className: "didagent__fabio__container " + (g ? " didagent__draggable__resizable" : ""),
      "data-dragged": g,
      "data-enabled": e,
      "data-position": r.position,
      "data-chat": o,
      "data-orientation": r.orientation,
      ref: a,
      style: x,
      children: [
        t,
        g && /* @__PURE__ */ u(xe, { children: [
          /* @__PURE__ */ u("div", { className: "didagent__resize__handle top-left", "data-edge": "top-left" }),
          /* @__PURE__ */ u("div", { className: "didagent__resize__handle top-right", "data-edge": "top-right" }),
          /* @__PURE__ */ u("div", { className: "didagent__resize__handle bottom-left", "data-edge": "bottom-left" }),
          /* @__PURE__ */ u("div", { className: "didagent__resize__handle bottom-right", "data-edge": "bottom-right" }),
          /* @__PURE__ */ u("div", { className: "didagent__resize__handle left", "data-edge": "left" }),
          /* @__PURE__ */ u("div", { className: "didagent__resize__handle right", "data-edge": "right" }),
          /* @__PURE__ */ u("div", { className: "didagent__resize__handle top", "data-edge": "top" }),
          /* @__PURE__ */ u("div", { className: "didagent__resize__handle bottom", "data-edge": "bottom" })
        ] })
      ]
    }
  );
};
function Z0(t, e) {
  return {
    cursor: t ? "pointer" : "progress",
    opacity: e || !t ? "0" : "1",
    pointerEvents: e || !t ? "none" : "auto",
    border: "none"
  };
}
function K0(t) {
  var C;
  const [e, n] = A(), [r, i] = A(!1), { configurations: a } = ce(ke), { trackUi: o } = Mt(), { opened: s, setOpened: l, setIsChatOpen: c, setExpanded: g } = Ae(), [d, h] = A(!s), p = q(null), f = p.current ? U0(a, p.current) : null;
  if (E(() => {
    s && h(!1);
  }, [s]), E(() => {
    var b;
    e && !((b = e.presenter) != null && b.idle_video) && e.preview_thumbnail && i(!0);
  }, [e]), !a.visible)
    return null;
  const _ = (b) => {
    n(b);
  }, v = () => {
    var b;
    l(!1), setTimeout(() => {
      c(!1), g(!1);
    }, 500), (b = window.dataLayer) == null || b.push({ event: "close_widget" });
  }, y = (e == null ? void 0 : e.preview_url) ?? ((C = e == null ? void 0 : e.presenter) == null ? void 0 : C.idle_video);
  return /* @__PURE__ */ u(
    "span",
    {
      ref: p,
      className: "didagent__fabio",
      "data-position": f ? "" : a.position,
      "data-enabled": s,
      style: f ? { left: `${f.left}px`, top: `${f.top}px` } : {},
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            "data-testid": "didagent__fabio__button",
            style: Z0(r, s),
            onClick: () => {
              var b;
              (b = window.dataLayer) == null || b.push({ event: "open_widget" }), r && (o("agent-fab", { event: "click" }), l(!0), a.openMode === "expanded" && g(!0));
            },
            "aria-label": "Open video chat",
            "aria-hidden": s,
            tabIndex: s ? -1 : 0,
            children: [
              d && /* @__PURE__ */ u("span", { className: "didagent__fabio__notification", children: "1" }),
              /* @__PURE__ */ u(
                "video",
                {
                  src: y,
                  poster: y || e == null ? void 0 : e.preview_thumbnail,
                  "aria-label": "toggle fabio",
                  autoPlay: !0,
                  playsInline: !0,
                  loop: !0,
                  muted: !0,
                  style: { WebkitUserSelect: "none" },
                  disableRemotePlayback: !0,
                  onLoadedData: () => {
                    i(!0), o("agent-fab", { event: "view" });
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ u(H0, { show: s, children: /* @__PURE__ */ u(ro, { ...t, enabled: s, onAgentReady: _, onClose: v }) })
      ]
    }
  );
}
let On = [];
function W0() {
  if (On.length === 0) {
    const t = document.getElementById("d-id-agent-style");
    On = t ? [t] : [];
  }
  return On;
}
function G0(t) {
  const e = q(null), { configurations: n } = ce(ke), [r, i] = A();
  return E(() => {
    const a = W0();
    if (n.agentId) {
      if (!n.auth)
        throw new Error("No auth provider");
    } else throw new Error("No agent provider");
    if (n.mode === "fabio") {
      if (e.current) {
        const o = e.current.shadowRoot ? e.current.shadowRoot : e.current.attachShadow({ mode: "open" });
        a.forEach((s) => o.appendChild(s)), i(mn(/* @__PURE__ */ u(K0, { ...t }), o));
      }
    } else if (n.mode === "full") {
      const o = typeof n.targetElement == "string" ? document.getElementById(n.targetElement) : n.targetElement;
      if (n.targetElement) {
        if (!o)
          throw new Error(`No target element for id: ${n.targetElement}`);
      } else throw new Error("No target element id");
      const s = o.shadowRoot ? o.shadowRoot : o.attachShadow({ mode: "open" });
      a.forEach((l) => s.appendChild(l)), i(mn(/* @__PURE__ */ u(ro, { ...t }), s));
    } else
      throw new Error("Invalid mode");
  }, [n.mode, n.targetElement, n.agentId, n.auth]), /* @__PURE__ */ u(xe, { children: [
    /* @__PURE__ */ u("div", { ref: e, "data-testid": "didagent_root" }),
    r
  ] });
}
function q0(t) {
  "requestIdleCallback" in window ? requestIdleCallback(t, { timeout: 2e3 }) : setTimeout(t, 0);
}
function Y0() {
  const t = document.querySelector('link[href="https://fonts.googleapis.com"]'), e = document.querySelector('link[href="https://fonts.gstatic.com"]');
  if (!t) {
    const n = document.createElement("link");
    n.rel = "preconnect", n.href = "https://fonts.googleapis.com", document.head.appendChild(n);
  }
  if (!e) {
    const n = document.createElement("link");
    n.rel = "preconnect", n.href = "https://fonts.gstatic.com", n.crossOrigin = "anonymous", document.head.appendChild(n);
  }
}
function J0() {
  const t = document.createElement("link");
  t.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap", t.rel = "stylesheet", t.media = "print", t.onload = () => {
    t.media = "all";
  }, document.head.appendChild(t);
}
function Q0() {
  const t = document.createElement("link");
  t.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400..700&display=swap", t.rel = "stylesheet", t.media = "print", t.onload = () => {
    t.media = "all";
  }, document.head.appendChild(t);
}
function X0() {
  Y0(), q0(() => {
    J0(), Q0();
  });
}
function Ii(t) {
  window.DID_AGENTS_API = {
    callbacks: t.callbacks,
    functions: {},
    events: {
      on: wt.on,
      off: wt.off
    }
  }, window.dataLayer = window.dataLayer || [], X0();
  const {
    onError: e,
    isOwner: n,
    enabled: r,
    didSocketApiUrl: i,
    didApiUrl: a,
    customMixpanelKey: o,
    offline: s,
    monitor: l = !0,
    enableFeatureFlags: c = !0,
    ...g
  } = t;
  if (g.mode === "full" && g.orientation !== "vertical" && (g.orientation = "vertical"), !t.targetElement && g.mode === "full")
    throw new Error("No target element provided for full mode");
  if (g.agentId) {
    if (!g.auth)
      throw new Error("No auth provider");
  } else throw new Error("No agent provider ");
  const d = typeof t.targetElement == "string" ? document.getElementById(t.targetElement) : t.targetElement, h = document.createElement("div");
  h.className = "didagent_target", document.body.appendChild(h);
  const p = (v, y) => {
    var C;
    (C = window.DD_RUM) == null || C.addError(v, y), e == null || e(v, y);
  }, f = setInterval(() => {
    d && !document.body.contains(d) && (pt(null, h), h.remove(), clearInterval(f));
  }, 2e3);
  pt(
    /* @__PURE__ */ u(xe, { children: /* @__PURE__ */ u(pl, { children: /* @__PURE__ */ u(bl, { enableFeatureFlags: c, children: /* @__PURE__ */ u(ml, { initialConfigurations: { ...g, targetElement: d }, children: /* @__PURE__ */ u(Dl, { children: /* @__PURE__ */ u(
      G0,
      {
        isOwner: n,
        offline: s,
        didApiUrl: a,
        didSocketApiUrl: i,
        customMixpanelKey: o,
        enabled: r,
        onError: p
      }
    ) }) }) }) }) }),
    h
  );
  const _ = () => {
    clearInterval(f), pt(null, h), h.parentNode && h.remove();
  };
  return { api: window.DID_AGENTS_API, dataLayer: window.dataLayer, destroy: _ };
}
function Ni(t) {
  const { token: e, username: n, password: r, clientKey: i } = t;
  if (!i) {
    if (!e) {
      if (!n || !r)
        throw new Error("Failed to load agent. No auth method provided");
      return { type: "basic", username: n, password: r };
    }
    return { type: "bearer", token: e };
  }
  return { type: "key", clientKey: i };
}
const ed = (t) => {
  const e = {};
  return Array.from(t).forEach((n) => {
    if (n.name.startsWith("data-mixpanel-property-")) {
      const r = n.name.replace("data-mixpanel-property-", "");
      e[r] = n.value;
    }
  }), e;
};
{
  const t = document.querySelector('script[data-name="did-agent"]');
  if (t) {
    const e = new URLSearchParams(""), n = e.get("mode") || (t.getAttribute("data-mode") ?? "fabio"), r = t.getAttribute("data-target-id"), i = e.get("agent_id") || t.getAttribute("data-agent-id"), a = t.getAttribute("data-api-url"), o = t.getAttribute("data-token"), s = t.getAttribute("data-username"), l = t.getAttribute("data-password"), c = e.get("key") || t.getAttribute("data-client-key"), g = e.get("chat_mode") || (t.getAttribute("data-chat-mode") ?? R.Functional), d = t.getAttribute("data-track") !== "false", h = t.getAttribute("data-monitor") !== "false", p = t.getAttribute("data-feature-flag") !== "false", f = t.getAttribute("data-position") ?? "right", _ = t.getAttribute("data-orientation") ?? "vertical", v = t.getAttribute("data-open-mode") ?? "compact", y = t.getAttribute("data-external-id") || void 0, C = t.getAttribute("data-mixpanel-key") || void 0, b = ed(t.attributes), w = t.getAttribute("data-speech-silence-timeout-ms") || void 0, N = t.getAttribute("data-auto-connect") === "true", j = t.getAttribute("data-show-restart-button") !== "false", z = t.getAttribute("data-show-agent-name") !== "false";
    if (i) {
      if (!Object.values(R).includes(g))
        throw new Error(`Invalid chat mode, must be one of: ${Object.values(R).join(", ")}`);
    } else throw new Error("No agent id");
    window.DID_AGENTS_API = {};
    const I = { didApiUrl: a, monitor: h, enableFeatureFlags: p }, x = {
      mode: n,
      targetElement: r,
      auth: Ni({ token: o, username: s, password: l, clientKey: c }),
      agentId: i,
      track: d,
      chatMode: g,
      position: f,
      orientation: _,
      openMode: v,
      externalId: y,
      customMixpanelKey: C,
      mixpanelAdditionalProperties: b,
      speechSilenceTimeoutMs: w,
      autoConnect: N,
      showRestartButton: j,
      showAgentName: z
    };
    Ii({ ...x, ...I });
  } else
    window.DID_AGENT_INIT = ({ token: e, username: n, password: r, clientKey: i, ...a }) => Ii({ ...a, auth: Ni({ token: e, username: n, password: r, clientKey: i }) });
}
export {
  od as a,
  Ni as b,
  ad as c,
  vc as g,
  Ii as i,
  id as t
};