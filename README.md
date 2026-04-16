


```bash
curl -X POST http://localhost:6294/api/auth/login -H "Content-Type: application/json" -d '{"user": "test", "email": "test@hot.es", "pw": "qwerty123"}'
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





