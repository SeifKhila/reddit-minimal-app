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
      </div>
    </div>
  );
}

export default App;
