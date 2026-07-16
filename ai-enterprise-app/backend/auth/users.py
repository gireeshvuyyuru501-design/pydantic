users = [
    {
        "id":1,
        "username":"admin",
        "password":"admin123",
        "role":"Admin"
    },
    {
        "id":2,
        "username":"manager",
        "password":"manager123",
        "role":"Procurement Manager"
    }
]


def get_user(username:str):

    for user in users:
        if user["username"] == username:
            return user

    return None