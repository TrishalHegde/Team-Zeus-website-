from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import Routers
from api.auth import router as auth_router
from api.students import router as students_router
from api.assignments import router as assignments_router
from api.submissions import router as submissions_router
from api.admin import router as admin_router
from api.webhooks import router as webhooks_router

app = FastAPI(title="C-Grade Automator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router, prefix="/api")
app.include_router(students_router, prefix="/api")
app.include_router(assignments_router, prefix="/api")
app.include_router(submissions_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(webhooks_router, prefix="/api")

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "C-Grade API is running"}
