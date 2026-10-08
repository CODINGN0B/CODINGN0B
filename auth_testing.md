# Auth-Gated App Testing Playbook (Emergent Google Auth)

NOTE - Do not be satisfied until you've tested the app completely especially the auth gated pages.

## Step 1: Create Test User & Session

```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,  // Custom UUID field (MongoDB's _id is separate/internal)
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,  // Must match user.user_id exactly
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API

```
curl -X GET "https://your-app.com/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
curl -X GET "https://your-app.com/api/quote-requests" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Step 3: Browser Testing

```
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": "your-app.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None"
}])
await page.goto("https://your-app.com/dashboard")
```

## Quick Debug

```
mongosh --eval "use('test_database'); db.users.find().limit(2).pretty(); db.user_sessions.find().limit(2).pretty();"
mongosh --eval "use('test_database'); db.users.deleteMany({email: /test\.user\./}); db.user_sessions.deleteMany({session_token: /test_session/});"
```

## Checklist
- User document has `user_id` field (custom UUID, MongoDB's `_id` is separate)
- Session `user_id` matches user's `user_id` exactly
- All queries use `{"_id": 0}` projection
- API returns user data with `user_id` field (not 401/404)
- Browser loads dashboard (not sign-in prompt)
- Callback detection uses `useLocation().hash`, not `window.location.hash`

## App specifics (Yue Fung)
- Admin access is granted by email allowlist: `ADMIN_EMAILS` in `/app/backend/.env` (currently `yfhk@yuefung.com`).
- Admin-only endpoints: `GET /api/quote-requests`, `PATCH /api/quote-requests/{id}`, `GET /api/quote-requests/files/{file_id}`.
- Signed-in non-admin endpoint: `GET /api/quote-requests/mine` (matches the signed-in user's email).
- To test the admin view, insert the test user with email `yfhk@yuefung.com`.
