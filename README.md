# Express.js backend for React JWT based auth system

Used for i.a. React JWT Test 0

at https://github.com:Greyling-Tech/react-jwt-test0.git (branch "dev-v5")

## Refs

Based on https://www.freecodecamp.org/news/how-to-build-a-secure-authentication-system-with-jwt-and-refresh-tokens/

## Setup

### .env

Secret values saved in Keepass db: `Apps.kdbx`

```
MONGODB_USER=""
MONGODB_PASS=""
MONGODB_HOST="cluster01.koazls1.mongodb.net"
MONGODB_DB="auth0"
PORT=6823
ACCESS_TOKEN_SECRET=""
REFRESH_TOKEN_SECRET=""
NOTIFY_EMAIL=no-reply@buluc.fr
NOTIFY_PASS=""
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
```

## Testing

```bash
curl -X POST http://localhost:6823/api/auth/register -H "Content-Type: application/json" -d '{"username": "marc", "email": "mgreyling@gmail.com", "password": "qwertz987654321@@"}'

curl -X POST http://localhost:6823/api/auth/register -H "Content-Type: application/json" -d '{"fname": "marc", "sname": "greyling", "email": "mgreyling@gmail.com"}'
```

outputs

```json
{"message":"User created successfully"}
```

```bash
curl -X POST http://localhost:6823/api/auth/login -H "Content-Type: application/json" -d '{"user": "test", "email": "test@hot.es", "pw": "qwerty123"}'
```

outputs:

```json
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTAzOTI4NTU3ODdjNTZmZWQ3MjA0OSIsImVtYWlsIjoidGVzdEBob3QuZXMiLCJpYXQiOjE3NzYzMDM5NDYsImV4cCI6MTc3NjMwNDg0Nn0.mwJNWpndehtbxAugg5FFHuZTg-WHmSHJd-r4szaKJMA"}
```

```bash
TOKEN=`curl -s -X POST http://localhost:6294/api/auth/login -H "Content-Type: application/json" -d '{"user": "test", "email": "test@hot.es", "pw": "qwerty123"}' | jq -r .token`
curl -H "Authorization: Bearer ${TOKEN}" http://localhost:6294/api/profile/me
```

outputs

```json
{"user":{"_id":"69e0392855787c56fed72049","username":"test","email":"test@hot.es","__v":0}}
```

-----

# ORIG: "Node JS Tutorial Series - MongoDB with Mongoose: Async CRUD"

✅ [Check out my YouTube Channel with all of my tutorials](https://www.youtube.com/DaveGrayTeachesCode).

[<img src="https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix-button.svg" width="163px" />](https://glitch.com/edit/#!/import/github/gitdagray/mongo_async_crud)

**Deploy by clicking the button above**
_Remember to add your .env variables in the deployed version_

**Description:**

This repository shares the code applied during the Youtube tutorial. The tutorial is part of a [Node.js & Express for Beginners Playlist](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw) on my channel.  

[YouTube Tutorial](https://youtu.be/AWlLhRQJvtw) for this repository.

I suggest completing my [8 hour JavaScript course tutorial video](https://youtu.be/EfAl9bwzVZk) if you are new to Javascript.

### Academic Honesty

**DO NOT COPY FOR AN ASSIGNMENT** - Avoid plagiargism and adhere to the spirit of this [Academic Honesty Policy](https://www.freecodecamp.org/news/academic-honesty-policy/).
