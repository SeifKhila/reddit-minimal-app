# Reddit Minimal App

A simple Reddit-style web application built with React and Redux.

Users can browse posts, switch between subreddits, and view live data from the Reddit API.

---

## Features

- Browse posts from different subreddits  
- Change subreddit using dropdown  
- Search for posts  
- View post details and comments  
- Responsive layout (works on mobile and desktop)  

---

## Technologies Used

- React  
- Redux Toolkit  
- JavaScript  
- CSS  

---

## How It Works

This app fetches data from the Reddit API and stores it in Redux state.

When the user selects a subreddit or searches:
- a request is sent to the API  
- data is stored in Redux  
- components re-render with updated posts  

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

<!-- this is basic deploy setup for netlify -->

---

## Notes

- If local build fails because of OpenSSL on newer Node, run:

```bash
$env:NODE_OPTIONS='--openssl-legacy-provider'
npm run build
```
