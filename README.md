<h1>
  BunkSafe
  <img src="icons/icon-512.png" alt="BunkSafe logo" width="96" height="96" align="right" />
</h1>


![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)
![License](https://img.shields.io/github/license/ask-io/BunkSafe)
![Last Commit](https://img.shields.io/github/last-commit/ask-io/BunkSafe)

A mobile-first PWA that tells you exactly how many classes you can afford to skip — and still hit your attendance target. No backend, no accounts — everything runs and stays in your browser.

🌐 **Live Demo:** [ask-io.github.io/BunkSafe](https://ask-io.github.io/BunkSafe/)

---

## Screenshots

_Coming soon._

---

## Features

- **Per-subject tracking** – attended, total, and a custom minimum-attendance target for each subject.
- **Safe-bunk calculator** – instantly see how many classes you can miss and stay above target.
- **Status at a glance** – subjects are flagged safe, warning, or at-risk based on your target.
- **Edit and update inline** – adjust a subject's numbers or target anytime from its card.
- **Works offline** – installable as a PWA, service-worker cached, no internet needed after first load.
- **All local** – attendance data lives in your browser's LocalStorage, nothing is sent anywhere.

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Structure | HTML5 |
| Styling | CSS3 (custom design tokens, no framework) |
| Logic | Vanilla JavaScript (ES6) |
| Persistence | Browser LocalStorage |
| Offline Support | Service Worker + Web App Manifest |
| Deployment | GitHub Pages |

---

## Project Structure

```
.
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── calc.js
│   ├── storage.js
│   ├── ui.js
│   ├── pixel-canvas.js
│   └── install-prompt.js
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-192.png
    └── icon-maskable-512.png
```

---

## Usage

1. Open the app and enter your name.
2. Add a subject with your attended/total classes and a minimum attendance target (defaults to 75%).
3. Tap **✓ ATTEND** or **✕ BUNK** after each class to keep it updated.
4. Tap **✎** on a subject card to edit its numbers or target.
5. Watch the status badge — it tells you exactly where you stand.

### Install as an App

On mobile or desktop, use the **Install** prompt (or your browser's "Add to Home Screen" / install icon) to run BunkSafe like a native app, offline.

---

## License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

## Author

**Abhijit Smiju Kunnel**

🐙 **GitHub:** [github.com/ask-io](https://github.com/ask-io)
