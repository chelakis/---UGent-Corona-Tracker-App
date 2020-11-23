import offline_approach
import online_approach


def main(userA, userB):
    online_approach.main(userA, userB)
    offline_approach.main(userA, userB)


if __name__ == '__main__':
    main()
