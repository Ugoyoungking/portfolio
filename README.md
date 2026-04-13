# Ugochukwu Portfolio

A modern multi-page personal portfolio for **Ugochukwu Jonathan** (Ugoyoungking), featuring:

- Main portfolio landing page (`index.html`)
- Developer journey page (`dev-history.html`)
- Official biography page (`biography.html`)

## ✨ Highlights

- Responsive portfolio layout with sticky navigation
- Dark mode toggle with saved preference (`localStorage`)
- Project search and category filters
- GitHub repository feed (auto-fetched public repos)
- Scroll progress bars and reveal-on-scroll animations
- Timeline, testimonials/reviews, and contact sections
- SEO metadata + schema markup

## 📁 Project Structure

- `index.html` – Main portfolio page
- `style.css` – Main styles for the portfolio page
- `app.js` – Main interactive behaviors (theme, filters, modals, scroll UI)
- `github-projects.js` – Fetches/render latest GitHub repositories
- `dev-history.html` – Development history page
- `dev-history.css` – Styles for dev history page
- `dev-history.js` – Scroll/reveal interactions for dev history page
- `biography.html` – Biography page (includes inline styles and script)

## 🚀 Run Locally

Because this is a static website, you can run it with any local static server.

### Option 1: Python

```bash
python -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`

### Option 2: VS Code Live Server

1. Open project folder in VS Code.
2. Install/use **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

## 🔧 Customization

### Update GitHub repos source

Edit `github-projects.js`:

```js
const username = 'Ugoyoungking';
```

Change to your GitHub username if needed.

### Update contact/social links

- `index.html`
- `dev-history.html`
- `biography.html`

## 🧪 Quick Checks

Basic JavaScript syntax checks:

```bash
node --check app.js
node --check github-projects.js
node --check dev-history.js
```

## 📌 Notes

- This project is static and frontend-only.
- Login/Signup behavior is demo/local only.
- Contact form email service requires EmailJS credentials to be configured in `app.js`.

## 📄 License

Personal portfolio project. Reuse with attribution.
