import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Dog, Package } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'all' | 'breed' | 'product'>('all');
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string; type: 'breed' | 'product' }>>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const promises = [];

        if (searchType === 'all' || searchType === 'breed') {
          promises.push(
            supabase
              .from('dog_breeds')
              .select('id, name')
              .ilike('name', `%${query}%`)
              .limit(5)
          );
        }

        if (searchType === 'all' || searchType === 'product') {
          promises.push(
            supabase
              .from('products')
              .select('id, name')
              .ilike('name', `%${query}%`)
              .limit(5)
          );
        }

        const results = await Promise.all(promises);
        const combinedSuggestions = [];

        if (results[0]?.data) {
          combinedSuggestions.push(
            ...results[0].data.map(item => ({ ...item, type: 'breed' as const }))
          );
        }

        if (results[1]?.data) {
          combinedSuggestions.push(
            ...results[1].data.map(item => ({ ...item, type: 'product' as const }))
          );
        }

        setSuggestions(combinedSuggestions);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, searchType]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      const updatedSearches = [
        query,
        ...recentSearches.filter(s => s !== query)
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      navigate(`/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setQuery('');
    setSuggestions([]);
  };

  const handleSearchClick = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    if (suggestion.type === 'breed') {
      navigate(`/search?breed=${encodeURIComponent(suggestion.name)}`);
    } else {
      navigate(`/product/${suggestion.id}`);
    }
    handleClose();
  };

  return (
    <div className="relative z-50" ref={searchRef}>
      {/* Collapsed Search Bar */}
      {!isExpanded && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products or breeds..."
            onClick={handleSearchClick}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-800 focus:outline-none"
            readOnly
          />
        </div>
      )}

      {/* Expanded Search Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-800 p-4 shadow-lg">
            <div className="max-w-4xl mx-auto">
              {/* Search Header */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search</h2>
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products or breeds..."
                  className="w-full pl-12 pr-4 py-3 text-lg border rounded-lg dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Type Filters */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSearchType('all')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    searchType === 'all'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSearchType('breed')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                    searchType === 'breed'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Dog className="w-5 h-5 mr-2" />
                  Breeds
                </button>
                <button
                  onClick={() => setSearchType('product')}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                    searchType === 'product'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Package className="w-5 h-5 mr-2" />
                  Products
                </button>
              </div>

              {/* Results Container */}
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Suggestions
                    </h3>
                    <div className="space-y-1">
                      {suggestions.map((suggestion) => (
                        <button
                          key={`${suggestion.type}-${suggestion.id}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          {suggestion.type === 'breed' ? (
                            <Dog className="w-5 h-5 mr-3 text-gray-400" />
                          ) : (
                            <Package className="w-5 h-5 mr-3 text-gray-400" />
                          )}
                          <span className="text-gray-900 dark:text-white">{suggestion.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Recent Searches
                      </h3>
                      <button
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem('recentSearches');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search);
                            handleSubmit();
                          }}
                          className="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <Search className="w-5 h-5 mr-3 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;