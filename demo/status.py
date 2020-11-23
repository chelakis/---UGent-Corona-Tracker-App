import requests
from authorization import demo_print


def user_status(auth):
    demo_print("api", "retrieving user status with auth: Bearer " + auth, 2)
    response = requests.get("http://127.0.0.1:8080/users/status", headers={"Authorization": "Bearer " + auth})
    data = response.json()
    demo_print("api", "status retrieved", 2)
    demo_print("api", "risk: " + str(data["risk"]), 2)
    demo_print("api", "message: " + str(data["message"]), 2)
    return response.json()


def user_status_set(auth, value):
    requests.put("http://127.0.0.1:8080/users/status", headers={"Authorization": "Bearer " + auth},
                 json={"positive": value})
