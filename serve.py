"""Dev server for yuqi-site — behaves like GitHub Pages.

Same as `python -m http.server` plus extensionless resolution:
    /download  ->  serves download.html  (like GitHub Pages does)
    /          ->  index.html            (default behavior)

Run:  python serve.py            (serves this folder on :4000)
      python serve.py 8080       (custom port)
"""
import http.server
import os
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4000


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        path = urllib.parse.urlparse(self.path).path
        if not os.path.splitext(path)[1] and not path.endswith("/"):
            for cand in (path + ".html", path + "/index.html"):
                if os.path.isfile(self.translate_path(cand)):
                    query = urllib.parse.urlparse(self.path).query
                    self.path = cand + (("?" + query) if query else "")
                    break
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(("", PORT), Handler) as srv:
        print(f"Serving yuqi-site at http://localhost:{PORT}")
        srv.serve_forever()
