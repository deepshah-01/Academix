# Academix

Academix is a front-end student productivity app for managing notes, attendance, study resources, bookmarks, and quick search from one dashboard.

## What It Does
- Student signup and login with localStorage persistence
- Dashboard with quick stats and recent activity
- Attendance calculator
- Notes management with pin, bookmark, image, and preview support
- Resources manager with URL links or local file uploads
- Global search across notes and resources
- Bookmarks hub for saved content
- Profile page with saved totals and theme toggle
- Automatic dark mode across the app

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript
- localStorage

## Pages
- `index.html` - Landing page
- `signup.html` - Create a new account
- `login.html` - Sign in
- `dashboard.html` - Student overview and stats
- `attendance.html` - Attendance calculator
- `notes.html` - Notes editor and organizer
- `resources.html` - Resource manager with link/file support
- `bookmarks.html` - Saved notes and resources
- `search.html` - Global search
- `profile.html` - User profile and theme control

## Project Structure
```text
.
|-- css/
|   |-- auth.css
|   |-- attendance.css
|   |-- bookmarks.css
|   |-- dashboard.css
|   |-- notes.css
|   |-- profile.css
|   |-- resources.css
|   |-- search.css
|   |-- sidebar.css
|   |-- style.css
|-- js/
|   |-- auth.js
|   |-- attendance.js
|   |-- bookmarks.js
|   |-- dashboard.js
|   |-- login.js
|   |-- notes.js
|   |-- profile.js
|   |-- resources.js
|   |-- search.js
|   |-- storage.js
|   |-- theme.js
|-- index.html
|-- login.html
|-- signup.html
|-- dashboard.html
|-- attendance.html
|-- notes.html
|-- resources.html
|-- bookmarks.html
|-- search.html
|-- profile.html
|-- LICENSE
```

## How It Works
- User data, notes, resources, bookmarks, theme preference, and activity history are stored in `localStorage`.
- Shared sidebar layout lives in `css/sidebar.css`.
- Shared dark mode logic lives in `js/theme.js`.
- Resources can be saved either as a normal link or as a local file upload.

## Run Locally
1. Open the project folder.
2. Launch `index.html` in your browser.
3. Or use a local server such as VS Code Live Server.

## Deployment
Deploy the project with Netlify, Vercel, or GitHub Pages.

## Live Demo
https://academix-plum.vercel.app

## Notes
- Uploaded files are stored as data URLs in `localStorage`, so smaller files work best.
- Dark mode is applied automatically across supported pages.

## License
This project is released under the terms in `LICENSE`.
