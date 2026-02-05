# ReadmeCraft

A developer‑focused web app that generates clean, copy‑paste‑ready GitHub profile READMEs with live preview, themed badges, and modular sections.
https://readmecraft-inky.vercel.app/

## Features
- GitHub‑styled dark UI with light mode toggle
- Live preview + Markdown output in one panel
- Copy‑to‑clipboard Markdown
- Section toggles (hide/show input blocks)
- Featured Projects playground with dynamic cards
- Theme‑aware Repo/Live badges

## Tech Stack
- Frontend: HTML, CSS, Vanilla JS
- Backend: FastAPI (optional for generation)

## Quick Start (Frontend Only)
```bash
cd frontend
python -m http.server 5173
```
Open `http://127.0.0.1:5173`.

## Run Backend (Optional)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The frontend will call `http://127.0.0.1:8000/generate` if the backend is running, otherwise it falls back to local generation.

## Project Structure
```
ReadmeCraft/
│
├── api/
│   ├── index.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── vercel.json
├── LICENSE
└── README.md
```

## Usage
1. Fill in your name, role, socials, skills, and projects.
2. Toggle sections on/off as needed.
3. Copy Markdown and paste into your GitHub profile README.

## Attributions / Third-Party Services
This project relies on third-party services and libraries that have their own terms of use. Please review them before deploying or distributing this project.

- Shields.io (badges): https://shields.io
- Readme Typing SVG: https://github.com/DenverCoder1/readme-typing-svg
- GitHub Readme Stats: https://github.com/anuraghazra/github-readme-stats
- GitHub Streak Stats: https://github.com/DenverCoder1/github-readme-streak-stats
- GitHub Profile Trophy: https://github.com/ryo-ma/github-profile-trophy
- Marked (Markdown parser, CDN): https://marked.js.org
- GitHub raw content (wave GIF host): https://raw.githubusercontent.com/ABSphreak/ABSphreak/master/gifs/Hi.gif

## License
MIT License. See `LICENSE`.

