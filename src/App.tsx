import React, { useEffect, useRef, useState } from 'react'


const App: React.FC = () => {
  const [data, setData] = useState<Array<string>>([])
  const [query, setQuery] = useState<string>('')
  const [suggestions, setSuggestions] = useState<Array<string>>([])
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const fetchData = async (link: string) => {
    try {
      const response = await fetch(link, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  
  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    setSuggestions([]);
  };
  
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
    }
  };
  
  useEffect(() => {
    fetchData('https://api-eu.okotoki.com/coins');
  }, [])
  
  useEffect(() => {
    if (query) {
      const filteredSuggestions = data.filter((coin) => coin.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
    
  }, [query, data])
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div ref={containerRef} className='container'>
      <div className='input-wrapper'>
        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search for a coin...'
        />
        {query && (
          <button onClick={handleClear} className="clear-button">
            &times;
          </button>
        )}
      </div>
      {suggestions.length > 0 && (
        <ul className='suggestions'>
          {suggestions.map((suggestion, id) => (
            <li key={id}
                className='suggestion-item'
                onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
