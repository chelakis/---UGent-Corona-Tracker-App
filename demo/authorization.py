import requests as req


def authorize_user():
    demo_print("external", "verifying user identity on external authorization service", 2)
    response = req.post("http://127.0.0.1:8080/external/authorize")
    data = response.json()
    demo_print("external", "user has been authorized", 2)
    demo_print("external", "user uuid: " + str(data["uuid"]), 2)
    demo_print("external", "user register token: " + data["token"], 2)
    return register(data['uuid'], data['token'])


def register(uuid, token):
    demo_print("api", "authorizing user for first time", 2)
    demo_print("api", "using token supplied by when user was identified: " + token, 2)
    response = req.post("http://127.0.0.1:8080/users/{}/register".format(uuid), json={"token": token})
    token = response.json()['token']
    demo_print("api", "user has been authorized and given auth token: " + token, 2)
    return token


def demo_print(subject, message, indent=0):
    print(" " * indent, "[{}] {}".format(subject, message))
