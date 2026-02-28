import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv('backend/.env')

async def clear_db():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    await db.universities.delete_many({})
    await db.users.delete_many({})
    await db.applications.delete_many({})
    print("Database cleared!")

asyncio.run(clear_db())
