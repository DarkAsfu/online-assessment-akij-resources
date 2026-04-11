# Deployment Environment Variables

## Frontend (Vercel) - `client/` folder

Set these environment variables in Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain/api/v1
NEXT_PUBLIC_APP_NAME=Online Assessment Platform
```

### Local Development
File: `client/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Online Assessment Platform
```

---

## Backend (Vercel/Railway/Heroku) - `server/` folder

Set these environment variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster/your-db
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=production
```

### Local Development
File: `server/.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://akijresources:akijresources@cluster0.gqju11e.mongodb.net/?appName=Cluster0
JWT_SECRET=Yhb0TNOVMVHm7kUEhPYhyevo2pGRwqpeCBvBXW9nZTQ
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## CORS Configuration

The backend `app.js` is configured to accept requests from:
- `http://localhost:3000` (local frontend dev)
- `https://online-assessment-akij-resources.vercel.app` (frontend Vercel domain)
- `https://online-assessment-akij-resources-e2.vercel.app` (alternate frontend domain)

If you deploy to different domains, update the `corsOptions` in `server/src/app.js`.

---

## Steps to Deploy

### 1. Deploy Backend
Deploy `server/` folder to Vercel, Railway, Heroku, or any Node.js host.
Set the environment variables listed above.

### 2. Deploy Frontend
Deploy `client/` folder to Vercel.
Set `NEXT_PUBLIC_API_URL` to your backend domain + `/api/v1`.

### 3. Update CORS
If your frontend or backend URLs differ from the defaults, update `server/src/app.js`:
```javascript
const corsOptions = {
  origin: [
    'your-frontend-url.vercel.app',
    'your-other-frontend-url.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

---

## Troubleshooting CORS Errors

**Error**: `Response to preflight request doesn't pass access control check`

**Solution**:
1. Check that `NEXT_PUBLIC_API_URL` on frontend matches the backend domain
2. Verify backend's `corsOptions.origin` includes the frontend domain
3. Ensure API requests include `Content-Type` header
4. Test with `curl` from browser console to verify backend is accessible
