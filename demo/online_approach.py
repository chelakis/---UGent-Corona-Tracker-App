import requests

from authorization import demo_print
from helpers import send_over_air, register_two_users, retrieve_and_print_user_status, set__user_status_and_print


def create_challenge(auth):
    demo_print("api", "requesting challenge from backend: Bearer " + auth, 2)
    response = requests.get("http://127.0.0.1:8080/approach1/users/challenge",
                            headers={"Authorization": "Bearer " + auth})
    token = response.json()["token"]
    demo_print("api", "challenge token generated: " + token, 2)
    return token


def submit_challenge(auth, challenge):
    demo_print("api", "sending challenge to backend: Bearer " + auth, 2)
    demo_print("api", "challenge token: " + challenge, 2)
    response = requests.post("http://127.0.0.1:8080/approach1/users/challenge",
                             headers={"Authorization": "Bearer " + auth}, json={"challenge": challenge})
    token = response.json()["token"]
    demo_print("api", "response token generated: " + token, 2)
    return token


def submit_response(auth, token):
    demo_print("api", "sending response to backend: Bearer " + auth, 2)
    demo_print("api", "response token: " + token, 2)
    requests.post("http://127.0.0.1:8080/approach1/users/response",
                  headers={"Authorization": "Bearer " + auth}, json={"token": token})
    demo_print("api", "response token submitted", 2)


def main():
    subject = "Online Approach"

    demo_print(subject, "starting demo")

    demo_print(subject, "registering users")
    [user_a, user_b] = register_two_users()

    demo_print(subject, "retrieving status before interaction")
    retrieve_and_print_user_status(user_a, user_b)

    demo_print(subject, "user b gets positively diagnosed")
    set__user_status_and_print("user b", user_b)

    demo_print(subject, "logging an interaction")

    demo_print("user a", "requesting challenge token")
    user_a_challenge = create_challenge(user_a)

    demo_print("user a", "sending challenge token to user b")
    user_b_received_challenge = send_over_air(user_a_challenge)

    demo_print("user b", "requesting response token with received challenge token")
    user_b_response = submit_challenge(user_b, user_b_received_challenge)

    demo_print("user b", "sending response token to user a")
    user_a_received_response = send_over_air(user_b_response)

    demo_print("user a", "logging interaction with received response token")
    submit_response(user_a, user_a_received_response)

    demo_print(subject, "retrieving status after interaction")
    retrieve_and_print_user_status(user_a, user_b)


if __name__ == '__main__':
    main()
