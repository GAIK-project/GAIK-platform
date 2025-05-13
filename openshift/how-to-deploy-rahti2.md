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

## Troubleshooting

If the build process fails, check the Rahti 2 logs to debug the problem. You can allocate more resources for the build process by using the following command:

```bash
# Increase build configuration resources
oc patch bc/dashboard -p '{"spec":{"resources":{"limits":{"memory":"4Gi","cpu":"2"},"requests":{"memory":"2Gi","cpu":"1"}}}}'
```

This allocates up to 4GB memory and 2 CPU cores for the build process.

You can also optimize the build process with the following command:

```bash
# Optimize build strategy
oc patch bc/dashboard -p '{"spec":{"strategy":{"dockerStrategy":{"imageOptimizationPolicy":"SkipLayers","noCache":true}}}}'
```

This configuration skips layer optimization and disables caching during the build process.