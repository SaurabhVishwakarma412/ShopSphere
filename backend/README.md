# ShopSphere API

## Local development

1. Copy `.env.example` to `.env` and set a private `JWT_SECRET`.
2. Run `npm install`.
3. Start MongoDB locally or set `MONGO_URI` to MongoDB Atlas.
4. Run `npm run dev`.

The API runs on `http://localhost:5000`; health checks are available at `/api/health`.

## Production

Set `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `SERVER_URL` in the hosting provider. `CLIENT_URL` accepts comma-separated frontend origins. Local product uploads require persistent storage; use an object-storage adapter before deploying the upload feature to an ephemeral host.
