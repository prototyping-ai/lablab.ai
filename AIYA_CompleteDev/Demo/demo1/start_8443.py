import http.server
import ssl

PORT = 8443

# --- Custom handler with CORS ---
class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow all origins (for dev, you can later restrict to your domain)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    # Handle preflight OPTIONS request
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.end_headers()

# --- SSL setup ---
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile="/var/www/server.crt", keyfile="/var/www/server.key")

# --- HTTP server ---
server_address = ('0.0.0.0', PORT)
httpd = http.server.HTTPServer(server_address, CORSRequestHandler)

# Wrap with SSL
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Serving HTTPS on port {PORT} with CORS enabled")
httpd.serve_forever()