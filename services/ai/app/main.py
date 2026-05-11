"""
NEXUS AI Service
FastAPI microservice — voice pipeline, memory, planning intelligence.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config.settings import settings
from app.core.logging.logger import setup_logging, get_logger
from app.api.middleware.logging import LoggingMiddleware
from app.api.v1.routers import (
    transcription, synthesis, intent,
    memory, embedding, reflection, planning,
)

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging(settings.LOG_LEVEL)
    logger.info(
        "NEXUS AI Service starting",
        extra={"version": settings.VERSION, "env": settings.ENV},
    )
    yield
    logger.info("NEXUS AI Service shutting down")


app = FastAPI(
    title="NEXUS AI Service",
    description="AI microservice for NEXUS — voice, memory, planning intelligence",
    version=settings.VERSION,
    docs_url="/docs" if settings.ENV != "production" else None,
    redoc_url="/redoc" if settings.ENV != "production" else None,
    lifespan=lifespan,
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(transcription.router, prefix="/api/v1/voice",      tags=["voice"])
app.include_router(synthesis.router,     prefix="/api/v1/voice",      tags=["voice"])
app.include_router(intent.router,        prefix="/api/v1/buddy",      tags=["buddy"])
app.include_router(memory.router,        prefix="/api/v1/memory",     tags=["memory"])
app.include_router(embedding.router,     prefix="/api/v1/embedding",  tags=["embedding"])
app.include_router(reflection.router,    prefix="/api/v1/reflection", tags=["reflection"])
app.include_router(planning.router,      prefix="/api/v1/planning",   tags=["planning"])


@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy", "service": "nexus-ai", "version": settings.VERSION}


@app.get("/health/liveness", tags=["health"])
async def liveness():
    return {"status": "ok"}


@app.get("/health/readiness", tags=["health"])
async def readiness():
    return {"status": "ready"}