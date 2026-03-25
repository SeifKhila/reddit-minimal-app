import React, { useState, useEffect } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import './Header.css';
import { FaReddit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setSelectedSubreddit } from '../../store/redditSlice';

// this component renders top logo and search controls
const Header = () => {
  const [searchTermLocal, setSearchTermLocal] = useState('');
  const searchTerm = useSelector((state) => state.reddit.searchTerm);
  const selectedSubreddit = useSelector(
    (state) => state.reddit.selectedSubreddit
  );
  const dispatch = useDispatch();

  // dropdown to quickly switch subreddit
  // updates redux state
  // triggers new fetch
  const handleSubredditChange = (e) => {
    const selected = e.target.value;
    dispatch(setSelectedSubreddit(selected));
  };

  const allowedFeeds = [
    'popular',
    'history',
    'crime',
    'life',
    'love',
    'mystery',
    'nature',
    'books',
  ];
  const dropdownValue = allowedFeeds.includes(selectedSubreddit)
    ? selectedSubreddit
    : 'popular';

  const onSearchTermChange = (e) => {
    // handle search input here
    setSearchTermLocal(e.target.value);
  };

  useEffect(() => {
    setSearchTermLocal(searchTerm);
  }, [searchTerm]);

  const onSearchTermSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchTermLocal));
  };

  return (
    <header className="header">
      <div className="logo">
        <FaReddit className="logo-icon" />
        <div className="logo-text">
          <p className="logo-title">
            Reddit<span>Minimal</span>
          </p>
          <p className="logo-subtitle">
              Discover visual posts by category
          </p>
        </div>
      </div>
      {/* top search area styled to look cleaner and easier to use */}
      <div className="top-controls">
        {/* this handles the selected subreddit */}
        <div className="select-wrapper">
          <select
            className="subreddit-select"
            value={dropdownValue}
            onChange={handleSubredditChange}
            aria-label="Select subreddit"
          >
            <option value="popular">popular</option>
            <option value="history">history</option>
            <option value="crime">crime</option>
            <option value="life">life</option>
            <option value="love">love</option>
            <option value="mystery">mystery</option>
            <option value="nature">nature</option>
            <option value="books">books</option>
          </select>
        </div>
        {/* this handles searching posts by text */}
        <form className="search" onSubmit={onSearchTermSubmit}>
          <input
            type="text"
            placeholder="Search"
            value={searchTermLocal}
            onChange={onSearchTermChange}
            aria-label="Search posts"
          />
          <button
            type="submit"
            onClick={onSearchTermSubmit}
            aria-label="Search"
          >
            <HiOutlineSearch />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
