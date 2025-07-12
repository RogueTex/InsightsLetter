from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from insight_generator import get_insight

app = FastAPI()

# Allow frontend access (update origin if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to GitHub Pages URL in production
    allow_methods=["POST"],
    allow_headers=["*"]
)

class RequestModel(BaseModel):
    topic: str

@app.post("/process")
def process(req: RequestModel):
    summary = get_insight(req.topic)
    return {
        "title": f"Trending insights on {req.topic}",
        "summary": summary,
        "generated_by": "OpenRouter"
    }
