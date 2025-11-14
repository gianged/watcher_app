import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  return (
    <div className={`position-relative ${className}`}>
      <div className="search-box">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="btn btn-icon btn-sm position-absolute"
              style={{ right: '8px', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setQuery('')}
              type="button"
            >
              <FontAwesomeIcon icon={faTimes} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
