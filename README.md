## Serverless Framework CRUD (AWS) + React Frontend (MUI + Cognito)  

End-to-end example that provisions an AWS API Gateway REST API with 5 Lambdas (CRUD + list) storing data in DynamoDB and protected by Cognito User Pool. A React frontend (Vite + MUI) integrates Cognito for auth and exercises all CRUD operations. Multi-stage (dev/prod) CI/CD is implemented with GitHub Actions.  

### Architecture
- **Backend**: API Gateway (REST) → Lambda (Node.js) → DynamoDB
- **Auth**: Cognito User Pool + Client (no secret)
- **Frontend**: React + MUI + Amplify Auth. Responsive for xs/sm/md/lg
- **CI/CD**: GitHub Actions deploys backend per stage; frontend to S3 + optional CloudFront

### Repo layout
- `backend/`: Serverless Framework app (Node.js 20)
- `frontend/`: React (Vite) + Material UI + Amplify Auth
- `.github/workflows/`: CI/CD workflows
- `docs/`: Drop screenshots and notes here

### Prerequisites
- AWS account and IAM user with permissions for CloudFormation, IAM, API Gateway, Lambda, DynamoDB, Cognito, S3, CloudFront.
- Node.js 18+ (20 recommended)
- Serverless Framework (`npm i -g serverless` or use `npx`)

### Backend (Serverless)
Key files:
- `backend/serverless.yml`: DynamoDB table, Cognito User Pool + Client, REST API routes, IAM permissions
- `backend/src/handlers/*.js`: CRUD handlers

Local deploy:
```bash
cd backend
npm ci
npx serverless deploy --stage dev
```
Outputs include:
- ApiUrl
- CognitoUserPoolId
- CognitoUserPoolClientId

Use these to set frontend env vars:
```
VITE_API_BASE_URL=<<ApiUrl>>
VITE_AWS_REGION=<<region used>>
VITE_COGNITO_USER_POOL_ID=<<CognitoUserPoolId>>
VITE_COGNITO_USER_POOL_CLIENT_ID=<<CognitoUserPoolClientId>>
```

### Frontend (React + MUI + Amplify)
```bash
cd frontend
npm ci
cp env.example .env # or create .env with VITE_* vars above
npm run dev
```
Open http://localhost:5173, sign up, confirm, login, then create/read/update/delete items.

### CI/CD (GitHub Actions)
- Backend:
  - `.github/workflows/deploy-backend-dev.yml` on push to `dev` → `sls deploy --stage dev`
  - `.github/workflows/deploy-backend-prod.yml` on push to `master` or `main` → `sls deploy --stage prod`
- Frontend:
  - `.github/workflows/deploy-frontend.yml` builds and deploys to S3 (+ optional CloudFront) on `dev` or `master/main`

Required GitHub Secrets:
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
- Frontend build vars: `VITE_API_BASE_URL`, `VITE_AWS_REGION`, `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_USER_POOL_CLIENT_ID`
- Frontend deploy: `FRONTEND_BUCKET_DEV`, `FRONTEND_BUCKET_PROD`, optionally `CLOUDFRONT_DISTRIBUTION_DEV`, `CLOUDFRONT_DISTRIBUTION_PROD`

### Multi-stage
Stages derive from branch:
- `dev` branch → dev stage
- `master/main` → prod stage
Resources are named `${service}-${stage}-*` to avoid collisions.

### Authentication
- Cognito User Pool enforces auth on API routes via API Gateway Cognito authorizer.
- Frontend uses Amplify Auth for signup/login/confirm and attaches JWT on API requests.

### Responsive & Design
- MUI responsive grid/cards; layouts adapt to xs/sm/md/lg.

### Screenshots & Video
- Add CI/CD screenshots under `docs/ci-cd/` (placeholders included).
- Loom walkthrough link (update after recording):  
  `https://www.loom.com/share/REPLACE_WITH_YOUR_VIDEO_ID`

### Frequent commits
Suggested commit cadence (examples):
- chore(init): scaffold repo with backend, frontend, workflows
- feat(backend): add DynamoDB table and CRUD Lambdas
- feat(auth): add Cognito User Pool + API authorizer
- feat(frontend): add Auth (Amplify) and responsive UI
- ci(backend): add GHA deploy for dev/prod
- ci(frontend): add GHA S3/CloudFront deploy
- docs: update README with setup and screenshots

### Optional additions included
- Cognito signup/login, API protection
- Organized YAML and multi-stage variables
- Frontend deployment workflow (S3 + CloudFront)

### Cleanup
```bash
cd backend
npx serverless remove --stage dev
npx serverless remove --stage prod
```


