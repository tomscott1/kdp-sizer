from fastapi import FastAPI

app = FastAPI()

# define api routes

@app.get("/api/healthcheck")
def health_check():
    return {"message": "API is running"}





# from http.server import BaseHTTPRequestHandler, HTTPServer
# import cgi
# import os

# class RequestHandler(BaseHTTPRequestHandler):
#     def do_POST(self):
#         if self.path == '/api/process':
#             content_type, pdict = cgi.parse_header(self.headers.get('Content-Type'))
#             if content_type == 'multipart/form-data':
#                 pdict['boundary'] = bytes(pdict['boundary'], 'utf-8')
#                 pdict['CONTENT-LENGTH'] = int(self.headers.get('Content-Length'))
#                 fields = cgi.parse_multipart(self.rfile, pdict)
#                 uploaded_file = fields.get('file')[0]

#                 # Save the uploaded file
#                 upload_path = "/path/to/upload/folder/uploaded_file.pdf"
#                 with open(upload_path, 'wb') as output_file:
#                     output_file.write(uploaded_file)

#                 # Process the file (replace this with your processing logic)
#                 processed_file_path = self.process_file(upload_path)

#                 # Return the processed file
#                 self.send_response(200)
#                 self.send_header('Content-Type', 'application/pdf')
#                 self.send_header('Content-Disposition', 'attachment; filename="processed_file.pdf"')
#                 self.end_headers()
#                 with open(processed_file_path, 'rb') as processed_file:
#                     self.wfile.write(processed_file.read())

#     def process_file(self, file_path):
#         # Dummy processing: just renaming the file for this example
#         processed_file_path = file_path.replace('uploaded_file', 'processed_file')
#         os.rename(file_path, processed_file_path)
#         return processed_file_path

# def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
#     server_address = ('', port)
#     httpd = server_class(server_address, handler_class)
#     print(f'Starting server on port {port}...')
#     httpd.serve_forever()

# if __name__ == '__main__':
#     run()
