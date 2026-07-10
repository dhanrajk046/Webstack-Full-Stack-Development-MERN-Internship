import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Search = ({ onSearch }) => {
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");
  const navigate = useNavigate();

  const [prevUrlKeyword, setPrevUrlKeyword] = useState(urlKeyword);
  if (urlKeyword !== prevUrlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    setKeyword(urlKeyword || "");
  }



  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/eats/stores/search/${keyword.trim()}`);
    } else {
      navigate("/");
    }

    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={searchHandler} className="search-form w-100" role="search" aria-label="Search restaurants">
      <div className="input-group">
        <label htmlFor="search_field" className="visually-hidden">Search restaurants</label>
        <input
          type="search"
          id="search_field"
          className="form-control"
          placeholder="Search restaurants..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoComplete="off"
        />

        <button id="search_btn" className="btn btn-success" type="submit" aria-label="Submit search">
          <i className="fa fa-search" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  );
};

export default Search;
