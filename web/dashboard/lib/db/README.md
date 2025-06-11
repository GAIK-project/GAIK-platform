# CSC S3 Credentials Setup Guide

This guide explains how to set up S3 credentials for CSC Allas service using OpenStack and AWS CLI to windows.

## Prerequisites

- CSC account with access to Allas service
- AWS CLI installed (check with `aws --version`)
- Python and pip installed

## Steps

### 1. Download Configuration Files from CSC Pouta

1. Log in to https://pouta.csc.fi/dashboard/project/api_access/
2. Download `clouds.yaml` file
   - Contains necessary OpenStack configuration

### 2. Set Up OpenStack Environment Variables

Use PowerShell to set the following environment variables using the values from your `clouds.yaml`:

```powershell
$env:OS_AUTH_URL = "your_auth_url"
$env:OS_USERNAME = "your_username"
$env:OS_PROJECT_ID = "your_project_id"
$env:OS_PROJECT_NAME = "your_project_name"
$env:OS_USER_DOMAIN_NAME = "Default"
$env:OS_PASSWORD = "your_csc_password"
$env:OS_IDENTITY_API_VERSION = "3"
$env:OS_INTERFACE = "public"
```

### 3. Get EC2 Credentials

```powershell
# Install OpenStack CLI if not already installed
pip install python-openstackclient

# List EC2 credentials
openstack ec2 credentials list
```

### 4. Configure AWS CLI

Set up your AWS configuration files:

1. Create/edit `C:\Users\YourUsername\.aws\config`:

```ini
[default]
region = eu-north-1
endpoint_url = https://a3s.fi
s3 =
    addressing_style = path
    endpoint_url = https://a3s.fi
```

2. Create/edit `C:\Users\YourUsername\.aws\credentials`:

```ini
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

### 5. Test the Configuration

- Check your AWS CLI version with `aws --version`

```powershell
# List all buckets
aws s3 ls

# List contents of a specific bucket
aws s3 ls s3://bucket-name/
```

## Common AWS S3 Commands

```powershell
# Upload a file
aws s3 cp file.txt s3://bucket-name/

# Download a file
aws s3 cp s3://bucket-name/file.txt ./

# Sync a directory
aws s3 sync local-directory s3://bucket-name/remote-directory

# Delete a file
aws s3 rm s3://bucket-name/file.txt
```

CSC docs: https://docs.csc.fi/support/faq/how-to-get-Allas-s3-credentials/
