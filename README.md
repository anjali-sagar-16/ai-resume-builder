# AI Resume Builder

A React and Express resume builder with authenticated resume management, live templates, public sharing, PDF printing, Gemini-compatible AI assistance, and ImageKit profile images.

## Features

- JWT authentication with registration and login
- Create, edit, load, and delete resumes
- Live preview with Classic, Modern, Minimal, and Minimal Image templates
- Accent colors, profile images, background-removal requests, and browser PDF printing
- Private resumes and public share URLs
- Professional-summary and experience-description enhancement actions
- PDF resume extraction flow for uploaded documents

## Tech Stack

- Client: React, React Router, Redux Toolkit, Axios, Vite, Tailwind CSS
- Server: Node.js, Express, Mongoose, MongoDB Atlas, JWT, Multer
- Services: Gemini through the OpenAI-compatible API and ImageKit

## Project Structure

```text
client/   React/Vite frontend
server/   Express/MongoDB API
```

## Local Setup

Install dependencies in both folders:

```powershell
cd client
npm install

cd ../server
npm install
```

Create private environment files from the examples:

```text
client/.env
server/.env
```

Required variable names:

Client:

- `VITE_BASE_URL`

Server:

- `MONGODB_URI`
- `PORT`
- `JWT_SECRET`
- `IMAGEKIT_PRIVATE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

Never commit the real environment files or secret values.

## Run Locally

Start the API in one terminal:

```powershell
cd server
npm start
```

Start the client in another terminal:

```powershell
cd client
npm run dev
```

The client runs on the Vite development URL. The API uses the configured server port, normally `http://localhost:3000`.

## Checks

Build the client:

```powershell
cd client
npm run build
```

Check server syntax:

```powershell
cd server
Get-ChildItem -Recurse -Filter *.js | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | ForEach-Object { node --check $_.FullName }
```