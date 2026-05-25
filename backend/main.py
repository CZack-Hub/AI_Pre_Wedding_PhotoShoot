import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import boto3
from botocore.config import Config
from supabase import create_client, Client
import redis
import logging

from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("itvoice-backend")

app = FastAPI(
    title="ITVoice AI Pre-Wedding Studio API",
    description="Python FastAPI backend providing AI pipeline integrations, Supabase, Cloudflare R2, and Redis tasks.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase_client: Client = None
try:
    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info("Supabase client initialized successfully.")
except Exception as e:
    logger.error(f"Error initializing Supabase client: {e}")

# Initialize Cloudflare R2 (S3-compatible) client
r2_client = None
try:
    if settings.CF_R2_ENDPOINT_URL and settings.CF_R2_ACCESS_KEY_ID and settings.CF_R2_SECRET_ACCESS_KEY:
        r2_client = boto3.client(
            service_name="s3",
            endpoint_url=settings.CF_R2_ENDPOINT_URL,
            aws_access_key_id=settings.CF_R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.CF_R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4")
        )
        logger.info("Cloudflare R2 boto3 client initialized successfully.")
    else:
        logger.warning("Cloudflare R2 credentials missing. Storage client not initialized.")
except Exception as e:
    logger.error(f"Error initializing Cloudflare R2 client: {e}")

# Initialize Redis client
redis_client = None
try:
    if settings.REDIS_URL:
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        # Attempt a ping to check connection in a non-blocking way or log status
        logger.info("Redis client configured.")
except Exception as e:
    logger.error(f"Error configuring Redis client: {e}")


@app.get("/api/health")
async def health_check():
    supabase_status = "ok" if supabase_client is not None else "not configured"
    r2_status = "ok" if r2_client is not None else "not configured"
    
    redis_status = "unknown"
    if redis_client:
        try:
            redis_client.ping()
            redis_status = "ok"
        except Exception:
            redis_status = "unavailable"
    else:
        redis_status = "not configured"

    return {
        "status": "success",
        "message": "ITVoice Python FastAPI backend is running",
        "services": {
            "supabase": supabase_status,
            "cloudflare_r2": r2_status,
            "redis": redis_status
        }
    }


if __name__ == "__main__":
    logger.info(f"Starting server on port {settings.PORT}...")
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
