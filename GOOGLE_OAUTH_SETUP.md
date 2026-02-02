# Google OAuth Integration Guide

## Overview

Phase 3 now includes complete Google OAuth integration for both sign-in and sign-up flows. Users can authenticate with their Google account in addition to traditional email/password authentication.

## Architecture

### Frontend Components

**GoogleSignInButton.tsx**

- Client component that loads Google Sign-In script
- Initializes Google OAuth client with client ID
- Handles credential response and token exchange
- Redirects to dashboard on success

**Updated Auth Pages**

- `signin/page.tsx`: Added GoogleSignInButton component
- `signup/page.tsx`: Added GoogleSignInButton component for seamless signup via Google

### Backend Endpoints

**Users Service** (`/api/auth/google`)

```csharp
POST /api/auth/google
Body: { idToken: string }
Response: { token: string, userId: string }
```

- Verifies Google ID token via Google API
- Creates new user if doesn't exist
- Returns JWT token for session management

**BFF Gateway** (`/api/auth/google`)

- Proxies Google OAuth requests to Users service
- Maintains consistent API surface

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/auth/signin`
   - Copy Client ID and Client Secret

### 2. Environment Variables

Add to `.env.local` or `.env`:

**Frontend** (Next.js):

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Backend** (Users Service):

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 3. Database Schema Update

Users table now includes optional `GoogleId` field:

```csharp
public string? GoogleId { get; set; }
```

## How It Works

### Sign-In Flow

```
1. User clicks "Sign in with Google"
2. GoogleSignInButton loads Google Sign-In SDK
3. Google OAuth dialog appears
4. User authenticates with Google
5. Google returns ID token to frontend
6. Frontend sends ID token to BFF (/api/auth/google)
7. BFF forwards to Users service
8. Users service verifies token with Google API
9. User record checked/created in MongoDB
10. JWT token generated and returned
11. Frontend stores token in localStorage
12. User redirected to /dashboard
```

### Key Differences from Email/Password Auth

- No password required
- Automatic account creation if email doesn't exist
- Google email verified automatically
- Random password generated for OAuth users (not used for login)
- Token-based authentication same as traditional auth

## Security Considerations

✅ **Implemented**

- ID token verification with Google servers
- JWT token generation for session management
- Secure token storage in localStorage
- HTTPS recommended for production

⚠️ **Production Recommendations**

- Use httpOnly cookies instead of localStorage for tokens
- Implement token refresh logic
- Add rate limiting on auth endpoints
- Set up CORS properly
- Use HTTPS only
- Rotate secrets regularly

## API Response Format

### Success Response

```json
{
  "token": "eyJhbGc...",
  "userId": "user-id-guid"
}
```

### Error Response

```json
{
  "message": "Invalid Google token",
  "error": "error details"
}
```

## Files Modified

**Frontend**

- `src/lib/api.ts` - Added `googleSignIn()` function
- `src/components/GoogleSignInButton.tsx` - NEW Google OAuth button component
- `src/app/auth/signin/page.tsx` - Integrated Google OAuth button
- `src/app/auth/signup/page.tsx` - Integrated Google OAuth button

**Backend**

- `services/users/Program.cs` - Added `/api/auth/google` endpoint
- `backend/bff/Program.cs` - Added `/api/auth/google` proxy
- `infra/.env.example` - Added Google OAuth variables

## Testing

### Local Testing

1. Start all services:

   ```bash
   # Terminal 1: Docker containers
   cd infra && docker-compose up -d

   # Terminal 2: Users service
   cd backend/services/users && dotnet run

   # Terminal 3: BFF
   cd backend/bff && dotnet run

   # Terminal 4: Frontend
   cd frontend/web && pnpm dev
   ```

2. Navigate to `http://localhost:3000/auth/signin`
3. Click "Sign in with Google"
4. Use test Google account to sign in
5. Verify redirect to `/dashboard`

### Testing Without Real Google Account

You can mock Google responses for testing:

```typescript
// In GoogleSignInButton test
const mockIdToken = "mock-token-for-testing";
// Update backend to accept test tokens in development
```

## Next Steps

1. **Session Management**: Persist auth state across page reloads
2. **Token Refresh**: Implement token expiration and refresh logic
3. **Google Profile**: Fetch user avatar from Google profile
4. **Logout**: Revoke Google tokens on logout
5. **Link Accounts**: Allow linking Google to existing email account

## Troubleshooting

### "Google Sign-In script failed to load"

- Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- Verify internet connection
- Clear browser cache

### "Invalid Google token"

- Verify ID token is being sent correctly
- Check Google Client ID matches in backend config
- Review Google OAuth console settings

### Token verification fails

- Ensure Google API is enabled in Google Cloud Console
- Verify Google Client Secret is correct
- Check network requests in browser DevTools

## References

- [Google Sign-In for Web](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [JWT Token Best Practices](https://tools.ietf.org/html/rfc8725)
