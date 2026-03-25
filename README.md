# RedditMinimal (DummyJSON Visual Feed)

Reddit-style discovery feed built with React and Redux.
This version is powered by DummyJSON and uses Picsum seeded images so the feed feels visual.

---

## Features

- Visual post grid (responsive: 2–3 columns on desktop, 1 on mobile)
- Category feeds: `popular` + tag-based categories (sidebar + dropdown)
- Search posts by title
- Open a post in an in-app modal (full content + comments)
- Add comments locally and upvote/downvote locally (UI-only)

---

## Technologies Used

- React
- Redux Toolkit
- JavaScript
- CSS

---

## How It Works

- Posts are fetched from DummyJSON:
  - `GET /posts?limit=20` for the default `popular` feed
  - `GET /posts/tag/{slug}` for tag-based feeds
- Post images are generated with Picsum (seeded by post id) so every post has a visual card.
- Feed tags are fetched for the sidebar:
  - `GET /posts/tags`
- Comments are fetched when the user opens the post modal:
  - `GET /posts/{id}/comments`
- Upvotes/downvotes are UI-only, and added comments are saved locally in Redux (no backend).

---

## Getting Started

Clone the project and install dependencies:

```bash
npm install
npm start
```

---

## Netlify Deploy (Simple Steps)

1. Push this project to GitHub.
2. Go to Netlify and click **Add new site**.
3. Choose **Import an existing project** and connect your GitHub repo.
4. Use these build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click **Deploy site**.

---

## Notes

- The app uses direct client-side calls to DummyJSON and Picsum (no Reddit proxy function needed).
- If local build fails because of OpenSSL on newer Node, run:

```bash
$env:NODE_OPTIONS='--openssl-legacy-provider'
npm run build
```
