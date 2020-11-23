from authorization import demo_print, authorize_user
from status import user_status, user_status_set


def send_over_air(message):
    demo_print("air", "message travelling: " + message, 2)
    return message


def register_two_users():
    demo_print("user a", "registering and authorizing")
    user_a = authorize_user()

    demo_print("user b", "registering and authorizing")
    user_b = authorize_user()
    print("EXTRA",user_b)

    return [user_a, user_b]


def retrieve_and_print_user_status(user_a, user_b):
    demo_print("user a", "requesting status")
    user_status(user_a)

    demo_print("user b", "requesting status")
    user_status(user_b)


def set__user_status_and_print(user_name, user_auth):
    demo_print("manual", "setting " + user_name + " status to positive")
    user_status_set(user_auth, "true")

    demo_print("user b", "confirming status")
    user_status(user_auth)
