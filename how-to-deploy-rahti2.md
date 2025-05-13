# Rahti Notes

## Docker Image Build & Push

1. Build image:

```bash
docker build -t dashboard .
```

2. Log in to Rahti 2:

```bash
# Login command +
docker login -u unused -p $(oc whoami -t) image-registry.apps.2.rahti.csc.fi
```

3. Tag image:

```bash
docker tag dashboard image-registry.apps.2.rahti.csc.fi/gaik/dashboard:latest
```

4. Push:

```bash
docker push image-registry.apps.2.rahti.csc.fi/gaik/dashboard:latest
```

## Changing a Route Hostname in Rahti (Public-URL)

To add a new hostname or change a hostname of an existing application in Rahti, you can create a new route while keeping existing routes active. Multiple routes can point to the same service with different hostnames.

### Method 1: Using YAML (Recommended)

#### Step 1: Create a YAML file for the new route

Create a file called `new-route.yaml` with this content:

```yaml
kind: Route
apiVersion: route.openshift.io/v1
metadata:
  name: <route-name>
  namespace: <namespace>
  labels:
    app: <app-name>
    app.kubernetes.io/component: <app-name>
    app.kubernetes.io/instance: <app-name>
    app.kubernetes.io/name: <app-name>
    app.kubernetes.io/part-of: <project-name>
  annotations:
    openshift.io/host.generated: "false"
spec:
  host: <custom-name>.2.rahtiapp.fi
  to:
    kind: Service
    name: <service-name>
    weight: 100
  port:
    targetPort: <port>-tcp
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
  wildcardPolicy: None
```

Replace:

- `<route-name>`: Name for the route object
- `<namespace>`: Your project namespace
- `<app-name>`: Your application name
- `<project-name>`: Your project name
- `<custom-name>`: Your desired URL prefix
- `<service-name>`: Name of the service this route connects to
- `<port>`: Port number your service uses (e.g., 3000, 8080)

#### Step 2: Create the new route

```bash
oc create -f new-route.yaml
```

#### Step 3: Test the new route

Visit your new URL to confirm it works correctly

#### Step 4: Optionally delete the old route

If you no longer need the old route, you can delete it:

```bash
oc delete route <old-route-name> -n <namespace>
```

**Note:** You can keep multiple routes active simultaneously. Each route can have a different hostname while pointing to the same service. This allows you to maintain both old and new URLs active during transitions.

### Example

For application "upbeat" with service name "upbeat" running on port 3000:

```yaml
kind: Route
apiVersion: route.openshift.io/v1
metadata:
  name: learning-assistant
  namespace: upbeat-apps
  labels:
    app: upbeat
    app.kubernetes.io/component: upbeat
    app.kubernetes.io/instance: upbeat
    app.kubernetes.io/name: upbeat
    app.kubernetes.io/part-of: learning-assistant
  annotations:
    openshift.io/host.generated: "false"
spec:
  host: learning-assistant.2.rahtiapp.fi
  to:
    kind: Service
    name: upbeat
    weight: 100
  port:
    targetPort: 3000-tcp
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Redirect
  wildcardPolicy: None
```

**Note:** Hostnames in Rahti must end with `.2.rahtiapp.fi` and the prefix must be unique across the Rahti environment.
