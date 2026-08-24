---
name: deploy-k8s
description: Build and deploy Shopverse (backend + frontend + MySQL) to the local Kubernetes cluster inside Docker Desktop, then report the app URL. Use when the user asks to deploy, redeploy, or run this app on Kubernetes/Docker Desktop.
---

# Deploy Shopverse to Docker Desktop Kubernetes

This project's Kubernetes manifests live in `k8s/`. Docker Desktop's Kubernetes
shares its local image store with the Docker Engine, so images built with
`docker build` are usable directly (`imagePullPolicy: Never`, no registry push
needed).

## 0. Locate the CLIs

`docker` and `kubectl` may not be on PATH even when Docker Desktop is
installed and running. Try plain `docker version` / `kubectl version --client`
first. If not found, locate Docker Desktop's bundled binaries and prepend
them to PATH for this session:

- Windows: search for `resources\bin\docker.exe` under
  `%ProgramFiles%\Docker\Docker`, `%LOCALAPPDATA%\Programs\DockerDesktop`, and
  `%LOCALAPPDATA%\Docker`. `kubectl.exe` sits next to it in the same `bin` dir.
- macOS/Linux: `docker`/`kubectl` are normally already on PATH once Docker
  Desktop is installed.

## 1. Verify the cluster is up

```bash
kubectl config get-contexts   # expect a docker-desktop context
kubectl get nodes             # expect a Ready node
```

If there's no `docker-desktop` context or this errors with "couldn't get
current server API group list" / "Forbidden", Kubernetes is not enabled or
still starting:

- Docker Desktop → Settings (gear) → Kubernetes → "Enable Kubernetes" →
  Apply & Restart.
- First-time enable pulls several images and can take 5-10 minutes. Check the
  bottom-left status / Kubernetes settings tab for a green "running"
  indicator before proceeding — don't just take the user's word that they
  clicked the checkbox, verify with `kubectl get nodes`.

Don't proceed to apply manifests until `kubectl get nodes` succeeds.

## 2. Build the images

From the repo root:

```bash
docker build -t shopverse-backend:latest ./backend
docker build -t shopverse-frontend:latest ./frontend
```

These can run in the background/in parallel — the backend build (Maven) is
the slower one. Re-run after any code change and before redeploying; `kubectl
rollout restart` won't pick up a new image tag content by itself with
`imagePullPolicy: Never` unless the deployment is bounced (step 4 covers
this).

## 3. Apply the manifests

If `k8s/secret.yaml` doesn't exist yet, create it from the template and ask
the user whether to keep the defaults or set real values (MySQL root
password, JWT secret):

```bash
cp k8s/secret.example.yaml k8s/secret.yaml   # first deploy only, gitignored
```

Then apply everything:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

## 4. Redeploying after a code change

Since images are local-only (`imagePullPolicy: Never`), a rebuilt
`:latest` tag won't automatically get picked up by a running pod. After
rebuilding an image:

```bash
kubectl rollout restart deployment/backend -n shopverse
kubectl rollout restart deployment/frontend -n shopverse
```

## 5. Wait for pods to be ready

```bash
kubectl -n shopverse get pods -w
```

Wait until `mysql`, `backend`, and `frontend` all show `Running`/`1/1`. MySQL
takes the longest on first boot (schema init). Backend readiness depends on
MySQL being reachable — if backend crashloops, check
`kubectl -n shopverse logs deploy/backend` and confirm the mysql pod is Ready
first.

## 6. Get the app URL

The frontend Service is `type: LoadBalancer`. Docker Desktop's Kubernetes
auto-exposes LoadBalancer services on `localhost`:

```bash
kubectl -n shopverse get svc frontend
```

Look at the `PORT(S)` column (typically `80:xxxxx/TCP`) and the `EXTERNAL-IP`
— with Docker Desktop this resolves to `localhost`, so the app is reachable
at:

```
http://localhost:<the port before the colon, usually 80>
```

i.e. usually just **http://localhost**. If `EXTERNAL-IP` stays `<pending>`
for more than a minute, fall back to port-forwarding instead:

```bash
kubectl -n shopverse port-forward svc/frontend 8081:80
```
then the app is at `http://localhost:8081` (keep this command running in the
background).

Report the working URL back to the user — don't just say "deployed", give
them the clickable link.

## Teardown

```bash
kubectl delete namespace shopverse
```
