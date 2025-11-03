# rubin-zonen

## Installation

Rename the .env.shared (in `backend-rubin-zonen\.env.shared`) to .env and complete the informations in the file.

In the terminal paste this to launch the backend :

```bash
cd backend-rubin-zonen
docker compose up -d
npm i
npm run start
```

In an other terminal this to launch the front :

```bash
cd frontend-rubin-zonen
npm i
npm run dev
```

And go to the URL given by Vite (in the terminal)

The documentation for backend routes is on http://localhost:3000/api-docs/
