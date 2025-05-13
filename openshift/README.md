# GAIK Dashboard OpenShift Deployment Guide

This directory contains configuration files for deploying the GAIK Dashboard application to OpenShift.

## Secret Configuration

The `secrets.yaml` file contains environment variables needed for connecting to various services:

- Supabase database
- CSC S3 storage (Allas)
- OpenAI LLM services
- Authentication credentials
- Email service configuration

### Deployment Instructions

1. Check your deployment name:

   ```bash
   oc get deployments
   ```

2. Connect the secret to your deployment:
   ```bash
   oc set env deployment/dashboard --from=secret/dashboard-env-secrets
   ```

## Route Configuration

Create a route using the YAML configuration:

```bash
oc apply -f route.yaml
```

View existing routes:

```bash
oc get routes -n gaik
```

Delete a route if needed:

```bash
oc delete route dashboard-short -n gaik
```

## Security Notes

- Replace placeholder values with actual credentials before deploying
- Never commit real credentials to version control
- The sample keys in the file are not valid and are for illustration purposes only
