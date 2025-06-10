import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchCompact.css';

const SearchCompact = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/elasticsearch/suggestions?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions.slice(0, 5)); // Limit to 5 suggestions
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setIsExpanded(false);
      // Navigate to elasticsearch results page
      navigate('/elasticsearch-results', { 
        state: { 
          elasticsearchQuery: searchQuery.trim(),
          useElasticsearch: true 
        } 
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsExpanded(false);
    }
  };

  const handleSearchIconClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else if (query.trim()) {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`search-compact ${isExpanded ? 'expanded' : ''}`}>
      <div className="search-compact__container">
        <button 
          className="search-compact__icon"
          onClick={handleSearchIconClick}
          aria-label="Search"
        >
          <FaSearch />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Tìm tours..."
          className="search-compact__input"
        />
        
        {query && isExpanded && (
          <button 
            className="search-compact__clear"
            onClick={handleClear}
            aria-label="Clear"
          >
            <FaTimes />
          </button>
        )}
        
        {isLoading && (
          <div className="search-compact__loading">⏳</div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && isExpanded && (
        <div className="search-compact__suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="search-compact__suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <FaSearch className="search-compact__suggestion-icon" />
              <span className="search-compact__suggestion-text">
                {suggestion.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCompact; 