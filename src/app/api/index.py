from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List
import requests
import os
from dotenv import load_dotenv
import fitz  # PyMuPDF
from io import BytesIO

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

BLOB_READ_WRITE_TOKEN = os.getenv('BLOB_READ_WRITE_TOKEN')
VERCEL_API_URL = "https://blob.vercel-storage.com"
API_VERSION = "4"

class UrlInput(BaseModel):
    url: str
    pathname: str

class BlobUrls(BaseModel):
    urls: List[UrlInput]

@app.post("/api/download-input-files")
async def download_input_files(blob_urls: BlobUrls):
    headers = {
        "authorization": f"Bearer {BLOB_READ_WRITE_TOKEN}",
        "x-api-version": API_VERSION,
    }

    if not BLOB_READ_WRITE_TOKEN:
        raise EnvironmentError("BLOB_READ_WRITE_TOKEN environment variable is not set")

    # Ensure the downloads directory exists
    if not os.path.exists('./downloads'):
        os.makedirs('./downloads')

    processed_files = []
    print("Beggining download of input files")
    for item in blob_urls.urls:
        print(f"Downloading file from {item.url}")
        response = requests.get(item.url, headers=headers)
        if response.status_code == 200:
            # Open the PDF document from the response content
            pdf_document = fitz.open(stream=response.content, filetype="pdf")
            processed_pdf_stream = BytesIO()

            # Create a new PDF to hold the processed pages
            new_pdf = fitz.open()

            # Process each page to reduce its size by 50%
            for page_number in range(len(pdf_document)):
                page = pdf_document.load_page(page_number)
                pix = page.get_pixmap(matrix=fitz.Matrix(0.5, 0.5))  # Scale the pixmap by 50%

                # Create a new PDF page with the reduced image
                new_page = new_pdf.new_page(width=pix.width, height=pix.height)
                new_page.insert_image(new_page.rect, pixmap=pix)

            new_pdf.save(processed_pdf_stream)
            new_pdf.close()
            processed_pdf_stream.seek(0)

            # Upload the processed PDF to Vercel Blob
            upload_response = requests.put(
                f"{VERCEL_API_URL}/processed-{item.pathname}",
                headers={
                    "authorization": f"Bearer {BLOB_READ_WRITE_TOKEN}",
                    "x-api-version": API_VERSION,
                    "content-type": "application/pdf"
                },
                data=processed_pdf_stream
            )

            if upload_response.status_code == 200:
                processed_files.append(upload_response.json())
            else:
                raise HTTPException(status_code=400, detail=f"Failed to upload file to Vercel Blob: {upload_response.text}")
        else:
            raise HTTPException(status_code=400, detail=f"Failed to download file from {item.url}")
    
    return {"processed_files": processed_files}

    
    return {"processed_files": processed_files}

@app.get("/api/healthcheck")
def health_check():
    token = os.environ.get('BLOB_READ_WRITE_TOKEN')
    print(f"BLOB_READ_WRITE_TOKEN: {token}")
    return {"message": "API is running"}
