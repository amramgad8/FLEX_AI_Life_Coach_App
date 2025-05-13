# src/main.py
from .services.api import app  # Import the app from services.api

# The app instance from services.api is already configured with CORS and endpoints.
# We can add additional routes specific to main.py if necessary.
# For example, a root endpoint:
@app.get("/")
async def root():
    return {"message": "Productivity AI Assistant API - Root"}

# To run the application, use a command like:
# uvicorn src.main:app --reload
# This will serve the 'app' object defined in this file,
# which is the FastAPI application instance from src.services.api.