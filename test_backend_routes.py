import requests
import json

BASE_URL = "https://customer-care-backend-v2n0.onrender.com"

def test_route(url, method='GET', headers=None, data=None, expected_status=200):
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json=data)
        elif method == 'PUT':
            response = requests.put(url, headers=headers, json=data)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers)
        else:
            print(f"Unsupported method: {method}")
            return False

        if response.status_code == expected_status:
            print(f"✓ {method} {url} - Status: {response.status_code}")
            return True
        else:
            print(f"✗ {method} {url} - Status: {response.status_code} - Response: {response.text}")
            return False
    except Exception as e:
        print(f"✗ {method} {url} - Error: {str(e)}")
        return False

def main():
    print("Testing Customer Care Backend Routes\n")

    # Test health check (no auth required)
    test_route(f"{BASE_URL}/api/health")

    # Test auth routes (no auth required for login/register)
    test_route(f"{BASE_URL}/api/auth/login", method='POST', data={"email": "test@example.com", "password": "password"}, expected_status=401)  # Assuming invalid credentials

    # To test protected routes, you need a valid token
    print("\nPlease provide valid login credentials for testing protected routes:")
    email = input("Email: ").strip()
    password = input("Password: ").strip()

    if not email or not password:
        print("No credentials provided. Skipping protected route tests.")
        return

    login_data = {
        "email": email,
        "password": password
    }

    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    if response.status_code == 200:
        token = response.json().get('access_token')
        headers = {'Authorization': f'Bearer {token}', 'subject': 'default'}
        print("✓ Logged in successfully, got token")

        # Test some protected routes
        test_route(f"{BASE_URL}/api/auth/profile", headers=headers)
        test_route(f"{BASE_URL}/api/tickets/", headers=headers)
        test_route(f"{BASE_URL}/api/clients/", headers=headers)
        test_route(f"{BASE_URL}/api/users/", headers=headers)
        test_route(f"{BASE_URL}/api/sites/", headers=headers)
        test_route(f"{BASE_URL}/api/routers/", headers=headers)
        test_route(f"{BASE_URL}/api/analytics/dashboard", headers=headers)

        # Test with specific IDs if available (you may need to adjust IDs)
        # Uncomment and adjust these if you have existing data
        # test_route(f"{BASE_URL}/api/tickets/1", headers=headers)
        # test_route(f"{BASE_URL}/api/clients/1", headers=headers)

    else:
        print(f"✗ Failed to login: {response.status_code} - {response.text}")
        print("Cannot test protected routes without valid token")

    print("\nNote: Some routes require specific IDs or data. Adjust the script as needed.")
    print("Settings routes are not registered in the app, so /api/settings/* are not accessible.")

if __name__ == "__main__":
    main()
