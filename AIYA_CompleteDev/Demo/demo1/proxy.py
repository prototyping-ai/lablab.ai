# cors_server.py
from http.server import HTTPServer, SimpleHTTPRequestHandler

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow all origins (or replace '*' with 'http://localhost:3000' if needed)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

if __name__ == "__main__":
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print("Serving on http://localhost:8080 with CORS enabled")
    httpd.serve_forever()