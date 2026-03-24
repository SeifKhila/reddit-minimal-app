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
    dispatch(setSelectedSubreddit(`/r/${selected}`));
  };

  const allowedSubreddits = ['popular', 'javascript', 'reactjs', 'webdev'];
  const selectedName = selectedSubreddit
    .replace(/^\/r\//, '')
    .replace(/\/$/, '');
  const dropdownValue = allowedSubreddits.includes(selectedName)
    ? selectedName
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
        <p>
          Reddit<span>Minimal</span>
        </p>
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
            <option value="javascript">javascript</option>
            <option value="reactjs">reactjs</option>
            <option value="webdev">webdev</option>
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
