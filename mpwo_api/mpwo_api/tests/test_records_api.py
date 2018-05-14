import json


def test_get_all_records_for_authenticated_user(
    app, user_1, user_2, sport_1_cycling, sport_2_running,
    activity_cycling_user_1, activity_cycling_user_2, activity_running_user_1,
    record_ld, record_ms_user_2_cycling, record_fd_running
):
    client = app.test_client()
    resp_login = client.post(
        '/api/auth/login',
        data=json.dumps(dict(
            email='test@test.com',
            password='12345678'
        )),
        content_type='application/json'
    )
    response = client.get(
        '/api/records',
        headers=dict(
            Authorization='Bearer ' + json.loads(
                resp_login.data.decode()
            )['auth_token']
        )
    )
    data = json.loads(response.data.decode())

    assert response.status_code == 200
    assert 'success' in data['status']
    assert len(data['data']['records']) == 2

    assert 'Sun, 01 Apr 2018 00:00:00 GMT' == data['data']['records'][0]['activity_date']  # noqa
    assert 1 == data['data']['records'][0]['user_id']
    assert 2 == data['data']['records'][0]['sport_id']
    assert 3 == data['data']['records'][0]['activity_id']
    assert 'FD' == data['data']['records'][0]['record_type']
    assert 'value' in data['data']['records'][0]

    assert 'Mon, 01 Jan 2018 00:00:00 GMT' == data['data']['records'][1]['activity_date']  # noqa
    assert 1 == data['data']['records'][1]['user_id']
    assert 1 == data['data']['records'][1]['sport_id']
    assert 1 == data['data']['records'][1]['activity_id']
    assert 'LD' == data['data']['records'][1]['record_type']
    assert 'value' in data['data']['records'][1]