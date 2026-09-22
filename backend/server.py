from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class RFQ(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: f"YF-{uuid.uuid4().hex[:6].upper()}")
    name: str
    company: Optional[str] = ""
    email: str
    service: str
    material: Optional[str] = ""
    tolerance: Optional[str] = ""
    volume: Optional[str] = ""
    message: Optional[str] = ""
    files: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class RFQCreate(BaseModel):
    name: str
    company: Optional[str] = ""
    email: str
    service: str
    material: Optional[str] = ""
    tolerance: Optional[str] = ""
    volume: Optional[str] = ""
    message: Optional[str] = ""
    files: List[str] = []


@api_router.get("/")
async def root():
    return {"message": "Yue Fung Precision API"}


@api_router.post("/rfq", response_model=RFQ)
async def create_rfq(input: RFQCreate):
    rfq = RFQ(**input.model_dump())
    doc = rfq.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.rfqs.insert_one(doc)
    return rfq


@api_router.get("/rfq", response_model=List[RFQ])
async def list_rfqs():
    rfqs = await db.rfqs.find({}, {"_id": 0}).to_list(1000)
    for r in rfqs:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
    return rfqs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
