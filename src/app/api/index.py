from fastapi import FastAPI

app = FastAPI()

# define api routes

@app.get("/api/healthcheck")
def health_check():
    return {"message": "API is running"}