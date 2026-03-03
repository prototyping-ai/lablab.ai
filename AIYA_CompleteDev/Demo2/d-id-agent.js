import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // allow all origins for dev

// --- Replace with your D-ID API key ---
const DID_API_KEY = "ZG9tYWluZWJpekBnbWFpbC5jb20:x6asHiRVsP0LkbUCGErj3"; 
const AVATAR_ID = "v2_agt_usa6DLuf"; 

// --- Proxy endpoint ---
app.post("/avatar-stream", async (req, res) => {
  const { text } = req.body;

  try {
    const payload = {
      script: { type: "text", input: text },
      config: { voice: "alloy", output_format: "mp4", face: AVATAR_ID }
    };

    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("D-ID API error:", data);
      return res.status(500).json(data);
    }

    // Return video URL to front-end
    res.json({ videoUrl: data.result_url });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("D-ID backend running on port 3000"));