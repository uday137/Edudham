from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import random
import string
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from io import BytesIO
from fastapi.responses import StreamingResponse

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Master OTP Email
MASTER_EMAIL = os.environ.get('MASTER_EMAIL', 'admin@edudham.com')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# ============ MODELS ============

class UserRole(BaseModel):
    role: str  # 'admin', 'manager', 'student'
    university_id: Optional[str] = None  # Only for managers

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    name: str
    role: str  # 'admin', 'manager', 'student'
    university_id: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Optional[str] = 'student'
    university_id: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    university_id: Optional[str] = None

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class OTP(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str
    otp: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    expires_at: str

class FeeStructure(BaseModel):
    course: str
    duration: str
    annual_fee: float

class University(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    main_photo: str
    photo_gallery: List[str] = []
    description: str
    courses_offered: List[str] = []
    fee_structure: List[FeeStructure] = []
    placement_percentage: float
    rating: float = 0.0
    tags: List[str] = []
    contact_details: Dict[str, str] = {}
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UniversityCreate(BaseModel):
    name: str
    location: str
    main_photo: str
    photo_gallery: List[str] = []
    description: str
    courses_offered: List[str] = []
    fee_structure: List[FeeStructure] = []
    placement_percentage: float
    rating: float = 0.0
    tags: List[str] = []
    contact_details: Dict[str, str] = {}

class UniversityUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    main_photo: Optional[str] = None
    photo_gallery: Optional[List[str]] = None
    description: Optional[str] = None
    courses_offered: Optional[List[str]] = None
    fee_structure: Optional[List[FeeStructure]] = None
    placement_percentage: Optional[float] = None
    rating: Optional[float] = None
    tags: Optional[List[str]] = None
    contact_details: Optional[Dict[str, str]] = None

class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    university_id: str
    university_name: str
    name: str
    email: EmailStr
    phone: str
    course_interest: str
    short_note: str
    status: str = 'pending'  # pending, contacted, accepted, rejected
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ApplicationCreate(BaseModel):
    university_id: str
    university_name: str
    name: str
    email: EmailStr
    phone: str
    course_interest: str
    short_note: str

class ApplicationResponse(BaseModel):
    id: str
    university_id: str
    university_name: str
    name: str
    email: str
    phone: str
    course_interest: str
    short_note: str
    status: str
    created_at: str

# ============ UTILITY FUNCTIONS ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str, university_id: Optional[str] = None) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'university_id': university_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> Dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    token = credentials.credentials
    return decode_token(token)

def generate_otp() -> str:
    return ''.join(random.choices(string.digits, k=6))

# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=user_data.name,
        role=user_data.role,
        university_id=user_data.university_id
    )
    
    await db.users.insert_one(user.model_dump())
    
    token = create_token(user.id, user.email, user.role, user.university_id)
    
    return {
        "token": token,
        "user": UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            university_id=user.university_id
        )
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'], user['email'], user['role'], user.get('university_id'))
    
    return {
        "token": token,
        "user": UserResponse(
            id=user['id'],
            email=user['email'],
            name=user['name'],
            role=user['role'],
            university_id=user.get('university_id')
        )
    }

@api_router.post("/auth/request-otp")
async def request_otp(request: OTPRequest):
    # Check if user exists
    user = await db.users.find_one({"email": request.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate OTP
    otp_code = generate_otp()
    otp = OTP(
        email=request.email,
        otp=otp_code,
        expires_at=(datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()
    )
    
    # Store OTP
    await db.otps.delete_many({"email": request.email})
    await db.otps.insert_one(otp.model_dump())
    
    # In production, send OTP via email. For now, return it (for testing)
    return {
        "message": f"OTP sent to master email {MASTER_EMAIL}",
        "otp": otp_code,  # Remove in production
        "master_email": MASTER_EMAIL
    }

@api_router.post("/auth/verify-otp")
async def verify_otp(data: OTPVerify):
    # Find OTP
    otp_record = await db.otps.find_one({"email": data.email}, {"_id": 0})
    if not otp_record:
        raise HTTPException(status_code=404, detail="OTP not found")
    
    # Check expiration
    if datetime.fromisoformat(otp_record['expires_at']) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP expired")
    
    # Verify OTP
    if otp_record['otp'] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Update password
    new_hash = hash_password(data.new_password)
    await db.users.update_one(
        {"email": data.email},
        {"$set": {"password_hash": new_hash}}
    )
    
    # Delete OTP
    await db.otps.delete_many({"email": data.email})
    
    return {"message": "Password reset successful"}

# ============ UNIVERSITY ENDPOINTS ============

@api_router.post("/universities", response_model=University)
async def create_university(university_data: UniversityCreate, current_user: Dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create universities")
    
    university = University(**university_data.model_dump())
    await db.universities.insert_one(university.model_dump())
    return university

@api_router.get("/universities", response_model=List[University])
async def get_universities(
    search: Optional[str] = None,
    location: Optional[str] = None,
    course_type: Optional[str] = None,
    min_fee: Optional[float] = None,
    max_fee: Optional[float] = None,
    min_rating: Optional[float] = None,
    min_placement: Optional[float] = None
):
    query = {}
    
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'tags': {'$regex': search, '$options': 'i'}},
            {'location': {'$regex': search, '$options': 'i'}}
        ]
    
    if location:
        query['location'] = {'$regex': location, '$options': 'i'}
    
    if course_type:
        query['courses_offered'] = {'$regex': course_type, '$options': 'i'}
    
    if min_rating is not None:
        query['rating'] = {'$gte': min_rating}
    
    if min_placement is not None:
        query['placement_percentage'] = {'$gte': min_placement}
    
    universities = await db.universities.find(query, {"_id": 0}).to_list(1000)
    
    # Filter by fee range if specified
    if min_fee is not None or max_fee is not None:
        filtered = []
        for uni in universities:
            if uni.get('fee_structure'):
                fees = [fs['annual_fee'] for fs in uni['fee_structure']]
                if fees:
                    avg_fee = sum(fees) / len(fees)
                    if min_fee is not None and avg_fee < min_fee:
                        continue
                    if max_fee is not None and avg_fee > max_fee:
                        continue
            filtered.append(uni)
        universities = filtered
    
    return universities

@api_router.get("/universities/{university_id}", response_model=University)
async def get_university(university_id: str):
    university = await db.universities.find_one({"id": university_id}, {"_id": 0})
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    return university

@api_router.put("/universities/{university_id}", response_model=University)
async def update_university(
    university_id: str,
    university_data: UniversityUpdate,
    current_user: Dict = Depends(get_current_user)
):
    # Admin can update any, manager can only update their own
    if current_user['role'] == 'manager' and current_user.get('university_id') != university_id:
        raise HTTPException(status_code=403, detail="You can only update your own university")
    
    if current_user['role'] not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    update_data = {k: v for k, v in university_data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.universities.update_one(
        {"id": university_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="University not found")
    
    university = await db.universities.find_one({"id": university_id}, {"_id": 0})
    return university

@api_router.delete("/universities/{university_id}")
async def delete_university(university_id: str, current_user: Dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete universities")
    
    result = await db.universities.delete_one({"id": university_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="University not found")
    
    return {"message": "University deleted"}

@api_router.get("/universities/{university_id}/applications/export")
async def export_university_applications(university_id: str, current_user: Dict = Depends(get_current_user)):
    if current_user['role'] not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    # Check authorization for manager
    if current_user['role'] == 'manager' and current_user.get('university_id') != university_id:
        raise HTTPException(status_code=403, detail="You can only export your own university's applications")
    
    # Get university name
    university = await db.universities.find_one({"id": university_id}, {"_id": 0})
    if not university:
        raise HTTPException(status_code=404, detail="University not found")
    
    # Get applications
    applications = await db.applications.find({"university_id": university_id}, {"_id": 0}).to_list(10000)
    
    # Create Excel workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Applications"
    
    # Headers
    headers = ['Name', 'Email', 'Phone', 'University Name', 'Course Interest', 'Short Note', 'Date', 'Status']
    ws.append(headers)
    
    # Style headers
    header_fill = PatternFill(start_color="EA580C", end_color="EA580C", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")
    
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', vertical='center')
    
    # Add data
    for app in applications:
        created_date = datetime.fromisoformat(app['created_at']).strftime('%Y-%m-%d %H:%M')
        ws.append([
            app['name'],
            app['email'],
            app['phone'],
            app['university_name'],
            app['course_interest'],
            app['short_note'],
            created_date,
            app['status']
        ])
    
    # Adjust column widths
    for column in ws.columns:
        max_length = 0
        column = list(column)
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(cell.value)
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column[0].column_letter].width = adjusted_width
    
    # Save to BytesIO
    output = BytesIO()
    wb.save(output)
    output.seek(0)
    
    uni_name = university['name'].replace(' ', '_')
    filename = f"{uni_name}_applications.xlsx"
    
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ============ APPLICATION ENDPOINTS ============

@api_router.post("/applications", response_model=ApplicationResponse)
async def create_application(application_data: ApplicationCreate):
    application = Application(**application_data.model_dump())
    await db.applications.insert_one(application.model_dump())
    return ApplicationResponse(**application.model_dump())

@api_router.get("/applications", response_model=List[ApplicationResponse])
async def get_applications(current_user: Dict = Depends(get_current_user)):
    query = {}
    
    # Managers can only see their university's applications
    if current_user['role'] == 'manager':
        if not current_user.get('university_id'):
            raise HTTPException(status_code=403, detail="No university assigned")
        query['university_id'] = current_user['university_id']
    
    # Students cannot view applications
    if current_user['role'] == 'student':
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    applications = await db.applications.find(query, {"_id": 0}).to_list(10000)
    return [ApplicationResponse(**app) for app in applications]

@api_router.get("/applications/university/{university_id}", response_model=List[ApplicationResponse])
async def get_applications_by_university(university_id: str, current_user: Dict = Depends(get_current_user)):
    # Check authorization
    if current_user['role'] == 'manager' and current_user.get('university_id') != university_id:
        raise HTTPException(status_code=403, detail="You can only view your own university's applications")
    
    if current_user['role'] not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    applications = await db.applications.find({"university_id": university_id}, {"_id": 0}).to_list(10000)
    return [ApplicationResponse(**app) for app in applications]

@api_router.put("/applications/{application_id}/status")
async def update_application_status(
    application_id: str,
    status: str,
    current_user: Dict = Depends(get_current_user)
):
    if current_user['role'] not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    # Get application

@api_router.delete("/applications/{application_id}")
async def delete_application(application_id: str, current_user: Dict = Depends(get_current_user)):
    if current_user['role'] not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    # Get application
    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check if manager has access
    if current_user['role'] == 'manager' and application['university_id'] != current_user.get('university_id'):
        raise HTTPException(status_code=403, detail="You can only delete your own university's applications")
    
    await db.applications.delete_one({"id": application_id})
    
    return {"message": "Application deleted"}

    application = await db.applications.find_one({"id": application_id}, {"_id": 0})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check if manager has access
    if current_user['role'] == 'manager' and application['university_id'] != current_user.get('university_id'):
        raise HTTPException(status_code=403, detail="You can only update your own university's applications")
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": status}}
    )
    
    return {"message": "Status updated"}

# ============ EXCEL EXPORT ENDPOINT ============

@api_router.get("/applications/export/excel")
async def export_applications_excel(current_user: Dict = Depends(get_current_user)):
    if current_user['role'] not in ['admin', 'manager']:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    query = {}
    filename = "all_applications.xlsx"
    
    # Managers can only export their university's applications
    if current_user['role'] == 'manager':
        if not current_user.get('university_id'):
            raise HTTPException(status_code=403, detail="No university assigned")
        query['university_id'] = current_user['university_id']
        
        # Get university name for filename
        university = await db.universities.find_one({"id": current_user['university_id']}, {"_id": 0})
        if university:
            uni_name = university['name'].replace(' ', '_')
            filename = f"{uni_name}_applications.xlsx"
    
    applications = await db.applications.find(query, {"_id": 0}).to_list(10000)
    
    # Create Excel workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Applications"
    
    # Headers
    headers = ['Name', 'Email', 'Phone', 'University Name', 'Course Interest', 'Short Note', 'Date', 'Status']
    ws.append(headers)
    
    # Style headers
    header_fill = PatternFill(start_color="EA580C", end_color="EA580C", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")
    
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', vertical='center')
    
    # Add data
    for app in applications:
        created_date = datetime.fromisoformat(app['created_at']).strftime('%Y-%m-%d %H:%M')
        ws.append([
            app['name'],
            app['email'],
            app['phone'],
            app['university_name'],
            app['course_interest'],
            app['short_note'],
            created_date,
            app['status']
        ])
    
    # Adjust column widths
    for column in ws.columns:
        max_length = 0
        column = list(column)
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(cell.value)
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column[0].column_letter].width = adjusted_width
    
    # Save to BytesIO
    output = BytesIO()
    wb.save(output)
    output.seek(0)
    
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ============ ADMIN ENDPOINTS ============

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: Dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    
    total_universities = await db.universities.count_documents({})
    total_applications = await db.applications.count_documents({})
    total_managers = await db.users.count_documents({"role": "manager"})
    pending_applications = await db.applications.count_documents({"status": "pending"})
    
    return {
        "total_universities": total_universities,
        "total_applications": total_applications,
        "total_managers": total_managers,
        "pending_applications": pending_applications
    }

@api_router.post("/admin/users", response_model=UserResponse)
async def create_user(user_data: UserCreate, current_user: Dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=user_data.name,
        role=user_data.role,
        university_id=user_data.university_id
    )
    
    await db.users.insert_one(user.model_dump())
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        university_id=user.university_id
    )

@api_router.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(current_user: Dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return [UserResponse(**user) for user in users]

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()