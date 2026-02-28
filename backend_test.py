import requests
import sys
import json
from datetime import datetime

class EduDhamAPITester:
    def __init__(self, base_url="https://uni-dham.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_token = None
        self.manager_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failures = []

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return response.json() if response.content else {}
                except:
                    return {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                print(f"❌ Failed - {error_msg}")
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                self.failures.append(f"{name}: {error_msg}")
                return {}

        except Exception as e:
            error_msg = f"Error: {str(e)}"
            print(f"❌ Failed - {error_msg}")
            self.failures.append(f"{name}: {error_msg}")
            return {}

    def test_admin_login(self):
        """Test admin login"""
        response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@edudham.com", "password": "admin123"}
        )
        if response and 'token' in response:
            self.admin_token = response['token']
            print(f"✅ Admin token obtained: {self.admin_token[:20]}...")
            return True
        return False

    def test_manager_login(self):
        """Test manager login"""
        response = self.run_test(
            "Manager Login",
            "POST",
            "auth/login",
            200,
            data={"email": "manager@integral.edu", "password": "manager123"}
        )
        if response and 'token' in response:
            self.manager_token = response['token']
            print(f"✅ Manager token obtained: {self.manager_token[:20]}...")
            return True
        return False

    def test_universities_endpoint(self):
        """Test universities listing"""
        response = self.run_test(
            "Get Universities",
            "GET",
            "universities",
            200
        )
        if response and isinstance(response, list):
            print(f"✅ Found {len(response)} universities")
            return response
        return []

    def test_university_search_filters(self):
        """Test university search and filters"""
        # Test search by name
        self.run_test(
            "Search Universities by Name",
            "GET",
            "universities?search=Integral",
            200
        )
        
        # Test location filter
        self.run_test(
            "Filter Universities by Location",
            "GET",
            "universities?location=Lucknow",
            200
        )
        
        # Test rating filter
        self.run_test(
            "Filter Universities by Rating",
            "GET",
            "universities?min_rating=4.5",
            200
        )

    def test_university_detail(self, university_id):
        """Test individual university details"""
        response = self.run_test(
            "Get University Detail",
            "GET",
            f"universities/{university_id}",
            200
        )
        if response:
            print(f"✅ University detail loaded: {response.get('name', 'Unknown')}")
        return response

    def test_create_application(self, university_id, university_name):
        """Test application creation"""
        application_data = {
            "university_id": university_id,
            "university_name": university_name,
            "name": "Test Student",
            "email": "teststudent@example.com",
            "phone": "+91-9999999999",
            "course_interest": "B.Tech Computer Science",
            "short_note": "Test application for API testing"
        }
        
        response = self.run_test(
            "Create Application",
            "POST",
            "applications",
            200,
            data=application_data
        )
        if response and 'id' in response:
            print(f"✅ Application created: {response['id']}")
            return response['id']
        return None

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        if not self.admin_token:
            print("❌ No admin token available for stats test")
            return
            
        response = self.run_test(
            "Admin Stats",
            "GET",
            "admin/stats",
            200,
            token=self.admin_token
        )
        if response:
            print(f"✅ Stats: {response.get('total_universities', 0)} unis, {response.get('total_applications', 0)} apps")

    def test_admin_get_applications(self):
        """Test admin view all applications"""
        if not self.admin_token:
            print("❌ No admin token available for applications test")
            return
            
        response = self.run_test(
            "Admin Get All Applications",
            "GET",
            "applications",
            200,
            token=self.admin_token
        )
        if response and isinstance(response, list):
            print(f"✅ Found {len(response)} applications for admin")
            return response
        return []

    def test_manager_get_applications(self):
        """Test manager view own university applications"""
        if not self.manager_token:
            print("❌ No manager token available for applications test")
            return
            
        response = self.run_test(
            "Manager Get Applications",
            "GET",
            "applications",
            200,
            token=self.manager_token
        )
        if response and isinstance(response, list):
            print(f"✅ Found {len(response)} applications for manager")
            return response
        return []

    def test_admin_create_university(self):
        """Test admin create university"""
        if not self.admin_token:
            print("❌ No admin token available for university creation test")
            return
            
        university_data = {
            "name": "Test University",
            "location": "Test City",
            "main_photo": "https://images.unsplash.com/photo-1562774053-701939374585?crop=entropy&cs=srgb&fm=jpg&q=85",
            "description": "A test university for API testing",
            "placement_percentage": 85.0,
            "rating": 4.0,
            "photo_gallery": [],
            "courses": [],
            "tags": ["Test"],
            "contact_details": {}
        }
        
        response = self.run_test(
            "Admin Create University",
            "POST",
            "universities",
            200,
            data=university_data,
            token=self.admin_token
        )
        if response and 'id' in response:
            print(f"✅ University created: {response['id']}")
            return response['id']
        return None

    def test_admin_create_manager(self):
        """Test admin create manager user"""
        if not self.admin_token:
            print("❌ No admin token available for manager creation test")
            return
            
        manager_data = {
            "name": "Test Manager",
            "email": "testmanager@example.com",
            "password": "testpass123",
            "role": "manager",
            "university_id": "uni-001"  # University of Lucknow
        }
        
        response = self.run_test(
            "Admin Create Manager",
            "POST",
            "admin/users",
            200,
            data=manager_data,
            token=self.admin_token
        )
        if response and 'id' in response:
            print(f"✅ Manager created: {response['id']}")
            return response['id']
        return None

    def test_manager_update_university(self):
        """Test manager update own university"""
        if not self.manager_token:
            print("❌ No manager token available for university update test")
            return
            
        update_data = {
            "description": "Updated description by manager for testing",
            "placement_percentage": 93.0
        }
        
        # Manager should be assigned to uni-002 (Integral University)
        response = self.run_test(
            "Manager Update University",
            "PUT",
            "universities/uni-002",
            200,
            data=update_data,
            token=self.manager_token
        )
        if response:
            print(f"✅ University updated by manager")

    def test_otp_request(self):
        """Test OTP request functionality"""
        response = self.run_test(
            "Request OTP",
            "POST",
            "auth/request-otp",
            200,
            data={"email": "admin@edudham.com"}
        )
        if response and 'otp' in response:
            print(f"✅ OTP generated: {response['otp']} (for testing)")
            return response['otp']
        return None

    def test_excel_export_admin(self):
        """Test admin Excel export"""
        if not self.admin_token:
            print("❌ No admin token available for Excel export test")
            return
            
        try:
            url = f"{self.base_url}/api/applications/export/excel"
            headers = {'Authorization': f'Bearer {self.admin_token}'}
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                self.tests_passed += 1
                print(f"✅ Passed - Excel Export Admin - Status: {response.status_code}")
                print(f"✅ Content-Type: {response.headers.get('content-type', 'N/A')}")
            else:
                self.failures.append(f"Excel Export Admin: Expected 200, got {response.status_code}")
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                
        except Exception as e:
            self.failures.append(f"Excel Export Admin: Error: {str(e)}")
            print(f"❌ Failed - Error: {str(e)}")
        
        self.tests_run += 1

    def test_excel_export_manager(self):
        """Test manager Excel export"""
        if not self.manager_token:
            print("❌ No manager token available for Excel export test")
            return
            
        try:
            url = f"{self.base_url}/api/applications/export/excel"
            headers = {'Authorization': f'Bearer {self.manager_token}'}
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                self.tests_passed += 1
                print(f"✅ Passed - Excel Export Manager - Status: {response.status_code}")
                print(f"✅ Content-Type: {response.headers.get('content-type', 'N/A')}")
            else:
                self.failures.append(f"Excel Export Manager: Expected 200, got {response.status_code}")
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                
        except Exception as e:
            self.failures.append(f"Excel Export Manager: Error: {str(e)}")
            print(f"❌ Failed - Error: {str(e)}")
        
        self.tests_run += 1

def main():
    print("=== Edu Dham API Testing ===\n")
    tester = EduDhamAPITester()

    # Test authentication
    if not tester.test_admin_login():
        print("❌ Admin login failed, stopping critical tests")
        
    if not tester.test_manager_login():
        print("❌ Manager login failed, stopping manager tests")

    # Test public endpoints
    universities = tester.test_universities_endpoint()
    tester.test_university_search_filters()
    
    # Test university details
    if universities and len(universities) > 0:
        tester.test_university_detail(universities[0]['id'])
        
        # Test application creation
        app_id = tester.test_create_application(universities[0]['id'], universities[0]['name'])

    # Test admin endpoints
    tester.test_admin_stats()
    tester.test_admin_get_applications()
    tester.test_admin_create_university()
    tester.test_admin_create_manager()

    # Test manager endpoints
    tester.test_manager_get_applications()
    tester.test_manager_update_university()

    # Test OTP functionality
    tester.test_otp_request()

    # Test Excel exports
    tester.test_excel_export_admin()
    tester.test_excel_export_manager()

    # Print summary
    print(f"\n=== TEST SUMMARY ===")
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")

    if tester.failures:
        print(f"\n❌ FAILURES:")
        for failure in tester.failures:
            print(f"  - {failure}")

    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())