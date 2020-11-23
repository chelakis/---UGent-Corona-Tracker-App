import requests as req
from authorization import authorize_user, demo_print
from helpers import send_over_air, register_two_users, retrieve_and_print_user_status, set__user_status_and_print

ERROR_SUB = "ERROR"


def main():
    subject = "Offline Approach"
    indent = 0
    demo_print(subject, "starting demo", indent)
    [user1, user2] = register_two_users()

    demo_print(subject, "retrieving status before interaction")
    retrieve_and_print_user_status(user1, user2)

    demo_print(subject, "user b gets positively diagnosed")
    set__user_status_and_print("user b", user2)

    demo_print(subject, "creating beacon keys", indent)
    demo_print("beacon 1", "generating key")
    beacon1 = generate_beacon_key()
    demo_print("beacon 2", "generating key")
    beacon2 = generate_beacon_key()

    demo_print("user a", "registering beacon to user")
    register_beacon(user1, beacon1)
    demo_print("user b", "registering beacon to user")
    register_beacon(user2, beacon2)

    demo_print("beacon 1", "transmitting token")
    beacon1_token = simulate_beacon(beacon1, 1)
    send_over_air(beacon1_token)

    demo_print("user b", "beacon token received, sending to database")
    add_interaction(user2, beacon1_token, 1)

    demo_print(subject, "retrieving status after interaction")
    retrieve_and_print_user_status(user1, user2)


def generate_beacon_key():
    demo_print("api", "retrieving factory unique generated identifier", 2)
    response = req.get("http://127.0.0.1:8080/beacon/generate")

    return response.json()["beacon_key"]


def register_beacon(auth, beacon_key):
    indent = 2
    subject = "api"
    demo_print(subject, "registering beacon: Bearer " + auth, indent)
    demo_print(subject, "beacon key: " + beacon_key, indent)
    response = req.post("http://127.0.0.1:8080/approach2/register/{}/".format(beacon_key),
                        headers={"Authorization": "Bearer " + auth})
    if response.status_code == 200:
        demo_print(subject, "Successfully added beacon", 2)
    return


def add_interaction(auth, beacon_key, timestamp):
    indent = 2
    subject = "api"
    demo_print(subject, "sending interaction to backend: Bearer " + auth, 2)
    response = req.post("http://127.0.0.1:8080/approach2/interact/{}/{}".format(beacon_key, timestamp),
                        headers={"Authorization": "Bearer " + auth})
    if response.status_code == 200:
        demo_print(subject, "successfully added interaction", indent)
    else:
        demo_print(ERROR_SUB, "API failed " + str(response.status_code), indent)
    return


def simulate_beacon(beacon_key, timestamp):
    indent = 2
    subject = "beacon"
    demo_print(subject, "beacon requesting response token at {}".format(timestamp), indent)
    demo_print(subject, "beacon key: " + beacon_key, indent)
    response = req.get("http://127.0.0.1:8080/beacon/{}/{}".format(beacon_key, timestamp))
    if response.status_code == 200:
        beacon_token = response.json()['token']
        demo_print(subject, "retrieved beacon response token: " + beacon_token, indent)
        return beacon_token
    else:
        demo_print(ERROR_SUB, "failed to create beacon transmission, error code: {}".format(response.status_code),
                   indent)


if __name__ == '__main__':
    main()
