# CSC Rahti Deployment Guide

## JWT Token Authentication - How it works

### 1. User Perspective

```bash
# 1. Get JWT token with API key
curl -X POST "https://gaik-whisper.2.rahtiapp.fi/auth/token" \
  -F "api_key=gaik-client-001-abc123def456"

# Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer", 
  "expires_in": 86400
}

# 2. Use JWT token in API calls
curl -X POST "https://gaik-whisper.2.rahtiapp.fi/transcribe" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -F "file=@audio.mp3"
```

### 2. CSC Rahti Deployment

#### Create OpenShift Secret for environment variables

```bash
# Create secret (don't commit to git!)
oc create secret generic whisper-api-secrets \
  --from-literal=JWT_SECRET_KEY="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2" \
  --from-literal=VALID_API_KEYS="gaik-client-001-abc123def456,gaik-admin-002-xyz789ghi012" \
  --from-literal=OPENAI_API_KEY="your_actual_openai_key" \
  --from-literal=AZURE_API_KEY="your_actual_azure_key" \
  --from-literal=AZURE_API_BASE="https://your-resource.openai.azure.com/"
```

### 3. API Key Management

#### Generate strong API keys

```bash
# Generate secure keys
openssl rand -hex 16  # gaik-client-001-abc123def456
openssl rand -hex 16  # gaik-admin-002-xyz789ghi012
```

#### Share keys securely

- **Email**: Never send API keys via email
- **Slack/Teams**: Use private messages or secure sharing
- **Password manager**: Recommended way to share keys
- **Secure notes**: e.g. Bitwarden, 1Password

### 4. JWT Token Lifecycle

```text
API Key (permanent) 
    ↓ POST /auth/token
JWT Token (24h)
    ↓ Authorization: Bearer ...
Protected API Access
    ↓ Token expires (24h)
New token needed
```

### 5. Security Operations

#### Change API key

```bash
# 1. Generate new key
NEW_KEY="gaik-client-001-$(openssl rand -hex 16)"

# 2. Update secret in Rahti
oc patch secret whisper-api-secrets -p '{"data":{"VALID_API_KEYS":"'$(echo -n "$NEW_KEY,old_keys" | base64)'"}}'

# 3. Restart pods
oc rollout restart deployment gaik-whisper-api

# 4. Notify user about new key
# 5. Remove old key when confirmed changed
```

#### Change JWT secret

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -hex 32)

# Update in Rahti
oc patch secret whisper-api-secrets -p '{"data":{"JWT_SECRET_KEY":"'$(echo -n "$NEW_SECRET" | base64)'"}}'

# Restart (invalidates all existing tokens!)
oc rollout restart deployment gaik-whisper-api
```

### 6. Monitoring and Logging

```bash
# Check API status
curl https://gaik-whisper.2.rahtiapp.fi/health

# View logs in Rahti
oc logs -f deployment/gaik-whisper-api

# Check secret
oc get secret whisper-api-secrets -o yaml
```

### 7. User Instructions

1. **Get API key** from GAIK team
2. **Exchange key for JWT token** (valid 24h)
3. **Use JWT token** in API calls
4. **Renew token** when expired

### 8. Production Checklist

- [ ] Generate strong JWT secret key (32+ characters)
- [ ] Create unique API keys for each client
- [ ] Store secrets in OpenShift secrets (not files)
- [ ] Enable HTTPS/TLS termination
- [ ] Set up monitoring and logging
- [ ] Document API keys and their owners
- [ ] Plan key rotation schedule
