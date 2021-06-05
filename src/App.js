import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import useBookSearch from './Hooks/useBookSearch';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const obse = useRef();
  const lastBookEle = useCallback(
    (lastEle) => {
      if (loading) return;
      if (obse.current) {
        obse.current.disconnect();
      }
      obse.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevNumber) => prevNumber + 1);
        }
      });
      if (lastEle) {
        obse.current.observe(lastEle);
      }
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div>
      <input type='text' value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookEle} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}

      <div>{loading && 'Loading......'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}

export default App;
