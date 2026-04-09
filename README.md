# Prodesk Website + Backend

Overview
- Static site exported under `prodesk.in/` (multiple HTML pages).
- Node.js backend in `backend/` (Express, multer, Mongoose) .

Quickstart (local)
1. Backend
   - cd backend
   - npm install
   - Create a `.env` with required vars (example below)
   - Start server:

```bash
# option A
node server.js
# option B (if package.json provides start)
npm start
```

2. Frontend
- Serve the `prodesk.in/` folder with a static server (e.g., `live-server`, `http-server`, or the editor preview).

Environment variables (.env example)

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/prodesk?retryWrites=true&w=majority
JWT_SECRET=replace-with-secret
```

Important endpoints
- POST /api/contact — contact form (JSON form fields expected by backend)
- POST /api/career — career form (multipart/form-data, file input name: `resume`)

Notes
- The frontend must post forms to the backend host:port (default http://localhost:5000) — otherwise static dev servers may return HTTP 405.
- If some pages have broken header behavior, check HTML validity (unclosed/malformed tags) and external script URL protocols (use https:// for external assets).

Contributing
- See `CONTRIBUTING.md` for contribution guidelines.

License
- Add a license file or update this README with licensing information.
