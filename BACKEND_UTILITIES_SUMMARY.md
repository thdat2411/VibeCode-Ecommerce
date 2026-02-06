# Backend Utilities Summary

## Overview

Added three critical utility functions to the Users service to enhance authentication and security. These utilities handle JWT token generation, Google OAuth validation, and password hashing.

## 1. JWT Token Generator (`Utils/JwtTokenGenerator.cs`)

**Purpose**: Generates secure JWT tokens for authenticated users.

**Key Features**:

- Uses symmetric key with HMAC-SHA256 signing
- Includes claims: NameIdentifier, Email, Name
- 7-day expiration
- Configurable via appsettings (Jwt:SecretKey, Jwt:Issuer, Jwt:Audience)

**Usage**:

```csharp
var token = JwtTokenGenerator.GenerateToken(user, configuration);
```

**Returns**: JWT token string

---

## 2. Google OAuth Helper (`Utils/GoogleOAuthHelper.cs`)

**Purpose**: Validates Google ID tokens and retrieves user profile information.

**Components**:

### GoogleUserInfo Record

- `Email`: User's email address
- `Name`: User's full name (optional)
- `Picture`: User's profile picture URL (optional)

### GoogleUserProfile Record

- `Id`: Google user ID
- `Email`: User's email address
- `Name`: User's full name (optional)
- `Picture`: User's profile picture URL (optional)

### Key Methods\*\*:

**ValidateTokenAndGetUserInfo(idToken)**

- Validates Google ID token via Google API
- Returns GoogleUserInfo if valid
- Returns null if invalid or error occurs

**GetUserProfile(accessToken)**

- Retrieves full user profile from Google
- Uses access token for authentication
- Returns GoogleUserProfile if successful
- Returns null if invalid or error occurs

**Usage**:

```csharp
// Validate ID token
var userInfo = await googleOAuthHelper.ValidateTokenAndGetUserInfo(idToken);

// Get user profile
var profile = await googleOAuthHelper.GetUserProfile(accessToken);
```

---

## 3. Password Hasher (`Utils/PasswordHasher.cs`)

**Purpose**: Securely hashes and verifies passwords using PBKDF2.

**Security Configuration**:

- Algorithm: PBKDF2-SHA256
- Salt Size: 128 bits
- Key Size: 256 bits
- Iterations: 10,000 (NIST recommended minimum)
- Hash Format: `{iterations}.{salt}.{key}` (Base64 encoded)

### Key Methods\*\*:

**HashPassword(password)**

- Hashes a plaintext password
- Generates random salt
- Returns formatted hash string

**VerifyPassword(password, hash)**

- Verifies plaintext password against hash
- Uses stored iterations and salt
- Returns true/false

**Usage**:

```csharp
// Hash password
var passwordHash = PasswordHasher.HashPassword("myPassword123");

// Verify password
bool isValid = PasswordHasher.VerifyPassword("myPassword123", passwordHash);
```

---

## Integration Points

### AuthEndpoints.cs Updates

- `Register`: Returns user + JWT token
- `Login`: Returns user + JWT token
- `GoogleSignIn`:
  - Uses GoogleOAuthHelper to validate token
  - Returns user + JWT token
  - Improved error handling with GoogleUserInfo

### UserService.cs Updates

- `RegisterAsync`: Uses PasswordHasher.HashPassword()
- `LoginAsync`: Uses PasswordHasher.VerifyPassword()
- `CreateOrUpdateFromGoogleAsync`: Uses PasswordHasher.HashPassword()
- Constructor now takes GoogleOAuthHelper parameter

### Program.cs Updates

- Added `using Users.Utils;`
- Registered GoogleOAuthHelper as scoped service
- All JWT configuration preserved

---

## Security Benefits

1. **JWT Tokens**: Standard-based authentication with expiration
2. **Google OAuth**: Validated tokens prevent spoofing
3. **Password Security**:
   - PBKDF2 algorithm (NIST approved)
   - High iteration count (10,000)
   - Random salt per password
   - Cannot reverse-engineer passwords from hashes

---

## Configuration Required

### appsettings.json

```json
{
  "Jwt": {
    "SecretKey": "your-long-secret-key-here",
    "Issuer": "your-api",
    "Audience": "your-frontend"
  },
  "Google": {
    "ClientId": "your-google-client-id",
    "ClientSecret": "your-google-client-secret"
  }
}
```

---

## Files Modified/Created

### New Files:

- ✅ `Utils/JwtTokenGenerator.cs`
- ✅ `Utils/GoogleOAuthHelper.cs`
- ✅ `Utils/PasswordHasher.cs`

### Modified Files:

- ✅ `Services/UserService.cs` - Updated to use utilities
- ✅ `Endpoints/AuthEndpoints.cs` - Updated to return JWT tokens
- ✅ `Program.cs` - Updated to register GoogleOAuthHelper

---

## Testing Recommendations

1. **Register Endpoint**:

   ```
   POST /api/auth/register
   { "email": "user@example.com", "name": "User", "password": "pass123" }
   ```

   Expected: { "user": {...}, "token": "jwt..." }

2. **Login Endpoint**:

   ```
   POST /api/auth/login
   { "email": "user@example.com", "password": "pass123" }
   ```

   Expected: { "user": {...}, "token": "jwt..." }

3. **Google Sign-In**:
   ```
   POST /api/auth/google
   { "idToken": "google-id-token-here" }
   ```
   Expected: { "user": {...}, "token": "jwt..." }

---

## Next Steps

1. Test all auth endpoints with JWT token returns
2. Implement Bearer token validation in protected endpoints
3. Add refresh token mechanism (optional)
4. Create API documentation for auth flows
5. Proceed with frontend integration (Context API, auth hooks)
