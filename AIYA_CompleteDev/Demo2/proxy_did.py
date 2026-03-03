# proxy_did.py
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import requests

PORT = 3000
CLIENT_KEY = "Z29vZ2xlLW9hdXRoMnwxMDcyMDgyMTI2MDEwNTk4MzQ2NDQ6UDVJYUtPQXhNaXdDMFQ1RDhGRmds"
AVATAR_ID = "v2_agt_usa6DLuf"

class Handler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_headers()

    def do_POST(self):
        if self.path != "/avatar-stream":
            self.send_response(404)
            self._set_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
            return

        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        data = json.loads(body)
        text = data.get("text", "")

        # Forward to D-ID Agents API
        headers = {
            "Authorization": f"Bearer {CLIENT_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "message": text
        }

        url = f"https://api.d-id.com/agents/{AVATAR_ID}/messages"

        resp = requests.post(url, headers=headers, json=payload)
        response_data = resp.json()

        self.send_response(200)
        self._set_headers()
        self.wfile.write(json.dumps(response_data).encode())

if __name__ == "__main__":
    server = HTTPServer(('', PORT), Handler)
    print(f"Python proxy running on port {PORT}")
    server.serve_forever()