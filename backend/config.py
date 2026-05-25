import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    PORT: int = 5000
    ENVIRONMENT: str = "development"
    
    # Supabase (PostgreSQL & Auth)
    SUPABASE_URL: str = "https://your-supabase-project.supabase.co"
    SUPABASE_KEY: str = "your-supabase-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    
    # Cloudflare R2 (File Storage)
    CF_R2_ACCESS_KEY_ID: Optional[str] = None
    CF_R2_SECRET_ACCESS_KEY: Optional[str] = None
    CF_R2_ENDPOINT_URL: Optional[str] = None
    CF_R2_BUCKET_NAME: Optional[str] = None
    
    # Redis (Background Jobs)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Inngest (Webhooks and Serverless Jobs)
    INNGEST_EVENT_KEY: Optional[str] = None
    INNGEST_SIGNING_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instantiate settings
settings = Settings()
