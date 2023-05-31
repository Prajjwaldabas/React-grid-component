import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DataGrid.css'; // Import CSS file for styling

const DataGrid = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchWord, setSearchWord] = useState('');
  const [filterAttribute, setFilterAttribute] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setData(response.data);
      setFilteredData(response.data);
      setTotalPages(Math.ceil(response.data.length / 10));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) => value.toString().toLowerCase().includes(searchWord.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const handleFilter = () => {
    const filtered = data.filter((item) => {
      if (filterAttribute === "id") {
        return item.id.toString().toLowerCase().includes(filterValue.toLowerCase());
      }
      if (filterAttribute === "title") {
        return item.title.toLowerCase().includes(filterValue.toLowerCase());
      }
      if (filterAttribute === "body") {
        return item.body.toLowerCase().includes(filterValue.toLowerCase());
      }
      return true; // Return true for any other attribute or if no attribute is selected
    });
  
    setFilteredData(filtered);
  };
  

  const handleSort = (key) => {
    const sorted = [...filteredData].sort((a, b) => (a[key] > b[key] ? 1 : -1));
    setFilteredData(sorted);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageData = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredData.slice(startIndex, endIndex);
  };

  return (
    <div className="data-grid-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <select
          className="filter-select"
          value={filterAttribute}
          onChange={(e) => setFilterAttribute(e.target.value)}
        >
          <option value="">Select Attribute</option>
          <option value="id">ID</option>
  <option value="title">Title</option>
  <option value="body">Body</option>
         
        </select>
        <input
          type="text"
          placeholder="Filter value..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <button className="filter-button" onClick={handleFilter}>
          Filter
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('title')}>Title</th>
            <th onClick={() => handleSort('body')}>Body</th>
          </tr>
        </thead>
        <tbody>
          {getPageData().map((item) => (
            <tr key={item.id}>
              <td>{item.id} </td>
              <td>{item.title}</td>
              <td>{item.body}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`page-button ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataGrid;
