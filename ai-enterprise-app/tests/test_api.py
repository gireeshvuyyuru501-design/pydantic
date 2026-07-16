from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}


def test_register_and_login_flow():
    register = client.post(
        '/auth/register',
        json={'username': 'procure1', 'email': 'procure1@example.com', 'password': 'secret123', 'role': 'buyer'},
    )
    assert register.status_code == 200

    login = client.post('/auth/login', json={'username': 'procure1', 'password': 'secret123'})
    assert login.status_code == 200
    payload = login.json()
    assert 'access_token' in payload


def test_vendor_and_request_flow():
    login = client.post('/auth/login', json={'username': 'procure1', 'password': 'secret123'})
    token = login.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}

    vendor = client.post(
        '/procurement/vendors',
        headers=headers,
        json={'name': 'Nova Supplies', 'category': 'IT', 'score': 90, 'lead_time_days': 4, 'compliance_status': 'compliant'},
    )
    assert vendor.status_code == 200

    request = client.post(
        '/procurement/requests',
        headers=headers,
        json={
            'title': 'Workstations',
            'department': 'IT',
            'requested_by': 'procure1',
            'vendor_id': vendor.json()['id'],
            'requested_amount': 12000,
            'urgency': 'high',
            'description': 'Purchase workstations',
        },
    )
    assert request.status_code == 200

    insights = client.get(f"/procurement/insights/{request.json()['id']}")
    assert insights.status_code == 200
    assert insights.json()['risk_level'] in {'low', 'medium', 'high'}
