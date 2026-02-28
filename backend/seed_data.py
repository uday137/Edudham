import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import bcrypt
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

async def seed_database():
    print("Checking if database already has data...")

    # ✅ Skip seeding if data already exists — prevents wiping your changes on restart
    existing_users = await db.users.count_documents({})
    if existing_users > 0:
        print("✅ Database already has data. Skipping seed to preserve existing records.")
        return

    print("No existing data found. Starting database seeding...")

    # Clear any partial data just in case
    await db.users.delete_many({})
    await db.universities.delete_many({})
    await db.applications.delete_many({})
    await db.otps.delete_many({})
    
    print("Cleared existing data")
    
    # Create admin user
    admin = {
        "id": "admin-001",
        "email": "admin@edudham.com",
        "password_hash": hash_password("admin123"),
        "name": "Admin User",
        "role": "admin",
        "university_id": None,
        "created_at": "2024-01-15T10:00:00Z"
    }
    await db.users.insert_one(admin)
    print("Created admin user: admin@edudham.com / admin123")
    
    # Create sample universities
    universities = [
        {
            "id": "uni-001",
            "name": "University of Lucknow",
            "location": "Lucknow",
            "main_photo": "https://images.unsplash.com/photo-1562774053-701939374585?crop=entropy&cs=srgb&fm=jpg&q=85",
            "photo_gallery": [
                "https://images.unsplash.com/photo-1562774053-701939374585?crop=entropy&cs=srgb&fm=jpg&q=85",
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "description": "One of the oldest and most prestigious universities in Uttar Pradesh, offering a wide range of undergraduate and postgraduate programs in arts, science, and commerce.",
            "courses_offered": ["B.A.", "B.Sc.", "B.Com", "M.A.", "M.Sc.", "MBA"],
            "fee_structure": [
                {"course": "B.A.", "duration": "3 Years", "annual_fee": 15000},
                {"course": "B.Sc.", "duration": "3 Years", "annual_fee": 20000},
                {"course": "B.Com", "duration": "3 Years", "annual_fee": 18000},
                {"course": "MBA", "duration": "2 Years", "annual_fee": 75000}
            ],
            "placement_percentage": 85.5,
            "rating": 4.3,
            "tags": ["Arts", "Science", "Commerce", "Government"],
            "contact_details": {
                "phone": "+91-522-2740443",
                "email": "info@lkouniv.ac.in",
                "website": "https://www.lkouniv.ac.in"
            },
            "created_at": "2024-01-10T10:00:00Z"
        },
        {
            "id": "uni-002",
            "name": "Integral University",
            "location": "Lucknow",
            "main_photo": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?crop=entropy&cs=srgb&fm=jpg&q=85",
            "photo_gallery": [
                "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "description": "A leading private university in Lucknow offering professional courses in Engineering, Management, Pharmacy, and more with excellent infrastructure and placement support.",
            "courses_offered": ["B.Tech", "MBA", "B.Pharma", "M.Tech", "MCA"],
            "fee_structure": [
                {"course": "B.Tech", "duration": "4 Years", "annual_fee": 125000},
                {"course": "MBA", "duration": "2 Years", "annual_fee": 150000},
                {"course": "B.Pharma", "duration": "4 Years", "annual_fee": 90000}
            ],
            "placement_percentage": 92.0,
            "rating": 4.5,
            "tags": ["Engineering", "Management", "Private", "Pharmacy"],
            "contact_details": {
                "phone": "+91-522-2890812",
                "email": "admission@iul.ac.in",
                "website": "https://www.iul.ac.in"
            },
            "created_at": "2024-01-10T10:00:00Z"
        },
        {
            "id": "uni-003",
            "name": "Aligarh Muslim University",
            "location": "Aligarh",
            "main_photo": "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?crop=entropy&cs=srgb&fm=jpg&q=85",
            "photo_gallery": [
                "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "description": "A historic central university with a rich legacy, offering comprehensive programs across all disciplines including Engineering, Medicine, Arts, and Sciences.",
            "courses_offered": ["B.Tech", "MBBS", "B.A.", "B.Sc.", "MBA", "M.Tech"],
            "fee_structure": [
                {"course": "B.Tech", "duration": "4 Years", "annual_fee": 45000},
                {"course": "MBBS", "duration": "5.5 Years", "annual_fee": 80000},
                {"course": "MBA", "duration": "2 Years", "annual_fee": 55000}
            ],
            "placement_percentage": 88.0,
            "rating": 4.6,
            "tags": ["Central University", "Medical", "Engineering", "Government"],
            "contact_details": {
                "phone": "+91-571-2700920",
                "email": "registrar@amu.ac.in",
                "website": "https://www.amu.ac.in"
            },
            "created_at": "2024-01-10T10:00:00Z"
        },
        {
            "id": "uni-004",
            "name": "Banaras Hindu University",
            "location": "Varanasi",
            "main_photo": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=srgb&fm=jpg&q=85",
            "photo_gallery": [
                "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "description": "One of India's premier central universities offering world-class education across multiple faculties including Engineering, Arts, Science, Medicine, and Agriculture.",
            "courses_offered": ["B.Tech", "MBBS", "B.A.", "B.Sc.", "MBA", "B.Pharma"],
            "fee_structure": [
                {"course": "B.Tech", "duration": "4 Years", "annual_fee": 50000},
                {"course": "MBBS", "duration": "5.5 Years", "annual_fee": 75000},
                {"course": "MBA", "duration": "2 Years", "annual_fee": 60000}
            ],
            "placement_percentage": 90.5,
            "rating": 4.7,
            "tags": ["Central University", "Medical", "Engineering", "Government"],
            "contact_details": {
                "phone": "+91-542-2368747",
                "email": "registrar@bhu.ac.in",
                "website": "https://www.bhu.ac.in"
            },
            "created_at": "2024-01-10T10:00:00Z"
        },
        {
            "id": "uni-005",
            "name": "Indian Institute of Technology Kanpur",
            "location": "Kanpur",
            "main_photo": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=srgb&fm=jpg&q=85",
            "photo_gallery": [
                "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "description": "One of India's top engineering institutes, IIT Kanpur is renowned for excellence in technical education and cutting-edge research with outstanding placement records.",
            "courses_offered": ["B.Tech", "M.Tech", "M.Sc.", "MBA", "Ph.D."],
            "fee_structure": [
                {"course": "B.Tech", "duration": "4 Years", "annual_fee": 220000},
                {"course": "M.Tech", "duration": "2 Years", "annual_fee": 100000},
                {"course": "MBA", "duration": "2 Years", "annual_fee": 180000}
            ],
            "placement_percentage": 98.0,
            "rating": 4.9,
            "tags": ["IIT", "Engineering", "Research", "Government"],
            "contact_details": {
                "phone": "+91-512-2597000",
                "email": "admissions@iitk.ac.in",
                "website": "https://www.iitk.ac.in"
            },
            "created_at": "2024-01-10T10:00:00Z"
        },
        {
            "id": "uni-006",
            "name": "Amity University",
            "location": "Noida",
            "main_photo": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=srgb&fm=jpg&q=85",
            "photo_gallery": [
                "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=srgb&fm=jpg&q=85"
            ],
            "description": "India's leading private university with state-of-the-art infrastructure, offering multidisciplinary programs with excellent industry connections and placement opportunities.",
            "courses_offered": ["B.Tech", "BBA", "LLB", "B.Com", "MBA", "M.Tech"],
            "fee_structure": [
                {"course": "B.Tech", "duration": "4 Years", "annual_fee": 180000},
                {"course": "BBA", "duration": "3 Years", "annual_fee": 150000},
                {"course": "MBA", "duration": "2 Years", "annual_fee": 220000}
            ],
            "placement_percentage": 95.0,
            "rating": 4.4,
            "tags": ["Private", "Engineering", "Management", "Law"],
            "contact_details": {
                "phone": "+91-120-4392000",
                "email": "admissions@amity.edu",
                "website": "https://www.amity.edu"
            },
            "created_at": "2024-01-10T10:00:00Z"
        }
    ]
    
    await db.universities.insert_many(universities)
    print(f"Created {len(universities)} universities")
    
    # Create a manager for Integral University
    manager = {
        "id": "manager-001",
        "email": "manager@integral.edu",
        "password_hash": hash_password("manager123"),
        "name": "Integral Manager",
        "role": "manager",
        "university_id": "uni-002",
        "created_at": "2024-01-15T10:00:00Z"
    }
    await db.users.insert_one(manager)
    print("Created manager user: manager@integral.edu / manager123 (assigned to Integral University)")
    
    # Create sample applications
    applications = [
        {
            "id": "app-001",
            "university_id": "uni-002",
            "university_name": "Integral University",
            "name": "Rahul Kumar",
            "email": "rahul.kumar@example.com",
            "phone": "+91-9876543210",
            "course_interest": "B.Tech Computer Science",
            "short_note": "I am very interested in pursuing computer science at your esteemed university.",
            "status": "pending",
            "created_at": "2024-01-20T14:30:00Z"
        },
        {
            "id": "app-002",
            "university_id": "uni-002",
            "university_name": "Integral University",
            "name": "Priya Sharma",
            "email": "priya.sharma@example.com",
            "phone": "+91-9876543211",
            "course_interest": "MBA",
            "short_note": "Looking forward to joining your MBA program to enhance my business skills.",
            "status": "pending",
            "created_at": "2024-01-21T10:15:00Z"
        },
        {
            "id": "app-003",
            "university_id": "uni-001",
            "university_name": "University of Lucknow",
            "name": "Amit Verma",
            "email": "amit.verma@example.com",
            "phone": "+91-9876543212",
            "course_interest": "B.A. English",
            "short_note": "Passionate about literature and would love to study at your university.",
            "status": "pending",
            "created_at": "2024-01-22T09:00:00Z"
        }
    ]
    
    await db.applications.insert_many(applications)
    print(f"Created {len(applications)} sample applications")
    
    print("\n=== Seeding Complete! ===")
    print("\nCredentials:")
    print("Admin: admin@edudham.com / admin123")
    print("Manager: manager@integral.edu / manager123")
    print(f"\n{len(universities)} universities created")
    print(f"{len(applications)} applications created")

if __name__ == "__main__":
    asyncio.run(seed_database())
