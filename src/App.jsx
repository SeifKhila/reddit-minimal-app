import React from 'react';
import './App.css';
import Home from './features/Home/Home';
import Header from './features/Header/Header';
import Subreddits from './features/Subreddits/Subreddits';

function App() {
  return (
    <div className="app-shell">
      {/* top bar area */}
      <Header />
      <div className="app-container">
        {/* layout structure */}
        <div className="content-layout">
          <main>
            {/* render posts here */}
            <Home />
          </main>
          <aside>
            {/* sidebar section */}
            <Subreddits />
          </aside>
        </div>

        <footer className="app-footer">
          <div className="app-footer-inner">
            <div className="app-footer-title">
              RedditMinimal – React &amp; Redux Project
            </div>
            <div className="app-footer-sub">Built for portfolio demonstration</div>
            <div className="app-footer-year">© {new Date().getFullYear()}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
